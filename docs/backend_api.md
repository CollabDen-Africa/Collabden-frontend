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

### 17. Browse/Search Collaborators
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

## 🤝 Connections Endpoints

> [!NOTE]
> There is a pluralization discrepancy in the backend Swagger/JSDoc configuration which annotates paths using `/api/v1/users/connections/...`.
> However, the actual endpoint mounted on the Express server is singular: `/api/v1/user/connections/...`. The client must call the singular path.

### 23. Send Connection Request
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

### 24. Respond to Connection Request
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

### 25. List Accepted Connections
- **Endpoint:** `GET /api/v1/user/connections`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of collaborator user objects |

### 26. List Pending Connection Requests
- **Endpoint:** `GET /api/v1/user/connections/pending`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of pending connection request objects |

---

## 📊 Dashboard Endpoints

### 27. Fetch Dashboard Data
- **Endpoint:** `GET /api/v1/dashboard`
- **Auth Required:** Yes (`Bearer <token>`)
- **Description:** Aggregates active projects and recent notifications for the authenticated user.
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Dashboard data fetched successfully |
  | `401`  | Unauthorized |

---

## 🔔 Notification Endpoints

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

### 28. Get All Notifications
- **Endpoint:** `GET /api/v1/notifications`
- **Auth Required:** Yes (`Bearer <token>`)
- **Description:** Returns all notifications for the currently logged-in user, ordered by most recent first.
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Array of notification objects |
  | `401`  | Unauthorized |

### 29. Mark All Notifications as Read
- **Endpoint:** `PATCH /api/v1/notifications/read-all`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | `{ "message": "All notifications marked as read" }` |
  | `401`  | Unauthorized |

### 30. Mark Single Notification as Read
- **Endpoint:** `PATCH /api/v1/notifications/{id}/read`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The notification ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | `{ "message": "Notification marked as read", "notification": { ... } }` |
  | `401`  | Unauthorized |

---

## 📁 Project Endpoints

### 31. Create Project
- **Endpoint:** `POST /api/v1/projects`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "name": "string",         // required
    "description": "string",  // optional
    "genre": "string",        // required
    "startDate": "ISO 8601",  // required
    "visibility": "PUBLIC" | "PRIVATE" // optional (defaults to PUBLIC)
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Project created successfully |
  | `400`  | Missing required fields |

### 32. List All User Projects
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

### 33. Get Project Details
- **Endpoint:** `GET /api/v1/projects/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Success — returns project detail workspace object |
  | `404`  | Project not found |

### 34. Update Project
- **Endpoint:** `PUT /api/v1/projects/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Request Body:**
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
  | `200`  | Project updated successfully |
  | `403`  | Forbidden (Only the owner can update project settings) |
  | `404`  | Project not found |

### 35. Delete Project
- **Endpoint:** `DELETE /api/v1/projects/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Project deleted successfully |
  | `403`  | Forbidden (Only the owner can delete the project) |

### 36. Invite Collaborator
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
  | `404`  | Project or User not found |

### 37. Remove Collaborator
- **Endpoint:** `DELETE /api/v1/projects/{id}/collaborators/{collaboratorId}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
  - `collaboratorId` (string) - The collaborator ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Collaborator removed successfully |
  | `403`  | Permission denied |

### 38. Get Project Metadata and Stats
- **Endpoint:** `GET /api/v1/projects/{id}/metadata`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The project ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Success — returns project stats (tasks, files, messages, agreements, collaborators counts) |

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

### 39. Upload Draft Agreement
- **Endpoint:** `POST /api/v1/projects/{projectId}/agreements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (Multipart Form):**
  - `file`: PDF file (required, max 10MB)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Draft agreement uploaded successfully |
  | `400`  | No file uploaded |
  | `403`  | Plan limit reached or access denied |

### 40. Get All Agreements for Project
- **Endpoint:** `GET /api/v1/projects/{projectId}/agreements`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns an array of agreements for the project |

### 41. Edit/Replace Draft Agreement
- **Endpoint:** `PUT /api/v1/projects/{projectId}/agreements/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `projectId` (string) - The project ID
  - `id` (string) - The agreement ID
- **Request Body (Multipart Form):**
  - `file`: PDF file (optional)
  - `title`: string (optional)
  - `content`: string (optional)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Agreement updated successfully |
  | `400`  | Cannot edit a signed agreement |
  | `403`  | Only project owner can edit |

### 42. Update Agreement Status Manually
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
  | `400`  | Invalid status transition |

### 43. Upload Signed Copy Manually
- **Endpoint:** `POST /api/v1/projects/{projectId}/agreements/{id}/sign`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (Multipart Form):**
  - `file`: Signed PDF copy (required)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Signed agreement uploaded and locked |
  | `400`  | Agreement already signed |

### 44. Electronically Sign Agreement
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
  | `400`  | Missing checkbox intent |

---

## 💬 Messaging Endpoints

### 45. Send Message Request
- **Endpoint:** `POST /api/v1/messaging/requests`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "receiverId": "string",
    "message": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Message request sent successfully |
  | `400`  | Bad request (already connected/requested) |

### 46. Respond to Message Request
- **Endpoint:** `PATCH /api/v1/messaging/requests/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - The message request ID
- **Request Body (required):**
  ```json
  {
    "status": "ACCEPTED" | "DECLINED"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Response saved successfully. Returns created `chatId` if accepted |

### 47. List Message Requests
- **Endpoint:** `GET /api/v1/messaging/requests`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `direction` | string | `received` | Direction of requests (`sent` or `received`) |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of message request objects |

### 48. List Direct Chats
- **Endpoint:** `GET /api/v1/messaging/chats`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of chat session objects with last message and unread count |

### 49. Fetch Direct Chat Messages
- **Endpoint:** `GET /api/v1/messaging/chats/{chatId}/messages`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `chatId` (string) - The chat ID
- **Query Parameters (optional):**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `limit` | integer | `50` | Number of messages to retrieve |
  | `beforeId` | string | null | Message ID cursor for backwards pagination |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of messages sorted chronologically |

### 50. Send Direct Message / Voice Note
- **Endpoint:** `POST /api/v1/messaging/chats/{chatId}/messages`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `chatId` (string) - The chat ID
- **Request Body (optional fields):**
  ```json
  {
    "content": "string",       // text content of message
    "parentId": "string",      // parent message ID for replies
    "voiceUrl": "string",      // URL to uploaded voice file
    "voiceDuration": integer   // duration in seconds
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Message sent successfully |

### 51. Mark Chat Messages as Read
- **Endpoint:** `PATCH /api/v1/messaging/chats/{chatId}/read`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `chatId` (string) - The chat ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Chat marked as read successfully |

### 52. Toggle Emoji Reaction on Message
- **Endpoint:** `POST /api/v1/messaging/messages/{messageId}/reactions`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `messageId` (string) - The message ID
- **Request Body (required):**
  ```json
  {
    "emoji": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Reaction toggled (`status`: `ADDED` or `REMOVED`) |

### 53. Archive Direct Chat
- **Endpoint:** `PATCH /api/v1/messaging/chats/{chatId}/archive`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `chatId` (string) - The chat ID
- **Request Body (required):**
  ```json
  {
    "isArchived": boolean
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Chat archived or unarchived successfully |

### 54. Delete Direct Chat History
- **Endpoint:** `DELETE /api/v1/messaging/chats/{chatId}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `chatId` (string) - The chat ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Chat history deleted successfully (soft delete) |

---

## 💳 Payments & Wallet Endpoints

### 55. Flutterwave Webhook Callback
- **Endpoint:** `POST /api/v1/payments/webhook/flutterwave`
- **Auth Required:** No (Verifies signature header `verif-hash`)
- **Description:** Receives payment events from Flutterwave.
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Webhook processed |

### 56. Fetch Wallet Balance
- **Endpoint:** `GET /api/v1/payments/wallet`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns wallet details (balance, currency NGN) |

### 57. Fetch Transaction History
- **Endpoint:** `GET /api/v1/payments/transactions`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Description |
  |-------|------|-------------|
  | `type` | string | Filter by transaction type (`FUNDING`, `WITHDRAWAL`, `ESCROW_CREDIT`, `ESCROW_DEBIT`) |
  | `status` | string | Filter by status (`PENDING`, `COMPLETED`, `FAILED`, `REVERSED`) |
  | `page` | integer | Page number |
  | `limit` | integer | Page size limit |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns list of transactions and pagination metadata |

### 58. Initialize Wallet Funding
- **Endpoint:** `POST /api/v1/payments/fund/initialize`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "amount": number,           // minimum 100 NGN
    "paymentMethod": "string"   // "card" | "banktransfer" | "ussd"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Payment link generated (`paymentLink`, `txRef`) |

### 59. Verify Wallet Funding
- **Endpoint:** `GET /api/v1/payments/fund/verify`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (required):**
  | Param | Type | Description |
  |-------|------|-------------|
  | `transaction_id` | string | Flutterwave transaction ID from redirect callback |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns verification details and wallet balance |

### 60. Get Supported Banks for Withdrawal
- **Endpoint:** `GET /api/v1/payments/banks`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of banks with names and codes |

### 61. Add Bank Account for Withdrawals
- **Endpoint:** `POST /api/v1/payments/bank-accounts`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "bankCode": "string",
    "accountNumber": "string"
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `201`  | Bank account registered and verified successfully |

### 62. List Registered Bank Accounts
- **Endpoint:** `GET /api/v1/payments/bank-accounts`
- **Auth Required:** Yes (`Bearer <token>`)
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of bank account details |

### 63. Remove Registered Bank Account
- **Endpoint:** `DELETE /api/v1/payments/bank-accounts/{id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Path Parameters:**
  - `id` (string) - Bank account ID
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Bank account soft-deleted |

### 64. Request Payout Withdrawal
- **Endpoint:** `POST /api/v1/payments/withdraw`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (required):**
  ```json
  {
    "bankAccountId": "string",
    "amount": number // minimum 1000 NGN
  }
  ```
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Withdrawal request submitted successfully |

### 65. Fetch Withdrawal Payout History
- **Endpoint:** `GET /api/v1/payments/withdrawals`
- **Auth Required:** Yes (`Bearer <token>`)
- **Query Parameters (optional):**
  | Param | Type | Default | Description |
  |-------|------|---------|-------------|
  | `page` | integer | `1` | Page number |
  | `limit` | integer | `20` | Page size limit |
- **Responses:**
  | Status | Description |
  |--------|-------------|
  | `200`  | Returns array of payout transactions |

---

## 📝 Waitlist Endpoints

### 66. Join Waitlist
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
  | `400`  | Already registered or bad request |

### 67. Download Waitlist (Admin Only)
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
| 23 | `POST` | `/api/v1/user/connections/request` | Yes | Connections |
| 24 | `PUT` | `/api/v1/user/connections/request/{id}` | Yes | Connections |
| 25 | `GET` | `/api/v1/user/connections` | Yes | Connections |
| 26 | `GET` | `/api/v1/user/connections/pending` | Yes | Connections |
| 27 | `GET` | `/api/v1/dashboard` | Yes | Dashboard |
| 28 | `GET` | `/api/v1/notifications` | Yes | Notifications |
| 29 | `PATCH` | `/api/v1/notifications/read-all` | Yes | Notifications |
| 30 | `PATCH` | `/api/v1/notifications/{id}/read` | Yes | Notifications |
| 31 | `POST` | `/api/v1/projects` | Yes | Projects |
| 32 | `GET` | `/api/v1/projects` | Yes | Projects |
| 33 | `GET` | `/api/v1/projects/{id}` | Yes | Projects |
| 34 | `PUT` | `/api/v1/projects/{id}` | Yes | Projects |
| 35 | `DELETE` | `/api/v1/projects/{id}` | Yes | Projects |
| 36 | `POST` | `/api/v1/projects/{id}/invite` | Yes | Projects |
| 37 | `DELETE` | `/api/v1/projects/{id}/collaborators/{collaboratorId}` | Yes | Projects |
| 38 | `GET` | `/api/v1/projects/{id}/metadata` | Yes | Projects |
| 39 | `POST` | `/api/v1/projects/{projectId}/agreements` | Yes | Agreements |
| 40 | `GET` | `/api/v1/projects/{projectId}/agreements` | Yes | Agreements |
| 41 | `PUT` | `/api/v1/projects/{projectId}/agreements/{id}` | Yes | Agreements |
| 42 | `PATCH` | `/api/v1/projects/{projectId}/agreements/{id}/status` | Yes | Agreements |
| 43 | `POST` | `/api/v1/projects/{projectId}/agreements/{id}/sign` | Yes | Agreements |
| 44 | `POST` | `/api/v1/projects/{projectId}/agreements/{id}/esign` | Yes | Agreements |
| 45 | `POST` | `/api/v1/messaging/requests` | Yes | Messaging |
| 46 | `PATCH` | `/api/v1/messaging/requests/{id}` | Yes | Messaging |
| 47 | `GET` | `/api/v1/messaging/requests` | Yes | Messaging |
| 48 | `GET` | `/api/v1/messaging/chats` | Yes | Messaging |
| 49 | `GET` | `/api/v1/messaging/chats/{chatId}/messages` | Yes | Messaging |
| 50 | `POST` | `/api/v1/messaging/chats/{chatId}/messages` | Yes | Messaging |
| 51 | `PATCH` | `/api/v1/messaging/chats/{chatId}/read` | Yes | Messaging |
| 52 | `POST` | `/api/v1/messaging/messages/{messageId}/reactions` | Yes | Messaging |
| 53 | `PATCH` | `/api/v1/messaging/chats/{chatId}/archive` | Yes | Messaging |
| 54 | `DELETE` | `/api/v1/messaging/chats/{chatId}` | Yes | Messaging |
| 55 | `POST` | `/api/v1/payments/webhook/flutterwave` | No | Payments |
| 56 | `GET` | `/api/v1/payments/wallet` | Yes | Payments |
| 57 | `GET` | `/api/v1/payments/transactions` | Yes | Payments |
| 58 | `POST` | `/api/v1/payments/fund/initialize` | Yes | Payments |
| 59 | `GET` | `/api/v1/payments/fund/verify` | Yes | Payments |
| 60 | `GET` | `/api/v1/payments/banks` | Yes | Payments |
| 61 | `POST` | `/api/v1/payments/bank-accounts` | Yes | Payments |
| 62 | `GET` | `/api/v1/payments/bank-accounts` | Yes | Payments |
| 63 | `DELETE` | `/api/v1/payments/bank-accounts/{id}` | Yes | Payments |
| 64 | `POST` | `/api/v1/payments/withdraw` | Yes | Payments |
| 65 | `GET` | `/api/v1/payments/withdrawals` | Yes | Payments |
| 66 | `POST` | `/api/v1/waitlist` | No | Waitlist |
| 67 | `GET` | `/api/v1/waitlist/download` | Yes | Waitlist |
