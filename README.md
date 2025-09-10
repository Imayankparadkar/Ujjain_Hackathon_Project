Project Title – SmartKumbh: The Sentient & Resilient Pilgrim Ecosystem

Team ID: TH1309

1. Overview

SmartKumbh is a full-stack web platform designed to improve the pilgrim experience at the Kumbh Mela. It provides real-time crowd monitoring, safety alerts, lost & found services, spiritual event tracking, and AI-powered assistance in multiple languages. With interactive maps, QR-based identification, and role-based access, the platform ensures safety, smooth navigation, and accessibility for millions of visitors.

2. Problem & Solution

Problem Statement:
Kumbh Mela witnesses massive crowds, leading to challenges such as overcrowding, safety risks, missing persons, lack of real-time information, and difficulty navigating spiritual sites.

Solution:
SmartKumbh integrates AI, mapping, and real-time data systems to provide:

Live crowd density monitoring & safety alerts

Lost & found assistance with QR-based identification

AI-powered multilingual chatbot for pilgrims (supports 12 Indian languages)

Step-by-step spiritual journey navigation & event updates

Role-based admin controls for security officers and event managers

3. Logic & Workflow

Data Collection:
Crowd density from cameras/sensors, user reports, admin inputs, event details, lost & found cases.

Processing:
Data stored in PostgreSQL (structured) & Firestore (real-time sync). AI chatbot processes queries using Google Gemini. Zod validation ensures clean and secure data.

Output:
Interactive map with crowd levels, alerts, event schedules, facility details, and chatbot responses.

User Side:
Pilgrims get live navigation, safety alerts, spiritual journey guidance, QR ID, and chatbot assistance in their preferred language.

Admin Side:
Admins manage safety alerts, lost & found reports, event schedules, cleanliness reports, and real-time monitoring of bathing zones & parking facilities.

4. Tech Stack

Frontend: React 18 + TypeScript, Tailwind CSS, Radix UI, shadcn/ui, Wouter (routing)

Backend: Node.js + Express.js

Database: PostgreSQL (Neon) with Drizzle ORM + Firestore (real-time sync)

AI: Google Gemini AI (multilingual chatbot)

Maps: Leaflet + OpenStreetMap for interactive maps & navigation

Auth & Storage: Firebase Authentication + Firestore

Other Tools: QRCode.js, TanStack Query, Zod, React Hook Form

5. Future Scope

Mobile app integration for Android/iOS with offline support

Advanced AI features for predictive crowd control and personalized pilgrim guidance

Integration with government safety and tourism helpline systems

IoT sensor-based crowd density monitoring for more accurate safety management

Multi-user collaboration with real-time dashboards for police, medical, and admin teams
