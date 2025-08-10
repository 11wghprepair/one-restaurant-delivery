require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const razorpayWebhook = require('./razorpayWebhook');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

// simple health
app.get('/health', (req, res) => res.json({ ok: true }));

// attach io to app locals for routes to use if needed
app.set('io', io);

app.use('/menu', menuRoutes);
app.use('/orders', ordersRoutes);
app.post('/webhook/razorpay', bodyParser.raw({ type: '*/*' }), razorpayWebhook);

// sockets
const sockets = require('./sockets');
sockets(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('API listening on', PORT));
