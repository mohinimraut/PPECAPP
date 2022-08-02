import React from 'react';
import {View,Text,Image,Modal,TouchableOpacity,Dimensions} from 'react-native';
import { SQLite } from 'expo-sqlite' ;
import {Gallerydata} from '../api/index'
import keys from '../api/keys';
import {Button} from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';
import {connect} from 'react-redux'
const db = SQLite.openDatabase("EDUDUNIYA.db");
var width=Dimensions.get('window').width;
class ViewGallery extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userid:''  ,
            data:[],
            modal:false,
            modaldata:[]
        }
    }

    componentDidMount() {
        this.getuserid();
      
      }
    getuserid() {
        var self = this;
        db.transaction(
          txm => {
            txm.executeSql(
              "select * from tbllogin  where isactive='1'",
              [],
              (tx, results) => {
               
    
                self.setState({
                  userid: results.rows.item(0).userid
                });
             
                self._galllerydata()
              }
            );
          },
          error => {
           
          }
        );
    }

    date(value,type){
        var date=new Date(value);
        if(type=='date'){
            var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            return date.getDay()+'-'+months[date.getMonth()]+'-'+date.getFullYear()
        }else{
            var hour=date.getHours();
            var min=date.getMinutes();
            var day=''
            if(hour==0){
                day='AM'
                hour=12;

            }
            else if(hour>=12){
                day='PM'
                if(hour!=12){
                    hour=hour-12
                }
            } else{
                day='AM'
            }
            if(hour.toString().length==1){
                hour='0'+hour;
            }
            if(min.toString().length==1){
                min='0'+min;
            }

            return hour+':'+min+' '+day
        }
    }

    async _galllerydata() {
        console.log("in gallerydata");
        var instid = "1700001";
        const response = await Gallerydata(this.state.userid);
        if (response != "error") {
            try {
            response.map(data=>{
                data.isopen=false
            })
            this.setState({
                data: response,
                spinner: false
            });
            } catch (error) {
            this.setState({
            spinner: false,
            });
            }
        } else {
            this.setState({
              spinner: false
            });
        }
        console.log(this.state.data)
    }

    showmodal(path){
        console.log(path.split(','))
        this.setState({modaldata:path.split(','),modal:true})
    }

    galleryList(){
        if(this.state.data.length>0){
            return(this.state.data.map(data=>{
                return(
                    <View style={{width:'90%',elevation:4,margin:15,backgroundColor:'#f6f6f6'}}>
                        <Text style={{fontSize:20,fontWeight:'bold',margin:10,color:'#ff5722'}}>{data.title}</Text>
                        <Text style={{margin:5,fontSize:15,color:'#ff5722'}}>About:   
                            <Text style={{marginLeft:5,fontSize:15,color:"#484848"}}>{data.decription}</Text>
                        </Text>
                       
                            {
                                data.img_path.split(',').map((path,index)=>{
                                if(data.isopen){
                                if(index==0||index%3==0){
                                return(
                                    <View style={{margin:5 ,flexDirection:'row'}}>
                                <TouchableOpacity style={{margin:4,width:'30%'}} onPress={()=>{this.showmodal(data.img_path)}}>
                                    <Image  style={{height:100}} source={{uri:keys.api+'/Gallery_image/'+path}}></Image>
                                </TouchableOpacity>
                               
                                    {data.img_path.split(',').length>=index+1?
                                     <TouchableOpacity style={{margin:4,width:'30%'}} onPress={()=>{this.showmodal(data.img_path)}}>
                                    <Image  style={{height:100}} source={{uri:keys.api+'/Gallery_image/'+data.img_path.split(',')[index+1]}}></Image>
                                    </TouchableOpacity>:null}
                                    {data.img_path.split(',').length>=index+2?
                                     <TouchableOpacity style={{margin:4,width:'30%'}} onPress={()=>{this.showmodal(data.img_path)}}>
                                    <Image  style={{height:100}} source={{uri:keys.api+'/Gallery_image/'+data.img_path.split(',')[index+2]}}></Image>
                                    </TouchableOpacity>
                                    :null}
                                    </View>
                                )
                                }
                            }else{
                                if(index==0){
                                    return(
                                        <View style={{margin:5 ,flexDirection:'row'}}>
                                        <TouchableOpacity style={{margin:4,width:'30%'}} onPress={()=>{this.showmodal(data.img_path)}}>
                                        <Image  style={{height:100}} source={{uri:keys.api+'/Gallery_image/'+path}}></Image>
                                        </TouchableOpacity>
                                        {data.img_path.split(',').length>=index+1?
                                        <TouchableOpacity style={{margin:4,width:'30%'}} onPress={()=>{this.showmodal(data.img_path)}}>
                                        <Image  style={{height:100}} source={{uri:keys.api+'/Gallery_image/'+data.img_path.split(',')[index+1]}}></Image>
                                        </TouchableOpacity>
                                        :null}
                                        {data.img_path.split(',').length>=index+2?
                                         <TouchableOpacity style={{margin:4,width:'30%'}} onPress={()=>{this.showmodal(data.img_path)}}>
                                        <Image  style={{height:100}} source={{uri:keys.api+'/Gallery_image/'+data.img_path.split(',')[index+2]}}></Image>
                                        </TouchableOpacity>
                                        :null}
                                        
                                        </View>
                                    )
                                    }
                            }
                            })}
                        
                        <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                        {data.img_path.split(',').length>3 && !data.isopen?<Text style={{fontSize:15,fontWeight:'bold',margin:10,color:'#ff5722'}}>+ {data.img_path.split(',').length-3} more</Text>:<Text></Text>}
                        {data.img_path.split(',').length>3?<Button onPress={()=>{this.showhide(data.t_id)}} style={{borderRadius:10,height:28,backgroundColor:'#ff5722',flexDirection:'row',justifyContent:'space-between',margin:5}}>

                            <Text style={{fontSize:15,color:'white',marginRight:3,marginLeft:6,fontWeight:'bold'}}>{data.isopen?'hide all':'See all'}</Text>
                            <Image style={{height:15,width:20}} source={require('../../assets/icon/right.png')}></Image>
                        </Button>:null}
                        </View>
                    </View>
                )
            })
            )
        }
    }

    showhide(id){
       var temp=this.state.data;
        temp.map(data=>{
            if(data.t_id==id){
                if(data.isopen){
                    data.isopen=false;
                }else{
                    data.isopen=true;
                }
            }
         this.setState({data:temp})
        })
    }
    render(){
        return(
            <ScrollView>
                   {this.props.isnoticeupdated?this._galllerydata():<View/>}
            <View  style={{flex:1,alignItems:'center'}}>
               
              {this.galleryList()}
             
              <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              
                  <View style={{justifyContent:'center',flex:1,alignItems:'center'}}>
                  <ScrollView horizontal={true} pagingEnabled={true}>
                 
             {this.state.modaldata.length>0? this.state.modaldata.map(data=>{
                 return(
                    <View style={{width:width,flex:1,justifyContent:'center'}}>     
                  <Image style={{width:width,height:width}} source={{uri:keys.api+'/Gallery_image/'+data}}></Image>
                  </View>
                 )
                }):null}
              
              </ScrollView>
              <Button onPress={()=>{this.setState({modal:false})}} style={{width:'80%',backgroundColor:'#ff5722',justifyContent:'center',alignItems:'center'}}>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:20,color:'white'}}>Back</Text>
                  </View>
              </Button>
              </View>
           
          </View>
        </Modal>
            </View>
            </ScrollView>
        )
    }
}

function mapStateToProps(state) {
    console.log("view" + JSON.stringify(state.gallery));
    return {
      isgalleryupdated: state.gallery["isgalleryupdated"],
      currenttab: state.gallery["currenttab"],
      option: state.gallery["option"]
    };
  }
  
  export default connect(mapStateToProps)(ViewGallery);