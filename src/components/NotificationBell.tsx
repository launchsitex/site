import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface Notification {
  id: number;
  full_name: string;
  created_at: string;
  read: boolean;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications();

    // Subscribe to new contact form submissions
    const channel = supabase
      .channel('contact_forms_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_forms'
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            full_name: payload.new.full_name,
            created_at: payload.new.created_at,
            read: false
          };
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('contact_forms')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    const notifications = data.map(item => ({
      ...item,
      read: true // Mark existing notifications as read initially
    }));

    setNotifications(notifications);
    setUnreadCount(0);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: he });
  };

  const scrollToForm = (id: number) => {
    markAsRead(id);
    setIsOpen(false);
    
    // Find and scroll to the form row
    const formRow = document.getElementById(`form-${id}`);
    if (formRow) {
      formRow.scrollIntoView({ behavior: 'smooth' });
      formRow.classList.add('highlight-row');
      setTimeout(() => formRow.classList.remove('highlight-row'), 2000);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary-light rounded-full transition-colors"
      >
        <Bell size={24} className="text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-secondary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-secondary-light border border-gray-800 rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-bold">התראות</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                אין התראות חדשות
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => scrollToForm(notification.id)}
                  className={`p-4 border-b border-gray-800 cursor-pointer transition-colors hover:bg-secondary/50 ${
                    !notification.read ? 'bg-secondary/30' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{notification.full_name}</span>
                    <span className="text-sm text-gray-400">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    פנייה חדשה התקבלה
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;