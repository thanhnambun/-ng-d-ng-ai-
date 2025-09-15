# Learning Management System - Server

## 📊 JSON Server Backend

This is a simple JSON Server backend for the Learning Management System. It provides REST API endpoints for managing courses, exams, questions, users, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm

### Installation & Setup

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

The server will be available at: **http://localhost:3000**

## 🛠️ Available Scripts

```bash
npm run dev          # Start server on port 3000
npm run start        # Start server on port 3000 (production)
npm run dev:port 3001 # Start server on custom port (example: 3001)
```

## 📁 Data Structure

The `db.json` file contains the following data collections:

### Core Resources
- **accounts** - User accounts and authentication
- **courses** - Course information
- **subjects** - Subjects within courses  
- **exams** - Exam definitions
- **questions** - Exam questions and answers
- **comments** - User comments on exams
- **userAnswers** - Exam results and user responses

## 🔌 API Endpoints

### Authentication
```
GET    /accounts           # Get all users
GET    /accounts/:id       # Get user by ID
POST   /accounts           # Create new user
PUT    /accounts/:id       # Update user
DELETE /accounts/:id       # Delete user
```

### Courses
```
GET    /courses            # Get all courses
GET    /courses/:id        # Get course by ID
POST   /courses            # Create new course
PUT    /courses/:id        # Update course
DELETE /courses/:id        # Delete course
```

### Subjects
```
GET    /subjects           # Get all subjects
GET    /subjects/:id       # Get subject by ID
GET    /subjects?idCourse=:courseId  # Get subjects by course
POST   /subjects           # Create new subject
PUT    /subjects/:id       # Update subject
DELETE /subjects/:id       # Delete subject
```

### Exams
```
GET    /exams              # Get all exams
GET    /exams/:id          # Get exam by ID  
GET    /exams?idSubject=:subjectId   # Get exams by subject
POST   /exams              # Create new exam
PUT    /exams/:id          # Update exam
DELETE /exams/:id          # Delete exam
```

### Questions
```
GET    /questions          # Get all questions
GET    /questions/:id      # Get question by ID
GET    /questions?idExam=:examId     # Get questions by exam
POST   /questions          # Create new question
PUT    /questions/:id      # Update question
DELETE /questions/:id      # Delete question
```

### Comments
```
GET    /comments           # Get all comments
GET    /comments/:id       # Get comment by ID
GET    /comments?examId=:examId      # Get comments by exam
POST   /comments           # Create new comment
PUT    /comments/:id       # Update comment
DELETE /comments/:id       # Delete comment
```

### User Answers
```
GET    /userAnswers        # Get all user answers
GET    /userAnswers/:id    # Get user answer by ID
GET    /userAnswers?idUser=:userId   # Get answers by user
POST   /userAnswers        # Create new user answer
PUT    /userAnswers/:id    # Update user answer
DELETE /userAnswers/:id    # Delete user answer
```

## 🔧 Configuration

### Port Configuration

**Default Port**: 3000

To change the port:

```bash
# Method 1: Using custom script
npm run dev:port 3001

# Method 2: Direct JSON Server command
npx json-server --watch db.json --port 3001
```

### CORS Configuration

JSON Server automatically handles CORS for localhost development. For production, you may need to configure CORS properly.

### Database File

The database is stored in `db.json`. This file contains sample data and will be updated when you make API calls.

**⚠️ Backup Recommendation**: Always backup your `db.json` file before making significant changes.

## 📊 Sample Data

The server comes with sample data including:

- **Demo Users**: Admin and regular user accounts
- **Sample Courses**: Multiple educational courses
- **Test Exams**: Various exams with questions
- **Mock Results**: Sample exam results

### Demo Accounts in db.json
- **Admin User**: Check accounts array for admin role users
- **Regular Users**: Multiple test users available

## 🔍 Query Parameters

JSON Server supports various query parameters:

### Pagination
```
GET /courses?_page=1&_limit=10
```

### Sorting
```
GET /exams?_sort=name&_order=asc
```

### Filtering
```
GET /subjects?idCourse=1
GET /questions?idExam=2
```

### Full-text Search
```
GET /courses?q=javascript
```

### Relationships
```
GET /courses?_embed=subjects
GET /subjects?_expand=course
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux  
lsof -ti:3000 | xargs kill
```

### Database Issues
If you encounter database corruption:

1. Stop the server
2. Restore `db.json` from backup
3. Restart the server

### Permission Issues
Make sure you have read/write permissions to the project directory.

## 🚀 Production Deployment

For production deployment, consider:

1. **Use a real database** (PostgreSQL, MySQL, MongoDB)
2. **Implement proper authentication** 
3. **Add input validation**
4. **Set up proper CORS policies**
5. **Use HTTPS**

JSON Server is great for development and prototyping, but not recommended for production use.

## 📈 Performance

JSON Server performance tips:

- Keep `db.json` file size reasonable (< 100MB)
- Use pagination for large datasets
- Implement client-side caching
- Consider database indexing for production

## 📝 License

This project is licensed under the MIT License.
