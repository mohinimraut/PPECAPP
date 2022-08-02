import React from 'react';
import {View,Text,Image,TouchableOpacity} from 'react-native';
import {Button} from 'native-base';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';

export default class Accordian extends React.Component{
    state={
        open:false
    }
    render(){
        return(
         
            <Animatable.View useNativeDriver={true} animation='zoomIn' delay={this.props.delay}>
                <TouchableOpacity  onPress={()=>{this.setState({open:!this.state.open})}}>
                <View style={{marginTop:30,borderRadius:10,height:75,width:this.props.width,justifyContent:'center',backgroundColor:'#ff5722'}}>
                <Text style={{marginLeft:50,fontSize:25,}}>{this.props.data.tran_date}</Text>
                </View>
                </TouchableOpacity>
                {this.state.open?
                <Animatable.View useNativeDriver={true} animation='fadeInDown' style={{backgroundColor:'#ffbb7e',width:this.props.width}}>
               <View style={{flexDirection:'row',marginTop:10}}>
               {/* <Image source={require('../../assets/rupee.png')} style={{marginLeft:20,height:15,width:15,marginTop:3}}></Image> */}
                <Text style={{marginLeft:20,fontSize:20}}>Amount :{this.props.data.amount}/-</Text>
               </View>
                <Text style={{fontSize:20,marginLeft:20,marginTop:10,marginBottom:20}}>Paid by:{this.props.data.pay_mode}</Text>
                </Animatable.View>:
                <View></View>}
              
            </Animatable.View>
           
        )
    }
}