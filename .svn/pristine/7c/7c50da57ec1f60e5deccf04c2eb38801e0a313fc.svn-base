import { createSwitchNavigator } from 'react-navigation'

import LoggedOutNavigator from './Logout'
import LoggedInNavigator from './Login'

export const getRootNavigator = (loggedIn = false) => createSwitchNavigator(
  {
    LoggedOut: {
      screen: LoggedOutNavigator
    },
    LoggedIn: {
      screen: LoggedInNavigator
    }
  },
  {
    initialRouteName: loggedIn ? 'LoggedIn' : 'LoggedOut',
    headerMode:'none'
  }
);