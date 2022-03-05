import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FriendSearchScreen from './screens/FriendsSearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostScreen from './screens/PostScreen';
import ProfileScreenMenu from './screens/ProfileMenuScreen'

import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRootName="LoginScreen">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{title: 'Register'}}
          />

          <Stack.Screen
            name = "Home"
            component={HomeScreen}
            options={{title: 'Home'}}
          />  

          <Stack.Screen
            name = "Search"
            component={FriendSearchScreen}
            options={{title: 'Friend Search'}}
          />
          <Stack.Screen
            name = "Profile"
            component={ProfileScreen}
            options={{title: 'Profile'}}
          />
          <Stack.Screen
            name="Your Details"
            component={ProfileScreenMenu}
            options={{title:'Profile Menu'}}
          />

          <Stack.Screen
            name = "Post"
            component={PostScreen}
            options={{title: 'Post'}}
          />
          
         

      </Stack.Navigator>
      

    </NavigationContainer>
    );
  }
}

export default App;