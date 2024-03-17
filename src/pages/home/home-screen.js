import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  Platform,
  Text,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';

import styles from './home-style';

import {
  GiphyContent,
  GiphyGridView,
  GiphyMediaType,
  GiphyThemePreset,
  GiphyMediaView,
  GiphyDialog,
  GiphyDialogEvent,
} from '@giphy/react-native-sdk';
import Toast from 'react-native-toast-message';
import Header from '../../atoms/header/header';
import {heightPercentageToDP, widthPercentageToDP} from '../../../utils';
import CustomInput from '../../atoms/textInput/customInput';
import CustomButton from '../../atoms/button/customButton';
import {Button} from 'react-native-share';

const HomeScreen = ({
  shareGifWithDownload,
  handleChangeText,
  isEnabled,
  toggleSwitch,
  media,
  setMedia,
  searchQuery,
  throttledDownloadImage,
  isPlaying,
  setIsPlaying,
  mediaRef,
}) => {
  useEffect(() => {
    const handler = e => {
      setMedia(e.media);
      setIsPlaying(true); // Assuming when media is selected, it starts playing
      GiphyDialog.hide();
    };
    const listener = GiphyDialog.addListener(
      GiphyDialogEvent.MediaSelected,
      handler,
    );
    return () => {
      listener.remove();
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      mediaRef.current?.pause();
    } else {
      mediaRef.current?.resume();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={{backgroundColor: isEnabled ? 'white' : 'gray', flex: 1}}>
      <View style={styles.headerContainer}>
        <Header isEnabled={isEnabled} title={'Giphy Beta App'} />
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      {/* Displaye Part */}
      <View style={styles.displayContainer}>
        <View style={styles.containerInside}>
          {media && (
            <ScrollView
              onAccessibilityTap={true}
              style={[
                {
                  aspectRatio: media.aspectRatio,
                },
                styles.scroll,
              ]}>
              {media.url ? (
                <View style={styles.mediaView}>
                  <GiphyMediaView
                    ref={mediaRef}
                    media={media}
                    style={[
                      {aspectRatio: media.aspectRatio},
                      {margiBottom: heightPercentageToDP(2)},
                    ]}
                  />
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title={'Share'}
                      onPress={shareGifWithDownload}
                    />
                    <CustomButton
                      title={'Download'}
                      onPress={throttledDownloadImage}
                    />
                    <CustomButton
                      title={isPlaying ? 'Pause' : 'Play'}
                      onPress={togglePlayPause}
                    />
                  </View>
                </View>
              ) : (
                <Text>Gif Restricted</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
      {/* End Displaye Part */}
      <Toast style={styles.tost} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
        style={{
          justifyContent: 'flex-end',
          paddingHorizontal: widthPercentageToDP(0.6),
          backgroundColor: isEnabled ? 'white' : 'gray',
          paddingTop: heightPercentageToDP(2),
        }}>
        <View>
          <CustomInput onChangeText={handleChangeText} isEnabled={isEnabled} />

          <GiphyGridView
            spanCount={3}
            theme={GiphyThemePreset.Dark}
            content={
              searchQuery
                ? GiphyContent.search({
                    searchQuery: searchQuery,
                    mediaType: GiphyMediaType.Gif,
                  })
                : GiphyContent.trendingGifs()
            }
            cellPadding={3}
            style={styles.frameO}
            onMediaSelect={e => setMedia(e.nativeEvent.media)}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HomeScreen;
