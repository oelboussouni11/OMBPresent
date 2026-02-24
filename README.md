# OMBPresent

**AI-Powered Face Recognition Attendance System**

OMBPresent is a full-stack web application that uses computer vision and deep learning to automate attendance tracking. Users sign in with Google, create groups (classes, teams, departments), enroll members via an Apple-style circular face scan, and run real-time attendance recognition — all from a browser.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)
![InsightFace](https://img.shields.io/badge/InsightFace-buffalo__l-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Google OAuth Authentication** — Secure sign-in via NextAuth.js, each user's data is fully isolated
- **Multi-Group Management** — Create unlimited groups (classes, teams, departments) with name and description
- **Shared Members** — Enroll a face once, assign the member to multiple groups without re-scanning
- **Apple-Style Circle Enrollment** — 8-segment progressive face scan with rotating scan line, real-time progress ring, and multi-angle capture for higher accuracy
- **Real-Time Attendance Recognition** — Continuous webcam scanning compares faces against group members using cosine similarity on 512-dimensional embeddings
- **Smart Deduplication** — Each person is marked present only once per day per group, with duplicate enrollment prevention
- **Group-Specific KPIs** — Dashboard metrics including attendance rate, member count, and recognition confidence scores
- **Dark UI** — Sleek dark theme with emerald accent, built with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12, SQLAlchemy |
| Database | PostgreSQL (Supabase in production) |
| Face Recognition | InsightFace (buffalo_l model), NumPy, OpenCV |
| Authentication | NextAuth.js + Google OAuth |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────┐
│   Next.js App   │──────▶│   FastAPI API    │──────▶│  PostgreSQL  │
│   (Vercel)      │  API  │   (Render)       │  SQL  │  (Supabase)  │
│                 │◀──────│                  │◀──────│              │
└─────────────────┘       │  ┌────────────┐  │       └──────────────┘
                          │  │ InsightFace │  │
                          │  │ buffalo_l   │  │
                          │  └────────────┘  │
                          └─────────────────┘
```

**User Flow:**
```
Sign In (Google) → Create Group → Add Members (face scan) → Run Attendance → View Dashboard
```

---

## Project Structure

```
OMBPresent/
├── backend/
│   ├── app/
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   └── face_engine.py       # InsightFace model (lazy-loaded)
│   ├── models/
│   │   └── __init__.py          # User, Group, Member, Attendance models
│   ├── routers/
│   │   ├── groups.py            # CRUD for groups
│   │   ├── members.py           # Member enrollment & face encoding
│   │   └── attendance.py        # Recognition & attendance logging
│   ├── main.py                  # FastAPI app entry point
│   ├── init_db.py               # Database table creation
│   ├── requirements.txt         # Python dependencies
│   └── Procfile                 # Render deployment config
│
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx             # Landing page
│   │   ├── login/page.tsx       # Google sign-in page
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Groups overview
│   │   │   └── group/[id]/
│   │   │       ├── page.tsx     # Group detail & member list
│   │   │       └── enroll/
│   │   │           └── page.tsx # Circle face enrollment
│   │   ├── attend/page.tsx      # Real-time attendance scanner
│   │   ├── api/auth/[...nextauth]/route.ts  # NextAuth config
│   │   ├── providers.tsx        # Session provider
│   │   └── layout.tsx           # Root layout
│   ├── .env.local               # Environment variables (not committed)
│   └── package.json
│
└── README.md
```

---

## Database Schema

```
Users ──┐
        ├──< Groups
        └──< Members ──< Attendance
                │
          group_members (join table)
```

- **Users** — Google-authenticated accounts (email, name)
- **Groups** — Belong to a user (name, description)
- **Members** — Belong to a user, linked to groups via many-to-many join table. Store pickled face encodings (list of 512-dim NumPy arrays)
- **Attendance** — Logs each recognition event (member, group, confidence, timestamp)

---

## Running Locally

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.12 (required for InsightFace/ONNX compatibility)
- **PostgreSQL** 14+
- A **Google Cloud** project with OAuth credentials

### 1. Clone the Repository

```bash
git clone https://github.com/oelboussouni11/OMBPresent.git
cd OMBPresent
```

### 2. Set Up the Database

```bash
createdb ombpresent
```

### 3. Set Up the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create tables:

```bash
python init_db.py
```

Start the server:

```bash
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`. Verify at `http://localhost:8000/docs`.

### 4. Set Up the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=any-random-secret-string
NEXTAUTH_URL=http://localhost:3000
```

> **Google OAuth Setup:** Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth Client ID. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 5. Test the Full Flow

1. Click **Get Started** → Sign in with Google
2. Create a group (e.g., "Computer Science 101")
3. Click the group → **+ Add Member** → Enter name → **Next: Face Scan**
4. Slowly rotate your head during the 8-segment circle scan
5. Go back to the group → **Start Attendance**
6. Face the camera — your name appears when recognized

---

## Deployment

### Backend — Render

- **Runtime:** Python 3
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variable:** `DATABASE_URL` = your Supabase connection string

> The InsightFace model is lazy-loaded with a reduced detection size (320×320) to fit within Render's 512MB free tier. First request after cold start takes ~30 seconds.

### Frontend — Vercel

- **Framework:** Next.js
- **Root Directory:** `frontend`
- **Environment Variables:**
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` = your Vercel production URL
  - `NEXT_PUBLIC_API_URL` = your Render backend URL + `/api`

> Add your Vercel URL + `/api/auth/callback/google` to Google OAuth authorized redirect URIs.

---

## How Face Recognition Works

1. **Enrollment** — The webcam captures 8 frames at different angles. Each frame is processed by InsightFace's buffalo_l model, which outputs a 512-dimensional face embedding (a numerical fingerprint of the face). All 8 embeddings are stored as a list in the database.

2. **Recognition** — During attendance, the webcam captures frames every 1.5 seconds. Each frame produces an embedding that is compared against all stored embeddings for members in the current group using **cosine similarity**. If the highest similarity score exceeds 0.4, the face is matched and attendance is logged.

3. **Deduplication** — The system checks if a member has already been marked present today for the specific group before creating a new attendance record.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/groups?email=` | List user's groups |
| `POST` | `/api/groups` | Create a group |
| `DELETE` | `/api/groups/{id}` | Delete a group |
| `GET` | `/api/groups/{id}/members` | List group members |
| `POST` | `/api/groups/{id}/members` | Add member with face |
| `POST` | `/api/members/{id}/add-encoding` | Add extra face encoding |
| `POST` | `/api/groups/{id}/members/{mid}/link` | Link existing member to group |
| `POST` | `/api/groups/{id}/recognize` | Recognize face & log attendance |
| `GET` | `/api/groups/{id}/attendance` | Get today's attendance |

---

## Built By

**Omar El Boussouni** — [GitHub](https://github.com/oelboussouni11)

---

## License

MIT
