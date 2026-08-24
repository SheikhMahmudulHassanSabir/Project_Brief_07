💼 Job Portal System

A full-stack web-based recruitment platform built using the MERN Stack that connects job seekers with employers and provides administrators with centralized tools to manage recruitment activities.

---

📌 Project Overview

The Job Portal System is a web-based recruitment platform designed to simplify and streamline the hiring process by connecting job seekers, employers, and administrators within a single system.

The platform allows employers to publish and manage job opportunities, while job seekers can browse available positions, search for relevant jobs, and submit applications. Administrators can monitor and manage recruitment activities through a centralized interface.

The project simulates a real-world recruitment environment where different users interact with the system according to their roles and permissions.

This project is developed using the MERN Stack and demonstrates key full-stack development concepts, including authentication, role-based authorization, CRUD operations, database relationships, RESTful APIs, and deployment.

---

👥 Team Members

- Manisha Upprety
- Sheikh Mahmuldul Hassan Sabir
- Hawa Munyah
- Lakshya Jyoti Chowhan
- Komal Mishra

---

🎯 Project Domain

Recruitment and Human Resources

---

🚀 Key Features

👤 Job Seekers

- User registration and login
- Browse available job opportunities
- Search and filter jobs
- View detailed job descriptions
- Apply for jobs
- Track submitted applications

🏢 Employers

- Employer registration and authentication
- Create and publish job vacancies
- Edit and delete job postings
- View received applications
- Manage recruitment activities

🛡️ Administrators

- Monitor users and recruitment activities
- Manage job postings
- Manage platform data
- Control access based on user roles

🔐 System Features

- Secure user authentication
- Role-based authorization
- CRUD operations
- RESTful APIs
- MongoDB database integration
- Responsive web interface

---

🛠️ Technology Stack

Technology| Purpose
React.js| Frontend development
Node.js| Backend runtime environment
Express.js| Backend framework and REST APIs
MongoDB| Database
JWT| Authentication and authorization
npm| Package management

---

📋 Prerequisites

Before running the project, make sure the following are installed on your system:

- "Node.js" (https://nodejs.org/)
- npm
- MongoDB, either:
  - MongoDB installed locally, or
  - A MongoDB Atlas connection string
- Git

You can verify your Node.js and npm installations using:

node --version
npm --version

---

⚙️ Installation & Setup

1. Clone the Repository

git clone <your-repository-url>

Navigate to the project directory:

cd Job-Portal-System

---

2. Backend Setup

Navigate to the server directory:

cd server

Install the backend dependencies:

npm install

Configure Environment Variables

Create a ".env" file inside the "server" directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Replace the placeholder values with your actual configuration.

«Important: Never commit your ".env" file or other sensitive credentials to GitHub. Add ".env" to your ".gitignore" file.»

Start the backend development server:

npm run dev

---

3. Frontend Setup

Open a new terminal and navigate to the client directory:

cd client

Install the frontend dependencies:

npm install

Start the frontend development server:

npm run dev

The terminal will display the local URL where the frontend application is running.

---

📁 Project Structure

Job-Portal-System/
│
├── client/                 # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js + Express.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

«The exact folder structure may vary depending on the implementation. See the "/client" and "/server" directories for the complete project structure.»

---

🔄 Application Workflow

                    ┌─────────────────┐
                    │   Job Seeker    │
                    └────────┬────────┘
                             │
                       Search / Apply
                             │
                             ▼
┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│    Admin     │◄────►│  Job Portal     │◄────►│   Employer   │
└──────────────┘      └─────────────────┘      └──────────────┘
     │                         │                       │
     │                   Job Listings              Post Jobs
     │                   Applications            Manage Jobs
     │                                             Review Apps
     │
  Monitor & Manage

---

🔐 Authentication & Authorization

The system uses authentication and role-based authorization to ensure that users can only access features appropriate to their roles.

Typical user roles include:

- Job Seeker
- Employer
- Administrator

Authentication is handled using JSON Web Tokens (JWT), while authorization middleware controls access to protected resources.

---

🗄️ Database

The application uses MongoDB for storing and managing application data.

The database may contain collections such as:

- Users
- Jobs
- Applications
- Other recruitment-related data

The backend communicates with MongoDB through the Node.js/Express application.

---

🌐 API

The backend provides RESTful APIs that allow the React frontend to communicate with the server.

Example API operations include:

POST   /api/auth/register
POST   /api/auth/login

GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

POST   /api/applications
GET    /api/applications

«The exact API endpoints may vary depending on the final implementation.»

---

🎓 Learning Outcomes

This project provides practical experience in:

- Full-stack web development using the MERN Stack
- React.js frontend development
- Node.js and Express.js backend development
- MongoDB database management
- User authentication and authorization
- Role-based access control
- CRUD operations
- RESTful API development
- Database relationships
- Frontend-backend integration
- Application deployment
- Git and GitHub collaboration

---

🔮 Future Enhancements

Possible future improvements include:

- Email notifications for job applications
- Resume upload and management
- Advanced job search and filtering
- Employer dashboards and analytics
- Job recommendations
- Application status notifications
- Real-time communication between employers and applicants
- Password reset functionality
- Profile and resume customization
- Cloud-based file storage

---

🤝 Contribution

This project was developed as a collaborative team project.

To contribute:

1. Fork the repository.
2. Create a new feature branch.

git checkout -b feature/your-feature

3. Commit your changes.

git add .
git commit -m "Add your feature"

4. Push the branch.

git push origin feature/your-feature

5. Create a Pull Request.

---

🔒 Environment Variables

For security reasons, sensitive configuration values should be stored in environment variables.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Make sure ".env" is included in ".gitignore":

.env
node_modules/

---

📄 License

This project is developed for educational and academic purposes.

---

👨‍💻 Developed By

Team Job Portal System

Manisha Upprety · Sheikh Mahmuldul Hassan Sabir · Hawa Munyah · Lakshya Jyoti Chowhan · Komal Mishra

Domain: Recruitment and Human Resources
Technology: MERN Stack
