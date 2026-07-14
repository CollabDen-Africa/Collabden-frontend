# CollabDen Backend API Documentation Reference

Extraction Date: 2026-07-14
Source: [Swagger UI](https://collabden-backend.onrender.com/api-docs/#/)
Base URL: `https://collabden-backend.onrender.com`
Auth: `Authorization: Bearer <JWT>` (Handled via HTTP-only cookies in frontend proxy)

---

## 🔐 Authentication & User Endpoints

### 1. Register User
- **Endpoint:** `POST /api/v1/user/signup`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "firstName": "string",   // required
    "lastName": "string",    // required
    "email": "string",       // required
    "password": "string"     // required
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | User created successfully |
  | `400`  | Bad request (missing/invalid fields or email already exists) |

### 2. Login User
- **Endpoint:** `POST /api/v1/user/login`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "email": "string",       // required
    "password": "string"     // required
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Login successful (returns user details and JWT token) |
  | `401`  | Unauthorized (invalid credentials) |

### 3. Google Authentication
- **Initiate Google Auth**
  - **Endpoint:** `GET /api/v1/user/auth/google`
  - **Auth Required:** No
  - **Description:** Redirects the user to the Google OAuth2 consent screen.
  - **Responses:**
    | Status | Description |
    |--------|-------------|
    | `302`  | Redirect to Google |

- **Google Auth Callback**
  - **Endpoint:** `GET /api/v1/user/auth/google/callback`
  - **Auth Required:** No
  - **Query Parameters:**
    | Param  | Type   | Required | Description |
    |--------|--------|----------|-------------|
    | `code` | string | Yes      | Authorization code returned by Google |
  - **Responses:**
    | Status | Description |
    |--------|-------------|
    | `302`  | Redirect to frontend with token (`/auth-callback?token=...`) |

### 4. Verify Email
- **Endpoint:** `POST /api/v1/user/verify`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "email": "string",               // required
    "verificationToken": "string"    // required
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Email verified successfully |

### 5. Resend Verification Code
- **Endpoint:** `POST /api/v1/user/resend-verify`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "email": "string"    // required
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Verification code resent successfully |
  | `400`  | Bad request |

### 6. Forgot Password
- **Endpoint:** `POST /api/v1/user/forgot-password`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "email": "string"    // required
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Recovery email sent successfully |

### 7. Reset Password
- **Endpoint:** `POST /api/v1/user/reset-password`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "password": "string",    // required
    "token": "string"        // required
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Password reset successfully |

### 8. User Profile Details
- **Endpoint:** `GET /api/v1/user/profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Success — returns user profile object |
  | `401`  | Unauthorized |

### 9. Update Onboarding Status
- **Endpoint:** `PATCH /api/v1/user/onboarding`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "completed": true
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Status updated successfully |
  | `401`  | Unauthorized |

### 10. Get User Agreements
- **Endpoint:** `GET /api/v1/user/agreements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `page` | integer | `1` | Page number |
  | `limit` | integer | `10` | Number of items per page |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns user agreements across their projects |

---

## 👤 User Profile Management Endpoints

### 11. Update Profile Information
- **Endpoint:** `PUT /api/v1/user/profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:** Custom fields to update (e.g., bio, legalName, skills, etc.)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Profile updated successfully |

### 12. Update Account Email
- **Endpoint:** `PATCH /api/v1/user/profile/email`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "newEmail": "string",
    "currentPassword": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Email updated (re-verification code sent) |
  | `401`  | Wrong password |
  | `409`  | Email already taken |

### 13. Update Phone Number
- **Endpoint:** `PATCH /api/v1/user/profile/phone`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "phoneNumber": "string" // or null to remove
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Phone number updated successfully |

### 14. Change Password
- **Endpoint:** `PATCH /api/v1/user/profile/password`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string",
    "confirmPassword": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Password changed successfully |
  | `401`  | Wrong current password |

### 15. Update Profile Avatar
- **Endpoint:** `PATCH /api/v1/user/profile/avatar`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "avatarUrl": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Avatar updated successfully |

### 16. Get Profile Completeness Status
- **Endpoint:** `GET /api/v1/user/profile/completeness`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Success — returns completeness percentage and missing fields |

### 17. Browse/Search Collaborators (Legacy Profile Browse)
- **Endpoint:** `GET /api/v1/user/profile/browse`
- **Auth Required:** No
- **Query Parameters (optional):**
  | Param | Type | Description |
  |-------|------|-------------|
  | `skills` | string | Comma-separated list of skills |
  | `genres` | string | Comma-separated list of genres |
  | `q` | string | Search keyword |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of profile objects open to collaboration |

### 18. Get User Profile By ID
- **Endpoint:** `GET /api/v1/user/profile/{userId}`
- **Auth Required:** No
- **Path Parameters:**
  - `userId` (string) - ID of the target user
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns user profile details |

### 19. Add Endorsement to Profile
- **Endpoint:** `POST /api/v1/user/profile/{userId}/endorsements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `userId` (string) - ID of user to endorse
- **Request Body (required):**
  ```json
  {
    "content": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Endorsement added successfully |

### 20. Get User Portfolio
- **Endpoint:** `GET /api/v1/user/profile/portfolio/{userId}`
- **Auth Required:** No
- **Path Parameters:**
  - `userId` (string) - Target user ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns portfolio details for user |

### 21. Update Portfolio Entry
- **Endpoint:** `PUT /api/v1/user/profile/portfolio/{projectId}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - ID of project
- **Request Body:** Custom fields to update
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Portfolio entry updated successfully |

### 22. Add Project-Specific Endorsement
- **Endpoint:** `POST /api/v1/user/profile/portfolio/{projectId}/endorsements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - ID of project
- **Request Body:** Custom endorsement details
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Project endorsement added successfully |

---

## 🔒 User Security & 2FA Endpoints

### 23. Generate 2FA Secret
- **Endpoint:** `POST /api/v1/user/security/2fa/setup`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns QR code image URL and secret key |

### 24. Verify 2FA and Enable
- **Endpoint:** `POST /api/v1/user/security/2fa/verify`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "token": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | 2FA successfully enabled |
  | `400`  | Invalid 2FA token |

### 25. Logout From All Devices
- **Endpoint:** `POST /api/v1/user/security/logout-all`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Successfully terminated all other active sessions |

### 26. Deactivate User Account
- **Endpoint:** `POST /api/v1/user/security/deactivate`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Account deactivated successfully |

### 27. Delete User Account
- **Endpoint:** `DELETE /api/v1/user/security/delete`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Account marked for permanent deletion |

### 28. Request Data Export
- **Endpoint:** `POST /api/v1/user/security/data-export`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Export request queued |

### 29. Check Data Export Status
- **Endpoint:** `GET /api/v1/user/security/data-export/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - Export request ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns export status (e.g. pending, completed, fileUrl) |

### 30. Create Support Ticket
- **Endpoint:** `POST /api/v1/user/security/support-request`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "subject": "string",
    "message": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Support ticket created successfully |

---

## 🆔 Persona Identity Webhook

### 31. Persona Webhook Handler
- **Endpoint:** `POST /api/v1/user/persona/webhook`
- **Auth Required:** No (Verifies cryptographic header `persona-signature`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Webhook processed successfully |

---

## 🧑‍🤝‍🧑 Marketplace Collaborator Search Endpoints

### 32. List/Filter Collaborators (Marketplace)
- **Endpoint:** `GET /api/v1/user/collaborators`
- **Auth Required:** No
- **Query Parameters (optional):**
  | Param | Type | Description |
  |-------|------|-------------|
  | `name` | string | Search name (first, last, legal, display) |
  | `skills` | string | Comma-separated skills |
  | `genres` | string | Comma-separated genres |
  | `role` | string | Search specific role in experience |
  | `openToCollaborate` | string | Filter availability (`true`, `false`, `all`) |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns list of collaborator profiles |

### 33. Get Unique Skills Present on Profiles
- **Endpoint:** `GET /api/v1/user/collaborators/skills`
- **Auth Required:** No
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns list of all unique skills in the platform |

### 34. Get Unique Genres Present on Profiles
- **Endpoint:** `GET /api/v1/user/collaborators/genres`
- **Auth Required:** No
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns list of all unique genres in the platform |

### 35. Update Collaborator Availability Status
- **Endpoint:** `PATCH /api/v1/user/collaborators/availability`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "openToCollaborate": boolean
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Availability updated successfully |

### 36. Get Detailed Collaborator Profile By ID
- **Endpoint:** `GET /api/v1/user/collaborators/{userId}`
- **Auth Required:** No
- **Path Parameters:**
  - `userId` (string) - ID of the target user
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Detailed profile including portfolio, history, and endorsements |

---

## 🤝 Connections Endpoints

> [!NOTE]
> There is a pluralization discrepancy in the backend Swagger/JSDoc configuration which annotates paths using `/api/v1/users/connections/...`.
> However, the actual endpoint mounted on the Express server is singular: `/api/v1/user/connections/...`. The client must call the singular path.

### 37. Send Connection Request
- **Endpoint:** `POST /api/v1/user/connections/request`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "receiverId": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Connection request sent successfully |

### 38. Respond to Connection Request
- **Endpoint:** `PUT /api/v1/user/connections/request/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The connection request ID
- **Request Body (required):**
  ```json
  {
    "status": "ACCEPTED" | "REJECTED"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Response saved successfully |

### 39. List Accepted Connections
- **Endpoint:** `GET /api/v1/user/connections`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of collaborator user objects |

### 40. List Pending Connection Requests
- **Endpoint:** `GET /api/v1/user/connections/pending`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of pending connection request objects |

---

## 📊 Dashboard Endpoints

### 41. Fetch Dashboard Data
- **Endpoint:** `GET /api/v1/dashboard`
- **Auth Required:** Yes (`Bearer <token>`)
- **Description:** Aggregates active projects and recent notifications for the authenticated user.
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Dashboard data fetched successfully |
  | `401`  | Unauthorized |

---

## 🔔 Notification & Settings Endpoints

### Notification Schema
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "INVITE" | "SYSTEM" | "PROJECT_CREATED" | "TASK_ASSIGNED" | "MESSAGE" | "WALLET_FUNDED" | "WITHDRAWAL_INITIATED" | "WITHDRAWAL_COMPLETED",
  "isRead": boolean,
  "link": "string | null",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### 42. Get All Notifications
- **Endpoint:** `GET /api/v1/notifications`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Array of notification objects |

### 43. Mark All Notifications as Read
- **Endpoint:** `PATCH /api/v1/notifications/read-all`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | `{ "message": "All notifications marked as read" }` |

### 44. Mark Single Notification as Read
- **Endpoint:** `PATCH /api/v1/notifications/{id}/read`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The notification ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | `{ "message": "Notification marked as read", "notification": { ... } }` |

### 45. Get Notification Settings
- **Endpoint:** `GET /api/v1/notification-settings`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns `NotificationSetting` preferences object |

### 46. Update Notification Settings
- **Endpoint:** `PATCH /api/v1/notification-settings`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "inApp": boolean,
    "email": boolean,
    "sms": boolean,
    "frequency": "IMMEDIATE" | "DAILY" | "WEEKLY"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Settings updated successfully |

---

## 📁 Project Endpoints

### 47. Create Project
- **Endpoint:** `POST /api/v1/projects`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "name": "string",
    "description": "string",
    "genre": "string",
    "startDate": "ISO 8601",
    "visibility": "PUBLIC" | "PRIVATE"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Project created successfully |

### 48. List All User Projects
- **Endpoint:** `GET /api/v1/projects`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Description |
  |-------|------|-------------|
  | `visibility` | string | Filter projects by visibility (`PUBLIC` or `PRIVATE`) |
  | `status` | string | Filter projects by status |
  | `genre` | string | Filter projects by genre |
  | `search` | string | Search projects by name/description |
  | `sortBy` | string | Field to sort by (`createdAt`, `updatedAt`, `name`, `startDate`) |
  | `sortOrder` | string | Sorting direction (`asc`, `desc`) |
  | `page` | integer | Page number for pagination (default: `1`) |
  | `limit` | integer | Number of items per page (default: `10`) |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns `{ projects: [...], meta: { total, page, limit, totalPages } }` |

### 49. Get Project Details
- **Endpoint:** `GET /api/v1/projects/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Success — returns project detail workspace object |

### 50. Update Project
- **Endpoint:** `PUT /api/v1/projects/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Request Body:** Custom fields to update
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Project updated successfully |

### 51. Delete Project
- **Endpoint:** `DELETE /api/v1/projects/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Project deleted successfully |

### 52. Invite Collaborator
- **Endpoint:** `POST /api/v1/projects/{id}/invite`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Request Body (required):**
  ```json
  {
    "collaboratorId": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Collaborator invited successfully |

### 53. Remove Collaborator
- **Endpoint:** `DELETE /api/v1/projects/{id}/collaborators/{collaboratorId}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
  - `collaboratorId` (string) - The collaborator ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Collaborator removed successfully |

### 54. Get Project Metadata and Stats
- **Endpoint:** `GET /api/v1/projects/{id}/metadata`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Success — returns project stats counts |

---

## 📜 Legal Agreements Endpoints

### Legal Agreement Schema
```json
{
  "id": "string",
  "projectId": "string",
  "title": "string | null",
  "content": "string | null",
  "fileUrl": "string | null",
  "status": "DRAFT" | "PENDING_SIGNATURE" | "SIGNED",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601",
  "signatures": [
    {
      "id": "string",
      "agreementId": "string",
      "userId": "string",
      "legalName": "string",
      "signedAt": "ISO 8601"
    }
  ]
}
```

### 55. Upload Draft Agreement
- **Endpoint:** `POST /api/v1/projects/{projectId}/agreements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (Multipart Form):**
  - `file`: PDF file (required, max 10MB)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Draft agreement uploaded successfully |

### 56. Get All Agreements for Project
- **Endpoint:** `GET /api/v1/projects/{projectId}/agreements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns an array of agreements for the project |

### 57. Edit/Replace Draft Agreement
- **Endpoint:** `PUT /api/v1/projects/{projectId}/agreements/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (Multipart Form):**
  - `file`: PDF file (optional)
  - `title`: string (optional)
  - `content`: string (optional)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Agreement updated successfully |

### 58. Update Agreement Status Manually
- **Endpoint:** `PATCH /api/v1/projects/{projectId}/agreements/{id}/status`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "status": "PENDING_SIGNATURE" | "SIGNED"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Status updated successfully |

### 59. Upload Signed Copy Manually
- **Endpoint:** `POST /api/v1/projects/{projectId}/agreements/{id}/sign`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (Multipart Form):**
  - `file`: Signed PDF copy (required)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Signed agreement uploaded and locked |

### 60. Electronically Sign Agreement
- **Endpoint:** `POST /api/v1/projects/{projectId}/agreements/{id}/esign`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
  ```json
  {
    "intentToSign": true
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Agreement e-signed successfully |

---

## 🔒 Escrow Payment Endpoints

### Escrow Schema
```json
{
  "id": "string",
  "projectId": "string",
  "agreementId": "string",
  "totalAmount": number,
  "fundedAmount": number,
  "releasedAmount": number,
  "status": "PENDING_FUNDING" | "FUNDED" | "LOCKED" | "COMPLETED",
  "reviewPeriodDays": number,
  "createdAt": "ISO 8601"
}
```

### Escrow Milestone Schema
```json
{
  "id": "string",
  "title": "string",
  "amount": number,
  "status": "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "AWAITING_REVIEW" | "APPROVED" | "PAYMENT_RELEASED" | "DISPUTED",
  "dueDate": "ISO 8601 | null",
  "submittedAt": "ISO 8601 | null",
  "reviewDeadline": "ISO 8601 | null",
  "evidence": {
    "files": ["string"],
    "links": ["string"],
    "documents": ["string"],
    "comment": "string"
  },
  "isAutoReleased": boolean,
  "collaborators": [
    {
      "userId": "string",
      "paymentReference": "string | null",
      "releasedAt": "ISO 8601 | null"
    }
  ]
}
```

### 61. Get Personal Escrow Payments Received
- **Endpoint:** `GET /api/v1/projects/escrow/my-payments`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `page` | integer | `1` | Page number |
  | `limit` | integer | `20` | Page limit size |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of transaction objects |

### 62. Configure Escrow Terms
- **Endpoint:** `POST /api/v1/projects/{projectId}/escrow`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
- **Request Body (required):**
  ```json
  {
    "totalAmount": number,
    "agreementId": "string",
    "reviewPeriodDays": number,
    "milestones": [
      {
        "title": "string",
        "amount": number,
        "collaboratorIds": ["string"]
      }
    ]
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Escrow configured successfully |

### 63. Get Project Escrow Details
- **Endpoint:** `GET /api/v1/projects/{projectId}/escrow`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns escrow allocations and milestones configurations |

### 64. Get Escrow Status Dashboard
- **Endpoint:** `GET /api/v1/projects/{projectId}/escrow/status`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns summary of funds locked, milestones progress, allocations |

### 65. Review and Approve/Reject Escrow Proposal
- **Endpoint:** `PATCH /api/v1/projects/{projectId}/escrow/approve`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
- **Request Body (required):**
  ```json
  {
    "status": "APPROVED" | "CHANGES_REQUESTED" | "REJECTED",
    "comment": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Proposal review recorded |

### 66. Fund Escrow Proposal
- **Endpoint:** `POST /api/v1/projects/{projectId}/escrow/fund`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Escrow funded and status set to FUNDED |

### 67. Get Project Escrow Payout History
- **Endpoint:** `GET /api/v1/projects/{projectId}/escrow/payments`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns list of released payouts for the project |

### 68. Get Milestone Details
- **Endpoint:** `GET /api/v1/projects/{projectId}/escrow/milestones/{milestoneId}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
  - `milestoneId` (string) - Milestone ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns milestone details |

### 69. Submit Milestone Evidence
- **Endpoint:** `POST /api/v1/projects/{projectId}/escrow/milestones/{milestoneId}/submit`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
  - `milestoneId` (string) - Milestone ID
- **Request Body (required):**
  ```json
  {
    "evidence": {
      "files": ["string"],
      "links": ["string"],
      "documents": ["string"],
      "comment": "string"
    }
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Milestone set to AWAITING_REVIEW status |

### 70. Approve Milestone and Release Funds
- **Endpoint:** `PATCH /api/v1/projects/{projectId}/escrow/milestones/{milestoneId}/approve`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
  - `milestoneId` (string) - Milestone ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Milestone approved and payments released to all assigned collaborators |

### 71. Raise Dispute on Milestone
- **Endpoint:** `POST /api/v1/projects/{projectId}/escrow/milestones/{milestoneId}/dispute`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - Project ID
  - `milestoneId` (string) - Milestone ID
- **Request Body (required):**
  ```json
  {
    "reason": "string" // minimum 10 characters
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Dispute raised and milestone locked |

### 72. Resolve Dispute (Admin Only)
- **Endpoint:** `PATCH /api/v1/projects/escrow/disputes/{milestoneId}/resolve`
- **Auth Required:** Yes (`Bearer <token>` + Admin)
- **Path Parameters:**
  - `milestoneId` (string) - Milestone ID
- **Request Body (required):**
  ```json
  {
    "resolution": "APPROVE_RELEASE" | "REJECT",
    "adminComment": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Dispute resolved successfully |

---

## 💳 Subscriptions & Plans Endpoints

### 73. Get Available Plans
- **Endpoint:** `GET /api/v1/subscriptions/plans`
- **Auth Required:** No
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns available subscription plans |

### 74. Get Current User Subscription
- **Endpoint:** `GET /api/v1/subscriptions/me`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns active subscription details |

### 75. Subscribe or Upgrade Plan
- **Endpoint:** `POST /api/v1/subscriptions/subscribe`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "tier": "ADVANCE" | "PRO" | "ELITE",
    "billingCycle": "MONTHLY" | "ANNUAL"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Plan subscription successfully initialized/updated |

### 76. Cancel Subscription Auto-Renewal
- **Endpoint:** `POST /api/v1/subscriptions/cancel`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Auto-renewal cancelled |

### 77. Reactivate Pending Cancellation
- **Endpoint:** `POST /api/v1/subscriptions/reactivate`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Subscription reactivated successfully |

### 78. Get Billing/Invoice History
- **Endpoint:** `GET /api/v1/subscriptions/billing/history`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `page` | integer | `1` | Page number |
  | `limit` | integer | `20` | Items per page |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns paginated list of invoices |

### 79. Get Invoice Details By ID
- **Endpoint:** `GET /api/v1/subscriptions/billing/invoices/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - Invoice ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns invoice details |

### 80. Get Invoice PDF Details
- **Endpoint:** `GET /api/v1/subscriptions/billing/invoices/{id}/pdf`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - Invoice ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns formatted PDF invoice download stream/data |

### 81. Save Payment Method
- **Endpoint:** `POST /api/v1/subscriptions/payment-methods`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "token": "string",
    "last4": "string",
    "brand": "string",
    "expMonth": integer,
    "expYear": integer,
    "type": "CARD" | "BANK_TRANSFER"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Payment method saved successfully |

### 82. List Saved Payment Methods
- **Endpoint:** `GET /api/v1/subscriptions/payment-methods`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of saved cards/accounts |

### 83. Set Default Payment Method
- **Endpoint:** `PATCH /api/v1/subscriptions/payment-methods/{id}/default`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - Payment method ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Set as default payment method |

### 84. Remove Saved Payment Method
- **Endpoint:** `DELETE /api/v1/subscriptions/payment-methods/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - Payment method ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Payment method removed successfully |

---

## 📝 Waitlist Endpoints

### 85. Join Waitlist
- **Endpoint:** `POST /api/v1/waitlist`
- **Auth Required:** No
- **Request Body (required):**
  ```json
  {
    "email": "string",
    "name": "string",
    "phoneNumber": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Successfully joined the waitlist |

### 86. Download Waitlist (Admin Only)
- **Endpoint:** `GET /api/v1/waitlist/download`
- **Auth Required:** Yes (`Bearer <token>` + Admin)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Binary Excel file stream |

---

## 📋 Summary of All Endpoints

| # | Method | Endpoint | Auth | Section |
|---|--------|----------|------|---------|
| 1 | `POST` | `/api/v1/user/signup` | No | Auth |
| 2 | `POST` | `/api/v1/user/login` | No | Auth |
| 3a | `GET` | `/api/v1/user/auth/google` | No | Auth |
| 3b | `GET` | `/api/v1/user/auth/google/callback` | No | Auth |
| 4 | `POST` | `/api/v1/user/verify` | No | Auth |
| 5 | `POST` | `/api/v1/user/resend-verify` | No | Auth |
| 6 | `POST` | `/api/v1/user/forgot-password` | No | Auth |
| 7 | `POST` | `/api/v1/user/reset-password` | No | Auth |
| 8 | `GET` | `/api/v1/user/profile` | Yes | Auth |
| 9 | `PATCH` | `/api/v1/user/onboarding` | Yes | Auth |
| 10 | `GET` | `/api/v1/user/agreements` | Yes | Auth |
| 11 | `PUT` | `/api/v1/user/profile` | Yes | Profile |
| 12 | `PATCH` | `/api/v1/user/profile/email` | Yes | Profile |
| 13 | `PATCH` | `/api/v1/user/profile/phone` | Yes | Profile |
| 14 | `PATCH` | `/api/v1/user/profile/password` | Yes | Profile |
| 15 | `PATCH` | `/api/v1/user/profile/avatar` | Yes | Profile |
| 16 | `GET` | `/api/v1/user/profile/completeness` | Yes | Profile |
| 17 | `GET` | `/api/v1/user/profile/browse` | No | Profile |
| 18 | `GET` | `/api/v1/user/profile/{userId}` | No | Profile |
| 19 | `POST` | `/api/v1/user/profile/{userId}/endorsements` | Yes | Profile |
| 20 | `GET` | `/api/v1/user/profile/portfolio/{userId}` | No | Profile |
| 21 | `PUT` | `/api/v1/user/profile/portfolio/{projectId}` | Yes | Profile |
| 22 | `POST` | `/api/v1/user/profile/portfolio/{projectId}/endorsements` | Yes | Profile |
| 23 | `POST` | `/api/v1/user/security/2fa/setup` | Yes | Security |
| 24 | `POST` | `/api/v1/user/security/2fa/verify` | Yes | Security |
| 25 | `POST` | `/api/v1/user/security/logout-all` | Yes | Security |
| 26 | `POST` | `/api/v1/user/security/deactivate` | Yes | Security |
| 27 | `DELETE` | `/api/v1/user/security/delete` | Yes | Security |
| 28 | `POST` | `/api/v1/user/security/data-export` | Yes | Security |
| 29 | `GET` | `/api/v1/user/security/data-export/{id}` | Yes | Security |
| 30 | `POST` | `/api/v1/user/security/support-request` | Yes | Security |
| 31 | `POST` | `/api/v1/user/persona/webhook` | No | Persona |
| 32 | `GET` | `/api/v1/user/collaborators` | No | Collaborators |
| 33 | `GET` | `/api/v1/user/collaborators/skills` | No | Collaborators |
| 34 | `GET` | `/api/v1/user/collaborators/genres` | No | Collaborators |
| 35 | `PATCH` | `/api/v1/user/collaborators/availability` | Yes | Collaborators |
| 36 | `GET` | `/api/v1/user/collaborators/{userId}` | No | Collaborators |
| 37 | `POST` | `/api/v1/user/connections/request` | Yes | Connections |
| 38 | `PUT` | `/api/v1/user/connections/request/{id}` | Yes | Connections |
| 39 | `GET` | `/api/v1/user/connections` | Yes | Connections |
| 40 | `GET` | `/api/v1/user/connections/pending` | Yes | Connections |
| 41 | `GET` | `/api/v1/dashboard` | Yes | Dashboard |
| 42 | `GET` | `/api/v1/notifications` | Yes | Notifications |
| 43 | `PATCH` | `/api/v1/notifications/read-all` | Yes | Notifications |
| 44 | `PATCH` | `/api/v1/notifications/{id}/read` | Yes | Notifications |
| 45 | `GET` | `/api/v1/notification-settings` | Yes | Notifications |
| 46 | `PATCH` | `/api/v1/notification-settings` | Yes | Notifications |
| 47 | `POST` | `/api/v1/projects` | Yes | Projects |
| 48 | `GET` | `/api/v1/projects` | Yes | Projects |
| 49 | `GET` | `/api/v1/projects/{id}` | Yes | Projects |
| 50 | `PUT` | `/api/v1/projects/{id}` | Yes | Projects |
| 51 | `DELETE` | `/api/v1/projects/{id}` | Yes | Projects |
| 52 | `POST` | `/api/v1/projects/{id}/invite` | Yes | Projects |
| 53 | `DELETE` | `/api/v1/projects/{id}/collaborators/{collaboratorId}` | Yes | Projects |
| 54 | `GET` | `/api/v1/projects/{id}/metadata` | Yes | Projects |
| 55 | `POST` | `/api/v1/projects/{projectId}/agreements` | Yes | Agreements |
| 56 | `GET` | `/api/v1/projects/{projectId}/agreements` | Yes | Agreements |
| 57 | `PUT` | `/api/v1/projects/{projectId}/agreements/{id}` | Yes | Agreements |
| 58 | `PATCH` | `/api/v1/projects/{projectId}/agreements/{id}/status` | Yes | Agreements |
| 59 | `POST` | `/api/v1/projects/{projectId}/agreements/{id}/sign` | Yes | Agreements |
| 60 | `POST` | `/api/v1/projects/{projectId}/agreements/{id}/esign` | Yes | Agreements |
| 61 | `GET` | `/api/v1/projects/escrow/my-payments` | Yes | Escrow |
| 62 | `POST` | `/api/v1/projects/{projectId}/escrow` | Yes | Escrow |
| 63 | `GET` | `/api/v1/projects/{projectId}/escrow` | Yes | Escrow |
| 64 | `GET` | `/api/v1/projects/{projectId}/escrow/status` | Yes | Escrow |
| 65 | `PATCH` | `/api/v1/projects/{projectId}/escrow/approve` | Yes | Escrow |
| 66 | `POST` | `/api/v1/projects/{projectId}/escrow/fund` | Yes | Escrow |
| 67 | `GET` | `/api/v1/projects/{projectId}/escrow/payments` | Yes | Escrow |
| 68 | `GET` | `/api/v1/projects/{projectId}/escrow/milestones/{milestoneId}` | Yes | Escrow |
| 69 | `POST` | `/api/v1/projects/{projectId}/escrow/milestones/{milestoneId}/submit` | Yes | Escrow |
| 70 | `PATCH` | `/api/v1/projects/{projectId}/escrow/milestones/{milestoneId}/approve` | Yes | Escrow |
| 71 | `POST` | `/api/v1/projects/{projectId}/escrow/milestones/{milestoneId}/dispute` | Yes | Escrow |
| 72 | `PATCH` | `/api/v1/projects/escrow/disputes/{milestoneId}/resolve` | Yes | Escrow |
| 73 | `GET` | `/api/v1/subscriptions/plans` | No | Subscriptions |
| 74 | `GET` | `/api/v1/subscriptions/me` | Yes | Subscriptions |
| 75 | `POST` | `/api/v1/subscriptions/subscribe` | Yes | Subscriptions |
| 76 | `POST` | `/api/v1/subscriptions/cancel` | Yes | Subscriptions |
| 77 | `POST` | `/api/v1/subscriptions/reactivate` | Yes | Subscriptions |
| 78 | `GET` | `/api/v1/subscriptions/billing/history` | Yes | Subscriptions |
| 79 | `GET` | `/api/v1/subscriptions/billing/invoices/{id}` | Yes | Subscriptions |
| 80 | `GET` | `/api/v1/subscriptions/billing/invoices/{id}/pdf` | Yes | Subscriptions |
| 81 | `POST` | `/api/v1/subscriptions/payment-methods` | Yes | Subscriptions |
| 82 | `GET` | `/api/v1/subscriptions/payment-methods` | Yes | Subscriptions |
| 83 | `PATCH` | `/api/v1/subscriptions/payment-methods/{id}/default` | Yes | Subscriptions |
| 84 | `DELETE` | `/api/v1/subscriptions/payment-methods/{id}` | Yes | Subscriptions |
| 85 | `POST` | `/api/v1/waitlist` | No | Waitlist |
| 86 | `GET` | `/api/v1/waitlist/download` | Yes | Waitlist |
