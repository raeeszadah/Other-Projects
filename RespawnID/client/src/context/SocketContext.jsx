import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket/socket";
import { useProfile } from "./ProfileContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { profile, loading } = useProfile();

  useEffect(() => {
    if (loading) return;

    if (!profile?.id) {
      socket.disconnect();
      return;
    }

    const join = () => {
      socket.emit("join", profile.id);
    };

    socket.connect();
    join();

    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
      socket.disconnect();
    };
  }, [profile?.id, loading]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}