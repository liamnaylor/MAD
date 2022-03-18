import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileScreenMenu from './screens/ProfileMenuScreen'
import PostScreen from './screens/PostScreen'
import FriendSearchScreen from './screens/FriendsSearchScreen'
import HomeScreen from './screens/HomeScreen'

import Ionicons from 'react-native-vector-icons/Ionicons'

import React from 'react'

const Tab = createBottomTabNavigator()

/* This function is used to create the tab navigation system to cycle between the implemented pages.
   It works by passing the relevant components and sorting them into separate screens similar to the
   stack navigator. The function also contains all styling methods for the navigator.

   Ionicons have been used here to define the appearance of the various tabs.
*/

const TabNav = () => {
  return (
    <Tab.Navigator
        screenOptions={ ({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline'
            } else if (route.name === 'Your Details') {
              iconName = focused
                ? 'person-circle'
                : 'person-circle-outline'
            } else if (route.name === 'Search') {
              iconName = focused
                ? 'search-circle'
                : 'search-circle-outline'
            } else if (route.name === 'Post') {
              iconName = focused
                ? 'send'
                : 'send-outline'
            }
            return <Ionicons name = {iconName} size = {size} color = {color}/>
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveBackgroundColor: 'beige'
        })}
    >
        <Tab.Screen
            name = 'Home'
            component = {HomeScreen}
            options = {{
              title: 'Home',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
        />
        <Tab.Screen
            name='Search'
            component={FriendSearchScreen}
            options = {{
              title: 'Search',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
          />
        <Tab.Screen
            name='Your Details'
            component={ProfileScreenMenu}
            options = {{
              title: 'Profile',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
        />

        <Tab.Screen
            name='Post'
            component={PostScreen}
            options = {{
              title: 'Post',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
        />
    </Tab.Navigator>
  )
}
export { TabNav }
