/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { Component } from 'react'
import { View, Text, ScrollView, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

    signIn = async () => {
      return fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })

        .then((response) => {
          if (response.status === 200) {
            return response.json()
          }
          if (response.status === 400) {
            alert('Wrong Details entered, please try again')
          }
        })
        .then(async (responseJson) => {
          console.log(responseJson)
          await AsyncStorage.setItem('@session_token', responseJson.token)
          await AsyncStorage.setItem('@user_id', responseJson.id)
          this.props.navigation.navigate('Home')
        })
        .catch((error) => {
          console.log(error)
        })
    }

    render () {
      return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Spacebook Login</Text>
                    <View>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="E-Mail Address"
                            onChangeText={(email) => this.setState({ email })}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Password"
                            onChangeText={(password) => this.setState({ password })}
                            secureTextEntry={true}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.loginBtn}
                            title="Login"
                            onPress={() => this.signIn()}
                        >
                        <Text>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.loginBtn}
                            title="Register"
                            onPress={() => this.props.navigation.navigate('RegisterScreen')}
                        >
                        <Text>Register</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9CDCD',
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    marginBottom: 40
  },

  inputView: {
    backgroundColor: '#AFEEEE',
    borderRadius: 30,
    width: 70,
    height: 45,
    marginBottom: 20,

    alignItems: 'center'
  },

  TextInput: {
    borderColor: 'black',
    width: 275,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    marginBottom: 5,
    backgroundColor: '#DCDCDC'
  },

  loginBtn: {
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#DDDCA1',
    flexDirection: 'row',
    marginHorizontal: 20,
    borderWidth: 1
  },

  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Sans-Serif'

  }
})

export default LoginScreen

// Login for Jon turner: Turner@Jon.com, 12345Jon
// Login for Liam Naylor: 19074380@stu.mmu.ac.uk, hello12345
// df
