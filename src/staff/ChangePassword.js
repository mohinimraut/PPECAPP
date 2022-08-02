import React from 'react';
import { View, StyleSheet, Text, AsyncStorage, StatusBar, ScrollView, TextInput, Dimensions, Image, ImageBackground, TouchableOpacity,Platform ,KeyboardAvoidingView} from 'react-native';
import { Header, Body, CardItem, Left, Icon, Card, Button, Toast, Right,Container,Root } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
var h = Dimensions.get('window').height;
import NetInfo from "@react-native-community/netinfo";
import {changepassword} from '../api/index'
import { SQLite,  } from 'expo-sqlite';
const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class Changepassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePassword: true, hideCPassword: true,
            spinner: false,
            showToast: false,
            oldcpwd: '',
            newcpwd: '',
            confirmcpwd: '',
            ismismatch: false,
            showToast: false,
            isFirstUser: false,
            visible: false,
            visible2: false,
            stud_id: ''
        }
        this.getstudid = this.getstudid.bind(this);
        this._changepasswpord = this._changepasswpord.bind(this);
   
    }
    componentDidMount() {
        this.getstudid();
    }
    getstudid() {
        var self = this;
        db.transaction(async (txn) => {
            txn.executeSql("select * from tbllogin where isactive='1'", [],
                function (tx, result) {
                    console.log('got the studid')
                    self.setState({ stud_id: result.rows.item(0).username })
                },
            )
        })
    }
    async _changepasswpord() {
        var connection = await NetInfo.fetch();
        console.log(connection.isConnected);
              if(connection.isConnected){
                this.setState({
                    spinner: true
                })
                if (this.state.oldcpwd == '') {
                    alert('Please Insert old Password')
                    this.setState({
                        spinner: false
                    })
                }
                else if (this.state.newcpwd == '') {
                    alert('Please Insert New Password')
                    this.setState({
                        spinner: false
                    })
                }
                else if (this.state.confirmcpwd == '') {
                    alert('Please Insert Confirm Password')
                    this.setState({
                        spinner: false
                    })
                }
                else if (this.state.newcpwd != this.state.confirmcpwd) {
                    alert('Confirm Password Incorrect..')
                    this.setState({
                        spinner: false
                    })
                }
                else {
                    var passwordDetails ={};
                   passwordDetails.user_name = this.state.stud_id;
                   passwordDetails.oldpassword = this.state.oldcpwd;
                   passwordDetails.newpassword = this.state.newcpwd;
                   passwordDetails.cnfrmpassword = this.state.confirmcpwd;
                    const response = await changepassword(passwordDetails);
             
                    if (response == 'error') {
                        alert('SOMETHING WENT WRONG...!')
                        this.setState({
                            spinner: false
                        })
                    }
                    else {
                        if (response == 'success') {
                            this.setState({
                                spinner: false,
                                visible: true
                            })
                            this.textInput.clear();
                        }
                        else {
                            this.setState({
                                spinner: false,
                                visible2: true
                            })
                        }
        
                    }
        
                }
              }
              else 
              {
                alert('No internet connection..')
                this.setState({
                    spinner: false,
                   
                })
              }
       
    }
    render (){
        return(
            <Container>
            <Root>
            <View style={{flex:1}}>
            <StatusBar backgroundColor="#9e9e9e" />
           <ImageBackground
            resizeMode={'stretch'} // or cover
            style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
            source={require('../../assets/attbackimage.png')}
            >
                 <Spinner
                        visible={this.state.spinner}
                        textContent={'Please Wait While Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
    {
        Platform.OS === 'ios' ?<View style={{backgroundColor:'transparent',height:'10%',paddingTop:15}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
           </TouchableOpacity >
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>CHANGE PASSWORD</Text>
          </View>
        </View>
       </View>:<View style={{backgroundColor:'transparent',height:'8%'}}>
   <View style={{flexDirection:'row',flex:1}}>
   <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
   <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
   <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
    </TouchableOpacity >
   </View>
   <View style={{flex:1,justifyContent:"center"}}>
       <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>CHANGE PASSWORD</Text>
   </View>
 </View>
</View>
    }
      <ScrollView>
      <View style={{flex:1,height:h-100}}>
<View style={{backgroundColor:'rgba(255, 255, 255, 0.7)',flex:1,marginTop:10,marginLeft:15,marginRight:15,marginBottom:50,borderRadius:8,elevation:5}}>
<View style={{height:'25%',justifyContent:"center",alignItems:"center"}}>
       <Image style={{height:140,width:140,borderRadius:60}} source={require('../../assets/ppeclogo.png')}></Image>
     </View>
     <View style={{height:"65%"}}>
       
     <KeyboardAvoidingView  behavior="padding" enabled>
     <View style={{flexDirection:"row",paddingTop:10,paddingBottom:8}}>
      <View style={{paddingLeft:20}}><Text style={{ color: '#ff7043',fontSize:20,fontWeight:"bold" }} >Old Password</Text></View>
     </View>
     <View style={{height:'15%',backgroundColor:'white',marginLeft:15,marginRight:15,paddingTop:5,elevation:2,borderWidth:2,borderColor:"#cfd8dc",borderRadius:6,justifyContent:'center'}}>
         
     <TextInput
      style={{paddingLeft:10,color:'black'}}
      placeholder='Type old password here'
      onChangeText={oldcpwd => this.setState({ oldcpwd })}
      placeholderTextColor="#cfd8dc"
    />
     </View>
     <View style={{flexDirection:"row",paddingTop:10,paddingBottom:8}}>
      <View style={{paddingLeft:20}}><Text style={{ color: '#ff7043',fontSize:20,fontWeight:"bold" }} >New Password</Text></View>
     </View>
     <View style={{height:'15%',backgroundColor:'white',marginLeft:15,marginRight:15,paddingTop:5,elevation:2,borderWidth:2,borderColor:"#cfd8dc",borderRadius:6,justifyContent:'center'}}>
     <TextInput
      style={{paddingLeft:10,color:'black'}}
      placeholder='Type new password here'
      onChangeText={newcpwd => this.setState({ newcpwd })}
    
      placeholderTextColor="#cfd8dc"
    />
     </View>
     <View style={{flexDirection:"row",paddingTop:10,paddingBottom:8}}>
      <View style={{paddingLeft:20}}><Text style={{ color: '#ff7043',fontSize:20,fontWeight:"bold" }} >Confirm Password</Text></View>
     </View>
     <View style={{height:'15%',backgroundColor:'white',marginLeft:15,marginRight:15,paddingTop:5,elevation:2,borderWidth:2,borderColor:"#cfd8dc",borderRadius:6,justifyContent:'center'}}>
     <TextInput
      style={{paddingLeft:10,color:'black'}}
      placeholder='Type confirm here'

       onChangeText={confirmcpwd => this.setState({ confirmcpwd })}
      placeholderTextColor="#cfd8dc"
    />
     </View>
   
     </KeyboardAvoidingView>
    
     </View>
     
     <View style={{justifyContent:"center",alignItems:"center",paddingTop:25}}>
        <Button onPress={()=>this._changepasswpord()} style={{width:'80%',height:60,backgroundColor:"#ff7043",borderRadius:8}}>
            <View style={{justifyContent:"center",alignItems:"center",flex:1,flexDirection:"row"}}>
                <View><Text style={{color:'white',fontWeight:"bold",fontSize:20}}>SIGN IN</Text></View>
              <View style={{paddingLeft:20}}></View>
                
            </View>
        </Button>
    </View>
  
</View>
</View>
</ScrollView>
</ImageBackground>
           </View>
           </Root>
       </Container>
        )
    }
}
const styles = StyleSheet.create({
 
    spinnerTextStyle: {
        color: '#fff'
    },
});