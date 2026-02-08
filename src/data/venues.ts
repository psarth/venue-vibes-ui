export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  sport: string;
  sports?: string[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  rules: string[];
  sportResources?: Record<string, number>;
  convenienceFee?: number;
  feeType?: 'fixed' | 'percentage';
  isFeeEnabled?: boolean;
}

export interface Slot {
  id: string;
  time: string;
  price: number;
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

export const sports = [
  'All Sports',
  'Multi-Sport',
  'Badminton',
  'Cricket',
  'Football',
  'Tennis',
  'Basketball',
  'Swimming',
  'Table Tennis',
  'Squash',
  'Volleyball',
];

export const venues: Venue[] = [
  {
    id: 'multi-sport-test',
    name: 'Multi Sport Test Arena',
    location: 'Test Location, Bangalore',
    city: 'Bangalore',
    sport: 'Multi-Sport',
    pricePerHour: 500,
    rating: 4.8,
    reviewCount: 150,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585222515068-7201a72c9a0b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=1200&q=80&auto=format&fit=crop',
    ],
    description: 'Multi-sport testing facility with Cricket, Football, and Badminton courts. Perfect for testing booking flow with multiple sports and courts.',
    amenities: ['Parking', 'Changing Room', 'AC', 'Drinking Water', 'Equipment Rental', 'WiFi', 'Cafeteria'],
    rules: ['Sports shoes mandatory', 'No food inside courts', 'Cancel 4 hours before', 'Follow sport-specific rules'],
  },
  {
    id: '1',
    name: 'PowerPlay Badminton Arena',
    location: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    sport: 'Badminton',
    pricePerHour: 450,
    rating: 4.7,
    reviewCount: 328,
    image: 'https://images.unsplash.com/photo-1585222515068-7201a72c9a0b?w=1200&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1585222515068-7201a72c9a0b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff6d3d2a4e8b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542365887-3e5e3b6d2d9b?w=1200&q=80&auto=format&fit=crop',
    ],
    description: 'Premium indoor badminton courts featuring professional-grade synthetic flooring and tournament-standard lighting. Our air-conditioned facility houses 6 courts with dedicated warm-up areas and spectator seating.',
    amenities: ['Parking', 'Changing Room', 'AC', 'Drinking Water', 'Equipment Rental', 'WiFi'],
    rules: ['Sports shoes mandatory', 'No food inside court', 'Cancel 4 hours before', 'Maximum 4 players per court'],
  },
  {
    id: '2',
    name: 'Goal Rush Football Turf',
    location: 'Koramangala 5th Block, Bangalore',
    city: 'Bangalore',
    sport: 'Football',
    pricePerHour: 1800,
    rating: 4.8,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=1200&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505672678657-cc7037095e2e?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&q=80&auto=format&fit=crop',
    ],
    description: 'FIFA-quality artificial turf with 1500 lux floodlights for night games. Perfect for 5-a-side and 7-a-side formats with professional goal posts, boundary nets, and dedicated dugout areas for teams.',
    amenities: ['Floodlights', 'Parking', 'Changing Room', 'Restroom', 'First Aid', 'Drinking Water'],
    rules: ['Metal studs not allowed', 'No smoking on premises', 'Arrive 10 mins early', 'Teams must vacate on time'],
  },
  {
    id: '3',
    name: 'Smash Zone Badminton Hub',
    location: 'HSR Layout Sector 2, Bangalore',
    city: 'Bangalore',
    sport: 'Badminton',
    pricePerHour: 350,
    rating: 4.3,
    reviewCount: 186,
    image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac2?w=1200&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1533777324565-a040eb52fac2?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=1200&q=80&auto=format&fit=crop',
    ],
    description: 'Budget-friendly badminton facility with 4 synthetic courts and standard lighting. Ideal for recreational players and beginners looking for quality courts at affordable prices.',
    amenities: ['Parking', 'Drinking Water', 'Equipment Rental', 'Restroom'],
    rules: ['Sports shoes mandatory', 'No outside food allowed', 'Book minimum 1 hour'],
  },
  {
    id: '4',
    name: 'Ace Tennis Academy',
    location: 'Whitefield Main Road, Bangalore',
    city: 'Bangalore',
    sport: 'Tennis',
    pricePerHour: 700,
    rating: 4.6,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=1200&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&q=80&auto=format&fit=crop',
    ],
    description: 'Professional tennis facility with 4 clay courts and 2 hard courts. Coaching available for all skill levels with ball machine access and video analysis for serious players.',
    amenities: ['Coaching', 'Ball Machine', 'Parking', 'Cafeteria', 'Pro Shop', 'Changing Room'],
    rules: ['Tennis shoes only', 'Proper attire required', 'Coaching sessions require advance booking'],
  },
  {
    id: '5',
    name: 'Hoop Stars Basketball Court',
    location: 'JP Nagar 6th Phase, Bangalore',
    city: 'Bangalore',
    sport: 'Basketball',
    pricePerHour: 600,
    rating: 4.5,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
      'https://images.unsplash.com/photo-1559692048-79a3f837883d?w=800&q=80',
      'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
    ],
    description: 'Full-size indoor basketball court with professional NBA-standard hoops and maple wood flooring. Perfect for 3v3 or 5v5 games with electronic scoreboard and shot clock.',
    amenities: ['AC', 'Scoreboard', 'Changing Room', 'Parking', 'Drinking Water', 'First Aid'],
    rules: ['Non-marking shoes only', 'No jewelry on court', 'Teams must bring own basketball'],
  },
  {
    id: '6',
    name: 'Strike Zone Cricket Academy',
    location: 'Electronic City Phase 1, Bangalore',
    city: 'Bangalore',
    sport: 'Cricket',
    pricePerHour: 1200,
    rating: 4.9,
    reviewCount: 687,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
      'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
      'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80',
      'https://images.unsplash.com/photo-1562077772-3bd90f0f4f95?w=800&q=80',
    ],
    description: 'BCCI-standard practice facility with 8 premium nets and synthetic turf pitch. Features advanced bowling machines up to 150 kmph and video analysis for technique improvement.',
    amenities: ['Bowling Machine', 'Video Analysis', 'Equipment', 'Coaching', 'Cafeteria', 'Parking'],
    rules: ['Helmet mandatory for batting', 'Own equipment preferred', 'No hard ball without nets'],
  },
  {
    id: '7',
    name: 'Splash Aquatic Center',
    location: 'Marathahalli, Bangalore',
    city: 'Bangalore',
    sport: 'Swimming',
    pricePerHour: 400,
    rating: 4.4,
    reviewCount: 276,
    image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80',
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    ],
    description: 'Olympic-size heated swimming pool with 8 lanes and professional timing system. Dedicated kids pool and coaching available for beginners to advanced swimmers.',
    amenities: ['Changing Room', 'Parking', 'Cafeteria', 'Coaching', 'Equipment Rental', 'First Aid'],
    rules: ['Swimming cap mandatory', 'Shower before entering pool', 'No diving in shallow areas'],
  },
  {
    id: '8',
    name: 'Rally Masters Table Tennis',
    location: 'BTM Layout 2nd Stage, Bangalore',
    city: 'Bangalore',
    sport: 'Table Tennis',
    pricePerHour: 250,
    rating: 4.2,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
      'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
    ],
    description: 'Professional table tennis facility with 8 ITTF-approved tables and competition-grade flooring. Air-conditioned venue with coaching available for all skill levels.',
    amenities: ['AC', 'Parking', 'Equipment Rental', 'Coaching', 'Drinking Water'],
    rules: ['Indoor shoes only', 'No food near tables', 'Paddles available on request'],
  },
  // Duplicated Venues for Scrolling Test
  {
    id: '1-dup',
    name: 'PowerPlay Badminton Arena 2',
    location: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    sport: 'Badminton',
    pricePerHour: 450,
    rating: 4.7,
    reviewCount: 328,
    image: 'https://images.unsplash.com/photo-1585222515068-7201a72c9a0b?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    description: 'Duplicate for testing scroll.',
    amenities: [],
    rules: [],
  },
  {
    id: '2-dup',
    name: 'Goal Rush Football Turf 2',
    location: 'Koramangala 5th Block, Bangalore',
    city: 'Bangalore',
    sport: 'Football',
    pricePerHour: 1800,
    rating: 4.8,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    description: 'Duplicate for testing scroll.',
    amenities: [],
    rules: [],
  },
  {
    id: '3-dup',
    name: 'Smash Zone Badminton Hub 2',
    location: 'HSR Layout Sector 2, Bangalore',
    city: 'Bangalore',
    sport: 'Badminton',
    pricePerHour: 350,
    rating: 4.3,
    reviewCount: 186,
    image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac2?w=1200&q=80&auto=format&fit=crop',
    gallery: [],
    description: 'Duplicate for testing scroll.',
    amenities: [],
    rules: [],
  },
  {
    id: '5-dup',
    name: 'Hoop Stars Basketball Court 2',
    location: 'JP Nagar 6th Phase, Bangalore',
    city: 'Bangalore',
    sport: 'Basketball',
    pricePerHour: 600,
    rating: 4.5,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    gallery: [],
    description: 'Duplicate for testing scroll.',
    amenities: [],
    rules: [],
  },
  {
    id: '6-dup',
    name: 'Strike Zone Cricket Academy 2',
    location: 'Electronic City Phase 1, Bangalore',
    city: 'Bangalore',
    sport: 'Cricket',
    pricePerHour: 1200,
    rating: 4.9,
    reviewCount: 687,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    gallery: [],
    description: 'Duplicate for testing scroll.',
    amenities: [],
    rules: [],
  },
  // MORE DUPLICATES FOR SCROLL TEST
  // Football (Need 1 more to make 3)
  {
    id: '2-dup-2',
    name: 'Champions Turf Arena',
    location: 'Marathahalli, Bangalore',
    city: 'Bangalore',
    sport: 'Football',
    pricePerHour: 1600,
    rating: 4.6,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80',
    gallery: [],
    description: 'Third football venue for scroll test.',
    amenities: [],
    rules: [],
  },
  // Cricket (Need 1 more to make 3)
  {
    id: '6-dup-2',
    name: 'Legends Cricket Ground',
    location: 'Sarjapur Road, Bangalore',
    city: 'Bangalore',
    sport: 'Cricket',
    pricePerHour: 1500,
    rating: 4.8,
    reviewCount: 300,
    image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d17d4e?w=800&q=80',
    gallery: [],
    description: 'Third cricket venue for scroll test.',
    amenities: [],
    rules: [],
  },
  // Basketball (Need 1 more to make 3)
  {
    id: '5-dup-2',
    name: 'Dunk Masters Court',
    location: 'Whitefield, Bangalore',
    city: 'Bangalore',
    sport: 'Basketball',
    pricePerHour: 750,
    rating: 4.7,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?w=800&q=80',
    gallery: [],
    description: 'Third basketball venue for scroll test.',
    amenities: [],
    rules: [],
  },
];

export const generateSlots = (date: Date, basePrice: number = 500): Slot[] => {
  const slots: Slot[] = [];
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  // Use date as seed for deterministic pricing
  const dateSeed = date.toDateString();

  hours.forEach((hour, index) => {
    const period: 'morning' | 'afternoon' | 'evening' =
      hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

    // Modifier based on period (Morning -10%, Afternoon Base, Evening +15%)
    const modifier = period === 'morning' ? 0.9 : period === 'afternoon' ? 1.0 : 1.15;
    const finalBasePrice = Math.round(basePrice * modifier);

    // Deterministic pricing: use date + hour to create consistent price
    const seed = dateSeed.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + hour;
    const priceVariation = (seed * 73) % 50; // Smaller variation for realism
    const available = (seed * 97) % 10 > 3;

    slots.push({
      id: `slot-${hour}-${date.getTime()}`,
      time: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
      price: finalBasePrice + priceVariation,
      available,
      period,
    });
  });

  return slots;
};
