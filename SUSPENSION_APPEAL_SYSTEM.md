# 🔐 Suspension Appeal System - Complete Implementation

## Overview
A complete system for suspended users to request account reactivation and for admins to manage these appeals.

## What Was Implemented

### 1. **Backend Changes**

#### New Model: `SuspensionRequest` (`backend/src/models/SuspensionRequest.js`)
Tracks all suspension appeal requests with fields:
- `user`: Reference to the suspended user
- `userEmail` & `userName`: User details for easy reference
- `reason`: User's appeal reason
- `status`: 'pending', 'approved', or 'rejected'
- `adminResponse`: Admin's response message
- `resolvedAt`: When the request was resolved
- `resolvedBy`: Which admin resolved it

#### New Controller: `suspensionRequestController.js`
Functions:
- `submitSuspensionRequest()` - Suspended users submit appeals
- `getUserSuspensionRequests()` - Users view their appeals
- `getAllSuspensionRequests()` - Admins view all appeals
- `approveSuspensionRequest()` - Admin approves and reactivates user
- `rejectSuspensionRequest()` - Admin rejects with explanation

#### New Routes: `suspensionRequestRoutes.js`
```
POST   /api/suspension-requests/submit          - Submit appeal
GET    /api/suspension-requests/my-requests     - View user's appeals
GET    /api/suspension-requests/                - Admin: View all appeals
PATCH  /api/suspension-requests/:id/approve     - Admin: Approve appeal
PATCH  /api/suspension-requests/:id/reject      - Admin: Reject appeal
```

#### Updated: `server.js`
- Added suspension request routes to the Express app

### 2. **Frontend Changes**

#### New Page: `SuspensionAppeal.jsx`
- Shows when a user is suspended
- Form to submit appeal with reason (min 10 characters)
- Displays appeal history with status and admin responses
- Logout button for security

#### Updated: `Login.jsx`
- Detects suspension error from backend
- Shows error message
- Redirects to `/suspended` page after 1.5 seconds
- Stores suspended email in localStorage

#### Updated: `App.jsx`
- Added `/suspended` route for SuspensionAppeal page
- Imported SuspensionAppeal component

#### Updated: `AdminDashboard.jsx`
- Added "Appeals" tab to admin dashboard
- Shows all pending, approved, and rejected appeals
- Admins can:
  - View user's appeal reason
  - Write and send response
  - Approve (reactivates user account)
  - Reject (keeps account suspended)
- Displays appeal history with timestamps

#### Updated: `api.js` (Services)
Added new API functions:
```javascript
// For suspended users
suspensionAPI.submitRequest(reason)
suspensionAPI.getUserRequests()

// For admins
adminAPI.getSuspensionRequests()
adminAPI.approveSuspensionRequest(requestId, response)
adminAPI.rejectSuspensionRequest(requestId, response)
```

## How It Works

### User Flow (Suspended User)
1. User tries to login with suspended account
2. Backend returns: "Your account has been suspended. Please contact support."
3. Frontend redirects to `/suspended` page
4. User sees SuspensionAppeal page with:
   - Explanation of suspension
   - Form to submit appeal
   - History of previous appeals
5. User fills reason (min 10 chars) and submits
6. Appeal is created with status "pending"
7. User can view appeal status and admin response

### Admin Flow
1. Admin goes to Admin Dashboard
2. Clicks "Appeals" tab
3. Sees all pending appeals with:
   - User name and email
   - Appeal reason
   - Submission date
4. Admin writes response and either:
   - **Approve**: User account is reactivated, appeal marked approved
   - **Reject**: Appeal marked rejected with explanation
5. User receives admin response in their appeal history

## Key Features

✅ **Validation**
- Minimum 10 character reason required
- Only suspended users can submit appeals
- Only one pending appeal per user at a time

✅ **Security**
- All endpoints require authentication
- Admin endpoints require admin role
- User can only see their own appeals
- Admins can see all appeals

✅ **User Experience**
- Clear error messages
- Appeal history tracking
- Admin responses visible to users
- Automatic redirect on suspension

✅ **Admin Control**
- View all appeals in one place
- Approve/reject with custom messages
- Track who resolved each appeal
- See resolution timestamps

## Testing the System

### Test Suspension Appeal:
1. Login as admin
2. Go to Admin Dashboard → Users tab
3. Click "Suspend" on any user
4. Logout
5. Try to login with suspended user
6. Should see suspension message and redirect to `/suspended`
7. Submit an appeal with reason
8. Login as admin
9. Go to Admin Dashboard → Appeals tab
10. Approve or reject the appeal
11. Suspended user can see the response

## Database Schema

```javascript
SuspensionRequest {
  user: ObjectId,
  userEmail: String,
  userName: String,
  reason: String (min 10 chars),
  status: 'pending' | 'approved' | 'rejected',
  adminResponse: String,
  resolvedAt: Date,
  resolvedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Summary

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/suspension-requests/submit` | ✅ | User | Submit appeal |
| GET | `/suspension-requests/my-requests` | ✅ | User | View own appeals |
| GET | `/suspension-requests/` | ✅ | Admin | View all appeals |
| PATCH | `/suspension-requests/:id/approve` | ✅ | Admin | Approve appeal |
| PATCH | `/suspension-requests/:id/reject` | ✅ | Admin | Reject appeal |

---

**Status**: ✅ Complete and Ready to Use

