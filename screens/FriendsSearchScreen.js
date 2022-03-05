import React, { Component, useState } from 'react';
import { Text, ScrollView, Button, FlatList, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendSearchScreen extends Component{
    
    constructor(props){
        super(props);
        this.state={
            listData:[],
            isLoading:true
        }
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

    searchBarFriends=async()=>{
        const [search,setSearch] = useState('');
        const [filteredDataSource,setFilteredDataSource]=useState([]);
        const [masterDataSource,setMasterDataSource]=useState([]);
        const token =await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search",{
            headers:{
                'X-Authorization':token
            },
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            setFilteredDataSource(responseJson);
            setMasterDataSource(responseJson);
        })
        .catch((error)=>{
            console.error(error);
        })
    }

    searchFilterFunction = (entry) => {
        if (entry) {
          
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.title
              ? item.title.toUpperCase()
              : ''.toUpperCase();
            const textData = entry.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
            setFilteredDataSource(newData);
            setSearch(entry);
        } 
        else {
            setFilteredDataSource(masterDataSource);
            setSearch(entry);
        }
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
                    <SearchBar
                        round
                        searchIcon={{size:22}}
                        onChangeText={(entry)=>this.searchFilterFunction(entry)}
                        onClear={(entry)=>this.searchFilterFunction('')}
                        placeholder="Find some Friends by typing"
                    />
                    <FlatList
                        data={this.state.listData}
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