import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Supabase credentials for admin / service-role operations
// ---------------------------------------------------------------------------
const SUPABASE_URL = 'https://qgdkekczfkelgzzvzbgx.supabase.co';
const ANON_KEY = 'sb_publishable_5CfzJPAOlFAq7qCcb7TCsg_6EqBvbho';
const SERVICE_ROLE_KEY = 'sb_secret_TKLm0phcR6fy2NAO4aiMbQ_LgsLPInQ';

const authHeaders = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

const restHeaders = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// ---------------------------------------------------------------------------
// Helper – pause execution
// ---------------------------------------------------------------------------
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// 15 sample provider definitions
// ---------------------------------------------------------------------------
interface ProviderSeed {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  bio_fr: string;
  location: string;
  country: 'CM' | 'CI';
  is_available_now: boolean;
  offers_emergency: boolean;
}

const PROVIDERS: ProviderSeed[] = [
  // ── Cameroon (8) ──────────────────────────────────────────────────────
  {
    firstName: 'Jean-Paul',
    lastName: 'Mbarga',
    email: 'jean-paul.mbarga@afriwork.test',
    phone: '+237 699 123 456',
    bio: 'Professional plumber with 15 years of experience in Douala. Specializing in emergency leak repairs, pipe installations, and full bathroom renovations. Available 24/7 for urgent calls.',
    bio_fr: 'Plombier professionnel avec 15 ans d\'expérience à Douala. Spécialisé dans les réparations de fuites d\'urgence, les installations de tuyauterie et les rénovations complètes de salles de bain. Disponible 24h/24 pour les urgences.',
    location: 'douala',
    country: 'CM',
    is_available_now: true,
    offers_emergency: true,
  },
  {
    firstName: 'Emmanuel',
    lastName: 'Tchatchoua',
    email: 'emmanuel.tchatchoua@afriwork.test',
    phone: '+237 677 456 789',
    bio: 'Experienced cleaner and home organizer based in Yaounde. Deep cleaning, move-in/move-out services, and regular maintenance using eco-friendly products.',
    bio_fr: 'Nettoyeur expérimenté et organisateur de maison basé à Yaoundé. Nettoyage en profondeur, services de déménagement et entretien régulier avec des produits écologiques.',
    location: 'yaounde',
    country: 'CM',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Grace',
    lastName: 'Nkembe',
    email: 'grace.nkembe@afriwork.test',
    phone: '+237 655 321 987',
    bio: 'Certified childcare provider and makeup artist in Douala. Six years caring for children ages 0-12. Also offer professional event makeup with top-quality products.',
    bio_fr: 'Garde d\'enfants certifiée et maquilleuse à Douala. Six ans d\'expérience avec des enfants de 0 à 12 ans. Maquillage professionnel pour événements avec des produits de qualité.',
    location: 'douala',
    country: 'CM',
    is_available_now: false,
    offers_emergency: true,
  },
  {
    firstName: 'Blaise',
    lastName: 'Nganou',
    email: 'blaise.nganou@afriwork.test',
    phone: '+237 690 654 321',
    bio: 'Creative photographer covering weddings, portraits, and corporate events across the West Region. High-quality editing and same-day preview delivery.',
    bio_fr: 'Photographe créatif couvrant mariages, portraits et événements d\'entreprise dans la Région de l\'Ouest. Montage haute qualité et aperçu livré le jour même.',
    location: 'bafoussam',
    country: 'CM',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Joseph',
    lastName: 'Fotso',
    email: 'joseph.fotso@afriwork.test',
    phone: '+237 670 112 233',
    bio: 'Skilled carpenter specializing in custom furniture, built-in cabinets, and home renovations. Precision craftsmanship with sustainably sourced tropical hardwoods.',
    bio_fr: 'Menuisier qualifié spécialisé dans les meubles sur mesure, placards encastrés et rénovations. Artisanat de précision avec des bois tropicaux durables.',
    location: 'bamenda',
    country: 'CM',
    is_available_now: false,
    offers_emergency: false,
  },
  {
    firstName: 'Marie-Claire',
    lastName: 'Atangana',
    email: 'marie-claire.atangana@afriwork.test',
    phone: '+237 688 901 234',
    bio: 'Landscape gardener and academic tutor in Yaounde. Transform your outdoor space with tropical plants, and help your children excel in school with personalized lessons.',
    bio_fr: 'Jardinière paysagiste et tutrice académique à Yaoundé. Transformez votre espace extérieur avec des plantes tropicales, et aidez vos enfants à exceller avec des cours personnalisés.',
    location: 'yaounde',
    country: 'CM',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Francine',
    lastName: 'Ndjock',
    email: 'francine.ndjock@afriwork.test',
    phone: '+237 656 789 012',
    bio: 'Expert tailor trained in fashion design. Custom suits, wedding dresses, traditional African wear, and professional alterations using premium African fabrics.',
    bio_fr: 'Couturière experte formée en design de mode. Costumes sur mesure, robes de mariée, tenues traditionnelles africaines et retouches professionnelles avec des tissus africains premium.',
    location: 'douala',
    country: 'CM',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Patrick',
    lastName: 'Ekane',
    email: 'patrick.ekane@afriwork.test',
    phone: '+237 674 567 890',
    bio: 'Reliable moving specialist in Limbe and the South-West Region. Residential and commercial relocations with a team of careful movers and proper equipment.',
    bio_fr: 'Spécialiste du déménagement fiable à Limbé et dans la Région du Sud-Ouest. Déménagements résidentiels et commerciaux avec une équipe soigneuse et l\'équipement adapté.',
    location: 'limbe',
    country: 'CM',
    is_available_now: true,
    offers_emergency: true,
  },

  // ── Ivory Coast (7) ───────────────────────────────────────────────────
  {
    firstName: 'Aminata',
    lastName: 'Kouassi',
    email: 'aminata.kouassi@afriwork.test',
    phone: '+225 07 89 12 3456',
    bio: 'Certified electrician and entrepreneur in Abidjan. Residential and commercial wiring, panel upgrades, and solar panel installations. Safety-first approach.',
    bio_fr: 'Électricienne certifiée et entrepreneuse à Abidjan. Câblage résidentiel et commercial, mises à niveau de panneaux et installations solaires. La sécurité avant tout.',
    location: 'abidjan',
    country: 'CI',
    is_available_now: false,
    offers_emergency: true,
  },
  {
    firstName: 'Fatou',
    lastName: 'Diallo',
    email: 'fatou.diallo@afriwork.test',
    phone: '+225 05 67 89 0123',
    bio: 'Personal chef and wellness massage therapist in Bouake. Prepare authentic Ivorian and West African dishes for your events. Also offer relaxing and therapeutic massages.',
    bio_fr: 'Chef à domicile et masseuse bien-être à Bouaké. Préparation de plats authentiques ivoiriens et ouest-africains pour vos événements. Massages relaxants et thérapeutiques.',
    location: 'bouake',
    country: 'CI',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Moussa',
    lastName: 'Ouattara',
    email: 'moussa.ouattara@afriwork.test',
    phone: '+225 07 12 34 5678',
    bio: 'Professional hairdresser and DJ based in Abidjan. Trendy cuts, braids, and styling for men and women. Also provide DJ services for weddings, parties, and corporate events.',
    bio_fr: 'Coiffeur professionnel et DJ basé à Abidjan. Coupes tendance, tresses et coiffures pour hommes et femmes. Services de DJ pour mariages, fêtes et événements d\'entreprise.',
    location: 'abidjan',
    country: 'CI',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Aissatou',
    lastName: 'Bamba',
    email: 'aissatou.bamba@afriwork.test',
    phone: '+225 01 23 45 6789',
    bio: 'Professional house and building painter in Yamoussoukro. Interior and exterior work, decorative finishes, and wallpaper installation. Eco-friendly paints available.',
    bio_fr: 'Peintre professionnelle de maisons et bâtiments à Yamoussoukro. Travaux intérieurs et extérieurs, finitions décoratives et pose de papier peint. Peintures écologiques disponibles.',
    location: 'yamoussoukro',
    country: 'CI',
    is_available_now: true,
    offers_emergency: false,
  },
  {
    firstName: 'Adama',
    lastName: 'Kone',
    email: 'adama.kone@afriwork.test',
    phone: '+225 07 45 67 8901',
    bio: 'Experienced auto mechanic and personal driver in Abidjan. Full engine diagnostics, brakes, oil changes, and AC repair. Also available as a reliable private chauffeur.',
    bio_fr: 'Mécanicien auto expérimenté et chauffeur privé à Abidjan. Diagnostics moteur complets, freins, vidanges et réparation de climatisation. Également disponible comme chauffeur privé fiable.',
    location: 'abidjan',
    country: 'CI',
    is_available_now: true,
    offers_emergency: true,
  },
  {
    firstName: 'Ibrahim',
    lastName: 'Soro',
    email: 'ibrahim.soro@afriwork.test',
    phone: '+225 05 78 90 1234',
    bio: 'Phone and tablet repair specialist in Daloa. Screen replacements, battery swaps, software fixes, and water damage recovery. Quick turnaround on most repairs.',
    bio_fr: 'Spécialiste en réparation de téléphones et tablettes à Daloa. Remplacement d\'écrans, changement de batteries, corrections logicielles et récupération de dégâts des eaux. Délais rapides.',
    location: 'daloa',
    country: 'CI',
    is_available_now: false,
    offers_emergency: true,
  },
  {
    firstName: 'Yao',
    lastName: 'Kouadio',
    email: 'yao.kouadio@afriwork.test',
    phone: '+225 01 56 78 9012',
    bio: 'Professional caterer in San-Pedro. Specializing in Ivorian, West African, and international cuisine for weddings, baptisms, corporate lunches, and private parties.',
    bio_fr: 'Traiteur professionnel à San-Pédro. Spécialisé dans la cuisine ivoirienne, ouest-africaine et internationale pour mariages, baptêmes, déjeuners d\'entreprise et fêtes privées.',
    location: 'san_pedro',
    country: 'CI',
    is_available_now: true,
    offers_emergency: false,
  },
];

// ---------------------------------------------------------------------------
// 20 sample gig definitions (mapped to provider index)
// ---------------------------------------------------------------------------
interface GigSeed {
  providerIndex: number;
  title: string;
  title_fr: string;
  description: string;
  description_fr: string;
  category: string;
  is_emergency: boolean;
  pricing_tiers: {
    name: 'Basic' | 'Standard' | 'Premium';
    price: number;
    description: string;
    description_fr: string;
    delivery_days: number;
    features: string[];
    features_fr: string[];
  }[];
}

const GIGS: GigSeed[] = [
  // 1 ─ Plumbing ─ Jean-Paul Mbarga (0)
  {
    providerIndex: 0,
    title: 'Professional Plumbing Repair & Installation',
    title_fr: 'Réparation et installation de plomberie professionnelle',
    description: 'Expert plumbing services including emergency leak repairs, pipe installation, drain cleaning, toilet and faucet repairs, and water heater installation. All work guaranteed.',
    description_fr: 'Services de plomberie experts incluant les réparations de fuites d\'urgence, l\'installation de tuyauterie, le débouchage, les réparations de toilettes et robinets, et l\'installation de chauffe-eau. Travaux garantis.',
    category: 'plumbing',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 10000, description: 'Simple faucet or toilet repair', description_fr: 'Réparation simple de robinet ou toilette', delivery_days: 1, features: ['Single fixture repair', 'Parts inspection', '30-day warranty'], features_fr: ['Réparation d\'un appareil', 'Inspection des pièces', 'Garantie 30 jours'] },
      { name: 'Standard', price: 35000, description: 'Medium repair or new installation', description_fr: 'Réparation moyenne ou nouvelle installation', delivery_days: 2, features: ['Up to 3 fixtures', 'Full diagnostic', 'Parts included', '90-day warranty'], features_fr: ['Jusqu\'à 3 appareils', 'Diagnostic complet', 'Pièces incluses', 'Garantie 90 jours'] },
      { name: 'Premium', price: 85000, description: 'Full bathroom or kitchen plumbing overhaul', description_fr: 'Rénovation complète plomberie salle de bain ou cuisine', delivery_days: 5, features: ['Complete plumbing overhaul', 'Premium materials', 'Code compliance', '1-year warranty'], features_fr: ['Rénovation plomberie complète', 'Matériaux premium', 'Conformité aux normes', 'Garantie 1 an'] },
    ],
  },

  // 2 ─ Electrical ─ Aminata Kouassi (8)
  {
    providerIndex: 8,
    title: 'Residential & Commercial Electrical Services',
    title_fr: 'Services électriques résidentiels et commerciaux',
    description: 'Certified electrician offering wiring, outlet installation, panel upgrades, and solar setups. Safety-first approach with code-compliant work across Abidjan.',
    description_fr: 'Électricienne certifiée offrant câblage, installation de prises, mises à niveau de panneaux et installations solaires. Travaux conformes aux normes de sécurité dans tout Abidjan.',
    category: 'electrical',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 15000, description: 'Outlet or switch installation', description_fr: 'Installation de prise ou interrupteur', delivery_days: 1, features: ['Single outlet/switch', 'Safety check', '30-day warranty'], features_fr: ['Une prise ou interrupteur', 'Contrôle de sécurité', 'Garantie 30 jours'] },
      { name: 'Standard', price: 40000, description: 'Circuit installation or panel inspection', description_fr: 'Installation de circuit ou inspection de panneau', delivery_days: 3, features: ['Up to 4 circuits', 'Load balancing', 'Code compliance', '90-day warranty'], features_fr: ['Jusqu\'à 4 circuits', 'Équilibrage de charge', 'Conformité normes', 'Garantie 90 jours'] },
      { name: 'Premium', price: 95000, description: 'Full rewiring or solar panel installation', description_fr: 'Recâblage complet ou installation solaire', delivery_days: 7, features: ['Whole-home rewiring', 'Solar panel setup', 'Inverter config', '2-year warranty'], features_fr: ['Recâblage maison entière', 'Installation panneaux solaires', 'Configuration onduleur', 'Garantie 2 ans'] },
    ],
  },

  // 3 ─ Cleaning ─ Emmanuel Tchatchoua (1)
  {
    providerIndex: 1,
    title: 'Deep Cleaning & Home Organization',
    title_fr: 'Nettoyage en profondeur et organisation de maison',
    description: 'Thorough cleaning services for homes and offices in Yaounde. Eco-friendly products, move-in/move-out specials, and regular maintenance plans available.',
    description_fr: 'Services de nettoyage complets pour maisons et bureaux à Yaoundé. Produits écologiques, forfaits déménagement et plans d\'entretien régulier disponibles.',
    category: 'cleaning',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 8000, description: 'Standard 2-bedroom cleaning', description_fr: 'Nettoyage standard appartement 2 chambres', delivery_days: 1, features: ['2 bedrooms', 'Kitchen & bathroom', 'Vacuuming & mopping'], features_fr: ['2 chambres', 'Cuisine et salle de bain', 'Aspirateur et serpillère'] },
      { name: 'Standard', price: 20000, description: 'Deep cleaning for whole home', description_fr: 'Nettoyage en profondeur maison entière', delivery_days: 1, features: ['All rooms deep clean', 'Appliance cleaning', 'Window interiors', 'Eco products'], features_fr: ['Nettoyage profond toutes pièces', 'Nettoyage appareils', 'Vitres intérieures', 'Produits écologiques'] },
      { name: 'Premium', price: 45000, description: 'Deep clean plus full home organization', description_fr: 'Nettoyage profond et organisation complète', delivery_days: 2, features: ['Complete deep clean', 'Closet organization', 'Decluttering', 'Custom storage solutions'], features_fr: ['Nettoyage profond complet', 'Organisation placards', 'Désencombrement', 'Solutions de rangement'] },
    ],
  },

  // 4 ─ Personal Chef ─ Fatou Diallo (9)
  {
    providerIndex: 9,
    title: 'Authentic West African Home Cooking',
    title_fr: 'Cuisine authentique ouest-africaine à domicile',
    description: 'Private chef services featuring traditional Ivorian, Cameroonian, and West African dishes. Perfect for family dinners, small events, and weekly meal prep in Bouake.',
    description_fr: 'Services de chef privé avec des plats traditionnels ivoiriens, camerounais et ouest-africains. Parfait pour dîners en famille, petits événements et préparation de repas hebdomadaires à Bouaké.',
    category: 'personal_chef',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 12000, description: 'Meal for up to 4 people', description_fr: 'Repas pour 4 personnes maximum', delivery_days: 1, features: ['1 main dish', 'Side dishes', 'Ingredients included', 'Cleanup'], features_fr: ['1 plat principal', 'Accompagnements', 'Ingrédients inclus', 'Nettoyage'] },
      { name: 'Standard', price: 30000, description: '3-course meal for up to 10 people', description_fr: 'Menu 3 plats pour 10 personnes maximum', delivery_days: 1, features: ['Starter + main + dessert', 'Up to 10 guests', 'Fresh market ingredients', 'Full service'], features_fr: ['Entrée + plat + dessert', 'Jusqu\'à 10 convives', 'Ingrédients frais du marché', 'Service complet'] },
      { name: 'Premium', price: 75000, description: 'Full event catering for up to 30 guests', description_fr: 'Traiteur événementiel pour 30 convives', delivery_days: 2, features: ['Customized menu', 'Up to 30 guests', 'Appetizers + 2 mains + dessert', 'Professional service staff'], features_fr: ['Menu personnalisé', 'Jusqu\'à 30 convives', 'Amuse-bouches + 2 plats + dessert', 'Personnel de service professionnel'] },
    ],
  },

  // 5 ─ Babysitter ─ Grace Nkembe (2)
  {
    providerIndex: 2,
    title: 'Reliable Babysitting & Childcare',
    title_fr: 'Garde d\'enfants fiable et professionnelle',
    description: 'Caring and experienced babysitter in Douala. Available for daytime, evening, and weekend childcare for ages 0-12. First-aid certified with excellent references.',
    description_fr: 'Garde d\'enfants attentionnée et expérimentée à Douala. Disponible en journée, soirée et week-end pour enfants de 0 à 12 ans. Certifiée premiers secours avec d\'excellentes références.',
    category: 'babysitter',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 5000, description: 'Half-day babysitting (up to 4 hours)', description_fr: 'Garde demi-journée (jusqu\'à 4 heures)', delivery_days: 1, features: ['Up to 2 children', '4-hour session', 'Activities & games', 'Snack prep'], features_fr: ['Jusqu\'à 2 enfants', 'Séance de 4 heures', 'Activités et jeux', 'Préparation du goûter'] },
      { name: 'Standard', price: 10000, description: 'Full-day babysitting (up to 8 hours)', description_fr: 'Garde journée complète (jusqu\'à 8 heures)', delivery_days: 1, features: ['Up to 3 children', '8-hour session', 'Meal preparation', 'Homework help', 'Daily report'], features_fr: ['Jusqu\'à 3 enfants', 'Séance de 8 heures', 'Préparation des repas', 'Aide aux devoirs', 'Rapport quotidien'] },
      { name: 'Premium', price: 35000, description: 'Weekly package (5 days, 6 hours/day)', description_fr: 'Forfait semaine (5 jours, 6h/jour)', delivery_days: 5, features: ['Up to 3 children', '30 hours total', 'Educational activities', 'Meal prep', 'Transport to school'], features_fr: ['Jusqu\'à 3 enfants', '30 heures au total', 'Activités éducatives', 'Préparation repas', 'Transport à l\'école'] },
    ],
  },

  // 6 ─ Hairdressing ─ Moussa Ouattara (10)
  {
    providerIndex: 10,
    title: 'Trendy Hairdressing & Braiding',
    title_fr: 'Coiffure tendance et tresses',
    description: 'Professional hair styling for men and women in Abidjan. Braids, weaves, natural hair care, cuts, and coloring. At your home or at the salon. Always on-trend.',
    description_fr: 'Coiffure professionnelle pour hommes et femmes à Abidjan. Tresses, tissages, soins cheveux naturels, coupes et colorations. À domicile ou en salon. Toujours à la mode.',
    category: 'hairdressing',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 5000, description: 'Simple cut or basic styling', description_fr: 'Coupe simple ou coiffure basique', delivery_days: 1, features: ['Haircut or trim', 'Wash & blow-dry', 'Style consultation'], features_fr: ['Coupe ou rafraîchissement', 'Lavage et brushing', 'Conseil coiffure'] },
      { name: 'Standard', price: 15000, description: 'Braids, weave, or coloring', description_fr: 'Tresses, tissage ou coloration', delivery_days: 1, features: ['Full braids or weave', 'Coloring available', 'Hair treatment', 'Styling'], features_fr: ['Tresses ou tissage complet', 'Coloration disponible', 'Soin capillaire', 'Mise en forme'] },
      { name: 'Premium', price: 35000, description: 'Bridal or event hair package', description_fr: 'Forfait coiffure mariage ou événement', delivery_days: 1, features: ['Custom event style', 'Trial session included', 'Hair accessories', 'Touch-up on event day'], features_fr: ['Coiffure événementielle sur mesure', 'Séance d\'essai incluse', 'Accessoires cheveux', 'Retouche le jour J'] },
    ],
  },

  // 7 ─ Photography ─ Blaise Nganou (3)
  {
    providerIndex: 3,
    title: 'Professional Photography & Videography',
    title_fr: 'Photographie et vidéographie professionnelles',
    description: 'Capture your special moments with stunning photos and videos. Weddings, portraits, corporate events, and product shoots across the West Region of Cameroon.',
    description_fr: 'Capturez vos moments spéciaux avec des photos et vidéos magnifiques. Mariages, portraits, événements d\'entreprise et photos de produits dans la Région de l\'Ouest du Cameroun.',
    category: 'photography',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 15000, description: 'Portrait or product session (1 hour)', description_fr: 'Séance portrait ou produit (1 heure)', delivery_days: 3, features: ['1-hour session', '20 edited photos', 'Digital delivery', '1 location'], features_fr: ['Séance d\'1 heure', '20 photos retouchées', 'Livraison numérique', '1 lieu'] },
      { name: 'Standard', price: 40000, description: 'Event coverage (up to 4 hours)', description_fr: 'Couverture événement (jusqu\'à 4 heures)', delivery_days: 5, features: ['4-hour coverage', '100+ edited photos', 'Online gallery', 'Same-day preview'], features_fr: ['Couverture de 4 heures', '100+ photos retouchées', 'Galerie en ligne', 'Aperçu le jour même'] },
      { name: 'Premium', price: 100000, description: 'Full wedding or event package (8+ hours)', description_fr: 'Forfait mariage ou événement complet (8h+)', delivery_days: 14, features: ['Full-day coverage', '300+ edited photos', 'Highlight video', 'Photo album', 'Second shooter'], features_fr: ['Couverture journée entière', '300+ photos retouchées', 'Vidéo résumé', 'Album photo', 'Second photographe'] },
    ],
  },

  // 8 ─ Painting ─ Aissatou Bamba (11)
  {
    providerIndex: 11,
    title: 'Interior & Exterior House Painting',
    title_fr: 'Peinture intérieure et extérieure de maison',
    description: 'Professional painting services in Yamoussoukro. Expert color consultation, thorough surface preparation, and flawless application for homes and commercial spaces.',
    description_fr: 'Services de peinture professionnels à Yamoussoukro. Consultation couleur, préparation minutieuse des surfaces et application impeccable pour maisons et espaces commerciaux.',
    category: 'painting',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 12000, description: 'Single room painting (up to 4x4 m)', description_fr: 'Peinture d\'une pièce (jusqu\'à 4x4 m)', delivery_days: 1, features: ['1 room', 'Wall preparation', 'Two coats', 'Paint included'], features_fr: ['1 pièce', 'Préparation des murs', 'Deux couches', 'Peinture incluse'] },
      { name: 'Standard', price: 35000, description: 'Multi-room painting (up to 3 rooms)', description_fr: 'Peinture multi-pièces (jusqu\'à 3 pièces)', delivery_days: 3, features: ['Up to 3 rooms', 'Color consultation', 'Trim painting', 'Premium paint'], features_fr: ['Jusqu\'à 3 pièces', 'Conseil couleur', 'Peinture boiseries', 'Peinture premium'] },
      { name: 'Premium', price: 90000, description: 'Whole house interior and exterior', description_fr: 'Maison entière intérieur et extérieur', delivery_days: 7, features: ['Whole house', 'Surface repair', 'Decorative finishes', 'Premium paint', '3-year warranty'], features_fr: ['Maison entière', 'Réparation surfaces', 'Finitions décoratives', 'Peinture premium', 'Garantie 3 ans'] },
    ],
  },

  // 9 ─ Carpentry ─ Joseph Fotso (4)
  {
    providerIndex: 4,
    title: 'Custom Carpentry & Furniture Building',
    title_fr: 'Menuiserie sur mesure et fabrication de meubles',
    description: 'Handcrafted woodworking in Bamenda. Custom shelving, built-in cabinetry, furniture repair, and bespoke pieces using sustainably sourced tropical hardwoods.',
    description_fr: 'Menuiserie artisanale à Bamenda. Étagères sur mesure, placards encastrés, réparation de meubles et pièces uniques avec des bois tropicaux durables.',
    category: 'carpentry',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 10000, description: 'Furniture repair or small project', description_fr: 'Réparation de meuble ou petit projet', delivery_days: 2, features: ['Furniture repair', 'Shelf installation', 'Wood stain match'], features_fr: ['Réparation meuble', 'Installation étagère', 'Teinte bois assortie'] },
      { name: 'Standard', price: 40000, description: 'Custom shelving or small furniture piece', description_fr: 'Étagère ou petit meuble sur mesure', delivery_days: 7, features: ['Custom design', 'Quality hardwood', 'Finishing included', 'Delivery & install'], features_fr: ['Design personnalisé', 'Bois dur de qualité', 'Finition incluse', 'Livraison et installation'] },
      { name: 'Premium', price: 100000, description: 'Built-in cabinetry or large furniture', description_fr: 'Placards encastrés ou grand meuble', delivery_days: 14, features: ['Full custom build', 'Premium materials', '3D design preview', 'Installation', '5-year warranty'], features_fr: ['Construction sur mesure', 'Matériaux premium', 'Aperçu design 3D', 'Installation', 'Garantie 5 ans'] },
    ],
  },

  // 10 ─ Auto Repair ─ Adama Kone (12)
  {
    providerIndex: 12,
    title: 'Complete Auto Repair & Maintenance',
    title_fr: 'Réparation et entretien automobile complet',
    description: 'Full-service auto repair in Abidjan with transparent pricing. Engine diagnostics, brake service, oil changes, tire rotation, and AC repair. Honest work guaranteed.',
    description_fr: 'Réparation automobile complète à Abidjan avec tarification transparente. Diagnostics moteur, freins, vidanges, rotation des pneus et réparation climatisation. Travail honnête garanti.',
    category: 'auto_repair',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 8000, description: 'Oil change and basic inspection', description_fr: 'Vidange et inspection de base', delivery_days: 1, features: ['Oil & filter change', '23-point inspection', 'Fluid top-off'], features_fr: ['Changement d\'huile et filtre', 'Inspection 23 points', 'Complément de liquides'] },
      { name: 'Standard', price: 30000, description: 'Brake service or engine tune-up', description_fr: 'Service de freins ou mise au point moteur', delivery_days: 2, features: ['Full brake service', 'Diagnostic scan', 'Parts included', '6-month warranty'], features_fr: ['Service freins complet', 'Scan diagnostic', 'Pièces incluses', 'Garantie 6 mois'] },
      { name: 'Premium', price: 80000, description: 'Major engine or transmission repair', description_fr: 'Réparation majeure moteur ou transmission', delivery_days: 5, features: ['Engine/transmission work', 'OEM parts', 'Full diagnostic', '1-year warranty'], features_fr: ['Travail moteur/transmission', 'Pièces d\'origine', 'Diagnostic complet', 'Garantie 1 an'] },
    ],
  },

  // 11 ─ Gardening ─ Marie-Claire Atangana (5)
  {
    providerIndex: 5,
    title: 'Garden Design & Landscape Maintenance',
    title_fr: 'Design de jardin et entretien paysager',
    description: 'Transform your outdoor space in Yaounde. Tropical plant landscaping, vegetable gardens, lawn care, and complete yard makeovers. Sustainable, low-maintenance designs.',
    description_fr: 'Transformez votre espace extérieur à Yaoundé. Aménagement paysager tropical, potagers, entretien de pelouse et rénovations complètes. Designs durables et peu exigeants.',
    category: 'gardening',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 8000, description: 'Garden consultation and small planting', description_fr: 'Consultation jardin et petite plantation', delivery_days: 1, features: ['1-hour consultation', 'Plant selection guide', 'Small bed planting'], features_fr: ['Consultation d\'1 heure', 'Guide de sélection plantes', 'Plantation petit parterre'] },
      { name: 'Standard', price: 25000, description: 'Medium garden design and installation', description_fr: 'Design et installation jardin moyen', delivery_days: 4, features: ['Custom design plan', 'Up to 50 m²', 'Plants included', 'Irrigation setup'], features_fr: ['Plan de design', 'Jusqu\'à 50 m²', 'Plantes incluses', 'Installation irrigation'] },
      { name: 'Premium', price: 70000, description: 'Complete landscape transformation', description_fr: 'Transformation paysagère complète', delivery_days: 10, features: ['Full yard design', 'Hardscaping', 'Irrigation system', 'Lighting', '6-month plant guarantee'], features_fr: ['Design complet de la cour', 'Aménagement dur', 'Système d\'irrigation', 'Éclairage', 'Garantie plantes 6 mois'] },
    ],
  },

  // 12 ─ Phone Repair ─ Ibrahim Soro (13)
  {
    providerIndex: 13,
    title: 'Smartphone & Tablet Repair',
    title_fr: 'Réparation de smartphones et tablettes',
    description: 'Fast and reliable phone repair in Daloa. Screen replacements, battery swaps, charging port fixes, software troubleshooting, and water damage recovery.',
    description_fr: 'Réparation rapide et fiable de téléphones à Daloa. Remplacement d\'écrans, changement de batteries, réparation de ports de charge, dépannage logiciel et récupération après dégâts des eaux.',
    category: 'phone_repair',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 5000, description: 'Software fix or diagnostic', description_fr: 'Correction logicielle ou diagnostic', delivery_days: 1, features: ['Full diagnostic', 'Software reset', 'Data backup', 'Virus removal'], features_fr: ['Diagnostic complet', 'Réinitialisation logicielle', 'Sauvegarde données', 'Suppression virus'] },
      { name: 'Standard', price: 15000, description: 'Screen or battery replacement', description_fr: 'Remplacement écran ou batterie', delivery_days: 1, features: ['Screen replacement', 'Battery swap', 'Quality parts', '90-day warranty'], features_fr: ['Remplacement d\'écran', 'Changement de batterie', 'Pièces de qualité', 'Garantie 90 jours'] },
      { name: 'Premium', price: 30000, description: 'Motherboard repair or water damage', description_fr: 'Réparation carte mère ou dégâts des eaux', delivery_days: 3, features: ['Motherboard repair', 'Water damage recovery', 'Data recovery', '6-month warranty'], features_fr: ['Réparation carte mère', 'Récupération dégâts des eaux', 'Récupération données', 'Garantie 6 mois'] },
    ],
  },

  // 13 ─ Tailoring ─ Francine Ndjock (6)
  {
    providerIndex: 6,
    title: 'Custom Tailoring & Traditional African Wear',
    title_fr: 'Couture sur mesure et tenues traditionnelles africaines',
    description: 'Expert tailoring in Douala. Custom suits, dresses, traditional boubous and pagne outfits, wedding attire, and professional alterations with premium African fabrics.',
    description_fr: 'Couture experte à Douala. Costumes, robes, boubous et tenues en pagne sur mesure, tenues de mariage et retouches professionnelles avec des tissus africains de qualité.',
    category: 'tailoring',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 5000, description: 'Simple alterations (hem, buttons, seams)', description_fr: 'Retouches simples (ourlet, boutons, coutures)', delivery_days: 2, features: ['Basic hemming', 'Button replacement', 'Seam repair'], features_fr: ['Ourlet basique', 'Remplacement boutons', 'Réparation coutures'] },
      { name: 'Standard', price: 20000, description: 'Custom outfit or complex alteration', description_fr: 'Tenue sur mesure ou retouche complexe', delivery_days: 7, features: ['Full garment creation', 'Custom fitting', 'Quality fabric', 'One revision'], features_fr: ['Création de vêtement', 'Ajustement sur mesure', 'Tissu de qualité', 'Une retouche'] },
      { name: 'Premium', price: 60000, description: 'Traditional or wedding outfit package', description_fr: 'Forfait tenue traditionnelle ou mariage', delivery_days: 21, features: ['Custom measurements', 'Fabric selection', 'Multiple fittings', 'Hand-finished details', 'Unlimited revisions'], features_fr: ['Mesures personnalisées', 'Sélection du tissu', 'Plusieurs essayages', 'Finitions à la main', 'Retouches illimitées'] },
    ],
  },

  // 14 ─ Catering ─ Yao Kouadio (14)
  {
    providerIndex: 14,
    title: 'Professional Event Catering',
    title_fr: 'Service traiteur professionnel pour événements',
    description: 'Full-service catering in San-Pedro for weddings, baptisms, corporate lunches, and private parties. Ivorian, West African, and international cuisine with impeccable presentation.',
    description_fr: 'Service traiteur complet à San-Pédro pour mariages, baptêmes, déjeuners d\'entreprise et fêtes privées. Cuisine ivoirienne, ouest-africaine et internationale avec une présentation impeccable.',
    category: 'catering',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 15000, description: 'Buffet for up to 20 guests', description_fr: 'Buffet pour 20 convives maximum', delivery_days: 2, features: ['3 main dishes', 'Side dishes', 'Drinks included', 'Setup & cleanup'], features_fr: ['3 plats principaux', 'Accompagnements', 'Boissons incluses', 'Installation et nettoyage'] },
      { name: 'Standard', price: 40000, description: 'Full service for up to 50 guests', description_fr: 'Service complet pour 50 convives maximum', delivery_days: 3, features: ['Custom menu', 'Appetizers + mains + dessert', 'Wait staff', 'Table setup'], features_fr: ['Menu personnalisé', 'Entrées + plats + dessert', 'Personnel de service', 'Mise en place tables'] },
      { name: 'Premium', price: 100000, description: 'Grand event catering for 100+ guests', description_fr: 'Traiteur grand événement pour 100+ convives', delivery_days: 5, features: ['5-course menu', '100+ guests', 'Full staff team', 'Decoration', 'Bar service'], features_fr: ['Menu 5 services', '100+ convives', 'Équipe complète', 'Décoration', 'Service bar'] },
    ],
  },

  // 15 ─ Moving ─ Patrick Ekane (7)
  {
    providerIndex: 7,
    title: 'Residential & Commercial Moving Services',
    title_fr: 'Déménagement résidentiel et commercial',
    description: 'Professional moving services in Limbe and the South-West Region. Careful handling, packing supplies, disassembly/reassembly, and on-time delivery. Fully insured team.',
    description_fr: 'Services de déménagement professionnels à Limbé et dans le Sud-Ouest. Manipulation soigneuse, fournitures d\'emballage, démontage/remontage et livraison ponctuelle. Équipe assurée.',
    category: 'moving',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 15000, description: 'Studio or small apartment move', description_fr: 'Déménagement studio ou petit appartement', delivery_days: 1, features: ['1 truck + 2 movers', 'Up to 2 hours', 'Basic packing', 'Local move'], features_fr: ['1 camion + 2 déménageurs', 'Jusqu\'à 2 heures', 'Emballage basique', 'Déménagement local'] },
      { name: 'Standard', price: 35000, description: '2-3 bedroom home move', description_fr: 'Déménagement maison 2-3 chambres', delivery_days: 1, features: ['1 truck + 4 movers', 'Packing materials', 'Furniture disassembly', 'Same-day delivery'], features_fr: ['1 camion + 4 déménageurs', 'Matériaux d\'emballage', 'Démontage meubles', 'Livraison le jour même'] },
      { name: 'Premium', price: 80000, description: 'Large home or office move', description_fr: 'Déménagement grande maison ou bureau', delivery_days: 2, features: ['2 trucks + 6 movers', 'Full packing service', 'Furniture protection', 'Assembly at destination', 'Insurance coverage'], features_fr: ['2 camions + 6 déménageurs', 'Service d\'emballage complet', 'Protection meubles', 'Montage à destination', 'Couverture assurance'] },
    ],
  },

  // 16 ─ Makeup ─ Grace Nkembe (2) – second gig
  {
    providerIndex: 2,
    title: 'Professional Event Makeup',
    title_fr: 'Maquillage professionnel pour événements',
    description: 'Look stunning for any event with professional makeup in Douala. Bridal, party, editorial, and everyday glam using top-quality products suited for all skin tones.',
    description_fr: 'Soyez sublime pour tout événement avec un maquillage professionnel à Douala. Mariée, fête, éditorial et glamour quotidien avec des produits haut de gamme adaptés à toutes les carnations.',
    category: 'makeup',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 8000, description: 'Natural everyday makeup', description_fr: 'Maquillage naturel quotidien', delivery_days: 1, features: ['Light foundation', 'Eye makeup', 'Lip color', 'Setting spray'], features_fr: ['Fond de teint léger', 'Maquillage yeux', 'Couleur lèvres', 'Spray fixateur'] },
      { name: 'Standard', price: 20000, description: 'Full event or party makeup', description_fr: 'Maquillage complet événement ou fête', delivery_days: 1, features: ['Full-face makeup', 'False lashes', 'Contouring', 'Touch-up kit'], features_fr: ['Maquillage visage complet', 'Faux cils', 'Contouring', 'Kit de retouche'] },
      { name: 'Premium', price: 50000, description: 'Bridal makeup with trial', description_fr: 'Maquillage mariée avec essai', delivery_days: 1, features: ['Trial session', 'Bridal makeup', 'Bridesmaids discount', 'Airbrush technique', 'All-day touch-ups'], features_fr: ['Séance d\'essai', 'Maquillage mariée', 'Réduction demoiselles d\'honneur', 'Technique airbrush', 'Retouches toute la journée'] },
    ],
  },

  // 17 ─ DJ ─ Moussa Ouattara (10) – second gig
  {
    providerIndex: 10,
    title: 'DJ & Music for Events',
    title_fr: 'DJ et musique pour événements',
    description: 'Energize your event with professional DJ services in Abidjan. Weddings, parties, corporate events, and club nights. Afrobeats, coupé-décalé, dancehall, and international hits.',
    description_fr: 'Dynamisez votre événement avec un DJ professionnel à Abidjan. Mariages, fêtes, événements d\'entreprise et soirées. Afrobeats, coupé-décalé, dancehall et tubes internationaux.',
    category: 'dj',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 15000, description: 'Small party DJ set (up to 3 hours)', description_fr: 'DJ set petite fête (jusqu\'à 3 heures)', delivery_days: 1, features: ['3-hour set', 'Basic sound system', 'Song requests', 'Custom playlist'], features_fr: ['Set de 3 heures', 'Sono basique', 'Demandes musicales', 'Playlist personnalisée'] },
      { name: 'Standard', price: 35000, description: 'Full event DJ (up to 6 hours)', description_fr: 'DJ événement complet (jusqu\'à 6 heures)', delivery_days: 1, features: ['6-hour set', 'Professional sound', 'Lighting effects', 'MC services', 'Wireless mic'], features_fr: ['Set de 6 heures', 'Sono professionnelle', 'Effets lumineux', 'Services MC', 'Micro sans fil'] },
      { name: 'Premium', price: 80000, description: 'Wedding or grand event package (10+ hours)', description_fr: 'Forfait mariage ou grand événement (10h+)', delivery_days: 1, features: ['10+ hour coverage', 'Premium sound system', 'Dance floor lighting', 'Live mixing', 'Backup equipment', 'MC + coordinator'], features_fr: ['Couverture 10h+', 'Sono premium', 'Éclairage piste de danse', 'Mix live', 'Équipement de secours', 'MC + coordinateur'] },
    ],
  },

  // 18 ─ Tutoring ─ Marie-Claire Atangana (5) – second gig
  {
    providerIndex: 5,
    title: 'Academic Tutoring for All Levels',
    title_fr: 'Cours particuliers tous niveaux',
    description: 'Personalized academic support in Yaounde. Maths, science, French, English, and exam preparation for primary, secondary, and university students. At home or online.',
    description_fr: 'Soutien scolaire personnalisé à Yaoundé. Mathématiques, sciences, français, anglais et préparation aux examens pour primaire, secondaire et universitaire. À domicile ou en ligne.',
    category: 'tutoring',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 5000, description: 'Single 1-hour tutoring session', description_fr: 'Séance unique d\'1 heure', delivery_days: 1, features: ['1-hour session', 'One subject', 'Homework help', 'Progress tips'], features_fr: ['Séance d\'1 heure', 'Une matière', 'Aide aux devoirs', 'Conseils de progrès'] },
      { name: 'Standard', price: 18000, description: 'Weekly package (4 sessions)', description_fr: 'Forfait hebdomadaire (4 séances)', delivery_days: 7, features: ['4 x 1-hour sessions', 'Up to 2 subjects', 'Study plan', 'Practice exercises'], features_fr: ['4 séances d\'1 heure', 'Jusqu\'à 2 matières', 'Plan d\'études', 'Exercices pratiques'] },
      { name: 'Premium', price: 40000, description: 'Monthly intensive (16 sessions)', description_fr: 'Intensif mensuel (16 séances)', delivery_days: 30, features: ['16 x 1-hour sessions', 'All subjects', 'Exam prep', 'Weekly progress report', 'Parent meetings'], features_fr: ['16 séances d\'1 heure', 'Toutes matières', 'Préparation examens', 'Rapport de progrès hebdomadaire', 'Réunions parents'] },
    ],
  },

  // 19 ─ Massage ─ Fatou Diallo (9) – second gig
  {
    providerIndex: 9,
    title: 'Relaxation & Therapeutic Massage',
    title_fr: 'Massage relaxant et thérapeutique',
    description: 'Restore your body and mind with professional massage in Bouake. Swedish, deep tissue, sports massage, and traditional African techniques. At your home or office.',
    description_fr: 'Restaurez votre corps et votre esprit avec un massage professionnel à Bouaké. Suédois, tissus profonds, massage sportif et techniques traditionnelles africaines. À domicile ou au bureau.',
    category: 'massage',
    is_emergency: false,
    pricing_tiers: [
      { name: 'Basic', price: 8000, description: '30-minute relaxation massage', description_fr: 'Massage relaxant de 30 minutes', delivery_days: 1, features: ['30-min session', 'Swedish technique', 'Essential oils', 'Neck & shoulders focus'], features_fr: ['Séance de 30 min', 'Technique suédoise', 'Huiles essentielles', 'Focus nuque et épaules'] },
      { name: 'Standard', price: 15000, description: '60-minute full-body massage', description_fr: 'Massage corps entier de 60 minutes', delivery_days: 1, features: ['60-min session', 'Full body', 'Choice of technique', 'Hot towel treatment'], features_fr: ['Séance de 60 min', 'Corps entier', 'Choix de technique', 'Traitement serviettes chaudes'] },
      { name: 'Premium', price: 35000, description: '90-minute premium spa experience', description_fr: 'Expérience spa premium de 90 minutes', delivery_days: 1, features: ['90-min session', 'Deep tissue + relaxation', 'Aromatherapy', 'Hot stones', 'Face massage included'], features_fr: ['Séance de 90 min', 'Tissus profonds + relaxation', 'Aromathérapie', 'Pierres chaudes', 'Massage visage inclus'] },
    ],
  },

  // 20 ─ Driver ─ Adama Kone (12) – second gig
  {
    providerIndex: 12,
    title: 'Reliable Personal Driver & Transport',
    title_fr: 'Chauffeur privé et transport fiable',
    description: 'Safe, punctual private driver in Abidjan. Airport transfers, city tours, corporate transport, and daily commute services. Clean vehicle and professional service.',
    description_fr: 'Chauffeur privé sûr et ponctuel à Abidjan. Transferts aéroport, tours de ville, transport d\'entreprise et trajets quotidiens. Véhicule propre et service professionnel.',
    category: 'driver',
    is_emergency: true,
    pricing_tiers: [
      { name: 'Basic', price: 5000, description: 'Single trip within the city', description_fr: 'Trajet unique en ville', delivery_days: 1, features: ['One-way trip', 'Air-conditioned vehicle', 'Door-to-door', 'Flexible pickup'], features_fr: ['Trajet aller simple', 'Véhicule climatisé', 'Porte à porte', 'Prise en charge flexible'] },
      { name: 'Standard', price: 15000, description: 'Half-day hire (up to 5 hours)', description_fr: 'Location demi-journée (jusqu\'à 5 heures)', delivery_days: 1, features: ['5-hour hire', 'Multiple stops', 'Waiting time included', 'AC vehicle'], features_fr: ['Location 5 heures', 'Arrêts multiples', 'Temps d\'attente inclus', 'Véhicule climatisé'] },
      { name: 'Premium', price: 30000, description: 'Full-day hire (up to 10 hours)', description_fr: 'Location journée complète (jusqu\'à 10 heures)', delivery_days: 1, features: ['10-hour hire', 'Unlimited stops', 'Airport transfers', 'Premium vehicle', 'Fuel included'], features_fr: ['Location 10 heures', 'Arrêts illimités', 'Transferts aéroport', 'Véhicule premium', 'Carburant inclus'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
export async function seedDatabase(): Promise<{
  success: boolean;
  message: string;
  usersCreated: number;
  gigsCreated: number;
}> {
  let usersCreated = 0;
  let gigsCreated = 0;
  const providerIds: string[] = [];

  try {
    // ── Step 1 : Create 15 provider auth accounts ──────────────────────
    console.log('=== AfriWork Seed: Creating 15 provider accounts ===');

    for (const provider of PROVIDERS) {
      const fullName = `${provider.firstName} ${provider.lastName}`;
      console.log(`  Creating user: ${fullName} (${provider.email})`);

      const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          email: provider.email,
          password: 'AfriWork2024!',
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: 'provider',
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`    Failed to create ${fullName}: ${err}`);
        continue;
      }

      const data = await res.json();
      const userId = data.id;
      providerIds.push(userId);
      usersCreated++;
      console.log(`    Created with id ${userId}`);
    }

    console.log(`\n  Total users created: ${usersCreated}/${PROVIDERS.length}`);

    if (usersCreated === 0) {
      return {
        success: false,
        message: 'No users were created. Check Supabase credentials and admin endpoint.',
        usersCreated: 0,
        gigsCreated: 0,
      };
    }

    // ── Step 2 : Wait for trigger, then update profiles ────────────────
    console.log('\n=== Waiting 1 second for profile trigger ===');
    await sleep(1000);

    console.log('=== Updating provider profiles ===');

    for (let i = 0; i < providerIds.length; i++) {
      const provider = PROVIDERS[i];
      const userId = providerIds[i];
      const fullName = `${provider.firstName} ${provider.lastName}`;
      console.log(`  Updating profile: ${fullName}`);

      const profilePayload: Record<string, unknown> = {
        phone: provider.phone,
        bio: provider.bio,
        bio_fr: provider.bio_fr,
        location: provider.location,
        country: provider.country,
        is_available_now: provider.is_available_now,
        offers_emergency: provider.offers_emergency,
      };

      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: restHeaders,
          body: JSON.stringify(profilePayload),
        }
      );

      if (!profileRes.ok) {
        const err = await profileRes.text();
        console.error(`    Failed to update profile for ${fullName}: ${err}`);
      } else {
        console.log(`    Profile updated for ${fullName}`);
      }
    }

    // ── Step 3 : Create 20 gigs ────────────────────────────────────────
    console.log('\n=== Creating 20 sample gigs ===');

    for (const gig of GIGS) {
      // Resolve the provider id from the index
      if (gig.providerIndex >= providerIds.length) {
        console.warn(`    Skipping gig "${gig.title}" — provider index ${gig.providerIndex} out of range`);
        continue;
      }

      const providerId = providerIds[gig.providerIndex];
      const providerLocation = PROVIDERS[gig.providerIndex].location;

      console.log(`  Creating gig: ${gig.title}`);

      const gigPayload = {
        provider_id: providerId,
        title: gig.title,
        title_fr: gig.title_fr,
        description: gig.description,
        description_fr: gig.description_fr,
        category: gig.category,
        location: providerLocation,
        pricing_tiers: gig.pricing_tiers,
        is_emergency: gig.is_emergency,
        is_active: true,
        photos: [],
        video_urls: [],
      };

      const gigRes = await fetch(`${SUPABASE_URL}/rest/v1/gigs`, {
        method: 'POST',
        headers: restHeaders,
        body: JSON.stringify(gigPayload),
      });

      if (!gigRes.ok) {
        const err = await gigRes.text();
        console.error(`    Failed to create gig "${gig.title}": ${err}`);
      } else {
        gigsCreated++;
        console.log(`    Gig created: ${gig.title}`);
      }
    }

    console.log(`\n  Total gigs created: ${gigsCreated}/${GIGS.length}`);

    // ── Done ───────────────────────────────────────────────────────────
    const message = `Seed complete: ${usersCreated} users and ${gigsCreated} gigs created.`;
    console.log(`\n=== ${message} ===`);

    return {
      success: true,
      message,
      usersCreated,
      gigsCreated,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Seed failed: ${errMsg}`);
    return {
      success: false,
      message: `Seed failed: ${errMsg}`,
      usersCreated,
      gigsCreated,
    };
  }
}
