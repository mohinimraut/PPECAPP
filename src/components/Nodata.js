import React from 'react';
import {View,Image,Text} from 'react-native';

export default class Nodata extends React.Component{

    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Image source={require('../../assets/norecord.gif')} style={{ height: this.props.height?this.props.height:250, width: this.props.width?this.props.width:250 }}></Image>
              <Text style={{alignSelf:'center',fontSize:15,fontWeight:'bold'}}>{this.props.text?this.props.text:"No Records Found"} </Text>
           </View>
        )
    }
}