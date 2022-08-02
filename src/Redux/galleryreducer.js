var startstate = {
  isgalleryupdated: false,
  currenttab: "add",
  option: "Class"
};
export default (galleryreducer = (state=startstate, action) => {
   console.log("redux state"+JSON.stringify(state),);
  if (action.type == "newgalleryadded") {
    var obj = {
      currenttab: state.currenttab,
      isgalleryupdated: true,
      option:state.option
    };
    return obj;
  } else if (action.type == "galleryrefreshed") {
    var obj = {
      currenttab: state.currenttab,
      isgalleryupdated: false,
      option:state.option
    };
   
    return obj;
  } else if (action.type == "tabchanged") {
    var obj = {
      currenttab: action.data,
      isgalleryupdated: false,
      option:state.option
    };

    return obj;
  } else if (action.type == "optionchanged") {
    var obj = {
      currenttab: state.currenttab,
      isgalleryupdated: false,
      option:action.data


    };
  
    return obj;
  } else {
    return startstate;
  }
});
