import React from 'react';
import { StatusBar, StyleSheet, View, Text, Image, Dimensions, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { Content, Container ,Header,Accordion,} from 'native-base';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { DailyActivity } from "../api/";
import { SQLite,  } from 'expo-sqlite';

import keys from '../api/keys';
const db = SQLite.openDatabase('EDUDUNIYA.db');
var newdate='';
export default class DailyaActivity extends React.Component {
constructor(props)
{
       super(props)
       this.state={
        stud_id:'',
        dates:{},
        newsdata:{
            "date": [
                {
                   "date": "16-Aug-2019",
                   "isopen":false
                },
                {
                    "date": "01-Jan-1900",
                    "isopen":false
                 },
              
              
            ],
            "activity": [
              {
                "log_id": null,
                "staff_id": "170000117200001",
                "activity": "dnvhsdghdjnsdnvs,mbd vmsgvjafdikadf dfakjfkaeghkac fsgklak;ekfz fasckadgjnad,X fefa;klfkdk zdf assmgdkgrkgnsdmgamkdvjkgsvm deg;kkskgdv ksrkrgkskgg srgkgwrkgrwkg srgkskg",
                "homework": "file testing",
                "lect_id": null,
                "is_present": false,
                "stud_remark": null,
                "activity_date": null,
                "str_time": null,
                "end_time": null,
                "id": "10",
                "subj_id": "1700001S00153",
                "extra1": "",
                "extra2": "10_test.pdf",
                "homework_date": "16-Aug-2019",
                "teacher_Name": "MBIS school admin",
                "subject_Name": " Maths",
                "isopen":false
              },
              {
                "log_id": null,
                "staff_id": "170000117200001",
                "activity": "nvhsdghdjnsdnvs,mbd vmsgvjafdikadf dfakjfkaeghkac fsgklak;ekfz fasckadgjnad,X fefa;klfkdk zdf assmgdkgrkgnsdmgamkdvjkgsvm deg;kkskgdv ksrkrgkskgg srgkgwrkgrwkg srgkskg nvhsdghdjnsdnvs,mbd vmsgvjafdikadf dfakjfkaeghkac fsgklak;ekfz fasckadgjnad,X fefa;klfkdk zdf assmgdkgrkgnsdmgamkdvjkgsvm deg;kkskgdv ksrkrgkskgg srgkgwrkgrwkg srgkskg",
                "homework": "file testing",
                "lect_id": null,
                "is_present": false,
                "stud_remark": null,
                "activity_date": null,
                "str_time": null,
                "end_time": null,
                "id": "11",
                "subj_id": "1700001S00153",
                "extra1": "",
                "extra2": "10_test.pdf",
                "homework_date": "16-Aug-2019",
                "teacher_Name": "MBIS school admin",
                "subject_Name": " Maths",
                "isopen":false
              },
              {
                "log_id": null,
                "staff_id": "170000117200001",
                "activity": "tet",
                "homework": "testss",
                "lect_id": null,
                "is_present": false,
                "stud_remark": null,
                "activity_date": null,
                "str_time": null,
                "end_time": null,
                "id": "6",
                "subj_id": "1700001S00153",
                "extra1": "test",
                "extra2": "6_C2M7fuTUUAEoUsd.jpg",
                "homework_date": "01-Jan-1900",
                "teacher_Name": "MBIS school admin",
                "subject_Name": " Maths",
                "isopen":false
              }
            ]
          },
        open:false
       }
}
async componentDidMount()
{
    await this.getstudid();
}
async getstudid()
{
    var self = this;
    db.transaction(async (txn) => {
        txn.executeSql("select * from tbllogin where isactive='1'", [],
            function (tx, result) {
                console.log('got the studid')
                self.setState({ stud_id: result.rows.item(0).userid })
                  self.DailyActivity();
                  
            },
        )
    })


}
async DailyActivity()
{
    console.log(this.state.stud_id)
    var responce=await  DailyActivity(this.state.stud_id)
    // this.setState
    //               ({
    //                    newsdata:data,

    //               })
    console.log(JSON.stringify(responce))
}
changedata(date)
{
    newdate=date;
    console.log(date)
    var dailydata=this.state.newsdata
    for(var i=0; i<dailydata.date.length;i++)
    {
     console.log(dailydata.date[i].date)
        if(dailydata.date[i].date==date)
        {
         
            if(dailydata.date[i].isopen==true)
            { 
                dailydata.date[i].isopen=false;
            }
            else{
                dailydata.date[i].isopen=true;
            }
           
        }
        else{
            if(dailydata.date[i].isopen==true)
            { 
                dailydata.date[i].isopen=false;
            }

        }
    }
    this.setState({
        newsdata:dailydata
    })
   
    
}
homebody()
{
   
        return(
            <View >
                <ScrollView>
              {
                     this.state.newsdata.date.map((data =>{
                          return(
                              <View style={{marginTop:15}}>
                                  <TouchableOpacity  onPress={()=>this.changedata(data.date)}>
                              <View style={{backgroundColor:'#212121',height:50,flexDirection:'row',marginLeft:15,marginRight:15}}>
                                      <View style={{justifyContent:'center',marginLeft:20}}><FontAwesome name='calendar' size={25} style={{ color: 'white' }}></FontAwesome></View>
                                      <View style={{justifyContent:'center',marginLeft:25}}><Text style={{color:'white',fontSize:20,fontWeight:"bold"}}>{data.date}</Text></View>                                
                             </View>
                                 </TouchableOpacity>
                                 <View>
                                 {
                                     data.isopen ? 
                                     <View>
                                         {
                                                      this.state.newsdata.activity.map((activity =>{
                                                        return(
                                                            <View>
                                                                {
                                                                    activity.homework_date==newdate ?     <View style={{backgroundColor:"#eceff1",marginLeft:15,marginRight:15}}>
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out"style={{flexDirection:'row',height:40}}>
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{paddingLeft:10,width:'35%',justifyContent:'flex-end'}}>
                                                                      <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{fontWeight:"bold"}}>Subject</Animatable.Text>
                                                                      </Animatable.View >
                                                                      <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{width:'65%',justifyContent:'flex-end'}}>
                                                                        {data.subject_Name=='' ? <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">-----</Animatable.Text> 
                                                                        :<Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">{ activity.subject_Name}</Animatable.Text>}
                                                                     
                                                                      </Animatable.View >
                                                      
                                                                    </Animatable.View >
                                                                    <View  style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View >
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{flexDirection:'row',height:40}}>
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{paddingLeft:10,width:'35%',justifyContent:'flex-end'}}>
                                                                        <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{fontWeight:"bold"}}>Activity</Animatable.Text>
                                                                      </Animatable.View >
                                                                      <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{width:'65%',justifyContent:'flex-end'}}>
                                                                      {data.teacher_Name=='' ? <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">-----</Animatable.Text>
                                                                       :<Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">{ activity.teacher_Name}</Animatable.Text>}
                                                                      </Animatable.View >
                                                      
                                                                    </Animatable.View >
                                                                    <View   style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View >
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{flexDirection:'row',paddingTop:20}}>
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{paddingLeft:10,width:'35%',justifyContent:'flex-end'}}>
                                                                        <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{fontWeight:"bold"}}>Homework</Animatable.Text>
                                                                      </Animatable.View >
                                                                      <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{width:'65%',justifyContent:'flex-end'}}>
                                                                      {data.homework=='' ? <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">-----</Animatable.Text> 
                                                                      :<Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">{activity.activity}</Animatable.Text>}
                                                                      </Animatable.View >
                                                      
                                                                    </Animatable.View >
                                                                    <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{height:50,flexDirection:'row',flex:1}}>
                                                                    <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{paddingLeft:10,width:'55%',justifyContent:'center'}}>
                                                                        <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{fontWeight:"bold"}}>By {activity.teacher_Name}</Animatable.Text>
                                                                      </Animatable.View >
                                                                      <Animatable.View  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out" style={{width:'45%',justifyContent:'center'}}>
                                                                      {data.extra2=='' ? <Animatable.Text  animation="fadeInRight" delay={500} useNativeDriver={true} easing="ease-out">-----</Animatable.Text> 
                                                                      :<Animatable.View style={{height:30,width:140,backgroundColor:"#ff7043",borderRadius:6,flexDirection:'row'}}>
                                                                          <View style={{justifyContent:"center",paddingLeft:5}}><FontAwesome name="file-image-o" size={20} style={{ color: 'white' }} /></View><View style={{justifyContent:"center",paddingLeft:4}}><Text style={{color:"white",fontWeight:"bold"}}>View Document</Text></View></Animatable.View >}
                                                                      </Animatable.View >
                                                      
                                                                    </Animatable.View >
                                                                    <View style={{height:20,backgroundColor:"white"}}></View>
                                                                    </View > : <View></View> 
                                                                }
                                                            </View>
                                                        )
                    
                                                       }))
                                         }
                                     </View>
                          
                              :<View></View>   }
                                 </View>
                             </View>
                          )
                     }))
              }
              </ScrollView>  
            </View>
            
        )
}   
    render (){
        return(          
            <Container>
                <Header style={{backgroundColor:"white"}}>
                    <View style={{alignItems:"flex-start",justifyContent:"center"}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={20} style={{ color: '#ff7043' }} />
                    </TouchableOpacity >
                    </View>
                    <View style={{flex:1,justifyContent:"center",paddingLeft:30}}>
                    <Text style={{color:"#ff7043",fontWeight:"bold",fontSize:20}}>Daily Activity</Text>
                    </View>
                </Header>
                <View style={{flex:1}}>
                     {this.homebody()}
                </View>
            </Container>
        )
    }
}