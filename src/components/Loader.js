import React from 'react';
import {View,Text,Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
export default class loader extends React.Component{
    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         
          <Image style={{width:180,height:180,borderRadius:90,marginBottom:30}} source={require('../../assets/logo.jpg')}></Image>
          

            <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
              <Animatable.Text useNativeDriver={true} animation='bounceIn' delay={0} style={{fontSize:30,fontWeight:'bold'}} >Loading</Animatable.Text>
               <Animatable.View animation="bounce" iterationCount="infinite" delay={100} useNativeDriver={true} style={{height:10,width:10,borderRadius:5,backgroundColor:'black',marginLeft:3,marginRight:3,marginTop:10}}></Animatable.View>
               <Animatable.View animation="bounce" iterationCount="infinite" delay={200} useNativeDriver={true} style={{height:10,width:10,borderRadius:5,backgroundColor:'black',marginLeft:3,marginRight:3,marginTop:10}}></Animatable.View>
               <Animatable.View animation="bounce" iterationCount="infinite" delay={300} useNativeDriver={true} style={{height:10,width:10,borderRadius:5,backgroundColor:'black',marginLeft:3,marginRight:3,marginTop:10}}></Animatable.View>
               <Animatable.View animation="bounce" iterationCount="infinite" delay={400} useNativeDriver={true} style={{height:10,width:10,borderRadius:5,backgroundColor:'black',marginLeft:3,marginRight:3,marginTop:10}}></Animatable.View>
            </View>
            </View>
        )
    }
}