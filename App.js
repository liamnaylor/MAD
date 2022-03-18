import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import React, { Component } from 'react'
import { TabNav } from './TabNavigator'
import ProfileScreen from './screens/ProfileScreen'

const Stack = createNativeStackNavigator()
/* The app component is where all relevant screens are passed into to create the program flow

   The bottom tab navigation feature has been imported from the TabNavigator.js file and passed
   as a stack screen
*/
class App extends Component {
  render () {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRootName='LoginScreen'>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options = {{
              title: 'Login',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
          />

          <Stack.Screen
            name='RegisterScreen'
            component={RegisterScreen}
            options={{
              title: 'Register',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
          />
          <Stack.Screen
            name = 'Profile Picture Upload'
            component = {ProfileScreen}
            options = {{
              title: 'Picture Upload',
              headerStyle: {
                backgroundColor: 'beige'
              }
            }}
          />
          <Stack.Screen
            name='Spacebook'
            component={ TabNav }
            options = {{ headerShown: false }}
          />

        </Stack.Navigator>

      </NavigationContainer>

    )
  }
}

export default App
