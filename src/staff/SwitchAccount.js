import React from 'react';
import { View, StyleSheet, Text, AsyncStorage, StatusBar, ScrollView, TextInput, Dimensions, Image, ImageBackground, TouchableOpacity,Platform } from 'react-native';
import { Header, Body, CardItem, Left, Icon, Card, Button, Toast, Right,Container,Root, Content, ActionSheet } from 'native-base';
var h = Dimensions.get('window').height;
var w = Dimensions.get('window').width;
import keys from '../api/keys';
import { SQLite,  } from 'expo-sqlite';
import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
const db = SQLite.openDatabase('EDUDUNIYA.db');
var BUTTONS = [
    { text: "Option 0", icon: "american-football", iconColor: "#2c8ef4" },
    { text: "Option 1", icon: "analytics", iconColor: "#f42ced" },
    { text: "Option 2", icon: "aperture", iconColor: "#ea943b" },
    { text: "Delete", icon: "trash", iconColor: "#fa213b" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
  ];
  var DESTRUCTIVE_INDEX = 3;
  var CANCEL_INDEX = 4;
export default class SwitchAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data1: [],
            currid: ''
        };
        this._profiledata = this._profiledata.bind(this);
    }
    componentDidMount() {
        this._profiledata()
    }
    async  switchaccount(id) {
        var self=this
        var studid=id;
  db.transaction((txn) => {
    txn.executeSql("update tbllogin set isactive='0' where isactive='1'", [],
      function(tx, result) {
      console.log('all isactive st to 0')
    }),
    txn.executeSql('select * from tbllogin where userid=?', [studid],
    function(tx, result) {
      console.log('this is len of select tbllogin:    '+result.rows.length)
      if(result.rows.length>0){
        db.transaction((txn) => {
          txn.executeSql("update tbllogin set isactive='1' where userid=?",[studid],
          function(tx, result) {
            console.log('data updated current login')
            self.props.navigation.navigate('Login')
          },
          ); 
        },(error=>{console.log(error)})
        )       
      }else{
        db.transaction((txn) => {
        txn.executeSql('insert into tbllogin values(?,?)', [studid,'1'],
          function(tx, result) {
          console.log('data inserted into tbllogin')
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
    }
    
    async _profiledata() {
        var stud_id = await AsyncStorage.getItem('id'.toString());
        var arr = [];
        var arr1=[];
        var len = 0;
        db.transaction((txm) => {
            txm.executeSql('SELECT * FROM studdetails sd join tbllogin l on sd.userid=l.userid;', [], (tx, results) => {
                len = results.rows.length;
                console.log(results.rows)
                for (var i = 0; i < len; i++) {
                    arr.push(results.rows.item(i))
                }
                console.log(arr)
                this.setState({
                    data: arr,

                })
                console.log('added student details:'+JSON.stringify(this.state.data))
            });
            txm.executeSql('SELECT * FROM Staffdetails sd join tbllogin l on sd.staffid=l.userid;', [], (tx, results) => {
                len = results.rows.length;
                console.log(results.rows)
                for (var i = 0; i < len; i++) {
                    arr1.push(results.rows.item(i))
                }
                console.log(arr)
                this.setState({
                    data1: arr1,

                })
                console.log('added staff details:'+JSON.stringify(this.state.data1))
            });
        },error=>{console.log(error)})
        this.setState({
            currid: stud_id,

        })
        console.log(this.state.currid)
    }
  // for student
  studaccounts() {

    if (this.state.data.length >0) {
        console.log('in student dadadad:'+this.state.data.length)
        return (

            this.state.data.map((data) => {
               
                return (
                    <CardItem key={data.userid} style={{ width: (w) -80, marginTop: 20,backgroundColor:'rgba(255, 255, 255, 0.9)',borderRadius:25,borderLeftWidth:6,elevation:2 }} bordered={true}>
                        <TouchableOpacity key={data.userid} onPress={() => { this.switchaccount.bind(this)(data.userid) }} style={{ height: 80 }}>

                            <View style={{ flex: 1, flexDirection: 'row',backgroundColor:'rgba(255, 255, 255, 0.9)' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    {data.photpath == ''?
                                     <Image
                                     source={require('../../assets/profile.png') }
                                     style={styles.studimg}
                                 ></Image>:
                                 <Image
                                        source={{uri: keys.portal+'/' + data.photpath.substring(2) }}
                                        style={styles.studimg}
                                    ></Image>
                                }
                              
                               
                                </View>

                                <View style={{ justifyContent: 'center', marginLeft: 20, width: 150 }}>
                                    <Text style={{ color: '#ff7043',fontWeight:"bold" }}>{data.user_f_name}</Text>
                                    <Text style={{ color: 'black',fontWeight:"bold" }}>{data.userid}</Text>
                                </View>
                                </View>

                               
                                <View style={{alignSelf:'flex-end',marginLeft:5}}>
                                {data.isactive=='1'?<Text style={{fontSize:15,color:'black'}}>
                                    Activated
                                    <Icon name='ios-checkmark-circle-outline' style={{fontSize:15,color:'white'}}></Icon>
                                    </Text>:null}
                                
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                )
            })

            
        )
    }
}
  // forstaff
  staffaccounts() {
    if (this.state.data1.length>0) {
       
        return (

            this.state.data1.map((data) => {
                console.log('in staff')
                return (
                    <CardItem key={data.userid} style={{ width: (w) -80, marginTop: 20,backgroundColor:'rgba(255, 255, 255, 0.9)',borderRadius:25,borderLeftWidth:6,elevation:2 }} bordered={true}>
                        <TouchableOpacity key={data.userid} onPress={() => { this.switchaccount.bind(this)(data.staffid) }} style={{ height: 80 }}>

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                {data.photo_path == ''?
                                     <Image
                                     source={require('../../assets/profile.png') }
                                     style={styles.studimg}
                                 ></Image>:
                                 <Image
                                        source={{uri: keys.portal+'/' + data.photo_path.substring(2) }}
                                        style={styles.studimg}
                                    ></Image>
                                }
                                </View>

                                <View style={{ justifyContent: 'center', marginLeft: 20, width: 150 }}>
                                    <Text style={{ color: '#ff7043',fontWeight:"bold" }}>{data.fname} {data.mname} {data.lname}</Text>
                                    <Text style={{ color: 'black',fontWeight:"bold" }}>{data.staffid}</Text>
                                </View>
                                </View>

                               
                                <View style={{alignSelf:'flex-end',marginRight:10}}>
                                {data.isactive=='1'?<Text style={{fontSize:15,color:'black'}}>
                                    Activated
                                    <Icon name='ios-checkmark-circle-outline' style={{fontSize:15,color:'white'}}></Icon>
                                    </Text>:null}
                                
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                )
            })

            
        )
    }
}

    render (){
        return(
            <Container>
            <Root>
            <View style={{flex:1}}>
            <StatusBar backgroundColor="#9e9e9e" />
           <ImageBackground
            resizeMode={'stretch'} // or cover
            style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
            source={require('../../assets/attbackimage.png')}
            >
    {
        Platform.OS === 'ios' ?<View style={{backgroundColor:'transparent',height:'10%',paddingTop:15}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
           </TouchableOpacity >
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>SWITCH ACCOUNT</Text>
          </View>
        </View>
       </View>:<View style={{backgroundColor:'transparent',height:'8%'}}>
   <View style={{flexDirection:'row',flex:1}}>
   <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
   <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
   <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
    </TouchableOpacity >
   </View>
   <View style={{flex:1,justifyContent:"center"}}>
       <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>SWITCH ACCOUNT</Text>
   </View>
 </View>
</View>
    }
<View style={{backgroundColor:'rgba(255, 255, 255, 0.7)',flex:1,marginTop:10,marginLeft:15,marginRight:15,marginBottom:50,borderRadius:8,elevation:5}}>
<View style={{height:'25%',justifyContent:"center",alignItems:"center"}}>
       <Image style={{height:140,width:140,borderRadius:60}} source={require('../../assets/ppeclogo.png')}></Image>
     </View>
     <View style={{height:"65%",alignItems:"center"}}>
         <ScrollView>
      {this.studaccounts()}
      {this.staffaccounts()}
      </ScrollView>
     </View>
     <View style={{justifyContent:"center",alignItems:"center",paddingTop:25}}>
        <Button onPress={()=>this.props.navigation.navigate('AddAccount')} style={{width:'80%',height:60,backgroundColor:"#ff7043",borderRadius:8}}>
            <View style={{justifyContent:"center",alignItems:"center",flex:1,flexDirection:"row"}}>
                <View><Text style={{color:'white',fontWeight:"bold",fontSize:20}}>ADD ACCOUNT</Text></View>
              <View style={{paddingLeft:20}}></View>
                
            </View>
        </Button>
    </View>
</View>
</ImageBackground>
           </View>
           </Root>
       </Container>
        )
    }
}
const styles = StyleSheet.create({
    mainview: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cards: {
        justifyContent: 'center',
        width: (w) - 50,
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'transparent'
    },
    img: {
        width: 250,
        height: 250,
        borderRadius:15,
        overflow: "hidden",

    },
    studimg: {
        width: 75,
        height: 75,
        borderRadius: 150 / 2,
        overflow: "hidden",

    },
    carditem: {
        width: w - 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor:'transparent'
    },
    button: {
        color: 'orange',
        width: w - 50,
        borderRadius: 10

    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },

})