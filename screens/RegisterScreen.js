/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Component } from 'react'
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'

// Register screen registers user account through a post request to the api as seen in the 'reg' function
class RegisterScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }
  /*
  Reg creates an account based on what input the user has entered into the system and will create an account based on this.

  The text inputs in the render function are saved as state and is then converted into JSON format through use of stringify
  */

    reg= () => {
      return fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then((response) => {
          if (response.status === 201) {
            alert('You have successfully created an account')
            return response.json()
          } else if (response.status === 400) {
            throw 'Failed to create account'
          } else {
            throw 'Something went wrong'
          }
        })
        .then((responseJson) => {
          console.log('User created with ID: ', responseJson)
          this.props.navigation.navigate('Login')
        })
        .catch((error) => {
          console.log(error)
        })
    }

    render () {
      return (
      // Various text inputs have been established in the program as seen below
      // to correctly register the users' details including first name, last name,
      // email address and password

            <SafeAreaView style = {styles.container}>
                <ScrollView>
                    <View>
                        <Text style = {styles.title}>Create An Account</Text>
                    </View>
                    <View>
                        <TextInput
                            style = {styles.textIn}
                            placeholder = "Enter your First Name here"
                            onChangeText = {(first_name) => this.setState({ first_name })}
                        />
                    </View>
                    <View>
                        <TextInput
                            style = {styles.textIn}
                            placeholder = "Enter your Last Name here"
                            onChangeText = {(last_name) => this.setState({ last_name })}
                        />
                    </View>
                    <View>
                        <TextInput
                            style = {styles.textIn}
                            placeholder = "Enter your Email Address here"
                            onChangeText = {(email) => this.setState({ email })}
                        />
                    </View>
                    <View>
                        <TextInput
                            style = {styles.textIn}
                            placeholder = "Enter your Password here"
                            onChangeText = {(password) => this.setState({ password })}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.createButton}
                            title="Register"
                            onPress={() => this.reg()}

                        >
                            <Text>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'helvetica',
    marginBottom: 60

  },
  createButton: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 25,
    backgroundColor: '#DDDCA1',
    borderWidth: 1

  },
  textIn: {
    borderColor: 'black',
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#DCDCDC'
  },
  container: {
    flex: 1,
    backgroundColor: '#E9CDCD',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default RegisterScreen
