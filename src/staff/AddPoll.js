import React from 'react';
import {View ,TextInput,Picker,Text,ScrollView,Image,TouchableOpacity} from 'react-native'
import {Container,Button} from 'native-base'
import { classdata,division,Subjectdata,insertpoll} from '../api/index'
import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class AddPoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pollto:'All',
            userid:'',
            question:'',
            answer:'',
            class:[],
            div:[],
            subject:[],
            selectedclass:'',
            selectdiv:'',
            selectedsubject:'',
            noofoption:2,
            options:[{textindex:1,value:''},{textindex:2,value:''}]
        }
    }
   async componentDidMount(){
   
   this.getuserid()
}

    getuserid=async()=> {
    
       await db.transaction(async (txm) => {
          await txm.executeSql("select * from tbllogin where isactive='1';", [],async   (tx, results) => {
            var data=results.rows.item(0);
           this.setState({userid:data.userid})
            

          });
        }, (error) => {
        })
       
    }
    
    async getClass(){
        var data=await classdata(this.state.userid);
        
        if(data=='error'){
            alert('something Went Wrong')

        }else{
            this.setState({class:data})
        
        }
    }

    async getDiv(id){
        console.log(id)
        var data=await division(id)
        if(data=='error'|| data=='No Data'){
            this.setState({
                div:[],selectdiv:''
            })
            alert('No division for this class')

        }else{
            this.setState({
                div:data
            })
        }
    }

    async getSubject(id){
        var data=await Subjectdata(id)
        if(data=='error'|| data=='No Data'){
            this.setState({
                subject:[],selectedsubject:''
            })
            alert('No subject for this class')
        }else{
            this.setState({
                subject:data
            })
        }
    }


    classlist(){
        if(this.state.class.length!=0){
            return(
            this.state.class.map((data)=>{
                    return(
                       
                        <Picker.Item label={data.name} value={data.id} /> 
                    )
            })
            )
        }else{
            return(
                <Picker.Item label="Select Division" value="Division" />
            )
        }
    }

    subjectlist(){
        if(this.state.subject.length!=0){
            return(
            this.state.subject.map((data)=>{
                    return(
                        <Picker.Item label={data.name} value={data.id} /> 
                    )
            })
            )
        }else{
            return(
                <Picker.Item label="Select Subject" value="Select Subject" />
            )
        }
    }

    divlist(){
        if(this.state.div.length!=0){
            return(
            this.state.div.map((data)=>{
                    return(
                       
                        <Picker.Item label={data.name} value={data.id} /> 
                    )
            })
            )
        }else{
            return(
                <Picker.Item label="Select Division" value="Select Division" />
            )
        }
    }

    otherview(){
        return(
            <View style={{width:'100%',alignSelf:'center',alignItems:'center'}}>
                 <View style={{borderBottomColor:'grey',borderBottomWidth:1,width:'80%'}}>
                
                 <Picker
                    placeholder='Select Class'
                    selectedValue={this.state.selectedclass}
                    style={{height:50,width:'100%'}}
                    onValueChange={(itemValue, itemIndex) =>{
                    this.setState({selectedclass: itemValue})
                    if(itemValue!='Select Class'){
                        this.getDiv(itemValue);
                        this.getSubject(itemValue);
                    }else{
                        this.setState({subject:[],div:[]})
                    }
                    }}>
                     {/* <Picker.Item label="Select Class" value="Select Class" /> */}
                    {this.classlist()}
                    </Picker>
                    </View>

                <View style={{borderBottomColor:'grey',borderBottomWidth:1,width:'80%'}}>
                 <Picker
                    placeholder='Select Subject'
                    selectedValue={this.state.pollto}
                    style={{height:50,width:'100%'}}
                    onValueChange={(itemValue, itemIndex) =>
                    this.setState({selectedsubject: itemValue})
                        }>
                    {this.subjectlist()}
                    </Picker>
                    </View>
    
                <View style={{borderBottomColor:'grey',borderBottomWidth:1,width:'80%'}}>
                    <Picker
                         placeholder='Select Division'
                        selectedValue={this.state.pollto}
                        style={{height:50,width:'100%'}}
                        onValueChange={(itemValue, itemIndex) =>
                        this.setState({selectdiv: itemValue})
                            }>
                        {this.divlist()}
                        </Picker>
                        </View>
            </View>
        )
    }

    noofoptionchanged(type){
        var temp=this.state.options;
        var len=temp.length;
        if(type=='add'){
            if(len==4){
                alert('you cannot have more that four options')
                return false
            }else{
            var newlen=len+1;
            var obj={textindex:newlen,value:''};
            temp=[...temp,obj]
            this.setState({options:temp,noofoption:newlen})
            }
        }else{
            if(len==2){
                alert('you cannot have less that two options')
                return false
            }else{
            var newlen=len-1;
           temp.pop();
            this.setState({options:temp,noofoption:newlen})    
            }
        }
    }
   


    handleoptionentry(text,data){
       
        var temp=this.state.options;
        for(var i=0;i<temp.length;i++){
            if(temp[i].textindex==data){
                temp[i].value=text;
                
            }
        }
        this.setState({options:temp})
    }

    async save(){
        if(this.state.question=='' && this.state.answer==''){
            alert('Fill all the details')
            return false;
        }
        var option='';
        var answercheck=false
        this.state.options.map((data,index)=>{
            if(data.value!=''){
                if(data.value==this.state.answer){
                    answercheck=true
                }
            if(index==0){
                option=data.value;
            }else{
                option+= '|'+ data.value
            }
        }else{
            alert('options cannot be empty')
            return false;
        }
        })
        if(!answercheck){
            alert('not all options matches answer')
            return false;
        }

        var otherid=''
        if(this.state.pollto=='other'){
            if(this.state.selectedclass!=''){
                otherid=this.state.selectedclass
            }
            if(this.state.selectdiv!=''){
                otherid=this.state.selectdiv
            }
            if(this.state.selectedsubject!=''){
                otherid=this.state.selectedsubject
            }
        }

        var data={
            "poll_id": "",
            "poll_question": this.state.question,
            "poll_options": option,
            "poll_answer": this.state.answer,
            "poll_type": "poll",
            "user_id": this.state.userid,
            "dmlType": "save",
            "poll_access": this.state.pollto,
            "other_id": otherid
          }
          console.log(data)
          var result=await insertpoll(data)
          if(result=='success'){
              alert('saved Sucessfully');

          }else{
              alert('Some Thing Went Wrong')
          }
          this.setState({ pollto:'All',
          userid:'',
          question:'',
          answer:'',
          class:[],
          div:[],
          subject:[],
          selectedclass:'',
          selectdiv:'',
          selectedsubject:'',
          noofoption:2,
          options:[{textindex:1,value:''},{textindex:2,value:''}]})
    }

    render (){

        return(
            <ScrollView>
            <Container style={{backgroundColor:'transparent'}}>
               
                <View style={{flex:1,alignItems:'center',justifyContent:'space-around'}}>
                  <View style={{borderBottomColor:'grey',borderBottomWidth:1,width:'80%'}}>
                    <Picker
                    selectedValue={this.state.pollto}
                    style={{height:50,width:'100%'}}
                    onValueChange={(itemValue, itemIndex) =>{
                    this.setState({pollto: itemValue})
                    if(itemValue=='Other'){
                        this.getClass()
                    }
                    }}>
                    <Picker.Item label="All" value="All" />
                    <Picker.Item label="All Student" value="All Student" />
                    <Picker.Item label="All Staff" value="All Staff" />
                    <Picker.Item label="Other" value="Other" />
                    </Picker>
                    </View>
                    
                    
                    {this.state.pollto=='Other'?<View style={{width:'100%',alignItems:'center'}}>{this.otherview()}</View>:null}
                    <TextInput
                    placeholder='Your Poll'
                  
                    onChangeText={(text)=>this.setState({question:text})}
                    style={{width:'80%',color:'black',marginLeft:10,height:40,fontSize:20,borderBottomColor:'grey',borderBottomWidth:1}}
                    />
            <View style={{width:'100%',alignItems:'center'}}>
                <TextInput
                    placeholder='Answer'
                    
                    onChangeText={(text)=>this.setState({answer:text})}
                    style={{width:'80%',color:'black',marginLeft:10,height:40,fontSize:20,borderBottomColor:'grey',borderBottomWidth:1}}
                /> 
                <View style={{margin:20,flexDirection:'row',justifyContent:'center'}}>
                    <Text style={{fontSize:15,fontWeight:'bold',marginRight:5}}>No Of Options:</Text>
                    <TouchableOpacity onPress={()=>{this.noofoptionchanged('sub')}} style={{backgroundColor:'transparent',marginLeft:5,width:30,height:25}}>
                          <Image source={require('../../assets/icon/sub.png')} style={{height:20,width:20}}></Image>
                    </TouchableOpacity>
                    
                    <Text style={{fontSize:15,marginLeft:5,marginRight:5,borderBottomColor:'grey',borderBottomWidth:1}}>{this.state.noofoption}</Text>
                    <TouchableOpacity onPress={()=>{this.noofoptionchanged('add')}} style={{backgroundColor:'transparent',marginLeft:5,width:30,height:25}}>
                        <Image source={require('../../assets/icon/add.png')} style={{height:20,width:20}}></Image>
                    </TouchableOpacity>
                </View>
</View>
            { this.state.options.map((data,index)=>{
           return(
            <TextInput
            placeholder='Option'
            key={index}
            value={this.state.options[index].value}
            onChangeText={(text)=>{this.handleoptionentry(text,this.state.options[index].textindex)}}
            style={{width:'80%',color:'black',marginLeft:10,height:40,fontSize:20,borderBottomColor:'grey',borderBottomWidth:1}}
        /> 
           )
       }) }


                <Button onPress={()=>{this.save()}} style={{width:'80%',height:50,borderRadius:50,backgroundColor:'#ff5722'}}>
                    <View  style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>
                            Save
                        </Text>
                    </View>
                </Button>
               
                </View>
                      
            </Container>
            </ScrollView> 
        )
    }
}