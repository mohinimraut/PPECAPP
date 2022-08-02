import React from "react";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  Animated,
  Platform,

} from "react-native";
import NetInfo from "@react-native-community/netinfo";
var cl = {};
const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
import { Attendancedataapi } from "../api/";
import Spinner from "react-native-loading-spinner-overlay";
import { Root, Card, CardItem, Content, Header, Left,Container } from 'native-base';
import { Calendar } from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import Dialog, { DialogContent,SlideAnimation,ScaleAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
var i = 0;
let isConnected =true;
import { SQLite,  } from 'expo-sqlite';

const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mark: {},
      dailydata: [],
      isModal1Visible: false,
      isModal2Visible: false,
      subjectdata: [],
      todaydate: "",
      spinner: true,
      stud_id: '',
      subjecthieght: 250,
      subjectmargin: 10,
      intime:'',
      outtime:'',
      HolidayName:'',
      scaleValue: new Animated.Value(0),
      y: new Animated.Value(-100),
      x: new Animated.Value(-100),
    }
  }
async  componentDidMount() {
  
  await this.getstudid();
  
  }
async  getstudid() {
    var self = this;
    db.transaction(async (txn) => {
        txn.executeSql("select * from tbllogin where isactive='1'", [],
            function (tx, result) {
           //     console.log('got the studid')
                self.setState({ stud_id: result.rows.item(0).userid })
                  self.Attendacnedata();
            },
        )
    })


}

async Attendacnedata() {
  var connection = await NetInfo.fetch();
  console.log(connection.isConnected);
  var stud_id = this.state.stud_id;
  if(connection.isConnected)
  {
    const response = await Attendancedataapi(stud_id);
    this.setState({ dailydata: response })
    //console.log(response.attendance.length);
   //console.log(JSON.stringify(response))
    var month = '';
    var day = '';
    if (response != 'error') {
     
      for (var i = 0; response.attendance.length > i; i++) {
       
        if (response.attendance[i].month.length == 1) {
          month = '0' + response.attendance[i].month
        } else {
          month = response.attendance[i].month
        }
        if (response.attendance[i].day.length == 1) {
          day = '0' + response.attendance[i].day
        } else {
          day = response.attendance[i].day
        }
        const date = response.attendance[i].year + '-' + month + '-' + day;
       
        if (response.attendance[i].is_present) {
        
          cl[date] = { "periods":[ { startingDay: true, endingDay: true, color: '#32cb00' }] }
  
        }
        else {
          cl[date] = { selected: true, marked: true, selectedColor: '#c30000' }
      
        }
      }
      this.setState({ spinner: false })
     // console.log('1');
     
    } else {
      this.setState({ spinner: false })
      this.props.navigation.navigate('MainScreen')
      alert('error')
    }
    if (response != 'error') {
      const vacation = { key: 'Holiday', color: 'red', selectedDotColor: 'blue' };
      for (var i = 0; response.holiday.length > i; i++) {
        //   console.log('in')
        if (response.holiday[i].month.length == 1) {
          month = '0' + response.holiday[i].month
        } else {
          month = response.holiday[i].month
        }
        if (response.holiday[i].day.length == 1) {
          day = '0' + response.holiday[i].day
        } else {
          day = response.holiday[i].day
        }
        const date = response.holiday[i].year + '-' + month + '-' + day;
        //console.log('date:'+date)
  
        cl[date] = { "periods":[ { startingDay: true, endingDay: true, color: '#ff7043' }] }
      }
      this.setState({ spinner: false })
      //console.log('1');
  
      // ---------------code for absent of curent month----------------------
      try {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        var arr1={}
        var month1='';
        if (mm<10) {
          month1 = '0' + mm
        } else {
        month1 = mm
        } 
        var counter=0
        var arr=cl;
     //   console.log('dsds'+dd)
        for(var i=1;i<=dd;i++){
          if (i <10) {
            day = '0' + i
          } else {
            day = i
          }
        counter=0
        const date2 =yyyy + '-' + month1 + '-' + day;
        if(typeof arr[date2] === 'undefined')
        {
        counter=1
        }else{
        }
      if(counter==1){
      cl[date2] =  { dots: 'red', selected: true, marked: true, selectedColor: 'red' }
      }
    
    
  }
  //console.log(cl)
  
      } catch (error) {
        //console.log(error)
      }
  
  
      this.setState({ mark: cl })
       //console.log(this.state.mark)
    } else {
      this.setState({ spinner: false })
      alert('error')
    }
  }
 else
 {
    alert('No internet connection..')
  this.setState({ spinner: false })
 }

}
  changemonth=(month)=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
  //  console.log(dd+'-'+mm+'-'+yyyy)
        var arr1={}
     //   console.log(month)
        var date= new Date(month.year, month.month, 0).getDate();
        var tempmonth=month.month-1;
       var currentdate=new Date(month.year, tempmonth, date)
    //  console.log(today)
    //  console.log(currentdate)
        if(today>currentdate){
        var month1='';
        if (month.month<10) {
          month1 = '0' + month.month
        } else {
        month1 = month.month
        } 
        var counter=0
        console.log(date)
        for(var i=1;i<=date;i++){
          if (i <10) {
            day = '0' + i
          } else {
            day = i
          }
        counter=0
        const date2 =month.year + '-' + month1 + '-' + day;
        var arr=this.state.mark;
        //console.log( date2)
    
        if(typeof arr[date2] === 'undefined')
        {
        //console.log('1if')
        counter=1
        }else{
        
        //console.log('else')
        }
      if(counter==1){
      //console.log('mainif')
      arr1[date2] =  { dots: 'red', selected: true, marked: true, selectedColor: 'red' }
      }
    
    
  }
  //console.log(arr1)
  var obj3 = Object.assign(arr1, arr);
  this.setState({
    
    mark:obj3
  })
      }else{
       
}
  //console.log(this.state.mark)

}

_showdta(date) {
  console.log(date)
  const newdate = date.dateString;

 var flag=true;
 for (var i = 0; this.state.dailydata.attendance.length > i; i++) {
  if (this.state.dailydata.attendance[i].month.length == 1) {
    month = '0' + this.state.dailydata.attendance[i].month
  } else {
    month = this.state.dailydata.attendance[i].month
  }
  if (this.state.dailydata.attendance[i].day.length == 1) {
    day = '0' + this.state.dailydata.attendance[i].day
  } else {
    day = this.state.dailydata.attendance[i].day
  }
  const date2 =  this.state.dailydata.attendance[i].year+ '-' + month + '-' +  day;
  var dateddmmyy=day+ '-' + months[this.state.dailydata.attendance[i].month-1] + '-' +  this.state.dailydata.attendance[i].year;
  if (date2 == newdate) {
         flag=false;
         var date=new Date(this.state.dailydata.attendance[i].in_time)
    if(date.getHours()=='0'){
      var intime='Marked manually';

    }else{
      var intime=this.state.dailydata.attendance[i].in_time.substring(10);
      var outtime=this.state.dailydata.attendance[i].out_time.substring(10);
    }
    this.setState({ 
      intime: intime,
      outtime:outtime,
       todaydate: dateddmmyy,
       isModal1Visible:true
    
    })
  }
}

 if(flag){

  for (var i = 0; this.state.dailydata.holiday.length > i; i++) {
    if (this.state.dailydata.holiday[i].month.length == 1) {
      month = '0' + this.state.dailydata.holiday[i].month
    } else {
      month = this.state.dailydata.holiday[i].month
    }
    if (this.state.dailydata.holiday[i].day.length == 1) {
      day = '0' + this.state.dailydata.holiday[i].day
    } else {
      day = this.state.dailydata.holiday[i].day
    }
    const date2 = this.state.dailydata.holiday[i].year + '-' + month + '-' + day;

    if (date2 == newdate) {


      this.setState({ 
        HolidayName:  this.state.dailydata.holiday[i].holiday_name,
        todaydate:this.state.dailydata.holiday[i].holiday_date,
        // todaydate: newdate,
         isModal2Visible:true
      
      })
    }
  }

 }

}
_toggleModal1 = () =>
  this.setState({ isModal1Visible: !this.state.isModal1Visible });
_toggleModal2 = () =>
  this.setState({ isModal2Visible: !this.state.isModal2Visible });

  render(){
    return (
      <Container>
        <View style={{ flex: 1, alignContent: "center" ,backgroundColor:'#cfd8dc'}}>
        <StatusBar backgroundColor="#9e9e9e" />
          <ImageBackground
    resizeMode={'stretch'} // or cover
    style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
    source={require('../../assets/attbackimage.png')}
    >
      {
        Platform.OS === 'ios' ?<View style={{backgroundColor:'transparent',height:'10%',paddingTop:15}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
           </TouchableOpacity >
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>ATTENDANCE</Text>
          </View>
        </View>
       </View>:<View style={{backgroundColor:'transparent',height:'8%'}}>
   <View style={{flexDirection:'row',flex:1}}>
   <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
   <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
   <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
    </TouchableOpacity >
   </View>
   <View style={{flex:1,justifyContent:"center"}}>
       <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>ATTENDANCE</Text>
   </View>
 </View>
</View>
    }
          <Spinner
            cancelable={true}
            visible={this.state.spinner}
            textContent={"Please Wait While Loading..."}
            textStyle={styles.spinnerTextStyle}
          />
          <ScrollView>
            <View>
              <Calendar
                theme={{
                  textSectionTitleColor: "#000000",
                //  selectedDayBackgroundColor: "#00adf5",
                  backgroundColor: "rgba(52,52,52,alpha)",
                  calendarBackground: 'rgba(255, 255, 255, 0.2)',
                  selectedDayTextColor: "#000000",
                  todayTextColor: "#000000",
                  dayTextColor: "#000000",
                  textDisabledColor: "#d9e1e8",
                  dotColor: "#00adf5",
                  selectedDotColor: "#000000",
                  arrowColor: "black",
                  monthTextColor: "#000000",
                  textMonthFontWeight: "bold",
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16
                }}
                onMonthChange={month => {
                  this.changemonth(month);
                }}
                hideExtraDays={true}
                markedDates={this.state.mark}
                // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                markingType='multi-period'
                onDayPress={(day) => this._showdta(day)}
                style={{
                  borderTopLeftRadius:10,
                  borderTopEndRadius:10,
                  backgroundColor:'rgba(255, 255, 255, 0.8)',
                  height:height/1.75,
                  justifyContent: "center",
                  marginLeft:15,
                  marginTop: 10,
                  marginRight:15
                }}
              />
            </View>

            <Dialog
            dialogAnimation={new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })}
            visible={this.state.isModal1Visible}
            footer={
              <DialogFooter>
                <DialogButton
                  text="OK"
                  onPress={() => this._toggleModal1()}
                />
              </DialogFooter>

            }
          >
            <DialogContent style={{ height:250, width: 250, alignItems:'center' }}>
   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
   <View >
   <Animatable.Text useNativeDriver={true} animation='slideInDown' delay={0}  style={{fontSize:20,fontWeight:'bold'}}>
     {this.state.todaydate}
   </Animatable.Text>
   </View>
   <View style={{flexDirection:'row',justifyContent:'center'}}>
   <Animatable.Text useNativeDriver={true} animation='slideInLeft' delay={0}  style={{fontWeight:'bold',flexWrap:'wrap'}}>(In Time / Out Time)</Animatable.Text>
   </View>
   <View style={{flexDirection:'row',marginTop:20}}>
     <Animatable.Text useNativeDriver={true} animation='slideInRight' delay={0}   style={{fontWeight:'bold',marginLeft:10,flexWrap:'wrap'}}>
    {this.state.intime} / {this.state.outtime}
    </Animatable.Text>
   </View>

   </View>
   
          
                      
            </DialogContent>
          </Dialog>
          <Dialog
            dialogAnimation={new SlideAnimation({
              slideFrom: 'bottom',
            })}
            visible={this.state.isModal2Visible}
            footer={
              <DialogFooter>
                <DialogButton
                  text="OK"
                  onPress={() => this._toggleModal2()}
                />
              </DialogFooter>
            }
          >
            <DialogContent  style={{ height:250, width: 250, alignItems:'center' }}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <View style={{flexDirection:'row',justifyContent:'center'}}>
   <Animatable.Text useNativeDriver={true} animation='slideInDown' delay={0}  style={{fontSize:20,fontWeight:'bold'}}>
{this.state.todaydate}
   </Animatable.Text>
   </View>   
   <View style={{flexDirection:'row',marginTop:30}}>
   <Animatable.Text useNativeDriver={true} animation='slideInUp' delay={0}  style={{fontSize:20,fontWeight:'bold'}}>{this.state.HolidayName}</Animatable.Text>
   </View>     
                            </View>
            </DialogContent>
          </Dialog>
            <Content>
              <Card
                style={{
                  backgroundColor:'rgba(255, 255, 255, 0.8)',
                  justifyContent: "center",
                  marginLeft:15,marginRight:15,borderBottomRightRadius:10,borderBottomLeftRadius:10
                }}
              >
                <CardItem bordered style={{ backgroundColor: "transparent" }}>
                  <View style={{ flexDirection: "row", width: width / 2 }}>
                    <View style={{justifyContent:'center'}}>
                    <View
                      style={{
                        width: 50,
                        height: 5,
                        borderRadius: 25,
                        backgroundColor: "#32cb00",
                        
                        justifyContent:'center'
                      }}
                    />
                    </View>
                       <View style={{justifyContent:'center'}}>
                    <Text style={{ marginLeft: 10, fontSize: 15 }}>
                      Present
                    </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 50,
                      height: 5,
                      borderRadius: 25,
                      backgroundColor: "#ff7043"
                    }}
                  />
                  <Text style={{ marginLeft: 10, fontSize: 15 }}>Holiday</Text>
                </CardItem>
                <CardItem bordered style={{ backgroundColor: "transparent",justifyContent:"center",alignItems:"center" }}>
                <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#0288d1"
                    }}
                  />
                  <Text style={{ marginLeft: 10, fontSize: 15 }}>Absent</Text>
                  
                </CardItem>
              </Card>
            </Content>
          </ScrollView>
          </ImageBackground>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: 350,
    height: 250,
    borderRadius: 25
  },
  spinnerTextStyle: {
    color: "#fff"
  },
  text: {
    color: "#3f2949",
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
