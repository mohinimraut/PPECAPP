"use strict";
import React from "react";

import { NavigationEvents } from 'react-navigation';
import {classdata1,} from '../api/';

import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  NetInfo,
  View,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import { subinstitute, getclass,studsearchapi } from "../api/index";
import {
  savenotice
} from "../api/index";
import * as Animatable from "react-native-animatable";
import CheckBox from "react-native-check-box";
import {
  Card,
  Item,
  Form,
  Label,
  Button,
  CardItem
} from "native-base";
const db = SQLite.openDatabase("EDUDUNIYA.db");
import { SQLite } from 'expo-sqlite'
import { connect } from "react-redux";
import { internals } from "rx-core";
var width = Dimensions.get("window").width;
var self = this;
class NoticeStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible2: false,
      cheked: false,
      noticetype: "Select Type",
      subnoticetype: "Select Sub Type",
      visible1: false,
      visible3: false,
      visible4: false,
      staff_id: "",
      instituteview: true,
      subinstitue: [],
      checkinstitue: {},
      instacheked: false,
      checkallclass: false,
      class: [],
      checkclass: {},
      title: "",
      noticetext: "",
      noticelink: "",
      filename: "upload a file",
      file: "",
      studname:'',
      studmodel: false,
      studdata: [],
      selectedstud:[],
      studnamearr:[],
      selectedClassNames:'',
      selectedInstaNames:'',
      classdata:[],
    };

    this._data = this._data.bind(this);
  }
  componentDidMount() {
    this._data();
    this._classdata();
  }
  // -------------to get institute-------------------
  async _data() {
    let isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      var self = this;
      var arr = {};
      await db.transaction(async txn => {
        txn.executeSql(
          "select * from tbllogin where isactive='1'",
          [],
          async function(tx, result) {
            console.log("got the studid:" + result.rows.item(0).userid);
            
            self.setState({ staff_id: result.rows.item(0).userid });
            const responsenew = await subinstitute(self.state.staff_id);
            if (responsenew.message == "An error has occurred." || responsenew=="error") {
              alert('Something went wrong...!')
            }
            else{
              console.log("institute data" + responsenew);
              responsenew.map(data => {
                arr[data.id] = false;
              });
              self.setState({
                subinstitue: responsenew,
                checkinstitue: arr
              })
             
            }
         
          }
        );
      });
    } else {
      alert("No Internet...!");
      this.closepopup();
    }
  }

  async _classdata() {
    let isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      var self = this;
      var arr = {};
      await db.transaction(async txn => {
        txn.executeSql(
          "select * from tbllogin where isactive='1'",
          [],
          async function(tx, result) {
            console.log("got the studid:" + result.rows.item(0).userid);
            
            self.setState({ staff_id: result.rows.item(0).userid });
            const responsenew = await classdata1(self.state.staff_id);
            if (responsenew.message == "An error has occurred." || responsenew=="error") {
              alert('Something went wrong...!')
            }
            else{
              console.log("classdata" + responsenew);
              responsenew.map(data => {
                arr[data.class_id] = false;
              });
              self.setState({
                classdata: responsenew,
                checkclass: arr
              })
             
            }
         
          }
        );
      });
    } else {
      alert("No Internet...!");
      this.closepopup();
    }
  }

  // ------------to close the popups------------------
  closepopup() {
    this.setState({
      visible2: false,
      visible4: false
    });
    // this.props.navigation.navigate('MainScreen')
  }
  // -------------ro open noticetype model------------
  _noticetype() {
    console.log("notucetype in");
    this.setState({
      visible1: false
    });
  }
  // -----------------tom open subnotice type------------
  _noticesubtype() {
    console.log(" syb-notucetype in");
    this.setState({
      visible3: false
    });
  }
  // ---------------to handle institue check box-----------
  async _checkinstitue(id) {
    if (this.state.checkinstitue[id]) {
      var tempobj = this.state.checkinstitue;
      tempobj[id] = false;
     await this.setState({ checkinstitue: tempobj,instacheked:false });
     this.selectedinstanames()

    } else {
      var tempobj = this.state.checkinstitue;
      tempobj[id] = true;
      await this.setState({ checkinstitue: tempobj });
      this.selectedinstanames()
    }
  }
  // ----------------to handle institue select all button-----------
  async _instaselectall() {
    console.log("in");
    if (this.state.instacheked) {
      var tempobj = {};
      var tempobj1 = this.state.checkinstitue;
      for (var key in tempobj1) {
        tempobj[key] = false;
      }
      console.log(tempobj);

     await this.setState({ checkinstitue: tempobj, instacheked: false });
     this.selectedinstanames()
    } else {
      var tempobj = {};
      var tempobj1 = this.state.checkinstitue;
      for (var key in tempobj1) {
        tempobj[key] = true;
      }
      console.log(tempobj);
     await this.setState({ checkinstitue: tempobj, instacheked: true });
     this.selectedinstanames()
    }
  }
  // --------------to handle ok button on institute which will fill class------------
  async fillclass() {
    let isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      var instaid = "";
      var counter = 0;
      var tempobj1 = this.state.checkinstitue;
      for (var key in tempobj1) {
        console.log(key);
        if (tempobj1[key]) {
          if (counter == 0) {
            instaid += key;
            counter++;
          } else {
            instaid += "," + key;
          }
        }
      }
      var arr = {};
      if (instaid == "") {
        this.setState({ class: [], checkclass: {} });
      } else {
        var classes = await getclass(instaid);
        console.log("class" + JSON.stringify(classes));
        if (classes.message == "An error has occurred." || classes=="error") {
          alert('Something went wrong...!')
        }else{
        classes.map(data => {
          arr[data.id] = false;
        });
        this.setState({
          class: classes,
          checkclass: arr
        });
      }
      }
      this.closepopup();
    } else {
      alert("No Internet..!");
      this.closepopup();
    }
  }
  //--------------to handle class checkbox----------------
  async checkclass(id) {
    if (this.state.classdata.class_id) {
      var tempobj = state.classdata.class_id;
      tempobj[id] = false;
      await this.setState({ checkclass: tempobj ,checkallclass:false});
      this.selectedclassnames()
    } else {
      var tempobj = this.state.classdata;
      tempobj[id] = true;
      await this.setState({ checkclass: tempobj });
      this.selectedclassnames()
    }
  }
  //--------------to handle class select all button--------------
  async classselectall() {
    if (this.state.checkallclass) {
      var tempobj = {};
      var tempobj1 = this.state.checkclass;
      for (var key in tempobj1) {
        tempobj[key] = false;
      }
      console.log(tempobj);

     await this.setState({ checkclass: tempobj, checkallclass: false });
     this.selectedclassnames()
    } else {
      var tempobj = {};
      var tempobj1 = this.state.checkclass;
      for (var key in tempobj1) {
        tempobj[key] = true;
      }
      console.log(tempobj);
      await this.setState({ checkclass: tempobj, checkallclass: true });
      this.selectedclassnames()
    }
  }
  //----------to handle class ok nutton-------------
  saveclass() {
    this.closepopup();
  }
  //-----------------to post notice------------------
  async savebtn() {
    var counter = 0;
    var counter1 = 0;
    var instaid1 = "";
    var classid1 = "";
    var studids=''
    
    if (this.state.filename == "upload a file") {
      var filename = "";
    } else {
      var filename = this.state.filename.split(' ').join('_');
    }
    var tempobj = this.state.checkclass;
    key=tempobj.class_id
    for (var key in tempobj) {
      if (key.indexOf('C')==-1) {
        if (counter == 0) {
//           (classid1 += tempobj[key].class_id)
                    (classid1 += tempobj[key].class_id)

           
        } else {
          classid1 += "," + key;
        }
        counter++;

      }
    }
  
    var noticetype1 = this.state.noticetype;
    var subnoticetype1 = this.state.subnoticetype;
    var noticetitle1 = this.state.title;
    var noticetext1 = this.state.noticetext;
    var noticelink1 = this.state.noticelink;
    if(this.state.selectedstud.length>0){
      this.state.selectedstud.map((data,index)=>{
       if(index==0){
         studids=data.studid;
        
       }else{
         studids+=','+data.studid;
        
       }
      })
    
    }
    if (
      
      noticetype1 != "" &&
      subnoticetype1 != "" &&
      noticetitle1 != "" &&
      noticetext1 != ""
    ) {
    
      var data = {
        staffid: this.state.staff_id,
        noticetype: noticetype1,
        noticesubtype: subnoticetype1,
        noticetitle: noticetitle1,
        noticetext: noticetext1,
        noticedate: "",
        noticeid: "",
        noticefileurl: "",
        noticefilename: filename,
        databyte: this.state.file,
        noticelink: noticelink1,
        mediumid: "",
        classid: classid1,
        divid: "",
        subjid: "",
        studid: studids,
        dmltype: "save",
        tostaffid: "",
        subtype: "",
        departmentid: "",
        designationid: "",

      };
      console.log(data);
      var responsenew = await savenotice(data);
      console.log(responsenew);
      // if  (  responsenew.message == "An error has occurred." || responsenew == "error") {
      //   alert("Something Went wrong");
      //   this.props.navigation.navigate("Staffhome");
      // } else {
      //   alert("Saved Successfully");
      // }
    
    } else {
      alert("fill all the data");
    }
   
  }

  studselected(studid){
    var arr=[];
    var arr1=[];
    var studdata=this.state.studdata;
    studdata.map(data=>{
      if(data.studid==studid){
        if(data.ischecked){
          
          this.state.selectedstud.map(data1=>{
            if(data1.studid!=studid){
              arr1=[...arr1,data1]
            }
            data.ischecked=false
          })
        }else{
          data.ischecked=true
          arr1=[...this.state.selectedstud,{studid,studname:data.name}]
        }
      }
    arr=[...arr,data];
    })
    console.log(arr1)
    this.setState({studdata:arr,selectedstud:arr1})
  }

  async showstudmodel() {
    if (this.state.studname.length < 3) {
      alert("enter atleast 3 Character");
      return false;
    }
    console.log(this.state.selectedstud)
    var studdata = await studsearchapi(
      this.state.studname,
      this.state.staff_id
    );
    var count=0;
    if(typeof studdata!='object'){
      alert('No student Found')
      return false;
    }
    else if( studdata.length==0){
      alert('No student Found')
      return false;
    }
    studdata.map(data => {
      count=0;
      if(this.state.selectedstud.length>0){
      this.state.selectedstud.map(data1=>{
        
        if(data1.studid==data.studid){
          data["ischecked"] = true;
          count++; 
        }
      })}

      if(count==0){
      data["ischecked"] = false;
      }
    });
    console.log(studdata)
    this.setState({ studmodel: true, studdata: studdata });
  }
  //--------------------------------handle file --------------------
  async handlefile() {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result.uri);
    var file = await FileSystem.readAsStringAsync(result.uri, {
      encoding: FileSystem.EncodingType.Base64
    })
    .catch(err => {
      console.log("​getFile -> err", err);
    });

    this.setState({ file: file });
    console.log(result.name);
    var filename = result.name;

    try {
      var fileext = filename.substring(filename.lastIndexOf(".") + 1);

      console.log("filenema=" + result.name + ",filetype=" + fileext);
      this.setState({ filename: result.name });
    } catch (error) {
      console.log(error);
    }
  }

  selectedinstanames(){
    
    var names='';
   if(Object.keys(this.state.checkinstitue).length>0){
     var ids=[];
     var counter=0;
     for(var key in this.state.checkinstitue){
       console.log(this.state.checkinstitue[key])
      if(this.state.checkinstitue[key]){
        ids=[...ids,key];
      }
     }
     console.log(ids)
     if(ids.length>0){
       this.state.subinstitue.map(data=>{
        ids.map(ids=>{
          if(ids==data.id){
            if(counter==0){
              names=data.name;
              counter++;
            }else{
             names+=", "+data.name;
            }
          }
        }) 
       
       })
     }
   }
   console.log(names)
   this.setState({selectedInstaNames:names})
  }

  selectedclassnames(){
    console.log('calllllllled')
    var names='';
    var counter=0
   if(Object.keys(this.state.checkclass).length>0){
     var ids=[];
     
     for(var key in this.state.checkclass){
       console.log(this.state.checkclass[key])
      if(this.state.checkclass[key]){
        ids=[...ids,key];
      }
     }

     console.log(ids)
     if(ids.length>0){
       this.state.classdata.map(data=>{
        ids.map((ids,index)=>{
          if(ids==data.class_id){
            if(index==0){
              names=data.class_name;
              
            }else if(index>3){
              if(counter==0){
              names+="....and "+(ids.length-4)+" others";
              counter++;
              }
             return;
            }else{
             names+=data.class_name;
            }
          }
        }) 
       
       })
     }
   }
   console.log(names)
   this.setState({selectedClassNames:names})
  }

  render() {
    return (
      <Animatable.View useNativeDriver={true} animation='fadeIn' delay={1000} style={{ flex: 1, alignItems: "center" }}>
          <NavigationEvents
      onWillFocus={payload =>{this.props.dispatch({type:'noticetabchanged',data:'student'})}}
     
    /> 
        <ScrollView>
        {this.props.option == "Class" ? (
          <View>
          <View style={{ flex: 1, alignItems: "center", alignSelf: "center" }}>
            <Button
              style={{
                height: 60,
                width: width - 50,
                marginTop: 10,
                backgroundColor: "#90CAF9",
                borderRadius: 10
              }}
              onPress={() => this.setState({ visible2: true })}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white" ,textAlign:'center' }}>
                  SELECT SUB-INSTITUTE: {this.state.selectedInstaNames}
                </Text>
              </View>
            </Button>
          </View>
          <View style={{ flex: 1, alignItems: "center", alignSelf: "center" }}>
            <Button
              style={{
                height: 60,
                width: width - 50,
                marginTop: 10,
                backgroundColor: "#90CAF9",
                borderRadius: 10
              }}
              onPress={() =>this.state.checkinstitue
                  ? this.setState({ visible4: true })
                  : alert("select institute")
              }
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white" ,textAlign:'center'}}>
                  SELECT CLASS {this.state.selectedClassNames}
                </Text>
              </View>
            </Button>
          </View>
          </View>
        ):
        (
          <View
            style={{ padding: 10, marginRight: 10, marginLeft: 10, marginTop: 20, }}
          >
            <TextInput
           
              onChangeText={text => {
                this.setState({ studname: text });
              }}
              placeholder="student name/grno/student id"
              onEndEditing={() => this.showstudmodel()}
            />
             <View style={{ borderBottomWidth: 0.5 }} />
           
          </View>
        )  
      }
          <View>
            <Form>
              <Item
                style={{
                  marginBottom: 5,
                  marginTop: 30,
                  borderWidth: 4,
                  width: width - 50
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => this.setState({ visible1: true })}
                >
                  <Label  >{this.state.noticetype}</Label>
                </TouchableOpacity>
              </Item>
              <Item
                style={{
                  marginBottom: 5,
                  marginTop: 30,
                  borderWidth: 4,
                  width: width - 50
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => this.setState({ visible3: true })}
                >
                  <Label >{this.state.subnoticetype}</Label>
                </TouchableOpacity>
              </Item>
              <Item
                style={{
                  marginBottom: 5,
                  marginTop: 30,
                  borderWidth: 4,
                  width: width - 50
                }}
              >
                <TextInput
               
                  placeholder="Please Notice Title"
                  multiline
                  numberOfLines={4}
                  {...this.props}
                  editable={true}
                  maxLength={240}
                  style={{ flex: 1 }}
                  onChangeText={text => {
                    this.setState({ title: text });
                  }}
                />
              </Item>
              <Item
                style={{
                  marginBottom: 5,
                  marginTop: 30,
                  borderWidth: 4,
                  width: width - 50
                }}
              >
                <TextInput
              
                  placeholder=" Please Enter Notice Text"
                  multiline
                  numberOfLines={4}
                  {...this.props}
                  editable={true}
                  maxLength={240}
                  style={{ flex: 1 }}
                  onChangeText={text => {
                    this.setState({ noticetext: text });
                  }}
                />
              </Item>
              <Item
                style={{
                  marginBottom: 5,
                  marginTop: 30,
                  borderWidth: 4,
                  width: width - 50
                }}
              >
                <TextInput
               multiline
               numberOfLines={4}
                  placeholder=" Link Here Please"
                  {...this.props}
                  editable={true}
                  maxLength={240}
                  style={{ flex: 1 }}
                  onChangeText={text => {
                    this.setState({ noticelink: text });
                  }}
                />
              </Item>

              <View style={{ height: 100, flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text >{this.state.filename}</Text>
                </View>
                <View
                  style={{
                    width: 150,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "pink",
                      width: 75,
                      alignSelf: "center",
                      borderRadius: 10
                    }}
                    onPress={() => {
                      this.handlefile();
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text >Browse</Text>
                    </View>
                  </Button>
                </View>
              </View>

              <Item>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    onPress={() => this.savebtn()}
                    style={{
                      width: 200,
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: "pink",
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: 10
                    }}
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={{ fontSize: 15, alignSelf: "center", }}>
                        SAVE-->>
                      </Text>
                    </View>
                  </Button>
                </View>
              </Item>
            </Form>
          </View>
          <View>
            {/* this is for institute */}
            <Dialog
              visible={this.state.visible2}
              footer={
                <DialogFooter>
                  <DialogButton text="OK" onPress={() => this.fillclass()} />
                </DialogFooter>
              }
            >
              <DialogContent
                style={{
                  height: 350,
                  width: 300,
                  alignItems: "center",
                  backgroundColor: "#eeeeee"
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      width: 250,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ marginTop: 5, color: "#64b5f6", fontSize: 25, }}
                    >
                      Select All{" "}
                    </Text>
                    <CheckBox
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        this._instaselectall();
                      }}
                      isChecked={this.state.instacheked}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    {this.state.subinstitue.length > '0' ? this.state.subinstitue.map(data => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            height: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: "black",
                            justifyContent: "center"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              flexDirection: "row"
                            }}
                          >
                            <TouchableOpacity
                              style={{ flex: 1, flexDirection: "row" }}
                              onPress={() => this._checkinstitue(data.id)}
                            >
                              <View
                                style={{
                                  width: 35,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <CheckBox
                                  key={data.id}
                                  style={{ height: 25, width: 25 }}
                                  onClick={() => {
                                    this._checkinstitue(data.id);
                                  }}
                                  isChecked={this.state.checkinstitue[data.id]}
                                />
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={{ color: "#64b5f6", fontSize: 25 ,}}
                                >
                                  {data.name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }):<View style={{flex:1}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>}
                  </View>
                </View>
              </DialogContent>
            </Dialog>
          </View>

          <View>
            {/* this is for class */}
            <Dialog
              visible={this.state.visible4}
              footer={
                <DialogFooter>
                  <DialogButton text="OK" onPress={() => this.saveclass()} />
                </DialogFooter>
              }
            >
              <DialogContent
                style={{
                  height: 350,
                  width: 300,
                  alignItems: "center",
                  backgroundColor: "#eeeeee"
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      width: 250,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{ marginTop: 5, color: "#64b5f6", fontSize: 25,}}
                    >
                      Select All{" "}
                    </Text>
                    <CheckBox
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        this.classselectall();
                      }}
                      isChecked={this.state.checkallclass}
                    />
                  </View>
                  <ScrollView style={{ flex: 1 }}>
                    {this.state.class.length >'0' ? this.state.classdata.map(data => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            height: 50,
                            borderBottomWidth: 1,
                            borderBottomColor: "black",
                            justifyContent: "center"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              flexDirection: "row"
                            }}
                          >
                            <TouchableOpacity
                              style={{ flex: 1, flexDirection: "row" }}
                              onPress={() => this.checkclass(data.class_id)}
                            >
                              <View
                                style={{
                                  width: 35,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <CheckBox
                                  onClick={() => {
                                    this.checkclass(data.class_id);
                                  }}
                                  key={data.class_id}
                                  isChecked={this.state.checkclass[data.class_id]}
                                />
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={{ color: "#64b5f6", fontSize: 25, }}
                                >
                                  {data.class_name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>}
                  </ScrollView>
                </View>
              </DialogContent>
            </Dialog>
          </View>
          <View>
            <Dialog
              visible={this.state.visible1}
              footer={
                <DialogFooter>
                  <DialogButton
                    text="Cancel"
                    onPress={() => this._noticetype()}
                  />
                </DialogFooter>
              }
            >
             <DialogContent
                style={{ height: 150, width: 250, alignItems: "center" }}
              >
               
                  <Card
                    style={{ height: 150, width: 250, alignItems: "center" }}
                  >
                    <CardItem
                      style={{
                        alignItems: "center",
                        width: 250,
                      }}
                      header>
                      <Text style={styles.typetext}>Select Type</Text>
                    </CardItem>
                    <TouchableOpacity
                      style={{
                        width: 250,
                        alignItems: "center"
                      }}
                      onPress={() =>
                        this.setState({ noticetype: "Notice", visible1: false })
                      }
                    >
                      <CardItem>
                        <Text
                          style={styles.typetext}
                        >
                          Notice
                        </Text>
                      </CardItem>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 250,
                        alignItems: "center"
                      }}
                      onPress={() =>
                        this.setState({ noticetype: "News", visible1: false })
                      }
                    >
                      <CardItem>
                        <Text
                          style={styles.typetext}
                        >
                          News
                        </Text>
                      </CardItem>
                    </TouchableOpacity>
                  </Card>
               
              </DialogContent>
            </Dialog>
          </View>
          <View>
            {/* this is for type */}
            <Dialog
              visible={this.state.visible3}
              footer={
                <DialogFooter>
                  <DialogButton
                    text="Cancel"
                    onPress={() => this._noticesubtype()}
                  />
                </DialogFooter>
              }
            >
              <DialogContent
                style={{ height: 250, width: 250, alignItems: "center" }}
              >
                <View style={{ height: 250, width: 250, alignItems: "center" }}>
                  <Card
                    style={{ height: 250, width: 250, alignItems: "center" }}
                  >
                    <CardItem
                      style={{
                        alignItems: "center",
                        width: 250,
                     
                      }}
                      header
                    >
                      <Text style={styles.typetext}>Select Type</Text>
                    </CardItem>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                      
                        width: 250,
                        alignItems: "center"
                      }}
                      onPress={() =>
                        this.setState({
                          subnoticetype: "Exam",
                          visible3: false
                        })
                      }
                    >
                      <CardItem>
                        <Text
                          useNativeDriver={true}
                          animation="zoomInUp"
                          style={styles.typetext}
                        >
                          Exam
                        </Text>
                      </CardItem>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,

                        width: 250,
                        alignItems: "center"
                      }}
                      onPress={() =>
                        this.setState({
                          subnoticetype: "Other",
                          visible3: false
                        })
                      }
                    >
                      <CardItem>
                        <Text
                          useNativeDriver={true}
                          animation="zoomInUp"
                          delay={100}
                          style={styles.typetext}
                        >
                          Other
                        </Text>
                      </CardItem>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,

                        width: 250,
                        alignItems: "center"
                      }}
                      onPress={() =>
                        this.setState({
                          subnoticetype: "Result",
                          visible3: false
                        })
                      }
                    >
                      <CardItem>
                        <Text
                          useNativeDriver={true}
                          animation="zoomInUp"
                          delay={200}
                          style={styles.typetext}
                        >
                          Result
                        </Text>
                      </CardItem>
                    </TouchableOpacity>
                  </Card>
                </View>
              </DialogContent>
            </Dialog>

            <Dialog
            visible={this.state.studmodel}
            footer={
              <DialogFooter>
                <DialogButton
                  text="OK"
                  onPress={() => this.setState({ studmodel: false })}
                />
              </DialogFooter>
            }
          >
            <DialogContent
              style={{
                height: 350,
                width: 300,
                alignItems: "center",
                backgroundColor: "#eeeeee"
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    width: 250,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{ marginTop: 5, color: "#64b5f6", fontSize: 25,}}
                  >
                    Select Students
                  </Text>
                
                </View>
                <ScrollView style={{ flex: 1 }}>
                  {this.state.studdata.length > 0 ? (
                    this.state.studdata.map(data => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            height: 50,
                            borderBottomWidth: 1,
                            borderBottomColor: "black",
                            justifyContent: "center"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              flexDirection: "row"
                            }}
                          >
                            <TouchableOpacity
                              style={{ flex: 1, flexDirection: "row" }}
                              onPress={()=>{this.studselected(data.studid)}}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#64b5f6",
                                    fontSize: 15,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {data.name}
                                </Text>
                                <Text style={{ color: "#64b5f6" ,}}>
                                  {data.grno}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: 35,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                              
                                <CheckBox
                                  key={data.id}
                                  isChecked={data.ischecked}
                                  onClick={()=>{this.studselected(data.studid)}}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View />
                  )}
                </ScrollView>
              </View>
            </DialogContent>
          </Dialog>
 
          </View>
        </ScrollView>
      </Animatable.View>
    );
  }
}
function mapStateToProps(state) {

  return {
    isnoticeupdated: state.notice['isnoticeupdated'],
    currenttab:state.notice['currenttab'],
    option:state.notice['option'],
  };
}
export default connect(mapStateToProps)(NoticeStudent);
const styles = StyleSheet.create({
  maincontent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cards: {
    backgroundColor: "rgba(52, 52, 52, 0.1)",
    width: width - 50,
    maxHeight: 230,
    alignItems: "center",
    marginTop: 20
  },
  typetext:{
    fontSize:20,
   // fontWeight:'bold',
    alignSelf:'center',
   
  },
});