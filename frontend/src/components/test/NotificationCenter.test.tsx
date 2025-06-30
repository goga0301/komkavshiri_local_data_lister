import React, { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  NotificationProvider,
  useNotification,
  NotificationType,
} from "../../components/NotificationCenter/NotificationContext";


const TestComponent: React.FC<{ message: string; type?: NotificationType }> = ({
  message,
  type = "info",
}) => {
  const { notify, notifications, dismiss, clearAll } = useNotification();

  return (
    <div>
      <button onClick={() => notify(message, type)}>Notify</button>
      <button onClick={() => clearAll()}>Clear All</button>
      <div data-testid="notifications-count">{notifications.length}</div>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} data-testid={`notification-${n.id}`}>
            <span>{n.message}</span>
            <span>{n.type}</span>
            <button onClick={() => dismiss(n.id)}>Dismiss</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe("NotificationContext", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("throws error if useNotification used outside NotificationProvider", () => {
    const { result } = renderHook(() => useNotification());
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe(
      "useNotification must be used within a NotificationProvider"
    );
  });

  test("adds notifications and exposes them properly", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.notify("Test notification", "success");
    });

    expect(result.current.notifications.length).toBe(1);
    expect(result.current.notifications[0].message).toBe("Test notification");
    expect(result.current.notifications[0].type).toBe("success");
  });

  test("prevents immediate duplicate notifications within 3 seconds", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.notify("Duplicate test", "info");
      result.current.notify("Duplicate test", "info");
    });

    expect(result.current.notifications.length).toBe(1);


    act(() => {
      jest.advanceTimersByTime(3001);
      result.current.notify("Duplicate test", "info");
    });

    expect(result.current.notifications.length).toBe(2);
  });

  test("dismiss removes notification by id", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.notify("Dismiss test", "error");
    });
    const id = result.current.notifications[0].id;

    act(() => {
      result.current.dismiss(id);
    });

    expect(result.current.notifications.length).toBe(0);
  });

  test("clearAll empties all notifications", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.notify("Test 1");
      result.current.notify("Test 2");
    });
    expect(result.current.notifications.length).toBe(2);

    act(() => {
      result.current.clearAll();
    });
    expect(result.current.notifications.length).toBe(0);
  });

  test("notifications auto-dismiss after default duration", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.notify("Auto-dismiss test");
    });
    expect(result.current.notifications.length).toBe(1);


    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.notifications.length).toBe(0);
  });

  test("notifications respect custom duration and autoDismiss option", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.notify("No auto dismiss", "info", {
        autoDismiss: false,
      });
    });
    expect(result.current.notifications.length).toBe(1);


    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(result.current.notifications.length).toBe(1);


    act(() => {
      result.current.notify("Short dismiss", "success", {
        durationMs: 2000,
      });
    });
    expect(result.current.notifications.length).toBe(2);

    act(() => {
      jest.advanceTimersByTime(1999);
    });
    expect(result.current.notifications.length).toBe(2);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.notifications.length).toBe(1);
  });

  test("TestComponent integration: can add, dismiss and clear notifications via UI", () => {
    render(
      <NotificationProvider>
        <TestComponent message="Hello world" type="info" />
      </NotificationProvider>
    );


    expect(screen.getByTestId("notifications-count").textContent).toBe("0");


    fireEvent.click(screen.getByText("Notify"));
    expect(screen.getByTestId("notifications-count").textContent).toBe("1");
    expect(screen.getByText("Hello world")).toBeInTheDocument();


    fireEvent.click(screen.getByText("Dismiss"));
    expect(screen.getByTestId("notifications-count").textContent).toBe("0");


    fireEvent.click(screen.getByText("Notify"));
    fireEvent.click(screen.getByText("Notify"));
    expect(screen.getByTestId("notifications-count").textContent).toBe("2");

    fireEvent.click(screen.getByText("Clear All"));
    expect(screen.getByTestId("notifications-count").textContent).toBe("0");
  });

  test("Stress test: add 100 notifications and auto-dismiss them all", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.notify(`Notification #${i}`, "info", { durationMs: 100 });
      }
    });

    expect(result.current.notifications.length).toBe(100);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.notifications.length).toBe(0);
  });
});
