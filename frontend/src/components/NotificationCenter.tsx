import React, { useEffect, useRef, useState } from "react";
import { useNotification } from "./NotificationContext";
import { useVoiceFeedback } from "./useVoiceFeedback";
import "./NotificationCenter.css";

interface GroupedNotifications {
  [type: string]: Notification[];
}

const NotificationCenter: React.FC = () => {
  const { notifications, dismiss, pin, unpin, pinnedNotifications } = useNotification();
  const [activeTab, setActiveTab] = useState<"all" | "success" | "error" | "info" | "pinned">("all");
  const [showHistory, setShowHistory] = useState(false);
  const { speakIfCritical } = useVoiceFeedback();
  const timers = useRef<Record<number, NodeJS.Timeout>>({});

  useEffect(() => {
    notifications.forEach((n) => {
      speakIfCritical(n);
      if (!n.pinned && !timers.current[n.id]) {
        timers.current[n.id] = setTimeout(() => dismiss(n.id), 6000);
      }
    });

    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [notifications, dismiss, speakIfCritical]);

  const grouped = (): GroupedNotifications => {
    const group: GroupedNotifications = {};
    for (const n of notifications) {
      if (!group[n.type]) group[n.type] = [];
      group[n.type].push(n);
    }
    return group;
  };

  const filteredNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "pinned") return pinnedNotifications;
    return notifications.filter((n) => n.type === activeTab);
  };

  const togglePin = (id: number) => {
    const isPinned = pinnedNotifications.some((n) => n.id === id);
    isPinned ? unpin(id) : pin(id);
  };

  return (
    <div className="notification-center-wrapper">
      <div className="notification-tabs">
        {["all", "success", "error", "info", "pinned"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab.toUpperCase()}
          </button>
        ))}
        <button onClick={() => setShowHistory((prev) => !prev)} className="history-btn">
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      <div className="notification-list">
        {filteredNotifications().map((n) => (
          <div key={n.id} className={`notification-item ${n.type}`}>
            <div className="message">{n.message}</div>
            <div className="controls">
              <button onClick={() => togglePin(n.id)}>
                {pinnedNotifications.some((p) => p.id === n.id) ? "📌" : "📍"}
              </button>
              <button onClick={() => dismiss(n.id)}>✖</button>
            </div>
          </div>
        ))}

        {filteredNotifications().length === 0 && (
          <div className="no-notifications">No notifications available.</div>
        )}
      </div>

      {showHistory && (
        <div className="notification-history">
          <h3>Notification Archive</h3>
          <ul>
            {(JSON.parse(localStorage.getItem("notification_archive") || "[]") as Notification[]).map((h) => (
              <li key={h.id}>
                <strong>{h.type.toUpperCase()}:</strong> {h.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
