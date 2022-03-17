import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import React, { Component } from 'react'
import { TabNav } from './TabNavigator'

const Stack = createNativeStackNavigator()

class App extends Component {
  render () {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRootName='LoginScreen'>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
          />

          <Stack.Screen
            name='RegisterScreen'
            component={RegisterScreen}
            options={{ title: 'Register' }}
          />
          <Stack.Screen
            name='Home'
            component={ TabNav }
          />

        </Stack.Navigator>

      </NavigationContainer>

    )
  }
}

export default App

// sdf
