import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import http from 'http'; // ✅ Needed for Socket.IO
import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from './routes/ContactsRoutes.js';
import setupSocket from './socket.js'; // ✅ Your socket setup
import messagesRoutes from './routes/MessagesRoutes.js'
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/channel', channelRoutes);

// ✅ Call your socket setup here
setupSocket(server);

// ✅ Connect MongoDB
const port = process.env.PORT || 8085;
const databaseURL = process.env.DATABASE_URL;

mongoose.connect(databaseURL)
    .then(() => console.log("✅ DB connected"))
    .catch(err => console.log("❌ DB Error", err));

// ✅ Start the HTTP server
server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
