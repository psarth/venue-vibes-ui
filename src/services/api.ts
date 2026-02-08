const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

// Venue API
export const venueAPI = {
  // Get all venues for owner
  getVenues: () => apiRequest('/venues'),
  
  // Create new venue
  createVenue: (venueData: any) => 
    apiRequest('/venues', {
      method: 'POST',
      body: JSON.stringify(venueData),
    }),
  
  // Update venue
  updateVenue: (venueId: string, venueData: any) =>
    apiRequest(`/venues/${venueId}`, {
      method: 'PUT',
      body: JSON.stringify(venueData),
    }),
  
  // Toggle venue status
  toggleVenueStatus: (venueId: string) =>
    apiRequest(`/venues/${venueId}/toggle`, {
      method: 'PATCH',
    }),
};

// Booking API
export const bookingAPI = {
  // Get all bookings with optional filters
  getBookings: (filters?: { date?: string; venueId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.venueId) params.append('venueId', filters.venueId);
    
    return apiRequest(`/bookings?${params.toString()}`);
  },
  
  // Update booking status
  updateBookingStatus: (bookingId: string, status: string) =>
    apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Revenue API
export const revenueAPI = {
  // Get revenue analytics
  getRevenueData: () => apiRequest('/revenue'),
};

// Auth API
export const authAPI = {
  // Login
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL.replace('/api', '')}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()),
};

// Sample API responses for reference:

/*
// GET /api/venues response:
[
  {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "PowerPlay Arena",
    "sportType": "Badminton",
    "location": "Indiranagar, Bangalore",
    "pricePerSlot": 450,
    "isActive": true,
    "ownerId": "64a1b2c3d4e5f6789012340",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]

// GET /api/bookings response:
[
  {
    "_id": "64a1b2c3d4e5f6789012346",
    "venueId": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "PowerPlay Arena"
    },
    "customerId": "64a1b2c3d4e5f6789012341",
    "customerName": "John Doe",
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "06:00-07:00",
    "amount": 450,
    "status": "Confirmed",
    "paymentStatus": "Paid",
    "createdAt": "2024-01-14T15:30:00.000Z"
  }
]

// GET /api/revenue response:
{
  "todayRevenue": 2850,
  "weeklyRevenue": 18500,
  "monthlyRevenue": 75000,
  "totalBookings": 156,
  "dailyRevenue": [
    {
      "_id": "2024-01-15",
      "revenue": 2850,
      "bookings": 7
    }
  ]
}
*/