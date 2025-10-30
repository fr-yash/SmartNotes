# 🔧 Troubleshooting Guide - Suspension Appeal System

## Common Issues & Solutions

### Issue 1: "No Token Provided" Error When Submitting Appeal

**Symptoms**:
- Error message: "No token provided"
- Appeal submission fails
- Browser console shows 401 error

**Causes**:
- Token not stored in localStorage
- Token expired
- Token not sent in request headers

**Solutions**:

1. **Check if token is stored**
   ```javascript
   // Open browser console and run:
   console.log(localStorage.getItem('token'));
   // Should print a long JWT token, not null
   ```

2. **Verify token is being sent**
   - Open DevTools → Network tab
   - Submit appeal
   - Click on the POST request to `/api/suspension-requests/submit`
   - Check "Request Headers"
   - Should see: `Authorization: Bearer eyJhbGc...`

3. **Clear and retry**
   - Clear localStorage: `localStorage.clear()`
   - Refresh page
   - Try login again
   - Try submitting appeal

4. **Check backend logs**
   - Look for error messages in terminal
   - Should see token being verified

---

### Issue 2: Appeals Not Appearing on Admin Dashboard

**Symptoms**:
- Appeals tab shows "No suspension appeals at this time"
- But appeals were submitted
- No errors in console

**Causes**:
- Appeals not being created in database
- Admin not fetching appeals correctly
- Database connection issue

**Solutions**:

1. **Verify appeals exist in database**
   ```javascript
   // In MongoDB shell or Compass:
   db.suspensionrequests.find()
   // Should show submitted appeals
   ```

2. **Check admin permissions**
   - Verify logged-in user is admin
   - Check user.role === 'admin'
   - Open DevTools → Application → Local Storage
   - Check `user` object has `"role":"admin"`

3. **Refresh admin dashboard**
   - Click "Appeals" tab again
   - Or refresh entire page
   - Wait for loading to complete

4. **Check network requests**
   - Open DevTools → Network tab
   - Click "Appeals" tab
   - Look for GET request to `/api/suspension-requests/`
   - Should return 200 status
   - Should include appeals in response

5. **Check backend logs**
   - Look for errors in terminal
   - Should see successful database queries

---

### Issue 3: Suspended User Can Still Login

**Symptoms**:
- Suspended user can login normally
- No suspension message appears
- User can access dashboard

**Causes**:
- User not actually suspended
- isActive field not updated
- Cache issue

**Solutions**:

1. **Verify user is suspended**
   ```javascript
   // In MongoDB:
   db.users.findOne({ email: "user@example.com" })
   // Should show: "isActive": false
   ```

2. **Manually suspend user**
   - Go to Admin Dashboard → Users tab
   - Find user
   - Click "Suspend" button
   - Verify status changes to "Suspended"

3. **Clear browser cache**
   - Clear localStorage: `localStorage.clear()`
   - Clear cookies
   - Close and reopen browser
   - Try login again

---

### Issue 4: Approve/Reject Buttons Not Working

**Symptoms**:
- Buttons don't respond when clicked
- No error messages
- Page doesn't update

**Causes**:
- Response text not filled in
- Admin not authenticated
- Network error

**Solutions**:

1. **Fill in response text**
   - Click in the textarea
   - Type a response message
   - Then click Approve/Reject

2. **Check admin authentication**
   - Verify token is valid
   - Check DevTools → Network
   - Look for 401 or 403 errors

3. **Check network request**
   - Open DevTools → Network tab
   - Click Approve/Reject
   - Look for PATCH request
   - Should return 200 status

4. **Refresh page**
   - Refresh admin dashboard
   - Try again

---

### Issue 5: User Can't Login After Approval

**Symptoms**:
- Appeal was approved
- User still can't login
- Still shows suspension message

**Causes**:
- User not actually reactivated
- isActive field not updated
- Cache issue

**Solutions**:

1. **Verify user is reactivated**
   ```javascript
   // In MongoDB:
   db.users.findOne({ email: "user@example.com" })
   // Should show: "isActive": true
   ```

2. **Check approval response**
   - Go to Appeals tab
   - Find the appeal
   - Verify status shows "Approved" (green)
   - Verify admin response is shown

3. **Clear browser cache**
   - Clear localStorage
   - Clear cookies
   - Close browser
   - Try login again

4. **Check backend logs**
   - Look for errors during approval
   - Should see user being reactivated

---

### Issue 6: Appeal History Not Showing

**Symptoms**:
- "Your Appeal History" section not visible
- Or shows "No appeals" when appeals exist
- Page seems incomplete

**Causes**:
- Appeals not fetched
- Loading not complete
- Component error

**Solutions**:

1. **Wait for loading**
   - Page might still be loading
   - Wait for spinner to disappear

2. **Refresh page**
   - Refresh `/suspended` page
   - Wait for appeals to load

3. **Check browser console**
   - Open DevTools → Console
   - Look for error messages
   - Check for network errors

4. **Check network requests**
   - Open DevTools → Network tab
   - Look for GET request to `/api/suspension-requests/my-requests`
   - Should return 200 status
   - Should include appeals in response

---

### Issue 7: Validation Errors

**Symptoms**:
- Can't submit appeal
- Error: "Reason must be at least 10 characters"
- Or: "You already have a pending appeal request"

**Solutions**:

1. **For character limit error**
   - Type longer reason (at least 10 characters)
   - Example: "I apologize for my actions and will follow the rules."

2. **For pending appeal error**
   - Wait for admin to respond to current appeal
   - Or ask admin to reject it
   - Then submit new appeal

3. **For empty reason error**
   - Click in textarea
   - Type your reason
   - Then submit

---

## Debug Checklist

When something isn't working:

- [ ] Check browser console for errors
- [ ] Check DevTools Network tab for failed requests
- [ ] Verify token is in localStorage
- [ ] Verify user is logged in
- [ ] Verify user role (admin or regular user)
- [ ] Check backend logs for errors
- [ ] Verify MongoDB is connected
- [ ] Verify backend server is running
- [ ] Try refreshing page
- [ ] Try clearing localStorage
- [ ] Try closing and reopening browser

---

## Getting Help

If you're still having issues:

1. **Check the logs**
   - Backend terminal for server errors
   - Browser console for client errors
   - MongoDB logs for database errors

2. **Verify setup**
   - Backend running on port 5000
   - Frontend running on port 5173
   - MongoDB connected
   - Environment variables set

3. **Test endpoints directly**
   - Use Postman or curl
   - Test `/api/auth/login` with suspended user
   - Test `/api/suspension-requests/submit`
   - Test `/api/suspension-requests/`

4. **Check database**
   - Verify SuspensionRequest collection exists
   - Verify appeals are being created
   - Verify user isActive field is being updated

---

## Quick Test Commands

### Test Login with Suspended User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suspended@example.com","password":"password123"}'
```

### Test Submit Appeal
```bash
curl -X POST http://localhost:5000/api/suspension-requests/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"reason":"I apologize for my actions and will follow the rules."}'
```

### Test Get Appeals (Admin)
```bash
curl -X GET http://localhost:5000/api/suspension-requests/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

---

**Last Updated**: 2025-10-30

