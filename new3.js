import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {
  GiphyContent,
  GiphyGridView,
  GiphySDK,
  GiphyThemePreset,
  GiphyMediaType,
} from '@giphy/react-native-sdk';
import Toast, { BaseToast } from 'react-native-toast-message'; // Import Toast and BaseToast
import _, { debounce, throttle } from 'lodash';

const App = () => {
  const { show } = Toast;

  const downloadImage = async () => {
    const { dirs } = RNFetchBlob.fs;
    const downloadDir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const filename = 'image.gif';

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
      return response.path(); // Return the downloaded file path
    } catch (error) {
      show({
        type: 'error',
        text1: 'Download failed',
      });

      console.error('Error downloading image:', error);
      return null;
    }
  };

  const [media, setMedia] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const delayedSetSearchQuery = debounce(query => {
    setSearchQuery(query);
    console.log('Search query:', query);
  }, 2000); // Debounce time: 2000 milliseconds

  const throttledDownloadImage = throttle(downloadImage, 3000, { trailing: false }); // Throttle time: 3000 milliseconds

  const handleChangeText = text => {
    delayedSetSearchQuery(text); // Invoke debounced function
  };

  const shareGifWithDownload = async () => {
    const downloadedFilePath = await throttledDownloadImage(); // Download the GIF
    if (downloadedFilePath) {
      // If download successful, share the GIF
      shareGifOnWhatsApp(downloadedFilePath);
    } else {
      // Handle download failure
      console.error('Download failed');
      // You can show a toast or an alert to notify the user about the download failure
    }
  };

  const shareGifOnWhatsApp = async (filePath) => {
    const gifUrl = `file://${filePath}`; // Use the downloaded file path
  
    try {
      const shareOptions = {
        title: 'Share via',
        message: 'Check out this GIF!',
        url: gifUrl,
        social: Share.Social.WHATSAPP,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing GIF:', error);
    }
  };

  GiphySDK.configure({ apiKey: 'fuA1ylEapzvikxECKKqaJzFMens2wssR' });

  return (
    <SafeAreaView style={{ backgroundColor: 'gray', flex: 1 }}>
      <TextInput onChangeText={handleChangeText} style={{ borderWidth: 1 }} />
      <GiphyGridView
        spanCount={3}
        theme={GiphyThemePreset.Dark}
        content={
          searchQuery
            ? GiphyContent.search({
                searchQuery: searchQuery,
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
      <View style={{ alignItems: 'center' }}>
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
                source={{ uri: `${media.url} ` }}
                autoPlay={true}
                style={{
                  aspectRatio: media.aspectRatio,
                  alignItems: 'center',
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            ) : null}
            <Button title="Share Image" onPress={shareGifWithDownload} />
            <Button title="Download Image" onPress={throttledDownloadImage} />
          </ScrollView>
        )}
      </View>
      <Toast style={{ zIndex: 999 }} ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
