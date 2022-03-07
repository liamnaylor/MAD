import React, { Component, useState,useEffect} from 'react';
import { Text, ScrollView, Button, FlatList, View,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from 'react-native-elements';

class FriendSearchScreen extends Component{
    
    constructor(props){
        super(props);
        this.state={
            listData:[],
            isLoading:true,
            searchText:'',
            searchData:[]
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
    
    findFriends= async()=>{
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search",{
            'headers':{
                'X-Authorization': value
            }
        })
        .then((response)=>{
            if(response.status===200){
                return response.json()
            }
            else if(response.status===401){
                this.props.navigation.navigate("Login");
            }
            else{
                throw 'Something went very, Very Wrong...';
            }
        })
        .then((responseJson)=>{
            this.setState({
                isLoading: false,
                listData: responseJson
            })
            console.log(responseJson)
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    addFriend=async (user_id)=>{
        const value = await AsyncStorage.getItem('@session_token');
        let sendRequest={
            user_id:this.state.user_id
        }
        return fetch("http://localhost:3333/api/1.0.0/user/" +user_id+ "/friends",{
            method:'POST',
            'headers':{
                'X-Authorization':value,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(sendRequest)
        })
        .then((response)=>{
            console.log("Friend Request Sent",response);
            this.findFriends();
        })
        .catch((error)=>{
            console.error(error);
        });
    }

    componentDidMount(){
        this.unsubscribe=this.props.navigation.addListener('focus', ()=>{
            this.checkLoggedIn();
        })
        this.findFriends();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn=async()=>{
        const value=await AsyncStorage.getItem('@session_token');
        if(value==null){
            this.props.navigation.navigate('Login');
        }
    }

    searchBar=async(searchText)=>{
        this.setState(searchText)
        const token =await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search",{
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            },
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            this.setState({
                searchData:responseJson
            })
        })
        .catch((error)=>{
            console.error(error);
        })
    }




   
    
    ItemView = ({item}) => {
        return (
          // Flat List Item
          <Text
            onPress={() => getItem(item)}>
            {item.id}
            {'.'}
            {item.title.toUpperCase()}
          </Text>
        );
      };
    
    ItemSeparatorView = () => {
        return (
          // Flat List Item Separator
          <View
            style={{
              height: 0.5,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
        );
      };
    

    

    render(){
        if(this.state.isLoading){
            return(
                <View
                    style={{
                        flex:1,
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                    <Text>Hello</Text>
                </View>
            );
        }
        else{
            return(
                <View>
                    <TextInput
                        onChangeText={(searchText)=>this.setState({searchText})}
                        placeholder='Search For Friends Here'
                        
                    />
                    <Button
                        title='Search'
                        onPress={(searchText)=>this.searchBar(searchText)}
                    />
                    <FlatList
                        data={this.state.searchData}
                        renderItem={({item})=>(
                            <View>
                                <Text>{item.user_givenname} {item.user_familyname} {item.user_id}</Text>

                                <Button
                                    title="Add Friend"
                                    onPress={()=> this.addFriend(item.user_id)}
                                />
                            </View>
                        )}
                        keyExtractor={(user,index)=>user.user_id.toString()}
                    />
                </View>
            );
        }
    }
}

export default FriendSearchScreen;
//