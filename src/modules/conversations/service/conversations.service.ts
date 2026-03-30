import { cookies } from 'next/headers';
import { createClient } from '@/shared/utils/supabase/server';
import { Conversation } from '../types';

export class ConversationsService {
  async getAllConversations(): Promise<Conversation[]> {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return data || [];
  }
}
