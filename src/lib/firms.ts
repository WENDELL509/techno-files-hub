export type Category =
  | "Property Boundary"
  | "Land Division"
  | "Land Titling"
  | "GIS"
  | "Specialized";

export const FILTERS: Category[] = [
  "Property Boundary",
  "GIS",
  "Land Division",
  "Land Titling",
  "Specialized",
];

export const DAVAO_CENTER = { lat: 7.0731, lng: 125.6128 };

export interface Firm {
  id: string;
  name: string;
  tagline?: string;
  engineer?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  reviews?: number;
  distance: string;
  rating: number;
  lat: number;
  lng: number;
  area: "City" | "Rural";
  categories: Category[];
  services: string[];
}

export const FIRMS: Firm[] = [
  {
    id: "vedua",
    name: "J.A. VEDUA SURVEYING OFFICE",
    tagline: "For all kind of surveying works",
    engineer: "Jose Andre D. Vedua",
    phone: "0939 243 4447 · (082) 282-8154",
    email: "joseandrevedua@yahoo.com",
    address: "55A, 7 Veloso St, Bo Obrero, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 124,
    distance: "400 m away",
    rating: 5,
    lat: 7.0755,
    lng: 125.6105,
    area: "City",
    categories: ["Property Boundary", "Land Division"],
    services: ["Boundary", "Subdivision"],
  },
  {
    id: "ge",
    name: "GE Land Surveying Services",
    engineer: "Engr. Gabriel Estrada",
    phone: "(082) 224-1180",
    email: "ge.landsurvey@gmail.com",
    address: "12 Quezon Blvd, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 86,
    distance: "400 m away",
    rating: 5,
    lat: 7.071,
    lng: 125.616,
    area: "City",
    categories: ["Property Boundary", "Land Titling"],
    services: ["Relocation", "Cadastral"],
  },
  {
    id: "laps",
    name: "LAPS Land Analytics & Planning",
    engineer: "Engr. Liza A. Padillo",
    phone: "(082) 305-2244",
    email: "contact@lapsdavao.com",
    address: "Matina Crossing, Davao City",
    hours: "9:00 AM – 6:00 PM",
    reviews: 64,
    distance: "500 m away",
    rating: 5,
    lat: 7.069,
    lng: 125.609,
    area: "City",
    categories: ["Land Division", "Specialized"],
    services: ["Consolidation", "Topographic"],
  },
  {
    id: "scube",
    name: "Scube Silao Surveying Services",
    engineer: "Engr. Samuel Silao",
    phone: "0917 555 0182",
    email: "scube.silao@yahoo.com",
    address: "Lanang, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 42,
    distance: "1.7 km away",
    rating: 4.8,
    lat: 7.082,
    lng: 125.62,
    area: "City",
    categories: ["Property Boundary", "Specialized"],
    services: ["Verification", "As-Built"],
  },
  {
    id: "davao-gis",
    name: "Davao GIS Mapping Solutions",
    engineer: "Engr. Mara Tan",
    phone: "(082) 244-9090",
    address: "Bajada, Davao City",
    hours: "8:30 AM – 5:30 PM",
    reviews: 51,
    distance: "2.1 km away",
    rating: 4.9,
    lat: 7.085,
    lng: 125.613,
    area: "City",
    categories: ["GIS", "Specialized"],
    services: ["GIS Mapping", "Topographic"],
  },
  {
    id: "mindanao-geo",
    name: "Mindanao Geomatics & GIS",
    engineer: "Engr. Paolo Reyes",
    phone: "(082) 233-8181",
    address: "C.M. Recto St, Davao City",
    hours: "9:00 AM – 6:00 PM",
    reviews: 38,
    distance: "3.4 km away",
    rating: 4.8,
    lat: 7.09,
    lng: 125.625,
    area: "City",
    categories: ["GIS", "Specialized"],
    services: ["GIS Analysis", "As-Built"],
  },
  {
    id: "urbangeo",
    name: "UrbanGeo Analytics Davao",
    engineer: "Engr. Karina Lim",
    phone: "(082) 287-3000",
    address: "Ecoland, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 29,
    distance: "1.9 km away",
    rating: 4.7,
    lat: 7.065,
    lng: 125.608,
    area: "City",
    categories: ["GIS", "Specialized"],
    services: ["GIS Mapping", "Hydrographic"],
  },
  {
    id: "calinan",
    name: "Calinan Land Surveyors",
    engineer: "Engr. Rico Daluz",
    phone: "0918 411 2090",
    address: "Calinan District, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 22,
    distance: "18 km away",
    rating: 4.8,
    lat: 7.185,
    lng: 125.468,
    area: "Rural",
    categories: ["Property Boundary", "Land Titling"],
    services: ["Boundary", "Relocation"],
  },
  {
    id: "toril",
    name: "Toril Geodetic Services",
    engineer: "Engr. Mila Toril",
    phone: "0922 718 4521",
    address: "Toril, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 31,
    distance: "14 km away",
    rating: 4.7,
    lat: 7.025,
    lng: 125.49,
    area: "Rural",
    categories: ["Property Boundary", "Land Division"],
    services: ["Boundary", "Subdivision"],
  },
  {
    id: "tugbok",
    name: "Tugbok Cadastral Survey Co.",
    engineer: "Engr. Noel Buan",
    phone: "0939 290 1144",
    address: "Tugbok District, Davao City",
    hours: "8:00 AM – 5:00 PM",
    reviews: 19,
    distance: "12 km away",
    rating: 4.9,
    lat: 7.11,
    lng: 125.51,
    area: "Rural",
    categories: ["Property Boundary", "Land Titling"],
    services: ["Cadastral", "Relocation"],
  },
  {
    id: "marilog",
    name: "Marilog Highland Surveying",
    engineer: "Engr. Anna Cabig",
    phone: "0917 880 3344",
    address: "Marilog District, Davao City",
    hours: "8:00 AM – 4:00 PM",
    reviews: 14,
    distance: "42 km away",
    rating: 4.6,
    lat: 7.35,
    lng: 125.42,
    area: "Rural",
    categories: ["Property Boundary", "Specialized"],
    services: ["Boundary", "Topographic"],
  },
];

export const getFirm = (id: string) => FIRMS.find((f) => f.id === id);
