import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquare, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { mergeSort } from "../lib/utils";
import { axiosInst } from "../lib/axios";

const naiveSearch = (text, pattern) =>
    text.toLowerCase().includes(pattern.toLowerCase());

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { authUser, onlineUsers } = useAuthStore();
    const [globalSearch, setGlobalSearch] = useState("");
    const [searchedMessages, setSearchedMessages] = useState([]);

    useEffect(() => {
        getUsers()
    }, [getUsers])

    useEffect(() => {
        const socket = useAuthStore.getState().socket;

        socket?.on("userRegistered", () => {
            getUsers();
        });

        return () => {
            socket?.off("userRegistered");
        }
    }, [getUsers]);

    useEffect(() => {
        const fetchAllMessages = async () => {
            if (!globalSearch.trim()) {
                setSearchedMessages([]);
                return;
            }
            const allMessages = [];
            for (const user of users) {
                if (user._id === authUser?._id) continue;
                try {
                    const res = await axiosInst.get(`/messages/${user._id}`);
                    const msgsWithUser = res.data.map(msg => ({
                        ...msg,
                        userName: user.fullname,
                        userProfilePic: user.profilePic
                    }));
                    allMessages.push(...msgsWithUser);
                } catch { /* ignore errors */ }
            }
            const filtered = allMessages.filter(msg => 
                naiveSearch(msg.message || "", globalSearch)
            );
            setSearchedMessages(mergeSort(filtered, "createdAt").reverse());
        };
        fetchAllMessages();
    }, [globalSearch, users, authUser]);

    const filteredUsers = useMemo(() => {
        let result = users.filter((user) => user._id !== authUser?._id);
        if (globalSearch.trim()) {
            result = result.filter(user => 
                naiveSearch(user.fullname || "", globalSearch)
            );
        }
        return result;
    }, [users, authUser, globalSearch]);

    const handleMessageClick = (msg) => {
        const user = users.find(u => u._id === msg.senderId || u._id === msg.receiverId);
        if (user) {
            setSelectedUser(user);
        }
        setGlobalSearch("");
    };

    if (isUsersLoading) return <SidebarSkeleton />
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                <div className="mt-3 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search users or messages..."
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        className="input input-sm input-bordered w-full pl-9"
                    />
                </div>

            </div>

            {globalSearch.trim() ? (
                <div className="flex-1 overflow-y-auto">
                    <div className="text-xs font-medium text-zinc-500 px-4 py-2 uppercase">Users</div>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <button
                                key={user._id}
                                onClick={() => { setSelectedUser(user); setGlobalSearch(""); }}
                                className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
                            >
                                <img
                                    src={user.profilePic || "/avatar.png"}
                                    alt={user.fullname}
                                    className="size-10 object-cover rounded-full"
                                />
                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{user.fullname}</div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-zinc-500 py-2 text-sm">No users found</div>
                    )}

                    <div className="text-xs font-medium text-zinc-500 px-4 py-2 uppercase mt-2">Messages</div>
                    {searchedMessages.length > 0 ? (
                        searchedMessages.slice(0, 10).map((msg) => (
                            <button
                                key={msg._id}
                                onClick={() => handleMessageClick(msg)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors text-left"
                            >
                                <MessageSquare className="size-8 p-1 bg-base-300 rounded-full" />
                                <div className="hidden lg:block min-w-0">
                                    <div className="text-xs text-zinc-400">{msg.userName}</div>
                                    <div className="truncate text-sm">{msg.message}</div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-zinc-500 py-2 text-sm">No messages found</div>
                    )}
                </div>
            ) : (
                <div className="overflow-y-auto w-full py-3">
                    {filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""} `}
                        >
                            <div className="relative mx-auto lg:mx-0">
                                <img
                                    src={user.profilePic || "/avatar.png"}
                                    alt={user.name}
                                    className="size-12 object-cover rounded-full"
                                />
                                {onlineUsers.includes(user._id?.toString()) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full"></span>
                                )}
                            </div>

                            {/* User info - only visible on larger screens */}
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullname}</div>
                                <div className="text-xs text-zinc-400">
                                    {onlineUsers.includes(user._id?.toString()) ? "Online" : "Offline"}
                                </div>
                            </div>
                        </button>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="text-center text-zinc-500 py-4">No online users</div>
                    )}
                </div>
            )}

        </aside>
    );
};

export default Sidebar;