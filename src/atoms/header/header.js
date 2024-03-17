import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {heightPercentageToDP} from '../../../utils';

const Header = ({styles, title, isEnabled}) => {
  return (
    <Text
      style={[styles, stylesIn.head, {color: isEnabled ? 'black' : 'white'}]}>
      {title}
    </Text>
  );
};

export default Header;

const stylesIn = StyleSheet.create({
  head: {
    fontSize: heightPercentageToDP(3),
    fontWeight: 'semibold',
    paddingVertical: heightPercentageToDP(2),
  },
});
