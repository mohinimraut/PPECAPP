
'use strict'
import React from "react";
import { StatusBar, Text, Image, ScrollView, ImageBackground, TouchableOpacity ,View} from "react-native";
import {createMaterialTopTabNavigator,createStackNavigator,createNavigationContainer,createAppContainer} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {Container,Body,Content,Header,Left,Right} from "native-base";
import AddPoll from './AddPoll'
import Poll from'./Poll'
import PollStatus from './PollStatus'

export default class StaffPoll extends React.Component {
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
          <Header style={{ backgroundColor: '#fafafa' }}>
            <StatusBar backgroundColor="#002171" />
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image source={require('../../assets/Images/HomeImages/Backwardarrow.png')} style={{ height: 30, width: 30 }}></Image>
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1 }}>
              <Text style={{ color: '#ff5722', fontSize: 20 }}>Poll</Text>
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

const TabNavigator = createMaterialTopTabNavigator(
    {
    add:
    {
        screen: AddPoll,
        navigationOptions: {
        tabBarLabel:({ tintColor }) => (
            <View style={{justifyContent:'center',flex:1}}>
            <Text  style={{color: '#ff5722',fontSize:15,marginTop:-15}}>ADD </Text>
             </View>
      
          ),
        
       
      },
    },
    poll:
    {
        screen:Poll,
        navigationOptions: {
            tabBarLabel:({ tintColor }) => (
                <View style={{justifyContent:'center',flex:1}}>
            <Text style={{color: '#ff5722',fontSize:15,marginTop:-15}}>POLL</Text>
             </View>
      
              ),
           
          },
    },
    Status:
    {
        screen:PollStatus,
        navigationOptions: {
            tabBarLabel:({ tintColor }) => (
            <View style={{justifyContent:'center',flex:1}}>
            <Text style={{color: '#ff5722',fontSize:15,marginTop:-15}}>STATUS</Text>
             </View>
      
              ),
           
          },
    }
   
  },
  {
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
  
 const App= createNavigationContainer(TabNavigator);

