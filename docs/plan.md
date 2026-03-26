# Implementation Plan — ChatGPT Clone

> **Workflow**: Each section is a standalone step. Tell me the number (e.g. "Step 3") and I will implement it fully before moving on.

---

## Step 1 — Dependencies & Project Setup

- 1.1 Install runtime dependencies:
  - `@tanstack/react-query` — server state management
  - `@supabase/supabase-js` + `@supabase/ssr` — Supabase client
  - `ai` + `@ai-sdk/openai` — Vercel AI SDK for streaming
  - `openai` — OpenAI SDK
  - `zod` — schema validation
  - `react-hook-form` + `@hookform/resolvers` — forms
  - `sonner` — toast notifications
  - `lucide-react` — icons
  - `react-markdown` + `rehype-highlight` + `highlight.js` — message rendering
  - `uuid` — anonymous session IDs
  - `cookies-next` — cookie helpers
  - `pdf-parse` + `mammoth` — document text extraction
- 1.2 Initialize Shadcn/ui (run CLI, set up `components.json`, add base components: Button, Input, Textarea, Dialog, Sheet, Dropdown, Avatar, Separator, Tooltip, ScrollArea)
- 1.3 Configure TanStack Query provider in `app/layout.tsx`
- 1.4 Add all required environment variables to `.env.local` and create `.env.example`

---

## Step 2 — Database (Supabase)

- 2.1 Document the Supabase project setup instructions
- 2.2 Write SQL migration — table `conversations`:
  - `id`, `user_id` (nullable FK → auth.users), `session_id` (nullable, for anonymous), `title`, `model`, `created_at`, `updated_at`
- 2.3 Write SQL migration — table `messages`:
  - `id`, `conversation_id` (FK), `role` (user/assistant/system), `content`, `tokens_used`, `created_at`
- 2.4 Write SQL migration — table `attachments`:
  - `id`, `message_id` (FK), `storage_path`, `file_name`, `mime_type`, `created_at`
- 2.5 Write SQL migration — table `documents`:
  - `id`, `conversation_id` (FK), `storage_path`, `file_name`, `extracted_text`, `created_at`
- 2.6 Write SQL migration — table `anonymous_usage`:
  - `id`, `session_id` (unique), `question_count`, `created_at`
- 2.7 Create indexes: `conversations(user_id)`, `conversations(session_id)`, `messages(conversation_id, created_at)`, `documents(conversation_id)`
- 2.8 Create Supabase Storage buckets: `attachments` (private), `documents` (private)
- 2.9 Save all migrations to `supabase/migrations/` folder

---

## Step 3 — Supabase Clients & Shared Lib

- 3.1 Create `src/shared/lib/supabase-server.ts` — service-role client (server-only, never exposed to browser)
- 3.2 Create `src/shared/lib/supabase-realtime.ts` — anon-key client (browser-only, for Realtime subscriptions)
- 3.3 Create `src/shared/lib/openai.ts` — OpenAI client initialization
- 3.4 Create `src/shared/types/index.ts` — global TypeScript types (Conversation, Message, Attachment, Document, AnonymousUsage)
- 3.5 Create `src/middleware.ts` — Next.js middleware to refresh Supabase auth session cookie on every request

---

## Step 4 — Authentication

- 4.1 Create `src/modules/auth/` module structure (service, components, hooks, types)
- 4.2 Create `src/modules/auth/service/auth.service.ts` — signIn, signUp, signOut, getUser via service-role client
- 4.3 Build `src/modules/auth/components/LoginForm.tsx` — email + password form with validation
- 4.4 Build `src/modules/auth/components/SignupForm.tsx` — email + password + confirm form
- 4.5 Create `src/app/(auth)/login/page.tsx` — login page
- 4.6 Create `src/app/(auth)/signup/page.tsx` — signup page
- 4.7 Create `src/modules/auth/hooks/useAuth.ts` — TanStack Query hook for current user
- 4.8 Update `src/middleware.ts` — redirect unauthenticated users away from `/chat` only if anonymous limit exceeded

---

## Step 5 — App Layout & Sidebar UI

- 5.1 Build `src/shared/layouts/MainLayout.tsx` — two-column shell: fixed sidebar (left) + scrollable main area (right)
- 5.2 Build `src/modules/conversations/components/Sidebar.tsx`:
  - "New Chat" button at top
  - List of conversations (grouped by date: Today, Yesterday, Older)
  - Hover actions: rename (inline edit), delete (with confirm dialog)
  - User avatar + email at bottom with sign-out
- 5.3 Build `src/modules/conversations/components/ConversationItem.tsx` — single list item with hover state
- 5.4 Make sidebar collapsible: toggle button, collapsed = icon-only on desktop; Sheet (drawer) on mobile
- 5.5 Create `src/app/chat/page.tsx` — empty/new chat landing with prompt suggestions
- 5.6 Create `src/app/chat/[id]/page.tsx` — specific conversation page
- 5.7 Update `src/app/page.tsx` — redirect to `/chat`

---

## Step 6 — Conversations API

- 6.1 Create `src/modules/conversations/service/conversations.service.ts` — DB queries: list, getById, create, updateTitle, deleteById
- 6.2 Create `src/modules/conversations/types/index.ts` — Conversation, Message types
- 6.3 Implement `GET /api/conversations` — list conversations for authenticated user OR anonymous session
- 6.4 Implement `POST /api/conversations` — create new conversation (with Zod body validation)
- 6.5 Implement `GET /api/conversations/[id]` — return conversation + all messages
- 6.6 Implement `PATCH /api/conversations/[id]` — update title
- 6.7 Implement `DELETE /api/conversations/[id]` — delete conversation + cascade messages
- 6.8 All routes: validate ownership (user_id or session_id must match), return proper HTTP status codes

---

## Step 7 — Conversations UI (TanStack Query)

- 7.1 Create `src/modules/conversations/hooks/useConversations.ts` — `useQuery` list, `useMutation` create/delete/rename
- 7.2 Create `src/modules/conversations/hooks/useConversation.ts` — `useQuery` single conversation with messages
- 7.3 Wire Sidebar to `useConversations` — optimistic create (navigate immediately), optimistic delete
- 7.4 Auto-generate conversation title after first message (PATCH title on API side)
- 7.5 "New Chat" button creates conversation and navigates to `/chat/[id]`

---

## Step 8 — LLM Streaming (Messages API)

- 8.1 Create `src/modules/conversations/service/messages.service.ts` — saveMessage, getMessages, buildContextMessages
- 8.2 Create `GET /api/models` — return list of available models (gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
- 8.3 Implement `POST /api/conversations/[id]/messages`:
  - Validate auth/session and anonymous quota
  - Save user message to DB
  - Build messages array (history + optional document context as system message)
  - Call `streamText()` from Vercel AI SDK with selected model
  - Return `ReadableStream` (SSE)
  - After stream complete: save assistant message to DB, update `conversation.updated_at`
- 8.4 Create `src/modules/conversations/hooks/useStreamingMessage.ts` — read SSE stream chunks, append to local state, handle abort

---

## Step 9 — Chat UI

- 9.1 Build `src/modules/conversations/components/ChatWindow.tsx` — full chat layout with message list + input at bottom
- 9.2 Build `src/modules/conversations/components/MessageList.tsx` — virtualized list, auto-scroll to bottom on new messages, scroll-to-bottom FAB when not at bottom
- 9.3 Build `src/modules/conversations/components/MessageItem.tsx`:
  - User messages: right-aligned bubble
  - Assistant messages: left-aligned with bot avatar
  - Markdown rendering with `react-markdown`
  - Syntax-highlighted code blocks with copy button
  - Streaming state: animated blinking cursor
  - Loading skeleton while assistant is thinking
- 9.4 Build `src/modules/conversations/components/ChatInput.tsx`:
  - Auto-resize `<textarea>` (grows with content, max height)
  - Send on Enter (Shift+Enter = new line)
  - Attach image button (file input)
  - Image paste from clipboard
  - Image preview thumbnails before send
  - Disabled state while streaming (with Stop button to abort)
  - Model selector dropdown

---

## Step 10 — Anonymous Access

- 10.1 Create `src/shared/hooks/useAnonymousSession.ts` — reads/sets `anonymous_session` cookie (UUID)
- 10.2 Implement `GET /api/anonymous` — return `{ question_count }` for session_id
- 10.3 Implement `POST /api/anonymous` — increment question count for session_id (upsert)
- 10.4 In `POST /api/conversations/[id]/messages` — check anonymous count before processing; return `403` with `{ error: 'limit_reached' }` if ≥ 3
- 10.5 Build anonymous limit banner in ChatInput: show "X of 3 free questions used"
- 10.6 Build `src/modules/auth/components/UpgradeModal.tsx` — modal shown on 403, prompt to sign up or log in

---

## Step 11 — Image Attachments

- 11.1 Create `src/modules/conversations/service/attachments.service.ts` — upload to Supabase Storage, save to `attachments` table, generate signed URL
- 11.2 In `ChatInput`: on file select or paste, call upload service, display thumbnail with remove button
- 11.3 In `POST /api/conversations/[id]/messages` — accept `attachmentIds[]`, fetch storage paths, build `image_url` content blocks for OpenAI
- 11.4 In `MessageItem` — render attached images above message text

---

## Step 12 — Document Upload & RAG Context

- 12.1 Create `src/modules/documents/service/documents.service.ts` — upload file, extract text (pdf-parse / mammoth), save to `documents` table
- 12.2 Implement `POST /api/conversations/[id]/documents` — multipart upload, text extraction, store in DB
- 12.3 Implement `GET /api/conversations/[id]/documents` — list documents for conversation
- 12.4 Build `src/modules/documents/components/DocumentUpload.tsx` — drag-and-drop zone, upload progress, file list with delete
- 12.5 In `messages.service.ts` `buildContextMessages()` — prepend system message with extracted document text (truncated to ~8k tokens)
- 12.6 Show document context indicator in ChatWindow ("Conversation has 2 documents as context")

---

## Step 13 — Realtime Cross-Tab Sync

- 13.1 Create `src/modules/conversations/hooks/useRealtimeSync.ts`:
  - Subscribe to Supabase Realtime channel `conversations:{userId}`
  - On `INSERT` event → `queryClient.invalidateQueries(['conversations'])`
  - On `UPDATE` event → update specific conversation in cache
  - On `DELETE` event → remove from cache
- 13.2 In API routes (POST/PATCH/DELETE conversations) — broadcast event to Realtime channel after DB mutation
- 13.3 Mount `useRealtimeSync` in `MainLayout` for logged-in users

---

## Step 14 — Polish & UX

- 14.1 Loading skeletons: conversation list, message list, sending state
- 14.2 Empty states: no conversations (with suggestions), no messages (with prompt ideas grid)
- 14.3 Error boundaries and error states for failed API calls
- 14.4 Sonner toasts: copy message, upload success/error, delete confirmation
- 14.5 Keyboard shortcuts: `Cmd+K` to focus input, `Cmd+N` for new chat
- 14.6 Responsive layout: sidebar as drawer on mobile (Sheet), full-width chat
- 14.7 Dark mode support (Tailwind `dark:` variants)
- 14.8 Page `<title>` updates to conversation title
- 14.9 Smooth animations: sidebar slide, message appear (Tailwind animate-in)

---

## Step 15 — README & Documentation

- 15.1 Write `README.md`:
  - Project overview and features
  - Prerequisites (Node, pnpm, Supabase account, OpenAI API key)
  - Environment variables table
  - Supabase setup steps (create project, run migrations, create storage buckets)
  - Local development: `pnpm install && pnpm dev`
  - Vercel deployment guide
- 15.2 Add API reference section to README (all endpoints, request/response shapes)
- 15.3 Update `docs/architecture.md` with final module structure

---

## Sequence Overview

```
1 Setup → 2 DB → 3 Lib → 4 Auth → 5 Layout → 6 API → 7 UI
→ 8 Streaming → 9 Chat UI → 10 Anonymous → 11 Images
→ 12 Documents → 13 Realtime → 14 Polish → 15 Docs
```
