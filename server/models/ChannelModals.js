import mongoose from "mongoose";

// Define the schema
const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }],
        admin: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }], // No need for required here
    },
    {
        timestamps: true, // Mongoose automatically handles `createdAt` and `updatedAt`
    }
);

// Create the model
const Channel = mongoose.model("Channels", channelSchema);

export default Channel;
