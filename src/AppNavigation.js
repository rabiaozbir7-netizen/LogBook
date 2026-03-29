import React from 'react';
import { useColorScheme, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, BarChart2, LogOut, Archive } from 'lucide-react-native';

import HomeScreen from './screens/HomeScreen';
import ModuleScreen from './screens/ModuleScreen';
import StatsScreen from './screens/StatsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RecordsScreen from './screens/RecordsScreen';
import Colors from './theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text, fontWeight: 'bold' },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        // v6 uyumlu stil ayarı
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Akıllı Günlük',
          tabBarLabel: 'Ev',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={{ marginRight: 15 }}>
              <LogOut size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          title: 'İstatistikler',
          tabBarLabel: 'Gelişim',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="RecordsTab"
        component={RecordsScreen}
        options={{
          title: 'Kayıtlarım',
          tabBarLabel: 'Kayıtlar',
          tabBarIcon: ({ color, size }) => <Archive size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const colorScheme = useColorScheme() || 'light';

  // Tema yapısını v6 uyumlu hale getirdik
  const customTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: Colors[colorScheme].background,
      card: Colors[colorScheme].card,
      text: Colors[colorScheme].text,
      border: Colors[colorScheme].border,
      primary: Colors[colorScheme].primary,
    },
  };

  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ModuleDetail"
          component={ModuleScreen}
          options={({ route }) => ({
            title: route.params?.title || 'Modül',
            headerStyle: { backgroundColor: Colors[colorScheme].background },
            headerTintColor: Colors[colorScheme].text,
            headerTitleStyle: { fontWeight: 'bold' },
            headerShadowVisible: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}