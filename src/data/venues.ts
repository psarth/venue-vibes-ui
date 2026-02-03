export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  sport: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  rules: string[];
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
    id: '1',
    name: 'Sportz Arena',
    location: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    sport: 'Badminton',
    pricePerHour: 600,
    rating: 4.5,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
      'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=800&q=80',
    ],
    description: 'Premium indoor badminton courts with professional lighting and wooden flooring. Air-conditioned facility with 4 courts available for booking.',
    amenities: ['Parking', 'Changing Room', 'AC', 'Drinking Water', 'Equipment Rental'],
    rules: ['Sports shoes mandatory', 'No food inside court', 'Cancel 4 hours before'],
  },
  {
    id: '2',
    name: 'Kick Off Football Turf',
    location: 'Koramangala, Bangalore',
    city: 'Bangalore',
    sport: 'Football',
    pricePerHour: 1500,
    rating: 4.7,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
    ],
    description: 'FIFA-quality artificial turf with floodlights for night games. 5-a-side and 7-a-side formats available. Professional goal posts and boundary nets.',
    amenities: ['Floodlights', 'Parking', 'Changing Room', 'Restroom', 'First Aid'],
    rules: ['Studs not allowed', 'No smoking', 'Arrive 10 mins early'],
  },
  {
    id: '3',
    name: 'Smash Point',
    location: 'HSR Layout, Bangalore',
    city: 'Bangalore',
    sport: 'Badminton',
    pricePerHour: 500,
    rating: 4.3,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=800&q=80',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    ],
    description: 'Budget-friendly badminton courts with synthetic flooring. Well-maintained facility with 3 courts and basic amenities.',
    amenities: ['Parking', 'Drinking Water', 'Equipment Rental'],
    rules: ['Sports shoes mandatory', 'No outside food'],
  },
  {
    id: '4',
    name: 'Ace Tennis Academy',
    location: 'Whitefield, Bangalore',
    city: 'Bangalore',
    sport: 'Tennis',
    pricePerHour: 800,
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
    ],
    description: 'Clay and hard courts available with coaching facilities. Professional maintenance with ball machine access included.',
    amenities: ['Coaching', 'Ball Machine', 'Parking', 'Cafeteria', 'Pro Shop'],
    rules: ['Tennis shoes only', 'Proper attire required'],
  },
  {
    id: '5',
    name: 'Hoop Dreams Arena',
    location: 'JP Nagar, Bangalore',
    city: 'Bangalore',
    sport: 'Basketball',
    pricePerHour: 700,
    rating: 4.4,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
      'https://images.unsplash.com/photo-1559692048-79a3f837883d?w=800&q=80',
    ],
    description: 'Full-size indoor basketball court with professional hoops. Perfect for 3v3 or 5v5 games with electronic scoreboard.',
    amenities: ['AC', 'Scoreboard', 'Changing Room', 'Parking'],
    rules: ['Non-marking shoes only', 'No jewelry on court'],
  },
  {
    id: '6',
    name: 'Cricket Zone Academy',
    location: 'Electronic City, Bangalore',
    city: 'Bangalore',
    sport: 'Cricket',
    pricePerHour: 1200,
    rating: 4.8,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
      'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80',
    ],
    description: 'Practice nets and turf pitch with bowling machines. BCCI-standard practice facility with video analysis available.',
    amenities: ['Bowling Machine', 'Video Analysis', 'Equipment', 'Coaching', 'Cafeteria'],
    rules: ['Helmet mandatory', 'Own equipment preferred'],
  },
];

export const generateSlots = (date: Date): Slot[] => {
  const slots: Slot[] = [];
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  
  hours.forEach((hour, index) => {
    const period: 'morning' | 'afternoon' | 'evening' = 
      hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    const basePrice = period === 'morning' ? 400 : period === 'afternoon' ? 500 : 600;
    const available = Math.random() > 0.3;
    
    slots.push({
      id: `slot-${index}`,
      time: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
      price: basePrice + Math.floor(Math.random() * 200),
      available,
      period,
    });
  });
  
  return slots;
};
