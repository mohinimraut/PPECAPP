var startstate={
    isnoticeupdated:false,
    currenttab: "student",
  option: "Class"
}
export default noticereducer=(state=startstate,action)=>{
    if(action.type=='newnoticeadded'){
        var obj={
            currenttab: state.currenttab,
            isnoticeupdated:true,
            option:state.option
        }
        return obj
    }else if(action.type=='noticerefreshed'){
        var obj={
            currenttab: state.currenttab,
            isnoticeupdated:false,
            option:state.option
        }
        return obj
    }else if (action.type == "noticetabchanged") {
        var obj = {
          currenttab: action.data,
          isnoticeupdated: false,
          option:state.option
        };
    
        return obj;
      } else if (action.type == "noticeoptionchanged") {
        var obj = {
          currenttab: state.currenttab,
          isnoticeupdated: false,
          option:action.data
    
    
        };
        return obj;
    }else{
        return state;
    }
}