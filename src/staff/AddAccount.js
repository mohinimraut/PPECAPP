import React from 'react';
import {View ,Text,ImageBackground,TouchableOpacity,Image,TextInput,KeyboardAvoidingView,Dimensions,Platform,Alert, Keyboard,StatusBar,StyleSheet} from 'react-native';
import Loader from '../components/Loader';
import NetInfo from "@react-native-community/netinfo";
import { login,LoadProfileData ,LoadStaffProfileData,tokeninsert} from '../api/index';
import { Container,Header, Button,Input , Toast, Root  } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
var h = Dimensions.get('window').height;
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

export default class AddAccount extends React.Component {
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
          name:'',
          spinner: false,
      
          
        }
        registerForPushNotificationsAsync();
        
      }
    
      managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
      }
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

          console.log(this.state.username, this.state.pwd)
        this.setState({ isloading:true})
        var connection = await NetInfo.fetch();
  console.log(connection.isConnected);
        if(connection.isConnected){
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
                   console.log('1')
                  }
                  else{
                    this._LoadStudent();
                    console.log('2')
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
              txn.executeSql('insert into studdetails (userid,user_f_name,user_m_name,user_l_name,rollno,divname,classname,adreess,photpath,signpath,academic,grno,category,caste,bloodgroup,city,state,fatherfname,motherfname,parentemail,parentmob,medium,extra1,extra5,extra4,extra2) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [studid, fname, mname, lname, rollno, divname, classname, adrress, photo, sign, academic, grno, categor, caste, boolgrb, city, state, fatherfname, motherfname, parentemail, parentmob, medium,gender,dob,pincode,stud_emailid],  
                    function () {
                        console.log('3')
              },
            ); 
            },(error=>{console.log(error)})
            )
            console.log('4')
           await this._loadlogintable(); 
      
          }
             
        }
      }
      //to check and insert into login table
     
async _loadlogintable(){
    var self=this
    var studid=self.state.user_id;
   // var type=self.state.logintype
   
   // var type=self.state.logintype
   var data={
    "stud_id": studid,
    "stud_name": this.state.name,
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
  console.log('rees'+ JSON.stringify(tokenstatus))
    console.log('1')
    db.transaction(async (txn) => {
      txn.executeSql("update tbllogin set isactive='0' where isactive='1'", [],
      function(tx, result) {
      console.log('all isactive st to 0')
    }),
      await txn.executeSql('select * from tbllogin where userid=?', [studid],
     await function(tx, results) {
      console.log('2')
        if(results.rows.length > 0){
          db.transaction(async(txn) => {
           await txn.executeSql("update tbllogin set isactive='1' where userid=?",[studid],
           await function(tx, result) {
            self.setState({
              spinner:false
            })
            self.props.navigation.navigate('Login')
            },
            ); 
          },(error=>{console.log(error)})
          )       
        }else{
          db.transaction(async(txn) => {
         await txn.executeSql('insert into tbllogin (userid,isactive,LoginType,username,password)  values(?,?,?,?,?)', [studid,'1',self.state.typelogin,self.state.username,self.state.pwd],
         await   function(tx, result) {
           self.setState({
             spinner:false
           })
           self.props.navigation.navigate('Login')
          },
          ); 
        },(error=>{console.log(error)})
        )
        }
      }
      ) 
    },(error=>{console.log(error)})
    )
    console.log('3');
  }
      //load staff data
       async _LoadStaff(){
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


    render (){
        return(
           <Container>
                <Root>
                <StatusBar backgroundColor="#9e9e9e" />
                <Spinner
                        isloading={this.state.spinner}
                        textContent={'Please Wait While Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
            <View style={{flex:1}}>
               <ImageBackground
    resizeMode={'stretch'} // or cover
    style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
    source={require('../../assets/attbackimage.png')}
    >
        {
            Platform.OS === 'ios' ?  <View style={{backgroundColor:'transparent',height:'10%',paddingTop:15}}>
            <View style={{flexDirection:'row',flex:1}}>
              <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
               </TouchableOpacity >
              </View>
              <View style={{flex:1,justifyContent:"center"}}>
                  <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>ADD ACCOUNT</Text>
              </View>
            </View>
           </View> :  <View style={{backgroundColor:'transparent',height:'8%'}}>
     <View style={{flexDirection:'row',flex:1}}>
       <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
       <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
       <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
        </TouchableOpacity >
       </View>
       <View style={{flex:1,justifyContent:"center"}}>
           <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>ADD ACCOUNT</Text>
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
     <View style={{height:'75%'}}>
   
     <View style={{flexDirection:"row",paddingTop:10,paddingBottom:8}}>
    
      <View style={{paddingLeft:20}}><Text style={{ color: '#ff7043',fontSize:20,fontWeight:"bold" }} >Username</Text></View>
     </View>
     <View style={{height:'15%',backgroundColor:'white',marginLeft:15,marginRight:15,paddingTop:5,elevation:2,borderWidth:2,borderColor:"#cfd8dc",borderRadius:6,justifyContent:'center'}}>
     <TextInput
      style={{paddingLeft:10,color:'black'}}
      placeholder='Type username here'
      onChangeText={(text)=>this.setState({username:text})}
      placeholderTextColor="#cfd8dc"
    />
     </View>
     <View style={{flexDirection:"row",paddingTop:20,paddingBottom:8}}>
  
      <View style={{paddingLeft:20}}><Text style={{ color: '#ff7043',fontSize:20,fontWeight:"bold" }} >Password</Text></View>
     </View>
     <View style={{height:'15%',backgroundColor:'white',marginLeft:15,marginRight:15,paddingTop:5,elevation:2,borderWidth:2,borderColor:"#cfd8dc",borderRadius:6,justifyContent:'center'}}>
     <TextInput
       style={{paddingLeft:10,color:'black'}}
      placeholder='Type password here'
      onChangeText={(text)=>this.setState({pwd:text})}
      placeholderTextColor="#cfd8dc"
    />
     </View>
    <View style={{justifyContent:"center",alignItems:"center",paddingTop:5}}>
    <Text>Forgot Password ?</Text>
    </View>
    <View style={{justifyContent:"center",alignItems:"center",paddingTop:15}}>
        <Button onPress={()=>{this.getlogin()}} style={{width:'80%',height:60,backgroundColor:"#ff7043",borderRadius:8}}>
            <View style={{justifyContent:"center",alignItems:"center",flex:1,flexDirection:"row"}}>
                <View><Text style={{color:'white',fontWeight:"bold",fontSize:20}}>Sign in</Text></View>
              
                
            </View>
        </Button>
    </View>

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