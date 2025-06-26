import React, { useState, useEffect } from "react";
import { ILocalItem, LocalItemType } from "../types/ILocalItem";
import "./ui/AddItemModel.css";

type Props = {
  onClose: () => void;
  onSubmit: (data: Partial<ILocalItem>) => void;
  initialData?: Partial<ILocalItem>;
  submitLabel?: string;
};

const defaultForm: Partial<ILocalItem> = {
  name: "",
  description: "",
  location: "",
  rating: 0,
  type: "secret_spot",
  tags: [],
  imageUrl: "",
  isTrending: false,
  openingHours: { open: "", close: "" },
  featuredReview: { author: "", comment: "", stars: 0 },
  accessibility: [],
  mysteryScore: 0,
};

const AddItemModal: React.FC<Props> = ({ onClose, onSubmit, initialData, submitLabel }) => {
  const [form, setForm] = useState<Partial<ILocalItem>>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultForm, ...initialData });
    }
  }, [initialData]);

  const handleChange = (field: keyof ILocalItem, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = <T extends keyof Pick<ILocalItem, "openingHours" | "featuredReview">>(
    field: T,
    key: keyof ILocalItem[T],
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as object),
        [key]: value,
      } as ILocalItem[T],
    }));
  };

  const handleSubmit = () => {
    if (!form.name) return alert("Name is required");
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{submitLabel === "Edit" ? "Edit Item" : "Add New Item"}</h3>

        <label>
          Name *
          <input
            placeholder="e.g. Crystal Lake"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>

        <label>
          Description
          <input
            placeholder="e.g. Beautiful hidden lake"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </label>

        <label>
          Location
          <input
            placeholder="e.g. Near Green Hills"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </label>

        <label>
          Rating (0 to 5)
          <input
            type="number"
            min={0}
            max={5}
            placeholder="e.g. 4.5"
            value={form.rating ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                handleChange("rating", undefined);
              } else {
                handleChange("rating", Number(val));
              }
            }}
          />
        </label>

        <label>
          Tags (comma separated)
          <input
            placeholder="e.g. nature, hidden, peaceful"
            value={form.tags?.join(", ") || ""}
            onChange={(e) =>
              handleChange("tags", e.target.value.split(",").map((s) => s.trim()))
            }
          />
        </label>

        <label>
          Image URL
          <input
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
          />
        </label>

        <label>
          Accessibility (comma separated)
          <input
            placeholder="e.g. wheelchair, stairs"
            value={form.accessibility?.join(", ") || ""}
            onChange={(e) =>
              handleChange("accessibility", e.target.value.split(",").map((s) => s.trim()))
            }
          />
        </label>

        <label>
          Opening Time
          <input
            placeholder="e.g. 09:00"
            value={form.openingHours?.open}
            onChange={(e) => handleNestedChange("openingHours", "open", e.target.value)}
          />
        </label>

        <label>
          Closing Time
          <input
            placeholder="e.g. 18:00"
            value={form.openingHours?.close}
            onChange={(e) => handleNestedChange("openingHours", "close", e.target.value)}
          />
        </label>

        <label>
          Featured Review Author
          <input
            placeholder="e.g. John Doe"
            value={form.featuredReview?.author}
            onChange={(e) => handleNestedChange("featuredReview", "author", e.target.value)}
          />
        </label>

        <label>
          Featured Review Comment
          <input
            placeholder="e.g. A must-visit spot!"
            value={form.featuredReview?.comment}
            onChange={(e) => handleNestedChange("featuredReview", "comment", e.target.value)}
          />
        </label>

        <label>
          Featured Review Stars (0 to 5)
          <input
            type="number"
            min={0}
            max={5}
            placeholder="e.g. 5"
            value={form.featuredReview?.stars ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                handleNestedChange("featuredReview", "stars", undefined);
              } else {
                handleNestedChange("featuredReview", "stars", Number(val));
              }
            }}
          />
        </label>

        <label>
          Mystery Score (0 to 100)
          <input
            type="number"
            min={0}
            max={100}
            placeholder="e.g. 77"
            value={form.mysteryScore ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                handleChange("mysteryScore", undefined);
              } else {
                handleChange("mysteryScore", Number(val));
              }
            }}
          />
        </label>

        <label>
          Is Trending
          <select
            value={form.isTrending ? "yes" : "no"}
            onChange={(e) => handleChange("isTrending", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <label>
          Type
          <select
            onChange={(e) => handleChange("type", e.target.value as LocalItemType)}
            value={form.type}
          >
            {[
              "restaurant",
              "cafe",
              "bar",
              "food_truck",
              "bakery",
              "park",
              "lake",
              "garden",
              "beach",
              "hiking_trail",
              "museum",
              "theater",
              "landmark",
              "art_gallery",
              "historic_site",
              "library",
              "concert",
              "festival",
              "market",
              "workshop",
              "exhibition",
              "event",
              "bookstore",
              "pharmacy",
              "supermarket",
              "mall",
              "atm",
              "bank",
              "gas_station",
              "laundry",
              "bus_stop",
              "train_station",
              "metro_station",
              "bike_station",
              "parking",
              "secret_spot",
              "urban_legend",
              "abandoned_place",
              "street_art",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleSubmit}>{submitLabel || "Submit"}</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddItemModal;
