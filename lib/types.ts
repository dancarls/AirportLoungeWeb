export interface Airport {
  id: string
  name: string
  iata_code: string
  icao_code: string | null
  city: string
  country: string
  country_code: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
  terminal_map_url: string | null
  website: string | null
  is_active: boolean
  lounges?: Lounge[]
}

export interface Amenity {
  id: string
  name: string
  slug: string
  category: 'food_drink' | 'connectivity' | 'wellness' | 'business' | 'entertainment' | 'accessibility' | 'other'
  icon: string | null
}

export interface LoungeImage {
  id: string
  lounge_id: string
  storage_path: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

export interface Lounge {
  id: string
  name: string
  slug: string
  description: string | null
  airport_id: string
  terminal: string | null
  location_detail: string | null
  access_types: AccessType[]
  opening_hours: OpeningHours
  guest_fee: number | null
  guest_fee_currency: string
  capacity: number | null
  rating: number | null
  review_count: number
  is_active: boolean
  website: string | null
  phone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at?: string | null
  airport?: Airport
  amenities?: Amenity[]
  images?: LoungeImage[]
}

export interface AccessType {
  type: 'credit_card' | 'airline_status' | 'membership' | 'day_pass' | 'class_of_service'
  name: string
  details?: string
}

export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
  notes?: string
  is_24_7?: boolean
}

export interface Review {
  id: string
  lounge_id: string
  user_id: string
  title: string
  body: string
  overall_rating: number
  food_rating: number | null
  cleanliness_rating: number | null
  staff_rating: number | null
  wifi_rating: number | null
  visit_date: string
  visit_type: string | null
  access_method: string | null
  pros: string | null
  cons: string | null
  would_return: boolean
  helpful_count: number
  is_verified: boolean
  created_at: string
  profile?: Profile
}

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  home_airport: string | null
  bio: string | null
}

export interface CrowdReport {
  lounge_id: string
  avg_crowd: number
  report_count: number
  last_reported: string
}

// AeroDataBox flight types
export interface FlightStatus {
  flightNumber: string
  airline: string
  status: string
  departure: FlightEndpoint
  arrival: FlightEndpoint
  aircraft: string | null
}

export interface FlightEndpoint {
  airport: string
  iata: string
  scheduledTime: string
  actualTime: string | null
  estimatedTime: string | null
  gate: string | null
  terminal: string | null
  delay: number | null
}
