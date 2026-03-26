Chatbot

Create a clone of ChatGPT-like chatbot interface.

Features
	•	Send messages to chat, stream responses to client
	•	Integrate LLM API (OpenAI, Gemini or any other API / multiple LLMs)
	•	Left side nav with a list of chats, persisted in database
	•	Authorisation / user log in
	•	Paste or attach images to chat
	•	Anonymous access up to 3 free questions
	•	Synchronise new chats across tabs
	•	Upload documents and use data for context

Stack

Client-side
	•	React / Next.js
(or: Tanstack Start)
	•	Tanstack Query

UI
	•	Shadcn
	•	Tailwind

Server-side
	•	Next.js REST API
(alternatively: Hono / Express)

Database
	•	Postgres via Supabase
(alternatively: MongoDB)

Auth
	•	Supabase
(alternatively: Clerk)

Realtime updates
	•	Supabase Realtime
(alternatively: Socket.io)

Deployment
	•	Vercel
(alternatively: Railway / Render)

Requirements
	•	Please keep client code, REST API, and DB layers separate
	•	Fetch data from API routes only: no DB calls in components, including Server Components
	•	Access Supabase via API using service account: no public client or RLS
	•	For Realtime it’s okay to use public client (as it’s the only way)

Criteria on the demo project check
	•	API endpoints design (correct HTTP verbs, endpoints names)
	•	Database design (data non-excessive and optimised for the project and it’s growth)
	•	Security and lack of API key leaks
	•	UI and UX quality:
	•	Layout
	•	Animations
	•	Loading state
	•	Empty states
	•	Responsiveness
	•	Demo quality and straightforwardness
	•	Readme quality on how to start the project