// Minimal Essential Database Structure for PropAI

export interface User {
  id: string; // Unique user ID
  full_name: string | null; // User identity
  email: string; // Login credential
  password_hash?: string; // Secure authentication hash (or profile reference)
  role: string; // Permission control (e.g. 'admin', 'realtor', 'user')
  created_at: string; // Account creation timestamp
}

export interface Lead {
  id: string; // Unique lead ID
  full_name: string; // Lead identity
  email: string; // Contact method email
  phone: string; // Contact method phone
  budget: number; // Buyer budget
  preferred_location: string; // Desired area
  assigned_user_id: string; // Realtor ownership (uid pointer)
  pipeline_stage: string; // Sales progress ('new', 'contacted', 'showing', 'offer', 'closed')
  created_at: string; // Lead timestamp
}

export interface Property {
  id: string; // Property ID
  title: string; // Listing name
  description: string; // Property details
  price: number; // Listing price
  property_type: string; // House/apartment/etc
  location: string; // Property area
  realtor_id: string; // Listing owner
  created_at: string; // Listing timestamp
  image_url?: string; // Optional property preview
}

export interface Conversation {
  id: string; // Conversation ID
  lead_id: string; // Related lead pointer
  message_content: string; // Stored message
  sender_type: 'user' | 'ai' | 'lead'; // User / AI / Lead
  created_at: string; // Message timestamp
}

export interface Appointment {
  id: string; // Appointment ID
  lead_id: string; // Related lead
  property_id: string; // Related property
  appointment_date: string; // Scheduled viewing date
  created_at: string; // Booking time
}

export interface Deal {
  id: string; // Deal ID
  lead_id: string; // Buyer/renter
  property_id: string; // Property sold
  deal_value: number; // Transaction amount
  deal_stage: string; // Transaction progress
  created_at: string; // Deal timestamp
}

export interface Task {
  id: string; // Task ID
  assigned_user_id: string; // Responsible realtor
  lead_id: string; // Related lead
  task_title: string; // Action required
  due_date: string; // Deadline
  completed?: boolean;
  category?: string; // e.g. 'In Progress', 'Pending', 'Completed'
  description?: string;
  created_at?: string;
}

export interface AIMemory {
  id: string; // Memory ID
  entity_id: string; // Related lead/property
  raw_content: string; // Stored memory text
  embedding_vector?: string | number[]; // AI searchable memory
  created_at?: string;
}

export interface Notification {
  id: string; // Notification ID
  user_id: string; // Receiver
  content: string; // Alert message
  read_status: boolean; // Seen/unseen
  created_at?: string;
}

export interface Subscription {
  id: string; // Subscription ID
  user_id: string; // Subscriber reference
  plan_name: string; // Current plan name
  billing_status: string; // Payment status (e.g., 'active', 'unpaid')
  created_at?: string;
}
