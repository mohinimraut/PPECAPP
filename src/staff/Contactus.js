import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Platform } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Container } from 'native-base';
import { Linking } from 'react-native'
import * as Animatable from 'react-native-animatable';

export default class Contactus extends React.Component {

  handleclick(type, data) {
    if (type == 'phone') {
      var no = data.replace("-", "");
      no = no.replace(" ", "")
      Linking.openURL(`tel:${no}`)
    } else if (type == 'mail') {
      Linking.openURL('mailto:' + data);
    } else if (type == 'url') {
      Linking.openURL('http://' + data)
    }
  }
  render() {
    return (

      <ImageBackground
    
        source={require('../../assets/background.png')}
        style={styles.container}>
        {
          Platform.OS === 'ios' ? <View style={{ backgroundColor: 'transparent', height: '10%', paddingTop: 15 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ width: '20%', paddingLeft: 10, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <Image style={{ height: 25, width: 25 }} source={require('../../assets/icon/leftarrow.png')}></Image>
                </TouchableOpacity >
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ color: '#FF4500', justifyContent: "center", paddingLeft: 5, fontSize: 20, fontWeight: 'bold' }}>CONTACT US</Text>
              </View>
            </View>
          </View> : <View style={{ backgroundColor: 'transparent', height: '8%' }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ width: '20%', paddingLeft: 10, justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                    <Image style={{ height: 25, width: 25 }} source={require('../../assets/icon/leftarrow.png')}></Image>
                  </TouchableOpacity >
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={{ color: '#FF4500', justifyContent: "center", paddingLeft: 5, fontSize: 20, fontWeight: 'bold' }}>Contact Us</Text>
                </View>
              </View>
            </View>
        }
  <ScrollView>
        <Container style={{ backgroundColor: 'transparent' }}>
          <View style={{ alignItems: "center", marginTop:-15,backgroundColor: 'transparent' }}>
            <View>
              <Image
                source={require('../../assets/ppeclogo.png')}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 50,
                }} />
            </View>
            <View style={{ width: '80%', alignItems: 'center', borderRadius: 8, paddingTop: 10, marginTop: 20 }}>
              <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, width: '100%', alignItems: 'center', flexDirection: 'row', paddingLeft: 15, paddingVertical: 5,marginTop:-10 }}>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                  resizeMode='contain'
                    source={require('../../assets/address.png')}
                    style={{ height: 40, width: 40 }}
                  />
                </View>
                <Text style={{ color: '#FF4500', alignSelf: 'center', fontSize: 25, marginLeft: 10,fontWeight:"bold" }}>Address</Text>
              </View>
              <View style={{ width: '100%',marginVertical :10 ,marginLeft:20,alignContent: 'center', alignItems: 'center'}}>
                <Text style={{  color: "black",fontSize:13,fontWeight:'bold' }}>SRI POORNA PRAJNA EDUCATION CENTRE</Text>
                <Text style={{   color: "black" ,fontSize:15,fontWeight:'bold'}}>
                  Station Road,Dahisar(E),</Text>
                <Text style={{color: "black" ,fontSize:15,fontWeight:'bold'}}>
                  Mumbai,Maharashtra 400064

 </Text>
              </View>
              <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginTop: 15, width: '100%', alignItems: 'center', flexDirection: 'row', paddingLeft: 15, paddingVertical: 5 }}>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={require('../../assets/phone.png')}
                    style={{ height: 40, width: 40 }}
                  />
                </View>
                <Text style={{ color: '#FF4500', alignSelf: 'center', fontSize: 25, marginLeft: 10,fontWeight:"bold" }}>Phone Number</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '100%',marginVertical :10 ,marginLeft:20}}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View >
                    <TouchableOpacity onPress={() => { this.handleclick('phone', '022 2828 4831') }}>
                      <Text style={{ fontSize:20,fontWeight:'bold' }}>022 2828 4831</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginTop: 15, width: '100%', alignItems: 'center', flexDirection: 'row', paddingLeft: 15, paddingVertical: 5 }}>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={require('../../assets/techsupport.png')}
                    style={{ height: 40, width: 40 }}
                  />
                </View>  
              <Text style={{ color: '#FF4500', alignSelf: 'center', fontSize: 25, marginLeft: 10,fontWeight:"bold" }}>Technical Support </Text>  
              </View>
              <View style={{ flexDirection: 'row', width: '100%',marginVertical :10 ,marginLeft:20}}>
                <View >
                  <TouchableOpacity onPress={() => { this.handleclick('phone', '8329649286') }}>
                    <Text style={{ fontSize:20,fontWeight:'bold' }}>8329649286</Text>
                  </TouchableOpacity>
                </View>
               </View>
            </View>
           </View>
          <View style={{ marginTop: 15,alignSelf:'baseline',alignItems:'center',width:'100%',backgroundColor: 'gray' }}>
  <TouchableOpacity onPress={() => Linking.openURL('https://www.9squaresolutions.com/')}>
              <Text style={{fontWeight:'bold',fontSize: 17, color: '#006BB2', alignContent: 'center', alignItems: 'center',  color: "white" }}>
                Powered by Nine Square Solutions LLP</Text>
</TouchableOpacity>
            </View>
        </Container>
        </ScrollView>
      </ImageBackground>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },


  top: {
    //height:'50%',
    alignItems: 'center',

  },
  header: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 30,
    borderColor: '#fff',
    padding: 30,
    paddingLeft: 40,
    paddingRight: 40,
    fontWeight: 'bold',

  },



});

