'use strict'
import React, { Component } from 'react';
import { View, Dimensions,ScrollView, Image, Text, ImageBackground, StyleSheet, TouchableOpacity,StatusBar,Alert } from 'react-native'
import {
  Container, Header, Left, Right, Button, Body,
  Icon,
} from 'native-base';
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('EDUDUNIYA.db');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logintype:'',
      fname:'',
      roll_name:''
    };
  }

  componentDidMount() {
    this.getlogintype(),
    this.rolldata();
  }

  async getlogintype(){
    var data=[];
    var self=this;
    db.transaction((txn) => {
      txn.executeSql(
        "select * from tbllogin where isactive=1",[],
      function(tx, result) {
        console.log(result.rows.item(0))
        var data=result.rows.item(0);
        self.setState({logintype:data.LoginType,fname:data.fname})
       
      }
    )
    })
  }
  confirmlogout(){
    Alert.alert(
      'Alert ',
      'Are you sure logout...',
      [
       
          {text: 'NO', onPress: () => this.props.navigation.navigate('Home')},


        {text: 'YES', onPress: () => this.logout()    },

      ]
    

    );
  }

  logout(){
    var studid=''
    var self=this
    db.transaction((txn) => {
      txn.executeSql("select * from tbllogin where isactive=1",[],
      function(tx, result) {
        console.log('got the student id')
        studid=result.rows.item(0).userid
        db.transaction((txn) => {
          txn.executeSql("delete from tbllogin where userid=?",[studid],
          function(tx, result) {
            console.log('deleted form login login')
          }),
          txn.executeSql("delete from studdetails where userid=?",[studid],
          function(tx, result) {
            console.log('deleted from  studdetails')
            self.props.navigation.navigate('Login')
          },
          ); 
        },(error=>{alert('error')})
        )
      },
      ); 
    },(error=>{
      alert('error')
    })

    
    )
  }

  async rolldata()
  {   
      const { params } = this.props.navigation.state;
      console.log("params---------->"+params)
      const roll_name = params ? params.roll_name : null;
  console.log("roll_name home"+JSON.stringify(params.roll_name))
  this.setState({
    roll_name:roll_name,
     
  })}


  render() {
    console.log('fshfnfnj,dnsdfgj,sd'+this.state.logintype)
    let { height, width } = Dimensions.get('window');
    return (
      <Container style={{height:height,width:width}}>
        <StatusBar backgroundColor="#9e9e9e" />
      <ImageBackground
        resizeMode={'cover'}
        style={{ flex: 1 }} 
        source={require('../../assets/background.png')} style={{ width, height }}
      >     
   {/* <Header style={{ backgroundColor: '#F57C00' }}>
   <StatusBar backgroundColor="#f26047" />
   <View style={{flexDirection:'row',flex:1}}>
<View style={{paddingLeft:4,justifyContent:"center"}}>
   <TouchableOpacity onPress={() => {this.props.navigation.openDrawer()} } style={{marginLeft:5}}>
   <Image style={{height:50,width:50}} source={require('../../assets/Images/DrawerImages/menu.jpg')}></Image>
   </TouchableOpacity>
   </View>
   <View style={{paddingLeft:10,justifyContent:"center"}}>
     <Text style={{fontWeight:'bold',fontSize:20,color:"white"}}>Home</Text>
     <Right style={{flex:1}}>
                    <Icon name='ios-log-out' onPress={()=>{this.confirmlogout()}} style={{color:'white'}} />
                </Right>
     </View>

     </View>
        </Header> */}


        <Header style={{ backgroundColor:  '#F57C00' }}>
   <StatusBar backgroundColor="#f26047" />
   <Left style={{flex:1}}>
   <TouchableOpacity onPress={() => {this.props.navigation.openDrawer();} } style={{marginLeft:5}}>
   <Image style={{height:50,width:50}} source={require('../../assets/Images/DrawerImages/menu.jpg')}></Image>
   </TouchableOpacity>
                </Left>
                <Body style={{flex:1}}>
                <Text style={{ color: 'white', fontSize: 20 }}>Home</Text>
                </Body>
                <Right style={{flex:1}}>
                    <Icon name='ios-log-out' onPress={()=>{this.confirmlogout()}} style={{color:'white'}} />
                </Right>
        </Header>






        <ScrollView>
  <View style={{width:width,alignItems:'center',justifyContent:'center'}}>
  <Image style={{margin:50}} source={require('../../assets/PPHSBanner.png')}/>
  </View>

 

   <View style={{width:'100%'}}>
        <ScrollView>
        <View style={styles.list}>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 0.8,
        
          }}>
         <TouchableOpacity  onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffAttendacne') :this.props.navigation.navigate('Attendance')}>
            <Image source={require('../../assets/Images/HomeImages/560.png')} style={{width:width*0.30,height:width*0.30}} ></Image></TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 0.8,
           
          }}>
           <TouchableOpacity  onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffProfile') :this.props.navigation.navigate('Profile')}>
            <Image source={require('../../assets/Images/HomeImages/568.png')} style={{width:width*0.30,height:width*0.30}} resizeMode='contain'></Image></TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 0.8,
           
          }}>
           <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffPoll') :this.props.navigation.navigate('Poll')}>
            <Image source={require('../../assets/Images/HomeImages/567.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 1.0,
          }}>
             <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffNews') :this.props.navigation.navigate('News')}>
            <Image source={require('../../assets/Images/HomeImages/565.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            margin: 5,
            opacity:  1.0,
          }}>
 <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffDailyActivity') :this.props.navigation.navigate('DailyActivity')}>
            <Image source={require('../../assets/Images/HomeImages/563.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            margin: 5,
            opacity:  1.0,
          }}>
            <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffNotice') :this.props.navigation.navigate('Notice')}>
            <Image source={require('../../assets/Images/HomeImages/566.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
        </View>
        <View style={styles.list}>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 1.0,
          }}>
          <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffGallery') :this.props.navigation.navigate('Gallery')}>
            <Image source={require('../../assets/Images/HomeImages/564.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 1.0,
          }}>
            <TouchableOpacity onPress={() => this.state.logintype=='1' || this.state.fname=='Admin'? this.props.navigation.navigate('Fees'):this.props.navigation.navigate('Stafffees')}>
            <Image source={require('../../assets/Images/HomeImages/561.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            margin: 5,
            opacity: 1.0,
          }}>
            <TouchableOpacity onPress={() =>this.props.navigation.state.params.roll_name==Teacher?alert('you are not authorized to access '):this.props.navigation.navigate('Admission')}>
            <Image source={require('../../assets/Images/HomeImages/562.png')} style={{width:width*0.30,height:width*0.30}}></Image></TouchableOpacity>
          </View>
        </View>
        <View style={styles.container} >
          <View>
          <Button iconLeft  warning style={{width:150,height:40,justifyContent:'flex-start',opacity:0.8,borderRadius:10}} onPress={() => this.props.navigation.navigate('contactus')}>
            <Icon name='ios-call' />
            <Text style={{color:'white'}}>Contact Us</Text>
          </Button>
          </View>
          </View>
        </ScrollView>
        </View>
        </ScrollView>
      </ImageBackground>
     
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',    
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 1 },
    width:'90%',
    alignSelf:'center',
   
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  scrollViewHolder:
  {   
    height:180
  }, 
});
