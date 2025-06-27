import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import AddItemModal from "../AddItemModel";
import "@testing-library/jest-dom";

describe("AddItemModal Component", () => {
  const defaultProps = {
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    initialData: undefined,
    submitLabel: "Submit",
  };

  const fillInput = (placeholder, value) => {
    const input = screen.getByPlaceholderText(placeholder);
    fireEvent.change(input, { target: { value } });
    return input;
  };

  const renderModal = (props = {}) =>
    render(<AddItemModal {...{ ...defaultProps, ...props }} />);

  test("renders all input fields and buttons", () => {
    renderModal();
    expect(screen.getByText(/Add New Item/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  test("submits form with required name", () => {
    const onSubmit = jest.fn();
    renderModal({ onSubmit });
    fillInput("e.g. Crystal Lake", "Mystery Place");
    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Mystery Place" })
    );
  });

  test("shows alert if name is missing on submit", () => {
    window.alert = jest.fn();
    renderModal();
    fireEvent.click(screen.getByText("Submit"));
    expect(window.alert).toHaveBeenCalledWith("Name is required");
  });

  test("updates all form values and submits them correctly", () => {
    const onSubmit = jest.fn();
    renderModal({ onSubmit });
    fillInput("e.g. Crystal Lake", "Secret Lake");
    fillInput("e.g. Beautiful hidden lake", "Mystic place");
    fillInput("e.g. Near Green Hills", "Unknown Path");
    fillInput("e.g. 4.5", "4");
    fillInput("e.g. nature, hidden, peaceful", "mystic,hidden");
    fillInput("https://example.com/image.jpg", "https://img.com/1.jpg");
    fillInput("e.g. wheelchair, stairs", "wheelchair,elevator");
    fillInput("e.g. 09:00", "10:00");
    fillInput("e.g. 18:00", "21:00");
    fillInput("e.g. John Doe", "Jane");
    fillInput("e.g. A must-visit spot!", "Amazing place!");
    fillInput("e.g. 5", "5");
    fillInput("e.g. 77", "99");
    fireEvent.change(screen.getByLabelText("Is Trending"), {
      target: { value: "yes" },
    });
    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "festival" },
    });
    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Secret Lake",
        description: "Mystic place",
        location: "Unknown Path",
        rating: 4,
        tags: ["mystic", "hidden"],
        imageUrl: "https://img.com/1.jpg",
        accessibility: ["wheelchair", "elevator"],
        openingHours: { open: "10:00", close: "21:00" },
        featuredReview: { author: "Jane", comment: "Amazing place!", stars: 5 },
        mysteryScore: 99,
        isTrending: true,
        type: "festival",
      })
    );
  });

  test("initial data fills fields correctly", () => {
    renderModal({
      initialData: {
        name: "Old Site",
        description: "Abandoned",
        location: "Hidden Road",
        rating: 1,
        imageUrl: "img.jpg",
        tags: ["abandoned"],
        accessibility: ["none"],
        mysteryScore: 88,
        isTrending: false,
        openingHours: { open: "06:00", close: "22:00" },
        featuredReview: { author: "Ghost", comment: "Haunted", stars: 1 },
        type: "abandoned_place",
      },
    });
    expect(screen.getByDisplayValue("Old Site")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Abandoned")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hidden Road")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("abandoned")).toBeInTheDocument();
    expect(screen.getByDisplayValue("none")).toBeInTheDocument();
    expect(screen.getByDisplayValue("88")).toBeInTheDocument();
    expect(screen.getByDisplayValue("06:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("22:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ghost")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Haunted")).toBeInTheDocument();
  });

  test("cancel button calls onClose", () => {
    const onClose = jest.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  test("handles undefined number fields", () => {
    renderModal({
      initialData: { rating: undefined, mysteryScore: undefined },
    });
    expect(screen.getByPlaceholderText("e.g. 4.5")).toHaveValue(null);
    expect(screen.getByPlaceholderText("e.g. 77")).toHaveValue(null);
  });

  test("clears number when input emptied", () => {
    const onSubmit = jest.fn();
    renderModal({ onSubmit });
    fillInput("e.g. Crystal Lake", "Clear Test");
    const ratingInput = screen.getByPlaceholderText("e.g. 4.5");
    fireEvent.change(ratingInput, { target: { value: "" } });
    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ rating: undefined })
    );
  });
});
