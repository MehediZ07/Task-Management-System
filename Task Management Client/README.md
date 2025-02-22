# Task Management Application

## 🚀 Overview

A simple and interactive **TaskManagementSystem** where users can add, edit, delete, and reorder tasks using a drag-and-drop interface. Tasks are categorized into **To-Do, In Progress, and Done**. Changes are saved instantly to the database, ensuring data persistence.

## 🔗 Live Demo

_([https://task-management-applicat-ae474.web.app/])_

## ✨ Features

- **Authentication**: Firebase Google Sign-in
- **Task Management**: Add, edit, delete, and reorder tasks
- **Drag & Drop**: Move tasks between categories and reorder within them
- **Real-Time Syncing**: Changes are instantly reflected in the database
- **Responsive Design**: Works seamlessly on both desktop and mobile
- **Optimistic UI Updates**: Instant UI updates with backend sync

## 🛠️ Technologies Used

### Frontend:

- **React.js** (Vite.js for fast development)
- **Firebase Authentication** (Google Sign-in)
- **React Query** (for data fetching & caching)
- **react-beautiful-dnd** (for drag & drop functionality)
- **React Toastify** (for user notifications)
- **Tailwind CSS** (for styling)

### Backend:

- **Node.js & Express.js** (REST API)
- **MongoDB** (Database for task persistence)
- **Mongoose** (MongoDB ORM for schema management)

## 📦 Dependencies

Ensure you have the following installed before running the project:

- **Node.js** (v14+ recommended)
- **MongoDB** (local or cloud instance)
- **Firebase Account** (for authentication)

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```sh
git clone https://github.com/MehediZ07/Task-Management-System.git
cd task-manager
```

### 2️⃣ Install dependencies

#### Backend:

```sh
cd backend
npm install
```

#### Frontend:

```sh
cd frontend
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in both the **frontend** and **backend** directories and configure the following:

#### Backend (`backend/.env`):

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

#### Frontend (`frontend/.env`):

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_API_BASE_URL=http://localhost:5000
```

### 4️⃣ Start the development servers

#### Backend:

```sh
npm run dev
```

#### Frontend:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📌 API Endpoints

| Method | Endpoint   | Description        |
| ------ | ---------- | ------------------ |
| GET    | /tasks     | Get all user tasks |
| POST   | /tasks     | Create a new task  |
| PUT    | /tasks/:id | Update a task      |
| DELETE | /tasks/:id | Delete a task      |

## 🎯 Future Enhancements

- **Real-time updates using WebSockets or MongoDB Change Streams**
- **Dark Mode UI Support**
- **Task Prioritization & Due Date Notifications**

## 🙌 Contributors

Developed by **Mehedi Zaman** _([https://github.com/MehediZ07/])_
