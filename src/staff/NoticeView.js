"use strict";
import React from "react";
import { NavigationEvents } from 'react-navigation';
import * as Animatable from "react-native-animatable";
import Nodata from '../components/Nodata';
import {connect} from 'react-redux'
import keys from '../api/keys'
import {
  StatusBar,
  Platform,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {staffNoticedataapi} from "../api/index";


const db = SQLite.openDatabase("EDUDUNIYA.db");
import { SQLite } from 'expo-sqlite' 
var width = Dimensions.get("window").width;
class NoticeView extends React.Component {
  state = {
    news: [],
    nonews: true,
    stud_id: "",
    visible: false,
    spinner: true
  };
  componentDidMount() {
    this.getstudid();
  }
  //------------to load studid---------------
  getstudid() {
    var self = this;
    db.transaction(async txn => {
      txn.executeSql("select * from tbllogin where isactive='1'", [], function(
        tx,
        result
      ) {
        console.log("got the studid");
        self.setState({ stud_id: result.rows.item(0).userid });
        self.getnews();
      });
    });
  }
  
  Dateformatter(data){
    console.log(data)
    var today = new Date(data);
    var dd = today.getDate();
    var returndate=''
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    returndate = dd+'/'+mm+'/'+yyyy;
    console.log(returndate)
    return returndate;
    }
  //--------to load news data----------------
  async getnews() {
    try {
      var stud_id = this.state.stud_id;
      const response = await staffNoticedataapi(stud_id);
      console.log("api result=" + JSON.stringify(response));
      if (response == "error") {
        this.setState({ nonews: true, visible: true, spinner: false });
      } else {
        this.setState({ news: response, spinner: false,nonews: false });
      }
    } catch (error) {
      console.log(error);
      this.setState({ spinner: false });
      alert("something went wrong");
    }
  }
  handleurl(url) {
    var uri = "";
    if (url.slice(0, 2) == "..") {
      uri = keys.portal+"/" + url.substring(2);
    } else if (url.slice(0, 4) == "http") {
      uri = url;
    } else {
      uri = "http://" + url;
    }
    console.log(uri);
    if (Platform.OS == "android") {
      Linking.openURL(uri);
    } else {
      Linking.openURL(uri);
    }
  }

  closepopup() {
    this.setState({
      visible: false
    });
    this.props.navigation.navigate("MainScreen");
  }
  //-----------to create card Component for news------------
  showNews() {
    console.log('state'+this.state.news.length)
      if (this.state.news.length>0) {
      
        return this.state.news.map(data => {
          return (
            <View
              style={{
                flex: 1,
                width: width - 20,
                borderBottomColor: "black",
                borderBottomWidth: 2,
                marginTop: 10
              }}
            >
              <View style={{ flex: 1, paddingBottom: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {data.noticetitle}
                </Text>
              </View>
              <View style={{ flex: 1, paddingBottom: 8 }}>
                <Text style={{ fontStyle: "italic" }}>{data.noticetext}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <View style={{ flex: 1, paddingBottom: 8 }}>
                    <Text style={{ opacity: 0.5 }}>{this.Dateformatter(data.datetime)}</Text>
                  </View>
                  <View style={{ flex: 1, paddingBottom: 8 }}>
                    <Text style={{ opacity: 0.5 }}>
                      Notice by-{data.noticeby}
                    </Text>
                  </View>
                </View>
                <View style={{ width: 50 }}>
                  {data.noticelink != "" ? (
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() =>{ this.handleurl("http://" + data.noticelink)}}
                    >
                      <Image
                        source={require("../../assets/Images/DrawerImages/link.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Text />
                  )}
                  {data.noticefileurl != "" ? (
                    <TouchableOpacity
                      style={{ flexDirection: "row" }}
                      onPress={() => this.handleurl(data.noticefileurl)}
                    >
                      <Image
                        source={require("../../assets/Images/DrawerImages/downloads.png")}
                        style={{ width: 30, height: 30 }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Text />
                  )}
                </View>
              </View>
            </View>
          );
        });
      } else {
        
        return (
          <Animatable.View
            useNativeDriver={true}
            animation="zoomIn"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            delay={1000}
          >
           <Nodata height={200} width={200}></Nodata>
          </Animatable.View>
        );
      }
    }
  refresh(){
    this.getnews();
  
    this.props.dispatch({type:'noticerefreshed'});

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
          <NavigationEvents
      onWillFocus={payload =>{this.props.dispatch({type:'noticetabchanged',data:'view'})}}
     
    /> 
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <StatusBar backgroundColor='#207793' />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ alignItems: "center", flex: 1 }}>
            {this.showNews()}
            {this.props.isnoticeupdated?this.refresh():<View/>}
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    isnoticeupdated: state.notice['isnoticeupdated'],
    currenttab:state.notice['currenttab'],
    option:state.notice['option'],
  };
}
export default connect(mapStateToProps)(NoticeView);
const styles = StyleSheet.create({
  maincontent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cards: {
    backgroundColor: "rgba(52, 52, 52, 0.1)",
    width: width - 50,
    maxHeight: 230,
    alignItems: "center",
    marginTop: 20
  }
});