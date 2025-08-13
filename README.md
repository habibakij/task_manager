# Task Manager API

A RESTful API for managing tasks built with Node.js, Express.js, Prisma ORM, and PostgreSQL/MySQL. This API provides user authentication and complete CRUD operations for task management.

## 🚀 Features

- **User Authentication**: Register and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Input Validation**: Comprehensive validation using Zod
- **Password Security**: Bcrypt password hashing
- **Database**: Prisma ORM with PostgreSQL/MySQL support
- **Error Handling**: Consistent error responses
- **RESTful Design**: Following REST API conventions

## 🛠️ Tech Stack

- **Backend**: Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Password Hashing**: Bcryptjs
- **Environment**: dotenv for environment variables

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- Git

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/habibakij/task_manager
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="mysql://root@localhost:3306/taskmanager"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ name, email, phone, password }` |
| POST | `/api/auth/login` | User login | `{ email, password }` |

### Tasks

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks | - |
| GET | `/api/tasks/:id` | Get task by ID | - |
| POST | `/api/tasks` | Create new task | `{ title, description, startDate, endDate }` |
| PUT | `/api/tasks/:id` | Update task | `{ title?, description?, startDate?, endDate? }` |
| DELETE | `/api/tasks/:id` | Delete task | - |

## 📝 API Usage Examples

### Register User
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Akij Khan",
  "email": "akij.khan@gmail.com",
  "phone": "01717776666",
  "password": "password123"
}
```

### Login User
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "akij.khan@gmail.com",
  "password": "12345678"
}
```

### Create Task
```bash
POST http://localhost:3000/api/tasks
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "title": "Complete Project",
  "description": "Finish the task manager API",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

### Get All Tasks
```bash
GET http://localhost:3000/api/tasks
Authorization: Bearer your-jwt-token
```

### Update Task
```bash
PUT http://localhost:3000/api/tasks/1
Content-Type: application/json
Authorization: Bearer your-jwt-token

{
  "title": "Updated Task Title",
  "description": "Updated description"
}
```

### Delete Task
```bash
DELETE http://localhost:3000/api/tasks/1
Authorization: Bearer your-jwt-token
```

## 📁 Project Structure

```
task-manager-api/
├── controllers/
│   ├── auth_controller.js
│   └── task_controller.js
├── routes/
│   ├── auth_routes.js
│   └── task_routes.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── utils/
│   └── tokenUtils.js
├── .env
├── .env.example
├── server.js
├── package.json
└── README.md
```

## 🗃️ Database Schema

### User Table (userAuth)
- `id` - Primary key
- `name` - User's full name
- `email` - User's email (unique)
- `phone` - User's phone number
- `userPassword` - Hashed password

### Task Table (taskTable)
- `id` - Primary key
- `title` - Task title
- `description` - Task description
- `startDate` - Task start date
- `endDate` - Task end date

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication. After successful login/registration, include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token-here
```

## ✅ Input Validation

All endpoints include comprehensive input validation:

- **Email**: Must be valid email format
- **Password**: Minimum 6 characters
- **Phone**: Minimum 10 characters
- **Name**: Minimum 2 characters
- **Task fields**: All required for creation, optional for updates

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here"
}
```

HTTP status codes used:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "task-manager-api"
```

### Using Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

Test the API using:
- **Postman**: Import the API collection
- **curl**: Command line testing
- **Thunder Client**: VS Code extension

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: https://github.com/habibakij
- Email: akijmia.cse@gmail.com

## 🙏 Acknowledgments

- Express.js for the web framework
- Prisma for the excellent ORM
- Zod for schema validation
- The Node.js community for amazing packages

---

⭐ If you found this project helpful, please give it a star!
