'use strict'
import React from "react";
import { StatusBar, StyleSheet, View, Text, Image, Dimensions, ScrollView, ImageBackground, TouchableOpacity,Animated } from "react-native";
import * as Animatable from 'react-native-animatable';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, NavigationActions } from 'react-navigation';
import {

  Container,
  Card,
  CardItem,
  Body,
  Content,
  Header,
  Left,
  Icon,
  Button,
  Accordion,
  Thumbnail,
  Right

} from "native-base";

const dataArray = [
  { title: "All Academics Details", content: "Lorem ipsum dolor sit amet" },

];
const dataArray2 = [
  { title: "Basic Details", content: "Lorem ipsum dolor sit amet" },

];
const dataArray3 = [
  { title: "Other Details", content: "Lorem ipsum dolor sit amet" },

];
var width = ((Dimensions.get('window').width) / 2) - 60;
import { SQLite } from 'expo-sqlite';
import keys from '../api/keys'
const db = SQLite.openDatabase('EDUDUNIYA.db');
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default class Profile extends React.Component {
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
      scrollY: new Animated.Value(0),
    }
    console.log('constructor..... ')
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.mounted = true;
    this._profiledata();  
  }
  async _profiledata() {
    db.transaction((txm) => {
      txm.executeSql("SELECT * FROM studdetails where userid=(select userid from tbllogin where isactive='1' );", [], (tx, results) => {
        console.log(results)
        
        this.setState({
          datattest: results.rows.item(0)
        })
        this.setState({
          pic: keys.portal+this.state.datattest.photpath.substring(2),
        })
                  console.log(this.state.datattest)
      });
    }, (error) => {
      alert('error.')
    })

    console.log('4')

    this.setState({
      spinner_new: false
    })
  }
  _acordianheader=(content) =>{
    return (
      <View   style={{flexDirection: 'row', height: 40, backgroundColor: '#212121',opacity:0.9 }}>
        <View style={{ marginLeft:20,justifyContent:'center',alignItems:'center'}}>
     {/* <FontAwesome  name="users" size={20} style={{ color: 'white' }} /> */}
     </View>
        <Animatable.Text animation="fadeIn" delay={500} useNativeDriver={true}   style={{ alignItems: 'center', color: '#fff', justifyContent: 'center', marginTop: 10,marginLeft:20,fontWeight:'bold' }}>Personal Detail's</Animatable.Text>
      </View>

    )
  }
  _acordianheader2=(content)=> {
    return (
      <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#212121' ,opacity:0.9}}>
        <View style={{ marginLeft:20,justifyContent:'center',alignItems:'center'}}>
     {/* <FontAwesome name="graduation-cap" size={20} style={{ color: 'white' }} /> */}
     </View>
        <Text style={{ alignItems: 'center', color: '#fff', justifyContent: 'center', marginTop: 10 ,marginLeft:20,fontWeight:'bold'}}>All Academics Detail's</Text>
      </View>
    )
  }
  _acordianheader3=(content)=> {
    return (
      <View style={{ flexDirection: 'row', height: 40, backgroundColor: '#212121' ,opacity:0.9}}>
      <View style={{ marginLeft:20,justifyContent:'center',alignItems:'center'}}>
   {/* <FontAwesome name="list-ul" size={20} style={{ color: 'white' }} /> */}
   </View>
      <Text style={{ alignItems: 'center', color: '#fff', justifyContent: 'center', marginTop: 10 ,marginLeft:20,fontWeight:'bold'}}>Other Detail's</Text>
    </View>
    )
  }
  _acodiandata2=(content) =>{
    return (
      <View style={{ backgroundColor:"#eceff1",height:90,elevation:5}}>
        <View style={{flexDirection:'row'}}>
         <View style={{paddingLeft:20,justifyContent:'flex-end'}}>
         <FontAwesome name="circle-o" size={20} style={{ color: '#ff5722', opacity:0.8}} />
                </View>
                <View style={{paddingLeft:10,justifyContent:'flex-end'}}>
                <Text style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>{this.state.datattest.academic}</Text>
                </View> 
                </View>
                <View style={{paddingLeft:35,paddingTop:8}}>
        <View style={{backgroundColor:'#ff5722',height:'50%',width:'20%',borderRadius:5,justifyContent:'center',alignItems:'center', opacity:0.8}}><Text style={{color:"white"}}>{this.state.datattest.classname}</Text></View>
        </View>
      </View>

    )
  }
  _acodiandata=(content) =>{
    return (
    
      <View   style={{flex:1,elevation:5}}>
              <View style={{backgroundColor:"#eceff1",elevation:5}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flex:1,paddingLeft:20,paddingTop:15}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{width:'50%',height:30,backgroundColor:'#ff7043',borderRadius:10,justifyContent:'center',alignItems:"center",opacity:0.8}}>
                <Animatable.Text  style={{ color: '#fff', marginLeft: 4, alignItems: 'center', justifyContent: 'center',fontWeight:'bold' }}>
                 Personal Details
                </Animatable.Text>
              </Animatable.View >
              </Animatable.View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}  style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                <Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}   style={{fontWeight:"bold"}}>First Name</Animatable.Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:65,justifyContent:'flex-end'}}>
                  {this.state.datattest.user_f_name=='' ? <Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}  >-----</Animatable.Text> 
                  :<Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}  >{this.state.datattest.user_f_name}</Animatable.Text>}
               
                </Animatable.View >

              </Animatable.View >
              <View  style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}   style={{fontWeight:"bold"}}>Middle Name</Animatable.Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:50,justifyContent:'flex-end'}}>
                {this.state.datattest.user_m_name=='' ? <Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}  >-----</Animatable.Text>
                 :<Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}  >{this.state.datattest.user_m_name}</Animatable.Text>}
                </Animatable.View >

              </Animatable.View >
              <View   style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}   style={{fontWeight:"bold"}}>Surname</Animatable.Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:76,justifyContent:'flex-end'}}>
                {this.state.datattest.user_l_name=='' ? <Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}  >-----</Animatable.Text> 
                :<Animatable.Text  animation="zoomIn" delay={500} useNativeDriver={true}  >{this.state.datattest.user_l_name}</Animatable.Text>}
                </Animatable.View >

              </Animatable.View >
              <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
              </View >
              <View   style={{backgroundColor:"#eceff1",elevation:5}}> 
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flex:1,paddingLeft:20,paddingTop:15}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{width:150,height:30,backgroundColor:'#ff7043',borderRadius:10,justifyContent:'center',alignItems:"center",opacity:0.8}}>
                <Text  style={{ color: '#fff', marginLeft: 4, alignItems: 'center', justifyContent: 'center',fontWeight:'bold' }}>
                 Father's Details
                </Text>
              </Animatable.View >
              </Animatable.View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Text style={{fontWeight:"bold"}}>First Name</Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:65,justifyContent:'flex-end'}}>
                {this.state.datattest.user_m_name=='' ? <Text>-----</Text> :<Text>{this.state.datattest.user_m_name}</Text>}
                </Animatable.View >

              </Animatable.View >
              <View   style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Text style={{fontWeight:"bold"}}>Middle Name</Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:50,justifyContent:'flex-end'}}>
                <Text>-----</Text>
                </Animatable.View >

              </Animatable.View >
              <View  style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Text style={{fontWeight:"bold"}}>Surname</Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:76,justifyContent:'flex-end'}}>
                {this.state.datattest.user_l_name=='' ? <Text>-----</Text> :<Text>{this.state.datattest.user_l_name}</Text>}
                </Animatable.View >

              </Animatable.View >
              <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
              </View >
              <View   style={{backgroundColor:"#eceff1",elevation:5}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flex:1,paddingLeft:20,paddingTop:15}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{width:150,height:30,backgroundColor:'#ff7043',borderRadius:10,justifyContent:'center',alignItems:"center",opacity:0.8}}>
                <Text  style={{ color: '#fff', marginLeft: 4, alignItems: 'center', justifyContent: 'center',fontWeight:'bold' }}>
                 Mother's Details
                </Text>
              </Animatable.View >
              </Animatable.View >
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Text style={{fontWeight:"bold"}}>First Name</Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:65,justifyContent:'flex-end'}}>
                {this.state.datattest.motherfname=='' ? <Text>-----</Text> :<Text>{this.state.datattest.motherfname}</Text>}
                </Animatable.View >

              </Animatable.View >
              <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Text style={{fontWeight:"bold"}}>Middle Name</Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:50,justifyContent:'flex-end'}}>
                {this.state.datattest.user_m_name=='' ? <Text>-----</Text> :<Text>{this.state.datattest.user_m_name}</Text>}
                </Animatable.View >

              </Animatable.View >
              <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{flexDirection:'row',height:40}}>
              <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:20,justifyContent:'flex-end'}}>
                  <Text style={{fontWeight:"bold"}}>Surname</Text>
                </Animatable.View >
                <Animatable.View  animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:76,justifyContent:'flex-end'}}>
                {this.state.datattest.user_l_name=='' ? <Text>-----</Text> :<Text>{this.state.datattest.user_l_name}</Text>}
                </Animatable.View >

              </Animatable.View >
              <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
              <View style={{height:20,backgroundColor:"#eceff1"}}></View>
              </View >
       </View >
    )
  }
  _acodiandata3=(content)=> {
    return (
      <View style={{flex:1,elevation:5}}>
      <View style={{backgroundColor:"#eceff1"}}>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>State</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.state=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.state}</Text>}
        </View>

      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>City</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.city=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.city}</Text>}
        </View>

      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
     
      </View>
      <View style={{backgroundColor:"#eceff1"}}> 
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>Caste</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.caste=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.caste}</Text>}
        </View>

      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>Category</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.category=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.category}</Text>}
        </View>
      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>Blood Group</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.bloodgroup=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.bloodgroup}</Text>}
        </View>

      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end',width:'35%'}}>
          <Text style={{fontWeight:"bold"}}>Parent Email</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.parentemail=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.parentemail}</Text>}
        </View>

      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>Parent Mobile</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.parentmob=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.parentmob}</Text>}
        </View>

      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{flexDirection:'row',height:40}}>
        <View style={{paddingLeft:20,width:'35%',justifyContent:'flex-end'}}>
          <Text style={{fontWeight:"bold"}}>Surname</Text>
        </View>
        <View style={{paddingLeft:65,justifyContent:'flex-end'}}>
          {this.state.datattest.category=='' ?<Text>-----</Text>:  <Text>{this.state.datattest.category}</Text>}
        </View>
      </View>
      <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
      <View style={{height:20,backgroundColor:"#eceff1"}}></View>
      </View>
</View>

    )

  }
  _letseee() {
    console.log('enter')
    this.setState({
      cheking: !this.state.cheking
    })


  }
  reset() {
    return (
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate('Switchaccount')
        ]
      }))
    )
  }


  
  render() {
    // const headerHeight = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_SCROLL_DISTANCE],
    //   outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    //   extrapolate: 'clamp',
    // });
    return (
      <Container>
        <ImageBackground
          resizeMode={'cover'}
          style={{ flex: 1 }}
          source={require('../../assets/background.png')}
        >
          <Spinner
            visible={this.state.spinner_new}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
       
          <Header style={{ backgroundColor: '#fafafa' }}>
            <StatusBar backgroundColor="#002171"/>
            <Left style={{ flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image style={{height:20,width:20}} source={require('../../assets/Images/HomeImages/Backwardarrow.png')}></Image>
               </TouchableOpacity >
            </Left>
            <Body style={{ flex: 1 }}>
              <Text style={{ color: '#ff5722', fontSize: 20,fontWeight:"bold" }}>Profile</Text>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
         
          <ScrollView >
            <View  style={{flex:1}}>
                <Animatable.View  animation="zoomIn" delay={500}useNativeDriver={true} style={{justifyContent:'center',alignItems:'center',margin:10}}>
                {this.state.datattest.photpath==''?
                    <Image style={{height:100,width:100,borderRadius:50,margin:10}}  indicator='bar' source={require('../../assets/Images/HomeImages/profile.png')} />
                   :
                   <Image style={{height:100,width:100,borderRadius:50,margin:10}} source={{uri:this.state.pic}}></Image>}
                    <Animatable.Text animation='zoomIn' delay={500} useNativeDriver={true}  style={{ color: '#ff7043',fontWeight:'bold' }}>{this.state.datattest.user_f_name+' '+this.state.datattest.user_m_name+' '+this.state.datattest.user_l_name}</Animatable.Text>
                    <Animatable.Text animation='zoomIn' delay={500} useNativeDriver={true}  style={{ fontWeight:'bold',color:'#424242' }}> Roll no.:{this.state.datattest.rollno}</Animatable.Text>
                </Animatable.View>
                <View   style={{marginLeft:15,marginRight:15,height:'55%',backgroundColor:"#eceff1",elevation:5}}>
                  <Animatable.View animation="zoomIn" delay={500} useNativeDriver={true}  style={{paddingLeft:30,height:'15%',flex:1,justifyContent:'center'}}>
                    <Animatable.Text animation='zoomIn' delay={500} useNativeDriver={true}   style={{fontWeight:'bold',opacity:0.8,color:'#424242'}}>Student ID</Animatable.Text>
                    <Animatable.Text animation="zoomIn" delay={500} useNativeDriver={true}    style={{color:'#ff7043',fontSize:18,fontWeight:'bold',opacity:0.7}}>{this.state.datattest.userid}</Animatable.Text>
                  </Animatable.View>
                  <View  style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
                  <Animatable.View animation="zoomIn" delay={500} useNativeDriver={true}   style={{paddingLeft:30,height:'15%',flex:1,justifyContent:'center'}}>
                    <Animatable.Text animation="zoomIn" delay={500}useNativeDriver={true}   style={{fontWeight:'bold',opacity:0.8,color:'#424242'}}>GR no.</Animatable.Text>
                    <Animatable.Text animation="zoomIn" delay={500} useNativeDriver={true}    style={{color:'#ff7043',fontSize:18,fontWeight:'bold',opacity:0.7}}>{this.state.datattest.grno}</Animatable.Text>
                  </Animatable.View>
                  <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15}}></View>
                  <Animatable.View style={{paddingLeft:30,height:'15%',flex:1,justifyContent:'center'}}>
                    <Animatable.Text animation="zoomIn" delay={500} useNativeDriver={true}   style={{fontWeight:'bold',opacity:0.8,color:'#424242'}}>Current Academic</Animatable.Text>
                    <Animatable.Text animation="zoomIn" delay={500} useNativeDriver={true}   style={{color:'#ff7043',fontSize:18,fontWeight:'bold',opacity:0.7}}>{this.state.datattest.academic}</Animatable.Text>
                  </Animatable.View>
                  <View style={{height:1,backgroundColor:"#bdbdbd",marginLeft:15,marginRight:15,marginBottom:10}}></View>
                </View>
                </View>
              <View style={{paddingTop:40}}>
            <View style={{ padding: 5 }}>
              <Accordion dataArray={dataArray}  renderContent={this._acodiandata} renderHeader={this._acordianheader}  expanded={0} style={{ marginRight: 10, marginLeft: 10}} />
            </View>
            <View style={{ padding: 5 }}>
              <Accordion dataArray={dataArray2}  expanded={0} renderContent={this._acodiandata2} renderHeader={this._acordianheader2} style={{ marginRight: 10, marginLeft: 10 }} />
            </View>
            <View style={{ padding: 5 }}>
              <Accordion dataArray={dataArray3}  expanded={0} renderContent={this._acodiandata3} renderHeader={this._acordianheader3} style={{ marginRight: 10, marginLeft: 10 }} />
            </View>
            </View>
          
          </ScrollView>
        </ImageBackground>

      </Container>


    )
  }
}
const styles = StyleSheet.create({
  text: {
    borderRadius: 150,
    flex: 3,
    justifyContent: 'center',
  },
  image: {
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 100,

  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginRight: 12,
    marginLeft: 12

  },
  spinnerTextStyle: {
    color: '#ff5722'
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
})


