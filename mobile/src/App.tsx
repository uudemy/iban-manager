import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

// Screens
import HomeScreen from './screens/HomeScreen';
import AddIBANScreen from './screens/AddIBANScreen';
import EditIBANScreen from './screens/EditIBANScreen';
import SettingsScreen from './screens/SettingsScreen';

// Context
import {IBANProvider} from './context/IBANContext';

// Colors
const Colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{title: 'IBAN\'larım'}} 
      />
      <Stack.Screen 
        name="EditIBAN" 
        component={EditIBANScreen} 
        options={{title: 'IBAN Düzenle'}} 
      />
    </Stack.Navigator>
  );
}

function AddStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="AddMain" 
        component={AddIBANScreen} 
        options={{title: 'IBAN Ekle'}} 
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen} 
        options={{title: 'Ayarlar'}} 
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 90 : 60,
        },
        headerShown: false,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{tabBarLabel: 'Ana Sayfa'}} 
      />
      <Tab.Screen 
        name="Add" 
        component={AddStack} 
        options={{tabBarLabel: 'Ekle'}} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack} 
        options={{tabBarLabel: 'Ayarlar'}} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <IBANProvider>
      <NavigationContainer>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={Colors.primary} 
        />
        <TabNavigator />
        <Toast />
      </NavigationContainer>
    </IBANProvider>
  );
}
