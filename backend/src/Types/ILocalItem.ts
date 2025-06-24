// A union type representing all possible categories for a local item.
// Used to classify the type of place (e.g., 'restaurant', 'beach', 'museum').
export type LocalItemType =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'food_truck'
  | 'bakery'
  | 'park'
  | 'lake'
  | 'garden'
  | 'beach'
  | 'hiking_trail'
  | 'museum'
  | 'theater'
  | 'landmark'
  | 'art_gallery'
  | 'historic_site'
  | 'library'
  | 'concert'
  | 'festival'
  | 'market'
  | 'workshop'
  | 'exhibition'
  | 'event'
  | 'bookstore'
  | 'pharmacy'
  | 'supermarket'
  | 'mall'
  | 'atm'
  | 'bank'
  | 'gas_station'
  | 'laundry'
  | 'bus_stop'
  | 'train_station'
  | 'metro_station'
  | 'bike_station'
  | 'parking'
  | 'secret_spot'
  | 'urban_legend'
  | 'abandoned_place'
  | 'street_art';

// Interface representing the structure of a local item object.
export interface ILocalItem {
  // Unique identifier for the item (UUID or similar)
  id: string;

  // Display name of the location
  name: string;

  // Category/type of the location
  type: LocalItemType;

  // Short description for display or filtering
  description: string;

  // Location description or address
  location: string;

  // Average rating from users (1 to 5 scale)
  rating: number;

  // Array of keywords for searching and filtering
  tags: string[];

  // URL to the main image representing this item
  imageUrl: string;

  // Indicates whether this item is currently trending
  isTrending: boolean;

  // Object representing opening and closing times (24-hour format "HH:mm")
  openingHours: {
    open: string;  // Opening time, e.g., "08:00"
    close: string; // Closing time, e.g., "22:00"
  };

  // Coordinates for map location and distance calculations
  // It must be within the city borders!!!
  coordinates: {
    lat: number; // Latitude
    lng: number; // Longitude
  };

  // A highlighted user review
  featuredReview: {
    author: string;   // Name of the reviewer
    comment: string;  // Review comment
    stars: number;    // Star rating (1 to 5)
  };

  // List of accessibility features, e.g., ['wheelchair', 'braille']
  accessibility: string[];

  // Custom score used for ranking, mystery factor, or discovery
  mysteryScore: number;
}
