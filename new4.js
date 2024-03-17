import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, ScrollView, View } from 'react-native';
import {
  GiphyDialog,
  GiphyDialogEvent,
  GiphyDialogMediaSelectEventHandler,
  GiphyMediaView,
  GiphySDK,
} from '@giphy/react-native-sdk';

// Configure API keys
GiphySDK.configure({ apiKey: '***************' });

export default function App() {
  const mediaRef = useRef(null);
  const [media, setMedia] = useState(null);

  // Handling GIFs selection in GiphyDialog
  useEffect(() => {
    const handler = (e) => {
      setMedia(e.media);
      GiphyDialog.hide();
    };
    const listener = GiphyDialog.addListener(
      GiphyDialogEvent.MediaSelected,
      handler
    );
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SafeAreaView>
      <Button title="Show Giphy Dialog" onPress={() => GiphyDialog.show()} />
      {media && (
        <>
          <View style={{ marginVertical: 4 }}>
            <Button title="Pause" onPress={() => mediaRef.current?.pause()} />
          </View>
          <Button title="Resume" onPress={() => mediaRef.current?.resume()} />
          <ScrollView
            style={{
              aspectRatio: media.aspectRatio,
              maxHeight: 400,
              padding: 24,
              width: '100%',
            }}
          >
            <GiphyMediaView
              ref={mediaRef}
              media={media}
              style={{ aspectRatio: media.aspectRatio }}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
