var startstate={
    ispollupdated:false,
}
export default pollreducer=(state=startstate,action)=>{
    if(action.type=='newpolladded'){
        var obj={
            ispollupdated:action.data,
        }
        return obj
    }else{
        return state
    }
}