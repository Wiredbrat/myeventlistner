export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          event_end_date: string | null;
          venue: string;
          address: string | null;
          image_url: string | null;
          original_url: string;
          ticket_url: string | null;
          price: string | null;
          category: string | null;
          source: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          event_date: string;
          event_end_date?: string | null;
          venue?: string;
          address?: string | null;
          image_url?: string | null;
          original_url: string;
          ticket_url?: string | null;
          price?: string | null;
          category?: string | null;
          source?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          event_date?: string;
          event_end_date?: string | null;
          venue?: string;
          address?: string | null;
          image_url?: string | null;
          original_url?: string;
          ticket_url?: string | null;
          price?: string | null;
          category?: string | null;
          source?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      email_captures: {
        Row: {
          id: string;
          email: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          event_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
