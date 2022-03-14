/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Component, useState, useEffect } from 'react'
import { Text, ScrollView, Button, FlatList, View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SearchBar } from 'react-native-elements'

class FriendSearchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listData: [],
      isLoading: true,
      searchBarLoading: true,
      searchText: '',
      searchData: [],
      textToSearch: {},
      data: []
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

    getFlatListName (user_givenname, user_familyname) {
      alert(user_givenname, user_familyname)
    }

    findFriends= async () => {
      const value = await AsyncStorage.getItem('@session_token')
      return fetch('http://localhost:3333/api/1.0.0/search', {
        headers: {
          'X-Authorization': value
        }
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json()
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login')
          } else {
            throw 'Something went very, Very Wrong...'
          }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
          console.log(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    addFriend=async (user_id) => {
      const value = await AsyncStorage.getItem('@session_token')
      const sendRequest = {
        user_id: this.state.user_id
      }
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/friends', {
        method: 'POST',
        headers: {
          'X-Authorization': value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendRequest)
      })
        .then((response) => {
          console.log('Friend Request Sent', response)
          this.findFriends()
          if (response.status === 403) {
            alert('YOU CANNOT SEND MORE THAN ONE FRIEND REQUEST')
          }
        })
        .catch((error) => {
          console.error(error, 'Something Went Wrong...')
        })
    }

    componentDidMount () {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn()
      })
      this.findFriends()
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    checkLoggedIn=async () => {
      const value = await AsyncStorage.getItem('@session_token')
      if (value == null) {
        this.props.navigation.navigate('Login')
      }
    }

    searchBar=async (textToSearch) => {
      this.setState({ textToSearch })
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://localhost:3333/api/1.0.0/search', {
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            searchData: responseJson
          })
        })
        .catch((error) => {
          console.error(error)
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
      }
      return (
              <SafeAreaView style = {styles.container}>
                <ScrollView>
                  <View>
                      <Text style = {styles.title}>Search for Friends</Text>
                      <TextInput
                        placeholder="Search Here"
                        onChangeText={textToSearch => this.searchBar(textToSearch)}
                        underlineColorAndroid = 'transparent'
                      />

                      <FlatList
                          data={this.state.searchData}
                          renderItem={({ item }) => (

                              <View>
                                  <Text>{item.user_givenname} {item.user_familyname} {item.user_id}</Text>

                                  <TouchableOpacity
                                      style={styles.button}
                                      title="Add Friend"
                                      onPress={() => this.addFriend(item.user_id)}
                                  >
                                    <Text>Add Friend</Text>
                                  </TouchableOpacity>
                              </View>
                          )}
                          keyExtractor={(user, index) => index.toString()}
                      />
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
  button: {
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#DDDCA1',
    flexDirection: 'row',
    display: 'flex',
    marginHorizontal: 20
  },
  input: {
    borderColor: 'black',
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#DCDCDC'
  },
  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20
  },
  requestActions: {
    display: 'flex',
    flexDirection: 'row'
  }
})
export default FriendSearchScreen
//
