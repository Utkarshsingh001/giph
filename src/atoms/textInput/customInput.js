import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import {heightPercentageToDP, widthPercentageToDP} from '../../../utils';
import {isEnabled} from 'react-native/Libraries/Performance/Systrace';

const CustomInput = ({onChangeText, isEnabled}) => {
  return (
    <View style={stylesIn.container}>
      <TextInput
        onChangeText={onChangeText}
        placeholder="Search Giphy"
        style={[
          stylesIn.input,
          {color: isEnabled ? 'black' : 'white'},
        ]}></TextInput>
      <Text>🔍</Text>
    </View>
  );
};

export default CustomInput;

const stylesIn = StyleSheet.create({
  container: {
    borderWidth: heightPercentageToDP(0.1),
    borderRadius: 8,
    height: heightPercentageToDP(6),
    paddingHorizontal: widthPercentageToDP(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: heightPercentageToDP(2.5),
    paddingVertical: 8,
    width: widthPercentageToDP(90),
  },
});
