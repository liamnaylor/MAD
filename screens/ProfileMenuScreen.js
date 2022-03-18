/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, ScrollView, TextInput, Image, SafeAreaView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

/*
This screen has been used to complete all functions regarding profile management

All functions on this screen have been completed using Async Storage that was set during the login process and allows the
user to view their details, update their details, view profile picture and capture a new profile picture.
*/

class ProfileScreenMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      userDetails: [],
      photo: null
    }
  }

    logout = async () => {
      const token = await AsyncStorage.getItem('@session_token')
      await AsyncStorage.removeItem('@session_token')
      return fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          'X-Authorization': token
        }
      })
        .then((response) => {
          if (response.status === 200) {
            this.props.navigation.navigate('Login')
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login')
          } else {
            throw 'Something went wrong'
          }
        })
        .catch((error) => {
          console.log(error)
          ToastAndroid.show(error, ToastAndroid.SHORT)
        })
    }

    checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token')
      if (value !== null) {
        this.setState({ token: value })
      } else {
        this.props.navigation.navigate('Login')
      }
    }

    componentDidMount () {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn()
      })
      this.retrievePhoto()
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    retrieveUserDetails=async () => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id, {
        method: 'GET',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            userDetails: responseJson
          })
          alert('Your Details are: ' + JSON.stringify(responseJson))
          console.log(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    updateUserDetails=async () => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      const toUpdate = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password
      }
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id, {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toUpdate)
      })
        .then((response) => {
          console.log('Your Details have been updated.', response)
          alert('Your Details have been Updated.')
        })
        .catch((error) => {
          console.log('Unable to update your details' + error)
        })
    }

    retrievePhoto=async () => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/photo', {
        method: 'GET',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'image/png'
        }
      })
        .then((res) => {
          return res.blob()
        })
        .then((resBlob) => {
          // eslint-disable-next-line prefer-const
          let data = URL.createObjectURL(resBlob)
          this.setState({
            photo: data,
            isLoading: false
          })
        })
        .catch((error) => {
          console.log('Error Occurred', error)
        })
    }

    render () {
      if (this.state.isLoading) {
        return (
          <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator/>
      </View>
        )
      } else {
        return (
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                      <View style = {styles.logoutContainer}>
                        <TouchableOpacity
                            style={styles.navButton}
                            title="Logout"
                            onPress={() => this.logout()}
                        >
                          <Text>Logout</Text>
                        </TouchableOpacity>
                      </View>
                        <View>
                        <Text style={styles.title}>Your Profile</Text>

                            <Image
                                style={styles.image}
                                source={{
                                  uri: this.state.photo
                                }}
                            />

                        </View>
                        <View>
                            <TouchableOpacity
                                style = {styles.buttonUpload}
                                title="Upload Profile Picture Here"
                                onPress={() => this.props.navigation.navigate('Profile Picture Upload')}
                            >
                                <Text>Upload New Profile Picture here</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity
                              style = {styles.getDetailsButton}
                              title = 'Get your Details'
                              onPress = {() => this.retrieveUserDetails()}
                            >
                              <Text>Get Your Details</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text style={styles.title2}>Update Your Details</Text>
                        </View>
                        <View>
                            <TextInput
                                style={styles.textIn}
                                placeholder="Update First Name Here"
                                onChangeText={(first_name) => this.setState({ first_name })}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.textIn}
                                placeholder="Update Last Name Here"
                                onChangeText={(last_name) => this.setState({ last_name })}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.textIn}
                                placeholder="Update Email Address Here"
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.textIn}
                                placeholder="Update Password Here"
                                onChangeText={(password) => this.setState({ password })}
                            />
                            </View>
                            <View>
                                <TouchableOpacity
                                    style = {styles.button}
                                    title="Update Details"
                                    onPress={() => this.updateUserDetails()}

                                >
                                    <Text>Update Details</Text>

                                </TouchableOpacity>
                            </View>

                    </ScrollView>
                </SafeAreaView>
        )
      }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9CDCD',
    alignItems: 'center',
    justifyContent: 'center'
  },

  button: {
    width: 125,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginLeft: 30,
    backgroundColor: '#DDDCA1',
    borderWidth: 1

  },
  getDetailsButton: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#DDDCA1',
    flexDirection: 'row',
    display: 'flex',
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 15
  },

  buttonUpload: {
    width: 215,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 3,
    backgroundColor: '#DDDCA1',
    borderWidth: 1
  },

  image: {
    borderWidth: 1,
    borderRadius: 400 / 2,
    overflow: 'hidden',
    width: 200,
    height: 200

  },
  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'helvetica',
    marginBottom: 20,
    marginLeft: 10

  },
  title2: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'helvetica',
    marginTop: 20,
    marginBottom: 10
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
  logoutContainer: {
    alignItems: 'flex-start'
  },
  navButton: {
    width: 100,
    height: 50,
    marginTop: 5,
    marginLeft: 50,
    marginBottom: 20,
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#DDDCA1',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center'
  }
})

export default ProfileScreenMenu
