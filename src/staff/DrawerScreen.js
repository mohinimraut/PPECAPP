//DrawerScreen PPEC
'use strict'
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, StatusBar,Image,Dimensions ,ImageBackground} from 'react-native'
import * as Expo from "expo";
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon, Container, Header, Content, Left, Button, Body, Right, CardItem, ListItem, Footer, FooterTab } from 'native-base'
import Dialog, { DialogContent,SlideAnimation,ScaleAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { SQLite,  } from 'expo-sqlite';
import keys from '../api/keys';
var w = Dimensions.get('window').width;
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
          userid: '',
          dailoge:false,
          spinner:false,
          logintype:''
        };
      };
      componentDidMount() {
        this.getlogintype();
      
      }
   
      getlogintype(){
        var self=this;
        db.transaction((txn) => {
          txn.executeSql(
            "select * from tbllogin where isactive=1",[],
          function(tx, result) {
            console.log(result.rows.item(0))
            var data=result.rows.item(0);
           
            self.setState({logintype:data.LoginType})
            if(data.LoginType=='2'){
              self.Staffdata();
            }else{
              self.studdata()
            }
          }
        )
        })
      }
    
      async Staffdata() {
        var len = 0;
        db.transaction((txm) => {
    
          txm.executeSql("SELECT * FROM staffdetails where staffid =(select userid from tbllogin where isactive='1');", [], (tx, results) => {
            len = results.rows.length;
            console.log(len + 'new');
    
            if (len > 0) {
    
              this.setState({
                user_name: results.rows.item(0).fname + '  ' + results.rows.item(0).mname + '  ' + results.rows.item(0).lname,
              });
              this.setState({
    
                photopath: results.rows.item(0).photo_path.substring(2),
              });
              this.setState({
                usr_id: results.rows.item(0).staffid,
              });
              this.setState({
                datatest: results.rows.item(0),
                
              });
              console.log(results.rows.item(0)) 
            }
    
          });
        }, (error) => { console.log(error) })
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
    
      async logout() {
        var self=this;
        var deleteqry=''
        var data={                    
              "stud_id": this.state.usr_id,
          "stud_name":'',
          // "token": token,
          "is_active": true,
          // "model_name":Constants.deviceName,
          "manufacturer": '',
          "ip_addres": '',
          "created_date": new Date(),
          "extra1": "",
          "extra2": "",
          "extra3": "",
          "extra4": "",
          "extra5": "",
          "type": "LOGOUT"
        }
        console.log(data)
      //  var tokenstatus=await tokeninsert(data);
      //  console.log('fsdfsdfhsdfjlh.sdigh:'+tokenstatus)
        db.transaction((txn) => {
    var studid='';
          txn.executeSql("select * from tbllogin where isactive=1", [],
            function (tx, result) {
              console.log('got the student id')
              studid = result.rows.item(0).userid
              var logintype=result.rows.item(0).LoginType
              if(logintype=='2'){
                deleteqry='delete from staffdetails where staffid=?'
              }else{
                deleteqry='delete from studdetails where userid=?'
              }
              db.transaction((txn) => {
                txn.executeSql("delete from tbllogin where userid=?", [studid],
                  function () {
                    console.log('deleted form login login')
                  }),
                  
                  txn.executeSql(deleteqry, [studid],
                    function () {
                      console.log('deleted from  studdetails')
                      // Expo.Util.reload();
                    },
                  );
                  txn.executeSql("select * from tbllogin", [],
                    function (tx, result) {
                      console.log(result)
                      console.log(result.rows.length)
                      if(result.rows.length>0){
                        console.log('in logout')
                        var nextloginid=result.rows.item(0).userid;
                        db.transaction((txn) => {
                          txn.executeSql("update tbllogin set isactive='1' where userid=?", [nextloginid],
                            function (tx, result) {
                              console.log(result)
                              self.setState({visible2:false})
                              self.props.navigation.navigate("Login");
                            }),(() => { alert('error') })
                          })
                      }else{
                        console.log('in else')
                        self.setState({visible2:false})
                        self.props.navigation.navigate("Login");
                      }
                    },
                  );
              }, (() => { alert('error') })
              )
            },
          );
        }, (() => {
          alert('error')
        })
        )
      }
render(){
  console.log(keys.portal + this.state.photopath.substring(2))
    return(
        <Container>
          
          <Spinner
                        visible={this.state.spinner}
                        textContent={'Please Wait While Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
        
       <Header style={styles.headerstyle}>
          <ImageBackground style={{width:310}} source={require('../../assets/Techer_drawer_BK.jpg')}>
          
        <View style={{flexDirection:"row",flex:1}}>
          <View style={{borderRadius:25,justifyContent:'center',width:'40%',alignItems:'center'}}>
            {
              
              this.state.photopath=='' ? <Image style={{width: 100, height: 100,borderRadius:50}} source={require('../../assets/Images/DrawerImages/profile1.png')}></Image> :  <Image
              source={{uri: keys.portal +'/'+ this.state.photopath}}
              style={{width: 100, height: 100,borderRadius:50}}
          ></Image>
            }
         
          </View>
          <View style={{justifyContent:'center',alignItems:'center',width:'60%',flex:1}}>
                <Text style={{fontWeight:'bold',color:'white'}}>{this.state.user_name}</Text>
                <Text style={{fontWeight:'bold',color:'white'}}>{this.state.usr_id}</Text>
          </View>
          </View>
        
          </ImageBackground>
        </Header>
     {this.state.logintype==1?<View style={{height:45,backgroundColor:'#373737',flexDirection:"row",justifyContent:'center'}}>
                <View style={{backgroundColor:'#373737',width:'38%',alignSelf:'center',marginLeft:5,flexDirection:"row"}}><Text style={{color:'white'}}>Class: </Text><Text style={{fontWeight:'bold',color:'white'}}> {this.state.clasname}</Text></View>
                <View style={{width:1,backgroundColor:'white'}}></View>
                <View style={{backgroundColor:'#373737',width:'28%',alignSelf:'center',marginLeft:5,flexDirection:"row"}}><Text style={{color:'white'}}>DIV: </Text><Text style={{fontWeight:'bold',color:'white'}}> {this.state.divname}</Text></View>
                <View style={{width:1,backgroundColor:'white'}}></View>
                <View style={{backgroundColor:'#373737',width:'28%',alignSelf:'center',marginLeft:5,flexDirection:"row"}}><Text style={{color:'white'}}>Roll No:  </Text><Text style={{fontWeight:'bold',color:'white'}}>{this.state.rollno}</Text></View>
     </View>:null}
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
        <Dialog
            dialogAnimation={new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })}
            visible={this.state.dailoge}
            footer={

              <DialogFooter>
                <DialogButton
                  text="Yes"
                  onPress={() => this.logout()&& this.setState({dailoge:false})}
                  textStyle={{color:"#F57C00",fontWeight:"bold"}}
                />
                  <DialogButton
                  text="No"
                  onPress={() => this.setState({dailoge:false})}
                  textStyle={{color:"#F57C00",fontWeight:"bold"}}
                />
              </DialogFooter>
              

            }
          >
            <DialogContent style={{ height:200, width: w-50, alignItems:'center',}}>
            
              <View style={{justifyContent:'center',alignItems:'center',height:"60%"}}>
                <Image style={{height:120,width:120}} source={require('../../assets/ppeclogo.png')}></Image>
              </View>
              <View style={{justifyContent:'center',alignItems:'center',height:"40%"}}>
                <Text style={{fontWeight:"bold",}}>Are you sure you want to logout..</Text>
              </View>
            
            </DialogContent>
          </Dialog>
        <Footer>
          <FooterTab  style={{backgroundColor:'#F57C00'}}>  
            <Button full onPress={() => { this.setState({dailoge:true}) }}>
            <View style={{flexDirection:'row',}}>
                <View style={{justifyContent:'center'}}>
              <Text  style={{color:'white',fontWeight:'bold'}}>Log Out</Text></View>
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