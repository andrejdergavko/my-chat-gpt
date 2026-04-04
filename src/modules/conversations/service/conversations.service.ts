import { createClient } from "@/lib/supabase/server";
import { Conversation } from "../types";

export class ConversationsService {
  async getAllConversations(): Promise<Conversation[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return data || [];
  }
}
