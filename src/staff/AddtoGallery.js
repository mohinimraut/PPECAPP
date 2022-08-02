"use strict";
import React from "react";
//import { ImageBrowser } from 'expo-multiple-media-imagepicker';
import {

  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {
  subinstitute,
  getclass,
  studsearchapi
} from "../api/index";
import { savegallery } from "../api/index";
import CheckBox from "react-native-check-box";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import { NavigationEvents } from "react-navigation";

import { SQLite } from 'expo-sqlite'
import { Container, Content, Button, Input } from "native-base";
const db = SQLite.openDatabase("EDUDUNIYA.db");
import {connect } from 'react-redux'
var width = Dimensions.get("window").width - 50;

 class Add extends React.Component {
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
      filename: "File Name Here",
      title: "",
      noticetext: "",
      link: "",
      file: [],
      discription: "",
      staffname: "",
      spinner: false,
      upload: false,
      studname: "",
      studmodel: false,
      studdata: [],
      selectedstud:[],
      studnamearr:[],
      selectedInstaNames:'',
      selectedClassNames:'',
      imagepickeropen:false
    };
    this._data = this._data.bind(this);
  }

  componentDidMount() {
    this._data();
    this.getPermissionAsync();
  }
  // -------------to get institute-------------------
  async _data() {
    var self = this;
    var arr = {};
    await db.transaction(async txn => {
      txn.executeSql(
        "select * from tbllogin where isactive='1'",
        [],
        async function(tx, result) {
          //  console.log('got the studid:' + result.rows.item(0).userid)
          self.setState({ staff_id: result.rows.item(0).userid });
          txn.executeSql(
            "select * from Staffdetails where staffid=?",
            [result.rows.item(0).userid],
            (tx, result) => {
              //console.log(result)
              self.setState({
                staffname:
                  result.rows.item(0).fname +
                  result.rows.item(0).mname +
                  result.rows.item(0).lname
              });
            },
            err => {
              console.log(err);
            }
          );

          const responsenew = await subinstitute(self.state.staff_id);
            console.log('institute data'+JSON.stringify(responsenew)+self.state.staff_id);
          responsenew.map(data => {
            arr[data.id] = false;
          });
          self.setState({
            subinstitue: responsenew,
            checkinstitue: arr
          });

          //    console.log('test:'+self.state.subinstitue)
        }
      );
    });
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  //----------------------FOR PICKING DOCUMENTS-----------------------------
  async handlefile() {


  
      var permission=await this.getPermissionAsync;
      if(!permission){
        alert('something went wrong ')
        return false
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
       
      });
  
     


    var nofile = false;
   
      console.log(result.uri)
    var file = await FileSystem.readAsStringAsync(result.uri, {
      encoding: FileSystem.EncodingType.Base64
    })
    
    .catch(() => {
      //   console.log("​getFile -> err", err);
      nofile = true;
    });
   
    if (!nofile) {
      try {

        var uriarr=result.uri.split("/").reverse();
        console.log(uriarr)
        var filename = this.state.filename;
        if (filename == "File Name Here") {
          //      console.log('2.1'+filename)
          filename = uriarr[0];
        } else {
          //    console.log('2'+filename)
          filename = filename + "," + uriarr[0];
        }

        console.log()
        this.setState({ filename: filename.replace(" ","_") });
        var arr = this.state.file;
        
        var obj = { databyte: file };
        arr.push(obj);
        //   console.log(filename)

        this.setState({ file: arr });
      } catch (error) {
        //   console.log(error)
      }
    } else {
      nofile = false;
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
    //   console.log('notucetype in');
    this.setState({
      visible1: false
    });
  }
  // -----------------tom open subnotice type------------
  _noticesubtype() {
    //     console.log(' syb-notucetype in');
    this.setState({
      visible3: false
    });
  }
  // ---------------to handle institue check box-----------
  _checkinstitue(id) {
    if (this.state.checkinstitue[id]) {
      var tempobj = this.state.checkinstitue;
      tempobj[id] = false;

      this.setState({ checkinstitue: tempobj });
      this.selectedinstanames();
    } else {
      var tempobj = this.state.checkinstitue;
      tempobj[id] = true;
      this.setState({ checkinstitue: tempobj });
      this.selectedinstanames();
    }
  }
  // ----------------to handle institue select all button-----------
  async _instaselectall() {
    //    console.log('in')
    if (this.state.instacheked) {
      var tempobj = {};
      var tempobj1 = this.state.checkinstitue;
      for (var key in tempobj1) {
        tempobj[key] = false;
      }
      //     console.log(tempobj)

     await this.setState({ checkinstitue: tempobj, instacheked: false });
      this.selectedinstanames();
    } else {
      var tempobj = {};
      var tempobj1 = this.state.checkinstitue;
      for (var key in tempobj1) {
        tempobj[key] = true;
      }
      //      console.log(tempobj)
     await this.setState({ checkinstitue: tempobj, instacheked: true });
      this.selectedinstanames();
    }
  }
  // --------------to handle ok button on institute which will fill class------------
  async fillclass() {
    var instaid = "";
    var counter = 0;
    var tempobj1 = this.state.checkinstitue;
    for (var key in tempobj1) {
      //   console.log(key)
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
      // console.log('class'+JSON.stringify(classes))
      classes.map(data => {
        arr[data.id] = false;
      });
      this.setState({
        class: classes,
        checkclass: arr
      });
    }
    this.closepopup();
  }
  //--------------to handle class checkbox----------------
  async checkclass(id) {
    if (this.state.checkclass[id]) {
      var tempobj = this.state.checkclass;
      tempobj[id] = false;
      await this.setState({ checkclass: tempobj });
      this.selectedclassnames()
    } else {
      var tempobj = this.state.checkclass;
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
      //  console.log(tempobj)

     await this.setState({ checkclass: tempobj, checkallclass: false });
      this.selectedclassnames()
    } else {
      var tempobj = {};
      var tempobj1 = this.state.checkclass;
      for (var key in tempobj1) {
        tempobj[key] = true;
      }
      //   console.log(tempobj)
      await this.setState({ checkclass: tempobj, checkallclass: true });
      this.selectedclassnames();
    }
  }
  //----------to handle class ok nutton-------------
  saveclass() {
    this.closepopup();
  }

  async uploadpic() {
    var alerttext='';
    var validate=false;
    this.setState({ upload: true });
    //      console.log('in')
    if (this.state.title != "" && this.state.discription != "") {
      var counter = 0;
      var classid = "";
      var classname = "";
      var studids='';
      var studnames='';
      var finalfilename = "";
      var counter11 = 0;
      var id = this.state.staff_id;
      var names = this.state.filename;
      if (names == "File Name Here") {
        finalfilename = "";
      } else {
        var array = names.split(",");

        array.map(data => {
          if (counter11 == 0) {
            finalfilename = id + "_" + data;
            counter11++;
          } else {
            finalfilename = finalfilename + "," + id + "_" + data;
          }
        });
      }
     if(this.props.option=='Class'){
      var classcheck = this.state.checkclass;
      this.state.class.map(data => {
        if (classcheck[data.id]) {
          if (counter == 0) {
            classid = data.id;
            classname = data.name;
            counter++;
          } else {
            classid = classid + "," + data.id;
            classname = classname + "," + data.name;
          }
        }
      });
      if(classname==''){
        validate=false;
        alerttext='Select a Class'
      }else{
        validate=true
      }
     }else{
       if(this.state.selectedstud.length>0){
         this.state.selectedstud.map((data,index)=>{
          if(index==0){
            studids=data.studid;
            studnames=data.studname;
          }else{
            studids+=','+data.studid;
            studnames+=','+data.studname;
          }
         })
        validate=true;
       }else{
         validate=false;
         alerttext='select atleast one student'
       }
     }
      if (validate) {
        var obj = {
          class_id: classid,
          class_name: classname,
          title: this.state.title,
          decription: this.state.discription,
          img_path: finalfilename,
          link: this.state.link,
          stud_id:studids ,
          stud_name:studnames ,
          created_by_id: this.state.staff_id,
          created_by_name: this.state.staffname,
          databyte: this.state.file.length == 0 ? "" : this.state.file
        };
        console.log(obj)
        var result = await savegallery(obj);
        //   console.log(obj)
        if (result == "saved") {
          alert("saved successfully");
          this.props.dispatch({ type: "newgalleryadded" });
          this.setState({
            class: [],
            checkclass: {},
            filename: "File Name Here",
            title: "",
            noticetext: "",
            link: "",
            file: [],
            discription: "",
            staffname: ""
          });
        } else {
          alert("something went wrong");
          this.setState({ upload: false });
        }
      } else {
        alert(alerttext);
      }
    } else {
      alert("enter title and discription");
    }
    this.setState({ upload: false });
  }

  filename() {
    var names = this.state.filename;
    var array = names.split(",");
    //   console.log(array.length)
    return array.map(data => {
      //     console.log(data)
      return <Text style={{ opacity: 0.4 }}>{data}</Text>;
    });
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
      this.state.selectedstud.map(data1=>{
        
        if(data1.studid==data.studid){
          data["ischecked"] = true;
          count++; 
        }
      })
      if(count==0){
      data["ischecked"] = false;
      }
    });
    console.log(studdata)
    this.setState({ studmodel: true, studdata: studdata });
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

  selectedinstanames(){
    console.log('calllllllled')
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
       this.state.class.map(data=>{
        ids.map((id,index)=>{
          if(id==data.id){
            if(index==0){
              names=data.name;
              
            }else if(index>3){
              if(counter==0){
              names+="....and "+(ids.length-4)+" others";
              counter++;
              }
             return;
            }else{
             names+=", "+data.name;
            }
          }
        }) 
       
       })
     }
   }
   console.log(names)
   this.setState({selectedClassNames:names})
  }

  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      console.log(photos)
     
    }).catch((e) => console.log(e))
  }

  render() {
    return (
      <Container>
         <NavigationEvents
          onWillFocus={payload =>
            this.props.dispatch({ type: "tabchanged", data: "add" })
          }
        /> 
        <ImageBackground
          resizeMode={"cover"}
          style={{ flex: 1 }}
          source={require("../../assets/background.png")}
        >
          <Spinner
            cancelable={true}
            visible={this.state.spinner}
            textContent={"Please Wait While Loading..."}
            textStyle={{ color: "white", fontSize: 20 }}
          />
          {this.state.upload ? (
            <Spinner
              cancelable={true}
              visible={this.state.upload}
              textContent={"Uploading files Please wait..."}
              textStyle={{ color: "white", fontSize: 20 }}
            />
          ) : (
            <ScrollView style={{flex:1}}>
            <Content>
              <View style={{ padding: 10 }}>
                <Input
                  onChangeText={text => {
                    this.setState({ title: text });
                  }}
                  placeholder="Title"
                />
                <View style={{ borderBottomWidth: 0.5 }} />
              </View>
              <View style={{ padding: 10 }}>
                <Input
                  onChangeText={text => {
                    this.setState({ discription: text });
                  }}
                  placeholder="Description"
                />
                <View style={{ borderBottomWidth: 0.5 }} />
              </View>

              <View>
                 {this.props.option == "Class" ? ( 
                  <View>
                    <View
                      style={{ padding: 10, marginRight: 10, marginLeft: 10 }}
                    >
                      <Button
                        style={{
                          height: 60,
                          marginTop: 10,
                          backgroundColor: "lightblue",
                          borderRadius:10
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
                          <Text style={{ fontWeight: "bold", color: "white" ,textAlign:'center'}}>
                            SELECT SUB-INSTITUTE: {this.state.selectedInstaNames}
                          </Text>
                        </View>
                      </Button>
                    </View>
                    <View
                      style={{ padding: 10, marginRight: 10, marginLeft: 10 }}
                    >
                      <Button
                        style={{
                          minHeight: 60,
                          marginTop: 10,
                          backgroundColor: "lightblue",
                          borderRadius:10
                        }}
                        onPress={() =>
                          this.state.class.length > 0
                            ? this.setState({ visible4: true })
                            : alert("select institute")
                        }
                      >
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                            
                          }}
                        >
                          <Text style={{ fontWeight: "bold", color: "white",textAlign:'center' }}>
                            SELECT CLASS: {this.state.selectedClassNames}
                          </Text>
                        </View>
                      </Button>
                    </View>
                  </View>
                 ) : (
                  <View
                    style={{ padding: 10, marginRight: 10, marginLeft: 10 }}
                  >
                    <Input
                      onChangeText={text => {
                        this.setState({ studname: text });
                      }}
                      placeholder="student name/grno/student id"
                      onEndEditing={() => this.showstudmodel()}
                    />
                     <View style={{ borderBottomWidth: 0.5 }} />
                   
                  </View>
                )} 
              </View>
              <View style={{ flexDirection: "row", padding: 10 }}>
                <View style={{ flex: 1 }}>{this.filename()}</View>
                <View style={{ width: 100 }}>
                  <Button
                    style={{ width: 75, backgroundColor: "pink",borderRadius:10 }}
                    onPress={() => {
                      this.handlefile();
                   // this.setState({imagepickeropen:true})
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        flex: 1
                      }}
                    >
                      <Text>Browse</Text>
                    </View>
                  </Button>
                </View>
              </View>
                {/* {this.state.imagepickeropen?<ImageBrowser max={10} callback={this.imageBrowserCallback}/>:<View></View>} */}
              <View>
                <Input
                  onChangeText={text => {
                    this.setState({ link: text });
                  }}
                  placeholder="Link"
                />
                <View style={{ borderBottomWidth: 0.5 }} />
              </View>
              <View style={{ alignItems: "center", marginTop: 15 }}>
                <Button
                  style={{
                    alignItems: "center",
                    width: width,
                    backgroundColor: '#ff5722',
                    alignSelf: "center",
                    borderRadius: 15
                  }}
                  onPress={() => {
                    this.uploadpic();
                  }}
                >
                  <View style={{ alignItems: "center", flex: 1 }}>
                    <Text
                      style={{
                        color: "white",
                        alignSelf: "center",
                        alignContent: "center"
                      }}
                    >
                      SUBMIT
                    </Text>
                  </View>
                </Button>
              </View>
            </Content>
            </ScrollView>           
          )}
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
                    style={{ marginTop: 5, color: "#64b5f6", fontSize: 25 }}
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
                  {this.state.subinstitue.map(data => {
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
                                onClick={() => {
                                  this._checkinstitue(data.id);
                                }}
                                key={data.id}
                                style={{ height: 25, width: 25 }}
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
                              <Text style={{ color: "#64b5f6", fontSize: 25 }}>
                                {data.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </DialogContent>
          </Dialog>
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
                    style={{ marginTop: 5, color: "#64b5f6", fontSize: 25 }}
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
                  {this.state.class.map(data => {
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
                            onPress={() => this.checkclass(data.id)}
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
                                  this.checkclass(data.id);
                                }}
                                key={data.id}
                                isChecked={this.state.checkclass[data.id]}
                              />
                            </View>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <Text style={{ color: "#64b5f6", fontSize: 25 }}>
                                {data.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </DialogContent>
          </Dialog>
          {/* this is for stud data */}
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
                    style={{ marginTop: 5, color: "#64b5f6", fontSize: 25 }}
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
                                    fontWeight: "bold"
                                  }}
                                >
                                  {data.name}
                                </Text>
                                <Text style={{ color: "#64b5f6" }}>
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
        </ImageBackground>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  console.log("view" + JSON.stringify(state.gallery));
  return {
    isgalleryupdated: state.gallery["isgalleryupdated"],
    currenttab: state.gallery["currenttab"],
    option: state.gallery["option"]
  };
}

export default connect(mapStateToProps)(Add);
