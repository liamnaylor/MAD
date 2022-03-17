/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Component } from 'react'
import { Text, ScrollView, Button, Alert, View, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

class PostScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      post_id: '',
      allData: [],
      isLoading: true,
      drafts: []
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

    postText= async () => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      const itemsToSend = {
        text: (this.state.text)
      }

      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/post', {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemsToSend)

      })
        .then((response) => {
          console.log('Posted', response)
          this.getPosts()
          alert('New Post Added')
        })
        .catch((error) => {
          console.error(error)
        })
    }

    getPosts=async () => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/post/', {
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            allData: responseJson

          })
          console.log(responseJson)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    updatePost = async (post_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      const toUpdate = {
        text: this.state.text
      }
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/post/' + post_id, {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toUpdate)
      })
        .then((response) => {
          console.log('Your Post has been edited')
          this.getPosts()
          alert('Your Post has been edited')
        })
        .catch((error) => {
          console.log('Unable to update your details' + error)
        })
    }

    deletePost=async (post_id) => {
      const token = await AsyncStorage.getItem('@session_token')
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/post/' + post_id, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log(response)
          this.getPosts()
          alert('Your Post has been removed')
        })
        .catch((error) => {
          console.log(error)
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
      this.getPosts()
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    saveDraft = async () => {
      const toSend = {
        text: (this.state.text)
      }
      this.setState({
        drafts: toSend,
        body: JSON.stringify(toSend)
      })
      console.log(toSend)
    }

    displayDraft = async () => {
      draftText = await AsyncStorage.getItem('@text')
    }

    render () {
      if (this.state.isLoading) {
        return (
                <View>
                    <ActivityIndicator
                        size="large"
                        color="#00ff00"
                    />
                </View>
        )
      } else {
        return (
                <SafeAreaView style={styles.container}>
                  <ScrollView>
                    <View>
                      <Text style = {styles.title}>Post Something</Text>

                      <TouchableOpacity
                        style = {styles.backButton}
                        title = "Back"
                        onPress={() => this.props.navigation.goBack()}
                      >
                        <Text>Back</Text>
                      </TouchableOpacity>
                        <TextInput
                            style ={styles.textIn}
                            placeholder="Enter a Message"
                            onChangeText={(text) => this.setState({ text })}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            title="Post"
                            onPress={() => this.postText()}
                        >
                          <Text>Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            title="Save Your Input as Draft"
                            onPress={() => this.saveDraft()}
                        >
                            <Text>Save As Draft</Text>
                        </TouchableOpacity>

                    </View>
                    <View>
                        <Text style = {styles.title2}>Your Previous Posts</Text>
                        <FlatList
                            data={this.state.allData}
                            renderItem={({ item }) => (
                                <View>
                                    <Text style = {{ marginTop: 50, fontWeight: 'bold', fontSize: 16, fontFamily: 'helvetica' }}>{item.text}</Text>
                                    <Text>Likes: {item.numLikes}</Text>
                                    <Text style={{ marginBottom: 10 }}></Text>
                                    <TextInput
                                        style = {styles.textIn}
                                        placeholder="Edit Post"
                                        onChangeText={(text) => this.setState({ text })}
                                    />
                                    <TouchableOpacity
                                        style={styles.button}
                                        title="Submit Changes"
                                        onPress={() => this.updatePost(item.post_id)}
                                    >
                                      <Text>Submit Changes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        title="Delete Post"
                                        onPress={() => this.deletePost(item.post_id)}
                                    >
                                      <Text>Delete Post</Text>
                                    </TouchableOpacity>
                                    <Text style={{ marginBottom: 40 }}></Text>

                                </View>

                            )}
                            keyExtractor={(item, index) => item.post_id.toString()}
                        />
                    </View>

                    <View>
                      <Text>Drafts</Text>
                      <FlatList
                        data = {this.state.drafts}
                        renderItem={({ item }) => (
                          <Text>{item.text}</Text>
                        )}
                      />
                      <Text></Text>
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

  postContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
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
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'helvetica'
  },
  button: {
    width: 125,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 50,
    flexDirection: 'row',
    backgroundColor: '#DDDCA1',
    borderWidth: 1

  },
  button2: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 100,
    flexDirection: 'row',
    backgroundColor: '#DDDCA1'
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginRight: 250,
    marginBottom: 20,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: '#DDDCA1'
  },

  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center'
  },
  title2: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30
  },
  divider: {
    height: 1,
    width: 100,
    backgroundColor: '#ffffff',
    marginBottom: 30
  },
  textIn: {
    borderColor: 'black',
    width: 250,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#DCDCDC'
  }

})

export default PostScreen
