import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Lang = 'en' | 'fr';

interface TranslationSet {
  nav: {
    logo: string;
    searchPlaceholder: string;
    signIn: string;
    joinNow: string;
    createGig: string;
    dashboard: string;
    profile: string;
    orders: string;
    signOut: string;
    messages: string;
    categories: string;
    home: string;
  };
  hero: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allLocations: string;
    search: string;
    stats: {
      professionals: string;
      categories: string;
      jobsDone: string;
    };
  };
  categories: {
    title: string;
    viewAll: string;
    services: string;
    service: string;
  };
  home: {
    topRated: string;
    seeAll: string;
    recentlyAdded: string;
    whyChoose: string;
    verifiedPros: { title: string; desc: string };
    securePayments: { title: string; desc: string };
    honestReviews: { title: string; desc: string };
    quickBooking: { title: string; desc: string };
    readyStart: string;
    readyDesc: string;
    joinClient: string;
    becomeProvider: string;
  };
  auth: {
    signIn: string;
    createAccount: string;
    email: string;
    password: string;
    fullName: string;
    role: string;
    hireServices: string;
    hireDesc: string;
    offerServices: string;
    offerDesc: string;
    noAccount: string;
    haveAccount: string;
    demoClient: string;
    demoProvider: string;
    orTryDemo: string;
    minChars: string;
    fillAll: string;
    welcome: string;
    accountCreated: string;
    invalidCreds: string;
  };
  gig: {
    aboutService: string;
    aboutProvider: string;
    contact: string;
    reviews: string;
    writeReview: string;
    noReviews: string;
    beFirst: string;
    mostPopular: string;
    book: string;
    startingAt: string;
    delivery: string;
    dayDelivery: string;
    secureEscrow: string;
    escrowDesc: string;
    satisfaction: string;
    onTime: string;
    features: string;
    serviceFee: string;
    total: string;
    back: string;
    confirmPay: string;
  };
  booking: {
    bookService: string;
    selectDate: string;
    selectTime: string;
    notesLabel: string;
    notesPlaceholder: string;
    continueToPay: string;
    bookingSummary: string;
    service: string;
    package: string;
    date: string;
    time: string;
    deliveryTime: string;
    priceBreakdown: string;
    servicePrice: string;
    serviceFeeLabel: string;
    escrowNotice: string;
    escrowDesc: string;
    paymentMethod: string;
    mtnMoney: string;
    orangeMoney: string;
    wave: string;
    cashOnDelivery: string;
    payOnCompletion: string;
    selectPayment: string;
    confirmAndPay: string;
    bookingConfirmed: string;
  };
  search: {
    searchServices: string;
    filters: string;
    category: string;
    location: string;
    sortBy: string;
    allCategories: string;
    allLocations: string;
    highestRated: string;
    mostReviews: string;
    priceLow: string;
    priceHigh: string;
    newest: string;
    clearFilters: string;
    servicesFound: string;
    noResults: string;
    noResultsDesc: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
  };
  orders: {
    myOrders: string;
    myJobs: string;
    trackOrders: string;
    manageJobs: string;
    noOrders: string;
    noOrdersClient: string;
    noOrdersProvider: string;
    browseServices: string;
    orderStatus: {
      pending: string;
      paid: string;
      inProgress: string;
      completed: string;
      cancelled: string;
      refunded: string;
    };
    paymentStatus: {
      held: string;
      released: string;
      refunded: string;
    };
    markComplete: string;
    paymentReleased: string;
    awaitingProvider: string;
    totalLabel: string;
    platformFee: string;
    providerGets: string;
    yourEarnings: string;
    dispute: string;
    reportIssue: string;
  };
  messages: {
    title: string;
    noConversations: string;
    startChatting: string;
    selectConversation: string;
    typeMessage: string;
    send: string;
  };
  profile: {
    about: string;
    details: string;
    performance: string;
    rating: string;
    reviewsCount: string;
    completion: string;
    totalEarned: string;
    memberSince: string;
    editProfile: string;
    saveChanges: string;
    cancel: string;
    bio: string;
    phone: string;
    locationLabel: string;
    profileUpdated: string;
    uploadPhoto: string;
  };
  dashboard: {
    welcome: string;
    accountOverview: string;
    balance: string;
    pending: string;
    totalEarnedLabel: string;
    ratingLabel: string;
    activeOrders: string;
    completedLabel: string;
    upcoming: string;
    messagesLabel: string;
    viewAll: string;
    recentActivity: string;
    upcomingBookings: string;
    scheduledServices: string;
    noRecentActivity: string;
    noUpcomingBookings: string;
    yourGigs: string;
    newGig: string;
    availableNow: string;
    emergencyService: string;
  };
  provider: {
    servicesOffered: string;
    recentReviews: string;
    response: string;
    providerNotFound: string;
    verified: string;
    completionRate: string;
    activeGigs: string;
  };
  footer: {
    forClients: string;
    browseServicesLink: string;
    findProfessionals: string;
    howItWorks: string;
    forProviders: string;
    becomeProviderLink: string;
    createGigLink: string;
    successTips: string;
    support: string;
    helpCenter: string;
    trustSafety: string;
    contactUs: string;
    privacy: string;
    terms: string;
    cookies: string;
    copyright: string;
    tagline: string;
  };
  payment: {
    mtnMoney: string;
    orangeMoney: string;
    wave: string;
    cashPayment: string;
    payOnComplete: string;
    installments: string;
    selectMethod: string;
    escrowProtection: string;
    escrowExplain: string;
    fundsHeld: string;
    commission: string;
    processingFee: string;
    providerReceives: string;
  };
  verification: {
    verifiedPro: string;
    govIdVerified: string;
    phoneVerified: string;
    portfolioVerified: string;
    getVerified: string;
    uploadId: string;
    verifyPhone: string;
    uploadPortfolio: string;
  };
  emergency: {
    availableNow: string;
    sameDayService: string;
    emergencyBadge: string;
    urgentRequest: string;
  };
  dispute: {
    reportDispute: string;
    disputeTitle: string;
    disputeDesc: string;
    submitDispute: string;
    disputeSubmitted: string;
    mediationStarted: string;
  };
}

type TranslationKey =
  | `nav.${keyof TranslationSet['nav']}`
  | `hero.${keyof TranslationSet['hero']}`
  | `hero.stats.${keyof TranslationSet['hero']['stats']}`
  | `categories.${keyof TranslationSet['categories']}`
  | `home.${keyof TranslationSet['home']}`
  | `home.verifiedPros.${keyof TranslationSet['home']['verifiedPros']}`
  | `home.securePayments.${keyof TranslationSet['home']['securePayments']}`
  | `home.honestReviews.${keyof TranslationSet['home']['honestReviews']}`
  | `home.quickBooking.${keyof TranslationSet['home']['quickBooking']}`
  | `auth.${keyof TranslationSet['auth']}`
  | `gig.${keyof TranslationSet['gig']}`
  | `booking.${keyof TranslationSet['booking']}`
  | `search.${keyof TranslationSet['search']}`
  | `orders.${keyof TranslationSet['orders']}`
  | `orders.orderStatus.${keyof TranslationSet['orders']['orderStatus']}`
  | `orders.paymentStatus.${keyof TranslationSet['orders']['paymentStatus']}`
  | `messages.${keyof TranslationSet['messages']}`
  | `profile.${keyof TranslationSet['profile']}`
  | `dashboard.${keyof TranslationSet['dashboard']}`
  | `provider.${keyof TranslationSet['provider']}`
  | `footer.${keyof TranslationSet['footer']}`
  | `payment.${keyof TranslationSet['payment']}`
  | `verification.${keyof TranslationSet['verification']}`
  | `emergency.${keyof TranslationSet['emergency']}`
  | `dispute.${keyof TranslationSet['dispute']}`;

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

export const translations: Record<Lang, TranslationSet> = {
  // =======================================================================
  // ENGLISH
  // =======================================================================
  en: {
    nav: {
      logo: 'AfriWork',
      searchPlaceholder: 'Search for a service...',
      signIn: 'Sign In',
      joinNow: 'Join Now',
      createGig: 'Create a Gig',
      dashboard: 'Dashboard',
      profile: 'Profile',
      orders: 'Orders',
      signOut: 'Sign Out',
      messages: 'Messages',
      categories: 'Categories',
      home: 'Home',
    },
    hero: {
      title: 'Find Trusted Professionals for Every Job',
      subtitle:
        'Connect with skilled tradespeople across Cameroon and Ivory Coast. From plumbing to tailoring, get the job done right.',
      searchPlaceholder: 'What service do you need?',
      allLocations: 'All Locations',
      search: 'Search',
      stats: {
        professionals: '500+ Professionals',
        categories: '16+ Categories',
        jobsDone: '10 000+ Jobs Completed',
      },
    },
    categories: {
      title: 'Browse Categories',
      viewAll: 'View All',
      services: 'services',
      service: 'service',
    },
    home: {
      topRated: 'Top Rated Services',
      seeAll: 'See All',
      recentlyAdded: 'Recently Added',
      whyChoose: 'Why Choose AfriWork?',
      verifiedPros: {
        title: 'Verified Professionals',
        desc: 'Every provider is vetted with ID verification, skills assessment, and background checks so you can hire with confidence.',
      },
      securePayments: {
        title: 'Secure Payments',
        desc: 'Pay safely via MTN Mobile Money, Orange Money, or Wave. Funds are held in escrow until the job is done.',
      },
      honestReviews: {
        title: 'Honest Reviews',
        desc: 'Real ratings from real customers help you choose the best professional for your needs.',
      },
      quickBooking: {
        title: 'Quick Booking',
        desc: 'Book a service in minutes. Need someone urgently? Use our same-day emergency option.',
      },
      readyStart: 'Ready to Get Started?',
      readyDesc:
        'Join thousands of clients and service providers already using AfriWork across Cameroon and Ivory Coast.',
      joinClient: 'Join as a Client',
      becomeProvider: 'Become a Provider',
    },
    auth: {
      signIn: 'Sign In',
      createAccount: 'Create Account',
      email: 'Email address',
      password: 'Password',
      fullName: 'Full name',
      role: 'I want to...',
      hireServices: 'Hire Services',
      hireDesc: 'I need to find and book professionals',
      offerServices: 'Offer Services',
      offerDesc: 'I want to offer my skills and get hired',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      demoClient: 'Try as Client',
      demoProvider: 'Try as Provider',
      orTryDemo: 'Or try a demo account',
      minChars: 'Must be at least 6 characters',
      fillAll: 'Please fill in all fields',
      welcome: 'Welcome back!',
      accountCreated: 'Account created successfully!',
      invalidCreds: 'Invalid email or password',
    },
    gig: {
      aboutService: 'About This Service',
      aboutProvider: 'About the Provider',
      contact: 'Contact',
      reviews: 'Reviews',
      writeReview: 'Write a Review',
      noReviews: 'No reviews yet',
      beFirst: 'Be the first to review this service!',
      mostPopular: 'Most Popular',
      book: 'Book Now',
      startingAt: 'Starting at',
      delivery: 'Delivery',
      dayDelivery: 'day delivery',
      secureEscrow: 'Secure Escrow Payment',
      escrowDesc:
        'Your payment is held safely until the job is completed to your satisfaction.',
      satisfaction: 'Satisfaction',
      onTime: 'On-Time',
      features: 'What\'s Included',
      serviceFee: 'Service fee',
      total: 'Total',
      back: 'Back',
      confirmPay: 'Confirm & Pay',
    },
    booking: {
      bookService: 'Book This Service',
      selectDate: 'Select a Date',
      selectTime: 'Select a Time',
      notesLabel: 'Additional Notes',
      notesPlaceholder: 'Describe what you need, special requirements, access details...',
      continueToPay: 'Continue to Payment',
      bookingSummary: 'Booking Summary',
      service: 'Service',
      package: 'Package',
      date: 'Date',
      time: 'Time',
      deliveryTime: 'Delivery Time',
      priceBreakdown: 'Price Breakdown',
      servicePrice: 'Service price',
      serviceFeeLabel: 'Service fee (15%)',
      escrowNotice: 'Escrow Protection',
      escrowDesc:
        'Your payment will be held in escrow and released to the provider only after you confirm the job is complete.',
      paymentMethod: 'Payment Method',
      mtnMoney: 'MTN Mobile Money',
      orangeMoney: 'Orange Money',
      wave: 'Wave',
      cashOnDelivery: 'Cash on Delivery',
      payOnCompletion: 'Pay when the job is done',
      selectPayment: 'Select a payment method',
      confirmAndPay: 'Confirm & Pay',
      bookingConfirmed: 'Booking confirmed! The provider will contact you shortly.',
    },
    search: {
      searchServices: 'Search Services',
      filters: 'Filters',
      category: 'Category',
      location: 'Location',
      sortBy: 'Sort By',
      allCategories: 'All Categories',
      allLocations: 'All Locations',
      highestRated: 'Highest Rated',
      mostReviews: 'Most Reviews',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      newest: 'Newest First',
      clearFilters: 'Clear Filters',
      servicesFound: 'services found',
      noResults: 'No results found',
      noResultsDesc: 'Try adjusting your filters or search for something else.',
      priceRange: 'Price Range',
      minPrice: 'Min price',
      maxPrice: 'Max price',
    },
    orders: {
      myOrders: 'My Orders',
      myJobs: 'My Jobs',
      trackOrders: 'Track your orders and manage bookings',
      manageJobs: 'Manage your jobs and earnings',
      noOrders: 'No orders yet',
      noOrdersClient: 'You haven\'t booked any services yet. Browse available services to get started.',
      noOrdersProvider: 'You don\'t have any jobs yet. Make sure your gigs are published and visible.',
      browseServices: 'Browse Services',
      orderStatus: {
        pending: 'Pending',
        paid: 'Paid',
        inProgress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
        refunded: 'Refunded',
      },
      paymentStatus: {
        held: 'Held in Escrow',
        released: 'Released',
        refunded: 'Refunded',
      },
      markComplete: 'Mark as Complete',
      paymentReleased: 'Payment released to provider',
      awaitingProvider: 'Awaiting provider to start the job',
      totalLabel: 'Total',
      platformFee: 'Platform fee',
      providerGets: 'Provider receives',
      yourEarnings: 'Your earnings',
      dispute: 'Dispute',
      reportIssue: 'Report an Issue',
    },
    messages: {
      title: 'Messages',
      noConversations: 'No conversations yet',
      startChatting: 'Start chatting with a provider or client',
      selectConversation: 'Select a conversation to start messaging',
      typeMessage: 'Type your message...',
      send: 'Send',
    },
    profile: {
      about: 'About',
      details: 'Details',
      performance: 'Performance',
      rating: 'Rating',
      reviewsCount: 'Reviews',
      completion: 'Completion Rate',
      totalEarned: 'Total Earned',
      memberSince: 'Member Since',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      bio: 'Bio',
      phone: 'Phone Number',
      locationLabel: 'Location',
      profileUpdated: 'Profile updated successfully!',
      uploadPhoto: 'Upload Photo',
    },
    dashboard: {
      welcome: 'Welcome back',
      accountOverview: 'Account Overview',
      balance: 'Balance',
      pending: 'Pending',
      totalEarnedLabel: 'Total Earned',
      ratingLabel: 'Rating',
      activeOrders: 'Active Orders',
      completedLabel: 'Completed',
      upcoming: 'Upcoming',
      messagesLabel: 'Messages',
      viewAll: 'View All',
      recentActivity: 'Recent Activity',
      upcomingBookings: 'Upcoming Bookings',
      scheduledServices: 'Scheduled Services',
      noRecentActivity: 'No recent activity',
      noUpcomingBookings: 'No upcoming bookings',
      yourGigs: 'Your Gigs',
      newGig: 'New Gig',
      availableNow: 'Available Now',
      emergencyService: 'Emergency Service',
    },
    provider: {
      servicesOffered: 'Services Offered',
      recentReviews: 'Recent Reviews',
      response: 'Response',
      providerNotFound: 'Provider not found',
      verified: 'Verified',
      completionRate: 'Completion Rate',
      activeGigs: 'Active Gigs',
    },
    footer: {
      forClients: 'For Clients',
      browseServicesLink: 'Browse Services',
      findProfessionals: 'Find Professionals',
      howItWorks: 'How It Works',
      forProviders: 'For Providers',
      becomeProviderLink: 'Become a Provider',
      createGigLink: 'Create a Gig',
      successTips: 'Tips for Success',
      support: 'Support',
      helpCenter: 'Help Center',
      trustSafety: 'Trust & Safety',
      contactUs: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      copyright: '\u00A9 2025 AfriWork. All rights reserved.',
      tagline: 'Connecting skilled professionals with clients across Africa.',
    },
    payment: {
      mtnMoney: 'MTN Mobile Money',
      orangeMoney: 'Orange Money',
      wave: 'Wave',
      cashPayment: 'Cash Payment',
      payOnComplete: 'Pay on Completion',
      installments: 'Pay in Installments',
      selectMethod: 'Select Payment Method',
      escrowProtection: 'Escrow Protection',
      escrowExplain:
        'Your funds are held securely by AfriWork until you confirm the job is complete.',
      fundsHeld: 'Funds held securely',
      commission: 'AfriWork commission (15%)',
      processingFee: 'Processing fee (2%)',
      providerReceives: 'Provider receives',
    },
    verification: {
      verifiedPro: 'Verified Professional',
      govIdVerified: 'Government ID Verified',
      phoneVerified: 'Phone Number Verified',
      portfolioVerified: 'Portfolio Verified',
      getVerified: 'Get Verified',
      uploadId: 'Upload your ID',
      verifyPhone: 'Verify your phone',
      uploadPortfolio: 'Upload your portfolio',
    },
    emergency: {
      availableNow: 'Available Now',
      sameDayService: 'Same-Day Service',
      emergencyBadge: 'Urgent',
      urgentRequest: 'Urgent Request',
    },
    dispute: {
      reportDispute: 'Report a Dispute',
      disputeTitle: 'Dispute Title',
      disputeDesc: 'Describe the issue in detail so we can help resolve it.',
      submitDispute: 'Submit Dispute',
      disputeSubmitted: 'Your dispute has been submitted. Our team will review it shortly.',
      mediationStarted: 'Mediation has started. Both parties will be contacted.',
    },
  },

  // =======================================================================
  // FRENCH
  // =======================================================================
  fr: {
    nav: {
      logo: 'AfriWork',
      searchPlaceholder: 'Rechercher un service...',
      signIn: 'Se connecter',
      joinNow: "S'inscrire",
      createGig: 'Publier un service',
      dashboard: 'Tableau de bord',
      profile: 'Profil',
      orders: 'Commandes',
      signOut: 'Se d\u00E9connecter',
      messages: 'Messages',
      categories: 'Cat\u00E9gories',
      home: 'Accueil',
    },
    hero: {
      title: 'Trouvez des professionnels de confiance pour tous vos travaux',
      subtitle:
        'Mettez-vous en relation avec des artisans qualifi\u00E9s au Cameroun et en C\u00F4te d\u2019Ivoire. De la plomberie \u00E0 la couture, faites r\u00E9aliser vos travaux dans les r\u00E8gles de l\u2019art.',
      searchPlaceholder: 'De quel service avez-vous besoin\u00A0?',
      allLocations: 'Toutes les villes',
      search: 'Rechercher',
      stats: {
        professionals: '500+ Professionnels',
        categories: '16+ Cat\u00E9gories',
        jobsDone: '10 000+ Travaux r\u00E9alis\u00E9s',
      },
    },
    categories: {
      title: 'Parcourir les cat\u00E9gories',
      viewAll: 'Tout voir',
      services: 'services',
      service: 'service',
    },
    home: {
      topRated: 'Services les mieux not\u00E9s',
      seeAll: 'Voir tout',
      recentlyAdded: 'Ajout\u00E9s r\u00E9cemment',
      whyChoose: 'Pourquoi choisir AfriWork\u00A0?',
      verifiedPros: {
        title: 'Professionnels v\u00E9rifi\u00E9s',
        desc: 'Chaque prestataire est contr\u00F4l\u00E9 : v\u00E9rification d\u2019identit\u00E9, \u00E9valuation des comp\u00E9tences et enqu\u00EAte de moralit\u00E9 pour que vous embauchiez en toute confiance.',
      },
      securePayments: {
        title: 'Paiements s\u00E9curis\u00E9s',
        desc: 'Payez en toute s\u00E9curit\u00E9 via MTN Mobile Money, Orange Money ou Wave. Les fonds sont bloqu\u00E9s sous s\u00E9questre jusqu\u2019\u00E0 la fin des travaux.',
      },
      honestReviews: {
        title: 'Avis authentiques',
        desc: 'De vrais avis laiss\u00E9s par de vrais clients pour vous aider \u00E0 choisir le meilleur professionnel.',
      },
      quickBooking: {
        title: 'R\u00E9servation rapide',
        desc: 'R\u00E9servez un service en quelques minutes. Besoin urgent\u00A0? Utilisez notre option d\u2019intervention le jour m\u00EAme.',
      },
      readyStart: 'Pr\u00EAt \u00E0 commencer\u00A0?',
      readyDesc:
        'Rejoignez des milliers de clients et prestataires qui utilisent d\u00E9j\u00E0 AfriWork au Cameroun et en C\u00F4te d\u2019Ivoire.',
      joinClient: 'Rejoindre en tant que client',
      becomeProvider: 'Devenir prestataire',
    },
    auth: {
      signIn: 'Se connecter',
      createAccount: 'Cr\u00E9er un compte',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      fullName: 'Nom complet',
      role: 'Je souhaite...',
      hireServices: 'Engager un prestataire',
      hireDesc: 'Je cherche \u00E0 trouver et r\u00E9server des professionnels',
      offerServices: 'Proposer mes services',
      offerDesc: 'Je veux proposer mes comp\u00E9tences et \u00EAtre embauch\u00E9',
      noAccount: "Vous n'avez pas de compte\u00A0?",
      haveAccount: 'Vous avez d\u00E9j\u00E0 un compte\u00A0?',
      demoClient: 'Essayer en tant que client',
      demoProvider: 'Essayer en tant que prestataire',
      orTryDemo: 'Ou essayez un compte d\u00E9mo',
      minChars: 'Doit contenir au moins 6 caract\u00E8res',
      fillAll: 'Veuillez remplir tous les champs',
      welcome: 'Bon retour parmi nous\u00A0!',
      accountCreated: 'Compte cr\u00E9\u00E9 avec succ\u00E8s\u00A0!',
      invalidCreds: 'Adresse e-mail ou mot de passe incorrect',
    },
    gig: {
      aboutService: '\u00C0 propos de ce service',
      aboutProvider: '\u00C0 propos du prestataire',
      contact: 'Contacter',
      reviews: 'Avis',
      writeReview: 'Laisser un avis',
      noReviews: 'Aucun avis pour le moment',
      beFirst: 'Soyez le premier \u00E0 donner votre avis\u00A0!',
      mostPopular: 'Le plus populaire',
      book: 'R\u00E9server',
      startingAt: '\u00C0 partir de',
      delivery: 'Livraison',
      dayDelivery: 'jour de livraison',
      secureEscrow: 'Paiement s\u00E9curis\u00E9 sous s\u00E9questre',
      escrowDesc:
        'Votre paiement est conserv\u00E9 en toute s\u00E9curit\u00E9 jusqu\u2019\u00E0 ce que le travail soit termin\u00E9 \u00E0 votre satisfaction.',
      satisfaction: 'Satisfaction',
      onTime: 'Ponctualit\u00E9',
      features: 'Ce qui est inclus',
      serviceFee: 'Frais de service',
      total: 'Total',
      back: 'Retour',
      confirmPay: 'Confirmer et payer',
    },
    booking: {
      bookService: 'R\u00E9server ce service',
      selectDate: 'Choisir une date',
      selectTime: 'Choisir une heure',
      notesLabel: 'Notes suppl\u00E9mentaires',
      notesPlaceholder: 'D\u00E9crivez votre besoin, exigences particuli\u00E8res, d\u00E9tails d\u2019acc\u00E8s...',
      continueToPay: 'Continuer vers le paiement',
      bookingSummary: 'R\u00E9capitulatif de la r\u00E9servation',
      service: 'Service',
      package: 'Formule',
      date: 'Date',
      time: 'Heure',
      deliveryTime: 'D\u00E9lai de livraison',
      priceBreakdown: 'D\u00E9tail du prix',
      servicePrice: 'Prix du service',
      serviceFeeLabel: 'Frais de service (15\u00A0%)',
      escrowNotice: 'Protection s\u00E9questre',
      escrowDesc:
        'Votre paiement sera conserv\u00E9 sous s\u00E9questre et vers\u00E9 au prestataire uniquement apr\u00E8s votre confirmation que le travail est termin\u00E9.',
      paymentMethod: 'Mode de paiement',
      mtnMoney: 'MTN Mobile Money',
      orangeMoney: 'Orange Money',
      wave: 'Wave',
      cashOnDelivery: 'Paiement \u00E0 la livraison',
      payOnCompletion: 'Payez une fois le travail termin\u00E9',
      selectPayment: 'Choisissez un mode de paiement',
      confirmAndPay: 'Confirmer et payer',
      bookingConfirmed: 'R\u00E9servation confirm\u00E9e\u00A0! Le prestataire vous contactera sous peu.',
    },
    search: {
      searchServices: 'Rechercher des services',
      filters: 'Filtres',
      category: 'Cat\u00E9gorie',
      location: 'Ville',
      sortBy: 'Trier par',
      allCategories: 'Toutes les cat\u00E9gories',
      allLocations: 'Toutes les villes',
      highestRated: 'Mieux not\u00E9s',
      mostReviews: 'Plus d\u2019avis',
      priceLow: 'Prix\u00A0: croissant',
      priceHigh: 'Prix\u00A0: d\u00E9croissant',
      newest: 'Plus r\u00E9cents',
      clearFilters: 'R\u00E9initialiser les filtres',
      servicesFound: 'services trouv\u00E9s',
      noResults: 'Aucun r\u00E9sultat',
      noResultsDesc: 'Essayez de modifier vos filtres ou recherchez autre chose.',
      priceRange: 'Fourchette de prix',
      minPrice: 'Prix min',
      maxPrice: 'Prix max',
    },
    orders: {
      myOrders: 'Mes commandes',
      myJobs: 'Mes missions',
      trackOrders: 'Suivez vos commandes et g\u00E9rez vos r\u00E9servations',
      manageJobs: 'G\u00E9rez vos missions et vos revenus',
      noOrders: 'Aucune commande',
      noOrdersClient: "Vous n'avez pas encore r\u00E9serv\u00E9 de service. Parcourez les services disponibles pour commencer.",
      noOrdersProvider: "Vous n'avez pas encore de mission. Assurez-vous que vos annonces sont publi\u00E9es et visibles.",
      browseServices: 'Parcourir les services',
      orderStatus: {
        pending: 'En attente',
        paid: 'Pay\u00E9',
        inProgress: 'En cours',
        completed: 'Termin\u00E9',
        cancelled: 'Annul\u00E9',
        refunded: 'Rembours\u00E9',
      },
      paymentStatus: {
        held: 'Sous s\u00E9questre',
        released: 'Lib\u00E9r\u00E9',
        refunded: 'Rembours\u00E9',
      },
      markComplete: 'Marquer comme termin\u00E9',
      paymentReleased: 'Paiement envoy\u00E9 au prestataire',
      awaitingProvider: 'En attente du d\u00E9marrage par le prestataire',
      totalLabel: 'Total',
      platformFee: 'Frais de plateforme',
      providerGets: 'Le prestataire re\u00E7oit',
      yourEarnings: 'Vos revenus',
      dispute: 'Litige',
      reportIssue: 'Signaler un probl\u00E8me',
    },
    messages: {
      title: 'Messages',
      noConversations: 'Aucune conversation',
      startChatting: 'Commencez \u00E0 discuter avec un prestataire ou un client',
      selectConversation: 'S\u00E9lectionnez une conversation pour commencer',
      typeMessage: '\u00C9crivez votre message...',
      send: 'Envoyer',
    },
    profile: {
      about: '\u00C0 propos',
      details: 'Informations',
      performance: 'Performances',
      rating: 'Note',
      reviewsCount: 'Avis',
      completion: 'Taux de r\u00E9alisation',
      totalEarned: 'Total gagn\u00E9',
      memberSince: 'Membre depuis',
      editProfile: 'Modifier le profil',
      saveChanges: 'Enregistrer',
      cancel: 'Annuler',
      bio: 'Bio',
      phone: 'Num\u00E9ro de t\u00E9l\u00E9phone',
      locationLabel: 'Ville',
      profileUpdated: 'Profil mis \u00E0 jour avec succ\u00E8s\u00A0!',
      uploadPhoto: 'Charger une photo',
    },
    dashboard: {
      welcome: 'Bon retour',
      accountOverview: "Vue d'ensemble du compte",
      balance: 'Solde',
      pending: 'En attente',
      totalEarnedLabel: 'Total gagn\u00E9',
      ratingLabel: 'Note',
      activeOrders: 'Commandes en cours',
      completedLabel: 'Termin\u00E9es',
      upcoming: '\u00C0 venir',
      messagesLabel: 'Messages',
      viewAll: 'Tout voir',
      recentActivity: 'Activit\u00E9 r\u00E9cente',
      upcomingBookings: 'R\u00E9servations \u00E0 venir',
      scheduledServices: 'Services planifi\u00E9s',
      noRecentActivity: 'Aucune activit\u00E9 r\u00E9cente',
      noUpcomingBookings: 'Aucune r\u00E9servation \u00E0 venir',
      yourGigs: 'Vos annonces',
      newGig: 'Nouvelle annonce',
      availableNow: 'Disponible maintenant',
      emergencyService: 'Service d\u2019urgence',
    },
    provider: {
      servicesOffered: 'Services propos\u00E9s',
      recentReviews: 'Avis r\u00E9cents',
      response: 'R\u00E9ponse',
      providerNotFound: 'Prestataire introuvable',
      verified: 'V\u00E9rifi\u00E9',
      completionRate: 'Taux de r\u00E9alisation',
      activeGigs: 'Annonces actives',
    },
    footer: {
      forClients: 'Pour les clients',
      browseServicesLink: 'Parcourir les services',
      findProfessionals: 'Trouver des professionnels',
      howItWorks: 'Comment \u00E7a marche',
      forProviders: 'Pour les prestataires',
      becomeProviderLink: 'Devenir prestataire',
      createGigLink: 'Publier un service',
      successTips: 'Conseils pour r\u00E9ussir',
      support: 'Assistance',
      helpCenter: "Centre d'aide",
      trustSafety: 'Confiance et s\u00E9curit\u00E9',
      contactUs: 'Nous contacter',
      privacy: 'Politique de confidentialit\u00E9',
      terms: "Conditions d'utilisation",
      cookies: 'Politique des cookies',
      copyright: '\u00A9 2025 AfriWork. Tous droits r\u00E9serv\u00E9s.',
      tagline: 'Connecter les professionnels qualifi\u00E9s aux clients \u00E0 travers l\u2019Afrique.',
    },
    payment: {
      mtnMoney: 'MTN Mobile Money',
      orangeMoney: 'Orange Money',
      wave: 'Wave',
      cashPayment: 'Paiement en esp\u00E8ces',
      payOnComplete: 'Payer \u00E0 la fin des travaux',
      installments: 'Payer en plusieurs fois',
      selectMethod: 'Choisir le mode de paiement',
      escrowProtection: 'Protection s\u00E9questre',
      escrowExplain:
        'Vos fonds sont conserv\u00E9s en s\u00E9curit\u00E9 par AfriWork jusqu\u2019\u00E0 ce que vous confirmiez que le travail est termin\u00E9.',
      fundsHeld: 'Fonds conserv\u00E9s en s\u00E9curit\u00E9',
      commission: 'Commission AfriWork (15\u00A0%)',
      processingFee: 'Frais de traitement (2\u00A0%)',
      providerReceives: 'Le prestataire re\u00E7oit',
    },
    verification: {
      verifiedPro: 'Professionnel v\u00E9rifi\u00E9',
      govIdVerified: "Pi\u00E8ce d'identit\u00E9 v\u00E9rifi\u00E9e",
      phoneVerified: 'Num\u00E9ro de t\u00E9l\u00E9phone v\u00E9rifi\u00E9',
      portfolioVerified: 'Portfolio v\u00E9rifi\u00E9',
      getVerified: 'Se faire v\u00E9rifier',
      uploadId: "T\u00E9l\u00E9versez votre pi\u00E8ce d'identit\u00E9",
      verifyPhone: 'V\u00E9rifiez votre num\u00E9ro de t\u00E9l\u00E9phone',
      uploadPortfolio: 'T\u00E9l\u00E9versez votre portfolio',
    },
    emergency: {
      availableNow: 'Disponible maintenant',
      sameDayService: 'Service le jour m\u00EAme',
      emergencyBadge: 'Urgent',
      urgentRequest: 'Demande urgente',
    },
    dispute: {
      reportDispute: 'Signaler un litige',
      disputeTitle: 'Titre du litige',
      disputeDesc: 'D\u00E9crivez le probl\u00E8me en d\u00E9tail afin que nous puissions vous aider \u00E0 le r\u00E9soudre.',
      submitDispute: 'Soumettre le litige',
      disputeSubmitted: 'Votre litige a \u00E9t\u00E9 soumis. Notre \u00E9quipe l\u2019examinera sous peu.',
      mediationStarted: 'La m\u00E9diation a commenc\u00E9. Les deux parties seront contact\u00E9es.',
    },
  },
};

// ---------------------------------------------------------------------------
// Price Formatting  (XAF / FCFA)
// ---------------------------------------------------------------------------

/**
 * Format a number as FCFA currency.
 * Uses a non-breaking space as the thousands separator.
 *
 * @example formatPrice(15000)  // "15 000 FCFA"
 * @example formatPrice(1500)   // "1 500 FCFA"
 * @example formatPrice(500)    // "500 FCFA"
 */
export function formatPrice(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}

// ---------------------------------------------------------------------------
// Zustand Store & Hook
// ---------------------------------------------------------------------------

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'fr' as Lang,
      setLang: (lang: Lang) => set({ lang }),
    }),
    { name: 'afriwork-lang' },
  ),
);

/**
 * Resolve a dot-separated key against a nested object.
 *
 * @example resolve(translations.en, 'hero.stats.professionals')
 */
function resolve(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path; // fallback: return the key itself
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

/**
 * React hook for translations.
 *
 * @example
 * const { t, lang, setLang, formatPrice } = useTranslation();
 * <h1>{t('hero.title')}</h1>
 * <span>{formatPrice(15000)}</span>
 * <button onClick={() => setLang('en')}>EN</button>
 */
export function useTranslation() {
  const { lang, setLang } = useI18nStore();

  const t = (key: TranslationKey | (string & {})): string => {
    return resolve(translations[lang] as unknown as Record<string, unknown>, key);
  };

  return { t, lang, setLang, formatPrice } as const;
}
