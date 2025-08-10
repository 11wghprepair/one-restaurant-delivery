import React, {useEffect} from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import io from 'socket.io-client';

const API = 'http://10.0.2.2:4000';
const socket = io(API);

export default function App() {
  useEffect(() => {
    let sub;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 5000, distanceInterval: 5 }, (loc) => {
        const { latitude, longitude } = loc.coords;
        // send location for orderId '1' (demo)
        socket.emit('agentLocation', { orderId: 1, lat: latitude, lng: longitude });
      });
    })();
    return () => sub && sub.remove();
  }, []);

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>Agent app running. Location streaming to server for demo order `1`.</Text>
    </View>
  );
}
