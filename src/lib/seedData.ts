import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase admin client (service role key bypasses RLS)
// ---------------------------------------------------------------------------
const SUPABASE_URL = 'https://qgdkekczfkelgzzvzbgx.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_TKLm0phcR6fy2NAO4aiMbQ_LgsLPInQ';

const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// 15 sample providers
// ---------------------------------------------------------------------------
interface ProviderSeed {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  country: 'CM' | 'CI';
  is_available_now: boolean;
  offers_emergency: boolean;
}

const PROVIDERS: ProviderSeed[] = [
  { firstName: 'Jean-Paul', lastName: 'Mbarga', email: 'jean-paul.mbarga@afriwork.test', phone: '+237 699 123 456', bio: 'Plombier professionnel avec 15 ans d\'expérience à Douala. Disponible 24h/24 pour les urgences.', location: 'douala', country: 'CM', is_available_now: true, offers_emergency: true },
  { firstName: 'Emmanuel', lastName: 'Tchatchoua', email: 'emmanuel.tchatchoua@afriwork.test', phone: '+237 677 456 789', bio: 'Nettoyeur expérimenté à Yaoundé. Nettoyage en profondeur avec produits écologiques.', location: 'yaounde', country: 'CM', is_available_now: true, offers_emergency: false },
  { firstName: 'Grace', lastName: 'Nkembe', email: 'grace.nkembe@afriwork.test', phone: '+237 655 321 987', bio: 'Garde d\'enfants certifiée et maquilleuse à Douala. 6 ans d\'expérience.', location: 'douala', country: 'CM', is_available_now: false, offers_emergency: true },
  { firstName: 'Blaise', lastName: 'Nganou', email: 'blaise.nganou@afriwork.test', phone: '+237 690 654 321', bio: 'Photographe créatif couvrant mariages et événements dans l\'Ouest.', location: 'bafoussam', country: 'CM', is_available_now: true, offers_emergency: false },
  { firstName: 'Joseph', lastName: 'Fotso', email: 'joseph.fotso@afriwork.test', phone: '+237 670 112 233', bio: 'Menuisier qualifié, meubles sur mesure et bois tropicaux durables.', location: 'bamenda', country: 'CM', is_available_now: false, offers_emergency: false },
  { firstName: 'Marie-Claire', lastName: 'Atangana', email: 'marie-claire.atangana@afriwork.test', phone: '+237 688 901 234', bio: 'Jardinière paysagiste et tutrice académique à Yaoundé.', location: 'yaounde', country: 'CM', is_available_now: true, offers_emergency: false },
  { firstName: 'Francine', lastName: 'Ndjock', email: 'francine.ndjock@afriwork.test', phone: '+237 656 789 012', bio: 'Couturière experte. Costumes, robes de mariée, tenues traditionnelles.', location: 'douala', country: 'CM', is_available_now: true, offers_emergency: false },
  { firstName: 'Patrick', lastName: 'Ekane', email: 'patrick.ekane@afriwork.test', phone: '+237 674 567 890', bio: 'Spécialiste du déménagement fiable à Limbé et Sud-Ouest.', location: 'limbe', country: 'CM', is_available_now: true, offers_emergency: true },
  { firstName: 'Aminata', lastName: 'Kouassi', email: 'aminata.kouassi@afriwork.test', phone: '+225 07 89 12 3456', bio: 'Électricienne certifiée à Abidjan. Câblage et installations solaires.', location: 'abidjan', country: 'CI', is_available_now: false, offers_emergency: true },
  { firstName: 'Fatou', lastName: 'Diallo', email: 'fatou.diallo@afriwork.test', phone: '+225 05 67 89 0123', bio: 'Chef à domicile et masseuse bien-être à Bouaké.', location: 'bouake', country: 'CI', is_available_now: true, offers_emergency: false },
  { firstName: 'Moussa', lastName: 'Ouattara', email: 'moussa.ouattara@afriwork.test', phone: '+225 07 12 34 5678', bio: 'Coiffeur professionnel et DJ à Abidjan.', location: 'abidjan', country: 'CI', is_available_now: true, offers_emergency: false },
  { firstName: 'Aissatou', lastName: 'Bamba', email: 'aissatou.bamba@afriwork.test', phone: '+225 01 23 45 6789', bio: 'Peintre professionnelle à Yamoussoukro. Peintures écologiques.', location: 'yamoussoukro', country: 'CI', is_available_now: true, offers_emergency: false },
  { firstName: 'Adama', lastName: 'Kone', email: 'adama.kone@afriwork.test', phone: '+225 07 45 67 8901', bio: 'Mécanicien auto et chauffeur privé à Abidjan.', location: 'abidjan', country: 'CI', is_available_now: true, offers_emergency: true },
  { firstName: 'Ibrahim', lastName: 'Soro', email: 'ibrahim.soro@afriwork.test', phone: '+225 05 78 90 1234', bio: 'Réparation de téléphones et tablettes à Daloa.', location: 'daloa', country: 'CI', is_available_now: false, offers_emergency: true },
  { firstName: 'Yao', lastName: 'Kouadio', email: 'yao.kouadio@afriwork.test', phone: '+225 01 56 78 9012', bio: 'Traiteur professionnel à San-Pédro.', location: 'san_pedro', country: 'CI', is_available_now: true, offers_emergency: false },
];

// ---------------------------------------------------------------------------
// 20 sample gigs
// ---------------------------------------------------------------------------
interface GigSeed {
  providerIndex: number;
  title: string;
  title_fr: string;
  description: string;
  description_fr: string;
  category: string;
  is_emergency: boolean;
  pricing_tiers: { name: string; price: number; description: string; description_fr: string; delivery_days: number; features: string[]; features_fr: string[] }[];
}

const GIGS: GigSeed[] = [
  { providerIndex: 0, title: 'Professional Plumbing Repair & Installation', title_fr: 'Réparation et installation de plomberie', description: 'Expert plumbing: leak repairs, pipe installations, bathroom renovations. 24/7 emergency service.', description_fr: 'Plomberie experte : réparations de fuites, installations de tuyauterie, rénovations de salles de bain. Urgences 24h/24.', category: 'plumbing', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 10000, description: 'Simple repair', description_fr: 'Réparation simple', delivery_days: 1, features: ['Single fixture', '30-day warranty'], features_fr: ['Un appareil', 'Garantie 30 jours'] },
    { name: 'Standard', price: 35000, description: 'Medium repair', description_fr: 'Réparation moyenne', delivery_days: 2, features: ['Up to 3 fixtures', 'Parts included', '90-day warranty'], features_fr: ['Jusqu\'à 3 appareils', 'Pièces incluses', 'Garantie 90 jours'] },
    { name: 'Premium', price: 85000, description: 'Full overhaul', description_fr: 'Rénovation complète', delivery_days: 5, features: ['Complete plumbing', 'Premium materials', '1-year warranty'], features_fr: ['Plomberie complète', 'Matériaux premium', 'Garantie 1 an'] },
  ]},
  { providerIndex: 8, title: 'Electrical Services & Solar Installation', title_fr: 'Services électriques et installation solaire', description: 'Certified electrician: wiring, panels, solar setups across Abidjan.', description_fr: 'Électricienne certifiée : câblage, panneaux, installations solaires à Abidjan.', category: 'electrical', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 15000, description: 'Outlet installation', description_fr: 'Installation de prise', delivery_days: 1, features: ['Single outlet', 'Safety check'], features_fr: ['Une prise', 'Contrôle sécurité'] },
    { name: 'Standard', price: 40000, description: 'Circuit work', description_fr: 'Travaux de circuit', delivery_days: 3, features: ['Up to 4 circuits', 'Code compliance'], features_fr: ['Jusqu\'à 4 circuits', 'Conformité normes'] },
    { name: 'Premium', price: 95000, description: 'Full rewiring or solar', description_fr: 'Recâblage ou solaire', delivery_days: 7, features: ['Whole-home rewiring', 'Solar setup', '2-year warranty'], features_fr: ['Recâblage complet', 'Installation solaire', 'Garantie 2 ans'] },
  ]},
  { providerIndex: 1, title: 'Deep Cleaning & Home Organization', title_fr: 'Nettoyage en profondeur et organisation', description: 'Thorough cleaning for homes and offices in Yaounde. Eco-friendly products.', description_fr: 'Nettoyage complet pour maisons et bureaux à Yaoundé. Produits écologiques.', category: 'cleaning', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 8000, description: '2-bedroom cleaning', description_fr: 'Nettoyage 2 chambres', delivery_days: 1, features: ['2 bedrooms', 'Kitchen & bath'], features_fr: ['2 chambres', 'Cuisine et bain'] },
    { name: 'Standard', price: 20000, description: 'Whole home deep clean', description_fr: 'Nettoyage profond maison', delivery_days: 1, features: ['All rooms', 'Appliances', 'Eco products'], features_fr: ['Toutes pièces', 'Appareils', 'Produits écologiques'] },
    { name: 'Premium', price: 45000, description: 'Deep clean + organization', description_fr: 'Nettoyage + organisation', delivery_days: 2, features: ['Deep clean', 'Closet organization', 'Storage solutions'], features_fr: ['Nettoyage profond', 'Organisation placards', 'Solutions rangement'] },
  ]},
  { providerIndex: 9, title: 'Authentic West African Home Cooking', title_fr: 'Cuisine ouest-africaine à domicile', description: 'Private chef: traditional Ivorian and West African dishes for events.', description_fr: 'Chef privé : plats traditionnels ivoiriens et ouest-africains pour événements.', category: 'personal_chef', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 12000, description: 'Meal for 4', description_fr: 'Repas pour 4', delivery_days: 1, features: ['1 main dish', 'Ingredients included'], features_fr: ['1 plat principal', 'Ingrédients inclus'] },
    { name: 'Standard', price: 30000, description: '3-course for 10', description_fr: 'Menu 3 plats pour 10', delivery_days: 1, features: ['Starter + main + dessert', 'Up to 10 guests'], features_fr: ['Entrée + plat + dessert', 'Jusqu\'à 10 convives'] },
    { name: 'Premium', price: 75000, description: 'Event catering 30 guests', description_fr: 'Traiteur événement 30 personnes', delivery_days: 2, features: ['Custom menu', 'Up to 30 guests', 'Service staff'], features_fr: ['Menu personnalisé', 'Jusqu\'à 30 convives', 'Personnel de service'] },
  ]},
  { providerIndex: 2, title: 'Reliable Babysitting & Childcare', title_fr: 'Garde d\'enfants fiable', description: 'Experienced babysitter in Douala for ages 0-12. First-aid certified.', description_fr: 'Garde d\'enfants expérimentée à Douala, 0-12 ans. Certifiée premiers secours.', category: 'babysitter', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 5000, description: 'Half-day (4h)', description_fr: 'Demi-journée (4h)', delivery_days: 1, features: ['Up to 2 children', '4 hours', 'Activities'], features_fr: ['Jusqu\'à 2 enfants', '4 heures', 'Activités'] },
    { name: 'Standard', price: 10000, description: 'Full-day (8h)', description_fr: 'Journée complète (8h)', delivery_days: 1, features: ['Up to 3 children', '8 hours', 'Meals'], features_fr: ['Jusqu\'à 3 enfants', '8 heures', 'Repas'] },
    { name: 'Premium', price: 35000, description: 'Weekly (5 days)', description_fr: 'Semaine (5 jours)', delivery_days: 5, features: ['Up to 3 children', '30 hours', 'School transport'], features_fr: ['Jusqu\'à 3 enfants', '30 heures', 'Transport école'] },
  ]},
  { providerIndex: 10, title: 'Trendy Hairdressing & Braiding', title_fr: 'Coiffure tendance et tresses', description: 'Professional hair styling in Abidjan. Braids, weaves, cuts, coloring.', description_fr: 'Coiffure professionnelle à Abidjan. Tresses, tissages, coupes, colorations.', category: 'hairdressing', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 5000, description: 'Cut or styling', description_fr: 'Coupe ou coiffure', delivery_days: 1, features: ['Haircut', 'Wash & blow-dry'], features_fr: ['Coupe', 'Lavage et brushing'] },
    { name: 'Standard', price: 15000, description: 'Braids or coloring', description_fr: 'Tresses ou coloration', delivery_days: 1, features: ['Full braids', 'Hair treatment'], features_fr: ['Tresses complètes', 'Soin capillaire'] },
    { name: 'Premium', price: 35000, description: 'Bridal hair package', description_fr: 'Forfait coiffure mariage', delivery_days: 1, features: ['Custom style', 'Trial included', 'Touch-up day of'], features_fr: ['Coiffure sur mesure', 'Essai inclus', 'Retouche jour J'] },
  ]},
  { providerIndex: 3, title: 'Professional Photography & Video', title_fr: 'Photographie et vidéo professionnelles', description: 'Stunning photos and videos for weddings, portraits, events in West Cameroon.', description_fr: 'Photos et vidéos pour mariages, portraits, événements dans l\'Ouest du Cameroun.', category: 'photography', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 15000, description: '1-hour session', description_fr: 'Séance d\'1 heure', delivery_days: 3, features: ['20 edited photos', '1 location'], features_fr: ['20 photos retouchées', '1 lieu'] },
    { name: 'Standard', price: 40000, description: '4-hour event', description_fr: 'Événement 4 heures', delivery_days: 5, features: ['100+ photos', 'Same-day preview'], features_fr: ['100+ photos', 'Aperçu le jour même'] },
    { name: 'Premium', price: 100000, description: 'Full wedding', description_fr: 'Mariage complet', delivery_days: 14, features: ['300+ photos', 'Highlight video', 'Album'], features_fr: ['300+ photos', 'Vidéo résumé', 'Album'] },
  ]},
  { providerIndex: 11, title: 'Interior & Exterior House Painting', title_fr: 'Peinture intérieure et extérieure', description: 'Professional painting in Yamoussoukro. Color consultation, eco paints.', description_fr: 'Peinture professionnelle à Yamoussoukro. Conseil couleur, peintures écologiques.', category: 'painting', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 12000, description: 'Single room', description_fr: 'Une pièce', delivery_days: 1, features: ['1 room', 'Two coats', 'Paint included'], features_fr: ['1 pièce', 'Deux couches', 'Peinture incluse'] },
    { name: 'Standard', price: 35000, description: 'Up to 3 rooms', description_fr: 'Jusqu\'à 3 pièces', delivery_days: 3, features: ['3 rooms', 'Color consult', 'Premium paint'], features_fr: ['3 pièces', 'Conseil couleur', 'Peinture premium'] },
    { name: 'Premium', price: 90000, description: 'Whole house', description_fr: 'Maison entière', delivery_days: 7, features: ['Interior + exterior', 'Decorative finishes', '3-year warranty'], features_fr: ['Intérieur + extérieur', 'Finitions décoratives', 'Garantie 3 ans'] },
  ]},
  { providerIndex: 4, title: 'Custom Carpentry & Furniture', title_fr: 'Menuiserie et meubles sur mesure', description: 'Handcrafted woodworking in Bamenda. Custom shelving, cabinetry, furniture.', description_fr: 'Menuiserie artisanale à Bamenda. Étagères, placards, meubles sur mesure.', category: 'carpentry', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 10000, description: 'Furniture repair', description_fr: 'Réparation meuble', delivery_days: 2, features: ['Repair', 'Shelf install'], features_fr: ['Réparation', 'Installation étagère'] },
    { name: 'Standard', price: 40000, description: 'Custom piece', description_fr: 'Meuble sur mesure', delivery_days: 7, features: ['Custom design', 'Quality hardwood'], features_fr: ['Design personnalisé', 'Bois dur qualité'] },
    { name: 'Premium', price: 100000, description: 'Built-in cabinetry', description_fr: 'Placards encastrés', delivery_days: 14, features: ['Full custom build', '3D preview', '5-year warranty'], features_fr: ['Construction sur mesure', 'Aperçu 3D', 'Garantie 5 ans'] },
  ]},
  { providerIndex: 12, title: 'Complete Auto Repair & Maintenance', title_fr: 'Réparation automobile complète', description: 'Full-service auto repair in Abidjan. Engine diagnostics, brakes, oil changes.', description_fr: 'Réparation auto complète à Abidjan. Diagnostics moteur, freins, vidanges.', category: 'auto_repair', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 8000, description: 'Oil change', description_fr: 'Vidange', delivery_days: 1, features: ['Oil + filter', '23-point check'], features_fr: ['Huile + filtre', 'Inspection 23 points'] },
    { name: 'Standard', price: 30000, description: 'Brake service', description_fr: 'Service freins', delivery_days: 2, features: ['Full brake service', 'Parts included'], features_fr: ['Service freins complet', 'Pièces incluses'] },
    { name: 'Premium', price: 80000, description: 'Engine repair', description_fr: 'Réparation moteur', delivery_days: 5, features: ['Engine work', 'OEM parts', '1-year warranty'], features_fr: ['Travail moteur', 'Pièces d\'origine', 'Garantie 1 an'] },
  ]},
  { providerIndex: 5, title: 'Garden Design & Maintenance', title_fr: 'Design jardin et entretien', description: 'Tropical landscaping, vegetable gardens, lawn care in Yaounde.', description_fr: 'Aménagement tropical, potagers, entretien pelouse à Yaoundé.', category: 'gardening', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 8000, description: 'Consultation', description_fr: 'Consultation', delivery_days: 1, features: ['1-hour consult', 'Plant guide'], features_fr: ['Consultation 1h', 'Guide plantes'] },
    { name: 'Standard', price: 25000, description: 'Medium garden', description_fr: 'Jardin moyen', delivery_days: 4, features: ['Up to 50 m²', 'Plants included'], features_fr: ['Jusqu\'à 50 m²', 'Plantes incluses'] },
    { name: 'Premium', price: 70000, description: 'Full landscape', description_fr: 'Paysage complet', delivery_days: 10, features: ['Full design', 'Irrigation', 'Lighting'], features_fr: ['Design complet', 'Irrigation', 'Éclairage'] },
  ]},
  { providerIndex: 13, title: 'Smartphone & Tablet Repair', title_fr: 'Réparation smartphones et tablettes', description: 'Fast phone repair in Daloa. Screens, batteries, software, water damage.', description_fr: 'Réparation rapide à Daloa. Écrans, batteries, logiciel, dégâts des eaux.', category: 'phone_repair', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 5000, description: 'Software fix', description_fr: 'Correction logicielle', delivery_days: 1, features: ['Diagnostic', 'Software reset'], features_fr: ['Diagnostic', 'Réinitialisation'] },
    { name: 'Standard', price: 15000, description: 'Screen replacement', description_fr: 'Remplacement écran', delivery_days: 1, features: ['Screen or battery', '90-day warranty'], features_fr: ['Écran ou batterie', 'Garantie 90 jours'] },
    { name: 'Premium', price: 30000, description: 'Board repair', description_fr: 'Réparation carte mère', delivery_days: 3, features: ['Motherboard repair', 'Data recovery'], features_fr: ['Réparation carte mère', 'Récupération données'] },
  ]},
  { providerIndex: 6, title: 'Custom Tailoring & African Wear', title_fr: 'Couture sur mesure et tenues africaines', description: 'Expert tailoring in Douala. Suits, dresses, traditional boubous.', description_fr: 'Couture experte à Douala. Costumes, robes, boubous traditionnels.', category: 'tailoring', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 5000, description: 'Alterations', description_fr: 'Retouches', delivery_days: 2, features: ['Hem', 'Buttons', 'Seams'], features_fr: ['Ourlet', 'Boutons', 'Coutures'] },
    { name: 'Standard', price: 20000, description: 'Custom outfit', description_fr: 'Tenue sur mesure', delivery_days: 7, features: ['Full garment', 'Custom fitting'], features_fr: ['Vêtement complet', 'Ajustement'] },
    { name: 'Premium', price: 60000, description: 'Wedding outfit', description_fr: 'Tenue de mariage', delivery_days: 21, features: ['Multiple fittings', 'Hand-finished', 'Unlimited revisions'], features_fr: ['Plusieurs essayages', 'Finitions main', 'Retouches illimitées'] },
  ]},
  { providerIndex: 14, title: 'Professional Event Catering', title_fr: 'Traiteur événementiel', description: 'Full-service catering in San-Pedro. Ivorian and international cuisine.', description_fr: 'Traiteur complet à San-Pédro. Cuisine ivoirienne et internationale.', category: 'catering', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 15000, description: 'Buffet for 20', description_fr: 'Buffet pour 20', delivery_days: 2, features: ['3 dishes', 'Drinks included'], features_fr: ['3 plats', 'Boissons incluses'] },
    { name: 'Standard', price: 40000, description: 'Service for 50', description_fr: 'Service pour 50', delivery_days: 3, features: ['Custom menu', 'Wait staff'], features_fr: ['Menu personnalisé', 'Personnel service'] },
    { name: 'Premium', price: 100000, description: 'Grand event 100+', description_fr: 'Grand événement 100+', delivery_days: 5, features: ['5-course', '100+ guests', 'Full staff', 'Bar'], features_fr: ['5 services', '100+ convives', 'Équipe complète', 'Bar'] },
  ]},
  { providerIndex: 7, title: 'Residential & Commercial Moving', title_fr: 'Déménagement résidentiel et commercial', description: 'Professional moving in Limbe. Careful handling, packing, on-time delivery.', description_fr: 'Déménagement professionnel à Limbé. Manipulation soigneuse, emballage, ponctualité.', category: 'moving', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 15000, description: 'Studio move', description_fr: 'Déménagement studio', delivery_days: 1, features: ['1 truck + 2 movers', '2 hours'], features_fr: ['1 camion + 2 déménageurs', '2 heures'] },
    { name: 'Standard', price: 35000, description: '2-3 bedroom', description_fr: '2-3 chambres', delivery_days: 1, features: ['Truck + 4 movers', 'Packing materials'], features_fr: ['Camion + 4 déménageurs', 'Emballage'] },
    { name: 'Premium', price: 80000, description: 'Large home/office', description_fr: 'Grande maison/bureau', delivery_days: 2, features: ['2 trucks', 'Full packing', 'Insurance'], features_fr: ['2 camions', 'Emballage complet', 'Assurance'] },
  ]},
  { providerIndex: 2, title: 'Professional Event Makeup', title_fr: 'Maquillage événementiel', description: 'Professional makeup in Douala. Bridal, party, editorial.', description_fr: 'Maquillage professionnel à Douala. Mariée, fête, éditorial.', category: 'makeup', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 8000, description: 'Natural look', description_fr: 'Look naturel', delivery_days: 1, features: ['Light foundation', 'Eye makeup'], features_fr: ['Fond de teint léger', 'Maquillage yeux'] },
    { name: 'Standard', price: 20000, description: 'Full event', description_fr: 'Événement complet', delivery_days: 1, features: ['Full-face', 'False lashes', 'Contouring'], features_fr: ['Visage complet', 'Faux cils', 'Contouring'] },
    { name: 'Premium', price: 50000, description: 'Bridal with trial', description_fr: 'Mariée avec essai', delivery_days: 1, features: ['Trial session', 'Bridal makeup', 'All-day touch-ups'], features_fr: ['Séance d\'essai', 'Maquillage mariée', 'Retouches journée'] },
  ]},
  { providerIndex: 10, title: 'DJ & Music for Events', title_fr: 'DJ et musique pour événements', description: 'Professional DJ in Abidjan. Afrobeats, coupé-décalé, dancehall.', description_fr: 'DJ professionnel à Abidjan. Afrobeats, coupé-décalé, dancehall.', category: 'dj', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 15000, description: 'Small party (3h)', description_fr: 'Petite fête (3h)', delivery_days: 1, features: ['3-hour set', 'Basic sound'], features_fr: ['Set 3 heures', 'Sono basique'] },
    { name: 'Standard', price: 35000, description: 'Full event (6h)', description_fr: 'Événement (6h)', delivery_days: 1, features: ['6-hour set', 'Pro sound', 'Lighting'], features_fr: ['Set 6 heures', 'Sono pro', 'Éclairage'] },
    { name: 'Premium', price: 80000, description: 'Wedding (10h+)', description_fr: 'Mariage (10h+)', delivery_days: 1, features: ['10+ hours', 'Premium sound', 'MC + coordinator'], features_fr: ['10+ heures', 'Sono premium', 'MC + coordinateur'] },
  ]},
  { providerIndex: 5, title: 'Academic Tutoring All Levels', title_fr: 'Cours particuliers tous niveaux', description: 'Personalized tutoring in Yaounde. Math, science, French, English.', description_fr: 'Soutien scolaire personnalisé à Yaoundé. Maths, sciences, français, anglais.', category: 'tutoring', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 5000, description: '1-hour session', description_fr: 'Séance 1 heure', delivery_days: 1, features: ['1 hour', 'One subject'], features_fr: ['1 heure', 'Une matière'] },
    { name: 'Standard', price: 18000, description: 'Weekly (4 sessions)', description_fr: 'Hebdomadaire (4 séances)', delivery_days: 7, features: ['4 sessions', '2 subjects', 'Study plan'], features_fr: ['4 séances', '2 matières', 'Plan d\'études'] },
    { name: 'Premium', price: 40000, description: 'Monthly intensive', description_fr: 'Intensif mensuel', delivery_days: 30, features: ['16 sessions', 'All subjects', 'Exam prep'], features_fr: ['16 séances', 'Toutes matières', 'Préparation examens'] },
  ]},
  { providerIndex: 9, title: 'Relaxation & Therapeutic Massage', title_fr: 'Massage relaxant et thérapeutique', description: 'Professional massage in Bouake. Swedish, deep tissue, African techniques.', description_fr: 'Massage professionnel à Bouaké. Suédois, tissus profonds, techniques africaines.', category: 'massage', is_emergency: false, pricing_tiers: [
    { name: 'Basic', price: 8000, description: '30 minutes', description_fr: '30 minutes', delivery_days: 1, features: ['30-min', 'Neck & shoulders'], features_fr: ['30 min', 'Nuque et épaules'] },
    { name: 'Standard', price: 15000, description: '60 minutes full body', description_fr: '60 minutes corps entier', delivery_days: 1, features: ['60-min', 'Full body', 'Hot towels'], features_fr: ['60 min', 'Corps entier', 'Serviettes chaudes'] },
    { name: 'Premium', price: 35000, description: '90 minutes spa', description_fr: '90 minutes spa', delivery_days: 1, features: ['90-min', 'Aromatherapy', 'Hot stones'], features_fr: ['90 min', 'Aromathérapie', 'Pierres chaudes'] },
  ]},
  { providerIndex: 12, title: 'Reliable Personal Driver', title_fr: 'Chauffeur privé fiable', description: 'Safe, punctual private driver in Abidjan. Airport transfers, city tours.', description_fr: 'Chauffeur privé sûr et ponctuel à Abidjan. Transferts aéroport, tours de ville.', category: 'driver', is_emergency: true, pricing_tiers: [
    { name: 'Basic', price: 5000, description: 'Single trip', description_fr: 'Trajet unique', delivery_days: 1, features: ['One-way', 'AC vehicle'], features_fr: ['Aller simple', 'Véhicule climatisé'] },
    { name: 'Standard', price: 15000, description: 'Half-day (5h)', description_fr: 'Demi-journée (5h)', delivery_days: 1, features: ['5 hours', 'Multiple stops'], features_fr: ['5 heures', 'Arrêts multiples'] },
    { name: 'Premium', price: 30000, description: 'Full-day (10h)', description_fr: 'Journée (10h)', delivery_days: 1, features: ['10 hours', 'Fuel included', 'Premium vehicle'], features_fr: ['10 heures', 'Carburant inclus', 'Véhicule premium'] },
  ]},
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
    console.log('=== AfriWork Seed: Creating providers ===');

    for (const provider of PROVIDERS) {
      const fullName = `${provider.firstName} ${provider.lastName}`;
      console.log(`  Creating: ${fullName}`);

      // Use Supabase JS admin client
      const { data, error } = await adminSupabase.auth.admin.createUser({
        email: provider.email,
        password: 'AfriWork2024!',
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'provider' },
      });

      if (error) {
        console.error(`  Failed: ${fullName} - ${error.message}`);
        // If user already exists, try to find their ID
        if (error.message.includes('already') || error.message.includes('exists')) {
          const { data: users } = await adminSupabase.auth.admin.listUsers();
          const existing = users?.users?.find(u => u.email === provider.email);
          if (existing) {
            providerIds.push(existing.id);
            console.log(`  Found existing: ${existing.id}`);
            continue;
          }
        }
        providerIds.push('');
        continue;
      }

      providerIds.push(data.user.id);
      usersCreated++;
      console.log(`  Created: ${data.user.id}`);
    }

    if (providerIds.filter(id => id).length === 0) {
      return { success: false, message: 'No users were created. Check Supabase credentials and admin endpoint.', usersCreated: 0, gigsCreated: 0 };
    }

    // Wait for profile trigger
    console.log('Waiting for profile trigger...');
    await sleep(1500);

    // Update profiles with extra info
    console.log('=== Updating profiles ===');
    for (let i = 0; i < providerIds.length; i++) {
      if (!providerIds[i]) continue;
      const p = PROVIDERS[i];
      const { error } = await adminSupabase.from('profiles').update({
        phone: p.phone,
        bio: p.bio,
        location: p.location,
        country: p.country,
        is_available_now: p.is_available_now,
        offers_emergency: p.offers_emergency,
      }).eq('id', providerIds[i]);

      if (error) console.error(`  Profile update failed: ${p.firstName} - ${error.message}`);
      else console.log(`  Updated: ${p.firstName} ${p.lastName}`);
    }

    // Create gigs
    console.log('=== Creating gigs ===');
    for (const gig of GIGS) {
      const providerId = providerIds[gig.providerIndex];
      if (!providerId) { console.warn(`  Skipping: no provider for index ${gig.providerIndex}`); continue; }

      const { error } = await adminSupabase.from('gigs').insert({
        provider_id: providerId,
        title: gig.title,
        title_fr: gig.title_fr,
        description: gig.description,
        description_fr: gig.description_fr,
        category: gig.category,
        location: PROVIDERS[gig.providerIndex].location,
        pricing_tiers: gig.pricing_tiers,
        is_emergency: gig.is_emergency,
        is_active: true,
      });

      if (error) console.error(`  Gig failed: ${gig.title} - ${error.message}`);
      else { gigsCreated++; console.log(`  Created: ${gig.title_fr}`); }
    }

    const msg = `Seed complete: ${usersCreated} users and ${gigsCreated} gigs created.`;
    console.log(msg);
    return { success: true, message: msg, usersCreated, gigsCreated };

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Seed failed: ${msg}`, usersCreated, gigsCreated };
  }
}
