import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import HomeScreen from '../screens/HomeScreen';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);


const AppNavigation = () => {
  return ( 
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Home' options={{headerShown: false, tabBarStyle: {display:"none"}}} component={HomeScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
   );
}
 
export default AppNavigation;