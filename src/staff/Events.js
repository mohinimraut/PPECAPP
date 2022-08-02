import React from 'react';
import { StatusBar,Dimensions, StyleSheet, TouchableOpacity, View, Text, Image, ScrollView, ImageBackground,Platform, } from "react-native";
import { eventdates } from '../api/index';
// import Slideshow from 'react-native-slideshow';
import Spinner from 'react-native-loading-spinner-overlay';
import { SQLite } from 'expo-sqlite'
import Nodata from '../components/Nodata'
const db = SQLite.openDatabase('EDUDUNIYA.db');
import {
  Container,
  Card,
  CardItem,Content,
  Header,
  Left,
  Button} from "native-base";
import { Calendar, } from 'react-native-calendars';
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
import Dialog, { DialogContent,ScaleAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import keys from '../api/keys';
export default class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner:true,
            mark:{},
            visible:false,
            data:[],
            dilogdata:[],
            switch:true,
            Photodata:{}
        }
       this.getuserid()
      }

    getuserid() {
        var self = this;
        db.transaction(async (txn) => {
          txn.executeSql("select * from tbllogin where isactive='1'", [],
            function (tx, result) {
              console.log('got the userid')
              self.setState({ userid : result.rows.item(0).userid })
              self.eventdata();
            },
          )
        })
    }

_showdta(day){
  console.log('called')
  this.setState({spinner:true,})
  var selecteddate=day;
  var data=this.state.data;
  var arr=[]
    for(var i=0;i<data.length;i++){
    var date = new Date(data[i].eventStrDateTime);
    var month=parseInt(date.getMonth())+1;
    var year=date.getFullYear();

    var day=date.getDate();
    if (month.toString().length == 1) {
      month = '0' + month
    }
    if (day.toString().length == 1) {
      day = '0' + day;

    }
    var date=year+'-'+month+'-'+day;
    if(selecteddate.dateString==date){
      arr.push(data[i])


    }
  }
  this.setState({dilogdata:arr,visible:true})
  this.setState({spinner:false})
}


//to get the events data
async eventdata(){
  var obj={}
  var objevent={}
  var objholiday={}
  var objboth={}
  console.log('dadasdsda')
  var dates=await eventdates(this.state.userid);
  console.log('asdasffasdasdasdasda:'+JSON.stringify(dates) )
  if(typeof dates=='object'){
    if(dates.length==0){
      alert('Something Went Wrong');
      this.setState({spinner:false});
      return false;

    }
  }else{
    alert('Something Went Wrong');
    this.setState({spinner:false});
    return false;
  }

  this.setState({spinner:false});
   dates.reverse();
  this.setState({data:dates})
  dates.map(data=>{
    var date = new Date(data.eventStrDateTime);
    var month=parseInt(date.getMonth())+1;
    var year=date.getFullYear();

    var day=date.getDate();
    if (month.toString().length == 1) {
      month = '0' + month
    }
    if (day.toString().length == 1) {
      day = '0' + day;

    }
    var date=year+'-'+month+'-'+day;


      objevent[date] = {selected: true, marked: true, selectedColor: '#32cb00'  }
   


  })
 
  this.setState({mark:objevent})
 //console.log(obj)
}

homebody(){
   if(this.state.switch){
     return(
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
                  // onMonthChange={month => {
                  //   this.changemonth(month);
                  // }}
                hideExtraDays={true}
                markedDates={this.state.mark}
                // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
              
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
      <Content>
        <Card style={{  backgroundColor:'rgba(255, 255, 255, 0.8)', marginLeft:15,marginRight:15,borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
          <CardItem bordered style={{ backgroundColor: 'transparent' }}>
          <View style={{justifyContent:"center",flex:1,height:50,flexDirection:'row'}}>
          <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#32cb00"
                    }}
                  />
                    <View style={{justifyContent:'center'}}>
                    <Text style={{ marginLeft: 10, fontSize: 15 }}>
                      Event
                    </Text>
                    </View>
          </View>
          </CardItem>        
        </Card>
      </Content>
    </ScrollView>

     )
   }
   else{
     return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
     {this.photoView()}
     </View>

     )

   }



}

photoView(){
  console.log(this.state.Photodata)
 var images=[];
 var imagesnew=[];
 images=this.state.Photodata.imageString.split(',');
     for (var i = 0; images.length > i; i++) {
        imagesnew.push({ id: "001", url: keys.portal+'/staff/Event/' + this.state.Photodata.id + '/' + images[i] + '' });
    }
    console.log(imagesnew)
  return(
    <View style={{justifyContent:'space-between',flex:1,alignItems:'center',backgroundColor:'white'}}>
      <View style={{marginBottom:40}}/>
           <ScrollView
           horizontal={true}   
           pagingEnabled={true}  
           style={{height:500, margin:20}}
            >
              {
                
                imagesnew.map((data =>{
                   return(
                     <View>
                       <Image style={{height:500,width:300}} source={{uri:data.url}}></Image>
                     </View>
                   )

                }))
              }
              </ScrollView>
            <Button onPress={()=>this.setState({switch:true})} style={{width:300,margin:20,alignContent:'center',alignItems:'center',backgroundColor:'#207793',justifyContent:'center',alignSelf:'center'}}>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:20,color:'white',alignSelf:'center'}}>Back</Text>
                </View>
                </Button> 
    </View>
  )

}
showPhoto(data){
  console.log(data)
    if(data=='No Image')
    {
            alert('No Image for this event..')
    }
    else{

      this.setState({Photodata:data,switch:false,visible:false})
    }
  
}

    //render
    render() {
        return (
          <Container>

            <ImageBackground
              resizeMode={'cover'}
              style={{ flex: 1 }}
              source={require('../../assets/attbackimage.png')}
            >
              <Spinner
              cancelable={true}
                visible={this.state.spinner}
                textContent={'Please Wait While Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            <Dialog
              dialogAnimation={new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
              })}
              visible={this.state.visible}
              footer={
              <DialogFooter>
                <DialogButton
                  text="OK"
                  onPress={() => this.setState({visible:false})}
                />

              </DialogFooter>
              }>
             <DialogContent style={{ height:350, width: width-20, alignItems:'center' }}>
             {/* <TouchableOpacity onPress={()=> alert('clicck')}> */}
             <ScrollView>
              {this.state.dilogdata.length>0?
                this.state.dilogdata.map(data=>{

                  return(
                    <View style={{flex:1,alignItems:'center'}}>

                      <TouchableOpacity onPress={()=> data.imageString==""||data.imageString=="No Image"?null:this.showPhoto(data)}>
                       <Card style={{marginTop:10,borderRadius:10}}>
            <CardItem bordered style={{width:width-60,borderLeftColor:'#9ccc65',borderLeftWidth:10}}>
                <View style={{flex:1}}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <View style={{width:'35%'}}>
                    <Text style={{fontWeight:'bold'}}>NAME</Text>
                  </View>
                  <View >
                    <Text style={{fontWeight:'bold'}}>:</Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={{paddingLeft:10}}>{data.eventName}</Text>
                  </View>
                </View>
                <View>
                  {
                    data.eventStrDateTime==data.eventEndDateTime ?
                     <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{width:(width-60)*0.5}}>
                      <Text style={{fontWeight:'bold'}}>DATE</Text>
                    </View>
                    <View>
                      <Text style={{fontWeight:'bold'}}>:</Text>
                    </View>
                    <View  style={{flex:1,alignItems:'center'}}>
                      <Text>  {data.eventStrDateTime}</Text>
                    </View>
                    </View> :
                  <View>
                    <View style={{flexDirection:"row",flex:1}}>
                      <View style={{width:(width-60)*0.3}}>
                        <Text style={{fontWeight:"bold"}}>Start-Date</Text>
                      </View>
                      <View >
                        <Text style={{fontWeight:"bold"}}>:</Text>
                      </View>
                      <View >
                        <Text style={{paddingLeft:10}}>{data.eventStrDateTime}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection:"row",flex:1}}>
                      <View style={{width:(width-60)*0.3}}>
                        <Text style={{fontWeight:"bold"}}>End-Date</Text>
                      </View>
                      <View >
                        <Text style={{fontWeight:"bold"}}>:</Text>
                      </View>
                      <View >
                        <Text style={{paddingLeft:10}}>{data.eventEndDateTime}</Text>
                      </View>
                    </View>
                  </View>
                  }
                </View>


                  </View>

            </CardItem>
          </Card>
                      </TouchableOpacity>

                    </View>
                  )
                })
                :<View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                  <Nodata height={200} width={200} text={'No Events on this day'}/>
                  </View>}

                {/* </TouchableOpacity> */}
                </ScrollView>
              </DialogContent>
            </Dialog>
            {
        Platform.OS === 'ios' ?<View style={{backgroundColor:'transparent',height:'10%',paddingTop:15}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{width:'20%',paddingLeft:10,justifyContent:'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{height:25,width:25}} source={require('../../assets/icon/leftarrow_new.png')}></Image>
           </TouchableOpacity >
          </View>
          <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>Event</Text>
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
       <Text style={{color:"white",justifyContent:"center",paddingLeft:5,fontSize:20,fontWeight:'bold'}}>Event</Text>
   </View>
 </View>
</View>
    }
             {this.homebody()}
            </ImageBackground>
          </Container>
        )
      }
    }
    const styles = StyleSheet.create({
        modal: {
          alignItems: 'center',
          borderColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          backgroundColor: '#fff',
          width: 350,
          height: 250,
          borderRadius: 25,
        },
        spinnerTextStyle: {
          color: '#fff'
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
