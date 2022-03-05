import React, { Component } from 'react';
import { Text, ScrollView, Button,FlatList,Image,StyleSheet, SafeAreaView,View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            friendPosts:[],
            isLoading:true,
            friendRequests:[],
            friends:[],
            userSearchIn:'',
            text:'',
            photo:null

        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getFriendRequests();
        this.getFriends();      
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    getOtherUserPosts=async(user_id)=>{
        const token= await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/",{
            'headers':{
                'X-Authorization': token,
                'Content-Type': 'application/json'
            }
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            this.setState({
                isLoading:false,
                friendPosts:responseJson,       
                
            })
            console.log(responseJson)
        })
        .catch((error)=>{
            console.log(error);
        });
        
    }

    likePost=async(user_id,post_id)=>{
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/"+post_id+"/like",{
            method:'POST',
            headers:{
                'X-Authorization':token,
                'Content-Type': 'application/json'
            },
        })
        .then((response)=>{
            console.log("Post Liked!",response);
        })
        .catch((error)=>{
            console.error(error);
        })
    }
    

    removeLike=async(user_id,post_id)=>{
        const token=await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/"+post_id+"/like",{
            method:'DELETE',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            }

        })
        .then((response)=>{
            console.log('Like Removed',response)
            console.log(response)
        })
        .catch((error)=>{
            console.log(error);
        })

    }

    getProfilePhoto=async(user_id)=>{
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/photo",{
            method:'GET',
            headers:{
                'X-Authorization':token,
                'Content-Type':'image/png'
            },
        })
        .then((res)=>{
            return res.blob();
        })
        .then((resBlob)=>{
            let data = URL.createObjectURL(resBlob);
            this.setState({
                photo:data,
                isLoading:false
            })
        })
        .catch((error)=>{
            console.log("Error Occurred",error);
        })
    }


    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'POST',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
    acceptFriendRequest=async(user_id)=>{
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+user_id,{
            method:'POST',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            }
        })
        .then((response)=>{
            console.log('You have a new friend'+response);
            this.getFriendRequests();
        })
        .catch((error)=>{
            console.error(error);
        })
    }

    declineFriendRequest=async(user_id)=>{
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+user_id,{
            method:'DELETE',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            }
        })
        .then((response)=>{
            this.getFriendRequests();
        })
        .catch((error)=>{
            console.error(error);
        })
    }

    ItemSeparator=()=>{
        return(
            <View
                style={{
                    height:1,
                    width:'100',
                    backgroundColor:'#c8c8c8'
                }}
            />
        );
    };

    getFriendRequests=async()=>{
        const token= await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests",{
            method:'GET',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            }
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            this.setState({
                isLoading:false,
                friendRequests:responseJson,
            })
            console.log(responseJson)
        })
        .catch((error)=>{
            console.log(error);
        });
    
    }

    getFriends=async()=>{
        const token = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/friends",{
            method:'GET',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            }
        })
        
        .then((response)=>response.json())
        .then((responseJson)=>{
            this.setState({
                isLoading:false,
                friends:responseJson
                
            })
            console.log(responseJson)
            this.getProfilePhoto();
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.title}>Welcome to Spacebook</Text>
                        <Button
                            style={styles.logoutButton}
                            title="Logout"
                            onPress={() => this.logout()}
                        />
                        <Button
                            title="Find Friends"
                            onPress={()=> this.props.navigation.navigate("Search")}
                        />
                        <Button
                            title="Your Details"
                            onPress={()=> this.props.navigation.navigate("Your Details")}
                        />
                        <Button
                            title="Post"
                            onPress={()=> this.props.navigation.navigate("Post")}
                        />
                    </View>
                    <View>
                        <FlatList
                            data={this.state.friendRequests}
                            ItemSeparatorComponent={this.ItemSeparator}
                            renderItem={({item})=>(
                                <View>
                                    <Text>{item.first_name} {item.last_name}</Text>
                                    <Button
                                        title="Accept Friend Request"
                                        onPress={()=> this.acceptFriendRequest(item.user_id)}
                                    />
                                    <Button
                                        title="Decline Friend Request"
                                        onPress={()=> this.declineFriendRequest(item.user_id)}
                                    />
                                    
                                </View>
                            )}
                            keyExtractor={(user,index)=> user.user_id.toString()}
                        />
                    </View>
                    <View>
                        <Text style={styles.friendText}>Your Friends</Text>
                        <FlatList
                            data={this.state.friends}
                            ItemSeparatorComponent={this.ItemSeparator}

                            renderItem={({item})=>(
                                <View>
                                    <Text>{item.user_givenname} {item.user_familyname}</Text>
                                    
                                    <Button
                                        title="Get Posts from this user"
                                        onPress={()=>this.getOtherUserPosts(item.user_id, item.post_id)}
                                    />
                                
                                    
                                </View>
                            )}
                            keyExtractor={(user,index)=>user.user_id.toString()}
                        />

                    </View>
                    <View style = {styles.container}>
                        <FlatList

                            data={this.state.friendPosts}
                            renderItem={({item})=>(
                                <View>
                                    <Text>{item.author.first_name} {item.author.last_name} Says - {item.text} </Text>
                                    <Text>Likes: {item.numLikes}</Text>
                                    <Button
                                        title="Like Post"
                                        onPress={()=>this.likePost(item.author.user_id,item.post_id) }
                                    />
                                    <Button
                                        title="Remove Like"
                                        onPress={()=> this.removeLike(item.author.user_id,item.post_id)}
                                    />
                                </View>
                            )}
                            keyExtractor={(user,index)=>user.post_id.toString()}

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
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
    friendText:{
        fontWeight:'bold',
        fontSize:'24'
    },
    image: {
        marginBottom: 40,
        borderRadius:50
    },
    
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
        justifyContent: "center",
    },
    
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#9ACD32",
    },
    
    title: {
        color: "#000",
        fontSize: 30,
        fontWeight: "bold"
    },
    
});

export default HomeScreen;

//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