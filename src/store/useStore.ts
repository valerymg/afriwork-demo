import { create } from 'zustand';
import type { Profile, Gig, Review, Booking, Order, Conversation, Message } from '../types';
import {
  MOCK_PROVIDERS,
  MOCK_CLIENTS,
  MOCK_GIGS,
  MOCK_REVIEWS,
  MOCK_BOOKINGS,
  MOCK_ORDERS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
} from '../lib/mock-data';

interface AppState {
  // Auth
  user: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: 'client' | 'provider') => boolean;
  logout: () => void;

  // Gigs
  gigs: Gig[];
  getGigById: (id: string) => Gig | undefined;
  getGigsByCategory: (category: string) => Gig[];
  getGigsByProvider: (providerId: string) => Gig[];
  searchGigs: (query: string, category?: string, location?: string) => Gig[];
  createGig: (gig: Omit<Gig, 'id' | 'rating_avg' | 'review_count' | 'is_active' | 'created_at' | 'updated_at' | 'provider'>) => Gig;
  updateGig: (id: string, updates: Partial<Gig>) => void;

  // Reviews
  reviews: Review[];
  getReviewsByGig: (gigId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'created_at' | 'client'>) => void;

  // Bookings
  bookings: Booking[];
  getBookingsByUser: (userId: string) => Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;

  // Orders
  orders: Order[];
  getOrdersByUser: (userId: string) => Order[];
  createOrder: (order: Omit<Order, 'id' | 'created_at' | 'completed_at'>) => Order;
  updateOrderStatus: (id: string, status: Order['status'], paymentStatus?: Order['payment_status']) => void;

  // Conversations
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  getConversationsByUser: (userId: string) => Conversation[];
  getMessages: (conversationId: string) => Message[];
  sendMessage: (conversationId: string, content: string) => void;
  startConversation: (otherUserId: string, gigId?: string) => Conversation;

  // Profiles
  profiles: Profile[];
  getProfileById: (id: string) => Profile | undefined;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,

  login: (email: string, _password: string) => {
    const allProfiles = [...MOCK_PROVIDERS, ...MOCK_CLIENTS, ...get().profiles];
    const found = allProfiles.find((p) => p.email === email);
    if (found) {
      set({ user: found, isAuthenticated: true });
      return true;
    }
    // Demo: allow any email to log in as client-1
    if (email) {
      set({ user: MOCK_CLIENTS[0], isAuthenticated: true });
      return true;
    }
    return false;
  },

  signup: (name: string, email: string, _password: string, role: 'client' | 'provider') => {
    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      email,
      full_name: name,
      avatar_url: null,
      role,
      phone: null,
      bio: null,
      location: null,
      is_verified: false,
      created_at: new Date().toISOString(),
      rating_avg: 0,
      review_count: 0,
      completion_rate: 0,
      response_time: null,
      total_earnings: 0,
      balance: 0,
      pending_earnings: 0,
    };
    set((state) => ({
      profiles: [...state.profiles, newProfile],
      user: newProfile,
      isAuthenticated: true,
    }));
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Gigs
  gigs: MOCK_GIGS,

  getGigById: (id: string) => {
    return get().gigs.find((g) => g.id === id);
  },

  getGigsByCategory: (category: string) => {
    return get().gigs.filter((g) => g.category === category && g.is_active);
  },

  getGigsByProvider: (providerId: string) => {
    return get().gigs.filter((g) => g.provider_id === providerId);
  },

  searchGigs: (query: string, category?: string, location?: string) => {
    let results = get().gigs.filter((g) => g.is_active);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }
    if (category) {
      results = results.filter((g) => g.category === category);
    }
    if (location) {
      results = results.filter((g) => g.location === location);
    }
    return results;
  },

  createGig: (gigData) => {
    const user = get().user;
    const newGig: Gig = {
      ...gigData,
      id: `gig-${Date.now()}`,
      rating_avg: 0,
      review_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: user || undefined,
    };
    set((state) => ({ gigs: [...state.gigs, newGig] }));
    return newGig;
  },

  updateGig: (id: string, updates: Partial<Gig>) => {
    set((state) => ({
      gigs: state.gigs.map((g) =>
        g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
      ),
    }));
  },

  // Reviews
  reviews: MOCK_REVIEWS,

  getReviewsByGig: (gigId: string) => {
    return get().reviews.filter((r) => r.gig_id === gigId);
  },

  addReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      created_at: new Date().toISOString(),
      client: get().user || undefined,
    };
    set((state) => ({
      reviews: [...state.reviews, newReview],
    }));
    // Update gig rating
    const gigReviews = get().reviews.filter((r) => r.gig_id === reviewData.gig_id);
    const avgRating = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length;
    get().updateGig(reviewData.gig_id, {
      rating_avg: Math.round(avgRating * 10) / 10,
      review_count: gigReviews.length,
    });
  },

  // Bookings
  bookings: MOCK_BOOKINGS,

  getBookingsByUser: (userId: string) => {
    return get().bookings.filter(
      (b) => b.client_id === userId || b.provider_id === userId
    );
  },

  createBooking: (bookingData) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({ bookings: [...state.bookings, newBooking] }));
    return newBooking;
  },

  updateBookingStatus: (id: string, status: Booking['status']) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status, updated_at: new Date().toISOString() } : b
      ),
    }));
  },

  // Orders
  orders: MOCK_ORDERS,

  getOrdersByUser: (userId: string) => {
    return get().orders.filter(
      (o) => o.client_id === userId || o.provider_id === userId
    );
  },

  createOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      created_at: new Date().toISOString(),
      completed_at: null,
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
    return newOrder;
  },

  updateOrderStatus: (id: string, status: Order['status'], paymentStatus?: Order['payment_status']) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              payment_status: paymentStatus || o.payment_status,
              completed_at: status === 'completed' ? new Date().toISOString() : o.completed_at,
            }
          : o
      ),
    }));
  },

  // Conversations
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,

  getConversationsByUser: (userId: string) => {
    return get().conversations
      .filter((c) => c.participant_1 === userId || c.participant_2 === userId)
      .sort((a, b) => {
        const aTime = a.last_message_at || a.created_at;
        const bTime = b.last_message_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  },

  getMessages: (conversationId: string) => {
    return get().messages[conversationId] || [];
  },

  sendMessage: (conversationId: string, content: string) => {
    const user = get().user;
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, last_message: content, last_message_at: new Date().toISOString() }
          : c
      ),
    }));
  },

  startConversation: (otherUserId: string, gigId?: string) => {
    const user = get().user;
    if (!user) throw new Error('Must be logged in');

    // Check if conversation already exists
    const existing = get().conversations.find(
      (c) =>
        (c.participant_1 === user.id && c.participant_2 === otherUserId) ||
        (c.participant_1 === otherUserId && c.participant_2 === user.id)
    );
    if (existing) return existing;

    const otherProfile = get().getProfileById(otherUserId);
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participant_1: user.id,
      participant_2: otherUserId,
      gig_id: gigId || null,
      last_message: null,
      last_message_at: null,
      created_at: new Date().toISOString(),
      other_user: otherProfile,
    };
    set((state) => ({
      conversations: [...state.conversations, newConv],
      messages: { ...state.messages, [newConv.id]: [] },
    }));
    return newConv;
  },

  // Profiles
  profiles: [...MOCK_PROVIDERS, ...MOCK_CLIENTS],

  getProfileById: (id: string) => {
    return get().profiles.find((p) => p.id === id);
  },

  updateProfile: (id: string, updates: Partial<Profile>) => {
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      user: state.user?.id === id ? { ...state.user, ...updates } : state.user,
    }));
  },
}));
