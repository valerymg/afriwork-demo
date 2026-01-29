import type { Category, LocationOption } from '../types';

export const PLATFORM_FEE_RATE = 0.12;
export const PROCESSING_FEE_RATE = 0.02;
export const CURRENCY = 'FCFA';
export const CURRENCY_CODE = 'XAF';

export const CATEGORIES: Category[] = [
  // --- Home & Building Trades ---
  { id: 'plumbing', name: 'Plumbing', name_fr: 'Plomberie', icon: '🔧', description: 'Pipes, fixtures, and water systems', description_fr: 'Tuyaux, robinets et systèmes d\'eau', color: 'bg-blue-100 text-blue-700' },
  { id: 'electrical', name: 'Electrical', name_fr: 'Électricité', icon: '⚡', description: 'Wiring, installations, and repairs', description_fr: 'Câblage, installations et réparations', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'carpentry', name: 'Carpentry', name_fr: 'Menuiserie', icon: '🪚', description: 'Woodwork, furniture, and framing', description_fr: 'Bois, meubles et charpente', color: 'bg-amber-100 text-amber-700' },
  { id: 'painting', name: 'Painting', name_fr: 'Peinture', icon: '🎨', description: 'Interior and exterior painting', description_fr: 'Peinture intérieure et extérieure', color: 'bg-purple-100 text-purple-700' },
  { id: 'masonry', name: 'Masonry', name_fr: 'Maçonnerie', icon: '🧱', description: 'Brickwork, concrete, and stone', description_fr: 'Briques, béton et pierre', color: 'bg-orange-100 text-orange-700' },
  { id: 'welding', name: 'Welding', name_fr: 'Soudure', icon: '🔥', description: 'Metal fabrication and repair', description_fr: 'Fabrication et réparation de métaux', color: 'bg-red-100 text-red-700' },
  { id: 'roofing', name: 'Roofing', name_fr: 'Toiture', icon: '🏠', description: 'Roof installation and repairs', description_fr: 'Installation et réparation de toitures', color: 'bg-slate-100 text-slate-700' },
  { id: 'tiling', name: 'Tiling', name_fr: 'Carrelage', icon: '🔲', description: 'Floor and wall tiling', description_fr: 'Carrelage de sols et murs', color: 'bg-teal-100 text-teal-700' },
  { id: 'ironwork', name: 'Ironwork', name_fr: 'Ferronnerie', icon: '⚒️', description: 'Gates, grills, and metal structures', description_fr: 'Portails, grilles et structures métalliques', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'glass_work', name: 'Glass & Mirrors', name_fr: 'Vitrerie & Miroiterie', icon: '🪟', description: 'Window, glass, and mirror installation', description_fr: 'Installation de vitres, glaces et miroirs', color: 'bg-sky-100 text-sky-700' },
  { id: 'flooring', name: 'Flooring', name_fr: 'Revêtement de Sol', icon: '🏗️', description: 'Hardwood, laminate, and vinyl flooring', description_fr: 'Parquet, stratifié et sols vinyle', color: 'bg-stone-100 text-stone-700' },
  { id: 'insulation', name: 'Insulation', name_fr: 'Isolation', icon: '🧊', description: 'Thermal and sound insulation', description_fr: 'Isolation thermique et acoustique', color: 'bg-blue-100 text-blue-700' },
  { id: 'aluminium', name: 'Aluminium Works', name_fr: 'Aluminium & Baies Vitrées', icon: '🪟', description: 'Aluminium doors, windows, and frames', description_fr: 'Portes, fenêtres et cadres en aluminium', color: 'bg-gray-100 text-gray-700' },
  // --- Cleaning & Home Care ---
  { id: 'cleaning', name: 'Cleaning', name_fr: 'Nettoyage', icon: '🧹', description: 'Home and office cleaning services', description_fr: 'Nettoyage de maison et bureau', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'laundry', name: 'Laundry & Ironing', name_fr: 'Lessive & Repassage', icon: '👔', description: 'Wash, dry-clean, and iron clothes', description_fr: 'Lavage, pressing et repassage', color: 'bg-violet-100 text-violet-700' },
  { id: 'pest_control', name: 'Pest Control', name_fr: 'Désinsectisation', icon: '🐜', description: 'Insect and rodent extermination', description_fr: 'Extermination d\'insectes et rongeurs', color: 'bg-lime-100 text-lime-700' },
  { id: 'fumigation', name: 'Fumigation', name_fr: 'Fumigation', icon: '💨', description: 'Deep fumigation for homes and offices', description_fr: 'Fumigation profonde maisons et bureaux', color: 'bg-gray-100 text-gray-700' },
  { id: 'waste_removal', name: 'Waste Removal', name_fr: 'Enlèvement de Déchets', icon: '🗑️', description: 'Junk removal and waste disposal', description_fr: 'Enlèvement d\'ordures et déchets', color: 'bg-zinc-100 text-zinc-700' },
  { id: 'water_delivery', name: 'Water Delivery', name_fr: 'Livraison d\'Eau', icon: '🚰', description: 'Drinking water tank delivery', description_fr: 'Livraison de citernes d\'eau potable', color: 'bg-blue-100 text-blue-700' },
  // --- Automotive & Transport ---
  { id: 'auto_repair', name: 'Auto Repair', name_fr: 'Mécanique Auto', icon: '🚗', description: 'Vehicle maintenance and repair', description_fr: 'Entretien et réparation de véhicules', color: 'bg-gray-100 text-gray-700' },
  { id: 'moto_repair', name: 'Motorcycle Repair', name_fr: 'Réparation Moto', icon: '🏍️', description: 'Motorcycle and scooter servicing', description_fr: 'Entretien de motos et scooters', color: 'bg-neutral-100 text-neutral-700' },
  { id: 'driver', name: 'Personal Driver', name_fr: 'Chauffeur Privé', icon: '🚕', description: 'Private chauffeur and transport', description_fr: 'Chauffeur privé et transport', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'moving', name: 'Moving', name_fr: 'Déménagement', icon: '📦', description: 'Relocation and hauling services', description_fr: 'Déménagement et transport', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'delivery', name: 'Delivery & Errands', name_fr: 'Livraison & Courses', icon: '🛵', description: 'Package delivery and errand running', description_fr: 'Livraison de colis et courses', color: 'bg-orange-100 text-orange-700' },
  { id: 'car_wash', name: 'Car Wash', name_fr: 'Lavage Auto', icon: '🧽', description: 'Mobile and station car cleaning', description_fr: 'Nettoyage auto mobile et en station', color: 'bg-blue-100 text-blue-700' },
  // --- Personal Care & Beauty ---
  { id: 'hairdressing', name: 'Hairdressing', name_fr: 'Coiffure', icon: '💇', description: 'Hair styling and care', description_fr: 'Coiffure et soins capillaires', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'barbering', name: 'Barbering', name_fr: 'Barbier', icon: '✂️', description: 'Men\'s haircuts, shaves, and grooming', description_fr: 'Coupes hommes, rasage et soins', color: 'bg-slate-100 text-slate-700' },
  { id: 'makeup', name: 'Makeup Artist', name_fr: 'Maquillage', icon: '💄', description: 'Professional makeup for events', description_fr: 'Maquillage professionnel pour événements', color: 'bg-pink-100 text-pink-700' },
  { id: 'nails', name: 'Nail Technician', name_fr: 'Manucure & Pédicure', icon: '💅', description: 'Manicure, pedicure, and nail art', description_fr: 'Manucure, pédicure et nail art', color: 'bg-rose-100 text-rose-700' },
  { id: 'massage', name: 'Massage & Spa', name_fr: 'Massage & Spa', icon: '💆', description: 'Relaxation and therapeutic massage', description_fr: 'Massage relaxant et thérapeutique', color: 'bg-green-100 text-green-700' },
  { id: 'tailoring', name: 'Tailoring', name_fr: 'Couture', icon: '🧵', description: 'Custom clothing and alterations', description_fr: 'Vêtements sur mesure et retouches', color: 'bg-pink-100 text-pink-700' },
  // --- Food & Cooking ---
  { id: 'personal_chef', name: 'Personal Chef', name_fr: 'Chef à Domicile', icon: '👨‍🍳', description: 'Home-cooked meals by a private chef', description_fr: 'Repas préparés par un chef privé', color: 'bg-amber-100 text-amber-700' },
  { id: 'catering', name: 'Catering', name_fr: 'Traiteur', icon: '🍽️', description: 'Event and party catering services', description_fr: 'Services traiteur pour événements et fêtes', color: 'bg-orange-100 text-orange-700' },
  { id: 'baking', name: 'Baking & Pastry', name_fr: 'Pâtisserie & Boulangerie', icon: '🎂', description: 'Custom cakes, pastries, and bread', description_fr: 'Gâteaux sur commande et pâtisseries', color: 'bg-yellow-100 text-yellow-700' },
  // --- Childcare & Education ---
  { id: 'babysitter', name: 'Babysitter', name_fr: 'Garde d\'Enfants', icon: '👶', description: 'Childcare and babysitting services', description_fr: 'Garde d\'enfants et babysitting', color: 'bg-sky-100 text-sky-700' },
  { id: 'nanny', name: 'Nanny', name_fr: 'Nounou', icon: '🤱', description: 'Full-time or part-time nanny services', description_fr: 'Nounou à temps plein ou partiel', color: 'bg-blue-100 text-blue-700' },
  { id: 'tutoring', name: 'Tutoring', name_fr: 'Cours Particuliers', icon: '📚', description: 'Academic tutoring for all levels', description_fr: 'Soutien scolaire tous niveaux', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'music_lessons', name: 'Music Lessons', name_fr: 'Cours de Musique', icon: '🎵', description: 'Guitar, piano, drums, and vocal coaching', description_fr: 'Guitare, piano, batterie et chant', color: 'bg-purple-100 text-purple-700' },
  { id: 'language_lessons', name: 'Language Lessons', name_fr: 'Cours de Langues', icon: '🗣️', description: 'French, English, and local languages', description_fr: 'Français, anglais et langues locales', color: 'bg-teal-100 text-teal-700' },
  // --- Health & Wellness ---
  { id: 'fitness', name: 'Personal Trainer', name_fr: 'Coach Sportif', icon: '🏋️', description: 'Home fitness training and coaching', description_fr: 'Coaching sportif à domicile', color: 'bg-red-100 text-red-700' },
  { id: 'elderly_care', name: 'Elderly Care', name_fr: 'Aide aux Personnes Âgées', icon: '🧓', description: 'Home care for seniors', description_fr: 'Aide à domicile pour personnes âgées', color: 'bg-amber-100 text-amber-700' },
  { id: 'nursing', name: 'Home Nursing', name_fr: 'Soins Infirmiers', icon: '🩺', description: 'At-home nursing and health care', description_fr: 'Soins infirmiers à domicile', color: 'bg-red-100 text-red-700' },
  // --- Garden & Agriculture ---
  { id: 'gardening', name: 'Gardening', name_fr: 'Jardinage', icon: '🌱', description: 'Landscaping and garden maintenance', description_fr: 'Aménagement et entretien de jardins', color: 'bg-green-100 text-green-700' },
  { id: 'farming', name: 'Farming', name_fr: 'Agriculture', icon: '🌾', description: 'Agricultural services and consulting', description_fr: 'Services agricoles et conseil', color: 'bg-lime-100 text-lime-700' },
  { id: 'tree_service', name: 'Tree Service', name_fr: 'Élagage & Abattage', icon: '🌳', description: 'Tree trimming, pruning, and removal', description_fr: 'Taille, élagage et abattage d\'arbres', color: 'bg-emerald-100 text-emerald-700' },
  // --- Technology & Digital ---
  { id: 'phone_repair', name: 'Phone Repair', name_fr: 'Réparation Téléphone', icon: '📱', description: 'Smartphone and tablet repairs', description_fr: 'Réparation de smartphones et tablettes', color: 'bg-gray-100 text-gray-700' },
  { id: 'computer_repair', name: 'Computer Repair', name_fr: 'Réparation Ordinateur', icon: '💻', description: 'PC, laptop, and printer repairs', description_fr: 'Réparation PC, laptop et imprimantes', color: 'bg-slate-100 text-slate-700' },
  { id: 'cctv', name: 'CCTV & Security', name_fr: 'Vidéosurveillance', icon: '📹', description: 'Security camera installation', description_fr: 'Installation de caméras de surveillance', color: 'bg-zinc-100 text-zinc-700' },
  { id: 'solar', name: 'Solar Installation', name_fr: 'Installation Solaire', icon: '☀️', description: 'Solar panels and inverter setup', description_fr: 'Panneaux solaires et onduleurs', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'satellite_tv', name: 'Satellite & TV', name_fr: 'Satellite & TV', icon: '📡', description: 'Satellite dish and TV installation', description_fr: 'Installation parabole et téléviseur', color: 'bg-blue-100 text-blue-700' },
  { id: 'networking', name: 'Internet & WiFi', name_fr: 'Internet & WiFi', icon: '🌐', description: 'Network setup and WiFi installation', description_fr: 'Installation réseau et WiFi', color: 'bg-indigo-100 text-indigo-700' },
  // --- Events & Entertainment ---
  { id: 'photography', name: 'Photography', name_fr: 'Photographie', icon: '📸', description: 'Professional photo and video shoots', description_fr: 'Photos et vidéos professionnelles', color: 'bg-violet-100 text-violet-700' },
  { id: 'dj', name: 'DJ & Music', name_fr: 'DJ & Musique', icon: '🎧', description: 'DJ services for parties and events', description_fr: 'DJ pour fêtes et événements', color: 'bg-purple-100 text-purple-700' },
  { id: 'event_planning', name: 'Event Planning', name_fr: 'Organisation d\'Événements', icon: '🎪', description: 'Wedding, party, and event coordination', description_fr: 'Mariages, fêtes et événements', color: 'bg-pink-100 text-pink-700' },
  { id: 'decoration', name: 'Decoration', name_fr: 'Décoration', icon: '🎀', description: 'Interior and event decoration', description_fr: 'Décoration intérieure et événementielle', color: 'bg-rose-100 text-rose-700' },
  { id: 'sound_rental', name: 'Sound & Lighting', name_fr: 'Sonorisation & Éclairage', icon: '🔊', description: 'Sound system and lighting rental', description_fr: 'Location sono et éclairage', color: 'bg-amber-100 text-amber-700' },
];

export const LOCATIONS: LocationOption[] = [
  // Cameroon
  { id: 'douala', name: 'Douala', country: 'CM', region: 'Littoral' },
  { id: 'yaounde', name: 'Yaoundé', country: 'CM', region: 'Centre' },
  { id: 'bafoussam', name: 'Bafoussam', country: 'CM', region: 'Ouest' },
  { id: 'bamenda', name: 'Bamenda', country: 'CM', region: 'Nord-Ouest' },
  { id: 'garoua', name: 'Garoua', country: 'CM', region: 'Nord' },
  { id: 'maroua', name: 'Maroua', country: 'CM', region: 'Extrême-Nord' },
  { id: 'limbe', name: 'Limbé', country: 'CM', region: 'Sud-Ouest' },
  { id: 'buea', name: 'Buea', country: 'CM', region: 'Sud-Ouest' },
  { id: 'kribi', name: 'Kribi', country: 'CM', region: 'Sud' },
  { id: 'ngaoundere', name: 'Ngaoundéré', country: 'CM', region: 'Adamaoua' },
  // Ivory Coast
  { id: 'abidjan', name: 'Abidjan', country: 'CI', region: 'Lagunes' },
  { id: 'bouake', name: 'Bouaké', country: 'CI', region: 'Vallée du Bandama' },
  { id: 'yamoussoukro', name: 'Yamoussoukro', country: 'CI', region: 'Lacs' },
  { id: 'san_pedro', name: 'San-Pédro', country: 'CI', region: 'Bas-Sassandra' },
  { id: 'daloa', name: 'Daloa', country: 'CI', region: 'Haut-Sassandra' },
  { id: 'korhogo', name: 'Korhogo', country: 'CI', region: 'Savanes' },
  { id: 'man', name: 'Man', country: 'CI', region: 'Tonkpi' },
  { id: 'gagnoa', name: 'Gagnoa', country: 'CI', region: 'Gôh' },
];

export const COUNTRIES = [
  { code: 'CM', name: 'Cameroon', name_fr: 'Cameroun', flag: '🇨🇲' },
  { code: 'CI', name: 'Ivory Coast', name_fr: 'Côte d\'Ivoire', flag: '🇨🇮' },
];

export const PAYMENT_METHODS = [
  { id: 'mtn_money' as const, name: 'MTN Mobile Money', name_fr: 'MTN Mobile Money', icon: '📱', color: 'bg-yellow-100 text-yellow-800', countries: ['CM', 'CI'] },
  { id: 'orange_money' as const, name: 'Orange Money', name_fr: 'Orange Money', icon: '📲', color: 'bg-orange-100 text-orange-800', countries: ['CM', 'CI'] },
  { id: 'wave' as const, name: 'Wave', name_fr: 'Wave', icon: '🌊', color: 'bg-blue-100 text-blue-800', countries: ['CI'] },
  { id: 'cash' as const, name: 'Cash on Completion', name_fr: 'Paiement en espèces', icon: '💵', color: 'bg-green-100 text-green-800', countries: ['CM', 'CI'] },
  { id: 'pay_on_completion' as const, name: 'Pay on Delivery', name_fr: 'Payer à la livraison', icon: '🤝', color: 'bg-purple-100 text-purple-800', countries: ['CM', 'CI'] },
  { id: 'installments' as const, name: 'Installment Plan', name_fr: 'Paiement échelonné', icon: '📅', color: 'bg-indigo-100 text-indigo-800', countries: ['CM', 'CI'] },
];

export const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
];

export const ESCROW_STEPS = [
  { key: 'order', en: 'Client places order', fr: 'Le client passe commande' },
  { key: 'payment', en: 'Payment held in escrow', fr: 'Paiement retenu en séquestre' },
  { key: 'commission', en: 'Commission deducted (12%)', fr: 'Commission déduite (12%)' },
  { key: 'notify', en: 'Provider notified', fr: 'Prestataire notifié' },
  { key: 'work', en: 'Provider completes work', fr: 'Le prestataire effectue le travail' },
  { key: 'review', en: 'Client reviews (3-7 days)', fr: 'Le client valide (3-7 jours)' },
  { key: 'release', en: 'Payment released to provider', fr: 'Paiement libéré au prestataire' },
  { key: 'dispute', en: 'Or: Dispute mediation', fr: 'Ou : Médiation en cas de litige' },
];
