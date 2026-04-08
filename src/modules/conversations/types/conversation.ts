export interface Conversation {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}
