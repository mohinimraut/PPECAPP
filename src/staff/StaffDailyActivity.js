'use strict'
import React from "react";
import { StatusBar, StyleSheet,TextInput, TouchableOpacity, Linking,View, Text, Image, Dimensions, ScrollView, ImageBackground  } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { SQLite } from 'expo-sqlite'
import  keys from '../api/keys'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { Academicdetails, Mediumnew, classdata,classdata1, division,division2,Subjectdata,deletedailyactivity,getdailyactivityedit, savedailyactivity,studentrollcall,getdailyactivityeditstud } from '../api/index';
import { createAppContainer } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";

import {

  Container,
  Card,
  CardItem,
  Body,
  Header,
  Left,
  Button,
  Form,Item,Label
} from "native-base";
import Modal from "react-native-modal";

var width = (Dimensions.get('window').width);
var newhigh = (Dimensions.get('window').height);
const db = SQLite.openDatabase('EDUDUNIYA.db');

var classlength = 0;
var finalfile='';
class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          today: '',
          switch:false,
          staff_id:'',
          isDateTimePickerVisible: false,
          academicid:'',
          activitylist:'',
          visible:false,
          selectedid:{},
          studentdata:[],
          filename:'select a file',
          editscreen:false,
          studtext:{},
          dailyActivity:'',
          homework:'',
          stud:{},
          visibledel:false,
          addfileoption:false,
        dates:''
        };
      };
    componentDidMount(){
      this._data();
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
   
    _handleDatePicked = (date) => {
           var datenew = date.toString();
           datenew = datenew.split('T');
       
               if(datenew[0]=='')
               {
                   datenew=datenew[1];
               }
               else
               {
                   datenew=datenew[0];
               }
           datenew = datenew.split(' ');
           var newmonth = '';
           if (datenew[1] === 'Jan') {
               newmonth = 1;
           }
           else if (datenew[1] === 'Feb') {
               newmonth = 2;
           }
           else if (datenew[1] === 'Mar') {
               newmonth = 3;
           }
           else if (datenew[1] === 'Apr') {
               newmonth = 4;
           }
           else if (datenew[1] === 'May') {
               newmonth = 5;
           }
           else if (datenew[1] === 'Jun') {
               newmonth = 6;
           }
           else if (datenew[1] === 'Jul') {
               newmonth = 7;
           }
           else if (datenew[1] === 'Aug') {
               newmonth = 8;
           }
           else if (datenew[1] === 'Sep') {
               newmonth = 9;
           }
           else if (datenew[1] === 'Oct') {
               newmonth = 10;
           }
           else if (datenew[1] === 'Nov') {
               newmonth = 11;
           }
           else if (datenew[1] === 'Dec') {
               newmonth = 12;
           }
           var changedate=datenew[2]+ '-' + newmonth + '-' + datenew[3] ;
           var dates=newmonth+ '/' +  datenew[2] + '/' + datenew[3] ;
           console.log("dates"+dates)
           this.setState({ today: changedate,activitylist:[] ,dates:dates});
           this._hideDateTimePicker();
       };

    async _data() {
        let isConnected=await NetInfo.isConnected.fetch()
        var self = this;
        db.transaction(async (txn) => {
            txn.executeSql("select * from tbllogin where isactive='1'", [],
                function (tx, result) {
                    self.setState({ staff_id: result.rows.item(0).userid })

                },
            )
        })
        if(isConnected){

            const response = await Academicdetails();
            const responsenew = await Mediumnew();

            if(response =='error' || responsenew=='error'){
                alert('Something Went Wrong....')
                this.setState({
                    spinner:false,
                    
                })
    
            }
            else{
                for (var i = 0; response.length > i; i++) {
                    this.setState({
                        academicyear: response[0].name,
                        mediumname: responsenew[0].name,
                        academicid: response[0].id,
                    })
                }
                var today = new Date();
                var dates=parseInt(today.getMonth() + 1)+ '/' +  today.getDate() + '/' + today.getFullYear() ;
                var date = today.getDate()+ "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear() ;
                this.setState({
                    today: date,
                    dates
                })
    
            }

        }else{
            alert('No Internet Connection...')

        }
     
      
    }

    async getData(){
        console.log(this.state.dates)
        var connection = await NetInfo.fetch();
        if(!connection.isConnected){
            alert('No internet  Connection');
            this.setState({newsdata:[]})
            return false
        }
    var result=await getdailyactivityedit(this.state.academicid,this.state.dates,this.state.staff_id);
    if(result.length>0){
    this.setState({activitylist:result})
    }else{
        alert('No activity on this date');
    }

    }

    async showeditmodel(id){
        try {
            
        var obj=[]
        this.state.activitylist.map(data=>{
            if(data.id==id){
                obj=data;
               
            }
        })
        var connection = await NetInfo.fetch();
        if(!connection.isConnected){
            alert('No internet  Connection');
            this.setState({newsdata:[]})
            return false
        }
        var stud=await getdailyactivityeditstud(id,this.state.dates,obj.staff_id,obj.subj_id)
        var studarr=stud.studHomeworkArrayedit;
        var temparr={};

        studarr.map((data)=>{
            temparr[data.studid]=data.personal_hw;
        })
        var obj1=stud.studHomeworkArrayedit.sort((a, b) => parseFloat(a.stud_roll_no) - parseFloat(b.stud_roll_no));
        console.log(obj1)
        this.setState({selectedid:obj,dailyActivity:obj['dailyActivity'],homework:obj['homework'],editscreen:true,stud:stud,studentdata:obj1,studtext:temparr})
    } catch (error) {
        console.log(error)  
        
    }
    }

    activities(){
        if(this.state.activitylist){
            return(
                <View style={{flex:1,alignItems:'center',marginTop:20}}>
                    {this.state.activitylist.map((data)=>{
                        return(
                            <TouchableOpacity  onPress={() => this.showeditmodel(data.id)}>
                            <View style={{backgroundColor:'#ffbb7e',borderRadius:5,width:width-50,marginTop:20}}>
                                <View style={{alignItems:'center',margin:5,backgroundColor:'#ff5722'}}>
                                    <Text style={{alignSelf:'center',fontSize:20,fontWeight:'bold'}}>{data.subjname}</Text>
                                </View>
                           
                                <View style={{margin:10}}>
                                 <Text>{data.homework}</Text>
                                <Text>{data.dailyActivity}</Text>
                            </View>
                            </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            )
        }
    }

    handletextinput(text, id) {

        var obj = this.state.studtext;
        obj[id] = text;
        this.setState({ studtext: obj })
    }

    async handlefile(){
        let result = await DocumentPicker.getDocumentAsync({});
        // console.log(result.uri)
		var file= await FileSystem.readAsStringAsync(
            result.uri,
            {
                encoding: FileSystem.EncodingType.Base64
            })
        .catch(err => {
                console.log("​getFile -> err", err);
             
            });

        
            finalfile=file;
            this.setState({filename:result.name });
                
            
        }
    async postactivity() {
            var arr = [];
            for (var key in this.state.studtext) {
                arr.push({ 'studid': key, 'personal_hw': this.state.studtext[key] })
            }
            if(this.state.filename=='select a file'){
                var filename=''
            }else{
                var filename=this.state.filename.split(' ').join('_');
            }

            var finalarr = {
                "studHomeworkArray": arr,
                "subjid": this.state.selectedid['subj_id'],
                "div_id": this.state.selectedid['div_id'],
                "staffid": this.state.staff_id,
                "ayid": this.state.academicid,
                "type": "update",
                "dailyActivity": this.state.dailyActivity,
                "homework": this.state.homework,
                "homework_date": this.state.dates,
                "subj_name": this.state.selectedid['subjname'],
                "div_name": this.state.selectedid['divname'],
                "class_name": this.state.selectedid['class_name'],
                "medium_name": "english",
                "id": this.state.selectedid['id'],
                "imagePath": filename,
                "databyte": finalfile
                
            }
            console.log(finalarr)
            var connection = await NetInfo.fetch();
            console.log(connection.isConnected);
            if(!connection.isConnected){
                alert('No internet  Connection');
                return false
            }
          var result=await savedailyactivity(finalarr);
           
           if(result=='error'){
               alert('something went Wrong')
           }else{
               alert('Updated Successfully');
               try {
            
              
              
               this.setState({editscreen:false,activitylist:[],addfileoption:false})
            } catch (error) {
                   console.log(error)
            }
           }

    }

    async deleteactivity(){
        var connection = await NetInfo.fetch();
        if(!connection.isConnected){
            alert('No internet  Connection');
            this.setState({newsdata:[]})
            return false
        }
    var result=await deletedailyactivity(this.state.staff_id,this.state.selectedid['id'] );
    if(result=='success'){
        alert('deleted successfully');
        this.setState({editscreen:false,activitylist:[],visibledel:false,addfileoption:false})
    }else{
        alert('Something went Wrong');
        this.setState({editscreen:false,activitylist:[],addfileoption:false})
    }
    }

    editview(){
        if(this.state.selectedid){
            console.log("selctedid"+JSON.stringify(this.state.selectedid))
            return(
                <View style={{ flex:1,backgroundColor:'white' }}>
                 <View style={{flex:1,margin:10}}>
                 <ScrollView style={{flex:1}}>

                 <View style={{flexDirection:'row',height:50}}> 
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>Medium</Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>:</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>English</Text>
                    </View>
                 </View>

                 <View style={{flexDirection:'row',height:50}}>
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>Class</Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>:</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>{this.state.selectedid['classname']}</Text>
                    </View>
                 </View>

                 <View style={{flexDirection:'row',height:50}}>
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>Division</Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>:</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>{this.state.selectedid['divname']}</Text>
                    </View>
                 </View>

                 <View style={{flexDirection:'row',height:50}}>
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>Subject</Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>:</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>{this.state.selectedid['subjname']}</Text>
                    </View>
                 </View>

                 <View style={{flexDirection:'row',height:50}}>
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>Daily Activity</Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>:</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    <TextInput
                    value={this.state.dailyActivity}
                    placeholder='Enter daily activity'
                    style={{ flex: 1 }}
                     editable={true}
                    maxLength={150}
                    onChangeText={(text) => { this.setState({ dailyActivity: text }) }}
                    />
                    </View>
                 </View>

                 <View style={{flexDirection:'row',height:50}}>
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>Homework</Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>:</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                    <TextInput
                    placeholder='Enter Home Work'
                    value={this.state.homework}
                    style={{ flex: 1 }}
                     editable={true}
                    maxLength={150}
                    multiline
                    numberOfLines={4}
                    onChangeText={(text) => { this.setState({ homework: text }) }}
                    />
                    </View>
                 </View>
                

                {this.state.stud.imagePath==""?
                <View></View>
                :
                 <View style={{flexDirection:'row',flex:1,height:50,alignItems:'center'}}>
                    <View style={{width:100,justifyContent:'center'}}>
                        <Text style={{fontSize:20,}}>File </Text>
                    </View>
                    <View style={{width:20,justifyContent:'center'}}>
                        <Text style={{fontSize:20}}>:</Text>
                    </View>
                     <TouchableOpacity onPress={()=>{ Linking.openURL(keys.portal+'staff/homework/'+this.state.stud.staffid+'_'+this.state.stud.imagePath)}}>                  
                        <Text style={{fontSize:20,fontweight:'bold',color:'pink'}}>View File</Text>
                    </TouchableOpacity>
                    
                 </View>}
                

                {this.state.addfileoption?
                     <View style={{flexDirection:'row',height:50}}>
                     <View style={{ flex:1,width:100,justifyContent:'center'}}>
                         <Text style={{fontSize:20}}>{this.state.filename}</Text>
                     </View>
 
                     <View style={{justifyContent:'center'}}>
                     <Button style={{width:100,color:'blue',marginLeft:50,borderRadius:10}} onPress={()=>{this.handlefile()}}>
                         <View style={{flex:1,alignItems:'center'}}>
                             <Text style={{color:'white'}}>Browse</Text>
                         </View>
                     </Button>
 
                     </View>
                  </View>
                    :
                    <View style={{flexDirection:'row',height:50,flex:1,alignItems:'center'}}>
                    <Button style={{flex:1,backgroundColor:'#ff5722',alignSelf:'center',borderRadius:10}} onPress={()=>{this.setState({addfileoption:true})}}>
                    <View style={{flex:1,alignItems:'center'}}>
                        <Text style={{color:'white'}}>Add file</Text>
                    </View>
                    </Button>
                    </View>
                   
                }
                <View style={{flex:1,backgroundColor:'#ffbb7e'}}>
                
                {this.state.studentdata?this.state.studentdata.map((data) => {
                                return (
                                    <View style={{ flex: 1, width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 10 }}>
                                        <View style={{ flex: 1, paddingBottom: 8 }}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{data.stud_name}</Text>
                                        </View>
                                        <Text Style={{ fontSize: 15 }}>{data.stud_roll_no}</Text>

                                        <TextInput
                                        value={this.state.studtext[data.studid]}
                                            placeholder='Enter Home Work'
                                            style={{ flex: 1 }}
                                            onChangeText={(text) => { this.handletextinput(text, data.studid)  }}
                                            editable={true}
                                            maxLength={150}
                                        />
                                    </View>
                                )
                            }):<View></View>}
                </View>
                 </ScrollView>   

                <View style={{height:75,alignItems:'center',flexDirection:'row'}}>
                <View style={{flex:1,alignItems:'center'}}>
                    <Button style={{width:75,backgroundColor:'#ff5722',borderRadius:10,alignSelf:'center'}} onPress={()=>{this.postactivity()}}>
                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{color:'white'}}>Update</Text>
                        </View>
                    </Button>
                </View>
                <View style={{flex:1,alignItems:'center',borderRadius:10}}>
                    <Button style={{width:75,backgroundColor:'#ff5722',alignSelf:'center',borderRadius:10}} onPress={()=>{this.deleteactivity()}}>
                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{color:'white'}}>Delete</Text>
                        </View>
                    </Button>
                
                </View>
                <View style={{flex:1,alignItems:'center',borderRadius:10}}>
                    <Button style={{width:75,backgroundColor:'#ff5722',alignSelf:'center',borderRadius:10}} onPress={()=>{this.setState({editscreen:false})}}>
                        <View style={{flex:1,alignItems:'center'}}>
                            <Text style={{color:'white'}}>Cancel</Text>
                        </View>
                    </Button>
                </View>
                    </View>
                </View>
                </View>    

               
            )
        }
    }

    mainscreen(){
        if(this.state.editscreen){
        return(
            this.editview()
        )
        }else{
            return(
            <View style={{flex:1}}>
                <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
       <View>
       <Text style={{margin:20,fontSize:20}}>Select Date</Text> 
       </View>
       <View style={{padding:25}}>
       <TouchableOpacity onPress={()=> this.setState({isDateTimePickerVisible:true})}>
                <Text style={{fontSize:20}}>
                 {this.state.today}
                </Text>
                </TouchableOpacity>
<View style={{borderBottomWidth:1,width:width}}></View>
           </View>
           <View style={{alignContent:'center',alignSelf:"center",justifyContent:'center',alignItems:'center'}}>
               <Button style={{width:200,backgroundColor:'#ff5722',borderRadius:10}} onPress={()=>this.getData()}>
                    <View style={{flex:1,alignContent:'center',alignSelf:"center",justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:15}}>Get Data</Text>
                    </View>
               </Button>
           </View>
           <ScrollView style={{ flex: 1 }}>
           {this.activities()}
           </ScrollView>
           </View>
            )
        }
    }

    render() {
      return (
        <View style={{justifyContent: 'center',flex:1,alignContent:'center' }}>
         <ImageBackground
                    resizeMode={'cover'}
                    style={{ flex: 1 }}
                    source={require('../../assets/background.png')}
                >
                {this.mainscreen()}           
           </ImageBackground>
        </View>
      );
    }
  }

class HomeScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          isModalVisible: false,
          isDateTimePickerVisible: false,
          classmodal: false,
          switch: true,
          academicdata: [],
          academicyear: '',
          academicid: '',
          attendancedatanew: [],
          isloading: false,
          staff_id: '',
          clasdata: [],
          divisiondata: [],
          divisonname: '',
          subjectdata: [],
          subjectname: '',
          subjectid: '',
          subjectmodal: false,
          divisionid: '',
          classname: '',
          mediumname: '',
          spinner: true,
          classid: '',
          classthieght: 250,
          subjectmargin: 10,
          today: [],
          divisionmodal: false,
          totalcount: '',
          presentcount: '',
          absentcount: '',
          studentrollcall: '',
          studscreen: false,
          studtext: {},
          dailyActivity: '',
          homework: '',
          filename:' select a file to upload',
          fileext:'',
          dates:''
          

      }
      this._data = this._data.bind(this)
  }
  componentDidMount() {
      this._data()

  }

  async openAndroidDatePicker() {

      if (Platform.OS === 'ios') {
          try {
              const { action, year, month, day } = await DatePickerIOS.open();
              if (action === DatePickerIOS.dismissedAction) {
              } else {
                  var newmonth = '';
                  if (month === 0) {
                      newmonth = 1;
                  }
                  else if (month === 1) {
                      newmonth = 2;
                  }
                  else if (month === 2) {
                      newmonth = 3;
                  }
                  else if (month === 3) {
                      newmonth = 4;
                  }
                  else if (month === 4) {
                      newmonth = 5;
                  }
                  else if (month === 5) {
                      newmonth = 6;
                  }
                  else if (month === 6) {
                      newmonth = 7;
                  }
                  else if (month === 7) {
                      newmonth = 8;
                  }
                  else if (month === 8) {
                      newmonth = 9;
                  }
                  else if (month === 9) {
                      newmonth = 10;
                  }
                  else if (month === 10) {
                      newmonth = 11;
                  }
                  else if (month === 11) {
                      newmonth = 12;
                  }
                  // <<<< Newly selected date >>>>
                  var date = day+ '-' + newmonth + '-' + year ;
                  this.setState({
                      today: date
                  })
              }

          } catch ({ code, message }) {
              console.warn('Cannot open date picker', message);
          }




      }
      else {

          var date = [];
          try {
              const { action, year, month, day } = await DatePickerAndroid.open();
              if (action === DatePickerAndroid.dismissedAction) {
              } else {
                  var newmonth = '';
                  if (month === 0) {
                      newmonth = 1;
                  }
                  else if (month === 1) {
                      newmonth = 2;
                  }
                  else if (month === 2) {
                      newmonth = 3;
                  }
                  else if (month === 3) {
                      newmonth = 4;
                  }
                  else if (month === 4) {
                      newmonth = 5;
                  }
                  else if (month === 5) {
                      newmonth = 6;
                  }
                  else if (month === 6) {
                      newmonth = 7;
                  }
                  else if (month === 7) {
                      newmonth = 8;
                  }
                  else if (month === 8) {
                      newmonth = 9;
                  }
                  else if (month === 9) {
                      newmonth = 10;
                  }
                  else if (month === 10) {
                      newmonth = 11;
                  }
                  else if (month === 11) {
                      newmonth = 12;
                  }

                  // <<<< Newly selected date >>>>
                  var date = year + '-' + newmonth + '-' + day;
                  this.setState({
                      today: date
                  })
              }

          } catch ({ code, message }) {
              console.warn('Cannot open date picker', message);
          }

      }

  }
  _Foracademic(id) {
      for (var i = 0; this.state.academicdata.length > i; i++) {
          if (id == this.state.academicdata[i].id) {
              this.setState({
                  academicyear: this.state.academicdata[i].name,
                  academicid: this.state.academicdata[i].id,
              })

          }

      }
      this.setState({

          isModalVisible: false,

      })



  }
  _academicdetailsnew() {
      console.log('in academic')
      console.log(this.state.academicdata)
      return (
          <View style={{ height: 250, width: 280, backgroundColor: 'white',borderRadius:10}}>
             
                  <Text style={{ color: '#ff5722', fontSize: 20, alignSelf: 'center',marginBottom:5,fontWeight:'bold',marginBottom:10}}> Select Academic Year</Text>
              {   this.state.academicdata.length >'0' ?
                  this.state.academicdata.map((data) => {
                      return (
                          <View style={{ alignSelf: 'center', color: 'white',padding:10,borderWidth:2,marginBottom:4,borderColor:'#ff5722'}}>
                              <TouchableOpacity key={data.id} onPress={() => (this._Foracademic.bind(this))(data.id)}>
                                  <Text style={{ fontSize: 15 }}>{data.name} </Text>
                              </TouchableOpacity>
                          </View>
                           )
                  }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>
              }
              <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}} >
                  <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={() => this.setState({ isModalVisible: false, })}>
                      <Text style={{ color: '#ff5722',fontSize:20,fontWeight:'bold',marginBottom:10,marginRight:15 }}>CANCEL</Text>
                  </TouchableOpacity>
              </View>
          </View>


      )

  }
  _getclass(id) {
      for (var i = 0; this.state.clasdata.length > i; i++) {
          if (id == this.state.clasdata[i].class_id) {
              this.setState({
                  classname: this.state.clasdata[i].class_name,
                  classid: this.state.clasdata[i].class_id,
                  classmodal: false,
                  divisonname: '',

              })


          }

      }

  }
  _getdivision(id) {
      for (var i = 0; this.state.divisiondata.length > i; i++) {
          if (id == this.state.divisiondata[i].div_id) {
              this.setState({
                  divisonname: this.state.divisiondata[i].div_name,
                  divisionid: this.state.divisiondata[i].div_id,
                  divisionmodal: false,

              })


          }

      }

  }
  _classdetailsnew() {
      var height2 = 350;
      if (classlength > 5) {

          height2 = newhigh - 50;
      }
      return (


          <Card style={{ height: height2, width: 350, }}>
              <CardItem header bordered style={{ alignSelf: "center", width: 350 }}>
                  <Text style={{ fontSize: 15 }}>Select Class</Text>
              </CardItem>
              {

                  this.state.clasdata.map((data) => {
                      return (

                          <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                              <TouchableOpacity key={data.class_id} onPress={() => (this._getclass.bind(this))(data.class_id)} style={{ flex: 1 }}>
                                  <CardItem bordered style={{ width: 350, }}>
                                      <Text> {data.class_name}</Text>
                                  </CardItem>
                              </TouchableOpacity>
                          </Body>


                      )


                  })

              }
              <CardItem footer style={{ alignSelf: "flex-end" }}>
                  <TouchableOpacity onPress={() => this.setState({ classmodal: false, })}>
                      <Text style={{ fontSize: 20 }}>Cancel</Text>
                  </TouchableOpacity>

              </CardItem>
          </Card>

      )

  }
  _divisonnew() {
      return (


          <Card style={{ height: 350, width: 350, }}>
              <CardItem header bordered style={{ alignSelf: "center", flex: 1, width: 350 }}>
                  <Text style={{ fontSize: 20 }}>Select Divison</Text>
              </CardItem>
              {

                  this.state.divisiondata.map((data) => {
                      return (
                          <ScrollView>
                              <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                  <TouchableOpacity key={data.div_id} onPress={() => (this._getdivision.bind(this))(data.div_id)} style={{ flex: 1 }}>
                                      <CardItem bordered style={{ width: 350, }}>
                                          <Text> {data.div_name}</Text>
                                      </CardItem>
                                  </TouchableOpacity>
                              </Body>
                          </ScrollView>

                      )


                  })

              }
              <CardItem footer style={{ alignSelf: "flex-end" }}>
                  <TouchableOpacity onPress={() => this.setState({ divisionmodal: false, })}>
                      <Text style={{ fontSize: 20 }}>Cancel</Text>
                  </TouchableOpacity>

              </CardItem>
          </Card>

      )

  }
  async  _classcall() {
      var staffid = this.state.staff_id;
      var connection = await NetInfo.fetch();
      if(!connection.isConnected){
          alert('No internet  Connection');
          this.setState({newsdata:[]})
          return false
      }
      const classdatanew = await classdata1(staffid);
      for (var i = 0; classdatanew.length > i; i++) {

          classlength++;
      }
      this.setState({
          clasdata: classdatanew,
          classmodal: true,
          classthieght: classlength,
      })
  }
  
  async _data() {
      var self = this;
      db.transaction(async (txn) => {
          txn.executeSql("select * from tbllogin where isactive='1'", [],
              function (tx, result) {
                  self.setState({ staff_id: result.rows.item(0).userid })

              },
          )
      })
      var connection = await NetInfo.fetch();
      if(!connection.isConnected){
          alert('No internet  Connection');
          this.setState({newsdata:[]})
          return false
      }
      const response = await Academicdetails();
      const responsenew = await Mediumnew();
      for (var i = 0; response.length > i; i++) {
          this.setState({
              academicyear: response[0].name,
              mediumname: responsenew[0].name,
              academicid: response[0].id,
          })
      }
      var today = new Date();
      var dates=parseInt(today.getMonth() + 1)+ '/' +  today.getDate() + '/' + today.getFullYear() ;
      var date = today.getDate()+ "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear() ;
      this.setState({
          today: date,
          academicdata: response,
          spinner: false,
          dates
      })
  }
  async _divisioncall() {
    // ***************
    var classid = this.state.classid;
    if (this.state.classname == '') {
        alert('please select class')
    }
    else {
        var connection = await NetInfo.fetch();
        console.log(connection.isConnected);
        if(!connection.isConnected){
            alert('No internet  Connection');
            return false
        }        
        const response = await division2(this.state.staff_id);
        const found = response.filter(element => element.class_id==classid);
        console.log("found----------Mohini",found)
        const array = Object.values( found );
        console.log("responsewholedivision------Mohini"+response)                     
     if(response=='error'){alert('SOMETHING WENT WRONG...!')}else{
        this.setState({
            divisiondata: array,
            divisionmodal: true,
        })
     }            
    }
}
  _getsubjtecname(id) {
      for (var i = 0; this.state.subjectdata.length > i; i++) {
          if (id == this.state.subjectdata[i].id) {
              this.setState({
                  subjectname: this.state.subjectdata[i].name,
                  subjectid: this.state.subjectdata[i].id,
                  subjectmodal: false,
              })


          }

      }

  }

  _subjectmodaldata() {
      var height2 = 350;
    
      if (classlength >= 4) {

          height2 = newhigh - 50;
      }
   
      return (


          <Card style={{ height: 250, width: 350, }}>
              <CardItem header bordered style={{ alignSelf: "center", width: 350 }}>
                  <Text style={{ fontSize: 15 }}>Select Subject</Text>
              </CardItem>
              <ScrollView>
                  {

                      this.state.subjectdata.map((data) => {
                          return (

                              <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                  <TouchableOpacity key={data.id} onPress={() => (this._getsubjtecname.bind(this))(data.id)} style={{ flex: 1 }}>
                                      <CardItem bordered style={{ width: 350, }}>
                                          <Text > {data.name}</Text>
                                      </CardItem>
                                  </TouchableOpacity>
                              </Body>


                          )


                      })

                  }
              </ScrollView>
              <CardItem footer style={{ alignSelf: "flex-end" }}>
                  <TouchableOpacity onPress={() => this.setState({ subjectmodal: false, })}>
                      <Text style={{ fontSize: 20 }}>Cancel</Text>
                  </TouchableOpacity>

              </CardItem>
          </Card>

      )

  }
  async   _subjectscall() {
      try{
      if (this.state.classid == '') {
          alert('Please select Class')
      }
      else {
        var connection = await NetInfo.fetch();
        if(!connection.isConnected){
            alert('No internet  Connection');
            this.setState({newsdata:[]})
            return false
        }
          const response = await Subjectdata(this.state.classid);
          this.setState({
              subjectdata: response,
              subjectmodal: true,
          })
      }
  }catch(e){
      console.log(e)
  }
  }

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  _handleDatePicked = (date) => {
      var datenew = date.toString();
      datenew = datenew.split('T');
      if (datenew[0] == '') {
          datenew = datenew[1];
      }
      else {
          datenew = datenew[0];
      }
      datenew = datenew.split(' ');

      var newmonth = '';
      if (datenew[1] === 'Jan') {
          newmonth = 1;
      }
      else if (datenew[1] === 'Feb') {
          newmonth = 2;
      }
      else if (datenew[1] === 'Mar') {
          newmonth = 3;
      }
      else if (datenew[1] === 'Apr') {
          newmonth = 4;
      }
      else if (datenew[1] === 'May') {
          newmonth = 5;
      }
      else if (datenew[1] === 'Jun') {
          newmonth = 6;
      }
      else if (datenew[1] === 'Jul') {
          newmonth = 7;
      }
      else if (datenew[1] === 'Aug') {
          newmonth = 8;
      }
      else if (datenew[1] === 'Sep') {
          newmonth = 9;
      }
      else if (datenew[1] === 'Oct') {
          newmonth = 10;
      }
      else if (datenew[1] === 'Nov') {
          newmonth = 11;
      }
      else if (datenew[1] === 'Dec') {
          newmonth = 12;
      }
      var changedate= datenew[2]+ '-' + newmonth + '-' +  datenew[3];
      this.setState({ today: changedate });
      var dates= newmonth+'/' + datenew[2] + '/' +  datenew[3];
      this.setState({dates:dates})
      this._hideDateTimePicker();
  };
  // ---------to fetch student ---------------------
  async getstudent() {
      if(this.state.dailyActivity=='' && this.state.homework=='' ){
          alert('Fill homework ')    
      }else{
          if(this.state.divisionid!=''){
      this.setState({ spinner: true })
      var connection = await NetInfo.fetch();
      if(!connection.isConnected){
          alert('No internet  Connection');
          this.setState({newsdata:[]})
          return false
      }
      var student = await studentrollcall(this.state.academicid, this.state.divisionid)
      if (student == 'error') {
          this.setState({ spinner: false })
          alert('something went wrong');
          this.props.navigation.navigate('StaffHome')

      } 
      else if(student == 'No Data'){
          alert('no student found in this division');
          this.setState({  spinner: false, })
      }
      else {
          student.sort((a, b) => parseFloat(a.roll_no) - parseFloat(b.roll_no));
          var obj = {};
          student.map((data) => {
              obj[data.stud_id] = '';
          });
          this.setState({ studentdata: student, spinner: false, studscreen: true, studtext: obj })
      }
  }
  }   
  }

  handletextinput(text, id) {
      var obj = this.state.studtext;
      obj[id] = text;
      this.setState({ studtext: obj })
  }
  async postactivity() {
      this.setState({spinner:true})
      var arr = [];
      for (var key in this.state.studtext) {
          arr.push({ 'studid': key, 'personal_hw': this.state.studtext[key] })
      };
     
      var finalarr = {
          "studHomeworkArray": arr,
          "subjid": this.state.subjectid,
          "div_id": this.state.divisionid,
          "staffid": this.state.staff_id,
          "ayid": this.state.academicid,
          "type": "save",
          "dailyActivity": this.state.dailyActivity,
          "homework": this.state.homework,
          "homework_date": this.state.dates,
          "subj_name": this.state.subjectname,
          "div_name": this.state.divisonname,
          "class_name": this.state.classname,
          "medium_name": "english",
          "id": "",
          "imagePath": this.state.filename==' select a file to upload'?"":this.state.filename.split(' ').join('_'),
          "databyte": finalfile
      }
      var connection = await NetInfo.fetch();
      if(!connection.isConnected){
          alert('No internet  Connection');
          this.setState({newsdata:[]})
          return false
      }
      var result=await savedailyactivity(finalarr);
      console.log(result)
     if(result=='error'){
      this.setState({spinner:false})
         alert('something went wrong')
         this.setState({studscreen: false})
         this.props.navigation.navigate('Homes')
     }else{
      this.setState({spinner:false})
      alert('Saved successfully');
      this.setState({studscreen: false,
          clasdata: [],
          divisiondata: [],
          subjectdata: [],
          classname:'',
          subjectname:'',
          divisonname:''

      })
   
     }
     this.props.navigation.navigate('Homes')
  }
  async handlefile(){
      let result = await DocumentPicker.getDocumentAsync({});
      var file= await FileSystem.readAsStringAsync(
          result.uri,
          {
              encoding: FileSystem.EncodingType.Base64
          })

      .catch(err => {
              console.log("​getFile -> err", err);
           
          });
      finalfile=file;
      var filename=result.name;
 
      try {
          var fileext=filename.substring(filename.lastIndexOf(".")+1);
      this.setState({filename:result.name,fileext:fileext});
          
      } catch (error) {
         console.log(error)
      }
      
  }

  studscreen() {
      if (this.state.studscreen) {
          return (
              <View style={{ flex: 1 }}>
                  <ScrollView style={{ flex: 1 }}>
                      <View style={{ margin: 10 }}>

                          {this.state.studentdata.map((data) => {
                              return (
                                  <View style={{ flex: 1, width: width - 20, borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 10 }}>
                                      <View style={{ flex: 1, paddingBottom: 8 }}>
                                          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{data.name}</Text>
                                      </View>
                                      <Text Style={{ fontSize: 15 }}>{data.roll_no}</Text>

                                      <TextInput
                                          placeholder='Enter Home Work'
                                          style={{ flex: 1 }}
                                          onChangeText={(text) => { this.handletextinput(text, data.stud_id) }}
                                          editable={true}
                                          maxLength={150}
                                      />
                                  </View>
                              )
                          })}

                      </View>
                  </ScrollView>
                  <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                      <Button style={{ backgroundColor: 'skyblue', width: 150,borderRadius:10 }} onPress={() => { this.postactivity() }}>
                          <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                              <Text>Save</Text>
                          </View>
                      </Button>
                      <Button style={{ backgroundColor: 'skyblue',borderRadius:10, width: 150, marginLeft: 50 }} onPress={() => { this.setState({ studscreen: false }) }}>
                          <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                              <Text>Cancel</Text>
                          </View>
                      </Button>
                  </View>
              </View>

          )
      } else {
          return (

              <ScrollView>
                  <View>
                      
                      <DateTimePicker
                          mode={'date'}
                          isVisible={this.state.isDateTimePickerVisible}
                          onConfirm={this._handleDatePicked}
                          onCancel={this._hideDateTimePicker}
                      />
                      <Form>

                          <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }} >
                              <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })} style={{ flex: 1 }}>
                                  <Label style={styles.labels}>From Date:</Label>
                                  <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.today}</Text>
                              </TouchableOpacity>
                          </Item>

                          <View>
                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <TouchableOpacity onPress={() => this.setState({ isModalVisible: true })} style={{ flex: 1 }}>
                                      <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.academicyear}</Text>
                                  </TouchableOpacity>
                              </Item>
                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.mediumname}</Text>
                              </Item>

                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <TouchableOpacity onPress={() => this._classcall()} style={{ flex: 1 }}>
                                      <Label style={styles.labels}>Select Class</Label>
                                      <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.classname}</Text>
                                  </TouchableOpacity>
                              </Item>

                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <TouchableOpacity onPress={() => this._subjectscall()} style={{ flex: 1 }}>
                                      <Label style={styles.labels}>Select Subjects</Label>
                                      <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.subjectname}</Text>
                                  </TouchableOpacity>
                              </Item>


                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <TouchableOpacity onPress={() => this._divisioncall()} style={{ flex: 1 }}>
                                      <Label style={styles.labels}>Select Division</Label>
                                      <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.divisonname}</Text>

                                  </TouchableOpacity>
                              </Item>

                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <TextInput
                                      placeholder='Enter Home Work'
                                      style={{ flex: 1 }}
                                      editable={true}
                                      maxLength={150}
                                      multiline
                                      numberOfLines={4}
                                      onChangeText={(text) => { this.setState({ homework: text }) }}
                                  />
                              </Item>
                              <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                  <TextInput placeholder='Enter Daily Activity'
                                      editable={true}
                                      maxLength={150}
                                      multiline
                                      numberOfLines={4}
                                      style={{ flex: 1 }}
                                      onChangeText={(text) => { this.setState({ dailyActivity: text }) }}
                                  />
                              </Item>
                              <View style={{height:100,flex:1,flexDirection:'row'}}>
                                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                      <Text>{this.state.filename}</Text>
                                  </View>
                                  <View style={{width:150,justifyContent:'center',alignItems:'center'}}>
                                      <Button style={{backgroundColor:'pink',width:75,alignSelf:'center',borderRadius:10}} onPress={()=>{this.handlefile()}}>
                                          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                              <Text>Browse</Text>
                                          </View>
                                      </Button>
                                  </View>
                              </View>

                          </View>
                          <View style={{ alignItems: "center", marginTop: 15 }}>
                              <Button style={{ alignItems: "center", width: 300, backgroundColor: '#ff5722', alignSelf: "center",borderRadius:10 }} onPress={() => this.getstudent()}>
                                  <View style={{ alignItems: "center", flex: 1 }}>
                                      <Text style={{ color: 'white', alignSelf: "center", alignContent: 'center' }}>Get Data</Text>
                                  </View>
                              </Button>
                          </View>
                      </Form>
                      <View>
                          <Modal isVisible={this.state.isModalVisible} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                              {this._academicdetailsnew()}
                          </Modal>
                      </View>
                      <View>
                          <Modal isVisible={this.state.classmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                              {this._classdetailsnew()}
                          </Modal>
                      </View>
                      <View>
                          <Modal isVisible={this.state.divisionmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                              {this._divisonnew()}
                          </Modal>
                      </View>
                      <View>
                          <Modal isVisible={this.state.subjectmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                              <ScrollView style={{height:350,width:350}}>
                              {this._subjectmodaldata()}
                              </ScrollView>
                          </Modal>
                      </View>
                  </View>
              </ScrollView>

          )
      }
  }

  render() {

      return (
          <Container style={{ backgroundColor: 'transparent' }}>
              <ImageBackground
                  resizeMode={'cover'}
                  style={{ flex: 1 }}
                  source={require('../../assets/background.png')}
              >
              <Spinner
                          cancelable={true}
                          visible={this.state.spinner}
                          textContent={'Please Wait While Loading...'}
                          textStyle={styles.spinnerTextStyle}
                      />
              
                  {this.studscreen()}
              </ImageBackground>
          </Container>
      );
  }

}
export default class StaffDailyActivity extends React.Component{

render(){

return(
  <Container>
         
    <Header style={{ backgroundColor: '#fafafa' }}>
    <StatusBar backgroundColor='#fafafa' />
 <Left style={{flex:1,flexDirection:'row'}}>
 <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
 <Image source={require('../../assets/Images/HomeImages/Backwardarrow.png')} style={{height:20,width:20,marginRight:35}}></Image>
 </TouchableOpacity>
           
             
              <Text style={{ color: '#ff5722', fontSize: 20 }}> Daily Activity</Text>
            
              </Left>      

    </Header>
    
    <App/>
 
</Container>
)

}




}

const TabNavigator = createMaterialTopTabNavigator(
    {
    Home:
    {  
        screen: HomeScreen,
        navigationOptions: {
        tabBarLabel:({ tintColor }) => (
            <View>
                <StatusBar backgroundColor="#002171" />
            <Text  style={{color:'#ff5722',marginTop:-20}}>ADD DAILY ACTIVITY</Text>
             </View>
      
          ),
        
       
      },
    },
    Settings:
    {
        screen:SettingsScreen,
        navigationOptions: {
            tabBarLabel:({ tintColor }) => (
                <View>
                     <StatusBar backgroundColor="#002171" />
            <Text style={{color:'#ff5722',marginTop:-20}}>EDIT DAILY ACTIVITY</Text>
             </View>
      
              ),
           
          },
    }
   
  },
  {
  tabBarOptions: {   
    activeTintColor: '#000000',
    inactiveTintColor: '#fff',
    showIcon: true ,
    style: {
        // backgroundColor: '#fafafa',
        height:55,
        backgroundColor: '#c5c5c5',
        justifyContent:'center',
        alignContent:'center'//color you want to change
      },
      indicatorStyle: {
        borderBottomColor:'#ff3d00',
        borderBottomWidth: 2,
      }
    

  }
}
  )

const App= createAppContainer(TabNavigator);


const styles = StyleSheet.create({
   backgroundImage: {
       flex: 1,
       width: null,
       height: null,

   },
   spinnerTextStyle: {
       color: '#fff'
   },
   childImage: {
       alignSelf: 'stretch',
       width: '20',
       height: '20'

   },
   labels: {
       color: '#ff5722',
       textShadowColor: '#808080',
       marginBottom: 10,
       marginLeft: 15
   },
   loginButtonSection: {
       width: 300,
       justifyContent: 'center',
       alignItems: 'center',
       marginRight: 30,
       marginLeft: 30,
       marginBottom: 10
   },


   visibilityBtn:
   {
       position: 'absolute',
       right: 3,
       height: 40,
       width: 35,
       padding: 5,
       marginTop: 10,
       marginRight: 20
   },

   btnImage:
   {
       resizeMode: 'contain',
       height: '100%',
       width: '100%'
   }

});
