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
  booking_time: string | null;
  party_size: number;
  special_requests: string;
  email: string;
  phone_number: string;
  email_notification: boolean;
  sms_notification: boolean;
}

export interface BookingData {
  restaurant: number;
  table: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  email: string;
  phone_number: string;
  email_notification: boolean;
  sms_notification: boolean;
} 