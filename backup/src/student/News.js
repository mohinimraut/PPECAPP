import React from 'react';
import {View ,Text,TouchableOpacity,ActivityIndicator,Platform,Linking, LinkingIOS,StatusBar} from 'react-native'
import { Container,Header } from 'native-base';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Newsdataapi } from "../api/";
import { SQLite,  } from 'expo-sqlite';
import { ScrollView } from 'react-native-gesture-handler';
import keys from '../api/keys';
const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class News extends React.Component {

constructor(props)
{
   super(props)
   this.state={
    stud_id:'',
    newsdata:[],
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
                  self.Newsdataapi();
                  
            },
        )
    })


}
handleurl(url)
{
    console.log(keys.portal+'1')
    var uri=''
    if(url.slice(0, 2)=='..'){
        console.log(keys.portal+'1')
        uri=keys.portal+'/'+url.substring(2);
    }
    else if (url.slice(0, 4)=='http'){
        console.log(keys.portal+'2')
        uri=url;
    }else{
        console.log(keys.portal+'3')
        uri='http://'+url;
    }
    console.log(uri)
    if(Platform.OS=='android'){
        console.log(uri)
        Linking.openURL(uri);
  
  }else{
    Linking.openURL(uri);
  }
  
  }
async Newsdataapi()
{
    console.log(this.state.stud_id)
    var responce=await  Newsdataapi(this.state.stud_id)
    this.setState({
                       newsdata:responce
                  })
    console.log(JSON.stringify(responce))
}
homebody()
{
    return(
        <View>
            {this.state.newsdata.length >0 ? 
            <View>
                <ScrollView>
            {
                this.state.newsdata.map((data =>{
                    var date=new Date(data.datetime);
                    
                        var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                       var datenew=  date.getDay()+'-'+months[date.getMonth()]+'-'+date.getFullYear();
                       console.log( 'gfsdfgsgdsf'+datenew);
                        var hour=date.getHours();
                        var min=date.getMinutes();
                        var day=''
                        if(hour==0){
                            day='AM'
                            hour=12;
            
                        }
                        else if(hour>=12){
                            day='PM'
                            if(hour!=12){
                                hour=hour-12
                            }
                        } else{
                            day='AM'
                        }
                        if(hour.toString().length==1){
                            hour='0'+hour;
                        }
                        if(min.toString().length==1){
                            min='0'+min;
                        }
            
                        var time= hour+':'+min+' '+day
                 console.log( 'gfsdfgsgdsf'+time)
            
                    return(
                        <View>
                        <View style={{flex:1,backgroundColor:'#eceff1',marginTop:15,marginLeft:15,marginRight:15}}>
                            <View style={{paddingLeft:20,paddingTop:10}}><Text style={{color:"#ff7043",fontSize:20,fontWeight:'bold'}}>{data.noticetitle}</Text></View>
                            <View style={{paddingLeft:20,paddingBottom:15,paddingTop:10}}><Text style={{fontWeight:'bold'}}>{data.noticetext}</Text></View>
                            <View style={{flexDirection:"row"}}>
                             <View style={{paddingLeft:20,flexDirection:'row'}}>
                                 <View style={{justifyContent:"center"}}>
                                 <FontAwesome name='calendar' size={20} style={{ color: '#ff7043' }}></FontAwesome></View>
                                 <View style={{justifyContent:"center",paddingLeft:5}}><Text>{datenew}</Text></View>
                             </View>
                             <View style={{flexDirection:'row',paddingLeft:10}}>         
                             <View style={{justifyContent:"center"}}><FontAwesome name='clock-o' size={20} style={{ color: '#ff7043' }}></FontAwesome></View>
                             <View style={{justifyContent:"center",paddingLeft:5}}><Text>{time}</Text></View>                               
                             </View>
                            </View>
                        </View>
                        <View style={{flex:1,backgroundColor:'#eceff1',marginLeft:15,marginRight:15,height:10}}></View>
                        <View style={{flex:1,backgroundColor:'#aeaeae',marginLeft:15,marginRight:15,height:40,flexDirection:"row"}}>
                            <View style={{justifyContent:"center",paddingLeft:20,color:"#212121"}}>
                        <FontAwesome name='user-o' size={20}></FontAwesome></View>
                        <View style={{justifyContent:"center",paddingLeft:10,color:"#212121"}}><Text>Notice by -</Text></View>
                        <View style={{justifyContent:"center",paddingLeft:10,color:"#212121"}}><Text> {data.noticeby}</Text></View>
                        <View style={{justifyContent:'center',paddingLeft:20}}>{data.noticefileurl=="" ?<View></View> :<TouchableOpacity  onPress={() =>{ this.handleurl(data.noticefileurl)}}><FontAwesome name='external-link' size={20}></FontAwesome></TouchableOpacity> }</View>
                        </View>
                       </View>
                    )
                }))
            }</ScrollView></View>:<View><ActivityIndicator size="large" color="#0000ff"/></View> }
            
        </View>
        
    )
}
render()
{
return(
            <Container>
                 <StatusBar backgroundColor="white" />
                <Header style={{backgroundColor:"white"}}>
                    <View style={{alignItems:"flex-start",justifyContent:"center"}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={20} style={{ color: '#ff7043' }} />
              </TouchableOpacity >
                    </View>
                    <View style={{flex:1,justifyContent:"center",paddingLeft:30}}>
                       <Text style={{color:"#ff7043",fontWeight:"bold",fontSize:20}}>News</Text>
                    </View>
                </Header>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              {this.homebody()}
            </View>
            </Container>
)
    }
}