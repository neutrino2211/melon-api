export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          authorization_code: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          id: number
          name: string | null
          password: string | null
          pin: string | null
          verification_pending: boolean | null
        }
        Insert: {
          authorization_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
          pin?: string | null
          verification_pending?: boolean | null
        }
        Update: {
          authorization_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
          pin?: string | null
          verification_pending?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
