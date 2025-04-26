import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModal.js";
import Channel from "./models/ChannelModals.js"

const setupSocket = (server) => {

    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true,

        }
    });

    const userSocketsMap = new Map();


    const disconnect = (socket) => {

        console.log(`Client Disconnected :${socket.id}`);

        for (const [userId, socketId] of userSocketsMap.entries()) {
            if (socketId === socket.id) {
                userSocketsMap.delete(userId);
                break;
            }
        }
    }


    const sendMessage = async (message) => {

        const senderSocketId = userSocketsMap.get(message.sender);
        const recipientSocketId = userSocketsMap.get(message.recipient);

        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstname lastName image color")
            .populate("recipient", "id email firstname lastName image color");


        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    }

    const sendChannelMessage = async (message) => {

        const { channelId, sender, content, messageType, fileUrl } = message;

        const createdMessage = await Message.create({
            sender, recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl,
            channelId,
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        const channel = await Channel.findById(channelId).populate("members");

        const finalData = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((members) => {

                const memberSocketId = userSocketsMap.get(members._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finalData);
                }
            });

            const adminSocketId = userSocketsMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finalData);
            }
        }
    }

    io.on('connection', (socket) => {


        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketsMap.set(userId, socket.id);
            console.log(`User is connected : ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log(`User ID not provided during Connections`);
        }


        socket.on('sendMessage', sendMessage);
        socket.on('send-channel-message', sendChannelMessage);
        socket.on('disconnect', () => disconnect(socket))
    });


}


export default setupSocket;