import React, { useState, useEffect } from "react";
import { ILocalItem, LocalItemType } from "../types/ILocalItem";
import "./ui/AddItemModel.css";

/**
 * Props expected by AddItemModal:
 * - onClose: function to close the modal
 * - onSubmit: function to submit the new/edited item
 * - initialData: optional data to pre-fill the form when editing
 * - submitLabel: optional label for the submit button (e.g., "Edit")
 */
type Props = {
  onClose: () => void;
  onSubmit: (data: Partial<ILocalItem>) => void;
  initialData?: Partial<ILocalItem>;
  submitLabel?: string;
};

// Default form structure used when creating a new item
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

/**
 * Modal form component to either add or edit a local item.
 */
const AddItemModal: React.FC<Props> = ({ onClose, onSubmit, initialData, submitLabel }) => {
  // Internal state of the form initialized with defaults
  const [form, setForm] = useState<Partial<ILocalItem>>(defaultForm);

  // On first render or when initialData changes, prefill the form
  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultForm, ...initialData });
    }
  }, [initialData]);

  /**
   * Generic field updater for top-level fields in the form
   */
  const handleChange = (field: keyof ILocalItem, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Nested field updater, e.g., for `openingHours.open` or `featuredReview.comment`
   */
  const handleNestedChange = <
    T extends keyof Pick<ILocalItem, "openingHours" | "featuredReview">
  >(
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

  /**
   * Validate and submit the form data
   */
  const handleSubmit = () => {
    if (!form.name) return alert("Name is required");
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{submitLabel === "Edit" ? "Edit Item" : "Add New Item"}</h3>

        {/* Each field below corresponds to an ILocalItem property */}
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
              handleChange("rating", val === "" ? undefined : Number(val));
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

        {/* Nested object: openingHours */}
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

        {/* Nested object: featuredReview */}
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
              handleNestedChange("featuredReview", "stars", val === "" ? undefined : Number(val));
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
              handleChange("mysteryScore", val === "" ? undefined : Number(val));
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
              "restaurant", "cafe", "bar", "food_truck", "bakery", "park", "lake", "garden", "beach",
              "hiking_trail", "museum", "theater", "landmark", "art_gallery", "historic_site", "library",
              "concert", "festival", "market", "workshop", "exhibition", "event", "bookstore", "pharmacy",
              "supermarket", "mall", "atm", "bank", "gas_station", "laundry", "bus_stop", "train_station",
              "metro_station", "bike_station", "parking", "secret_spot", "urban_legend", "abandoned_place",
              "street_art"
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {/* Action buttons */}
        <button onClick={handleSubmit}>{submitLabel || "Submit"}</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddItemModal;
