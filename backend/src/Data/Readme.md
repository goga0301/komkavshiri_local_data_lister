# 📄 LocalItems.json Documentation

This file contains hardcoded location data for the application.  
Each object in the array represents a **single point of interest**, such as a beach, mountain, museum, etc.

---

## 📌 Sample Entry (Qutaia Sea Beach)

```json
{
  "id": "8a131131-878e-43d2-9f4c-3b99b1dbdb54",
  "name": "Qutaia Sea Beach",
  "type": "beach",
  "description": "The best place for summer time.",
  "location": "Next to the Qutaia Sea",
  "rating": 5,
  "tags": [],
  "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvTPv82XfI-FT12YQVKPIjJ05u3nMPDRoaSA&s",
  "isTrending": true,
  "openingHours": {
    "open": "00:00",
    "close": "00:00"
  },
  "featuredReview": {
    "author": "Beqa Kikutadze",
    "comment": "Amazing atmosphere",
    "stars": 5
  },
  "accessibility": [],
  "mysteryScore": 100,
  "coordinates": {
    "lat": 42.26221320052093,
    "lng": 42.610843738886246
  }
}
```

---

## 🧾 Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string (UUID)` | Unique identifier for the location. |
| `name` | `string` | Name of the location. |
| `type` | `string` | Category of the place (`beach`, `museum`, `park`, etc.). |
| `description` | `string` | Brief description of the location. |
| `location` | `string` | Textual description or address of the place. |
| `rating` | `number` | Average user rating (1 to 5). |
| `tags` | `string[]` | Array of keywords for filtering or categorization (may be empty). |
| `imageUrl` | `string (URL)` | Link to a representative image. |
| `isTrending` | `boolean` | Indicates if the location is currently trending/popular. |
| `openingHours` | `object` | Describes opening and closing times. |
| ├─ `open` | `string ("HH:mm")` | Opening time (24-hour format). `"00:00"` means open all day. |
| └─ `close` | `string ("HH:mm")` | Closing time. `"00:00"` means open all day. |
| `featuredReview` | `object` | Contains a featured user review. |
| ├─ `author` | `string` | Reviewer's name. |
| ├─ `comment` | `string` | Review text. |
| └─ `stars` | `number` | Review rating (1 to 5). |
| `accessibility` | `string[]` | Array describing accessibility features (e.g., `"wheelchair"`, `"braille"`). Empty if none. |
| `mysteryScore` | `number` | Custom application score (used for hidden gems, ranking, etc.). |
| `coordinates` | `object` | Geographical location of the place. |
| ├─ `lat` | `number` | Latitude. |
| └─ `lng` | `number` | Longitude. |

---

## 🔁 Note

All other entries in `LocalItems.json` follow the **same structure and field format** as shown above.
