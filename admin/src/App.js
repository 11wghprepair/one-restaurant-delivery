import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API='http://localhost:4000';
const socket = io(API);

function App(){
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    // fetch orders
    fetch(API + '/orders').then(r=>r.json()).then(data=>setOrders(data || []));
    socket.on('connect', ()=>console.log('admin socket connected'));
    socket.on('orderCreated', (o)=> setOrders(prev => [o, ...prev]));
  }, []);

  return (
    <div style={{padding:20}}>
      <h1>Admin - Orders</h1>
      {orders.map(o => (
        <div key={o.id} style={{border:'1px solid #ccc',padding:10,margin:10}}>
          <div>Order #{o.id} — ₹{o.total_amount} — {o.status}</div>
          <button onClick={() => fetch(API+`/orders/${o.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'PREPARING'})})}>Mark Preparing</button>
        </div>
      ))}
    </div>
  );
}

export default App;
