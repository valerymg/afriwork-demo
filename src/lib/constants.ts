import type { Category, LocationOption } from '../types';

export const PLATFORM_FEE_RATE = 0.15;
export const PROCESSING_FEE_RATE = 0.02;

export const CATEGORIES: Category[] = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', description: 'Pipes, fixtures, and water systems', color: 'bg-blue-100 text-blue-700' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Wiring, installations, and repairs', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', description: 'Woodwork, furniture, and framing', color: 'bg-amber-100 text-amber-700' },
  { id: 'painting', name: 'Painting', icon: '🎨', description: 'Interior and exterior painting', color: 'bg-purple-100 text-purple-700' },
  { id: 'gardening', name: 'Gardening', icon: '🌱', description: 'Landscaping and garden maintenance', color: 'bg-green-100 text-green-700' },
  { id: 'tailoring', name: 'Tailoring', icon: '🧵', description: 'Custom clothing and alterations', color: 'bg-pink-100 text-pink-700' },
  { id: 'farming', name: 'Farming', icon: '🌾', description: 'Agricultural services and consulting', color: 'bg-lime-100 text-lime-700' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', description: 'Home and office cleaning services', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'masonry', name: 'Masonry', icon: '🧱', description: 'Brickwork, concrete, and stone', color: 'bg-orange-100 text-orange-700' },
  { id: 'welding', name: 'Welding', icon: '🔥', description: 'Metal fabrication and repair', color: 'bg-red-100 text-red-700' },
  { id: 'roofing', name: 'Roofing', icon: '🏠', description: 'Roof installation and repairs', color: 'bg-slate-100 text-slate-700' },
  { id: 'auto_repair', name: 'Auto Repair', icon: '🚗', description: 'Vehicle maintenance and repair', color: 'bg-gray-100 text-gray-700' },
  { id: 'hvac', name: 'HVAC', icon: '❄️', description: 'Heating, ventilation, and cooling', color: 'bg-sky-100 text-sky-700' },
  { id: 'moving', name: 'Moving', icon: '📦', description: 'Relocation and hauling services', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'pest_control', name: 'Pest Control', icon: '🐛', description: 'Pest removal and prevention', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'tiling', name: 'Tiling', icon: '🔲', description: 'Floor and wall tiling', color: 'bg-teal-100 text-teal-700' },
];

export const LOCATIONS: LocationOption[] = [
  { id: 'new_york', name: 'New York', region: 'Northeast' },
  { id: 'los_angeles', name: 'Los Angeles', region: 'West' },
  { id: 'chicago', name: 'Chicago', region: 'Midwest' },
  { id: 'houston', name: 'Houston', region: 'South' },
  { id: 'phoenix', name: 'Phoenix', region: 'West' },
  { id: 'philadelphia', name: 'Philadelphia', region: 'Northeast' },
  { id: 'san_antonio', name: 'San Antonio', region: 'South' },
  { id: 'san_diego', name: 'San Diego', region: 'West' },
  { id: 'dallas', name: 'Dallas', region: 'South' },
  { id: 'austin', name: 'Austin', region: 'South' },
  { id: 'miami', name: 'Miami', region: 'South' },
  { id: 'atlanta', name: 'Atlanta', region: 'South' },
  { id: 'seattle', name: 'Seattle', region: 'West' },
  { id: 'denver', name: 'Denver', region: 'West' },
  { id: 'boston', name: 'Boston', region: 'Northeast' },
  { id: 'portland', name: 'Portland', region: 'West' },
];

export const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];
