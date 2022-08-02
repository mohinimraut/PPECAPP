import React from 'react';
import {View ,Text,backgroundColor} from 'react-native'
import { SQLite,  } from 'expo-sqlite';
import keys from '../api/keys';
import { MobileApp } from "../api/";
import NetInfo from "@react-native-community/netinfo";

const db = SQLite.openDatabase('EDUDUNIYA.db');



export default class FetchMobile extends React.Component {
    constructor(props){
     super(props);
     this.state={
     username:'',
     password:'',
     mobiledata:[],
     }
    }
    async componentDidMount(){
        await this.getUserId();
    }
   async getUserId(){
       var self=this;
   db.transaction(async (txn)=>{
       txn.executeSql("select * from tbllogin where isactive='1'",[],
       function(tx,Result){
        self.setState({userid:Result.rows.item(0).userid})
        self.Mobiledataapi();
       })
   })
   }

   



   async Mobiledataapi()
{
    var connection = await NetInfo.fetch();
    if(!connection.isConnected){
        alert('No internet  Connection');
        this.setState({mobiledata:[]})
        return false
    }
    console.log(this.state.userid)
    var response=await MobileApp(this.state.username,this.state.password)
    this.setState({
                       mobiledata:response
                  })
    console.log(JSON.stringify('responsemohini----------->'+response))
}
  
    render (){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor}}>
                <Text>Fetch for mobile</Text>
        <Text>{this.state.userid}</Text>
            </View>
        )
    }
}