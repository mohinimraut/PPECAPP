'use strict'
import React, { Component } from 'react';
import {  createDrawerNavigator,createStackNavigator } from 'react-navigation';
import Home from '../home/Home';
import Profile from '../student/Profile';
import Attendance from '../student/Attendance';
import DailyActivity from '../student/DailyActivity';
import Fees from '../student/Fees';
import Gallery from '../student/Gallery';
import News from '../student/News';
import Notice from '../student/Notice';
import Poll from '../student/Poll';
import Admission from '../student/Admission';
import StaffAttendacne from '../staff/StaffAttedance';
import StaffDailyActivity from '../staff/StaffDailyActivity';
import StaffGallery from '../staff/StaffGallery';
import StaffPoll from '../staff/StaffPoll';
import StaffProfile from '../staff/StaffProfile';
import StaffNews from '../staff/StaffNews';
import StaffNotice from '../staff/StaffNotice';
import contactus from '../staff/Contactus';
import DrawerScreen from '../staff/DrawerScreen';
import AddAccount from '../staff/AddAccount';
import ChangePassword from '../staff/ChangePassword';
import Events from '../staff/Events';
import SwitchAccount from '../staff/SwitchAccount';

const StackScreen = createStackNavigator({
Home: {screen: Home},
  Profile: {screen: Profile},
  Attendance:{screen:Attendance},
  DailyActivity:{screen:DailyActivity },
  Fees:{screen:Fees},
  Gallery:{screen:Gallery},
  News:{screen:News},
  Notice:{screen:Notice},
  Poll:{screen:Poll},
  Admission:{screen:Admission},
  StaffAttendacne:{screen:StaffAttendacne},
  StaffDailyActivity:{screen:StaffDailyActivity},
  StaffGallery:{screen:StaffGallery},
  StaffPoll:{screen:StaffPoll},
  StaffProfile:{screen:StaffProfile},
  contactus:{screen:contactus},
  StaffNews:{screen:StaffNews},
  StaffNotice:{screen:StaffNotice},
  AddAccount:{screen:AddAccount},
  ChangePassword:{screen:ChangePassword},
  Events:{screen:Events},
  SwitchAccountnew:{screen:SwitchAccount},
},
{
initialRouteName: 'Home',
headerMode:'none',
});
const LoggedInNavigator = createDrawerNavigator({
  Home: {
    screen: StackScreen
  },
},
{
  headerMode:'none',
  contentComponent: props => <DrawerScreen {...props} />,
  drawerPosition: 'left',
  drawerWidth: 310,
  drawerOpenRoute: 'DrawerOpen',
}
)
  export default LoggedInNavigator