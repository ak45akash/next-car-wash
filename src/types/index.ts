export type Service = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  duration: number;
  status: string;
  image_url?: string;
}

export type DisplaySettings = {
  showDuration: boolean;
  showCategory: boolean;
}

export type BookingData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  car_model: string;
  service_id: string;
  service_name: string;
  service_price: number;
  date: string;
  time_slot: string;
  payment_method: string;
  upi_id?: string | null;
  status: string;
  created_at: string;
} 