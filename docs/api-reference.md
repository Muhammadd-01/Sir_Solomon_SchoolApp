# API Reference

Base URL: `http://localhost:4000/api`

All endpoints require Firebase authentication token in the `Authorization` header:
```
Authorization: Bearer <firebase-id-token>
```

---

## Authentication

### Verify Firebase Token
```http
POST /auth/verify-firebase-token
Content-Type: application/json

{
  "idToken": "firebase-id-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "role": "admin",
    "name": {
      "first": "John",
      "last": "Doe"
    }
  }
}
```

---

## Students

### Get All Students
```http
GET /students?class=Grade%2010&section=A&status=active&search=ahmed
```

**Query Parameters:**
- `class` (optional): Filter by class
- `section` (optional): Filter by section
- `status` (optional): Filter by status (active/inactive/graduated)
- `search` (optional): Text search in name and student ID

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "student-id",
      "studentId": "STU001",
      "name": {
        "first": "Ahmed",
        "last": "Khan"
      },
      "class": "Grade 10",
      "section": "A",
      "status": "active"
    }
  ]
}
```

### Get Single Student
```http
GET /students/:id
```

### Create Student
```http
POST /students
Content-Type: application/json

{
  "studentId": "STU001",
  "name": {
    "first": "Ahmed",
    "last": "Khan"
  },
  "dob": "2008-05-15",
  "gender": "male",
  "class": "Grade 10",
  "section": "A",
  "guardians": [
    {
      "name": "Parent Name",
      "relation": "father",
      "phone": "+92-300-1234567",
      "email": "parent@email.com"
    }
  ],
  "medical": {
    "allergies": [],
    "notes": "None"
  }
}
```

**Requires:** `admin` or `superadmin` role

### Update Student
```http
PUT /students/:id
Content-Type: application/json

{
  "class": "Grade 11",
  "section": "B"
}
```

**Requires:** `admin` or `superadmin` role

### Delete Student
```http
DELETE /students/:id
```

**Requires:** `superadmin` role

---

## Teachers

### Get All Teachers
```http
GET /teachers?subject=Mathematics&active=true
```

### Create Teacher
```http
POST /teachers
Content-Type: application/json

{
  "teacherId": "TCH001",
  "name": {
    "first": "Muhammad",
    "last": "Iqbal"
  },
  "email": "teacher@school.com",
  "phone": "+92-300-1234567",
  "subjects": ["Mathematics", "Physics"],
  "assignedClasses": [
    { "class": "Grade 10", "section": "A" }
  ]
}
```

---

## Attendance

### Create Session
```http
POST /attendance/session
Content-Type: application/json

{
  "class": "Grade 10",
  "section": "A",
  "subject": "Mathematics",
  "date": "2024-01-15",
  "method": "qr"
}
```

### Mark Attendance (Batch)
```http
POST /attendance/session/:sessionId/mark
Content-Type: application/json

{
  "records": [
    {
      "studentId": "student-id-1",
      "status": "present"
    },
    {
      "studentId": "student-id-2",
      "status": "absent"
    }
  ]
}
```

### Get Attendance Report
```http
GET /attendance/report?class=Grade%2010&section=A&startDate=2024-01-01&endDate=2024-01-31
```

---

## Assignments

### Get All Assignments
```http
GET /assignments?class=Grade%2010&section=A&status=active
```

### Create Assignment
```http
POST /assignments
Content-Type: application/json

{
  "title": "Algebra Quiz",
  "description": "Complete exercises 1-10",
  "class": "Grade 10",
  "section": "A",
  "subject": "Mathematics",
  "dueDate": "2024-02-01",
  "totalMarks": 100,
  "attachments": []
}
```

### Submit Assignment
```http
POST /assignments/:id/submit
Content-Type: application/json

{
  "files": [
    {
      "filename": "assignment.pdf",
      "url": "https://storage.url/file.pdf",
      "size": 1024000
    }
  ]
}
```

---

## Announcements

### Get All Announcements
```http
GET /announcements?status=published&type=urgent
```

### Create Announcement
```http
POST /announcements
Content-Type: application/json

{
  "title": "Sports Day",
  "content": "Annual sports day will be held on Friday...",
  "type": "event",
  "targetAudience": "all",
  "sendNotification": true
}
```

---

## Fees

### Get All Fees
```http
GET /fees?studentId=student-id&status=pending
```

### Record Payment
```http
POST /fees/:id/payment
Content-Type: application/json

{
  "amount": 5000,
  "paymentMethod": "cash",
  "transactionId": "TXN123456"
}
```

---

## Timetables

### Get Timetable
```http
GET /timetables?class=Grade%2010&section=A&day=Monday
```

### Create Timetable
```http
POST /timetables
Content-Type: application/json

{
  "class": "Grade 10",
  "section": "A",
  "academicYear": "2023-2024",
  "day": "Monday",
  "slots": [
    {
      "startTime": "09:00",
      "endTime": "09:40",
      "subject": "Mathematics",
      "teacherId": "teacher-id",
      "room": "Room 101"
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API is rate-limited to 100 requests per minute per IP address.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```
