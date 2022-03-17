import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfileScreenMenu from './screens/ProfileMenuScreen'
import PostScreen from './screens/PostScreen'
import FriendSearchScreen from './screens/FriendsSearchScreen'
import React from 'react'
import HomeScreen from './screens/HomeScreen'

const Tab = createBottomTabNavigator()

const TabNav = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen
            name = 'Home'
            component = {HomeScreen}
        />
        <Tab.Screen
            name='Search'
            component={FriendSearchScreen}
          />
        <Tab.Screen
            name='Your Details'
            component={ProfileScreenMenu}
        />

        <Tab.Screen
            name='Post'
            component={PostScreen}
        />
    </Tab.Navigator>
  )
}
export { TabNav }
