import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Button,
  TextInput,
  Platform,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Toast, {BaseToast} from 'react-native-toast-message'; // Import Toast and BaseToast
import _ from 'lodash';
import {
  GiphyContent,
  GiphyGridView,
  GiphyMediaType,
  GiphySDK,
  GiphyThemePreset,
} from '@giphy/react-native-sdk';

let timerId = null;

const App = () => {
  const { show } = Toast;

  const downloadImage = async () => {
    const { dirs } = RNFetchBlob.fs;
    const downloadDir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const filename = 'image.gif'; // You can change the filename as needed

    try {
      show({
        type: 'info',
        text1: 'Download started...',
      });

      const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: filename,
          path: `${downloadDir}/${filename}`,
        },
      }).fetch('GET', `${media.url} `);

      show({
        type: 'success',
        text1: 'Download complete',
      });

      console.log('Downloaded successfully:', response.path());
    } catch (error) {
      show({
        type: 'error',
        text1: 'Download failed',
      });
      console.error('Error downloading image:', error);
    }
  };

  const [media, setMedia] = useState('');
  const [searchQuerry, setSearchQuery] = useState('');

  const delayedSetSearchQuery = _.debounce(query => {
    setSearchQuery(query);
    console.log('Search query:', query);
  }, 2000); // Adjust the debounce time as needed (in milliseconds)

  const handleChangeText = text => {
    clearTimeout(timerId); // Clear previous timeout
    timerId = setTimeout(() => {
      delayedSetSearchQuery(text); // Invoke debounced function after 2 seconds of inactivity
    }, 300); // Adjust the delay time as needed (in milliseconds)
  };

  GiphySDK.configure({apiKey: 'fuA1ylEapzvikxECKKqaJzFMens2wssR'});

  return (
    <SafeAreaView style={{backgroundColor: 'gray', flex: 1}}>
      <TextInput onChangeText={handleChangeText} style={{borderWidth: 1}} />
      <GiphyGridView
        spanCount={3}
        theme={GiphyThemePreset.Dark}
        content={
          searchQuerry
            ? GiphyContent.search({
                searchQuery: searchQuerry,
                mediaType: GiphyMediaType.Video,
              })
            : GiphyContent.trendingGifs()
        }
        cellPadding={3}
        style={{
          height: 300,
          marginTop: 24,
          backgroundColorForLoadingCells: 'red',
        }}
        onMediaSelect={e => setMedia(e.nativeEvent.media)}
      />
      <View style={{alignItems: 'center'}}>
        {media && (
          <ScrollView
            onAccessibilityTap={true}
            style={{
              aspectRatio: media.aspectRatio,
              maxHeight: 600,
              borderRadius: 8,
              padding: 24,
              width: '100%',
            }}>
            {media.url ? (
              <Image
                source={{uri: `${media.url} `}}
                muted
                media={media}
                autoPlay={true}
                style={{
                  aspectRatio: media.aspectRatio,
                  alignItems: 'center',
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            ) : null}
            <Button title="Download Image" onPress={downloadImage} />
          </ScrollView>
        )}
      </View>
      <Toast style={{ zIndex: 999 }} ref={(ref) => Toast.setRef(ref)} /> {/* Include Toast component at the end */}
    </SafeAreaView>
  );
};

export default App;

