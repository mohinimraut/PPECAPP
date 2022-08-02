
'use strict'
import React from "react";
import { StatusBar, Text, Image, ImageBackground, TouchableOpacity ,View} from "react-native";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {Container,Body,Header,Left,Right} from "native-base";
import AddtoGallery from './AddtoGallery'
import ViewGallery from'./ViewGallery'
import {connect} from 'react-redux'
 class StaffGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner:false
        }
    }
    render (){
        return(
            <Container>
        <ImageBackground
          resizeMode={'cover'}
          style={{ flex: 1 }}
          source={require('../../assets/background.png')}
        >
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
          
          />
          <Header style={{ backgroundColor: '#fafafa',borderColor:'white',borderWidth:2}}>
            <StatusBar backgroundColor="#ff5722" />
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={require('../../assets/Images/HomeImages/Backwardarrow.png')} style={{ height: 20, width: 20 }}></Image>
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1 }}>
              <Text style={{ color: '#ff5722', fontSize: 20,fontWeight:'bold' }}>Gallery</Text>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <App/>
          </ImageBackground>
          </Container>  
        )
    }
}
function mapStateToProps(state) {
  console.log("view" + JSON.stringify(state.gallery));
  return {
    isgalleryupdated: state.gallery["isgalleryupdated"],
    currenttab: state.gallery["currenttab"],
    option: state.gallery["option"]
  };
}

export default connect(mapStateToProps)(StaffGallery);


const TabNavigator = createMaterialTopTabNavigator(
    {
    add:
    {
        screen: AddtoGallery,
        navigationOptions: {
        tabBarLabel:() => (
            <View style={{justifyContent:'center',flex:1}}>
            <Text  style={{fontSize:15,marginTop:-15,}}>ADD </Text>
             </View>
      
          ),
        
       
      },
    },
    view:
    {
        screen:ViewGallery,
        navigationOptions: {
            tabBarLabel:() => (
                <View style={{justifyContent:'center',flex:1}}>
            <Text style={{fontSize:15,marginTop:-15,}}>VIEW</Text>
             </View>
      
              ),
           
          },
    },
   
   
  },
  {lazy :true,
  tabBarOptions: {   
    activeTintColor: '#000000',
    inactiveTintColor: '#fff',
    showIcon: true ,
    style: {
      
        backgroundColor: '#c5c5c5',
        height:55
      },
      indicatorStyle: {
        borderBottomColor:'#ff3d00',
        borderBottomWidth: 2,
      }
    

  }
}
  )
  
 const App= createAppContainer(TabNavigator);

