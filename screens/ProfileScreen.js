/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera } from 'expo-camera'

class ProfileScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
      userInfo: [],
      cameraClicked: false
    }
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token')
    if (value !== null) {
      this.setState({ token: value })
    } else {
      this.props.navigation.navigate('Login')
    }
  }

  async componentDidMount () {
    const { status } = await Camera.requestCameraPermissionsAsync()
    this.setState({ hasPermission: status === 'granted' })
  }

  sendToServer = async (data) => {
    const user_id = await AsyncStorage.getItem('@user_id')
    const token = await AsyncStorage.getItem('@session_token')

    const res = await fetch(data.base64)
    const blob = await res.blob()

    return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token
      },
      body: blob
    })
      .then((response) => {
        console.log('Picture added', response)
        alert('You have uploaded a new profile picture successfully')
      })
      .catch((err) => {
        console.log('I am sorry, there is an issue with the image you are attempting to upload.', err)
      })
  }

    takePicture = async () => {
      if (this.camera) {
        const options = {
          quality: 0.5,
          base64: true,
          onPictureSaved: (data) => this.sendToServer(data)
        }
        await this.camera.takePictureAsync(options)
      }
    }

    render () {
      if (this.state.hasPermission) {
        return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture()
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
        )
      } else {
        return (
        <Text>No access to camera</Text>
        )
      }
    }
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: 'white'
  }
})

// sdf
