import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {heightPercentageToDP, widthPercentageToDP} from '../../../utils';

const CustomButton = ({title, onPress}) => {
  return (
    <TouchableOpacity
      style={stylesIn.container}
      onPress={onPress}>
      <Text
        style={stylesIn.textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const stylesIn = StyleSheet.create({
container:{
  backgroundColor: '#448EF2',
  paddingHorizontal: widthPercentageToDP(2),
  paddingVertical: heightPercentageToDP(1),
  borderRadius: 2,
  alignItems: 'center',
},
textStyle:{
  color: 'white',
  fontWeight: 'bold',
  fontSize: heightPercentageToDP(2),
}
})