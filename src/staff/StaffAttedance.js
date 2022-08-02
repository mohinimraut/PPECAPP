'use strict'
import React from "react";
import Loader from '../components/Loader';
import NetInfo from "@react-native-community/netinfo";
import { StatusBar,  StyleSheet, TouchableOpacity, View, Text, Image, Dimensions, ScrollView, FlatList, ImageBackground, TextInput } from "react-native";
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {  createAppContainer,  } from 'react-navigation';
import { Container, Header, Form, Item, Card, CardItem, Label, Button, Left, Body,Right } from 'native-base';
import { Academicdetails, Mediumnew, classdata,classdata1, division,division2, attendancedata, manualattendancesave } from '../api/';
import Modal from "react-native-modal";
import DateTimePicker from 'react-native-modal-datetime-picker';
import { SQLite } from 'expo-sqlite';
var width = (Dimensions.get('window').width);
var height = ((Dimensions.get('window').height) -300);
var manualheight = ((Dimensions.get('window').height) - 200);
var newhigh = (Dimensions.get('window').height);
var dataarray = [];
import CheckBox from 'react-native-check-box';
const db = SQLite.openDatabase('EDUDUNIYA.db');
var classlength = 0;
class AttendanceView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            isDateTimePickerVisible: false,
            classmodal: false,
            switch: true,
            academicdata: [],
            academicyear: '',
            academicid: '',
            attendancedatanew: [],
            isloading: false,
            staff_id: '',
            clasdata: [],
            divisiondata: [],
            divisonname: '',
            divisionid: '',
            classname: '',
            mediumname: '',
            spinner: true,
            classid: '',
            classthieght: 250,
            subjectmargin: 10,
            today: [],
            divisionmodal: false,
            totalcount: '',
            presentcount: '',
            absentcount: '',
            iosmodel: false,
            divname2:[],
            div_id:'',
            div_name:''


        }
        this._data = this._data.bind(this)
    }
    componentDidMount() {
        this._data()

    }
    setDate(newDate) {
        console.log(newDate)
        this.setState({ today: newDate });
    }
    _Foracademic(id) {
        console.log('this is academic id:' + id)
        console.log(this.state.academicdata)
        for (var i = 0; this.state.academicdata.length > i; i++) {
            console.log('in ooping')
            if (id == this.state.academicdata[i].id) {
                console.log('in loop')
                this.setState({
                    academicyear: this.state.academicdata[i].name,
                    academicid: this.state.academicdata[i].id,
                })

            }

        }
        this.setState({

            isModalVisible: false,

        })



    }
    _toggleModal2 = () =>
        this.setState({ iosmodel: !this.state.iosmodel });
    _academicdetailsnew() {
        console.log('in academic')
        console.log(this.state.academicdata)
        return (
            <View style={{ height: 250, width: 280, backgroundColor: 'white',borderRadius:10}}>
               
                    <Text style={{ color: '#ff5722', fontSize: 20, alignSelf: 'center',marginBottom:5,fontWeight:'bold',marginBottom:10}}> Select Academic Year</Text>
                {   this.state.academicdata.length >'0' ?
                    this.state.academicdata.map((data) => {
                        return (
                            <View style={{ alignSelf: 'center', color: 'white',padding:10,borderWidth:2,marginBottom:4,borderColor:'#ff5722'}}>
                                <TouchableOpacity key={data.id} onPress={() => (this._Foracademic.bind(this))(data.id)}>
                                    <Text style={{ fontSize: 15 }}>{data.name} </Text>
                                </TouchableOpacity>
                            </View>
                             )
                    }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>
                }
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}} >
                    <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={() => this.setState({ isModalVisible: false, })}>
                        <Text style={{ color: '#ff5722',fontSize:20,fontWeight:'bold',marginBottom:10,marginRight:15 }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </View>


        )

    }
    // _getclass(id) {
    //     console.log('id of class:' + id)
    //     console.log('in classdsta' + this.state.clasdata);
    //     for (var i = 0; this.state.clasdata.length > i; i++) {
    //         console.log('in looping')
    //         if (id == this.state.clasdata[i].id) {
    //             console.log('in')
    //             this.setState({
    //                 classname: this.state.clasdata[i].name,
    //                 classid: this.state.clasdata[i].id,
    //                 classmodal: false,
    //                 divisonname: '',

    //             })


    //         }

    //     }

    // }

    _getclass(id) {
        // *********
        console.log('id of class:' + id)
        console.log('in classdsta' + this.state.clasdata);
        for (var i = 0; this.state.clasdata.length > i; i++) {
            console.log('in looping')
            if (id == this.state.clasdata[i].class_id) {
                console.log('in')
                this.setState({
                    classname: this.state.clasdata[i].class_name,
                    classid: this.state.clasdata[i].class_id,
                    classmodal: false,
                    divisonname: '',

                })


            }

        }

    }
    _getdivision(id) {
       
        for (var i = 0; this.state.divisiondata.length > i; i++) {
            console.log('in looping')
            if (id == this.state.divisiondata[i].div_id) {
                console.log('in')
                this.setState({
                    divisonname: this.state.divisiondata[i].div_name,
                    divisionid: this.state.divisiondata[i].div_id,
                    divisionmodal: false,

                })


            }

        }

    }
    // _classdetailsnew() {
    //     var height2 = 350;
    //     console.log('in class details view:' + this.state.clasdata)
    //     if (classlength > 5) {

    //         height2 = newhigh - 50;
    //     }
    //     console.log('hieght of class' + height2)
    //     return (


    //         <Card style={{ height: height2, width: 350, }}>
    //             <CardItem header bordered style={{ alignSelf: "center", width: 350 }}>
    //                 <Text style={{  fontSize: 20,fontWeight:'bold' }}>Select Class------>>></Text>
    //             </CardItem>
    //             {this.state.clasdata.length >'0'?

    //                 this.state.clasdata.map((data) => {
    //                     return (

    //                         <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
    //                             <TouchableOpacity key={data.id} onPress={() => (this._getclass.bind(this))(data.id)} style={{ flex: 1 }}>
    //                                 <CardItem bordered style={{ width: 350, }}>
    //                                     <Text> {data.name.toUpperCase()}</Text>
    //                                 </CardItem>
    //                             </TouchableOpacity>
    //                         </Body>


    //                     )


    //                 }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>

    //             }
    //             <CardItem footer style={{ alignSelf: "flex-end" }}>
    //                 <TouchableOpacity onPress={() => this.setState({ classmodal: false, })}>
    //                     <Text style={{  fontSize: 20,fontWeight:'bold' }}>Cancel</Text>
    //                 </TouchableOpacity>

    //             </CardItem>
    //         </Card>

    //     )

    // }
    

    _classdetailsnew() {
        // *********************
        var height2 = 350;
        console.log('in class details view:' + this.state.clasdata)
        if (classlength > 5) {

            height2 = newhigh - 50;
        }
        console.log('hieght of class' + height2)
        return (


            <Card style={{ height: height2, width: 350, }}>
                <CardItem header bordered style={{ alignSelf: "center", width: 350 }}>
                    <Text style={{  fontSize: 20,fontWeight:'bold' }}>Select Class</Text>
                </CardItem>
                {this.state.clasdata.length >'0'?

                    this.state.clasdata.map((data) => {
                        return (

                            <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                <TouchableOpacity key={data.class_id} onPress={() => (this._getclass.bind(this))(data.class_id)} style={{ flex: 1 }}>
                                    {/* ************** */}
                                    <CardItem bordered style={{ width: 350, }}>
                                        <Text> {data.class_name}</Text>
                                    </CardItem>
                                </TouchableOpacity>
                            </Body>


                        )


                    }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>

                }
                <CardItem footer style={{ alignSelf: "flex-end" }}>
                    <TouchableOpacity onPress={() => this.setState({ classmodal: false, })}>
                        <Text style={{  fontSize: 20,fontWeight:'bold' }}>Cancel</Text>
                    </TouchableOpacity>

                </CardItem>
            </Card>

        )

    }

    _divisonnew() {
        console.log('in divison details view:' + this.state.divisiondata)
        return (


            <Card style={{ height: 350, width: 350, }}>
                <CardItem header bordered style={{ alignSelf: "center", flex: 1, width: 350 }}>
                    <Text style={{  fontSize: 20,fontWeight:'bold'}}>Select Divison</Text>
                </CardItem>
               
                {
                     this.state.divisiondata.length >'0' ?
                    this.state.divisiondata.map((data) => {
                        return (
                            <ScrollView>
                                <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                    <TouchableOpacity key={data.div_id} onPress={() => (this._getdivision.bind(this))(data.div_id)} style={{ flex: 1 }}>
                                        <CardItem bordered style={{ width: 350, }}>
                                            <Text> {data.div_name}</Text>
                                        </CardItem>
                                    </TouchableOpacity>
                                </Body>
                            </ScrollView>

                        )


                    }) :<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>

                }
              
                <CardItem footer style={{ alignSelf: "flex-end" }}>
                    <TouchableOpacity onPress={() => this.setState({ divisionmodal: false, })}>
                        <Text style={{  fontSize: 20,fontWeight:'bold' }}>Cancel</Text>
                    </TouchableOpacity>

                </CardItem>
            </Card>

        )

    }
    // async  _classcall() {

    //     console.log('staff id:' + this.state.staff_id)
    //     var staffid = this.state.staff_id;
    //     var connection = await NetInfo.fetch();
    //     console.log(connection.isConnected);
    //     if(!connection.isConnected){
    //         alert('No internet  Connection');
    //         return false
    //     }
    //     const classdatanew = await classdata(staffid);
    //     if(classdatanew=='error'){

    //         alert('SOMETHING WENT WRONG..!')

    //     }
    //     else{
    //         for (var i = 0; classdatanew.length > i; i++) {

    //             classlength++;
    //         }
    
    //         this.setState({
    //             clasdata: classdatanew,
    //             classmodal: true,
    //             classthieght: classlength,
    //         })  
    //     }            
    // }

    async  _classcall() {
// ************
        console.log('staff id:' + this.state.staff_id)
        var staffid = this.state.staff_id;
        var connection = await NetInfo.fetch();
        console.log(connection.isConnected);
        if(!connection.isConnected){
            alert('No internet  Connection');
            return false
        }
        const classdatanew = await classdata1(staffid);
        if(classdatanew=='error'){

            alert('SOMETHING WENT WRONG..!')

        }
        else{
            for (var i = 0; classdatanew.length > i; i++) {

                classlength++;
            }
    
            this.setState({
                clasdata: classdatanew,
                classmodal: true,
                classthieght: classlength,
            })  
        }            
    }
    async _data() {
        var self = this;
        db.transaction(async (txn) => {
            txn.executeSql("select * from tbllogin where isactive='1'", [],
                function (tx, result) {
                    console.log('got the studid:' + result.rows.item(0).userid)
                    self.setState({ staff_id: result.rows.item(0).userid })

                },
            )
        })
        const response = await Academicdetails();
        const responsenew = await Mediumnew();
        if(response=='error'|| responsenew=='error' ){
            alert('SOMETHING WENT WRONG...!')

        }
        else{
            for (var i = 0; response.length > i; i++) {
                this.setState({
                    academicyear: response[0].name,
                    mediumname: responsenew[0].name,
                    academicid: response[0].id,
                })
            }
            console.log(this.state.academicyear)
            var today = new Date();
        console.log(today)
        var _newmonth=parseInt(today.getMonth() + 1);
        console.log('fhsdhfsdkjgdfmdfgadkkgw'+_newmonth)
        if (_newmonth == '1') {
            _newmonth ='Jan' ;
        }
        else if (_newmonth == '2') {
            _newmonth = 'Feb';
        }
        else if (_newmonth == '3') {
            newmonth = 'Mar';
        }
        else if (_newmonth =='4' ) {
            _newmonth = 'Apr';
        }
        else if (_newmonth =='5') {
            _newmonth =  'May';
        }
        else if (_newmonth=='6' ) {
            _newmonth ='Jun';
        }
        else if (_newmonth == '7') {
            _newmonth ='Jul';
        }
        else if (_newmonth =='8') {
            console.log('in')
            _newmonth = 'Aug';
        }
        else if (_newmonth =='9' ) {
            _newmonth = 'Sep';
        }
        else if (_newmonth =='10') {
            _newmonth = 'Oct';
        }
        else if (_newmonth == '11') {
            _newmonth ='Nov' ;
        }
        else if (_newmonth =='12' ) {
            _newmonth = 'Dec';
        }
        else{
            _newmonth = 'Dec';
        }
        console.log('gsgsdfsfsdff'+_newmonth)
        var date = today.getDate() + "/" + _newmonth + "/" +today.getFullYear() ;
            this.setState({
                today: date,
                academicdata: response,
                spinner: false
            })


        }
    
    }

    // async _divisioncall() {        
    //     if (this.state.classname == '') {
    //         alert('please select class')


    //     }
    //     else {
    //         var connection = await NetInfo.fetch();
    //         console.log(connection.isConnected);
    //         if(!connection.isConnected){
    //             alert('No internet  Connection');
    //             return false
    //         }
    //         const response = await division(this.state.classid);
    //      if(response=='error'){alert('SOMETHING WENT WRONG...!')}else{

    //         this.setState({

    //             divisiondata: response,
    //             divisionmodal: true,

    //         })

    //      }
            
    //     }


    // }

    async _divisioncall() {
        // ***************
        var classid = this.state.classid;
        if (this.state.classname == '') {
            alert('please select class')
        }
        else {
            var connection = await NetInfo.fetch();
            console.log(connection.isConnected);
            if(!connection.isConnected){
                alert('No internet  Connection');
                return false
            }        
            const response = await division2(this.state.staff_id);
            const found = response.filter(element => element.class_id==classid);
            console.log("found----------Mohini",found)
            const array = Object.values( found );
            console.log("responsewholedivision------Mohini"+response)                     
         if(response=='error'){alert('SOMETHING WENT WRONG...!')}else{
            this.setState({
                divisiondata: array,
                divisionmodal: true,
            })
         }            
        }
    }
    async  _getattendancedata() {
        var connection = await NetInfo.fetch();
        console.log(connection.isConnected);
  
        if(connection.isConnected){
          
              if(this.state.classid=='' ||this.state.classid==null){
                    alert('Please select class')
              }
              else if(this.state.divisionid=="" ||this.state.divisionid == null){
                alert('Please select division')

              }
              else{
            this.setState({

                spinner: true
            })
    
            var table1 = [];
            var table2 = [];
            var attendancedata1 = [];
            const response = await attendancedata(this.state.academicid, this.state.divisionid, this.state.today);
            if(response=='error'){alert('SOMETHING WENT WRONG...!')
            this.setState({
    
                spinner: false
            })
        }
            else{
                table1 = response.table;
            table2 = response.table1;
    
            var add = true;
            var absentcount = 0;
            for (var i = 0; table1.length > i; i++) {
                add = true;
                for (var j = 0; table2.length > j; j++) {
    
                    if (table1[i].stud_id == table2[j].stud_id) {
                        attendancedata1.push({ id: table1[i].stud_id, status: 'present', name: table1[i].name, rollno: table1[i].roll_no });
                        add = false;
    
                    }
                }
                if (add) {
                    absentcount++;
                    console.log('in add')
                    attendancedata1.push({ id: table1[i].stud_id, status: 'absent', name: table1[i].name, rollno: table1[i].roll_no });
                }
            }
            this.setState({
                totalcount: table1.length,
                presentcount: table2.length,
                absentcount: absentcount,
                attendancedatanew: attendancedata1,
                switch: false,
                spinner: false,
            })
    
            }
        } 

        }
        else{


            alert('No Internet connection..!')
        }
        
      
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        var datenew = date.toString();
        datenew = datenew.split('T');
        if(datenew[0]=='')
        {
            datenew=datenew[1];
        }
        else
        {
            datenew=datenew[0];
        }
        datenew = datenew.split(' ');
      
        var newmonth = '';
        if (datenew[1] === 'Jan') {
            newmonth = 1;
        }
        else if (datenew[1] === 'Feb') {
            newmonth = 2;
        }
        else if (datenew[1] === 'Mar') {
            newmonth = 3;
        }
        else if (datenew[1] === 'Apr') {
            newmonth = 4;
        }
        else if (datenew[1] === 'May') {
            newmonth = 5;
        }
        else if (datenew[1] === 'Jun') {
            newmonth = 6;
        }
        else if (datenew[1] === 'Jul') {
            newmonth = 7;
        }
        else if (datenew[1] === 'Aug') {
            newmonth = 8;
        }
        else if (datenew[1] === 'Sep') {
            newmonth = 9;
        }
        else if (datenew[1] === 'Oct') {
            newmonth = 10;
        }
        else if (datenew[1] === 'Nov') {
            newmonth = 11;
        }
        else if (datenew[1] === 'Dec') {
            newmonth = 12;
        }
        console.log('A date has been picked: ', datenew[3] + '-' + newmonth + '-' + datenew[2]);
        var changedate= datenew[2]+ '/' + datenew[1] + '/' +  datenew[3];
        this.setState({ today: changedate });
        this._hideDateTimePicker();
    };
    _homebody() {
console.log('attendance data:'+this.state.attendancedatanew);
        if (this.state.switch) {
            if(this.state.spinner){
                return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Loader/></View>
            }else{
            return (
                <View>
                    
                    <Form>
                        <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }} >
                            <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })} style={{flex:1}}>
                                <Label style={styles.labels}>From Date:</Label>
                                <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.today}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                            mode={'date'}
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                        </Item>
                        <View>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisible: true })}>
                                    {/* <Label style={styles.labels}>Academic Year:</Label> */}
                                    <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.academicyear}</Text>
                                </TouchableOpacity>
                            </Item>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>

                                <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.mediumname}</Text>
                            </Item>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                <TouchableOpacity onPress={() => this._classcall()} style={{flex:1}}>
                                    <Label style={styles.labels}>Select Class</Label>
                                    <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.classname}</Text>
                                </TouchableOpacity>

                            </Item>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                <TouchableOpacity onPress={() => this._divisioncall()} style={{flex:1}}>
                                    <Label style={styles.labels}>Select Division</Label>
                                    <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.divisonname}</Text>

                                </TouchableOpacity>
                            </Item>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 15 }}>
                            <Button style={{ alignSelf: "center", width: 300, backgroundColor: '#ff5722',borderRadius:10 }} onPress={() => this._getattendancedata()}>
                            <View style={{ alignItems: "center",justifyContent:'center',flex:1 }}>
                                <Text style={{ alignItems: "center", color: 'white' }}>Get Report</Text>
                            </View>
                            </Button>
                        </View>
                    </Form>
                    <View>
                        <Modal isVisible={this.state.isModalVisible} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            {this._academicdetailsnew()}
                        </Modal>
                    </View>
                    <View>
                        <Modal isVisible={this.state.classmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            {/* ****** */}
                            {this._classdetailsnew()}
                        </Modal>
                    </View>
                    <View>
                        <Modal isVisible={this.state.divisionmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                           {/* ************* */}
                            {this._divisonnew()}
                        </Modal>
                    </View>
                </View>
            )}

        }
        else {

            return (
                <View>
                   
                    <View>
                        <FlatList style={{ height: height, width: width }}
                            data={this.state.attendancedatanew}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) =>
                                <View style={{ backgroundColor: item.status == 'present' ? 'lightgreen' : 'lightpink', flexDirection: 'row', margin: 10, height: 50, justifyContent: 'center' }}>
                                    <View style={{ width: 75, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 15, alignContent: 'center' }}>{item.rollno}</Text></View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text style={{ fontSize: 15, alignContent: 'center' }}>{item.name}</Text></View>
                                </View>
                            }
                        />
                    </View>
                    <View>
                        <Card>
                            <CardItem bordered style={{ alignSelf: 'center', width: width, justifyContent: "center" }}>
                                <Text style={{fontWeight:"bold"}}>Total Number OF Student:{this.state.totalcount}</Text>
                            </CardItem >
                            <CardItem style={{ alignSelf: 'center', width: width, justifyContent: "center" }}>
                                <Text style={{fontWeight:"bold"}}>present Student:{this.state.presentcount} And Absent Student:{this.state.absentcount}</Text>
                            </CardItem>

                        </Card>
                    </View>
                    <View>
                            <Button style={{ alignSelf: "center", width: 300, backgroundColor: 'lightblue',alignItems: "center",borderRadius:10 }} onPress={() => this.setState({ switch: !this.state.switch })}>
                                <View style={{alignItems:"center",justifyContent:'center',flex:1}}>
                                <Text style={{ alignItems: "center", color: 'white' , justifyContent: "center", fontSize: 15,alignSelf:"center",fontWeight:'bold' }}>Back</Text>
                                </View>
                            </Button>
                        </View>
                </View>
            )


        }
    }
    render() {

        return (
            <Container style={{ backgroundColor: 'transparent' }}>
                <ImageBackground
                    resizeMode={'cover'}
                    style={{ flex: 1 }}
                    source={require('../../assets/background.png')}
                >
            <ScrollView>
                   
                    {this._homebody()}
                    </ScrollView>
                </ImageBackground>
            </Container>
        );
    }
}
class ManualAttendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            classmodal: false,
            switch: true,
            academicdata: [],
            academicyear: '',
            academicid: '',
            attendancedatanew: [],
            isloading: false,
            staff_id: '',
            clasdata: [],
            divisiondata: [],
            divisonname: '',
            divisionid: '',
            classname: '',
            mediumname: '',
            spinner: true,
            classid: '',
            classthieght: 250,
            subjectmargin: 10,
            selectedstud: '',
            subjectmodal: false,
            today: [],
            divisionmodal: false,
            totalcount: '',
            presentcount: '',
            absentcount: '',
            checked: false,
            visible2: false,
            reason: 'Not Brought the id Card',
            reasonmodal1: false,
            other: false,
            reasontemp: '',
            chekarr: {},
            isDateTimePickerVisible: false


        }
        this._data = this._data.bind(this)
        this._toggle = this._toggle.bind(this)
    }
    componentDidMount() {
        this._data()

    } 
    _Foracademic(id) {
        console.log('this is academic id:' + id)
        console.log(this.state.academicdata)
        for (var i = 0; this.state.academicdata.length > i; i++) {
            console.log('in ooping')
            if (id == this.state.academicdata[i].id) {
                console.log('in loop')
                this.setState({
                    academicyear: this.state.academicdata[i].name,
                    academicid: this.state.academicdata[i].id,
                })

            }

        }
        this.setState({

            isModalVisible: false,

        })



    }

    _academicdetailsnew() {
        console.log('in academic')
        console.log(this.state.academicdata)
        return (
            <View style={{ height: 250, width: 280, backgroundColor: 'white',borderRadius:10}}>
               
                    <Text style={{ color: '#ff5722', fontSize: 20, alignSelf: 'center',marginBottom:5,fontWeight:'bold',marginBottom:10}}> Select Academic Year</Text>
                {   this.state.academicdata.length >'0' ?
                    this.state.academicdata.map((data) => {
                        return (
                            <View style={{ alignSelf: 'center', color: 'white',padding:10,borderWidth:2,marginBottom:4,borderColor:'#ff5722'}}>
                                <TouchableOpacity key={data.id} onPress={() => (this._Foracademic.bind(this))(data.id)}>
                                    <Text style={{ fontSize: 15 }}>{data.name} </Text>
                                </TouchableOpacity>
                            </View>
                             )
                    }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'bold',fontSize:20,}}>NO DATA</Text></View>
                }
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}} >
                    <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={() => this.setState({ isModalVisible: false, })}>
                        <Text style={{ color: '#ff5722',fontSize:20,fontWeight:'bold',marginBottom:10,marginRight:15 }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </View>


        )

    }
    // _getclass(class_id) {
      
    //     for (var i = 0; this.state.clasdata.length > i; i++) {
    //         if (id == this.state.clasdata[i].id) {
    //             this.setState({
    //                 class_name: this.state.clasdata[i].class_name,
    //                 class_id: this.state.clasdata[i].class_id,
    //                 classmodal: false,
    //                 divisonname: '',
    //             })
    //         }
    //     }
    // }

    _getclass(id) {
     
        console.log('id of class:' + id)
        console.log('in classdsta' + this.state.clasdata);
        for (var i = 0; this.state.clasdata.length > i; i++) {
            console.log('in looping')
            if (id == this.state.clasdata[i].class_id) {
                console.log('in')
                this.setState({
                    classname: this.state.clasdata[i].class_name,
                    classid: this.state.clasdata[i].class_id,
                    classmodal: false,
                    divisonname: '',

                })


            }

        }

    }

    _getdivision(id) {
       
        for (var i = 0; this.state.divisiondata.length > i; i++) {
            console.log('in looping')
            if (id == this.state.divisiondata[i].div_id) {
                console.log('in')
                this.setState({
                    divisonname: this.state.divisiondata[i].div_name,
                    divisionid: this.state.divisiondata[i].div_id,
                    divisionmodal: false,

                })


            }

        }

    }
    _classdetailsnew() {
        var height2 = 350;
        console.log('in class details view:' + this.state.clasdata)
        if (classlength >= 4) {

            height2 = newhigh - 50;
        }
        else {

            height2 = 350
        }
        console.log('hieght of class' + height2)
        return (


            <Card style={{ height: height2, width: 350, }}>
                <CardItem header bordered style={{ alignSelf: "center", width: 350 }}>
                    <Text style={{  fontSize: 20,fontWeight:'bold' }}>Select Class</Text>
                </CardItem>
                {

                    this.state.clasdata.map((data) => {
                        return (

                            <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                <TouchableOpacity key={data.class_id} onPress={() => (this._getclass.bind(this))(data.class_id)} style={{ flex: 1 }}>
                                    <CardItem bordered style={{ width: 350, }}>
                                        <Text> {data.class_name}</Text>
                                    </CardItem>
                                </TouchableOpacity>
                            </Body>


                        )


                    })

                }
                <CardItem footer style={{ alignSelf: "flex-end" }}>
                    <TouchableOpacity onPress={() => this.setState({ classmodal: false, })}>
                        <Text style={{ fontSize: 20,fontWeight:'bold' }}>CANCEL</Text>
                    </TouchableOpacity>

                </CardItem>
            </Card>

        )

    }

    _divisonnew() {
        // *****************
        console.log('in divison details view:' + this.state.divisiondata)
        return (


            <Card style={{ height: 350, width: 350, }}>
                <CardItem header bordered style={{ alignSelf: "center", flex: 1, width: 350 }}>
                    <Text style={{  fontSize: 20,fontWeight:'bold'}}>Select Divison</Text>
                </CardItem>
                {

                    this.state.divisiondata.map((data) => {
                        return (
                            <ScrollView>
                                <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                    <TouchableOpacity key={data.div_id} onPress={() => (this._getdivision.bind(this))(data.div_id)} style={{ flex: 1 }}>
                                       {/* ************************ */}
                                        <CardItem bordered style={{ width: 350, }}>
                                            <Text> {data.div_name}</Text>
                                        </CardItem>
                                    </TouchableOpacity>
                                </Body>
                            </ScrollView>

                        )


                    })

                }
                <CardItem footer style={{ alignSelf: "flex-end" }}>
                    <TouchableOpacity onPress={() => this.setState({ divisionmodal: false, })}>
                        <Text style={{  fontSize: 20,fontWeight:'bold' }}>Cancel</Text>
                    </TouchableOpacity>

                </CardItem>
            </Card>

        )

    }
    async  _classcall() {
        console.log('staff id:' + this.state.staff_id)
        var staffid = this.state.staff_id;
        var connection = await NetInfo.fetch();
        console.log(connection.isConnected);
        if(!connection.isConnected){
            alert('No internet  Connection');
            return false
        }
        const classdatanew = await classdata1(staffid);
        console.log('classdata' + JSON.stringify(classdatanew))
        for (var i = 0; classdatanew.length > i; i++) {

            classlength++;
        }

        this.setState({
            clasdata: classdatanew,
            classmodal: true,
            classthieght: classlength,
        })


    }
    async _data() {
        var self = this;
        db.transaction(async (txn) => {
            txn.executeSql("select * from tbllogin where isactive='1'", [],
                function (tx, result) {
                    console.log('got the studid:' + result.rows.item(0).userid)
                    self.setState({ staff_id: result.rows.item(0).userid })

                },
            )
        })
        const response = await Academicdetails();
        const responsenew = await Mediumnew();
        console.log(response + '1')
        console.log(responsenew + '2')
        console.log('check if academic :' + JSON.stringify(response))
        for (var i = 0; response.length > i; i++) {
            this.setState({
                academicyear: response[0].name,
                mediumname: responsenew[0].name,
                academicid: response[0].id,
            })
        }
        console.log(this.state.academicyear)
        var today = new Date();
        console.log(today)
        var _newmonth=parseInt(today.getMonth() + 1);
        console.log('fhsdhfsdkjgdfmdfgadkkgw'+_newmonth)
        if (_newmonth == '1') {
            _newmonth ='Jan' ;
        }
        else if (_newmonth == '2') {
            _newmonth = 'Feb';
        }
        else if (_newmonth == '3') {
            newmonth = 'Mar';
        }
        else if (_newmonth =='4' ) {
            _newmonth = 'Apr';
        }
        else if (_newmonth =='5') {
            _newmonth =  'May';
        }
        else if (_newmonth=='6' ) {
            _newmonth ='Jun';
        }
        else if (_newmonth == '7') {
            _newmonth ='Jul';
        }
        else if (_newmonth =='8') {
            console.log('in')
            _newmonth = 'Aug';
        }
        else if (_newmonth =='9' ) {
            _newmonth = 'Sep';
        }
        else if (_newmonth =='10') {
            _newmonth = 'Oct';
        }
        else if (_newmonth == '11') {
            _newmonth ='Nov' ;
        }
        else if (_newmonth =='12' ) {
            _newmonth = 'Dec';
        }
        else{
            _newmonth = 'Dec';
        }
        console.log('gsgsdfsfsdff'+_newmonth)
        var date = today.getDate() + "/" + _newmonth + "/" +today.getFullYear() ;
        this.setState({
            today: date,
            academicdata: response,
            spinner: false
        })
    }
    async _divisioncall() {
        // **
        var classid = this.state.classid;
        if (this.state.classname == '') {
            alert('please select class')
        }
        else {
            var connection = await NetInfo.fetch();
            console.log(connection.isConnected);
            if(!connection.isConnected){
                alert('No internet  Connection');
                return false
            }        
            const response = await division2(this.state.staff_id);
            const found = response.filter(element => element.class_id==classid);
            console.log("found----------Mohini",found)
            const array = Object.values( found );
            console.log("responsewholedivision------Mohini"+response)                     
         if(response=='error'){alert('SOMETHING WENT WRONG...!')}else{
            this.setState({
                divisiondata: array,
                divisionmodal: true,
            })
         }            
        }
    }
    async  _getattendancedata() {
        var connection = await NetInfo.fetch();
      
       
        if(connection.isConnected){
            
            if(this.state.classid=='' ||this.state.classid==null){
                alert('Please select class')
          }
          else if(this.state.divisionid=="" ||this.state.divisionid == null){
            alert('Please select division')

          }
          else{
            this.setState({

                spinner: true
            })
            var table1 = [];
            var table2 = [];
            var attendancedata1 = [];
            const response = await attendancedata(this.state.academicid, this.state.divisionid, this.state.today);
            table1 = response.table;
            table2 = response.table1;
            console.log('resposme' + JSON.stringify(response))
            var add = true;
            var absentcount = 0;
            for (var i = 0; table1.length > i; i++) {
                add = true;
                for (var j = 0; table2.length > j; j++) {
    
                    if (table1[i].stud_id == table2[j].stud_id) {
                        attendancedata1.push({ id: table1[i].stud_id, status: 'present', name: table1[i].name, rollno: table1[i].roll_no });
                        add = false;
    
                    }
                }
                if (add) {
                    absentcount++;
                    console.log('in add')
                    attendancedata1.push({ id: table1[i].stud_id, status: 'absent', name: table1[i].name, rollno: table1[i].roll_no });
                }
            }
            this.setState({
                totalcount: table1.length,
                presentcount: table2.length,
                absentcount: absentcount,
                attendancedatanew: attendancedata1,
                switch: false,
                spinner: false,
            })
            var arr = {};
    
            this.state.attendancedatanew.map((data) => {
                arr[data.id] = false;
            })
            this.setState({ chekarr: arr })
        }
        }
        else{
            alert('NO INTERNET CONNECTION..!')
        }
        
  
    }
    _toggle(id) {
        console.log(this.state.chekarr[id])
        if (this.state.chekarr[id]) {
            console.log('in')
            var arr = {};
            arr = this.state.chekarr;
            arr[id] = false;
            this.setState({ chekarr: arr })
            dataarray = dataarray.filter(function (data) {
                if (data.stud_id == id) {

                } else {
                    return data;
                }
            })
            console.log(dataarray)
        } else {

            var arr = {};
            arr = this.state.chekarr;
            arr[id] = true;
            this.setState({ chekarr: arr })
            this.setState({
                selectedstud: id,
                reasonmodal1: true
            })

        }

    }

    save() {
        // var date= new Date(this.state.today);
        // var today=date.getDay()+'-'+date.getMonth()+'-'+date.getFullYear();+ ' 00:00:00.000'
        this.setState({ reasonmodal1: false, reason: 'Not Brought the id Card' })
        dataarray.push({ stud_id: this.state.selectedstud, in_time: this.state.today.replace('/','-').replace('/','-'), out_time: this.state.today.replace('/','-').replace('/','-'), reason: this.state.reason })
        console.log(JSON.stringify(dataarray));
    }
    _canclefunction() {
        console.log('in cancle')
        var arr = {};
        arr = this.state.chekarr;
        arr[this.state.selectedstud] = false;
        console.log(JSON.stringify(arr));
        this.setState({
            chekarr: arr,
            reasonmodal1: false
        })

    }

    async postattendance() {
        this.setState({ spinner: true })

        if (dataarray.length > 0) {
            var data = {
                studArray: dataarray,
                div_id: this.state.divisionid,
                ayid: this.state.academicid,
                user_id: this.state.staff_id
            };

            console.log(data)
            var connection = await NetInfo.fetch();
            console.log(connection.isConnected);
            if(!connection.isConnected){
                alert('No internet  Connection');
                return false
            }
            var result = await manualattendancesave(data);
            console.log(result)
            this.setState({ spinner: false })
            if (result = 'success') {
                alert('saved successfully')
            } else {
                alert('Something Went Wrong')
            }
            this.setState({ switch: true })
        }
    }
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
     //   console.log('A date has been picked: ');
        var datenew = date.toString();
        datenew = datenew.split('T');
    
            if(datenew[0]=='')
            {
                datenew=datenew[1];
            }
            else
            {
                datenew=datenew[0];
            }

        console.log('show me date'+datenew)
        datenew = datenew.split(' ');
        console.log(datenew)
        var newmonth = '';
        if (datenew[1] === 'Jan') {
            newmonth = 1;
        }
        else if (datenew[1] === 'Feb') {
            newmonth = 2;
        }
        else if (datenew[1] === 'Mar') {
            newmonth = 3;
        }
        else if (datenew[1] === 'Apr') {
            newmonth = 4;
        }
        else if (datenew[1] === 'May') {
            newmonth = 5;
        }
        else if (datenew[1] === 'Jun') {
            newmonth = 6;
        }
        else if (datenew[1] === 'Jul') {
            newmonth = 7;
        }
        else if (datenew[1] === 'Aug') {
            newmonth = 8;
        }
        else if (datenew[1] === 'Sep') {
            newmonth = 9;
        }
        else if (datenew[1] === 'Oct') {
            newmonth = 10;
        }
        else if (datenew[1] === 'Nov') {
            newmonth = 11;
        }
        else if (datenew[1] === 'Dec') {
            newmonth = 12;
        }
        console.log('A date has been picked: ', datenew[3] + '-' + newmonth + '-' + datenew[2]);
        var changedate= datenew[2]+ '/' + datenew[1] + '/' +  datenew[3];
        this.setState({ today: changedate });
        this._hideDateTimePicker();
    };

    _homebody() {

        if (this.state.switch) {
            if(this.state.spinner){
                return <Loader/>
            }else{
            return (
               
                <View>
                   
                      <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                    <Form>
                        <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }} >
                            <TouchableOpacity style={{flex:1}} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                                <Label style={styles.labels}>From Date:</Label>

                                {/* <Input   onChangeText={(username) => this.setState({ username })}
                          value={this.state.username}/> */}
                                <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.today}</Text>
                            </TouchableOpacity>
                        </Item>
                        <View>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisible: true })} style={{flex:1}}>
                                    {/* <Label style={styles.labels}>Academic Year:</Label> */}
                                    <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.academicyear}</Text>
                                </TouchableOpacity>
                            </Item>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>

                                <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.mediumname}</Text>
                            </Item>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                <TouchableOpacity onPress={() => this._classcall()} style={{flex:1}}>
                                    <Label style={styles.labels}>Select Class</Label>
                                    <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.classname}</Text>
                                </TouchableOpacity>

                            </Item>
                            <Item style={{ marginLeft: 5, marginRight: 5, marginBottom: 5, marginTop: 20, borderWidth: 4 }}>
                                <TouchableOpacity onPress={() => this._divisioncall()} style={{flex:1}}>
                                    <Label style={styles.labels}>Select Division</Label>
                                    <Text style={{ fontSize: 18, marginLeft: 15, }}>{this.state.divisonname}</Text>

                                </TouchableOpacity>
                            </Item>
                        </View>
                        <View style={{ alignItems: "center", marginTop: 15 }}>
                            <Button style={{ alignSelf: "center", width: 300, backgroundColor: '#ff5722',borderRadius:10 }} onPress={() => this._getattendancedata()}>
                            <View style={{ alignItems: "center",justifyContent:'center',flex:1 }}>
                                <Text style={{ alignItems: "center", color: 'white'}}>Get Report</Text>
                                </View>
                            </Button>
                        </View>
                    </Form>
                    <View>
                        <Modal isVisible={this.state.isModalVisible} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            {this._academicdetailsnew()}
                        </Modal>
                    </View>
                    <View>
                        <Modal isVisible={this.state.classmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            {this._classdetailsnew()}
                        </Modal>
                    </View>
                    <View>
                        <Modal isVisible={this.state.divisionmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            {this._divisonnew()}
                        </Modal>
                    </View>


                </View>
            )}

        }
        else {


            return (

                <View>

                    <View>

                        <ScrollView style={{ height: manualheight, width: width }}>

                            {
                                this.state.attendancedatanew.map((data) => {
                                    return (

                                        <View style={{ backgroundColor: data.status == 'present' ? 'lightgreen' : 'lightpink', flexDirection: 'row', margin: 10, height: 50, justifyContent: 'center' }}>
                                            {data.status == 'present' ? <View style={{ width: 35, justifyContent: 'center', alignItems: 'center' }}></View> : <View style={{ width: 35, justifyContent: 'center', alignItems: 'center' }}>
                                                <CheckBox key={data.id} style={{marginLeft:5}} isChecked={this.state.chekarr[data.id]} onClick={() => { (this._toggle.bind(this))(data.id); }} /></View>}
                                            <View style={{ width: 75, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 15, alignContent: 'center' }}>{data.rollno}</Text></View>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}><Text style={{ fontSize: 15, alignContent: 'center' }}>{data.name}</Text></View>
                                        </View>
                                    )


                                })
                            }
                        </ScrollView>
                        <View style={{ alignSelf: "center", marginTop: 2 }}>
                            <Button style={{ width: 250, backgroundColor: 'lightgreen',borderRadius:10 }} onPress={() => { this.postattendance() }}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{ alignSelf: "center" }}>Save</Text>
                                </View>
                            </Button>
                        </View>

                    </View>
                    <View >
                        <Modal isVisible={this.state.reasonmodal1} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            <Card style={{ height: 250, width: 350, }}>
                                <CardItem header bordered style={{ alignSelf: "center", flex: 1, width: 350 }}>
                                    <Text style={{ fontSize: 20 }}>Reason For Manual Present Student</Text>
                                </CardItem>
                                <Body style={{ alignSelf: 'flex-start', flex: 1 }}>
                                    <TouchableOpacity onPress={() => this.setState({ ressonmodal: true })}>
                                        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'black', width: 350, height: 30, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 15 }}>{this.state.reason}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Body>
                                <CardItem footer style={{ alignSelf: "flex-end" }}>
                                    {/* <TouchableOpacity onPress={() => this.setState({ reasonmodal1: false, })}>
                        <Text style={{ fontSize: 20 }}>Cancel</Text>
                    </TouchableOpacity> */}

                                </CardItem>
                                <CardItem footer style={{ alignItems: 'center' }} >
                                    <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                                        <Button style={{ width: 100, alignItems: 'center', borderRadius: 5, marginLeft: 45 }} onPress={() => { this.save() }}>
                                            <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold', alignContent: 'center', marginLeft: 30 }}>Save</Text>
                                        </Button>
                                        <Button style={{ marginLeft: 20, width: 100, alignItems: 'center', borderRadius: 5 }} onPress={() => this._canclefunction()}>
                                            <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold', alignContent: 'center', marginLeft: 18 }}>Cancel</Text>
                                        </Button>
                                    </View>
                                </CardItem>
                            </Card>

                        </Modal>


                    </View>
                    <View>
                        <Modal isVisible={this.state.ressonmodal} animationOut={'zoomOutUp'} swipeDirection='up' backdropColor='#000000' style={{ alignItems: 'center', color: '#000000' }}>
                            <View>
                                <Card>
                                    <CardItem header bordered>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ alignContent: 'center', fontWeight: 'bold', fontSize: 25 }}>
                                                Select Proper Reason
                                      </Text>
                                        </View>
                                    </CardItem>
                                    <TouchableOpacity>
                                        <CardItem>
                                            <TouchableOpacity onPress={() => this.setState({ reason: ' ID Card Not Brought', ressonmodal: false })}>
                                                <Text style={{ fontSize: 20 }}> ID Card Not Brought  </Text></TouchableOpacity>
                                        </CardItem>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <CardItem>
                                            <TouchableOpacity onPress={() => this.setState({ reason: 'ID Card  Brought but forgot to punch', ressonmodal: false })}>
                                                <Text style={{ fontSize: 20 }}>ID Card  Brought but forgot to punch</Text></TouchableOpacity>
                                        </CardItem>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ other: true })}>
                                        <CardItem>
                                            <Text style={{ fontSize: 20 }}>Other</Text>
                                        </CardItem>
                                    </TouchableOpacity>
                                    <CardItem>
                                        {this.state.other ?
                                            <View style={{ flex: 1 }}>
                                                <View>
                                                    <TextInput
                                                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                                        onChangeText={(text) => this.setState({ reasontemp: text })}
                                                    />
                                                </View>
                                                <View style={{ alignItems: 'center', marginTop: 5 }}>
                                                    <Button onPress={() => { this.setState({ reason: this.state.reasontemp, other: false, ressonmodal: false }) }} style={{ width: 100, borderRadius: 5, }}><Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold', alignContent: 'center', marginLeft: 30 }}>Save</Text></Button>
                                                </View>
                                            </View> : <View></View>}
                                    </CardItem>
                                    <Card footer>
                                        <CardItem>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <TouchableOpacity onPress={() => this.setState({ ressonmodal: false })}>
                                                    <Text style={{ alignContent: 'center', fontWeight: 'bold', fontSize: 25 }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </CardItem>

                                    </Card>

                                </Card>
                            </View>
                        </Modal>
                    </View>
                </View>
            )


        }
    }
    render() {

        return (
            <Container style={{ backgroundColor: 'transparent' }}>
                <ImageBackground
                    resizeMode={'cover'}
                    style={{ flex: 1 }}
                    source={require('../../assets/background.png')}
                >
                    {this._homebody()}
                </ImageBackground>
            </Container>
        );
    }
}
export default class StaffAttendacne extends React.Component {

    render() {

        return (
           
            <Container>

                <ImageBackground
                    resizeMode={'cover'} // or cover
                    style={{ flex: 1 }} // must be passed from the parent, the number may vary depending upon your screen size
                    source={require('../../assets/background.png')}
                >
                  <Header style={{ backgroundColor: '#fafafa',borderColor:'white',borderWidth:2}}>
            <StatusBar backgroundColor="#002171" />
            <Left style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={require('../../assets/Images/HomeImages/Backwardarrow.png')} style={{ height: 20, width: 20 }}></Image>
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1 }}>
              <Text style={{ color: '#ff5722', fontSize: 20,fontWeight:'bold' }}>Attendance</Text>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>


                    <App />
                </ImageBackground>
            </Container>
           
        )

    }


}
const AppStack = createStackNavigator({ AttendanceView: AttendanceView }, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});
const AppStack2 = createStackNavigator({ ManualAttendance: ManualAttendance }, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});
const TabNavigator = createMaterialTopTabNavigator(
    {
        Home:
        {
            screen: AppStack,
            navigationOptions: {
                tabBarLabel: () => (
                    <View>
                        <Text style={{marginTop:-20}}>ATTENDANCE VIEW</Text>
                    </View>

                ),
            },
         
        },
        Settings:
        {
            screen: AppStack2,
            navigationOptions: {
                tabBarLabel: () => (
                    <View >
                        <Text style={{marginTop:-20}} > MANUAL ATTENDANCE</Text>
                    </View>

                ),

            },
          
         
        }

    },
    {
        tabBarOptions: {
            activeTintColor: '#000000',
            inactiveTintColor: '#fff',
            showIcon: true,
            style: {
                height:55,
                backgroundColor: '#c5c5c5',
                justifyContent:'center',
                alignContent:'center'//color you want to change
            },
            indicatorStyle: {
                borderBottomColor: '#ff3d00',
                borderBottomWidth: 2,
            }


        }
    }
)

const App = createAppContainer(TabNavigator);
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,

    },
    spinnerTextStyle: {
        color: '#fff'
    },
    childImage: {
        alignSelf: 'stretch',
        width: '20',
        height: '20'

    },
    labels: {
        color: '#ff5722',
        textShadowColor: '#808080',
        marginBottom: 10,
        marginLeft: 15
    },
    loginButtonSection: {
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 10
    },


    visibilityBtn:
    {
        position: 'absolute',
        right: 3,
        height: 40,
        width: 35,
        padding: 5,
        marginTop: 10,
        marginRight: 20
    },

    btnImage:
    {
        resizeMode: 'contain',
        height: '100%',
        width: '100%'
    }

});
