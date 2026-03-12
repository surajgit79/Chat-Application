import { create } from "zustand";
import { axiosInst } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningup: false,
    isLoggingin: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInst.get("/auth/check");
            if (res.data) {
                set({ authUser: res.data, isCheckingAuth: false });
            }
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningup: true})
        try {
            const res = await axiosInst.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({authUser: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningup: false});
        }
    },

    login: async(data) => {
        set ({isLoggingin: true});
        try {
            const res = await axiosInst.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged In Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingin: false});
        }
    },

    logout: async() =>{
        try {
            await axiosInst.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");   
        }
    },

    updateProfile: async(data) => {
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
}));
