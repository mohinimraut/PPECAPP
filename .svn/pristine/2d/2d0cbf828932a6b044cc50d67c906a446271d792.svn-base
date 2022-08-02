'use strict'
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, StatusBar,Image } from 'react-native'
import * as Expo from "expo";
import { Icon, Container, Header, Content, Left, Button, Body, Right, CardItem, ListItem, Footer, FooterTab } from 'native-base'
import { SQLite,  } from 'expo-sqlite';

const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class DrawerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          photopath: '',
          user_name: '',
          usr_id: '',
          rollno: '',
          divname: '',
          clasname: '',
          userid: ''
        };
      };
      componentDidMount() {
        this.studdata();
      this.checktable();
      }
      checktable(){
        db.transaction(async(txn) => {
          txn.executeSql('select * from studdetails', [],
          function(tx, result) {
        console.log('staffdetails');
        console.log(result)
        },
        ),
          txn.executeSql('select * from tbllogin', [],
          function(tx, result) {
        console.log('tbllogin');
        console.log(result)
        },
        ); 
        },(error=>{console.log(error)})
        )
      }
      async studdata() {
        var len = 0;
        db.transaction((txm) => {
          txm.executeSql("SELECT * FROM studdetails where userid =(select userid from tbllogin where isactive='1');", [], (tx, results) => {
            len = results.rows.length;
            console.log(len + 'new');
    
            if (len > 0) {
    
              this.setState({
                user_name: results.rows.item(0).user_f_name + '  ' + results.rows.item(0).user_m_name + '  ' + results.rows.item(0).user_l_name,
              });
              this.setState({
    
                photopath: results.rows.item(0).photpath.substring(2),
              });
              this.setState({
                usr_id: results.rows.item(0).userid,
              });
              this.setState({
                rollno: results.rows.item(0).rollno,
              });
              this.setState({
                divname: results.rows.item(0).divname,
              });
              this.setState({
                clasname: results.rows.item(0).classname,
              });
            }
    
          });
        }, (error) => { console.log(error) })
      }
    
      logout() {
        var studid = ''
        db.transaction((txn) => {
          txn.executeSql("select * from tbllogin where isactive=1", [],
            function (tx, result) {
              console.log('got the student id')
              studid = result.rows.item(0).userid
              db.transaction((txn) => {
                txn.executeSql("delete from tbllogin where userid=?", [studid],
                  function (tx, result) {
                    console.log('deleted form login login')
                  }),
                  txn.executeSql("delete from studdetails where userid=?", [studid],
                    function (tx, result) {
                      console.log('deleted from  studdetails')
                      Expo.Util.reload();
                    },
                  );
              }, (error => { alert('error') })
              )
            },
          );
        }, (error => {
          alert('error')
        })
        )
      }
render(){
    
    return(
        <Container>
        <Header style={styles.headerstyle}>
        <View style={{flexDirection:"row",flex:1}}>
          <View style={{borderRadius:25,justifyContent:'center',width:'40%',alignItems:'center'}}>
          <Image style={{width: 100, height: 100,borderRadius:50}} source={require('../../assets/Images/DrawerImages/profile1.png')}></Image>
          </View>
          <View style={{justifyContent:'center',alignItems:'center',width:'60%',flex:1}}>
                <Text style={{fontWeight:'bold',color:'white'}}>{this.state.user_name}</Text>
                <Text style={{fontWeight:'bold',color:'white'}}>{this.state.usr_id}</Text>
          </View>
          </View>
        </Header>
     <View style={{height:45,backgroundColor:'#373737',flexDirection:"row",justifyContent:'center'}}>
                <View style={{backgroundColor:'#373737',width:'38%',alignSelf:'center',marginLeft:5,flexDirection:"row"}}><Text style={{color:'white'}}>Class: </Text><Text style={{fontWeight:'bold',color:'white'}}> {this.state.clasname}</Text></View>
                <View style={{width:1,backgroundColor:'white'}}></View>
                <View style={{backgroundColor:'#373737',width:'28%',alignSelf:'center',marginLeft:5,flexDirection:"row"}}><Text style={{color:'white'}}>DIV: </Text><Text style={{fontWeight:'bold',color:'white'}}> {this.state.divname}</Text></View>
                <View style={{width:1,backgroundColor:'white'}}></View>
                <View style={{backgroundColor:'#373737',width:'28%',alignSelf:'center',marginLeft:5,flexDirection:"row"}}><Text style={{color:'white'}}>Roll No:  </Text><Text style={{fontWeight:'bold',color:'white'}}>{this.state.rollno}</Text></View>
     </View>
        <Content>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/home.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('home') }}>
                <Text  style={styles.textstyle}>Home</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 35, height: 35}} source={require('../../assets/Images/DrawerImages/Attedane.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffAttendacne') :this.props.navigation.navigate('Attendance')}>
                <Text  style={styles.textstyle}>Attendance</Text>
              </TouchableOpacity>

            </Body>

          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30,borderRadius:50}} source={require('../../assets/Images/DrawerImages/profile.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => this.state.logintype=='2' ? this.props.navigation.navigate('StaffProfile') :this.props.navigation.navigate('Profile')}>
                <Text style={styles.textstyle}>Profile</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/fees.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => this.state.logintype=='2' ? alert('you are not authorized to access '):this.props.navigation.navigate('Fees')}>
                <Text  style={styles.textstyle}>Fees</Text>
              </TouchableOpacity>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/events.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('Events') }}>
                <Text  style={styles.textstyle}>Events</Text>
              </TouchableOpacity>

            </Body>

          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/chngepasswprd.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('ChangePassword') }}>
                <Text  style={styles.textstyle}>Change Password</Text>
              </TouchableOpacity>

            </Body>

          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/addacount.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('AddAccount') }}>
                <Text  style={styles.textstyle}>Add Account</Text>
              </TouchableOpacity>

            </Body>

          </ListItem>
          <ListItem icon>
            <Left>
            <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/switchacc.png')}></Image>
            </Left>
            <Body>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('SwitchAccountnew') }}>
                <Text  style={styles.textstyle}>Switch Account</Text>
              </TouchableOpacity>

            </Body>

          </ListItem>


        </Content>
        <Footer>
          <FooterTab  style={{backgroundColor:'#F57C00'}}>
             
            <Button full onPress={() => { this.logout() }}>
            <View style={{flexDirection:'row',}}>
                <View style={{justifyContent:'center'}}>
              <Text  style={{color:'white'}}>Log Out</Text></View>
              {/* <View style={{padding:10}}>
              <Image style={{width: 30, height: 30}} source={require('../../assets/Images/DrawerImages/logout.png')}></Image></View> */}
              </View>
            </Button>
           
          </FooterTab>
        </Footer>
      </Container>
    )
}
}

const styles = StyleSheet.create({

  image: {
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    width: 120,
    height: 120,
    // backgroundColor:'#fff',
    // borderRadius:100,

  },
  textstyle:{
      color:'#F57C00'
  },
  buttontest: {

    padding: 25,


  },
  body: {
    height: 70,
    width: 10,
  },
  headerstyle: {
    backgroundColor: '#bdbdbd',
    //margin:5
    height:150
  },
  Drawerimage: {
    flex: 1,
    borderRadius: 100,
    fontSize: 70,
    color: '#ff5722',
    width: 150,
    height: 70,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 200,
    backgroundColor: 'white'
  },
  carditem: {
    backgroundColor: '#212121',

  },
  drawerIcon: {
    width: 30, height: 30, borderRadius: 100
  }


});