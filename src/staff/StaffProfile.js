import React from 'react';
import {View ,Text,ImageBackground,TouchableOpacity,Platform,Image,Dimensions} from 'react-native'
import { Container } from 'native-base';
var w = Dimensions.get('window').width;
import { SQLite,  } from 'expo-sqlite';
import { ScrollView } from 'react-native-gesture-handler';
const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class StaffProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          datattest: [],
          pic: '',
          username: 'cvbcv',
          password: 'bvb',
          responce: 'cvbcv',
          isReady: true,
          showToast: false,
          spinner_new: true,
          cheking: true,
          stud_id: '',
        }
        console.log('constructor..... ')
        this.myRef = React.createRef();
      }
 
     async componentDidMount() {
        this.mounted = true;
       await this._profiledata();  
      }
      async _profiledata() {
       
        db.transaction((txm) => {
          txm.executeSql("SELECT * FROM Staffdetails where staffid=(select userid from tbllogin where isactive='1' );", [], (tx, results) => {
            console.log(results)
            
            this.setState({
              datattest: results.rows.item(0)
            })
            this.setState({
                pic: keys.portal+this.state.datattest.photo_path.substring(2),
              })
             
          });
        }, (error) => {
          console.log(error)
        })
    
        console.log('4')
    
        this.setState({
          spinner_new: false
        })
      }
    render (){
        return(
           <Container>
                <ScrollView>
            <View style={{height:'45%',backgroundColor:'#ff7043'}}>   
      {
        Platform.OS === 'ios' ?<View style={{backgroundColor:'transparent',height:'30%',paddingTop:15}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
           </TouchableOpacity >
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>Profile</Text>
          </View>
        </View>
       </View>:<View style={{backgroundColor:'transparent',height:'25%'}}>
   <View style={{flexDirection:'row',flex:1}}>
   <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
   <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
   <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
    </TouchableOpacity >
   </View>
   <View style={{flex:1,justifyContent:"center"}}>
       <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>Profile</Text>
   </View>
 </View>
</View>
    }
   
     <View style={{alignItems:'center'}}>
         {this.state.datattest.photo_path=='' ? <Image style={{height:100,width:100,borderRadius:70}} source={require('../../assets/profile.png')}></Image> :<Image style={{height:100,width:100,borderRadius:70}} source={{uri:this.state.pic}}></Image>}

         </View>
     <View style={{height:'70%',backgroundColor:'#78909C',width:w-50,alignSelf:"center",borderRadius:6,elevation:5,marginTop:60}}>
        
     <View style={{height:'30%',paddingLeft:20,justifyContent:'center'}}>
      <Text style={{fontWeight:"bold",fontSize:18,color:"white"}}>{this.state.datattest.fname}  {this.state.datattest.lname}</Text>
     </View>
     <View style={{height:0.90,width:w-80,alignSelf:'center',backgroundColor:"#767E93",opacity:0.8,elevation:2}}></View>
     <View style={{height:'20%',paddingLeft:20,paddingTop:10}}><Text style={{fontSize:10,fontWeight:'bold',color:'#545E78'}}>Date of Birth</Text></View>
     <View style={{flexDirection:"row",height:'30%'}}>
     <View style={{height:'100%',paddingLeft:20,alignItems:"center"}}>{this.state.datattest.dob=='' ?<Text>12-12-2000</Text> :<Text style={{fontSize:20,fontWeight:'bold',color:'#545E78'}}>{this.state.datattest.dob}</Text>}</View>
     <View style={{height:'100%',paddingLeft:10,paddingTop:4}}><Text style={{fontSize:15,fontWeight:'bold',color:'#667088',alignSelf:"center"}}>(DD-MM-YYYY)</Text></View>
     </View>
     <View style={{flexDirection:"row"}}>
      <View style={{paddingLeft:20}}>
          <Text style={{fontSize:10,fontWeight:'bold',color:"#CFD3DD"}}>Department</Text>
          <Text style={{fontWeight:'bold',color:'white'}}>{this.state.datattest.department}</Text>
      </View>
      <View style={{paddingLeft:10}}>
          <Text style={{fontSize:10,fontWeight:'bold',color:"#CFD3DD"}}>Designation</Text>
          <Text style={{fontWeight:'bold',color:'white'}}>{this.state.datattest.designation}</Text>
      </View>
     </View>
    </View>
   
   </View>
  
   <View style={{height:'60%',}}>
      <View style={{marginTop:180,marginLeft:30}}><Text style={{fontSize:18,fontWeight:'bold',opacity:0.7}}>Other Details</Text></View>
      <View style={{flex:1}}>
          <View style={{flexDirection:"row",paddingLeft:30,marginTop:15}}><View style={{justifyContent:'center',width:'35%' }}><Text>Mobile Number</Text></View><View style={{width:'10%'}}><Text>:</Text></View><View style={{justifyContent:'center'}}>{this.state.datattest.mob=='' ?<Text style={{fontWeight:'bold'}}>-----</Text>:<Text style={{fontWeight:'bold'}}>{this.state.datattest.mob}</Text> }</View></View>
          <View style={{height:0.50,width:w-50,alignSelf:'center',backgroundColor:"#767E93",opacity:0.8,elevation:2}}></View>
          <View style={{flexDirection:"row",paddingLeft:30,marginTop:15}}><View style={{justifyContent:'center',width:'35%'}}><Text>Gender</Text></View><View style={{width:'10%'}}><Text>:</Text></View><View style={{justifyContent:'center'}}>{this.state.datattest.gender=='' ?<Text style={{fontWeight:'bold'}}>-----</Text>:<Text style={{fontWeight:'bold'}}>{this.state.datattest.gender}</Text> }</View></View>
          <View style={{height:0.50,width:w-50,alignSelf:'center',backgroundColor:"#767E93",opacity:0.8,elevation:2}}></View>
          <View style={{flexDirection:"row",paddingLeft:30,marginTop:15}}><View style={{justifyContent:'center',width:'35%' }}><Text>Address</Text></View><View style={{width:'10%'}}><Text>:</Text></View><View style={{justifyContent:'center',width:'50%'}}>{this.state.datattest.address1=='' ?<Text style={{fontWeight:'bold'}}>-----</Text>:<Text style={{fontWeight:'bold'}}>{this.state.datattest.address1}</Text> }</View></View>
          <View style={{height:0.50,width:w-50,alignSelf:'center',backgroundColor:"#767E93",opacity:0.8,elevation:2}}></View>
          <View style={{flexDirection:"row",paddingLeft:30,marginTop:15}}><View style={{justifyContent:'center',width:'35%' }}><Text>Email</Text></View><View style={{width:'10%'}}><Text>:</Text></View><View style={{justifyContent:'center'}}>{this.state.datattest.email=='' ?<Text style={{fontWeight:'bold'}}>-----</Text>:<Text style={{fontWeight:'bold'}}>{this.state.datattest.mob}</Text> }</View></View>
          <View style={{height:0.50,width:w-50,alignSelf:'center',backgroundColor:"#767E93",opacity:0.8,elevation:2}}></View>
      </View>
   </View>
   </ScrollView>
           </Container>
        )
    }
}