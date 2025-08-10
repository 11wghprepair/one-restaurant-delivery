import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { fetchMenu } from '../services/api';

export default function MenuScreen({ navigation }) {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchMenu().then(d => setItems(d.items)); }, []);
  return (
    <View style={{flex:1,padding:16}}>
      <FlatList data={items} keyExtractor={i => String(i.id)} renderItem={({item}) => (
        <View style={{padding:8,borderBottomWidth:1}}>
          <Text style={{fontSize:16}}>{item.name} — ₹{item.price}</Text>
          <Button title="Add" onPress={() => {/* add to cart (left as exercise) */}} />
        </View>
      )} />
      <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
}
