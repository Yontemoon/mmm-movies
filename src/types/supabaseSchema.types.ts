
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          id: number
          movie_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          movie_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          movie_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["movie_id"]
          },
        ]
      }
      movies: {
        Row: {
          backdrop_path: string
          genre_ids: number[] | null
          movie_id: number
          original_language: string | null
          overview: string | null
          popularity: number | null
          poster_path: string | null
          release_date: string | null
          supabase_id: number
          title: string | null
          video: boolean | null
          vote_average: number | null
          vote_count: number | null
        }
        Insert: {
          backdrop_path: string
          genre_ids?: number[] | null
          movie_id: number
          original_language?: string | null
          overview?: string | null
          popularity?: number | null
          poster_path?: string | null
          release_date?: string | null
          supabase_id?: number
          title?: string | null
          video?: boolean | null
          vote_average?: number | null
          vote_count?: number | null
        }
        Update: {
          backdrop_path?: string
          genre_ids?: number[] | null
          movie_id?: number
          original_language?: string | null
          overview?: string | null
          popularity?: number | null
          poster_path?: string | null
          release_date?: string | null
          supabase_id?: number
          title?: string | null
          video?: boolean | null
          vote_average?: number | null
          vote_count?: number | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string
          id: number
          movie_id: number
          rating_number: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          movie_id: number
          rating_number: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          movie_id?: number
          rating_number?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["movie_id"]
          },
        ]
      }
      watchlist: {
        Row: {
          created_at: string
          id: number
          movie_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          movie_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          movie_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["movie_id"]
          },
          {
            foreignKeyName: "watchlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
