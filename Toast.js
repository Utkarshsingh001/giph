import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Toast = forwardRef(({ visible, message }, ref) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }
      ).start(() => {
        setTimeout(() => {
          hideToast();
        }, 2000); // Adjust duration as needed
      });
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }
    ).start();
  };

  return (
    <Animated.View ref={ref} style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    position: 'absolute',
    bottom: 50, // Adjust position as needed
    left: 20, // Adjust position as needed
    right: 20, // Adjust position as needed
    zIndex: 999,
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
});

export default Toast;
