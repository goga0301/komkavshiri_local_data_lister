import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthPanel from "./AuthPanel";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthPanel Component", () => {
  it("renders input fields and login button", () => {
    render(<AuthPanel onLoginSuccess={() => {}} />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows error on failed login", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Failed"));
    render(<AuthPanel onLoginSuccess={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "user" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials or server error.")).toBeInTheDocument();
    });
  });

  it("calls onLoginSuccess on valid login", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: "abc123" } });
    const mockSuccess = jest.fn();

    render(<AuthPanel onLoginSuccess={mockSuccess} />);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith({ username: "admin", token: "abc123" });
    });
  });
});
