import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  // Fetch existing notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch {}
  };

  // Mark as read
  const markAsRead = async (ids = 'all') => {
    try {
      await API.patch('/notifications/read', { ids });
      if (ids === 'all') {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      } else {
        setNotifications((prev) =>
          prev.map((n) => (ids.includes(n._id) ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - ids.length));
      }
    } catch {}
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      socketRef.current?.disconnect();
      return;
    }

    fetchNotifications();

    // Connect socket
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register', user._id);
    });

    socket.on('notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(notif.title, {
        icon: '🔔',
        style: { borderLeft: '4px solid #f97316', fontFamily: 'Plus Jakarta Sans' },
      });
    });

    return () => socket.disconnect();
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
