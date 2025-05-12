export interface Table {
  id: number;
  table_number: number;
  capacity: number;
  is_available: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  tables: Table[];
}

export interface BookingFormData {
  table: string;
  booking_date: Date | null;
  booking_time: Date | null;
  party_size: number;
  special_requests: string;
}

export interface BookingData {
  restaurant: number;
  table: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
} 