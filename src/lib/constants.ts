import type { Category, LocationOption } from '../types';

export const PLATFORM_FEE_RATE = 0.12;
export const PROCESSING_FEE_RATE = 0.02;
export const CURRENCY = 'FCFA';
export const CURRENCY_CODE = 'XAF';

export const CATEGORIES: Category[] = [
  { id: 'plumbing', name: 'Plumbing', name_fr: 'Plomberie', icon: '🔧', description: 'Pipes, fixtures, and water systems', description_fr: 'Tuyaux, robinets et systèmes d\'eau', color: 'bg-blue-100 text-blue-700' },
  { id: 'electrical', name: 'Electrical', name_fr: 'Électricité', icon: '⚡', description: 'Wiring, installations, and repairs', description_fr: 'Câblage, installations et réparations', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'carpentry', name: 'Carpentry', name_fr: 'Menuiserie', icon: '🪚', description: 'Woodwork, furniture, and framing', description_fr: 'Bois, meubles et charpente', color: 'bg-amber-100 text-amber-700' },
  { id: 'painting', name: 'Painting', name_fr: 'Peinture', icon: '🎨', description: 'Interior and exterior painting', description_fr: 'Peinture intérieure et extérieure', color: 'bg-purple-100 text-purple-700' },
  { id: 'gardening', name: 'Gardening', name_fr: 'Jardinage', icon: '🌱', description: 'Landscaping and garden maintenance', description_fr: 'Aménagement et entretien de jardins', color: 'bg-green-100 text-green-700' },
  { id: 'tailoring', name: 'Tailoring', name_fr: 'Couture', icon: '🧵', description: 'Custom clothing and alterations', description_fr: 'Vêtements sur mesure et retouches', color: 'bg-pink-100 text-pink-700' },
  { id: 'farming', name: 'Farming', name_fr: 'Agriculture', icon: '🌾', description: 'Agricultural services and consulting', description_fr: 'Services agricoles et conseil', color: 'bg-lime-100 text-lime-700' },
  { id: 'cleaning', name: 'Cleaning', name_fr: 'Nettoyage', icon: '🧹', description: 'Home and office cleaning services', description_fr: 'Nettoyage de maison et bureau', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'masonry', name: 'Masonry', name_fr: 'Maçonnerie', icon: '🧱', description: 'Brickwork, concrete, and stone', description_fr: 'Briques, béton et pierre', color: 'bg-orange-100 text-orange-700' },
  { id: 'welding', name: 'Welding', name_fr: 'Soudure', icon: '🔥', description: 'Metal fabrication and repair', description_fr: 'Fabrication et réparation de métaux', color: 'bg-red-100 text-red-700' },
  { id: 'roofing', name: 'Roofing', name_fr: 'Toiture', icon: '🏠', description: 'Roof installation and repairs', description_fr: 'Installation et réparation de toitures', color: 'bg-slate-100 text-slate-700' },
  { id: 'auto_repair', name: 'Auto Repair', name_fr: 'Mécanique Auto', icon: '🚗', description: 'Vehicle maintenance and repair', description_fr: 'Entretien et réparation de véhicules', color: 'bg-gray-100 text-gray-700' },
  { id: 'hairdressing', name: 'Hairdressing', name_fr: 'Coiffure', icon: '💇', description: 'Hair styling and care', description_fr: 'Coiffure et soins capillaires', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'moving', name: 'Moving', name_fr: 'Déménagement', icon: '📦', description: 'Relocation and hauling services', description_fr: 'Déménagement et transport', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'ironwork', name: 'Ironwork', name_fr: 'Ferronnerie', icon: '⚒️', description: 'Gates, grills, and metal structures', description_fr: 'Portails, grilles et structures métalliques', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'tiling', name: 'Tiling', name_fr: 'Carrelage', icon: '🔲', description: 'Floor and wall tiling', description_fr: 'Carrelage de sols et murs', color: 'bg-teal-100 text-teal-700' },
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
