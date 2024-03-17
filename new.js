import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Switch,
  Text,
  ScrollView,Button, TextInput
} from 'react-native';
import {
  GiphyContent,
  GiphyGridView,
  GiphyMedia,
  GiphyMediaType,
  GiphySDK,
  GiphyVideoView,
  GiphyThemePreset,
  GiphyContentType
} from '@giphy/react-native-sdk';
import _ from 'lodash';


const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [media, setMedia] = useState('');
  const [searchQuerry,setSearchQuerry] =useState('')
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isPlaying, setIsPlaying] = useState(false); // State to track the playback status

  const handleChangeText = (text) => {
    clearTimeout(); // Clear the previous timeout if exists

    setTimeout(() => {
      setSearchQuerry(text); // Set search query after the delay
    }, 400); // Adjust the delay time as needed (in milliseconds)

    // setTimeoutId(id); // Save the new timeout id
  };

  media?console.log(media):null

  // const api_key = 'fuA1ylEapzvikxECKKqaJzFMens2wssR';
  const togglePlayback = () => {
    setIsPlaying(!isPlaying); // Toggle the playback status
  };
  GiphySDK.configure({apiKey:'fuA1ylEapzvikxECKKqaJzFMens2wssR'})

  return (
    <SafeAreaView>
      {/* // style={{flex: 1, backgroundColor: isEnabled ? 'white' : 'black'}}> */}
      {/* <View style={styles.container}> */}
        {/* <Text style={{fontSize: 40, color: isEnabled ? 'black' : 'white'}}>
          Giphy App
        </Text> */}
          <TextInput onChangeText={handleChangeText} style={{borderWidth:1}}/>
        <GiphyGridView
        spanCount={3}
            theme={GiphyThemePreset.Dark}
          content={searchQuerry?GiphyContent.search({
            searchQuery  : searchQuerry,
            mediaType: GiphyMediaType.Video,
          }):GiphyContent.trendingGifs()}
          cellPadding={3}
          style={{height: 300, marginTop: 24,backgroundColorForLoadingCells:'red'}}
          onMediaSelect={e => setMedia(e.nativeEvent.media)}
        />

        {media && (
          <ScrollView onAccessibilityTap={true}
            style={{
              aspectRatio: media.aspectRatio,
              maxHeight: 400,
              padding: 24,
              width: '100%',
            }}>
            <GiphyVideoView
            
            media={media}
            autoPlay={true}
            style={{ aspectRatio: media.aspectRatio }}
          />
          </ScrollView>
        )}
        <Button
        title={isPlaying ? 'Pause' : 'Play'}
        onPress={togglePlayback} // Toggle the playback status when the button is pressed
      />

        {/* <Image
          source={{
            uri: 'https://media.tenor.com/images/1c39f2d94b02d8c9366de265d0fba8a0/tenor.gif',
          }}
          style={styles.backgroundImage}
        /> */}
        {/* <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        /> */}
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: 300,
    height: 300,
  },
});

export default App;





import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Switch,
  Text,
  ScrollView,
  Button,
  TextInput,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import VideoPlayer from 'react-native-video-controls';
// import ControlledGifView from 'react-native-controlled-gif';
import Share from 'react-native-share';
import {
  GiphyContent,
  GiphyGridView,
  GiphyMedia,
  GiphyMediaType,
  GiphySDK,
  GiphyVideoView,
  GiphyThemePreset,
  GiphyContentType,
} from '@giphy/react-native-sdk';
import _ from 'lodash';
let timerId = null;

const App = () => {

  const downloadImage = async () => {
    const { dirs } = RNFetchBlob.fs;
    const downloadDir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const filename = 'image.gif'; // You can change the filename as needed
  
    try {
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
  
      console.log('Downloaded successfully:', response.path());
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };


  const [isEnabled, setIsEnabled] = useState(false);
  const [media, setMedia] = useState('');
  const [searchQuerry, setSearchQuery] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isPlaying, setIsPlaying] = useState(false); // State to track the playback status
  const [c, setC] = useState(0);

  const delayedSetSearchQuery = _.debounce(query => {
    setSearchQuery(query);
    console.log('Search query:', query);
  }, 2000); // Adjust the debounce time as needed (in milliseconds)

  const shareGifOnWhatsApp = async () => {
    const gifUrl = `${media.url} `; // Replace with the URL of your GIF
  
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

  // Handler for text input change
  const handleChangeText = text => {
    clearTimeout(timerId); // Clear previous timeout
    timerId = setTimeout(() => {
      delayedSetSearchQuery(text); // Invoke debounced function after 2 seconds of inactivity
    }, 300); // Adjust the delay time as needed (in milliseconds)
  };

  // media ? console.log('Full log new',media.url) : null;

  // const api_key = 'fuA1ylEapzvikxECKKqaJzFMens2wssR';

  GiphySDK.configure({apiKey: 'fuA1ylEapzvikxECKKqaJzFMens2wssR'});

  return (
    <SafeAreaView style={{backgroundColor: 'gray', flex: 1}}>
      {/* // style={{flex: 1, backgroundColor: isEnabled ? 'white' : 'black'}}> */}
      {/* <View style={styles.container}> */}
      {/* <Text style={{fontSize: 40, color: isEnabled ? 'black' : 'white'}}>
          Giphy App
        </Text> */}
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
            {/* <VideoPlayer
  source={{uri:`${media.url} `}}
  // navigator={this.props.navigator}
/> */}
            <View style={{marginBottom:100}}>
              {/* <ControlledGifView
    style={{width:200,height:166,backgroundColor:"yellow"}}
    url={`${media.url} `}
    isPlaying={true}
    onReady={(width,height)=>this.onReady(width,height)}
    onError={(code,message)=>this.onError(code,message)}/> */}
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
            <Button title="Share Image" onPress={shareGifOnWhatsApp} />
            <Button title="Download Image" onPress={downloadImage} />
            </View>
          </ScrollView>
        )}
      </View>


      {/* <Image
          source={{
            uri: 'https://media.tenor.com/images/1c39f2d94b02d8c9366de265d0fba8a0/tenor.gif',
          }}
          style={styles.backgroundImage}
        /> */}
      {/* <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        /> */}
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: 300,
    height: 300,
  },
});

export default App;


