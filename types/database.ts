export type Profile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: "organizer" | "admin";
  created_at: string;
};

export type EventStatus = "draft" | "published";
export type PaymentStatus = "unpaid" | "paid";

export type Event = {
  id: string;
  organizer_id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  city: string;
  region: string;
  country: string;
  main_address: string;
  latitude: number | null;
  longitude: number | null;
  status: EventStatus;
  tier: string;
  max_homes: number;
  is_featured: boolean;
  payment_status: PaymentStatus;
  stripe_session_id: string | null;
  banner_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Home = {
  id: string;
  event_id: string;
  seller_name: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  categories: string[];
  featured_items: string[];
  opening_time: string | null;
  closing_time: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HomePhoto = {
  id: string;
  home_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type Payment = {
  id: string;
  organizer_id: string;
  event_id: string | null;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  tier: string;
  status: string;
  created_at: string;
};

export type HomeWithPhotos = Home & { home_photos: HomePhoto[] };

export type EventWithHomes = Event & { homes: HomeWithPhotos[] };
