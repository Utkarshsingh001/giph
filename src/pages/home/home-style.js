import {StyleSheet} from 'react-native';
import {widthPercentageToDP, heightPercentageToDP} from '../../../utils';

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: widthPercentageToDP(3),
    justifyContent: 'space-between',
  },
  displayContainer: {
    flex: 1,
  },
  containerInside: {
    alignItems: 'center',
  },
  scroll: {
    borderRadius: 8,
    paddingHorizontal: widthPercentageToDP(4),
    width: '100%',
  },
  mediaView: {
    marginBottom: heightPercentageToDP(15),
  },
  buttonContainer: {
    marginBottom: heightPercentageToDP(8),
    position: 'absolute',
  },
  frameO: {
    height: heightPercentageToDP(45),
    marginTop: heightPercentageToDP(1),
    backgroundColorForLoadingCells: 'red',
  },
  tost: {
    position: 'absolute',
    zIndex: 999,
  },
});

export default styles;
