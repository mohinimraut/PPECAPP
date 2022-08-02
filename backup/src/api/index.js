import keys from '../api/keys'


const BaseAPI=keys.api+'/api/'



const message='error';
export const savestaffnotice=async(data)=>
{  
  try {
    const response=await fetch(BaseAPI+"staffNotice", {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'dataType': 'json'
    },
    body: JSON.stringify(data),
    });
    const result=await response.json(); 
   
    return result ;
  }
  catch (e) {
    
    return message;
  }
}

//user for searching student with name or grno
export const studsearchapi = async (search,staffid) => {
  try {
    const response = await fetch(BaseAPI +"/master/?ddID=ViewStudent&sid=" + search + "&did=" +staffid.substring(0,7) + "&userid=" + staffid);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return message;
  }
};
export const login=async (username,pwd)=>
{

  try {

        const response = await fetch(BaseAPI+'getLogin?username='+username+'&password='+pwd);
        const responseJson = await response.json();
       return responseJson;
      }
         catch (e) {
                   return message;
                   }  
}


export const signupapi=async (user)=>
{

    //console.log(user);
    try {
      const response=await fetch(BaseAPI+'Signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'dataType': 'json'
        },
        body: JSON.stringify( user),
      });
       const result=await response.json(); 
      return result 
     
   }
   catch (e) {
    return message;
    
   }
   
}

export const changepassword=async (user)=>
{

  try {
    const response=await fetch(BaseAPI+'ChangePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json'
      },
      body: JSON.stringify(user),
    });
     const result=await response.json(); 
     console.log(result);
    return result 
 }
 catch (e) {
  return message;
 }
    
   
}

export const savenotice=async(data)=>
{
  
    
    try {
       const response=await fetch(BaseAPI+'notice', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json; charset=utf-8',
           'dataType': 'json'
         },
         body: JSON.stringify(data),
       });
        const result=await response.json(); 
        console.log('this is restult'+JSON.stringify(result))
       return result 
    }
    catch (e) {
     return message;
     console.log(e)
    }
  }

export const LoadSlider=async ()=>
{

  try {
    const response = await fetch(BaseAPI+'Signup');
  const responseJson = await response.json();
      return responseJson;
  
 }
 catch (e) {
  return message;
 }
  
   
}

export const LoadProfileData=async (userid)=>
{
  try {
    const response = await fetch(BaseAPI+'student?studid='+userid);
  const responseJson = await response.json();
      return responseJson;
 }
 catch (e) {
  return message;
 }

  
  
   
}
export const Mediumnew=async()=>
{
  try {
    const response = await fetch(BaseAPI+'master/1700001?ddID=medium') ;
  const responseJson = await response.json();
      return responseJson;
 }
 catch (e) {
 
 }
  

}
export const Academicdetails=async ()=>
{

  try {
    const response =  await fetch(BaseAPI+'master/1700001?ddID=year');
    const responseJson = await response.json();
    return responseJson;
 }
 catch (e) {
  return message;
 }
  

  
   
}
export const classdata=async(userid)=>
{
  try {
    const response = await fetch(BaseAPI+'notice/1700001M00001?ddID=classStaff&staffid='+userid) ;
    const responseJson = await response.json();
        return responseJson;
 }
 catch (e) {
  return message;
 }
 

}

export const subinstitute=async(userid)=>{

  try {
    const response = await fetch(BaseAPI+'FeesReport/getInstitute?userid='+userid) ;
  const responseJson = await response.json();
      return responseJson;
 }
 catch (e) {
  return message;
 }
 


}
export const division=async(classid)=>
{
  try {
    const response = await fetch(BaseAPI+'master/'+classid+'?ddID=division') ;
  const responseJson = await response.json();
      return responseJson;
 }
 catch (e) {
  return message;
 }
 
  

}
export const attendancedata=async(ayid,div,date)=>{

  try {
    const response = await fetch(BaseAPI+'ManualAttendance?div='+div+'&ayid='+ayid +'&date='+date) ;
    const responseJson = await response.json();
        return responseJson;
 }
 catch (e) {
  return message;
 }
  
  


}
export const LoadStaffProfileData=async (userid)=>
{

  try {
    const response = await fetch(BaseAPI+'Staff?staffid='+userid);
    const responseJson = await response.json();
        return responseJson;
 }
 catch (e) {
  return message;
 }
  


}

export const Attendancedataapi=async(userid)=>
{
  //console.log(userid)
  //console.log(BaseAPI+'attendance/getRfidAttend?studid='+userid)
  try {
    const response= await fetch(BaseAPI+'attendance/getRfidAttend?studid='+userid);
      const responseJson = await response.json();
      return responseJson;
 }
 catch (e) {
   console.log('error:'+e)
  return message;
 }
    


}

export const Gallerydata=async(userid)=>
{console.log(BaseAPI+'add_gallery_api_?staff_id='+userid)
  try {
    const response= await fetch(BaseAPI+'add_gallery_api_?staff_id='+userid);
      const responseJson = await response.json();
    
      return responseJson;
 }
 catch (e) {
  return message;
 }
      


}
//api for news
export const Newsdataapi=async(userid)=>
{
  try {
    console.log(BaseAPI+'notice/'+userid+'?type=News')
    const response= await fetch(BaseAPI+'notice/'+userid+'?type=News');
    const responseJson = await response.json();
    return responseJson;
 }
 catch (e) {
  return message;
 }
      
}

//api for notice
export const Noticedataapi=async(userid)=>
{
  try {
    console.log(BaseAPI+'notice/'+userid+'?type=self')
    const response= await fetch(BaseAPI+'notice/'+userid+'?type=self');
    const responseJson = await response.json();
    return responseJson;
 }
 catch (e) {
  return message;
 }
}
 export const selfstudgallery=async(userid,type)=>
{

  console.log(type)
  console.log('this isssssisddd'+userid)
  try {
    console.log(BaseAPI+'notice/?id='+userid+'&type='+type)
    const response= await fetch(BaseAPI+'notice/?id='+userid+'&type='+type);
    const responseJson = await response.json();
    console.log(`staffdat${JSON.stringify(responseJson)}`)
    return responseJson;

 }
 catch (e) {
  return message;
 }
      
}
      

export const manualattendancesave=async (data)=>
{

  try {
    const response=await fetch(BaseAPI+'ManualAttendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json'
      },
      body: JSON.stringify(data),
    });
     const result=await response.json(); 
     console.log('this is restult'+result)
    return result 
 }
 catch (e) {
  return message;
 }

    
   
}

// for class of multi institue
export const getclass=async(instaid)=>{
  try {
    const response = await fetch(BaseAPI+'FeesArrears/'+instaid) ;
    const responseJson = await response.json();
        return responseJson;
 }
 catch (e) {
  return message;
 }
   
  }


// api for staff norice page to get all staff list
export const allstafflist=async(userid)=>
{
  try {
    const response= await fetch(BaseAPI+'staffNotice');
      const responseJson = await response.json();
      return responseJson;
 }
 catch (e) {
  return message;
 }
     
}

export const studentrollcall=async(ayid,divid)=>
{
  
  try {
  const response = await fetch(BaseAPI+'/FeesReport?ayid='+ayid+'&div_id='+divid) ;
  const responseJson = await response.json();
      return responseJson;
  

} catch (error) {
  return message;
  
}
 
}

export const Subjectdata=async(classid)=>
{
  try {
  const response = await fetch(BaseAPI+'master/'+classid+'?ddID=subject') ;
  const responseJson = await response.json(responseJson);
      console.log('subjectdata'+JSON.stringify())
      return responseJson;
    } catch (error) {

      return message;
      
    }
     

}

export const savedailyactivity=async (data)=>
{

  try {
   console.log(data)
    const response=await fetch(BaseAPI+'homeworkedit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'dataType': 'json'
      },
      body: JSON.stringify(data),
    });
     const result=await response; 
     console.log('this is restult'+result)
    return result 
 }
 catch (e) {
   console.log(e)
  return message;
 }

    
   
}
export const DailyActivity=async(userid)=>
{
  console.log(BaseAPI+'dailyActivity?stud_id='+userid);
  try {
    const response = await fetch(BaseAPI+'dailyActivity?stud_id='+userid) ;
    const responseJson = await response.json();
        return responseJson;
      }
      catch (error) {
        return message;
      }
}


export const getdailyactivityedit=async(ayid,date,staffid)=>
{
  try {
    const response = await fetch(BaseAPI+'homework?'+'ayid='+ayid+'&dated='+date+'&staff_id='+staffid) ;
    const responseJson = await response.json();
    console.log("ddfdfdfddfdfdfdfdff"+JSON.stringify(responseJson));
        return responseJson;
        
      } catch (error) {
        return message;
}
 
} 

export const getdailyactivityeditstud=async(hwid,date,staffid,subid)=>
{
  try {
    const response = await fetch(BaseAPI+"homeworkedit?hwid=" + hwid+ "&dated="+date+"&staff_id="+staffid+ "&subjid="+subid) ;
    const responseJson = await response.json();
    console.log(responseJson)
        return responseJson;
        
      } catch (error) {
        return message;
}
 
} 
export const deletedailyactivity=async(staffid,hwid)=>
{
  console.log(staffid)
  console.log(hwid)
    
    try {
      // const response=await fetch('http://168.63.137.212/PPEC_API/api/'+'homework', {
        const response = await fetch(BaseAPI+"homeworkEdit?staffid=" + staffid + "&type='delete'&hwid=" + hwid,{
       //const response=await fetch(BaseAPI+'homeworkEdit/', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json; charset=utf-8',
           'dataType': 'json'
         },
       });
        const result=await response.json(); 
        console.log('this is restult'+result)
       return result 
    }
    catch (e) {
     return message;
     console.log(e)
    }
 
}   

export const savegallery=async(data)=>
  {
    
     
      try {
         const response=await fetch(BaseAPI+'add_gallery_api_', {
         // const response = await fetch(BaseAPI+"homeworkEdit?staffid=" + staffid + "&type=delete&hwid=" + hwid,{
         //const response=await fetch(BaseAPI+'homeworkEdit/', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json; charset=utf-8',
             'dataType': 'json'
           },
           body: JSON.stringify(data),
         });
          const result=await response.json(); 
          console.log('this is restult'+JSON.stringify(response))
         return result 
      }
      catch (e) {
       return message;
       console.log(e)
      }
    }

export const postnotification=async(data)=>
{  
  try {
    const response=await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'dataType': 'json'
    },
    body: JSON.stringify(data),
    });
    const result=await response.json(); 
    console.log('this is restult'+result);
    return result ;
  }
  catch (e) {
    console.log(e);
    return message;
  }
}

//to insert token on login

export const tokeninsert=async(data)=>
{  
  try {
    const response=await fetch(BaseAPI+"TokenInsertion", {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'dataType': 'json'
    },
    body: JSON.stringify(data),
    });
    const result=await response.json(); 
    console.log('this is restult'+result);
    return result ;
  }
  catch (e) {
    console.log(e);
    return message;
  }
}


//delete from galary
export const deletegallery=async (id,t_id)=>

{
 
  try {
   
      const response = await fetch(BaseAPI+'gallery/delete/?id='+t_id+'&'+'t_id='+id);
        const responseJson = await response.json();
       return responseJson;
      }
      catch (e) {
      return message;
      }  
}


export const staffNoticedataapi=async (id)=>
{
  try {
      const response = await fetch(BaseAPI+`staffNoticeController/getNotice1?id=${id}&type="type"`);
        const responseJson = await response.json();

       return responseJson;
      }
      catch (e) {
      return message;
      }  
}


//for fee details
export const feedetails=async (userid)=>
{
     try {
        const response = await fetch(BaseAPI+'studTransaction?studid='+userid);
        const responseJson = await response.json();
      //  console.log('DDAta'+JSON.stringify(responseJson))
        return responseJson;
    }
    catch (e) {
        return message;
    }
}

//for eventdates

export const eventdates=async (userid)=>
{
     try {
        const response = await fetch(BaseAPI+'Event/all?id='+userid.substring(0, 7));
        const responseJson = await response.json();
        //console.log('DDAta'+JSON.stringify(responseJson))
        return responseJson;
    }
    catch (e) {
        return message;
    }
}

