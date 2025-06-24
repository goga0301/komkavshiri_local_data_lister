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

export interface ILocalItem {
  id: string;
  name: string;
  type: LocalItemType;
  description: string;
  location: string;
  rating: number;
  tags: string[];
  imageUrl: string;
  isTrending: boolean;
  openingHours: {
    open: string;
    close: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  featuredReview: {
    author: string;
    comment: string;
    stars: number;
  };
  accessibility: string[];
  mysteryScore: number;
}
