# CollabDen Backend API Documentation Reference

Extraction Date: 2026-04-14
Source: [Swagger UI](https://collabden-backend.onrender.com/api-docs/#/)

## 🔐 Authentication Endpoints

### 1. Register User
- **Endpoint:** `POST /api/v1/user/signup`
- **Payload:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### 2. Login User
- **Endpoint:** `POST /api/v1/user/login`
- **Payload:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### 3. Google Authentication
- **Initiate Google Auth**
  - **Endpoint:** `GET /api/v1/user/auth/google`
  - **Description:** Redirects the user to the Google OAuth2 consent screen.
- **Google Auth Callback**
  - **Endpoint:** `GET /api/v1/user/auth/google/callback`
  - **Query Parameters:** `code` (string)
  - **Response:** Backend redirects to `http://localhost:3000/auth-callback?token=...`

### 4. Verify Email
- **Endpoint:** `POST /api/v1/user/verify`
- **Payload:**
  ```json
  {
    "email": "string",
    "verificationToken": "string"
  }
  ```

### 5. Resend Verification Code
- **Endpoint:** `POST /api/v1/user/resend-verify`
- **Payload:**
  ```json
  {
    "email": "string"
  }
  ```

### 6. Forgot Password
- **Endpoint:** `POST /api/v1/user/forgot-password`
- **Payload:**
  ```json
  {
    "email": "string"
  }
  ```

### 7. Reset Password
- **Endpoint:** `POST /api/v1/user/reset-password`
- **Payload:**
  ```json
  {
    "password": "string",
    "token": "string"
  }
  ```

### 8. User Profile
- **Endpoint:** `GET /api/v1/user/profile`
- **Description:** Retrieve the authenticated user's profile details.
- **Headers:** `Authorization: Bearer <token>`
