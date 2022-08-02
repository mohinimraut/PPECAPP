import React from 'react';
import {View ,Text,Image} from 'react-native'
import {Container} from 'native-base';
import {getpollstatusdetails,getpollstatus} from '../api/'
import Loader from '../components/Loader'
import { SQLite } from 'expo-sqlite';
import PieChart from 'react-native-pie-chart';
import Nodata from '../components/Nodata';

const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class PollStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid:'',
            loading:true,
            data:[],
        
            
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
        var pids=await getpollstatus(this.state.userid);
        if(pids=='error'){
            alert('something Went Wrong ')
            this.setState({loading:false,})
        }else if(pids='No Data'){
            this.setState({loading:false,})
        }else{
           var temp=[];
           console.log(pids)
           await Promise.all(pids.map(async (data)=>{
                var result =await getpollstatusdetails(data.poll_id);

              
                if(result=='error'){
                    alert('something Went Wrong')
                    this.setState({loading:false,})
                }else{
                    data.stats=result[0];
                }
                temp=[...temp,data]
            }))
            console.log(temp)
            this.setState({loading:false,data:temp})
          
        }
    }

    date(value,type){
        var date=new Date(value);
        if(type=='date'){
            var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            return date.getDay()+'-'+months[date.getMonth()]+'-'+date.getFullYear()
        }else{
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

            return hour+':'+min+' '+day
        }
    }

    async pie(id){
        var result =await getpollstatusdetails(id)
        console.log(result)
         return(<View style={{height:100,width:100,borderRadius:50,backgroundColor:'pink'}}></View>)
    }

    mainView(){
        return(
            <View stule={{flex:1}}>
                {this.state.data.map(data=>{
                    return(
                    <View style={{width:'100%',borderBottomWidth:1,borderBottomColor:'grey'}}>
                        <View style={{flexDirection:'row',marginTop:15,marginRight:5,marginLeft:5}}>
                            <View style={{flex:1,justifyContent:'space-around'}}>  
                            <Text style={{fontSize:20,fontWeight:'bold',margin:15,color:'#cc6f54'}}>{data.poll_question}</Text>
                             <View style={{flexDirection:'row',marginLeft:20}}>
                                        <View style={{height:15,width:15,backgroundColor:'#ef5c31'}}></View>
                                        <View style={{height:15,justifyContent:'center'}}>
                                            <Text style={{fontSize:15,marginLeft:10,}}>Answered</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',marginLeft:20,marginTop:5}}>
                                        <View style={{height:15,width:15,backgroundColor:'#343434'}}></View>
                                        <View style={{height:15,justifyContent:'center'}}>
                                            <Text style={{fontSize:15,marginLeft:10,}}>Not Answered </Text>
                                        </View>
                                    </View> 
                            </View>
                            <View style={{margin:10}}>
                                <PieChart
                                    chart_wh={100}
                                    series={[data.stats.total_in_Poll,data.stats.total_responded]}
                                    sliceColor={['#343434','#ef5c31']}
                                />
                            </View>
                        </View>
                        <View style={{margin:10,flexDirection:'row',justifyContent:'space-around'}}>
                        <View style={{flexDirection:'row',justifyContent:'center',marginTop:5}}>
                        <Image source={require('../../assets/icon/calender.png')} style={{width:20,height:20}} ></Image>
                        <Text style={{fontSize:15,marginLeft:5,color:'#cc6f54'}}> {this.date(data.curr_date,'date')}</Text>        
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',marginTop:5}}>
                        <Image source={require('../../assets/icon/clock.png')} style={{width:20,height:20}} ></Image>
                        <Text style={{fontSize:15,marginLeft:5,color:'#cc6f54'}}> {this.date(data.curr_date,'time')}</Text>        
                        </View>
                        </View>
                    
                    </View>
    
                    )
                })}
            </View>
        )
    }

    render (){
        return(
            <Container>
                {this.state.data.length==0?this.state.loading?<Loader/>:<Nodata/>:this.mainView()}
            </Container>
        )
    }
}