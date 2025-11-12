import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import PinScreen from './screens/PinScreen';
import MainTabs from './navigation/MainTabs';
import StudentDetailScreen from './screens/StudentDetailScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Pin" component={PinScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="StudentDetail" 
            component={StudentDetailScreen}
            options={{ 
              headerShown: true,
              headerStyle: { backgroundColor: '#16a34a' },
              headerTintColor: '#fff',
              title: 'Student Details'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);

