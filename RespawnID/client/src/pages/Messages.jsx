import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useProfile } from "../context/ProfileContext";
import { useSocket } from "../context/SocketContext";
import {
  fetchConversations,
  fetchMessages,
} from "../services/messageApi";
import { searchUsers } from "../services/userApi";
import ProfileAvatar from "../components/ProfileAvatar";

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatMessageTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function ConversationItem({ conversation, active, onSelect }) {
  const { user, lastMessage, unreadCount } = conversation;
  const isMine =
    lastMessage?.sender?.toString?.() === conversation.myId;

  return (
    <button
      type="button"
      onClick={() => onSelect(user._id)}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
        active
          ? "bg-white/10"
          : "hover:bg-white/5"
      }`}
    >
      <ProfileAvatar name={user.username} avatar={user.avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">@{user.username}</p>
          {lastMessage && (
            <span className="shrink-0 text-[10px] text-white/35">
              {formatTime(lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-white/45">
            {lastMessage
              ? `${isMine ? "You: " : ""}${lastMessage.content}`
              : "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#FF1E3C] px-1.5 text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function SearchResultItem({ user, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user._id)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
    >
      <ProfileAvatar name={user.username} avatar={user.avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">@{user.username}</p>
        <p className="truncate font-mono text-[10px] text-white/35">{user._id}</p>
      </div>
    </button>
  );
}

function Messages() {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const socket = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState(paramUserId || null);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const myId = profile?.id?.toString();

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(
        data.map((c) => ({ ...c, myId }))
      );
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setLoadingList(false);
    }
  }, [myId]);

  const loadThread = useCallback(
    async (userId) => {
      if (!userId) return;
      setLoadingChat(true);
      try {
        const data = await fetchMessages(userId);
        setActiveUser(data.user);
        setMessages(data.messages || []);
        setConversations((prev) => {
          const exists = prev.some(
            (c) => c.user._id.toString() === userId.toString()
          );
          const updated = prev.map((c) =>
            c.user._id.toString() === userId.toString()
              ? { ...c, unreadCount: 0 }
              : c
          );
          if (exists) return updated;
          return [
            {
              user: data.user,
              lastMessage: data.messages?.[data.messages.length - 1] || null,
              unreadCount: 0,
              myId,
            },
            ...updated,
          ];
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load messages"
        );
        navigate("/messages", { replace: true });
      } finally {
        setLoadingChat(false);
      }
    },
    [navigate, myId]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
        setSearchOpen(true);
      } catch {
        toast.error("Search failed");
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (paramUserId) {
      setActiveUserId(paramUserId);
    }
  }, [paramUserId]);

  useEffect(() => {
    if (activeUserId) {
      loadThread(activeUserId);
    } else {
      setActiveUser(null);
      setMessages([]);
    }
  }, [activeUserId, loadThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !myId) return;

    const handleNewMessage = (message) => {
      const senderId = message.sender._id?.toString?.() || message.sender.toString();
      const receiverId =
        message.receiver._id?.toString?.() || message.receiver.toString();

      const partnerId = senderId === myId ? receiverId : senderId;

      setConversations((prev) => {
        const existing = prev.find(
          (c) => c.user._id.toString() === partnerId
        );

        const partnerUser =
          senderId === myId ? message.receiver : message.sender;

        const entry = {
          user: {
            _id: partnerUser._id,
            username: partnerUser.username,
            avatar: partnerUser.avatar,
          },
          lastMessage: {
            _id: message._id,
            content: message.content,
            createdAt: message.createdAt,
            sender: message.sender._id || message.sender,
          },
          unreadCount:
            receiverId === myId && activeUserId !== partnerId
              ? (existing?.unreadCount || 0) + 1
              : existing?.unreadCount || 0,
          myId,
        };

        const rest = prev.filter(
          (c) => c.user._id.toString() !== partnerId
        );
        return [entry, ...rest];
      });

      if (activeUserId === partnerId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, myId, activeUserId]);

  const selectConversation = (userId) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    setActiveUserId(userId);
    navigate(`/messages/${userId}`);
  };

  const handleBack = () => {
    setActiveUserId(null);
    setActiveUser(null);
    setMessages([]);
    navigate("/messages");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !activeUserId || sending) return;

    setSending(true);
    setInput("");

    try {
      socket?.emit("send_message", {
        receiverId: activeUserId,
        content: text,
      });
    } catch {
      toast.error("Failed to send message");
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const showList = !activeUserId;
  const showChat = Boolean(activeUserId);

  return (
    <div className="glass-card flex h-[calc(100dvh-11rem)] min-h-[420px] overflow-hidden rounded-3xl border border-white/10">
      {/* Conversation list */}
      <aside
        className={`flex w-full flex-col border-white/10 lg:w-80 lg:shrink-0 lg:border-r ${
          showList ? "flex" : "hidden lg:flex"
        }`}
      >
        <div className="border-b border-white/10 px-4 py-4">
          <h1 className="font-display text-lg font-bold">Messages</h1>
          <p className="mt-0.5 text-xs text-white/40">
            Search by user ID or username to start chatting
          </p>
          <div className="relative mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              placeholder="Search user ID or username..."
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#FF1E3C]/40"
            />
            {searching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/35">
                ...
              </span>
            )}
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-xl">
                {searchResults.length === 0 && !searching ? (
                  <p className="px-4 py-3 text-xs text-white/40">No users found</p>
                ) : (
                  searchResults.map((user) => (
                    <SearchResultItem
                      key={user._id}
                      user={user}
                      onSelect={selectConversation}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <p className="px-4 py-8 text-center text-sm text-white/40">
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-white/50">No conversations yet</p>
              <p className="mt-1 text-xs text-white/35">
                Search for a user ID above to start chatting
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.user._id}
                conversation={conversation}
                active={
                  activeUserId === conversation.user._id.toString()
                }
                onSelect={selectConversation}
              />
            ))
          )}
        </div>
      </aside>

      {/* Chat panel */}
      <section
        className={`flex min-w-0 flex-1 flex-col ${
          showChat ? "flex" : "hidden lg:flex"
        }`}
      >
        {!activeUserId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-8 w-8 text-white/30"
              >
                <path
                  d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-white/70">
              Your messages
            </p>
            <p className="max-w-xs text-sm text-white/40">
              Select a conversation or search for a user ID to message them
            </p>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Back to conversations"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {activeUser && (
                <>
                  <ProfileAvatar
                    name={activeUser.username}
                    avatar={activeUser.avatar}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/profile/${activeUser.username}`}
                      className="truncate text-sm font-semibold hover:text-[#FF1E3C]"
                    >
                      @{activeUser.username}
                    </Link>
                  </div>
                </>
              )}
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {loadingChat ? (
                <p className="text-center text-sm text-white/40">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <ProfileAvatar
                    name={activeUser?.username}
                    avatar={activeUser?.avatar}
                    size="sm"
                  />
                  <p className="text-sm font-semibold">
                    @{activeUser?.username}
                  </p>
                  <p className="text-xs text-white/40">
                    Start the conversation. Say hello!
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {messages.map((message) => {
                    const senderId =
                      message.sender._id?.toString?.() ||
                      message.sender.toString();
                    const isMine = senderId === myId;

                    return (
                      <li
                        key={message._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isMine
                              ? "rounded-br-md bg-gradient-to-r from-[#FF1E3C] to-[#B3001B] text-white"
                              : "rounded-bl-md border border-white/10 bg-white/5 text-white/90"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm">
                            {message.content}
                          </p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isMine ? "text-white/70" : "text-white/35"
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                  <li ref={messagesEndRef} />
                </ul>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-white/10 p-4"
            >
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message..."
                  maxLength={2000}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="rounded-full bg-[#FF1E3C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B3001B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default Messages;
