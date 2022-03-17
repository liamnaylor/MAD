/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { Component } from 'react'
import { Text, ScrollView, Button, FlatList, StyleSheet, SafeAreaView, View, TouchableOpacity, Modal, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

class HomeScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      friendPosts: [],
      isLoading: true,
      friendRequests: [],
      friends: [],
      onePost: [],
      userSearchIn: '',
      text: '',
      photo: null,
      modalVisible: false

    }
  }

  // There are many functions throughout this component that interact with the api including
  // all interaction regarding friends, friend requests and interaction with other user posts.

  // The componentDidMount function is a core function that will complete the specified function
  // once the component has been mounted.

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn()
    })
    this.getFriendRequests()
    this.getFriends()
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

    checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token')
      if (value !== null) {
        this.setState({ token: value })
      } else {
        this.props.navigation.navigate('Login')
      }
    }

    getOtherUserPosts=async (user_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/user/' + user_id + '/post/', {
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            friendPosts: responseJson

          })
          console.log(responseJson)
          alert('Posts Successfully Retrieved')
        })
        .catch((error) => {
          console.log(error)
          alert(error)
        })
    }

    getSinglePost=async (user_id, post_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/user/' + user_id + '/post/' + post_id, {
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            onePost: responseJson,
            modalVisible: true
          })
          console.log(responseJson)
          alert('The post you have selected: ' + JSON.stringify(responseJson))
        })
        .catch((error) => {
          console.log(error)
        })
    }

    likePost=async (user_id, post_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/user/' + user_id + '/post/' + post_id + '/like', {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log('Post Liked!', response)
          if (response.status === 400) {
            alert('YOU CAN ONLY LIKE THE POST ONE TIME')
          } else if (response.status === 200) {
            alert('You have liked the post')
          }
          this.getOtherUserPosts()
        })
        .catch((error) => {
          console.log('Something Went Wrong...')
          console.error(error)
        })
    }

    removeLike=async (user_id, post_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/user/' + user_id + '/post/' + post_id + '/like', {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }

      })
        .then((response) => {
          console.log('Like Removed', response)
          console.log(response)
          alert('You have removed your like from this post')
        })
        .catch((error) => {
          console.log(error)
        })
    }

    getProfilePhoto=async (user_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/user/' + user_id + '/photo', {
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
          const data = URL.createObjectURL(resBlob)
          this.setState({
            photo: data,
            isLoading: false
          })
        })
        .catch((error) => {
          console.log('Error Occurred', error)
        })
    }

    logout = async () => {
      const token = await AsyncStorage.getItem('@session_token')
      await AsyncStorage.removeItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/logout', {
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

    acceptFriendRequest=async (user_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/friendrequests/' + user_id, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log('You have a new friend' + response)
          alert('You have a new friend!')
        })
        .catch((error) => {
          console.error(error)
        })
    }

    declineFriendRequest=async (user_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/friendrequests/' + user_id, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.getFriendRequests()
          alert('You have rejected the friend request.')
        })
        .catch((error) => {
          console.error(error)
        })
    }

    ItemSeparator=() => {
      return (
            <View
                style={{
                  height: 1,
                  width: '100',
                  backgroundColor: '#c8c8c8'
                }}
            />
      )
    };

    getFriendRequests=async () => {
      const token = await AsyncStorage.getItem('@session_token')
      return fetch('http://192.168.1.3:3333/api/1.0.0/friendrequests', {
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
            friendRequests: responseJson
          })
          console.log(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    getFriends=async () => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/friends', {
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
            friends: responseJson

          })
          console.log(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    itemDiv=() => {
      return (
            <View>
                style={{
              height: 1,
              width: 100,
              backgroundColor: '#ffffff'
            }}
            </View>
      )
    }

    displayModal (show) {
      this.setState({
        modalVisible: show
      })
    }

    render () {
      return (
      // Flatlists have been used throughout this component to display each record that is stored in the api
      // about the user including friends and outstanding friend requests.

            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.title}>Welcome to Spacebook</Text>
                        <TouchableOpacity
                            style={styles.navButton}
                            title="Logout"
                            onPress={() => this.logout()}
                        >
                          <Text>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            title="Find Friends"
                            onPress={() => this.props.navigation.navigate('Search')}
                        >
                        <Text>Find Friends</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style = {styles.navButton}
                          title = "Your Details"
                          onPress = {() => this.props.navigation.navigate('Your Details')}
                        >
                        <Text>Your Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            title="Post"
                            onPress={() => this.props.navigation.navigate('Post')}
                        >
                          <Text>Post</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FlatList
                            data={this.state.friendRequests}
                            renderItem={({ item }) => (
                                <View style = {styles.posts}>
                                    <Text style = {styles.friendText}>Your Friend Requests</Text>
                                    <Text style = {styles.friends}>{item.first_name} {item.last_name}</Text>
                                    <TouchableOpacity
                                        style = {styles.getPostButton}
                                        title="Accept Friend Request"
                                        onPress={() => this.acceptFriendRequest(item.user_id)}
                                    >
                                        <Text>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style = {styles.getPostButton}
                                        title="Decline Friend Request"
                                        onPress={() => this.declineFriendRequest(item.user_id)}
                                    >
                                        <Text>Decline</Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                            keyExtractor={(user, index) => user.user_id.toString()}
                        />
                    </View>
                    <View>
                        <Text style={styles.friendText}>Your Friends</Text>
                        <FlatList
                            data={this.state.friends}
                            renderItem={({ item }) => (
                                <View style = {styles.posts}>
                                    <Text style = {styles.friends}>{item.user_givenname} {item.user_familyname}</Text>

                                    <TouchableOpacity
                                        style={styles.getPostButton}
                                        title="Get Posts from this user"
                                        onPress={() => this.getOtherUserPosts(item.user_id, item.post_id)}
                                    >
                                        <Text>Get Posts from this user</Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                            keyExtractor={(user, index) => user.user_id.toString()}
                        />

                    </View>
                    <View style = {styles.container}>
                        <FlatList
                            data={this.state.friendPosts}
                            renderItem={({ item }) => (
                                <View style = {styles.postContainer}>
                                    <Text style = {styles.postAuthor}>{item.author.first_name} {item.author.last_name} Posted:</Text>
                                    <Text style={styles.posts}>{item.text} Likes: {item.numLikes}
                                    </Text>
                                    <TouchableOpacity
                                        style = {styles.button}
                                        title="Like Post"
                                        onPress={() => this.likePost(item.author.user_id, item.post_id)}
                                    >
                                        <Text>Like Post</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        title="Remove Like"
                                        onPress={() => this.removeLike(item.author.user_id, item.post_id)}
                                    >
                                        <Text>Remove Like</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.button}
                                        title="View Post"
                                        onPress={() => this.getSinglePost(item.author.user_id, item.post_id)}
                                    >
                                      <Text>View Post</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => this.displayModal(true)}
                                    >
                                      <Text>Modal</Text>
                                    </TouchableOpacity>
                                    <Modal
                                      animationType = {'slide'}
                                      transparent = {false}
                                      visible = {this.state.modalVisible}
                                    >

                                        <Text>{item.author.first_name} {item.author.last_name}</Text>
                                        <Text>{item.text}</Text>
                                      <TouchableOpacity
                                        onPress={() => this.displayModal(!this.state.modalVisible)}
                                      >
                                        <Text>Close</Text>
                                      </TouchableOpacity>
                                    </Modal>
                                    <Text style={styles.divider}></Text>
                                </View>
                            )}
                            keyExtractor={(user, index) => user.post_id.toString()}

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
  friends: {
    fontFamily: 'helvetica',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20
  },

  postContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1
  },
  getPostButton: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: '#DDDCA1',
    flexDirection: 'row',
    display: 'flex',
    marginHorizontal: 20,
    borderWidth: 1
  },
  friendText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 30
  },
  friendView: {
    fontWeight: 'bold',
    fontFamily: 'helvetica',
    fontSize: 24
  },
  image: {
    marginBottom: 40,
    borderRadius: 50
  },

  posts: {
    padding: 2,
    flex: 1,
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'helvetica'
  },

  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    flexDirection: 'row-reverse',
    display: 'flex',
    backgroundColor: '#DDDCA1',
    borderWidth: 1
  },
  button2: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 50,
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#DDDCA1'
  },
  button3: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 50,
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#FF9781'
  },
  backButton: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 50,
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#FF9781'
  },
  navButton: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 50,
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#008080',
    borderWidth: 1,
    flex: 1
  },

  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20
  },
  divider: {
    height: 1,
    width: 100,
    backgroundColor: '#ffffff',
    marginBottom: 30
  },
  postAuthor: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 5
  }

})

export default HomeScreen
