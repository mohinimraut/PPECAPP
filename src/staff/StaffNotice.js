"use strict";
import React from "react";
import {
  allstafflist,
  savestaffnotice,
  savenotice
} from "../api/index";
import Nodata from '../components/Nodata'
import {
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView,
  NetInfo
} from "react-native";
import { SQLite } from 'expo-sqlite' ;
import {connect} from 'react-redux'
const db = SQLite.openDatabase("EDUDUNIYA.db");
import { createStackNavigator } from 'react-navigation-stack';
import NoticeStaff from './NoticeStaff';
import NoticeView from './NoticeView';
import NoticeStudent from './NoticeStudent';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  createAppContainer,
  } from 'react-navigation';
import {
  Container,
  Body,
  Header,
  Left,
  Right} from "native-base";
// first page
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";



import { selfstudgallery } from "../api/index";




 class StaffNotice extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selfnotice:false,
      staff_id:'',
      data:{},
      option:false
    }
    this._data()
  }
  Dateformatter(data){
    console.log(data)
    var today = new Date(data);
    var dd = today.getDate();
    var returndate=''
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    returndate = dd+'/'+mm+'/'+yyyy;
    console.log(returndate)
    return returndate;
    }
  // -------------to get staffid-------------------
 async _data()
 {  
   let isConnected=await NetInfo.isConnected.fetch()
   if(isConnected)
   {
     var self = this;
     var arr={}
      await db.transaction(async (txn) => {
         txn.executeSql("select * from tbllogin where isactive='1'", [],
           async  function (tx, result) {
                 console.log('got the studidheader:' + result.rows.item(0).userid)
                 self.setState({ staff_id: result.rows.item(0).userid })
             },
         )
     })
 
   }
   else{
     alert('No Internet...!')
   }
 }
  //to get self data
  async getdata(){
    var type='student'
   if(this.props.currenttab!='student'){
     type='staff';
   }
    
    this.setState({selfnotice:true})
    var data=await selfstudgallery(this.state.staff_id,type);
    console.log('data'+data);
    this.setState({data})
  }

  async deletenotice(id){
    var post={
      "staffid": this.state.staff_id,
      "noticetype": "",
      "noticesubtype": "",
      "noticetitle": "",
      "noticetext": "",
      "noticedate": "",
      "noticeid": id,
      "noticefileurl": "",
      "noticefilename": "",
      "databyte": "",
      "noticelink": "",
      "mediumid": "",
      "classid": "",
      "divid": "",
      "subjid": "",
      "studid": "",
      "dmltype": "delete",
      "tostaffid": "",
      "subtype": "",
      "departmentid": "",
      "designationid": ""
    }
    if(this.props.currenttab=='student'){
    var responsenew = await savenotice(post);
    }else{
      var responsenew = await savestaffnotice(post);
    }
    console.log(responsenew)
    if(responsenew=='error'){
      alert('something Went wrong');
      this.props.navigation.navigate('Homes')
      this.setState({data:{},selfnotice:false})
    }else{
      alert('deleted Successfully');
      this.setState({data:{},selfnotice:false})
      
    }
  }
  
  showoption() {
    this.setState({ option: true });
  }

  setselectedoption(option){
    console.log(`this is option ${option}`)
    this.props.dispatch({type:'noticeoptionchanged',data:option});
    this.setState({option:false});
  }

  render() {

    return (
      <Container>
       
        <ImageBackground
          resizeMode={'cover'} // or cover
          style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
          source={require('../../assets/background.png')}
        >

          <Header style={{ backgroundColor: '#fafafa' }}>
            <StatusBar backgroundColor='#fafafa' />
            <Left style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require("../../assets/Images/HomeImages/Backwardarrow.png")}
                style={{ height: 20, width: 20, marginRight: 35 }}
              />
            </TouchableOpacity>
            <Text style={{ color: "#ff5722", fontWeight: "bold", fontSize: 20 }}>
              {" "}
              Notice
            </Text>
          </Left>
            
              
            
            {console.log(`this is props${JSON.stringify(this.props)}`)}
            {this.props.currenttab!='view'?
            
            <Right style={{ flex: 1 }}>

            <TouchableOpacity onPress={() => this.getdata()}>
            <Image source={require('../../assets/view.png')} style={{ height: 30, width: 30 }}></Image>
            </TouchableOpacity>
            {this.props.currenttab == "student" ? (
              <TouchableOpacity
              style={{alignContent:'center',marginLeft:7}}
                onPress={() => {
                  this.showoption();
                }}
              >
                <Image
                style={{ height: 30, width: 20,}}
                  source={require("../../assets/option.png")}
                  
                />
              </TouchableOpacity>
            ) : (
              <View />
            )}
            </Right>
            :<View></View>}
          </Header>
          <Dialog
            visible={this.state.selfnotice}
            footer={
              <DialogFooter>
                <DialogButton
                  text="Cancel"
                  onPress={() => this.setState({selfnotice:false})}
                />
              </DialogFooter>
            }
          >
          <DialogContent style={{ height: 250, width: 250, alignItems: 'center' }}>
          <View style={{ height: 250, width: 250, alignItems: 'center' }}>
            <ScrollView style={{flex:1}}>
          
              { typeof this.state.data=='object'?
                this.state.data.length>0?(
               
                this.state.data.map((data) => {
                return (
                        <View style={{flex:1,width:230,borderBottomColor:'black',borderBottomWidth:2,marginTop:10}}>
                            <View style={{flex:1,paddingBottom:8}}>
                                <Text style={{fontWeight:'bold'}}>{data.noticetitle}</Text>
                            </View>
                          
                            <View style={{flexDirection:'row'}}>
                            <View style={{flex:1,flexDirection:'column'}}>
                                <View style={{flex:1,paddingBottom:8}}>
                                    <Text style={{fontSize:10,opacity:0.5}}>{this.Dateformatter(data.datetime)}</Text>
                                </View>
                               
                            </View>
                            <View >
                              
                              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.deletenotice(data.noticeid)}  >
                              <Image source={require('../../assets/delete.png')} style={{width: 20, height: 20 }}></Image>
                              
                              </TouchableOpacity> 
                            </View>
                            </View>

                            </View>
                
            )})
              ):
              <View style={{flex:1,justifyContent:'center',alignItems:'center',height: 250, width: 250}}>
                 <Image source={require('../../assets/loading.gif')} style={{ height: 75, width: 75 }}></Image>
              </View>
              :<Nodata height={125} width={125}/>}
            </ScrollView>
          </View>
          </DialogContent>
          </Dialog>
          <Dialog
          visible={this.state.option}
          footer={
            <DialogFooter>
              <DialogButton
                text="CANCEL"
                onPress={() => {
                  this.setState({ option: false });
                }}
              />
            </DialogFooter>
          }
        >
          <DialogContent
            style={{
              height: 200,
              width: 300,
              alignItems: "center",
              backgroundColor: "#eeeeee",justifyContent:'center'
            }}
          >
            <View>
            <Text
                    style={{ marginTop: 5,marginBottom:5, color: "#64b5f6", fontSize: 25 }}
                  >
                    Select Option
                  </Text>
            </View>
            <View style={{flex:1,width:280,justifyContent:'center'}}>
              <View style={{flex:0.5,borderBottomColor:'black',borderBottomWidth:1}}>
              <TouchableOpacity style={{flex:1, height:100,justifyContent: "center",alignItems: "center",}} onPress={()=>{this.setselectedoption('Single')}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{alignContent:'center',alignSelf:'center',fontSize:20,fontWeight:'bold'}}>Single</Text>
                </View>
              </TouchableOpacity>
              </View>
              <View style={{flex:0.5,}}>
              <TouchableOpacity style={{flex:1, height:100,justifyContent: "center",alignItems: "center",}} onPress={()=>{this.setselectedoption('Class')}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{alignContent:'center',alignSelf:'center',fontSize:20,fontWeight:'bold'}}>Multiple</Text>
                </View>
              </TouchableOpacity>
              </View>
            </View>
          </DialogContent>
        </Dialog>
 
          <App />
        </ImageBackground>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    isnoticeupdated: state.notice['isnoticeupdated'],
    currenttab:state.notice['currenttab'],
    option:state.notice['option'],
  };
}
export default connect(mapStateToProps)(StaffNotice);

const HomeStudent = createStackNavigator({
  Student: NoticeStudent,

}, {

    headerMode: 'none',

  });
const HomeNotice = createStackNavigator({
  Notice: NoticeStaff,

}, {
    headerMode: 'none',
  });
  const Staff = createStackNavigator({
    staff:  NoticeView,
  
  }, {
      headerMode: 'none',
    });
const App = createAppContainer(createMaterialTopTabNavigator(
  {
    Student: HomeStudent,
    Staff: HomeNotice,
    View: Staff,
  },
  {
    tabBarOptions: {
      activeTintColor: '#ff5722',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: '#fafafa',
        fontSize: 20 ,
        height:55
      },
    },
  }
));


