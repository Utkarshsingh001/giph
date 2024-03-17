import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import HomeScreen from './home-screen';
import {GiphySDK} from '@giphy/react-native-sdk';
import {apiKey} from '../../../config/config';
import Toast from 'react-native-toast-message';
import _, {debounce, throttle} from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

const HomeContainer = () => {
  GiphySDK.configure({apiKey: apiKey});

  const mediaRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [media, setMedia] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Handling GIFs selection in GiphyDialog
  const {show} = Toast;
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const downloadImage = async () => {
    const {dirs} = RNFetchBlob.fs;
    const downloadDir =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const timestamp = new Date().getTime(); // Get current timestamp
    const filename = `image_${timestamp}.gif`; // Unique filename with timestamp

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

  const handleChangeText = text => {
    delayedSetSearchQuery(text); // Invoke debounced function
  };

  const delayedSetSearchQuery = debounce(query => {
    setSearchQuery(query);
    console.log('Search query:', query);
  }, 2000); // Debounce time: 2000 milliseconds

  const throttledDownloadImage = throttle(downloadImage, 3000, {
    trailing: false,
  }); // Throttle time: 3000 milliseconds

  const shareGifWithDownload = async () => {
    try {
      // Download the image
      const downloadedFilePath = await downloadImage();
      if (downloadedFilePath) {
        console.log('Downloaded file path:', downloadedFilePath); // Log the downloaded file path
        // If download successful, share the downloaded image
        shareGifOnWhatsApp(downloadedFilePath);
      } else {
        // Handle download failure
        console.error('Download failed');
        show({
          type: 'error',
          text1: 'Download failed',
        });
      }
    } catch (error) {
      // Handle any errors that occur during the download process
      console.error('Error downloading image:', error);
      show({
        type: 'error',
        text1: 'Download failed',
      });
    }
  };

  const shareGifOnWhatsApp = async filePath => {
    console.log('Sharing image from file path:', filePath); // Log the file path being shared
    const gifUrl = `file://${filePath}`;

    try {
      const shareOptions = {
        title: 'Share via',
        message: 'Check out this GIF!',
        url: gifUrl,
        social: Share.Social.WHATSAPP,
      };
      await Share.open(shareOptions);
    } catch (error) {
      if (error.message === 'Share canceled') {
        // Handle share canceled error by showing a toast
        show({
          type: 'info',
          text1: 'Share canceled',
        });
      } else {
        // console.error('Error sharing GIF:', error);
        show({
          type: 'error',
          text1: 'Share canceled',
        });
      }
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      mediaRef.current?.pause();
    } else {
      mediaRef.current?.resume();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <HomeScreen
      isEnabled={isEnabled}
      toggleSwitch={toggleSwitch}
      media={media}
      setMedia={setMedia}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      show={show}
      delayedSetSearchQuery={delayedSetSearchQuery}
      throttledDownloadImage={throttledDownloadImage}
      handleChangeText={handleChangeText}
      shareGifWithDownload={shareGifWithDownload}
      shareGifOnWhatsApp={shareGifOnWhatsApp}
      mediaRef={mediaRef}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      togglePlayPause={togglePlayPause}
    />
  );
};

export default HomeContainer;
