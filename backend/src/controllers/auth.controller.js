import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        console.log("Fullname: "+fullname+", Email: "+email+", Password: "+password);
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // hash password
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const user = await User.findOne({ email });
        if (user) return res.send(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            //generate JWT token
            generateToken(newUser.id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
                fullname: newUser.fullname,
                email: newUser.email,
                prfile: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid Credentials: Email not found" });

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword)
            return res.status(400).json({ message: "Invalid credential: Password" });

        console.log("CP2, isPassword: ", isPassword)

        generateToken(user._id, res);
        console.log("CP3, token generated")
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller: ", error);
        return res.status(500).json({ message: "Login Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 }); // setting maxAge 0
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Logout Controller Error: ", error);
        return res.status(500).json({ message: "Logout Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic)
            return res.status(400).json({ message: "Profile picture is required" });

        const uploadResponse = await cloudinary.upoader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller: ", error);
        return res.status(500).json({ message: "Update Profile Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error);
        return res.status(500).json({ message: "Check Auth Error" });
    }
}
