import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        const lastMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$senderId", loggedInUserId] },
                            then: "$receiverId",
                            else: "$senderId"
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        const usersWithLastMEssage = users.map(user => {
            const lastMsg = lastMessages.find(m => m._id.toString() === user._id.toString());
            return { ...user.toObject(), lastMessage: lastMsg?.lastMessage };
        });

        usersWithLastMEssage.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });
        res.status(200).json(usersWithLastMEssage);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller: ", error);
        return res.status(500).json({ message: "Get Users For Sidebar Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error);
        return res.status(500).json({ message: "Get Messages Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResposne = await cloudinary.uploader.upload(image);
            imageUrl = uploadResposne.secure_url;
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: userToChatId,
            message: text,
            image: imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(userToChatId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        return res.status(500).json({ message: "Send Message Error" });
    }
};