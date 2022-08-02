import React from 'react';
import {View,Text,StatusBar,TouchableOpacity,Image,Dimensions,ImageBackground,ScrollView} from 'react-native';
import {Button,Header,Left,Right,Body, Icon, Accordion} from 'native-base';
import {feedetails} from '../api';
import { SQLite } from 'expo-sqlite';
import Accordian from '../components/Accordian'
const db = SQLite.openDatabase('EDUDUNIYA.db');
var width = Dimensions.get('window').width;
import Loader from '../components/Loader'
import Nodata from '../components/Nodata';

export default class Fees extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            data:{},
            loading:'Loding please wait....!'
        }
        
    }
    componentDidMount() {
        this.feedata()
    }

    feedata(){
        var self=this
        db.transaction((txm) => {
            txm.executeSql("select userid from tbllogin where isactive='1';", [], async (tx, results) => {
                console.log(results.rows.item(0).userid)
                var data=await feedetails(results.rows.item(0).userid)
                console.log(data)
                var tempdata=data.studTransMaster
             
               if(tempdata.length >0)
              {
                tempdata.sort((a, b) => parseFloat(b.trans_id) - parseFloat(a.trans_id));
                self.setState({data:tempdata,loading:false
                 })
              } 
              else{
                self.setState({loading:false
                })

              }
              
            });
          },(error)=>{
            alert('error.')
          })
    }

    showdata(){
        var delay=500
        if(this.state.data.length>0){
            return(
            this.state.data.map((data)=>{
                delay +=100
                return(
                   
                    <Accordian width={width-50} data={data} delay={delay}></Accordian>
                )
            })
            )
        }
    }

    render(){
        return(
            <View style={{flex:1}}>
                                  <Header style={{ backgroundColor: '#fafafa',borderColor:'white',borderWidth:2}}>
            <StatusBar backgroundColor="#002171" />
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={require('../../assets/Images/HomeImages/Backwardarrow.png')} style={{ height: 20, width: 20 }}></Image>
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1 }}>
              <Text style={{ color: '#ff5722', fontSize: 20,fontWeight:'bold' }}>Fees</Text>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>

            {/* <ImageBackground source={require('../../assets/Images/HomeImages/backimg.png')} style={{resizeMode:'cover',flex:1}} > */}
            <View style={{flex:1,marginTop:50,alignItems:'center'}}>
            <View style={{width:width-50,borderBottomWidth:2,borderBottomColor:'black'}}>
                <Text style={{fontSize:20,fontWeight:'bold'}}>Transaction History</Text>
            </View>
            <ScrollView>
            {this.state.data.length>0?this.showdata():this.state.loading?<Loader/>:<Nodata/>}
            </ScrollView>
            </View>
            </View>
        )
    }
}