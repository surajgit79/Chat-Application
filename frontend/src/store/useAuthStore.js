import { create } from "zustand";
import { axiosInst } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { signInWithGoogle } from "../lib/firebase";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningup: false,
    isLoggingin: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    isSocketConnecting: false,
    checkAuth: async () => {
        try {
            const res = await axiosInst.get("/auth/check");
            if (res.data) {
                set({ authUser: res.data });
                get().connectSocket();
            }
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningup: true })
        try {
            const res = await axiosInst.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data });
            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningup: false });
        }
    },

    login: async (data) => {
        set({ isLoggingin: true });
        try {
            const res = await axiosInst.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged In Successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            set({ isLoggingin: false });
        }
    },

    loginWithGoogle: async () => {
        try {
            const result = await signInWithGoogle();
            const { user } = result;

            const res = await axiosInst.post("/auth/google", {
                email: user.email,
                fullname: user.displayName,
                profilePic: user.photoURL
            });

            set({ authUser: res.data });
            toast.success("Logged In Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Google login failed");
        }
    },

    logout: async () => {
        try {
            await axiosInst.post("/auth/logout");
            get().socket?.disconnect();
            set({ authUser: null, socket: null, isSocketConnecting: false });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInst.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket, isSocketConnecting } = get();
        if (!authUser || socket || isSocketConnecting) return;

        set({ isSocketConnecting: true });

        const newSocket = io(BASE_URL, {
            query: { userId: authUser._id },
            reconnection: false
        });

        newSocket.on("connect", () => {
            set({ socket: newSocket, isSocketConnecting: false });
        });

        newSocket.on("connect_error", () => {
            set({ isSocketConnecting: false });
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        });
    },

    disConnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}));

