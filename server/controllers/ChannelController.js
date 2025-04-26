import mongoose from "mongoose";
import Channel from "../models/ChannelModals.js";
import User from "../models/UserModel.js";
import { populate } from "dotenv";

export const createChannel = async (request, response, next) => {
    try {
        const { name, members } = request.body;
        const userId = request.userId;
        console.log("userId:", request.userId);

        console.log("userId:", name);
        console.log(members);



        const admin = await User.findById(userId);
        console.log(admin);
        if (!admin) {
            return response.status(400).send("Admin user not found");
        }

        const validMembers = await User.find({ _id: { $in: members } });

        console.log(validMembers);

        if (validMembers.length !== members.length) {
            return response.status(400).send("Some are not valid users");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        console.log("newChannel", newChannel);

        await newChannel.save();
        console.log("hello");

        return response.status(201).json({ channel: newChannel });
    }
    catch (error) {
        console.log(error); // Fixed the typo here
        return response.status(500).send("Internal Server Error");
    }
};

export const getUserChannels = async (request, response, next) => {

    try {
        const userId = new mongoose.Types.ObjectId(request.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });

        return response.status(201).json({ channels }); // Corrected this line to return the fetched channels
    }
    catch (error) {
        console.log(error); // Fixed the typo here
        return response.status(500).send("Internal Server Error");
    }
};



export const getChannelMessages = async (request, response, next) => {

    try {

        const { channelId } = request.params;
        console.log("hello ", channelId);

        const channel = await Channel.findById(channelId).populate({
            path: "messages", populate: {
                path: "sender", select: "firstName lastName email _id image color"
            },
        }).exec();

        if (!channel) {
            return response.status(404).send("channel not found");
        }

        const messages = channel.messages;
        return response.status(201).json({ messages }); // Corrected this line to return the fetched channels
    }
    catch (error) {
        console.log(error); // Fixed the typo here
        return response.status(500).send("Internal Server Error");
    }
};
