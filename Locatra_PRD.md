# Product Requirements Document

# Locatra — *Locate Anything, Anywhere*

**AI-Powered AR Home Organization & Spatial Planning Platform**

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Draft for Review |
| **Date** | June 23, 2026 |
| **Owner** | Product / Founding Team |
| **Classification** | Internal — Investor & Engineering Reference |

---

## Table of Contents

1. Executive Summary
2. Product Vision
3. Problem Statement
4. Solution Overview
5. Goals & Success Metrics
6. Target Users & Personas
7. User Stories
8. Core User Journey
9. Functional Requirements
10. Non-Functional Requirements
11. Technical Architecture
12. Database Schema
13. API Design
14. AI Pipeline Architecture
15. Cloud Infrastructure & DevOps
16. Security & Compliance
17. Development Roadmap & Sprint Plan
18. MVP Scope
19. Future Roadmap
20. Risk Analysis
21. Competitive Analysis
22. Monetization Strategy
23. Cost Estimation
24. Appendix & Glossary

---

## 1. Executive Summary

Locatra is a web-based, AI-driven augmented reality platform that answers one deceptively hard question for every household and business: **"Where should this go?"** Users scan an object with a phone camera, Locatra turns it into a measured 3D model, scans the surrounding room into a digital twin, and then recommends — and visually previews in AR — the single best place to put that object without creating clutter, blocking a walkway, or breaking the room's flow.

Locatra is built **fully on Next.js (latest, v16.2.x)** for the web and AR client, paired with a Python/FastAPI AI microservice layer for computer vision, 3D reconstruction, and spatial reasoning. The MVP focuses on single-room scanning, single-object placement recommendations, and an in-browser WebXR preview — designed to ship fast, prove the core "scan → recommend → preview" loop, and expand into full-home digital twins, multi-room optimization, and an AI interior designer in later phases.

---

## 2. Product Vision

> Build a real-time AI system that lets anyone scan an object with their phone, turn it into an accurate 3D model, scan their home, and instantly know — and *see* — the best place to put it, without ever lifting the object twice.

Locatra acts as an **intelligent spatial assistant**: it builds a persistent digital twin of a user's home, remembers what's already in it, and continuously reasons about free space, walkways, accessibility, and the user's own preferences every time a new object enters the picture.

**Design principles**

- **Camera-first, app-optional** — runs entirely in the browser via WebXR; no app store install required for the MVP.
- **Measure once, place forever** — every scanned object and room becomes a reusable digital asset.
- **Explainable AI** — every recommendation comes with a plain-language reason and a confidence score, never a black-box answer.
- **Privacy by design** — spatial scans are sensitive (they map a person's home); data is encrypted, scoped per-user, and never shared without explicit consent.

---

## 3. Problem Statement

People consistently struggle with:

- Knowing whether a new object will physically **fit** in their home before buying or moving it.
- Finding the **optimal** storage or display location among several plausible spots.
- **Visualizing** furniture or appliances in place before committing to a purchase or a move.
- Organizing **limited space** efficiently, especially in apartments, dorms, and small homes.
- **Manually measuring** objects and rooms with a tape measure — slow, error-prone, and easy to skip.

Existing tools (IKEA Place, Apple Measure, generic AR furniture viewers) let users drop a 3D model into a room and look at it — but none of them **understand the whole room**, reason about walkways and clutter, or **recommend** a placement on the user's behalf. Locatra closes that gap by combining object digitization, spatial understanding, and recommendation in one continuous flow.

---

## 4. Solution Overview

Locatra's end-to-end flow:

1. User scans their **room** with a phone camera → Locatra builds a 3D digital twin of the space.
2. User scans or uploads images/video of an **object** → Locatra reconstructs it into a measured 3D model.
3. The **Spatial Understanding Engine** analyzes the room: free space, obstacles, walkways, doors, windows, safety clearances.
4. The **AI Placement Recommendation Engine** scores candidate locations and proposes the best one, with reasoning.
5. The user previews the recommendation in **AR** directly in the browser, can reposition it, and confirms or saves it.
6. Locatra remembers the room, the object, and the user's choices for smarter future recommendations.

---

## 5. Goals & Success Metrics

### 5.1 Product Goals

- Make "will it fit, and where" a 60-second answer instead of a 20-minute chore.
- Achieve recommendation quality that a human would agree with at least 8 times out of 10.
- Make the AR preview fast enough that it feels instant, not like a loading screen.

### 5.2 Success Metrics (KPIs)

| Metric | Target (MVP) | Target (Year 1) |
|---|---|---|
| Object scan → usable 3D model time | < 30 sec | < 15 sec |
| Room scan → digital twin time | < 2 min | < 90 sec |
| Object dimension accuracy (vs. ground truth) | ± 5 cm | ± 2 cm |
| Placement recommendation acceptance rate | ≥ 70% | ≥ 85% |
| AR scene load time | < 5 sec | < 3 sec |
| 3D model load time | < 10 sec | < 5 sec |
| Monthly active users retained at 60 days | 25% | 45% |
| Avg. recommendations generated per user/month | 3 | 8 |

---

## 6. Target Users & Personas

### Primary

- **Homeowners** — optimizing permanent storage and furniture layout.
- **Renters** — frequently moving, need fast, low-commitment planning.
- **Interior designers** — professional placement and client presentations.
- **Furniture buyers** — "will this couch fit?" before purchase.
- **Storage planners** — maximizing small or constrained spaces.

### Secondary

- **Real estate companies** — staging and listing visualization.
- **Furniture retailers** — try-before-you-buy AR placement at the point of sale.
- **Warehouse / facility organizers** — larger-scale spatial layout.

### Representative Persona

> **Ananya, 29, renter in a 1-bed apartment.** Just bought a study table online. She doesn't know if it will fit in her living room corner or block her balcony door. She opens Locatra on her phone, scans her room once, scans a photo of the table from the listing, and in under a minute gets a recommended corner with a clearance-checked placement she can preview in AR before the table even arrives.

---

## 7. User Stories

### Authentication & Account

- As a **new user**, I want to sign up with email or Google so I can save my scans across sessions.
- As a **returning user**, I want to see all my previously scanned rooms and objects in one dashboard.

### Object Scanning

- As a **user**, I want to scan an object by walking around it with my phone camera so Locatra can build a 3D model automatically.
- As a **user**, I want to upload existing photos of an object (e.g., from a furniture website) instead of scanning it live.
- As a **user**, I want Locatra to tell me the object's exact height, width, and depth without using a tape measure.
- As a **user**, I want Locatra to identify what category of object I scanned (e.g., "chair," "bookshelf") automatically.

### Room Scanning

- As a **user**, I want to scan my room once and have Locatra remember it, so I don't need to rescan every time.
- As a **user**, I want Locatra to detect my doors, windows, and walkways so it never recommends blocking them.
- As a **user**, I want to see which areas of my room are already "free space" at a glance.

### Recommendation

- As a **user**, I want Locatra to recommend the single best spot for my new object, with a clear reason why.
- As a **user**, I want to see alternative locations ranked, in case I don't like the top recommendation.
- As a **user**, I want Locatra to warn me if an object won't fit anywhere safely in the room.

### AR Visualization

- As a **user**, I want to see the recommended object placement overlaid on my real room through my phone camera.
- As a **user**, I want to move, rotate, and rescale the object in AR to compare positions myself.
- As a **user**, I want to confirm a placement and have Locatra save it as the object's "home."

### Memory & Personalization

- As a **returning user**, I want Locatra to learn that I prefer storage near walls, and apply that to future recommendations.
- As a **user**, I want to review and edit my saved preferences at any time.

### Designer / Pro User

- As an **interior designer**, I want to manage multiple client rooms under separate projects.
- As an **interior designer**, I want to export a placement plan (image/PDF) to share with a client.

---

## 8. Core User Journey

```
 ┌──────────────┐     ┌──────────────┐     ┌────────────────────┐     ┌──────────────────┐     ┌──────────────┐
 │  1. Sign up   │ --> │ 2. Scan Room │ --> │ 3. Scan / Upload   │ --> │ 4. AI Recommends  │ --> │ 5. AR Preview │
 │  / Login      │     │ (digital     │     │    Object          │     │    Placement      │     │  & Confirm    │
 │               │     │  twin built) │     │ (3D model + dims)  │     │ (ranked + reason) │     │               │
 └──────────────┘     └──────────────┘     └────────────────────┘     └──────────────────┘     └──────────────┘
                                                                                                        │
                                                                                                        v
                                                                                          ┌──────────────────────┐
                                                                                          │ 6. Saved to Smart     │
                                                                                          │ Home Memory for       │
                                                                                          │ future recommendations│
                                                                                          └──────────────────────┘
```

**Step detail:**

1. **Object Scanning** — camera capture (video/multi-image) or upload → image processing → AI 3D reconstruction → GLB/GLTF model + dimensions + category.
2. **Room Scanning** — camera walkthrough → wall/floor/door/window/furniture detection → 3D room mesh + labeled free-space regions.
3. **Spatial Analysis** — free space, obstacles, walkways, accessibility, and safety-distance rules are computed against the room mesh.
4. **Placement Recommendation** — candidate spaces are scored against the object's dimensions and the user's preferences; top recommendation + alternatives + confidence + reasoning are returned.
5. **AR Visualization** — WebXR overlays the model at the recommended pose; user can translate/rotate/scale and accept.
6. **Smart Home Memory** — accepted/rejected placements, room layout, and preferences are persisted for future sessions.

---

## 9. Functional Requirements

### FR-1 — User Authentication & Profile

- Email/password and OAuth (Google, Apple) sign-up/login.
- Profile management: name, avatar, unit preference (metric/imperial).
- Persistent storage of scanned rooms, scanned objects, and past recommendations per user.
- Role support: `homeowner`, `designer` (multi-project workspace), `admin`.

### FR-2 — Object Scanning Module

**Purpose:** Convert a physical object into a measured, categorized 3D digital asset.

| Input | Process | Output |
|---|---|---|
| Live camera video, multiple still images, or uploaded images | Image preprocessing → AI 3D reconstruction (photogrammetry / Gaussian Splatting) → mesh cleanup → dimension extraction → category classification | GLB/GLTF model, bounding-box dimensions (H × W × D), estimated category, optional weight/material estimate |

Example output:

```json
{
  "name": "Wooden Chair",
  "category": "furniture.chair",
  "dimensions_cm": { "height": 90, "width": 45, "depth": 50 },
  "model_url": "https://cdn.locatra.app/models/obj_4471.glb",
  "confidence": 0.96
}
```

### FR-3 — AI Object Recognition

- Real-time object detection and classification on captured frames.
- Returns object label, confidence score, and a category from a fixed taxonomy: `furniture`, `appliance`, `electronics`, `storage`, `household`.
- Low-confidence detections prompt the user to confirm or correct the label manually.

### FR-4 — Depth Estimation

- Monocular depth estimation from captured frames to support dimension accuracy and scene scale, especially when LiDAR is unavailable on the device.
- Generates per-frame depth maps consumed by both the object-reconstruction and room-scanning pipelines.
- Falls back gracefully on devices with native ARKit/ARCore depth APIs by preferring hardware depth when present.

### FR-5 — Room Scanning / Digital Twin

**Purpose:** Build a persistent, reusable 3D model of the user's space.

- Captures walls, floor, ceiling height, doors, windows, fixed furniture, and currently-empty regions.
- Outputs a labeled 3D room mesh plus a structured list of named free-space regions with their dimensions.

Example output:

```json
{
  "room_name": "Living Room",
  "dimensions_m": { "length": 5.0, "width": 4.0, "height": 2.8 },
  "free_spaces": [
    { "label": "Corner A", "width_cm": 120, "depth_cm": 80 },
    { "label": "Wall space B", "width_cm": 200, "depth_cm": 90 }
  ]
}
```

### FR-6 — Spatial Understanding Engine

AI-driven analysis of the room mesh to determine:

- Free space vs. occupied space.
- Obstacles and fixed furniture boundaries.
- Walking paths and minimum clearance corridors.
- Accessibility constraints (e.g., wheelchair clearance where flagged by the user).
- Safety-distance rules.

Hard constraints enforced by the engine — a recommendation must never:

- Block a door or window.
- Reduce a primary walkway below a configurable minimum width (default 80 cm).
- Overcrowd a room beyond a configurable density threshold.

### FR-7 — AI Placement Recommendation Engine

The platform's core intelligence layer.

**Input:** object dimensions + category, room free-space map, user preference profile.

**Output:** ranked placement candidates, each with a fit score, accessibility score, walkway-impact score, an aggregate confidence score, and a plain-language reason.

Example:

```json
{
  "recommended_placement": {
    "room": "Living Room",
    "location": "Corner A",
    "confidence": 0.91,
    "reasons": [
      "Fits within available dimensions with 10cm clearance",
      "Maintains main walking path",
      "Matches user's wall-adjacent storage preference"
    ]
  },
  "alternatives": [
    { "location": "Wall space B", "confidence": 0.74 }
  ]
}
```

### FR-8 — AR Visualization

- WebXR-based AR session launched directly from the browser (no native app required for MVP).
- Overlay the recommended 3D model at the suggested pose in the live camera feed.
- Gesture/touch controls: move, rotate, scale.
- "Compare positions" mode to view multiple candidate placements in sequence.
- Confirm action persists the final placement back to the room's digital twin.

### FR-9 — 3D Model Viewer

- Non-AR fallback viewer (orbit, pan, zoom) for devices without WebXR support.
- Dimension inspection overlay (toggleable measurement lines).
- Supported formats: GLB, GLTF, OBJ (import).

### FR-10 — Smart Home Memory

- Persists room layouts, object locations, scan history, and accepted/rejected recommendations.
- Learns soft preferences over time (e.g., "prefers storage near walls," "avoids placing objects near windows") and feeds them back into FR-7.
- Preferences are user-editable and can be reset.

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | AR scene loads in < 5 sec; 3D model loads in < 10 sec; object movement in AR renders at 60 fps target / 30 fps minimum |
| **Scan Performance** | Object scan processed in < 30 sec (MVP), < 15 sec (target); room scan in < 2 min (MVP), < 90 sec (target) |
| **Scalability** | Architecture supports horizontal scaling from thousands to 1M+ users via stateless API services and queued AI workloads |
| **Availability** | 99.9% uptime target for core API and web app |
| **Security** | JWT-based authentication, role-based access control, encrypted storage at rest and in transit, signed/expiring upload URLs |
| **Privacy** | Spatial scans and models are private by default; explicit user consent required for any sharing or export |
| **Accessibility** | WCAG 2.1 AA compliance for all non-AR UI surfaces |
| **Browser Support** | Modern Chromium-based mobile browsers (WebXR), graceful 3D-viewer fallback on unsupported browsers |
| **Observability** | Structured logging, distributed tracing across Next.js and FastAPI services, error monitoring with alerting |

---

## 11. Technical Architecture

### 11.1 High-Level Architecture

```
                         ┌─────────────────────────────────────────┐
                         │             Next.js 16 Web App           │
                         │  (App Router · React 19 · Turbopack)     │
                         │                                          │
                         │  - Camera capture UI                     │
                         │  - WebXR AR viewer (react-three-fiber)   │
                         │  - 3D model viewer (three.js)            │
                         │  - Recommendation dashboard               │
                         │  - Route Handlers (BFF layer)            │
                         │  - Auth.js (NextAuth) sessions           │
                         └───────────────┬──────────────────────────┘
                                         │  REST / Server Actions
                                         │  (signed requests)
                          ┌──────────────┴───────────────┐
                          │                               │
                ┌─────────▼─────────┐         ┌──────────▼──────────┐
                │  Next.js Route     │         │   FastAPI AI         │
                │  Handlers (BFF)    │         │   Microservice       │
                │  - Auth/session    │         │   (Python, GPU)      │
                │  - Project CRUD    │         │  - Object detection   │
                │  - Light queries   │         │  - 3D reconstruction  │
                └─────────┬──────────┘         │  - Depth estimation   │
                          │                     │  - Recommendation     │
                          │                     │    engine             │
                          │                     └──────────┬───────────┘
                          │                                │
                ┌─────────▼────────────────────────────────▼───────────┐
                │                    PostgreSQL                        │
                │   Users · Rooms · Objects · Scans · Recommendations  │
                └───────────────────────────────────────────────────────┘
                          │                                │
                ┌─────────▼─────────┐           ┌──────────▼───────────┐
                │   AWS S3 / R2      │           │  Redis Queue / SQS    │
                │  (raw media, GLB)  │           │ (async AI job queue)  │
                └────────────────────┘           └───────────────────────┘
```

The Next.js app is the **single client surface** and also acts as a thin **Backend-for-Frontend (BFF)** for fast, low-latency operations (auth, CRUD, session, listing data). Heavy, GPU-bound AI work (3D reconstruction, depth estimation, recommendation scoring) is delegated asynchronously to the FastAPI microservice so the web tier stays fast and stateless.

### 11.2 Frontend Architecture — Next.js (latest, v16.2.x)

Locatra's web and AR client is built entirely on **Next.js 16** (current stable line as of mid-2026), chosen for its React Server Components model, Turbopack-first build pipeline, and first-class support for streaming, partial prerendering, and edge-ready route handlers.

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.2.x**, App Router, React 19 |
| Bundler | Turbopack (default for dev and build in Next.js 16) |
| Rendering | React Server Components for dashboards/data views; Client Components for camera, 3D, and AR surfaces |
| Caching | Next.js Cache Components for explicit, fine-grained caching of room/object metadata |
| 3D Engine | three.js via **@react-three/fiber** |
| AR | **WebXR Device API** via **@react-three/xr** |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| State | Zustand (client-side scan/AR session state) |
| Forms & Validation | React Hook Form + Zod |
| Auth | Auth.js (NextAuth) — email/password + Google/Apple OAuth, JWT sessions |
| Data fetching | Server Actions + Route Handlers; SWR for client-side revalidation |
| Realtime job status | Server-Sent Events / WebSocket connection to FastAPI job queue |
| Testing | Playwright (E2E, incl. mocked WebXR), Vitest (unit) |

**Key frontend modules**

- **Camera Capture Interface** — guided multi-angle capture flow for both object and room scanning, with on-screen coverage guidance.
- **AR Viewer** — WebXR session host; renders the recommended placement, supports gesture-based move/rotate/scale, and a "compare placements" carousel.
- **3D Model Viewer** — orbit/pan/zoom fallback viewer with a toggleable measurement overlay.
- **Recommendation Dashboard** — server-rendered list of rooms, objects, and past/pending recommendations with confidence scores and reasoning.
- **Project Workspace (Pro/Designer tier)** — multi-room, multi-client project organization.

> **Note on device capture APIs:** Next.js itself does not perform camera capture or AR rendering — those rely on standard browser APIs (`getUserMedia`, WebXR). Next.js's role is to host and orchestrate these client components efficiently within a fast-loading, server-rendered shell, and to securely proxy captured media to the AI backend.

### 11.3 Backend Architecture — FastAPI (Python)

A dedicated Python service handles all GPU/AI workloads, kept separate from the Next.js BFF so AI processing can scale independently (e.g., on GPU-backed instances) without affecting web tier latency.

**Responsibilities:**

- Receiving uploaded media (images/video) for objects and rooms.
- Orchestrating the AI pipeline: detection → depth → 3D reconstruction → dimension extraction.
- Running the spatial understanding and placement recommendation engines.
- Managing asynchronous job state and emitting progress events.
- Writing structured results back to PostgreSQL and binary assets (GLB models, depth maps) to object storage.

**Async job pattern:** scanning and reconstruction are not instantaneous, so all heavy endpoints are job-based: the client submits media, receives a `job_id` immediately, and polls or subscribes (SSE/WebSocket) for status until the result (model URL, dimensions, recommendation) is ready.

### 11.4 AI Stack

| Capability | Approach |
|---|---|
| Object Detection & Classification | YOLO-family real-time detector (e.g., YOLOv11 or current equivalent), fine-tuned on a household/furniture taxonomy |
| Depth Estimation | Monocular depth model (e.g., Depth Anything V2 / MiDaS class), with native ARKit/ARCore depth preferred when available |
| 3D Reconstruction | Photogrammetry / 3D Gaussian Splatting pipeline (in-house or via providers such as Luma AI / Scaniverse-class APIs), exporting to GLB/GLTF |
| Room Mesh & Free-Space Extraction | Point-cloud/mesh segmentation to classify walls, floor, doors, windows, furniture, and label contiguous free-space regions |
| Spatial Reasoning | Custom rules + scoring engine (Section 11.5) layered on top of the room mesh |
| Recommendation Personalization | Preference model that re-weights placement scores using stored user feedback (future: reinforcement learning from accept/reject signals) |

> AI model choices are intentionally pluggable behind internal service interfaces — model versions will be re-evaluated each quarter as the field moves quickly; the architecture should not hard-couple to any single vendor or model version.

### 11.5 AI Placement Recommendation — Scoring Logic

For each candidate free-space region, the engine computes a weighted composite score:

```
score = w1 * fit_score          // does the object fit with margin?
      + w2 * accessibility_score // can a person comfortably reach/use it?
      + w3 * walkway_score       // impact on primary walking paths
      + w4 * preference_score    // alignment with learned user preferences
      + w5 * category_fit_score  // does object category suit this zone (e.g., bookshelf near wall)?

subject to hard constraints:
  - must not block any door or window bounding box
  - must not reduce any primary walkway below MIN_CLEARANCE_CM
  - must not exceed room density threshold
```

Candidates that violate a hard constraint are excluded before scoring; the remaining candidates are ranked, and the top result plus up to 2 alternatives are returned with human-readable reasons generated from the contributing score factors.

---

## 12. Database Schema

**Database:** PostgreSQL (accessed via Prisma ORM from Next.js for app-facing data, and SQLAlchemy/asyncpg from the FastAPI AI service for write-heavy AI job data — single shared schema, two typed clients).

### Core Tables

**users**

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| email | text, unique | |
| password_hash | text, nullable | null for OAuth-only accounts |
| name | text | |
| role | enum(`homeowner`,`designer`,`admin`) | |
| unit_preference | enum(`metric`,`imperial`) | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**projects**

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → users.id) | |
| name | text | e.g., "My Apartment", "Client: Sharma Residence" |
| created_at | timestamptz | |

**rooms**

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| project_id | uuid (FK → projects.id) | |
| name | text | e.g., "Living Room" |
| length_cm | numeric | |
| width_cm | numeric | |
| height_cm | numeric | |
| mesh_url | text | pointer to 3D room mesh in object storage |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**room_spaces** *(free-space regions within a room)*

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| room_id | uuid (FK → rooms.id) | |
| label | text | e.g., "Corner A" |
| width_cm | numeric | |
| depth_cm | numeric | |
| position_json | jsonb | coordinates within the room mesh |

**objects**

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → users.id) | |
| name | text | |
| category | text | taxonomy code, e.g., `furniture.chair` |
| height_cm | numeric | |
| width_cm | numeric | |
| depth_cm | numeric | |
| weight_kg | numeric, nullable | |
| material | text, nullable | |
| model_url | text | GLB/GLTF asset URL |
| created_at | timestamptz | |

**scans** *(raw capture sessions, for both rooms and objects)*

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → users.id) | |
| target_type | enum(`room`,`object`) | |
| target_id | uuid, nullable | FK to rooms.id or objects.id once processed |
| raw_media_url | text | uploaded video/images in S3 |
| status | enum(`queued`,`processing`,`completed`,`failed`) | |
| created_at | timestamptz | |

**ai_jobs** *(async processing job state)*

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| scan_id | uuid (FK → scans.id) | |
| job_type | enum(`object_reconstruction`,`room_mapping`,`recommendation`) | |
| status | enum(`queued`,`running`,`completed`,`failed`) | |
| progress_pct | int | |
| error_message | text, nullable | |
| started_at | timestamptz | |
| completed_at | timestamptz, nullable | |

**recommendations**

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| object_id | uuid (FK → objects.id) | |
| room_id | uuid (FK → rooms.id) | |
| recommended_space_id | uuid (FK → room_spaces.id) | |
| confidence_score | numeric | 0–1 |
| reasons_json | jsonb | array of reason strings |
| alternatives_json | jsonb | ranked alternative space IDs + scores |
| created_at | timestamptz | |

**placements** *(confirmed, accepted placements)*

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| recommendation_id | uuid (FK → recommendations.id), nullable | null if manually placed without a recommendation |
| object_id | uuid (FK → objects.id) | |
| room_id | uuid (FK → rooms.id) | |
| position_json | jsonb | final pose (x, y, z, rotation, scale) |
| confirmed_at | timestamptz | |

**preferences**

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → users.id) | |
| key | text | e.g., `prefers_wall_storage` |
| value_json | jsonb | |
| learned_from | enum(`explicit`,`inferred`) | |
| updated_at | timestamptz | |

---

## 13. API Design

### 13.1 Next.js Route Handlers (BFF — fast, app-facing)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | Auth.js session management (login/signup/OAuth) |
| `GET` | `/api/projects` | List current user's projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/rooms/:roomId` | Fetch a room's metadata + free-space list |
| `GET` | `/api/objects` | List current user's saved objects |
| `GET` | `/api/recommendations/:id` | Fetch a saved recommendation |
| `POST` | `/api/placements` | Confirm/save a final placement |
| `GET` | `/api/preferences` | Get current user's learned/explicit preferences |
| `PATCH` | `/api/preferences` | Update a preference |

### 13.2 FastAPI AI Service (heavy, async, GPU-backed)

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/v1/scan-object` | Upload object images/video → returns `job_id` |
| `POST` | `/v1/scan-room` | Upload room capture → returns `job_id` |
| `POST` | `/v1/generate-model` | Trigger/resume 3D model generation for a scan |
| `POST` | `/v1/recommend-placement` | Given `object_id` + `room_id` → returns ranked placements |
| `GET` | `/v1/jobs/:job_id` | Poll job status/progress |
| `WS` | `/v1/jobs/:job_id/stream` | Real-time job progress via WebSocket/SSE |
| `GET` | `/v1/user-models` | Retrieve a user's processed object models (internal, called by BFF) |

**Example — `POST /v1/recommend-placement` request/response**

```json
// Request
{
  "object_id": "obj_4471",
  "room_id": "room_1102"
}

// Response
{
  "job_id": "job_8821",
  "status": "completed",
  "recommended_placement": {
    "space_label": "Corner A",
    "confidence": 0.91,
    "reasons": [
      "Fits within available dimensions with 10cm clearance",
      "Maintains main walking path",
      "Matches user's wall-adjacent storage preference"
    ]
  },
  "alternatives": [
    { "space_label": "Wall space B", "confidence": 0.74 }
  ]
}
```

All endpoints require a signed JWT (issued by Auth.js and verified by FastAPI via a shared signing secret/JWKS endpoint). File uploads use pre-signed S3 URLs issued by the Next.js BFF to avoid routing large media through the application servers directly.

---

## 14. AI Pipeline Architecture

```
 Capture (video/images)
        │
        ▼
 Preprocessing (frame extraction, stabilization, quality filtering)
        │
        ├──────────────► Object Detection (YOLO-class model) ── category + bounding boxes
        │
        ├──────────────► Depth Estimation (monocular / hardware depth) ── per-frame depth maps
        │
        ▼
 3D Reconstruction (photogrammetry / Gaussian Splatting) ── point cloud → mesh
        │
        ▼
 Mesh Cleanup & Scaling (using depth-derived real-world scale)
        │
        ▼
 Dimension Extraction (bounding box → height/width/depth)
        │
        ▼
 GLB/GLTF Export ──► Object Storage (S3) ──► Database record (objects / rooms)
        │
        ▼
 [Room path only] Free-space + obstacle segmentation ──► room_spaces records
        │
        ▼
 Spatial Understanding Engine (walkways, accessibility, safety rules)
        │
        ▼
 Placement Recommendation Engine (scoring + ranking + reasoning)
        │
        ▼
 Recommendation returned to client ──► AR Viewer (Next.js / WebXR)
```

---

## 15. Cloud Infrastructure & DevOps

| Layer | Technology |
|---|---|
| Frontend hosting | **Vercel** (native Next.js 16 support: Turbopack builds, edge/Node runtimes, ISR/Cache Components) |
| AI backend hosting | **AWS** — containerized FastAPI service on ECS/EKS, GPU-backed instances (e.g., g5/g6 family) for reconstruction workloads |
| Object storage | **AWS S3** (or Cloudflare R2) for raw media, GLB models, depth maps |
| Database | **PostgreSQL** (Amazon RDS or equivalent managed instance) |
| Job queue | **Redis** (BullMQ) or **AWS SQS** for async AI job orchestration |
| CDN | **CloudFront** (or Vercel's edge network) for model/static asset delivery |
| Monitoring | CloudWatch + an APM tool (e.g., Sentry/Datadog) for error tracking and tracing across both services |
| CI/CD | GitHub Actions — lint/test/build on PR, preview deploys on Vercel, container builds pushed to ECR for the AI service |

---

## 16. Security & Compliance

- **Authentication:** JWT-based sessions via Auth.js; refresh-token rotation; OAuth via Google/Apple.
- **Authorization:** Role-based access control (`homeowner`, `designer`, `admin`); row-level scoping so users only ever access their own rooms/objects/projects (or shared project members, for the designer tier).
- **Data protection:** Encryption in transit (TLS) and at rest (S3 SSE, RDS encryption); pre-signed, time-limited upload/download URLs for media.
- **Spatial data sensitivity:** Room scans are treated as sensitive personal data — never used for any purpose beyond the user's own recommendations without explicit opt-in consent (e.g., for product improvement or anonymized research).
- **Account safety:** Rate limiting on auth and upload endpoints; audit logging of placement confirmations and data exports.
- **Compliance posture:** Designed to align with GDPR/CCPA-style data subject rights (export, delete) from day one, given the personal nature of home-spatial data.

---

## 17. Development Roadmap & Sprint Plan

### Phase 0 — Foundations (Sprints 1–2, ~4 weeks)

- Next.js 16 app scaffold, design system (Tailwind + shadcn/ui), Auth.js integration.
- FastAPI service scaffold, PostgreSQL schema migration, S3 bucket setup.
- CI/CD pipelines for both services.

### Phase 1 — Object Scanning (Sprints 3–4, ~4 weeks)

- Camera capture UI + upload flow.
- Object detection + 3D reconstruction pipeline (single-object, controlled lighting).
- Dimension extraction and object record persistence.
- 3D Model Viewer (non-AR fallback).

### Phase 2 — Room Scanning (Sprints 5–6, ~4 weeks)

- Guided room capture flow.
- Room mesh generation + wall/door/window/furniture segmentation.
- Free-space region extraction and labeling.

### Phase 3 — Recommendation Engine (Sprints 7–8, ~4 weeks)

- Spatial Understanding Engine (hard constraints: doors, windows, walkways).
- Placement scoring + ranking + reasoning generation.
- Recommendation dashboard UI.

### Phase 4 — AR Visualization & MVP Polish (Sprints 9–10, ~4 weeks)

- WebXR AR viewer with move/rotate/scale controls.
- Placement confirmation flow → Smart Home Memory.
- End-to-end QA, performance tuning to meet NFR targets, MVP launch readiness.

> **Total estimated MVP timeline:** ~20 weeks with a small cross-functional team (2 frontend, 2 backend/AI, 1 product/design, part-time QA).

---

## 18. MVP Scope

**Included in MVP (v1.0):**

- ✅ Phone camera object scanning + image upload
- ✅ 3D object model generation with dimension extraction
- ✅ Single-room scanning and digital twin creation
- ✅ Free-space detection within a room
- ✅ AI placement recommendation (single best + up to 2 alternatives, with reasoning)
- ✅ WebXR AR preview with move/rotate/scale and confirmation
- ✅ User accounts with saved rooms, objects, and recommendations
- ✅ Basic explicit preference settings

**Explicitly out of scope for MVP:**

- Multi-room / whole-house optimization
- Voice assistant
- IoT / smart home device integration
- Native AR-glasses support
- AI interior design (color/decor suggestions)
- E-commerce / purchase integrations

---

## 19. Future Roadmap

### Phase 2 — Spatial Intelligence Expansion

- Multi-room scanning and whole-home digital twin.
- Cross-room space optimization ("this fits better in the bedroom than the living room").
- Smart storage recommendations (e.g., seasonal item rotation).

### Phase 3 — Real-Time & Conversational

- Live camera placement suggestions while walking through a room (no separate scan step).
- Voice assistant: *"Where should I keep this table?"*
- Smart home / IoT integration (e.g., sensor-verified occupancy of a space).
- Collaborative room planning (multi-user sessions for couples, roommates, or designer-client pairs).

### Phase 4 — AI Interior Designer & Commerce

- Full AI interior design suggestions: furniture arrangement, color palettes, decor.
- Furniture purchase recommendations with e-commerce/retailer integrations.
- Automated full-room redesign proposals.
- AR-glasses support (e.g., Apple Vision Pro–class devices) as native AR hardware matures.

---

## 20. Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| 3D reconstruction accuracy varies with lighting/device quality | High | Medium | Guided capture UX with real-time coverage/quality feedback; fallback to manual dimension entry |
| WebXR support is inconsistent across browsers/devices | Medium | Medium | Non-AR 3D viewer fallback; feature-detect and degrade gracefully |
| GPU inference costs scale faster than revenue early on | High | Medium | Async job queue with autoscaling GPU pool; cache/reuse object models; explore on-device/lite models for simple objects |
| Users uncomfortable scanning their entire home (privacy concerns) | High | Medium | Strong privacy messaging, local-first processing options where feasible, clear data controls/deletion |
| Recommendation quality perceived as "wrong" erodes trust early | High | Medium | Always show reasoning + confidence + alternatives; fast manual override |
| Third-party AI/reconstruction model dependency (e.g., API providers) | Medium | Medium | Architect AI layer as swappable services; avoid hard vendor lock-in |

---

## 21. Competitive Analysis

| Product | Strength | Gap vs. Locatra |
|---|---|---|
| IKEA Place | Easy single-object AR placement | No room understanding, no recommendation — user must already know where to put it |
| Apple Measure | Fast, native dimension capture | No object digitization, no placement intelligence |
| Generic AR furniture viewers (retailer apps) | Good model libraries for their own catalog | Locked to retailer's catalog; can't scan arbitrary real-world objects |
| Professional space-planning software (e.g., CAD-based tools) | Precise, designer-grade | Steep learning curve, not consumer-friendly, no AI recommendation engine |

**Locatra's differentiation:** the combination of (1) arbitrary real-object digitization, (2) a persistent whole-room digital twin, and (3) an explainable AI recommendation engine — no current consumer product combines all three.

---

## 22. Monetization Strategy

| Model | Description |
|---|---|
| **Freemium** | Free tier: limited scans/month, single room, basic recommendations |
| **Pro subscription** | Unlimited scans, multi-room digital twin, preference learning, priority processing |
| **Designer/Business tier** | Multi-client project workspaces, exportable placement plans, white-label options |
| **Retailer partnerships (future)** | Revenue share on in-app product placement/purchase recommendations once e-commerce integration ships |

---

## 23. Cost Estimation (High-Level, MVP Phase)

> Indicative ranges only — to be refined during technical design and vendor selection.

| Category | Notes | Rough Monthly Range (early stage) |
|---|---|---|
| Compute (GPU inference) | Reconstruction + recommendation workloads, autoscaled | $$ — scales with scan volume |
| Hosting (Vercel + AWS) | Frontend + API + container hosting | $ — low at MVP traffic |
| Storage (S3/CDN) | Raw media, GLB models | $ — grows with retained scans |
| Database (RDS) | Managed PostgreSQL | $ |
| Third-party AI/reconstruction APIs (if used instead of self-hosted) | Pay-per-reconstruction pricing | $$ — primary variable cost driver |
| Team | 2 FE, 2 BE/AI, 1 PM/Design, part-time QA | Largest cost component pre-revenue |

The dominant variable cost at scale is GPU inference for 3D reconstruction; the architecture should track cost-per-scan closely and explore self-hosted open models once volume justifies the infrastructure investment.

---

## 24. Appendix & Glossary

| Term | Definition |
|---|---|
| **Digital Twin** | A persistent 3D digital representation of a real-world room or home |
| **GLB/GLTF** | Standard 3D model file formats used for web/AR rendering |
| **WebXR** | Browser API standard enabling AR/VR experiences without a native app |
| **Gaussian Splatting** | A 3D reconstruction technique representing scenes as a cloud of Gaussian "splats," fast to render and well suited to photorealistic captures |
| **Free Space** | A region of a room with no fixed furniture or obstacles, available as a placement candidate |
| **Confidence Score** | A 0–1 value indicating the recommendation engine's certainty in a given placement |
| **BFF (Backend-for-Frontend)** | A thin backend layer (here, Next.js Route Handlers) tailored to the needs of a specific frontend, sitting in front of heavier backend services |

---

*End of Document — Locatra PRD v1.0*
