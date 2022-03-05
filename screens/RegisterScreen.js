import React, { Component } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';

class RegisterScreen extends Component{
    constructor(props){
        super(props);

        this.state={
            first_name:'',
            last_name:'',
            email:'',
            password:'',
        }
    }
    reg= () => {
        return fetch("http://localhost:3333/api/1.0.0/user",{
            method:'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render(){
        return(
            <ScrollView>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        onChangeText={(first_name)=> this.setState({first_name})}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        onChangeText={(last_name)=> this.setState({last_name})}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        onChangeText={(email)=> this.setState({email})}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={(password)=> this.setState({password})}
                    />
                </View>
                <View>
                    <Button
                        title="Register"
                        onPress={()=> this.reg()}
                        
                    />
                </View>
                    
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
      width: 350,
      height: 55,
      backgroundColor: '#42A5F5',
      margin: 10,
      padding: 8,
      color: 'white',
      borderRadius: 14,
      fontSize: 18,
      fontWeight: '500',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })

export default RegisterScreen;
