# 🐾 PawConnect — Modern Full-Stack Pet Adoption Platform

PawConnect is a full-stack, responsive pet adoption platform designed to connect prospective pet adopters with certified animal shelters, foster parents, and animal welfare NGOs.

---

## 🌟 Key Features

### 1. Multi-Role Authentication & Access Control (RBAC)
- **Adopter**: Browse pets, bookmark favorites, submit adoption applications, monitor application progress, and chat directly with rescue organizations.
- **Shelter / NGO**: List and manage adoptable animals, upload photos, manage pet availability (`Available`, `Reserved`, `Adopted`), review adoption questionnaires, approve/reject requests, and communicate with applicants.
- **Admin**: Platform oversight, monitor statistics, verify rescue organizations, and supervise listings.
- **1-Click Demo Logins**: Pre-configured demo accounts in the navigation bar for instant testing of all roles.

### 2. Comprehensive Pet Profiles & Availability Tracking
- **High-Resolution Photo Gallery**: Thumbnail navigation and lightbox previews.
- **Detailed Attributes**: Species, breed, age, age group (`Baby`, `Young`, `Adult`, `Senior`), gender, size, and weight.
- **Health & Temperament Badges**: Vaccinated, Spayed/Neutered, Microchipped, medical history, and compatibility indicators (Good with Kids, Dogs, Cats).
- **Three Availability States**: `Available`, `Reserved`, and `Adopted`.

### 3. Dynamic Search & Advanced Filters
- Filter by:
  - Keyword search (name, breed, description)
  - Pet type (Dogs, Cats, Rabbits, Birds, Other)
  - Location (City, State)
  - Availability status
  - Age group, Gender, and Size
- Real-time client-side and server-side filtering with URL parameter synchronization.

### 4. Adoption Application System & Status Tracking
- **Standardized Multi-Step Questionnaire**:
  - Step 1: Applicant contact & identity
  - Step 2: Living situation (Housing type, yard, home ownership, existing pets, children)
  - Step 3: Experience, hours alone daily, and adoption motivation
  - Step 4: Review & submission
- **Application Statuses**: `Pending` ➔ `Approved` ➔ `Completed` (or `Rejected`).
- Automatically transitions pet state to `Reserved` upon shelter approval and `Adopted` upon completion.
- Interactive timeline history and shelter feedback notes.

### 5. Shelter & NGO Management Console
- Metrics: Total pets listed, active applications, approved placements, and completed forever-home adoptions.
- Full CRUD management for pets (Add, Edit, Delete, change availability).
- Application Review Panel: Inspect applicant details, approve with notes, or finalize adoptions.

### 6. Favorites & Wishlist
- Adopters can save companions to their wishlist with optimistic UI updates.
- Badge counters in the header navbar.

### 7. Real-Time Chat & Direct Messaging
- Powered by **Socket.io** with REST fallback.
- Private rooms per conversation with pet context headers.
- Real-time typing indicators and message timestamping.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18/19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router v7 |
| **Backend** | Node.js, Express.js (ES modules), REST APIs |
| **Real-Time** | Socket.io |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Database** | MongoDB + Mongoose (with dual-tier in-memory resilience store) |
| **Media / Storage** | Cloudinary integration with base64 data fallback |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Installation
Install all dependencies for root, client, and server:
```bash
npm run install:all
```

### 3. Running PawConnect Locally
Start both backend (port 5000) and frontend (port 5173) concurrently:
```bash
node start-dev.js
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 👥 Demo Accounts (Pre-Seeded)

PawConnect comes pre-seeded with realistic pets, shelters, applications, and messages. You can use the **Demo Accounts** dropdown in the top navbar or log in manually:

| Role | Email | Password | Details |
|---|---|---|---|
| **Adopter** | `adopter@pawconnect.org` | `password123` | Sarah Jenkins (Austin, TX) |
| **Shelter / NGO** | `shelter@pawconnect.org` | `password123` | Haven Animal Rescue (Austin, TX) |
| **Shelter / NGO 2** | `second_shelter@pawconnect.org` | `password123` | Northwest Paws (Seattle, WA) |
| **Admin** | `admin@pawconnect.org` | `password123` | PawConnect Admin |

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user (`adopter` or `shelter`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current logged-in user profile
- `PUT /api/auth/profile` — Update user profile

### Pets (`/api/pets`)
- `GET /api/pets` — List pets with filters (`species`, `breed`, `ageGroup`, `status`, `location`, `gender`, `size`)
- `GET /api/pets/:id` — Get pet details
- `POST /api/pets` — Add new pet (Shelter/Admin only, supports image upload)
- `PUT /api/pets/:id` — Update pet details (Shelter owner/Admin only)
- `DELETE /api/pets/:id` — Delete pet listing (Shelter owner/Admin only)
- `PATCH /api/pets/:id/status` — Update pet availability (`Available`, `Reserved`, `Adopted`)

### Adoption Applications (`/api/applications`)
- `POST /api/applications` — Submit adoption questionnaire (Adopter)
- `GET /api/applications/my-applications` — Retrieve applicant's applications (Adopter)
- `GET /api/applications/shelter-applications` — Retrieve incoming requests (Shelter)
- `GET /api/applications/:id` — View application details
- `PATCH /api/applications/:id/status` — Update status (`Pending`, `Approved`, `Rejected`, `Completed`) with notes

### Favorites (`/api/favorites`)
- `GET /api/favorites` — List bookmarked pets
- `POST /api/favorites/:petId` — Toggle pet bookmark

### Messaging (`/api/messages`)
- `GET /api/messages/conversations` — Fetch user's chat threads
- `POST /api/messages/conversations` — Start or retrieve a conversation
- `GET /api/messages/:conversationId` — Retrieve message history
- `POST /api/messages` — Send new message (broadcasts via Socket.io)

### Shelters (`/api/shelters`)
- `GET /api/shelters` — List registered shelters & NGOs
- `GET /api/shelters/:id` — Shelter details and their listed pets
- `GET /api/shelters/stats` — Platform-wide statistics
