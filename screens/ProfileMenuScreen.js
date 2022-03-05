import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Button, ActivityIndicator, FlatList, ScrollView,TextInput,Image, SafeAreaView,SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreenMenu extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            userDetails:[],

            photo:null,
        }
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
        this.retrieveUserDetails();
        this.retrievePhoto();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    retrieveUserDetails=async()=>{
        const token= await AsyncStorage.getItem('@session_token');
        const user_id= await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id,{
            method:'GET',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            }
        })
        .then((response)=>response.json())

        .then((responseJson)=>{
            this.setState({
                isLoading: false,
                userDetails: responseJson
            })
            console.log(responseJson)
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    updateUserDetails=async()=>{
        const token=await AsyncStorage.getItem('@session_token');
        const user_id=await AsyncStorage.getItem('@user_id');
        let toUpdate={
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            email:this.state.email,
            password:this.state.password
        }
        return fetch("http://localhost:3333/api/1.0.0/user/"+user_id,{
            method:'PATCH',
            headers:{
                'X-Authorization':token,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(toUpdate)
        })
        .then((response)=>{
            console.log("Your Details have been updated.")
        })
        .catch((error)=>{
            console.log("Unable to update your details"+error);
        })
    }
    retrievePhoto=async()=>{
        const token = await AsyncStorage.getItem('@session_token');
        const user_id=await AsyncStorage.getItem('@user_id');
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
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <View>
                            <Text>This is the profile menu screen.</Text>
                            <Button
                                title="Upload Profile Picture Here"
                                onPress={()=> this.props.navigation.navigate("Profile")}
                            />
                        </View>
                        <View>
                            <Image
                                style={styles.image}
                                source={{
                                    uri:this.state.photo,
                                }}
                                
                            />

                        </View>
                        <View>
                            <FlatList
                                data={this.state.userDetails}
                                renderItem={({item})=>(
                                    <View>
                                        <Text>{item.user_id}</Text>
                                        <Text>{item.first_name}</Text>
                                        <Text>{item.last_name}</Text>
                                        <Text>{item.email}</Text>
                                    </View>
                                )}
                                keyExtractor={(user,index)=>user.user_id.toString()}
                            />
                        </View>

                        <View>
                            <Text>Update Your Details</Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder="First Name"
                                onChangeText={(first_name)=> this.setState({first_name})}
                            />
                        </View>
                        <View>
                            <TextInput
                                placeholder="Last Name"
                                onChangeText={(last_name)=> this.setState({last_name})}
                            />
                        </View>
                        <View>
                            <TextInput
                                placeholder="Email Address"
                                onChangeText={(email)=> this.setState({email})}
                            />
                        </View>
                        <View>
                            <TextInput
                                placeholder="Password"
                                onChangeText={(password)=> this.setState({password})}
                            />
                            </View>
                            <View>
                                <Button
                                    title="Update Details"
                                    onPress={()=> this.updateUserDetails()}
                                    
                                />
                            </View>
                                
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }
}

const styles=StyleSheet.create({
    container:{
        alignItems:'center'
    },
    image:{
        borderWidth:50,
        borderRadius:400/2,
        overflow:"hidden",
        width:200,
        height:200,
        borderWidth:2

    },
})

export default ProfileScreenMenu;