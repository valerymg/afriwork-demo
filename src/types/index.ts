export type UserRole = 'client' | 'provider';
export type Lang = 'en' | 'fr';
export type PaymentMethod = 'mtn_money' | 'orange_money' | 'wave' | 'cash' | 'pay_on_completion' | 'installments';
export type VerificationType = 'gov_id' | 'phone' | 'portfolio';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  bio: string | null;
  location: string | null;
  country: 'CM' | 'CI' | null;
  is_verified: boolean;
  verifications: VerificationType[];
  created_at: string;
  rating_avg: number;
  review_count: number;
  completion_rate: number;
  response_time: string | null;
  total_earnings: number;
  balance: number;
  pending_earnings: number;
  is_available_now: boolean;
  offers_emergency: boolean;
  video_intro_url: string | null;
}

export interface PricingTier {
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
  description: string;
  description_fr: string;
  delivery_days: number;
  features: string[];
  features_fr: string[];
}

export interface Gig {
  id: string;
  provider_id: string;
  title: string;
  title_fr: string;
  description: string;
  description_fr: string;
  category: string;
  subcategory: string | null;
  location: string;
  pricing_tiers: PricingTier[];
  photos: string[];
  video_urls: string[];
  rating_avg: number;
  review_count: number;
  is_active: boolean;
  is_emergency: boolean;
  created_at: string;
  updated_at: string;
  provider?: Profile;
}

export interface Review {
  id: string;
  gig_id: string;
  order_id: string;
  client_id: string;
  provider_id: string;
  rating: number;
  comment: string;
  provider_response: string | null;
  created_at: string;
  client?: Profile;
}

export interface Booking {
  id: string;
  gig_id: string;
  client_id: string;
  provider_id: string;
  tier: 'Basic' | 'Standard' | 'Premium';
  price: number;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  notes: string | null;
  created_at: string;
  updated_at: string;
  gig?: Gig;
  client?: Profile;
  provider?: Profile;
}

export interface Order {
  id: string;
  booking_id: string;
  client_id: string;
  provider_id: string;
  amount: number;
  platform_fee: number;
  provider_earnings: number;
  payment_method: PaymentMethod;
  payment_intent_id: string | null;
  payment_status: 'pending' | 'held' | 'released' | 'refunded';
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  dispute_reason: string | null;
  created_at: string;
  completed_at: string | null;
  booking?: Booking;
  gig?: Gig;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  gig_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  other_user?: Profile;
  gig?: Gig;
  unread_count?: number;
}

export interface Category {
  id: string;
  name: string;
  name_fr: string;
  icon: string;
  description: string;
  description_fr: string;
  color: string;
}

export interface LocationOption {
  id: string;
  name: string;
  country: 'CM' | 'CI';
  region: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  reporter_id: string;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution: string | null;
  created_at: string;
  updated_at: string;
}
