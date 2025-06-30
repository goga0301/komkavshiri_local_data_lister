import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { v4 as uuidv4 } from "uuid";

export type NotificationType = "info" | "success" | "error" | "warning" | "system" | "debug";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
  timestamp: number;
  autoDismiss: boolean;
  meta?: Record<string, any>;
  priority: number;
  actions?: NotificationAction[];
  visible: boolean;
}

export interface NotificationAction {
  label: string;
  callback: () => void;
  style?: "primary" | "secondary";
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type?: NotificationType, options?: Partial<Notification>) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
  pauseDismiss: (id: string) => void;
  resumeDismiss: (id: string) => void;
  triggerAction: (id: string, index: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface State {
  notifications: Notification[];
  pausedTimers: Record<string, number>;
}

const initialState: State = {
  notifications: [],
  pausedTimers: {},
};

type Action =
  | { type: "ADD"; payload: Notification }
  | { type: "DISMISS"; payload: string }
  | { type: "SET_VISIBLE"; payload: { id: string; visible: boolean } }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "DISMISS":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case "SET_VISIBLE":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload.id ? { ...n, visible: action.payload.visible } : n
        ),
      };
    case "CLEAR":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const notify = useCallback((
    message: string,
    type: NotificationType = "info",
    options: Partial<Notification> = {}
  ): string => {
    const id = uuidv4();
    const notification: Notification = {
      id,
      message,
      type,
      duration: options.duration ?? 6000,
      timestamp: Date.now(),
      autoDismiss: options.autoDismiss !== false,
      meta: options.meta || {},
      priority: options.priority ?? 1,
      actions: options.actions || [],
      visible: true,
    };

    dispatch({ type: "ADD", payload: notification });

    if (notification.autoDismiss) {
      timeoutRefs.current[id] = setTimeout(() => {
        dispatch({ type: "SET_VISIBLE", payload: { id, visible: false } });
        setTimeout(() => dispatch({ type: "DISMISS", payload: id }), 300);
      }, notification.duration);
    }

    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    dispatch({ type: "SET_VISIBLE", payload: { id, visible: false } });
    setTimeout(() => dispatch({ type: "DISMISS", payload: id }), 300);
  }, []);

  const clearAll = useCallback(() => {
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
    dispatch({ type: "CLEAR" });
  }, []);

  const pauseDismiss = useCallback((id: string) => {
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  const resumeDismiss = useCallback((id: string) => {
    const notification = state.notifications.find((n) => n.id === id);
    if (notification && notification.autoDismiss) {
      timeoutRefs.current[id] = setTimeout(() => {
        dispatch({ type: "SET_VISIBLE", payload: { id, visible: false } });
        setTimeout(() => dispatch({ type: "DISMISS", payload: id }), 300);
      }, notification.duration);
    }
  }, [state.notifications]);

  const triggerAction = useCallback((id: string, index: number) => {
    const n = state.notifications.find((n) => n.id === id);
    if (n && n.actions && n.actions[index]) {
      n.actions[index].callback();
    }
  }, [state.notifications]);

  const sortedNotifications = useMemo(() => {
    return [...state.notifications].sort((a, b) => b.priority - a.priority);
  }, [state.notifications]);

  const value = useMemo(() => ({
    notifications: sortedNotifications,
    notify,
    dismiss,
    clearAll,
    pauseDismiss,
    resumeDismiss,
    triggerAction,
  }), [sortedNotifications, notify, dismiss, clearAll, pauseDismiss, resumeDismiss, triggerAction]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return ctx;
};
