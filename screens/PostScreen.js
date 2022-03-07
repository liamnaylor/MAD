import React, { Component } from 'react';
import { Text, ScrollView, Button, Alert,View,TextInput,FlatList, ActivityIndicator,StyleSheet,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class PostScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            text:'',
            post_id:'',
            allData:[],
            isLoading:true,
        }
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

    postText= async () =>{
        const token = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        let itemsToSend={
            text:(this.state.text)
        }

        return fetch("http://localhost:3333/api/1.0.0/user/" +user_id+"/post",{
            method:'POST',
            headers:{
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemsToSend)

        })
        .then((response)=>{
            console.log("Posted",response);
            this.getPosts();
        })
        .catch((error)=>{
            console.error(error);
        });

        
        
    }

    getPosts=async()=>{
        const token= await AsyncStorage.getItem('@session_token');
        const user_id= await AsyncStorage.getItem('@user_id');
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
                allData:responseJson,       
                
            })
            console.log(responseJson)
        })
        .catch((error)=>{
            console.log(error);
        });
        
    }

    updatePost=async(post_id)=>{
        const token = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        let toUpdate={
            text:this.state.text
        }
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/"+post_id,{
            method:'PATCH',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(toUpdate)
        })
        .then((response)=>{
            console.log("Your Details have been updated.")
            this.getPosts();
        })
        .catch((error)=>{
            console.log("Unable to update your details"+error);
        })
    }

    deletePost=async(post_id) => {
        const token = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id+"/post/"+post_id,{
            method:'DELETE',
            'headers':{
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },            
        })
        .then((response)=>{
            this.getPosts();
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
      }
    componentDidMount(){
        this.unsubscribe=this.props.navigation.addListener('focus', ()=>{
            this.checkLoggedIn();
        })
        this.getPosts();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }
    render(){
        if(this.state.isLoading){
            return(
                <View>
                    <ActivityIndicator
                        size="large"
                        color="#00ff00"
                    />
                </View>
            );
        }
        else{
        return(
                <View>
                    <View>
                        <TextInput
                            style ={styles.textIn}
                            placeholder="Enter text here and press 'Post' to post a message"
                            onChangeText={(text)=> this.setState({text})}
                        />
                        <Button
                            style={{marginBottom:20}}
                            title="Post"
                            onPress={()=> this.postText()}
                        />
                        
                        
                    </View>
                    <View>
                        <FlatList
                            data={this.state.allData}
                            renderItem={({item})=>(
                                <View>    
                                    <Text style = {{marginTop:30, fontWeight:'bold', fontSize:16, fontFamily:"helvetica"}}>{item.text}</Text>
                                    <Text>Likes: {item.numLikes}</Text>
                                    <Text style={{marginBottom:10}}></Text>
                                    <TextInput 
                                        placeholder="Enter Text here and press 'Submit' to update this post"
                                        onChangeText={(text)=>this.setState({text})}
                                    />
                                    <Button
                                        style={{marginBottom:10}}
                                        title="Submit Changes"
                                        onPress={()=>this.updatePost(item.post_id)}
                                    />
                                    <Button
                                        style={{marginTop:20}}
                                        title="Delete Post"
                                        onPress={()=> this.deletePost(item.post_id)}                
                                    />
                                    <Text style={{marginBottom:40}}></Text>
                                    
                                </View>


                            )}
                            keyExtractor={(item,index)=> item.post_id.toString()}
                        />
                    </View>
                    
                </View>
        
            )   
        }
    }
}
const styles = StyleSheet.create({
    container:{
        borderRadius:20,
        backgroundColor:'#E9CDCD'
    },
    textIn:{
        borderColor:"light-blue",
        width:"100",
        borderWidth:1,
        borderRadius:10,
        padding:10,
        marginBottom:5
    },
    button: {
        width: "80%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#9ACD32",
      },
    
})


export default PostScreen;
