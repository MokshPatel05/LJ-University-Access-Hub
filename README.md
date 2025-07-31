# LJ University Access Hub

A full-stack web application for managing college attendance, built with **React (Vite, Tailwind CSS)** for the frontend and **Node.js (Express, MongoDB, Mongoose)** for the backend.

---

## Features

### Admin Panel
- **Dashboard**: Overview of teachers, batches, classes, and attendance reports.
- **Teacher Management**: Add, edit, and manage teachers, grouped by subject.
- **Batch Management**: Create and manage student batches and classes.
- **Student Management**: Add, edit, and manage students, batch-wise.
- **Attendance Download**: View and download daily attendance reports, grouped by teacher and batch, with PDF export.
- **Weekly Schedule**: Configure and view weekly class schedules.

### Teacher Panel
- **Dashboard**: View today's schedule, weekly stats, and students taught.
- **Mark Attendance**: Mark attendance for each class, with real-time status.
- **Weekly Schedule**: View all scheduled classes for the week.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Mongoose, MongoDB
- **Authentication**: Passport.js (local strategy)
- **Session Management**: express-session, connect-mongo
- **PDF Generation**: jsPDF, jsPDF-AutoTable

---

## Project Structure

```
FSD-Group/
  Backend/
    app.js
    models/
    routes/
    init/
    package.json
    ...
  Frontend/
    src/
      components/
        admin/
        teacher/
        auth/
      pages/
      routes/
      hooks/
      ...
    public/
    package.json
    ...
  .env (not committed)
  README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas or local MongoDB instance

### 1. Clone the Repository

```bash
git clone [https://github.com/yourusername/FSD-Group.git](https://github.com/MokshPatel05/LJ-University-Access-Hub.git)
cd FSD-Group
```

### 2. Setup Environment Variables

Create a `.env` file in the `Backend/` directory:

```
MONGO_URL=your-mongodb-connection-string
SECRET=your-session-secret
```

**Never commit your `.env` file to GitHub!**

### 3. Install Dependencies

#### Backend

```bash
cd Backend
npm install
```

#### Frontend

```bash
cd ../Frontend
npm install
```

### 4. Run the Application

#### Backend

```bash
cd Backend
nodemon app.js
```

#### Frontend

```bash
cd ../Frontend
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port).
- The backend will run on [http://localhost:8080](http://localhost:8080).

---

## API Endpoints

### Authentication
- `POST /auth/login` — Login for admin/teacher

### Admin APIs
- `GET /api/teacher?adminId=...` — List teachers for an admin
- `POST /api/teacher` — Add a teacher
- `PUT /api/teacher/:id` — Edit a teacher
- `DELETE /api/teacher/:id?adminId=...` — Remove teacher from admin
- `GET /api/students?adminId=...` — List students for an admin
- `POST /api/students` — Add a student
- `PUT /api/students/:id` — Edit a student
- `DELETE /api/students/:id` — Delete a student
- `GET /api/batch` — List batches
- `POST /api/batch` — Add a batch
- `PUT /api/batch/:id` — Edit a batch
- `DELETE /api/batch/:id` — Delete a batch
- `GET /api/attendance/daily-report?adminId=...&date=YYYY-MM-DD` — Get daily attendance report (used for dashboard and download)
- `GET /api/schedule` — Get weekly schedule
- `POST /api/schedule/save` — Save weekly schedule

### Teacher APIs
- `GET /api/teacher/:id/dashboard` — Get teacher dashboard (today's schedule, stats)
- `GET /api/teacher/:id/weekly-schedule` — Get teacher's weekly schedule
- `GET /api/attendance/students?teacherId=...&classId=...&date=YYYY-MM-DD` — Get students for a class on a date
- `POST /api/attendance/save` — Save attendance for a class

### Other APIs
- `GET /api/subjects` — List all subjects
- `GET /api/admin/:id` — Get admin details

---

## Deployment Instructions

1. **Set up your MongoDB database** (Atlas or local) and update your `.env` file with the connection string.
2. **Deploy the backend** (Node.js/Express) to your preferred platform (e.g., Heroku, Render, Railway, or your own server).
   - Make sure to set environment variables (`MONGO_URL`, `SECRET`) in your deployment environment.
3. **Deploy the frontend** (React/Vite) to Vercel, Netlify, or your own server.
   - Update the frontend's API URLs if deploying to production (e.g., use your deployed backend URL instead of `localhost`).
4. **(Optional) Configure CORS** in the backend if your frontend and backend are on different domains.

---

## Screenshots

### Login Page

<img width="1901" height="1269" alt="Image" src="https://github.com/user-attachments/assets/d2eea872-9c2c-4c46-83f2-98298ce8374d" />

### Dashboard
<img width="2560" height="4318" alt="Image" src="https://github.com/user-attachments/assets/8863622d-fbc5-4c00-96c2-eeddf8df38f5" />

### Teacher Panel
<img width="2560" height="1600" alt="Image" src="https://github.com/user-attachments/assets/d2714000-06bd-430f-9f3c-609628fc14a8" />
<img width="2560" height="1600" alt="Image" src="https://github.com/user-attachments/assets/082d2c75-9316-4d98-82d5-dd92a8a3fe3c" />
<img width="2560" height="1600" alt="Image" src="https://github.com/user-attachments/assets/1d806dc3-d41e-4ad4-8d57-e76e6c79f70f" />

### Admin Panel
<img width="2560" height="1600" alt="Image" src="https://github.com/user-attachments/assets/b1f5fac4-2b0b-4a2b-8a91-46d3ff0d8b68" />
<img width="2560" height="1600" alt="Image" src="https://github.com/user-attachments/assets/544f9a81-d992-4c2b-97a1-b6e07047d9ab" />
<img width="2560" height="1600" alt="Image" src="https://github.com/user-attachments/assets/3cc1dfe8-5ee3-4b1e-9a9d-abcca7d1fc47" />
<img width="2560" height="5184" alt="Image" src="https://github.com/user-attachments/assets/a69df9bb-f94e-4a33-be90-8c1b7a51f296" />
<img width="2560" height="4188" alt="Image" src="https://github.com/user-attachments/assets/0a27f12f-5f41-4b28-8a4b-70879be6aaea" />
---

## Security

- All sensitive credentials (MongoDB URL, session secrets) are loaded from environment variables.
- `.env` is included in `.gitignore` and should never be committed.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
