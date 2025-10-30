# 🚀 Quick Reference - Suspension Appeal System

## For Users

### I'm Suspended - What Do I Do?

1. **Try to login** → You'll see: "Your account has been suspended"
2. **You're redirected** → To `/suspended` page automatically
3. **Submit appeal** → Write reason (min 10 characters) why you should be reactivated
4. **Wait for response** → Admin will review and respond
5. **Check status** → View your appeal history and admin's response

### Appeal Status Meanings

| Status | Meaning | What's Next |
|--------|---------|------------|
| 🟡 Pending | Admin is reviewing | Wait for response |
| 🟢 Approved | Account reactivated! | You can login now |
| 🔴 Rejected | Appeal denied | See admin's reason, can appeal again |

---

## For Admins

### Managing Suspension Appeals

1. **Go to Admin Dashboard** → Click "Appeals" tab
2. **See pending appeals** → User name, email, reason, date
3. **Review the appeal** → Read user's reason carefully
4. **Write response** → Explain your decision
5. **Approve or Reject**:
   - ✅ **Approve** → User account reactivated automatically
   - ❌ **Reject** → User stays suspended, sees your reason

### Appeal Tab Features

- 🟡 **Pending Appeals** - Need your action
- 🟢 **Approved Appeals** - User reactivated
- 🔴 **Rejected Appeals** - User remains suspended
- 📝 **Admin Response** - Your message to user
- 📅 **Timestamps** - When submitted and resolved

---

## System Architecture

```
User Suspended
    ↓
Login Blocked (403 Error)
    ↓
Redirect to /suspended
    ↓
SuspensionAppeal Page
    ↓
Submit Appeal
    ↓
SuspensionRequest Created
    ↓
Admin Reviews in Appeals Tab
    ↓
Approve → Reactivate | Reject → Deny
```

---

## API Endpoints

### For Users
```
POST   /api/suspension-requests/submit
GET    /api/suspension-requests/my-requests
```

### For Admins
```
GET    /api/suspension-requests/
PATCH  /api/suspension-requests/:id/approve
PATCH  /api/suspension-requests/:id/reject
```

---

## Database Model

```javascript
SuspensionRequest {
  _id: ObjectId,
  user: ObjectId,           // Reference to user
  userEmail: String,        // User's email
  userName: String,         // User's name
  reason: String,           // User's appeal reason
  status: String,           // 'pending', 'approved', 'rejected'
  adminResponse: String,    // Admin's response
  resolvedAt: Date,         // When resolved
  resolvedBy: ObjectId,     // Which admin resolved it
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Routes

| Route | Purpose | Who Can Access |
|-------|---------|----------------|
| `/login` | Login page | Everyone |
| `/suspended` | Appeal page | Suspended users |
| `/dashboard` | Main app | Active users |
| `/admin` | Admin panel | Admins only |

---

## Key Validations

✅ **Reason must be at least 10 characters**
✅ **Only one pending appeal per user**
✅ **Only suspended users can submit appeals**
✅ **Only admins can approve/reject**
✅ **All endpoints require authentication**

---

## Common Scenarios

### Scenario 1: User Gets Suspended
```
1. Admin clicks "Suspend" on user
2. User's isActive = false
3. User tries to login
4. Gets error: "Account suspended"
5. Redirected to /suspended
6. Can submit appeal
```

### Scenario 2: User Appeal Approved
```
1. User submits appeal
2. Admin reviews and clicks "Approve"
3. User's isActive = true (reactivated)
4. Appeal status = "approved"
5. User can login again
6. All data restored
```

### Scenario 3: User Appeal Rejected
```
1. User submits appeal
2. Admin reviews and clicks "Reject"
3. User's isActive = false (stays suspended)
4. Appeal status = "rejected"
5. Admin's response shown to user
6. User can submit new appeal later
```

---

## Troubleshooting

**Q: User can't see appeal page?**
A: Make sure they're redirected from login. Check browser console for errors.

**Q: Admin can't see Appeals tab?**
A: Make sure user is logged in as admin. Check user role in database.

**Q: Appeal not submitting?**
A: Check reason is at least 10 characters. Check network tab for errors.

**Q: User not reactivated after approval?**
A: Check database - user's isActive should be true. Refresh page.

---

## Files to Know

**Backend**
- `suspensionRequestController.js` - Business logic
- `SuspensionRequest.js` - Database model
- `suspensionRequestRoutes.js` - API endpoints

**Frontend**
- `SuspensionAppeal.jsx` - Appeal page UI
- `AdminDashboard.jsx` - Appeals management tab
- `Login.jsx` - Suspension error handling
- `api.js` - API service functions

---

**Status**: ✅ Production Ready

