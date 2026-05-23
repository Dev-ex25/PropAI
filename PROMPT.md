# PropAI Master Builder Blueprint Prompt

Copy and paste the prompt below into any AI webapp builder to recreate the exact premium PropAI real estate platform—from its luxurious Obsidian Black and Gold aesthetics to its deep multi-system functional orchestrations.

---

```text
Build a premium, high-end AI-powered Real Estate Automation Platform named "PropAI" from scratch using React 18, Vite, Tailwind CSS, Lucide React icons, motion (framer-motion), and an Express full-stack Node backend server with Google GenAI Model integrations.

### 1. DESIGN THEME & VISUAL IDENTITY (The "Obsidian & Gold" Aesthetic)
- **Primary Canvas Background**: Deep Obsidian Midnight Black (#050505) and Dark Slate Charcoal grey (#0A0A0A) for card containers.
- **Accents**: Sophisticated Metallic gold (#C5A059 / `text-gold` / `border-gold`), soft luxury amber tones, and high-contrast clinical white for display typography.
- **Borders & Dividers**: Sterile slate hairline borders (#151515 & #1A1A1A).
- **Typography Pairing**: Elegant Sans-serif headings with high-density uppercase letters, custom space tracking, and Fira Code / JetBrains Mono for system-level telemetry blocks.
- **Transitions**: Smooth micro-interactions, spring-loaded sidebar collapse animations, and graceful screen fade-ins utilizing standard framer-motion setups.

### 2. CORE SYSTEM ARCHITECTURE & EXECUTABLE PAGES
Implement a fully functional app with a collapsible left sidebar navigation linking the following views:

1. **Realtor Dashboard Control cockpit**:
   - Executive onboarding activation checklist tracker linking: Gmail communication credentials, Google Calendar syncs, and Property Directories.
   - Live telemetry status headers indicating "PropAI Autonomous Systems Running Daemon" in high-contrast glowing green circles.
   - Interactive widgets for: Property Listings Portfolio, Client CRM contacts cards, dynamic tasks lists (with adding, completing, and commenting triggers), and metric cards summarizing total listings (45), assigned tasks, closed sales, and overdue events.

2. **Projects Overview Database**:
   - Dynamic searchable property index displaying full visual listing cards with price labels, beds/baths tags, and address summaries.
   - A standard manual adding module with a Gemini description auto-generator triggering custom descriptions summarizing structural property details.
   - A custom interactive "AI Property Appraiser Telemetry" panel presenting Neural Heuristics Reports: Demographic matches, net yield percentage forecasts, and estimated rental spaces derived dynamically.

3. **Gmail Communications Hub**:
   - Connectable inboxes presenting sandbox simulated or Google API OAuth live email records with robust search facilities.
   - A smart scanning dashboard that classifies inbound mail category, intent ("scheduling", "pricing", "availability", "inquiry"), urgency levels, list profiles, next priority task checklists, and drafts responsive outbound replies instantly.
   - Flexible email composer with a custom AI draft sequence generator.

4. **Concierge Schedule & Video Walkthroughs**:
   - Full schedule overview tracking appointments with client profiles and attached Google Meet live video conference spaces.
   - Dynamic schedule reservation module checking conflict windows and offering potential alternate slots during conflicts using automated calendar collision safeguards.

5. **Built-In AI Operations Assistant**:
   - High-contrast chat terminal accepting natural language instructions.
   - Custom orchestration execution metrics tracing: identified tasks ("listing_generation", "calendar_scheduling", "lead_outreach_nudge", "analytics_reporting"), step-by-step explanatory text, and structured JSON payloads showing live automation telemetry feeds.

6. **Lead Pipeline & Inactivity Guard**:
   - A pipeline stage column outlining buyers, intent tags, original messages, and status codes.
   - An inactivity trigger generator assessing custom unresponsive day timers and auto-compiles motivational outbound email pitches to re-engage colder prospects.

7. **Payment Protocols & Pricing**:
   - Premium tiers (Standard and Enterprise plans) configured with full Paystack redirection structures allowing custom checkout links, simulation of real-time transactions, and flexible workspace upgrades.

8. **Supabase Server Sync Admin Dashboard**:
   - Visual administration panel showing isolated database metrics, instant row additions, and custom queries.

### 3. BACKEND MODEL ENDPOINTS (Express Server)
Implement an active Node server exposing the following AI endpoints proxied through Google GenAI (using `gemini-3.5-flash` with graceful offline fallback schemas):
- `/api/generate-listing`: Compiles luxury descriptions based on features.
- `/api/reply-buyer`: Composes professional executive correspondence.
- `/api/ai/scan-email`: Classifies categories, urgency levels, action arrays, and schedules.
- `/api/ai/schedule-parse`: Prevent scheduling conflicts, analyze calendars.
- `/api/ai/follow-up`: Generates tailored motivational email drafts for inactive leads.
- `/api/ai/orchestrate`: Parses natural language commands to return executable structured tasks.
- `/api/ai/analytics-insights`: Calculates closing recommendations from client charts.
```
