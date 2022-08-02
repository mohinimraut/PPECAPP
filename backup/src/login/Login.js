'use strict'
import React from 'react';

import { Image, ImageBackground, Text, ScrollView,TextInput, KeyboardAvoidingView, Keyboard, Alert, NetInfo,Dimensions,StatusBar } from 'react-native'
import { Container, View, Button, Toast, Root } from 'native-base';

import { login,LoadProfileData ,LoadStaffProfileData,tokeninsert} from '../api/index';
import { SQLite,  } from 'expo-sqlite';
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
const db = SQLite.openDatabase('EDUDUNIYA.db');
var token='';
async function registerForPushNotificationsAsync() {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
       token = await Notifications.getExpoPushTokenAsync();  
    } catch (error) {
      console.log(error)
    }
    }
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          hidePassword: true,
          username: '',
          pwd: '',
          showToast: false,
          isFirstUser: false,
          isloading: false,
          isError:false,
          user_id:'',
          logintype:'',
          typelogin:'',
          name:''
          
        }
        registerForPushNotificationsAsync();
        
      }
    componentWillMount(){
    }
    logintablequery=()=>{
    }
     
    componentDidMount() {
      this.dropTable();
    // this.dropTable();
    // this.checktable();
    // this.CheckIfLoggedin();
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
    //just to clear tables
    dropTable(){
      console.log('entered in droptable function')
     // AsyncStorage.clear();
      db.transaction((tx) => {
        tx.executeSql(
          'drop table if exists staffdetails',
          [],
          console.log('dropped table student detail')
        );
        tx.executeSql(
          'drop table if exists tbllogin',
          [],
          console.log('dropped table student tbllogin'),
        );
        tx.executeSql(
          'drop table if exists studdetails',
          [],
          console.log('dropped table student tbllogin'),
        );
        },(error)=>{console.log(error)
      })
      console.log('exited the droptable function')
    }

    async CheckIfLoggedin() {
        var self=this;
        this.setState({
          isloading:true
        })
        //const userid=this.state.username
          await db.transaction(async tx => {
       
           await tx.executeSql(
              'create table if not exists tbllogin (userid text primary key not null,isactive text,LoginType text,username text ,password text,role_id text,extra1 text,extra2 text,extra3 text,extra4 text,extra5 text);',
            );
            await tx.executeSql(
              'CREATE TABLE IF NOT EXISTS studdetails( userid text primary key not null, user_f_name  text, user_m_name  text, user_l_name  text,rollno  text,divname  text,classname text,adreess text,photpath text,signpath text,academic text,grno text,category text,caste text,bloodgroup text,city text,state text,fatherfname text,motherfname text,parentemail text,parentmob text,medium text,extra1 text,extra2 text,extra3 text,extra4 text,extra5 text)',
              [],
            );
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Staffdetails(staffid text primary key not null, fname  text, mname  text, lname  text,gender  text,email  text,mob text,dob text,address1 text,city text,currentAcademic text,photo_path text,state text,academicID text,qualification text,designation text,department text,subject_name text,tagNo text,faceID text,div_ID text,class_ID text,medium_ID text,subject_ID text,designationID text,departmentID text,extra1 text,extra2 text,extra3 text,extra4 text,extra5 text)',
              [],
            );
            await tx.executeSql("select * from tbllogin  where isactive='1'", [],  await function(tx, result) {
      
              if (result.rows.length > 0) {
                self.setState({
                  isloading:false
                })
             if(result.rows._array[0].LoginType=='2'){
                  self.props.navigation.navigate('Home')
      
                }else{
               self.props.navigation.navigate('Home')
      
                }
            // (result.rows._array[0].LoginType=='2' ?   self.props.navigation.navigate('StHome') : self.props.navigation.navigate('Home'))
              }
              else {
                self.setState({
                  isloading:false
                })
              }
            });
          },(error=>{console.log(error)}));
        }
    managePasswordVisibility = () => {
      this.setState({ hidePassword: !this.state.hidePassword });
    }
    //to check user name and pasword are not invalid
    vallidate = async () => {
      if (this.state.username =='') {
        Alert.alert(
        'Eduduniya Says',
        'Please provide username',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
        )
        this.setState({ isloading:false,isError:true})
        }
        
        else if  (this.state.pwd =='') {
        this.setState({isError:true})
        Alert.alert(
          'Eduduniya Says',
          'Please provide password',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
          )
          this.setState({ isloading:false})
        }
        else{
          this.setState({isError:false})
        }
    }
    //check login
    getlogin = async () => {
      this.setState({ isloading:true})
      let isConnected=await NetInfo.isConnected.fetch()
      if(isConnected){
       await this.vallidate();
        if(this.state.isError==false){
          Keyboard.dismiss();
          const response = await login(this.state.username, this.state.pwd);
          console.log(response)
         this.setState({
          typelogin:response.loginType,
         })
         
        
          if (response == "error") {
            Toast.show({
              text: "Wrong password!",
              duration: 3000,
              position: "bottom"
            })
            this.setState({
              username:'',
              pwd:'',
              isloading:false
            })
          
          }
          else {
            Toast.show({
              text: "Correct password!",
              duration: 3000,
              position: "bottom"
            })
            this.setState({user_id:response.user_id});
            if(response.loginType=='2'){
      
              var len=0
              await db.transaction(async (tx) => {
                
              await  tx.executeSql('SELECT * from Staffdetails where  staffid=? ;', [this.state.user_id], (tx, results) => {
                len = results.rows.length;
                if(results.rows.length>0){
                 this._loadlogintable();
                }
                else{
                  this._LoadStaff();
                }
            });    
              },(error=>{console.log(error)}))
      
            }else{
              var len=0
              await db.transaction(async (tx) => {
                
              await  tx.executeSql('SELECT * from studdetails where  userid=? ;', [this.state.user_id], (tx, results) => {
                len = results.rows.length;
                if(results.rows.length>0){
                 this._loadlogintable();
                }
                else{
                  this._LoadStudent();
                }
            });    
              },(error=>{console.log(error)}))
      
            }
       
            
          }
        }
      }else{
        this.setState({ isloading:false})
        alert('No Internet...')
      }
     
    }
    //load student data
     _LoadStudent=async()=>{
      let isConnected=await NetInfo.isConnected.fetch()
      var response_new="";
      if(isConnected)
        {
          response_new = await LoadProfileData(this.state.user_id);
        if(response_new =='error'){
    
          alert('SOMETHING WENT WRONG...!')
    
        }
        else{
          this.setState({name:response_new[0].fname+' '+response_new[0].mname+' '+response_new[0].lname})
          const mname = response_new[0].mname
          const lname = response_new[0].lname
          const gender = response_new[0].gender;
          const fname = response_new[0].fname;
          const stud_emailid= response_new[0].studemail;
          const rollno = response_new[0].studAcademicArray[0].roll_no;
          const classname = response_new[0].studAcademicArray[0].class_name;
          const divname = response_new[0].studAcademicArray[0].div_name;
          const photo = response_new[0].photo_path;
          const sign = response_new[0].sign_path;
          var studid = response_new[0].studid;
          const adrress = response_new[0].address1;
          const academic = response_new[0].studAcademicArray[0].academic;
          const grno = response_new[0].studAcademicArray[0].grno;
          const categor = response_new[0].category;
          const caste = response_new[0].caste;
          const boolgrb = response_new[0].studbloodgrp;
          const city = response_new[0].city;
          const state = response_new[0].state;
          const fatherfname = response_new[0].fatherfname;
          const motherfname = response_new[0].motherfname;
          const parentemail = response_new[0].parentemail;
          const parentmob = response_new[0].parentmob;
          const medium = response_new[0].studAcademicArray[0].medium_name;
          const pincode=response_new[0].pincode;
          const dob=response_new[0].dob;
          db.transaction((txn) => {
            txn.executeSql('insert into studdetails (userid,user_f_name,user_m_name,user_l_name,rollno,divname,classname,adreess,photpath,signpath,academic,grno,category,caste,bloodgroup,city,state,fatherfname,motherfname,parentemail,parentmob,medium,extra1,extra5,extra4,extra2) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [studid, fname, mname, lname, rollno, divname, classname, adrress, photo, sign, academic, grno, categor, caste, boolgrb, city, state, fatherfname, motherfname, parentemail, parentmob, medium,gender,dob,pincode,stud_emailid],        function () {
            },
          ); 
          },(error=>{console.log(error)})
          )
         await this._loadlogintable(); 
    
        }
           
      }
    }
    //to check and insert into login table
    async _loadlogintable(){
      var self=this
      var studid=self.state.user_id;
      var roll_id=self.state.role_id;
     // var type=self.state.logintype
     var data={
      "stud_id": studid,
      "stud_name": this.state.name,
      "role_id":this.state.role_id,
      "token": token,
      "is_active": false,
      "model_name":Constants.deviceName,
      "manufacturer": '',
      "ip_addres": '',
      "created_date": new Date(),
      "extra1": "",
      "extra2": "",
      "extra3": "",
      "extra4": "",
      "extra5": "",
      "type": "LOGIN"
    }
    console.log(data)
    var tokenstatus=await tokeninsert(data);
    console.log('rees'+tokenstatus)
      db.transaction(async (txn) => {
        await txn.executeSql('select * from tbllogin where userid=?', [studid],
       await function(tx, results) {    
          if(results.rows.length > 0){
            self.setState({ isloading:false})
            db.transaction(async(txn) => {
             await txn.executeSql("update tbllogin set isactive='1' where userid=?",[studid],
             await function() {
                
                (self.state.typelogin=='2' ?   self.props.navigation.navigate('Home') : self.props.navigation.navigate('Home'))
              },
              ); 
            },(error=>{console.log(error)})
            )       
          }else{
            db.transaction(async(txn) => {
           await txn.executeSql('insert into tbllogin (userid,isactive,LoginType,username,password,role_id)  values(?,?,?,?,?,?)', [studid,'1',self.state.typelogin,self.state.username,self.state.pwd,self.state.role_id],
           await   function() {
              if(self.state.typelogin=='2'){
                self.setState({ isloading:false})
                self.props.navigation.navigate('Home')
              }else{
    
                self.setState({ isloading:false})
             self.props.navigation.navigate('Home')
    
              }
            },
            ); 
          
          },(error=>{console.log(error)})
          )
          }
        }
        ) 
      },(error=>{console.log(error)})
      )
    }
    //load staff data
     async _LoadStaff(){
      let isConnected=await NetInfo.isConnected.fetch()
      var response_new="";
       if(isConnected)
       {
         response_new = await LoadStaffProfileData(this.state.user_id);
         console.log(response_new)
         if(response_new=='error'){
           alert('SOMETHING WENT WRONG...!')
         }
         else{
          this.setState({name:response_new[0].fname+' '+response_new[0].mname+' '+response_new[0].lname})
          const staffid = response_new[0].staffid;
          const fname = response_new[0].fname;
          const mname = response_new[0].mname;
          const lname = response_new[0].lname;
          const academicID = response_new[0].staffAcademicArray[0].academicID;
          const qualification = response_new[0].staffAcademicArray[0].qualification;
          const designation = response_new[0].staffAcademicArray[0].designation;
          const gender = response_new[0].gender;
          const email = response_new[0].email;
          var mob = response_new[0].mob;
          const dob = response_new[0].dob;
          const address1 = response_new[0].address1;
          const pincode= response_new[0].pincode;
          const city = response_new[0].city;
          const currentAcademic = response_new[0].currentAcademic;
          const photo_path = response_new[0].photo_path;
          const state = response_new[0].state;
          const department = response_new[0].staffAcademicArray[0].department;
          const subject_name = response_new[0].staffAcademicArray[0].subject_name;
          const tagNo = response_new[0].staffAcademicArray[0].tagNo;
          const div_ID = response_new[0].staffAcademicArray[0].div_ID;
          const class_ID = response_new[0].staffAcademicArray[0].class_ID;
          const medium_ID = response_new[0].staffAcademicArray[0].medium_ID;
          const subject_ID = response_new[0].staffAcademicArray[0].subject_ID;
          const designationID = response_new[0].staffAcademicArray[0].designationID;
          const departmentID = response_new[0].staffAcademicArray[0].departmentID;
         await db.transaction((txn) => {
     
             txn.executeSql('SELECT * from Staffdetails where  staffid=? ;', [this.state.user_id], (tx, results) => {
             if(results.rows.length>0){
             }
             else{
              txn.executeSql('insert into Staffdetails (staffid, fname,mname, lname ,gender ,email  ,mob ,dob ,address1 ,city ,currentAcademic ,photo_path ,state ,academicID ,qualification ,designation,department ,subject_name ,tagNo ,faceID ,div_ID ,class_ID ,medium_ID ,subject_ID,designationID ,departmentID,extra3) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [staffid,fname,mname,lname,gender,email,mob,dob,address1,city,currentAcademic,photo_path,state,academicID,qualification,designation,department,subject_name,tagNo,div_ID,class_ID,medium_ID,subject_ID,designationID,departmentID,pincode],
              function () {
              },
            );
              
             }
         });  
            
          },(error=>{console.log(error)})
          )
         await this._loadlogintable();   
    
         }
        
     }
    
       
    }
    render (){
    return(
    <Root>
    <ImageBackground
    resizeMode={'stretch'} // or cover
    style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
    source={require('../../assets/attbackimage.png')}
    >
       <StatusBar backgroundColor="#37474f" barStyle="light-content" />
    <KeyboardAvoidingView  enabled>
    <ScrollView>
        <Container style={{ backgroundColor: 'transparent', }}>
        <View style={{flex:1,alignItems:'center',justifyContent:'space-around',}}>   
        <View style={{width:'100%',alignItems:'center',flex:1}}> 
            <View style={{height:120,width:120,marginTop:50,marginBottom:50}}>
                <Image source={require('../../assets/logo.jpg')} style={{height:120,width:120,borderRadius:60}}></Image>  
            </View>
            <Text style={{color:'white',fontSize:20,fontWeight:'bold',textAlign:'center',textShadowColor:'black',textShadowRadius:10}}>Sri Poorna Prajna Education Centre</Text>
        </View>
        <View style={{alignItems:'center',flex:1}}>
            <View style={{alignItems: 'center',flexDirection: 'row',width:'90%',borderWidth:1,borderRadius:50,borderColor:'white'}}>
                <Image source={require('../../assets/userid.png')} style={{marginLeft:15,marginRight:10,marginTop:10,marginBottom:10,height:35,width:35}}></Image>
                <TextInput
                    placeholder='USERNAME'
                    placeholderTextColor='white'
                    onChangeText={(text)=>this.setState({username:text})}
                    value={this.state.username}
                    style={{flex:1,color:'white',marginLeft:10,height:40,fontSize:20}}
                />
            </View>
            <View style={{marginTop:20,alignItems: 'center',flexDirection: 'row',width:'90%',borderWidth:1,borderRadius:50,borderColor:'white'}}>
                <Image source={require('../../assets/password.png')} style={{marginLeft:15,marginRight:10,marginTop:10,marginBottom:10,height:35,width:35}}></Image>
                <TextInput
                    placeholder='PASSWORD'
                    secureTextEntry
                    onChangeText={(text)=>this.setState({pwd:text})}
                    placeholderTextColor='white'
                    style={{flex:1,color:'white',marginLeft:10,height:40,fontSize:20}}
                />
            </View>
            <Button onPress={()=>{this.getlogin()}}  style={{width:'90%',backgroundColor:'white',borderRadius:50,margin:15}}>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize :20,color:'orange'}}>Login</Text>
                </View>
            </Button>
        </View>
        <View style={{margin:5,borderBottomWidth:1,borderColor:'white'}}>
            <Text style={{fontWeight:'bold',color:'white'}}>Powered by Nine Square Soultions</Text>
        </View>
    </View>
        </Container>
    </ScrollView>
    </KeyboardAvoidingView>
    </ImageBackground>
    </Root>

    )
    }
    }