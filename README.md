# DropyHub - Full Stack Project Management System

Production-ready Project Management System constructed with **React JS (`react-scripts`)** for the frontend and **Node.js (Express)** with **MongoDB (Mongoose)** for the backend API.

---

## Features Matrix

### 1. Authentication & Security
- **Email & Password Authentication**: Secure password hashing with `bcryptjs`.
- **Google OAuth Login**: Supported via backend token verification & client-side credential flow + mock demo fallback.
- **Forgot & Reset Password**: Generates timed crypto reset tokens and sends notification emails via Nodemailer.
- **JWT Protection**: All protected API routes require valid Bearer JWT tokens.

### 2. Role-Based Access Control (RBAC)
Supports 3 distinct permission roles:
1. **Admin**: Full access across all projects, tasks, user management, and role promotion.
2. **Project Manager**: Create projects, manage owned/assigned projects, assign team members, and manage tasks.
3. **Team Member**: View assigned projects, create & execute assigned tasks, update task status.

### 3. Project Management Module
- Create, Edit, Delete Projects.
- Assign team members via multi-select assignment dialog.
- Filter by status (`Planned`, `Active`, `Completed`, `On Hold`).
- Search by project title or description.
- Built-in pagination support (`page`, `limit`).

### 4. Task Management Module
- Create, Edit, Delete Tasks linked to projects.
- Status quick update (`Pending`, `In Progress`, `In Review`, `Completed`).
- Priority selection (`Low`, `Medium`, `High`, `Urgent`).
- Set assignees and due dates.
- Interactive **Kanban Board** & Grid views.
- Filter by Project, Status, Priority, and Search keyword.

### 5. Dashboard & Analytics
- Consolidated KPI Metric Cards: Total Projects, Active Projects, Completed Projects, Pending Tasks, Completed Tasks, Total Team Members.
- Interactive Visual Charts powered by **Recharts** (Project status breakdown & Task priority distribution).
- MongoDB aggregation pipeline for server-side metrics.

---

## Directory Structure

```
dropyhub-project-management/
├── client/                 # React JS Frontend Application (react-scripts)
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI Components (Navbar, Sidebar, Cards, Pagination, Modal)
│   │   ├── context/        # AuthContext Provider
│   │   ├── pages/          # Login, Register, ForgotPassword, Dashboard, Projects, Tasks, Team
│   │   ├── services/       # Axios API client
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── server/                 # Node.js Express Backend API
    ├── config/             # Database connection (Mongoose)
    ├── controllers/        # Auth, Project, Task, Dashboard, User Controllers
    ├── middleware/         # Auth JWT & RBAC authorization middleware
    ├── models/             # User, Project, Task Mongoose schemas
    ├── routes/             # Express API routes
    ├── seed.js             # Initial database seeder
    ├── server.js           # Server entry point
    └── package.json
```

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port `27017` or a MongoDB Atlas connection URI.

### 1. Backend Setup
```bash
cd server
npm install

# (Optional) Pre-populate database with test users, projects, and tasks
node seed.js

# Start backend API server (Runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install

# Start React development server (Runs on http://localhost:3000)
npm start
```

---

## Test Demo Credentials (Seeded Data)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@dropyhub.com` | `password123` |
| **Project Manager** | `pm@dropyhub.com` | `password123` |
| **Team Member** | `dev1@dropyhub.com` | `password123` |

---

## API Documentation Summary

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & get JWT token
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/forgot-password` - Request reset token
- `POST /api/auth/reset-password/:resetToken` - Reset password
- `GET /api/auth/me` - Fetch profile

### Projects Routes (`/api/projects`)
- `GET /api/projects?search=&status=&page=&limit=` - List projects
- `POST /api/projects` - Create project (Admin/PM)
- `GET /api/projects/:id` - Project details & stats
- `PUT /api/projects/:id` - Update project (Admin/PM)
- `DELETE /api/projects/:id` - Delete project (Admin/PM)

### Tasks Routes (`/api/tasks`)
- `GET /api/tasks?search=&status=&priority=&project=&page=&limit=` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Quick update task status
- `DELETE /api/tasks/:id` - Delete task

### Dashboard Routes (`/api/dashboard`)
- `GET /api/dashboard/stats` - Consolidated metrics & chart aggregations
