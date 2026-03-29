import { Platform, useColorScheme } from 'react-native';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#f2f2f7',
    card: '#ffffff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    border: '#d1d1d6',
    primary: '#007AFF',
    success: '#34C759',
  },
  dark: {
    text: '#fff',
    background: '#000',
    card: '#1c1c1e',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    border: '#38383a',
    primary: '#0A84FF',
    success: '#30D158',
  },
};
