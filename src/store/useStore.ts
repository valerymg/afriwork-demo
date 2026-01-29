import { create } from 'zustand';
import type { Profile, Gig, Review, Booking, Order, Conversation, Message, PaymentMethod } from '../types';
import { supabase } from '../lib/supabase';
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

// Keep PaymentMethod imported for external page usage
void (0 as unknown as PaymentMethod);

interface SearchGigOptions {
  minPrice?: number;
  maxPrice?: number;
  emergencyOnly?: boolean;
  availableNow?: boolean;
  sortBy?: string;
}

interface AppState {
  // Auth
  user: Profile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: 'client' | 'provider') => Promise<boolean>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  loginDemo: (role: 'client' | 'provider') => void;

  // Gigs
  gigs: Gig[];
  loadGigs: () => Promise<void>;
  getGigById: (id: string) => Gig | undefined;
  getGigsByCategory: (category: string) => Gig[];
  getGigsByProvider: (providerId: string) => Gig[];
  searchGigs: (query: string, category?: string, location?: string, options?: SearchGigOptions) => Gig[];
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
  loadProfiles: () => Promise<void>;
  getProfileById: (id: string) => Profile | undefined;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
}

function makeProfile(id: string, email: string, name: string, role: 'client' | 'provider'): Profile {
  return {
    id,
    email,
    full_name: name,
    avatar_url: null,
    role,
    phone: null,
    bio: null,
    location: null,
    country: null,
    is_verified: false,
    verifications: [],
    created_at: new Date().toISOString(),
    rating_avg: 0,
    review_count: 0,
    completion_rate: 0,
    response_time: null,
    total_earnings: 0,
    balance: 0,
    pending_earnings: 0,
    is_available_now: false,
    offers_emergency: false,
    video_intro_url: null,
  };
}

/**
 * Map a raw Supabase gig row (with optional nested provider profile) to our Gig type.
 */
function mapSupabaseGig(row: Record<string, unknown>): Gig {
  const provider = row.profiles
    ? (row.profiles as Profile)
    : undefined;

  return {
    id: row.id as string,
    provider_id: row.provider_id as string,
    title: (row.title as string) || '',
    title_fr: (row.title_fr as string) || '',
    description: (row.description as string) || '',
    description_fr: (row.description_fr as string) || '',
    category: (row.category as string) || '',
    subcategory: (row.subcategory as string | null) ?? null,
    location: (row.location as string) || '',
    pricing_tiers: Array.isArray(row.pricing_tiers) ? row.pricing_tiers : [],
    photos: Array.isArray(row.photos) ? row.photos : [],
    video_urls: Array.isArray(row.video_urls) ? row.video_urls : [],
    rating_avg: (row.rating_avg as number) ?? 0,
    review_count: (row.review_count as number) ?? 0,
    is_active: (row.is_active as boolean) ?? true,
    is_emergency: (row.is_emergency as boolean) ?? false,
    created_at: (row.created_at as string) || new Date().toISOString(),
    updated_at: (row.updated_at as string) || new Date().toISOString(),
    provider,
  };
}

/**
 * Map a raw Supabase profile row to our Profile type, providing sensible defaults.
 */
function mapSupabaseProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    email: (row.email as string) || '',
    full_name: (row.full_name as string) || '',
    avatar_url: (row.avatar_url as string | null) ?? null,
    role: (row.role as 'client' | 'provider') || 'client',
    phone: (row.phone as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    country: (row.country as 'CM' | 'CI' | null) ?? null,
    is_verified: (row.is_verified as boolean) ?? false,
    verifications: Array.isArray(row.verifications) ? row.verifications : [],
    created_at: (row.created_at as string) || new Date().toISOString(),
    rating_avg: (row.rating_avg as number) ?? 0,
    review_count: (row.review_count as number) ?? 0,
    completion_rate: (row.completion_rate as number) ?? 0,
    response_time: (row.response_time as string | null) ?? null,
    total_earnings: (row.total_earnings as number) ?? 0,
    balance: (row.balance as number) ?? 0,
    pending_earnings: (row.pending_earnings as number) ?? 0,
    is_available_now: (row.is_available_now as boolean) ?? false,
    offers_emergency: (row.offers_emergency as boolean) ?? false,
    video_intro_url: (row.video_intro_url as string | null) ?? null,
  };
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  authLoading: true,

  initAuth: async () => {
    // Load data from Supabase (or fall back to mock) in parallel with auth
    const dataPromise = Promise.all([
      get().loadProfiles(),
      get().loadGigs(),
    ]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Wait for profiles/gigs data to be loaded before looking up the user
      await dataPromise;

      if (session?.user) {
        // Try to find the profile from the (now-loaded) profiles list
        const existing = get().profiles.find(
          (p) => p.id === session.user.id || p.email === session.user.email,
        );
        const profile = existing || makeProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.full_name || session.user.email || 'User',
          (session.user.user_metadata?.role as 'client' | 'provider') || 'client',
        );
        if (!existing) {
          set((s) => ({ profiles: [...s.profiles, profile] }));
        }
        set({ user: profile, isAuthenticated: true, authLoading: false });
      } else {
        set({ authLoading: false });
      }
    } catch {
      // Even if auth fails, make sure data loading finishes
      await dataPromise.catch(() => {});
      set({ authLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const existing = get().profiles.find(
          (p) => p.id === session.user.id || p.email === session.user.email,
        );
        if (existing) {
          set({ user: existing, isAuthenticated: true });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    });
  },

  login: async (email: string, password: string) => {
    // Try real Supabase auth first
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        // Try fetching the full profile from Supabase
        let profile: Profile | undefined;
        try {
          const { data: profileRow } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profileRow) {
            profile = mapSupabaseProfile(profileRow as Record<string, unknown>);
          }
        } catch {
          // profile fetch failed, fall through
        }

        if (!profile) {
          const existing = get().profiles.find((p) => p.email === email);
          profile = existing || makeProfile(
            data.user.id,
            email,
            data.user.user_metadata?.full_name || email,
            (data.user.user_metadata?.role as 'client' | 'provider') || 'client',
          );
        }

        // Make sure the profile is in the store
        const inStore = get().profiles.find((p) => p.id === profile!.id);
        if (!inStore) {
          set((s) => ({ profiles: [...s.profiles, profile!] }));
        } else {
          // Update existing profile with latest data
          set((s) => ({
            profiles: s.profiles.map((p) => p.id === profile!.id ? profile! : p),
          }));
        }

        set({ user: profile, isAuthenticated: true });
        return true;
      }
    } catch {
      // Supabase not available, fall through to demo mode
    }

    // Fallback: demo mode with mock data
    const allProfiles = [...MOCK_PROVIDERS, ...MOCK_CLIENTS, ...get().profiles];
    const found = allProfiles.find((p) => p.email === email);
    if (found) {
      set({ user: found, isAuthenticated: true });
      return true;
    }
    return false;
  },

  signup: async (name: string, email: string, password: string, role: 'client' | 'provider') => {
    // Try admin API endpoint first (Supabase Edge Function or custom endpoint)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        const adminRes = await fetch(`${supabaseUrl}/functions/v1/admin-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          if (adminData?.user?.id) {
            // Sign in after admin signup
            await supabase.auth.signInWithPassword({ email, password });

            // Fetch the profile created by the database trigger
            let profile: Profile | undefined;
            try {
              const { data: profileRow } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', adminData.user.id)
                .single();
              if (profileRow) {
                profile = mapSupabaseProfile(profileRow as Record<string, unknown>);
              }
            } catch {
              // profile fetch failed
            }

            if (!profile) {
              profile = makeProfile(adminData.user.id, email, name, role);
            }

            set((s) => ({
              profiles: [...s.profiles.filter((p) => p.id !== profile!.id), profile!],
              user: profile!,
              isAuthenticated: true,
            }));
            return true;
          }
        }
      }
    } catch {
      // Admin endpoint not available, fall through
    }

    // Try regular Supabase signup
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, role } },
      });
      if (!error && data.user) {
        // Wait briefly for the database trigger to create the profile
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Fetch the profile created by the trigger
        let profile: Profile | undefined;
        try {
          const { data: profileRow } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profileRow) {
            profile = mapSupabaseProfile(profileRow as Record<string, unknown>);
          }
        } catch {
          // profile fetch failed
        }

        if (!profile) {
          profile = makeProfile(data.user.id, email, name, role);
        }

        set((s) => ({
          profiles: [...s.profiles.filter((p) => p.id !== profile!.id), profile!],
          user: profile!,
          isAuthenticated: true,
        }));
        return true;
      }
    } catch {
      // Supabase not available, fall through to demo mode
    }

    // Fallback: local demo signup
    const profile = makeProfile(`user-${Date.now()}`, email, name, role);
    set((s) => ({
      profiles: [...s.profiles, profile],
      user: profile,
      isAuthenticated: true,
    }));
    return true;
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    set({ user: null, isAuthenticated: false });
  },

  loginDemo: (role: 'client' | 'provider') => {
    const profile = role === 'provider' ? MOCK_PROVIDERS[0] : MOCK_CLIENTS[0];
    set({ user: profile, isAuthenticated: true });
  },

  // ---------------------------------------------------------------------------
  // Gigs
  // ---------------------------------------------------------------------------
  gigs: MOCK_GIGS,

  loadGigs: async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select('*, profiles!gigs_provider_id_fkey(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const supabaseGigs = (data as Record<string, unknown>[]).map(mapSupabaseGig);
        // Merge: Supabase gigs take precedence, then append any mock gigs
        // whose ids are not already present (avoids duplicates).
        const supabaseIds = new Set(supabaseGigs.map((g) => g.id));
        const mockExtras = MOCK_GIGS.filter((g) => !supabaseIds.has(g.id));
        set({ gigs: [...supabaseGigs, ...mockExtras] });
      } else {
        // Supabase returned empty -- use mock data as fallback
        set({ gigs: MOCK_GIGS });
      }
    } catch {
      // Supabase unavailable or error -- fall back to mock data
      set({ gigs: MOCK_GIGS });
    }
  },

  getGigById: (id: string) => {
    return get().gigs.find((g) => g.id === id);
  },

  getGigsByCategory: (category: string) => {
    return get().gigs.filter((g) => g.category === category && g.is_active);
  },

  getGigsByProvider: (providerId: string) => {
    return get().gigs.filter((g) => g.provider_id === providerId);
  },

  searchGigs: (query: string, category?: string, location?: string, options?: SearchGigOptions) => {
    let results = get().gigs.filter((g) => g.is_active);

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.title_fr.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.description_fr.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }

    if (category) {
      results = results.filter((g) => g.category === category);
    }

    if (location) {
      results = results.filter((g) => g.location === location);
    }

    if (options) {
      if (options.minPrice !== undefined) {
        results = results.filter((g) => {
          const lowestPrice = Math.min(...g.pricing_tiers.map((t) => t.price));
          return lowestPrice >= options.minPrice!;
        });
      }

      if (options.maxPrice !== undefined) {
        results = results.filter((g) => {
          const lowestPrice = Math.min(...g.pricing_tiers.map((t) => t.price));
          return lowestPrice <= options.maxPrice!;
        });
      }

      if (options.emergencyOnly) {
        results = results.filter((g) => g.is_emergency);
      }

      if (options.availableNow) {
        results = results.filter((g) => {
          if (!g.provider) {
            const provider = get().getProfileById(g.provider_id);
            return provider?.is_available_now ?? false;
          }
          return g.provider.is_available_now;
        });
      }

      const sortBy = options.sortBy || 'rating';
      switch (sortBy) {
        case 'rating':
          results.sort((a, b) => b.rating_avg - a.rating_avg);
          break;
        case 'reviews':
          results.sort((a, b) => b.review_count - a.review_count);
          break;
        case 'price_low':
          results.sort((a, b) => {
            const aMin = Math.min(...a.pricing_tiers.map((t) => t.price));
            const bMin = Math.min(...b.pricing_tiers.map((t) => t.price));
            return aMin - bMin;
          });
          break;
        case 'price_high':
          results.sort((a, b) => {
            const aMin = Math.min(...a.pricing_tiers.map((t) => t.price));
            const bMin = Math.min(...b.pricing_tiers.map((t) => t.price));
            return bMin - aMin;
          });
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        default:
          results.sort((a, b) => b.rating_avg - a.rating_avg);
          break;
      }
    }

    return results;
  },

  createGig: (gigData) => {
    const user = get().user;
    const localId = `gig-${Date.now()}`;

    const newGig: Gig = {
      ...gigData,
      id: localId,
      rating_avg: 0,
      review_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: user || undefined,
    };

    // Optimistically add to local state
    set((state) => ({ gigs: [...state.gigs, newGig] }));

    // Attempt to INSERT into Supabase in the background
    (async () => {
      try {
        const { data, error } = await supabase
          .from('gigs')
          .insert({
            provider_id: gigData.provider_id,
            title: gigData.title,
            title_fr: gigData.title_fr,
            description: gigData.description,
            description_fr: gigData.description_fr,
            category: gigData.category,
            subcategory: gigData.subcategory ?? null,
            location: gigData.location,
            pricing_tiers: gigData.pricing_tiers,
            photos: gigData.photos,
            video_urls: gigData.video_urls,
            is_emergency: gigData.is_emergency ?? false,
          })
          .select('*, profiles!gigs_provider_id_fkey(*)')
          .single();

        if (!error && data) {
          // Replace the optimistic gig with the real one from Supabase
          const realGig = mapSupabaseGig(data as Record<string, unknown>);
          set((state) => ({
            gigs: state.gigs.map((g) => (g.id === localId ? realGig : g)),
          }));
        }
      } catch {
        // Supabase insert failed -- keep the local optimistic gig
      }
    })();

    return newGig;
  },

  updateGig: (id: string, updates: Partial<Gig>) => {
    set((state) => ({
      gigs: state.gigs.map((g) =>
        g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
      ),
    }));
  },

  // ---------------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------------
  reviews: MOCK_REVIEWS,

  getReviewsByGig: (gigId: string) => {
    return get().reviews.filter((r) => r.gig_id === gigId);
  },

  addReview: (reviewData) => {
    const localId = `review-${Date.now()}`;
    const newReview: Review = {
      ...reviewData,
      id: localId,
      created_at: new Date().toISOString(),
      client: get().user || undefined,
    };
    set((state) => ({
      reviews: [...state.reviews, newReview],
    }));

    // Update the gig's aggregate rating locally
    const gigReviews = get().reviews.filter((r) => r.gig_id === reviewData.gig_id);
    const avgRating = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length;
    get().updateGig(reviewData.gig_id, {
      rating_avg: Math.round(avgRating * 10) / 10,
      review_count: gigReviews.length,
    });

    // Attempt to INSERT into Supabase in the background
    (async () => {
      try {
        await supabase.from('reviews').insert({
          gig_id: reviewData.gig_id,
          order_id: reviewData.order_id,
          client_id: reviewData.client_id,
          provider_id: reviewData.provider_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          provider_response: reviewData.provider_response ?? null,
        });
      } catch {
        // Supabase insert failed -- review stays local only
      }
    })();
  },

  // ---------------------------------------------------------------------------
  // Bookings
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Conversations
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Profiles
  // ---------------------------------------------------------------------------
  profiles: [...MOCK_PROVIDERS, ...MOCK_CLIENTS],

  loadProfiles: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const supabaseProfiles = (data as Record<string, unknown>[]).map(mapSupabaseProfile);
        // Merge: Supabase profiles take precedence; append mock profiles whose
        // ids are not already present so the app always has demo data available.
        const supabaseIds = new Set(supabaseProfiles.map((p) => p.id));
        const mockProfiles = [...MOCK_PROVIDERS, ...MOCK_CLIENTS];
        const mockExtras = mockProfiles.filter((p) => !supabaseIds.has(p.id));
        set({ profiles: [...supabaseProfiles, ...mockExtras] });
      } else {
        // Supabase returned empty -- keep mock data
        set({ profiles: [...MOCK_PROVIDERS, ...MOCK_CLIENTS] });
      }
    } catch {
      // Supabase unavailable -- fall back to mock data
      set({ profiles: [...MOCK_PROVIDERS, ...MOCK_CLIENTS] });
    }
  },

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
