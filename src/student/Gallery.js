import React from 'react';
import {View ,Text,TouchableOpacity,Image} from 'react-native'
import ViewGallery from '../staff/ViewGallery'
import {Header} from 'native-base'
export default class Galley extends React.Component {
    render (){
        return(<View style={{flex:1}}>
            <Header style={{backgroundColor:"white"}}>
                    <View style={{alignItems:"flex-start",justifyContent:"center"}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Image style={{height:20,width:20}} source={require('../../assets/Images/HomeImages/Backwardarrow.png')}></Image>
                    </TouchableOpacity >
                    </View>
                    <View style={{flex:1,justifyContent:"center",paddingLeft:30}}>
                    <Text style={{color:"#ff7043",fontWeight:"bold",fontSize:20}}>Gallery</Text>
                    </View>
                </Header>
           <ViewGallery/>
           </View>
        )
    }
}