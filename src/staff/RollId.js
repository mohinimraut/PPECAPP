import React from 'react';
import {View ,Text,FlatList} from 'react-native';
import { login,LoadProfileData ,LoadStaffProfileData,tokeninsert} from '../api/index';

import { SQLite,  } from 'expo-sqlite';

const db = SQLite.openDatabase('EDUDUNIYA.db');
export default class RollId extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tbllogin', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });

    db.transaction(tx => {
        tx.executeSql('SELECT * FROM tblRole', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            FlatListItems: temp,
          });
        });
      });
  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };
  render() {
    return (
      <View>
        <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.user_id} style={{ backgroundColor: 'blue', padding: 20 }}>
              <Text style={{color:'white'}}>Id: {item.userid}</Text>
              <Text style={{color:'white'}}>Name: {item.username}</Text>           
            </View>
          )}
        />        
      </View>
    );
  }
}