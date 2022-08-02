import React from "react";
import { StatusBar, Text, Image, ImageBackground,TextInput, TouchableOpacity,View,ScrollView,Dimensions} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {Container,Body,Header,Left,Right,Button} from "native-base";
import {studsearchapi,feedetails} from '../api/index'
import { SQLite } from 'expo-sqlite';
import Accordian  from '../components/Accordian';
import Loader from '../components/Loader'
const db = SQLite.openDatabase('EDUDUNIYA.db');
var width = Dimensions.get('window').width;
export default class Stafffee extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            username:'',
            staffid:'',
            studdata:[],
            feeview:false,
            feedata:[],
            nodata:false,
      }
      this.getuserid()
    }

    getuserid=async()=> {
        
      await db.transaction(async (txm) => {
         await txm.executeSql("select * from tbllogin where isactive='1';", [],async   (tx, results) => {
           var data=results.rows.item(0);
          this.setState({staffid:data.userid})
        

         });
       }, (error) => {
       })
      
   }

    async search(){
      this.setState({loading:true})
      if(this.state.username.length>=3){
        var result=await studsearchapi(this.state.username,this.state.staffid);
        if(result=='error'){
          alert('soomething went wrong')
        }else if(result=='No Data'){
          this.setState({nodata:true,loading:false})
        }else{
          this.setState({studdata:result,nodata:false,loading:false})
          console.log(result)
        }
      }else{
        this.setState({loading:false,nodata:false,})
        alert('enter atleast 3 character')
        
      }
    }

    async showfees(studid){
      this.setState({loading:true})
      var result=await feedetails(studid)
      if(result=='error'){
        this.setState({loading:false})
        alert('something went wrong')
      }else{
        this.setState({feedata:result.studTransMaster,feeview:true,loading:false})
      }
    }

    mainView(){
      var delay=0
      if(!this.state.feeview){
        return(
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
           <View style={{marginTop:10,marginBottom:10,alignItems: 'center',flexDirection: 'row',width:'90%',borderWidth:1,borderRadius:50,borderColor:'#ff5722'}}>
           
            <TextInput
                placeholder='USERID/NAME/GRNO'
                placeholderTextColor='black'
                onChangeText={(text)=>this.setState({username:text})}
                value={this.state.username}
                
                style={{flex:1,color:'grey',margin:10,height:40,fontSize:20}}
            />
            <TouchableOpacity onPress={()=>{this.search()}}>
             <Image source={require('../../assets/icon/search.png')} style={{marginLeft:15,marginRight:10,marginTop:10,marginBottom:10,height:35,width:35}}></Image>
            </TouchableOpacity>
        </View> 
        {this.state.studdata.length>0?
        <View style={{flex:1}}>
        <ScrollView>
          <View style={{flex:1,alignItems:'center'}}>
            {this.state.studdata.map(data=>{
              return(
                <View style={{width:'90%',borderBottomColor:'black',borderBottomWidth:1,margin:10}}>
                  <TouchableOpacity onPress={()=>{this.showfees(data.studid)}}>
                  <Text style={{fontSize:20,fontWeight:'bold',color:'#ff5722'}}>{data.stud_F_Name} {data.stud_M_Name} {data.stud_L_Name}</Text>
                  <View style={{margin:5,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize:15}}>Class: {data.class_name}</Text>
                    <Text style={{fontSize:15}}>Div: {data.div_name}</Text>
                    <Text style={{fontSize:15}}>Roll.No: {data.rollno}</Text>
                  </View>
                  <Text style={{fontSize:15,margin:10}}>GRNO: {data.grno}</Text> 
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </ScrollView> 
        </View>  
        :this.state.nodata?<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:20}}>No Student Found!!!</Text>
      </View>:<View></View>
        }
        </View>

        )
      }else{
        return(
          this.state.feedata.length>0?
          <View style={{flex:1}}>
            <ScrollView>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              {this.state.feedata.map((data)=>{
                  delay +=100
                  return(
                      <Accordian width={width-50} data={data} delay={delay}></Accordian>
                  )
              })}
              <Button onPress={()=>{this.setState({feeview:false})}} style={{borderRadius:10,margin:15,width:'80%',backgroundColor:'#ff5722'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:'white'}}>GO back</Text>
                </View>
              </Button>
              </View>
            </ScrollView>
          </View>
          :<View style={{flex:1,alignContent:'center',justifyContent:'center'}}>
              <Text>No transaction </Text>
              <Button onPress={()=>{this.setState({feeview:false})}} style={{borderRadius:10,margin:15,width:'80%',backgroundColor:'#ff5722'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:'white'}}>GO back</Text>
                </View>
              </Button>
          
             </View>
        )
      }
    }

    render(){
        return(   <Container>
            <ImageBackground
              resizeMode={'cover'}
              style={{ flex: 1 }}
              source={require('../../assets/background.png')}
            >
              <Header style={{ backgroundColor: '#fafafa' }}>
                <StatusBar backgroundColor="#002171" />
                <Left style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <Image source={require('../../assets/Images/HomeImages/Backwardarrow.png')} style={{ height: 20, width: 20 }}></Image>
                  </TouchableOpacity>
                </Left>
                <Body style={{ flex: 1 }}>
                  <Text style={{ color: '#ff5722', fontSize: 20 }}>Fees</Text>
                </Body>
                <Right style={{ flex: 1 }}>
                </Right>
              </Header>
              {this.state.loading?<Loader/>:this.mainView()}
              </ImageBackground>
              </Container>  )
    }
}