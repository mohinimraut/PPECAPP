import React from 'react';
import {View ,Text,ScrollView,Image} from 'react-native'
import {Container,Button,Picker, } from 'native-base'
import {getpolls,savepollans} from '../api/'
import Loader from '../components/Loader'
import Nodata from '../components/Nodata'
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class Poll extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userid:'',
            loading:true,
            data:[]
            
        }
    }
   async componentDidMount(){
   
   this.getuserid()
}

    getuserid=async()=> {
        
       await db.transaction(async (txm) => {
          await txm.executeSql("select * from tbllogin where isactive='1';", [],async   (tx, results) => {
            var data=results.rows.item(0);
           this.setState({userid:data.userid})
            this.getData();

          });
        }, (error) => {
        })
       
    }

    async getData(){
    var result=await getpolls(this.state.userid);
    console.log(result)
    if(result=='error'){
        this.setState({loading:false})
        alert('something Went Wrong');
    } else if(result.length>0&& typeof result=='object'){
        result.map(data=>{
            data.selectedans='Select Answer'
        })
        this.setState({data:result,loading:false})
    }else{
        this.setState({loading:false})
       
    }

    }
    
    answerlist(options){
        var temp=options.split('|');
        console.log('temp'+typeof temp)
        temp=['Select Answer',...temp]
        return(
            temp.map(data=>{
                return(
                <Picker.Item label={data} value={data} />
                )
            })
        )
    }
    
    handlepickerchange(id,ans){
        console.log('calles')
        var temp=this.state.data;
        
        temp.map(data=>{
            if(data.poll_id==id){
                data.selectedans=ans
            }
        })
        this.setState({data:temp})
    }

    async save(id){
        var currdata={}
        this.state.data.map(data=>{
            if(data.poll_id==id){
                currdata=data;
            }
        })
        if(currdata.selectedans=='Select Answer'){
            alert('Please select an Answer')
            return false
        }
        var data={
            "poll_id":currdata.poll_id ,
            "poll_question": currdata.poll_question,
            "poll_options": currdata.poll_options,
            "poll_answer": currdata.selectedans,
            "poll_type": currdata.poll_type,
            "user_id": this.state.userid,
            "dmlType": "",
            "poll_access": currdata.poll_access,
            "other_id": ""
          }
          
          console.log(data)
          var result=await savepollans(data)

          if(result='success'){
              alert('Saved Sucessfully')
          }else{
              alert('something Went Wrong')
          }

    }

    render (){
        return(
            <ScrollView>
            <Container>
            {this.state.loading?<Loader/>:
            this.state.data.length>0?
            this.state.data.map(data=>{
                return(
                <View style={{elevation:2,borderWidth:0.5,borderColor:'black',margin:15,backgroundColor:'#f6f6f6'}}>
                    <Text style={{fontSize:20,fontWeight:'bold',margin:15,color:'#cc6f54'}}>{data.poll_question}</Text>
                    
                    <Picker
                    
                    selectedValue={data.selectedans}
                    style={{height:50,width:'100%',margin:10,borderBottomColor:'#c5c5c5',borderBottomWidth:1}}
                    onValueChange={(itemValue, itemIndex) =>{
                        this.handlepickerchange(data.poll_id,itemValue);
                    }}
                    >
                    
                    {this.answerlist(data.poll_options)}
                    </Picker>
                    <Button onPress={()=>{this.save(data.poll_id)}}  style={{width:'80%',alignSelf:'center',borderRadius:50,height:40,backgroundColor:'#ff5722'}}>
                    <View  style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>
                            Submit
                        </Text>
                    </View>
                </Button>
                    <View style={{width:'80%',flexDirection:'row',margin:10,justifyContent: 'space-between'}}>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Image source={require('../../assets/icon/calender.png')} style={{width:20,height:20}} ></Image>
                        <Text style={{fontSize:15,marginLeft:5,color:'#cc6f54'}}> {data.created_date.substring(0,data.created_date.length-5)}</Text>        
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Image source={require('../../assets/icon/clock.png')} style={{width:20,height:20}} ></Image>
                        <Text style={{fontSize:15,marginLeft:5,color:'#cc6f54'}}> {data.created_date.substring(data.created_date.length-5)}</Text>        
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Image source={require('../../assets/icon/user.png')} style={{width:20,height:20}} ></Image>
                        <Text style={{fontSize:15,marginLeft:5,color:'#cc6f54'}}> {data.poll_access}</Text>        
                        </View>
                       

                    </View>
                    <View style={{marginTop:10,backgroundColor:'#c5c5c5',flexDirection:'row',minHeight:35}}>
                        <View style={{marginLeft:5,marginRight:5,justifyContent:'center'}}>
                        <Image source={require('../../assets/icon/blackuser.png')} style={{width:20,height:20}} ></Image>
                        </View>
                        <View style={{marginLeft:5,marginRight:5,justifyContent:'center'}}>
                    <Text style={{fontSize:15}}>Created by: {data.name}</Text>
                    </View>
                    </View>
                    {/* <Text style={{fontStyle: 'italic',fontSize:15,margin:5}}>BY: {data.name}</Text>
                    <Text style={{alignSelf:'flex-end'}}>Submitted on: {data.created_date.substring(0,data.created_date.length-5)}</Text>
                */}
                </View>
                )
            })
            :
           <Nodata/>
            }
            </Container>
            </ScrollView>
        )
    }
}