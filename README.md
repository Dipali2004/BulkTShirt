# Bulk Plain T-Shirt E-commerce Re-creation

This project is a modern, secure, and SEO-optimized e-commerce platform for bulk plain t-shirts, built with React, Spring Boot, and MySQL.

## Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Lucide-React, Axios, CryptoJS.
- **Backend**: Java (Spring Boot 3.2.3), Spring Security, Spring Data JPA, MySQL.
- **Security**: JWT Authentication, AES Request/Response Encryption, 5-minute Idle Session Timeout, Login Captcha, and 10-minute Lockout after 3 failed attempts.

## Project Structure

- `frontend/`: React Single Page Application.
- `backend/auth-service/`: Microservice for authentication, registration, and user management.
- `backend/core-service/`: Microservice for product management, orders, and enquiries.

## Prerequisites

- **Java 17** or higher.
- **Node.js 18** or higher.
- **MySQL Server** (ensure it's running on port 3306).
- **Maven** (to build the backend).

## Getting Started

### 1. Database Setup
Create a MySQL database named `bulk_plain_tshirt_db`:
```sql
CREATE DATABASE bulk_plain_tshirt_db;
```

### 2. Backend Setup
For both `auth-service` and `core-service`:
1. Update `src/main/resources/application.properties` with your MySQL credentials and Email settings.
2. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm start
```

## Security Features Implemented

- **Request/Response Encryption**: All data transmitted between frontend and backend is encrypted using AES.
- **Idle Timeout**: Users are automatically logged out after 5 minutes of inactivity.
- **Lockout Mechanism**: After 3 failed login attempts, the account is locked for 10 minutes.
- **Captcha**: A verification code is required during login to prevent automated attacks.
- **Admin Panel**: Only users with the `ROLE_ADMIN` can manage products and orders.

## Contact Integration
- **WhatsApp**: A floating button on the bottom right allows users to chat directly with the company.
- **Enquiry Form**: Sends email notifications to both the company and the user upon submission.

## Security & Troubleshooting Guide

### **1. Authentication Flow**
- **Login**: When you log in at `/login`, the frontend sends a `POST` request to `auth-service` (Port 8080). 
- **Token Storage**: On success, the JWT token is stored in `localStorage` under the key `jwt-token`.
- **Header Injection**: For all subsequent requests, a global Axios interceptor automatically attaches the `Authorization: Bearer <token>` header.

### **2. Troubleshooting "403 Forbidden" or "No Token" Errors**
If you see a `403 Forbidden` error in the console or a message saying "No token found":

1. **Check the Login Request**: It is **normal** for the login request itself to show `Token found in localStorage: NO` because the token hasn't been received yet.
2. **Verify Token in Browser**:
   - Open Chrome DevTools (`F12`).
   - Go to the **Application** tab -> **Local Storage**.
   - Ensure `jwt-token` exists and has a long string value.
3. **Verify Network Headers**:
   - Go to the **Network** tab in DevTools.
   - Click on a failing request (e.g., `products` or `orders`).
   - Look at **Request Headers**. You should see `Authorization: Bearer ...`.
   - *Note: The `OPTIONS` (preflight) request will NOT have this header. Look for the `GET` or `POST` request.*
4. **Session Timeout**: If you are inactive for 5 minutes, the frontend will automatically clear the token and log you out. You will see `DEBUG: Token invalid or expired. Clearing storage...` in the console.

### **3. Backend Logs**
If the frontend is sending the token but the backend still returns `403`, check the backend terminal logs:
- **Auth Service (8080)**: Look for `JWT Authentication failed` or `User not found`.
- **Core Service (8081)**: Ensure the `app.jwt.secret` in `application.properties` matches the one in `auth-service`.

## Running the Project
