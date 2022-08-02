
// import { getRootNavigator } from './src/navigator/Index';
// import { createAppContainer } from 'react-navigation';

// const RootNavigator = getRootNavigator(false);

// const App=createAppContainer(RootNavigator);
// export default App;
import React from "react";
import { getRootNavigator } from './src/navigator/Index';
import { createAppContainer } from 'react-navigation';
const RootNavigator = getRootNavigator(false);
const App=createAppContainer(RootNavigator);
import {Provider} from 'react-redux' 
import store from './src//Redux/store';
export default class Apps extends React.Component{
render (){

return(
    <Provider store={store}>
            <App></App>
    </Provider>   
)

}




}


 
