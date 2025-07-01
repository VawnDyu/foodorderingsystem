const https = require('https');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const menuRoutes = require('./routes/MenuRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const orderRoutesSocket = require('./routes/OrderRoutesSocket'); // Import the socket routes
const cashierRoutes = require('./routes/CashierRoutes');
const chefRoutes = require('./routes/ChefRoutes');
const uploadRoute = require('./routes/upload');

dotenv.config();
const app = express();

// 🔐 SSL Credentials
const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// ✅ Create HTTPS server with credentials
const server = https.createServer(credentials, app);

// ✅ Attach Socket.IO to this HTTPS server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// CustomerId to SocketId mapping
const customerSockets = {}; // This stores the mapping of customerId to socketId
const cashierSockets = {};  // cashierId -> socket.id
const chefSockets = {}; //chefId -> socket.id
const adminSockets = {}; //adminId -> socket.id

const orderRoutes = require('./routes/OrderRoutes')(io, cashierSockets);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Register the customer socket using their customerId
  socket.on('register-customer', (customerId) => {
    console.log('Customer registered:', customerId);
    customerSockets[customerId] = socket.id;  // Map customer ID to their socket ID
    console.log(customerSockets);
  });

    // Register cashier
  socket.on('register-cashier', (cashierId) => {
    console.log('Cashier registered:', cashierId);
    cashierSockets[cashierId] = socket.id;
    console.log('Cashier Sockets:', cashierSockets);
  });

  //Register chef
  socket.on(`register-chef` , (chefId) => {
    console.log('Chef registered:', chefId);
    chefSockets[chefId] = socket.id;
    console.log('Chef Sockets:', chefSockets);
  })

  //Register admin
  socket.on(`register-admin` , (adminId) => {
    console.log('Admin registered:', adminId);
    adminSockets[adminId] = socket.id;
    console.log('Admin Sockets:', adminSockets);
  })

  // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Helper function to remove socket ID from a group
      const removeFromGroup = (group, label) => {
        for (let id in group) {
          if (group[id] === socket.id) {
            console.log(`Removing ${label} ${id} from the mapping`);
            delete group[id];
            break;
          }
        }
      };

      removeFromGroup(customerSockets, 'customer');
      removeFromGroup(cashierSockets, 'cashier');
      removeFromGroup(chefSockets, 'chef');
      removeFromGroup(adminSockets, 'admin');
    });
});

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: [process.env.CLIENT_ORIGIN],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cashier/socket-orders/', orderRoutesSocket(io, customerSockets));
app.use('/api/cashier', cashierRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api', uploadRoute);

// MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('🍔 Food Ordering System API is live!');
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// ✅ Start the correct server
server.listen(PORT, () => {
  console.log(`🚀 Server running on https://${HOST}:${PORT}`);
});
