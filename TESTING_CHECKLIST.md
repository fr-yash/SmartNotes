# ✅ Testing Checklist - Suspension Appeal System

## Pre-Test Setup
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173 (or configured port)
- [ ] MongoDB connected
- [ ] Have at least 1 admin user and 1 regular user

---

## Test 1: Suspension Enforcement ✅

### Step 1: Suspend a User
- [ ] Login as admin
- [ ] Go to Admin Dashboard → Users tab
- [ ] Find a regular user
- [ ] Click "Suspend" button
- [ ] Verify user status changes to "Suspended"

### Step 2: Verify Login is Blocked
- [ ] Logout
- [ ] Try to login with suspended user credentials
- [ ] Verify error message: "Your account has been suspended. Please contact support."
- [ ] Verify you're redirected to `/suspended` page

### Step 3: Verify Token is Provided
- [ ] Open browser DevTools → Console
- [ ] Check localStorage
- [ ] Verify `token` is stored in localStorage
- [ ] Verify `user` is stored in localStorage
- [ ] **No "No token provided" error should appear**

---

## Test 2: Submit Appeal ✅

### Step 1: Access Appeal Page
- [ ] You should be on `/suspended` page
- [ ] See "Account Suspended" header
- [ ] See "Submit an Appeal" form
- [ ] See "Logout" button

### Step 2: Submit Appeal with Valid Reason
- [ ] Click on textarea
- [ ] Type reason (at least 10 characters)
- [ ] Example: "I apologize for my actions. I will follow the rules going forward."
- [ ] Click "Submit Appeal" button
- [ ] Verify success message: "Appeal submitted successfully! An admin will review it soon."
- [ ] Verify textarea is cleared

### Step 3: View Appeal History
- [ ] Scroll down to "Your Appeal History"
- [ ] See your submitted appeal
- [ ] Verify status badge shows "Pending" (yellow)
- [ ] Verify submission date is shown
- [ ] Verify your reason is displayed

### Step 4: Test Validation
- [ ] Try to submit with less than 10 characters
- [ ] Verify error: "Reason must be at least 10 characters"
- [ ] Try to submit empty reason
- [ ] Verify error: "Please provide a reason for your appeal"

---

## Test 3: Admin Reviews Appeals ✅

### Step 1: Login as Admin
- [ ] Logout from suspended user
- [ ] Login as admin
- [ ] Go to Admin Dashboard

### Step 2: Navigate to Appeals Tab
- [ ] Click "Appeals" tab
- [ ] Verify tab is highlighted
- [ ] Wait for appeals to load

### Step 3: Verify Appeal Appears
- [ ] See the appeal you submitted
- [ ] Verify user name is shown
- [ ] Verify user email is shown
- [ ] Verify appeal reason is shown
- [ ] Verify status badge shows "Pending" (yellow)
- [ ] Verify submission date is shown

### Step 4: Test Approve Flow
- [ ] Click in the response textarea
- [ ] Type admin response: "Your appeal has been approved. Welcome back!"
- [ ] Click "Approve & Reactivate" button
- [ ] Verify success message appears
- [ ] Verify appeal status changes to "Approved" (green)
- [ ] Verify admin response is displayed

### Step 5: Verify User is Reactivated
- [ ] Logout as admin
- [ ] Try to login with previously suspended user
- [ ] Verify login succeeds
- [ ] Verify you're redirected to dashboard
- [ ] Verify you can access all features

---

## Test 4: Rejection Flow ✅

### Step 1: Suspend Another User
- [ ] Login as admin
- [ ] Go to Users tab
- [ ] Suspend a different user
- [ ] Logout

### Step 2: Submit Appeal as Suspended User
- [ ] Login with new suspended user
- [ ] Submit appeal with reason
- [ ] Verify appeal appears in history

### Step 3: Admin Rejects Appeal
- [ ] Login as admin
- [ ] Go to Appeals tab
- [ ] Find the new pending appeal
- [ ] Click in response textarea
- [ ] Type rejection reason: "Your appeal has been rejected. Please contact support for more information."
- [ ] Click "Reject" button
- [ ] Verify appeal status changes to "Rejected" (red)

### Step 4: Verify User Sees Rejection
- [ ] Logout as admin
- [ ] Try to login with rejected user
- [ ] Verify you're redirected to `/suspended`
- [ ] Scroll to appeal history
- [ ] Verify appeal shows "Rejected" status
- [ ] Verify admin's rejection reason is displayed

### Step 5: Test New Appeal After Rejection
- [ ] Submit a new appeal with different reason
- [ ] Verify new appeal appears in history with "Pending" status
- [ ] Verify old rejected appeal is still visible

---

## Test 5: Multiple Appeals ✅

### Step 1: Test Pending Appeal Limit
- [ ] Submit an appeal
- [ ] Try to submit another appeal immediately
- [ ] Verify error: "You already have a pending appeal request. Please wait for admin response."

### Step 2: Test Multiple Users
- [ ] Suspend 3 different users
- [ ] Each submits an appeal
- [ ] Login as admin
- [ ] Go to Appeals tab
- [ ] Verify all 3 appeals appear
- [ ] Verify each shows correct user info

---

## Test 6: Edge Cases ✅

### Test 6.1: Active User Cannot Submit Appeal
- [ ] Login as regular active user
- [ ] Try to access `/suspended` directly
- [ ] Verify you're redirected to dashboard (or see error)

### Test 6.2: Appeal History Persistence
- [ ] Submit appeal
- [ ] Refresh page
- [ ] Verify appeal history still shows
- [ ] Verify data persists

### Test 6.3: Admin Cannot Submit Appeal
- [ ] Login as admin
- [ ] Try to access `/suspended` directly
- [ ] Verify appropriate behavior (redirect or error)

### Test 6.4: Token Expiration
- [ ] Submit appeal
- [ ] Wait for token to expire (or manually expire in localStorage)
- [ ] Try to submit another appeal
- [ ] Verify appropriate error handling

---

## Test 7: UI/UX ✅

### Step 1: Verify Styling
- [ ] Appeal page has proper styling
- [ ] Status badges are color-coded:
  - [ ] Pending = Yellow
  - [ ] Approved = Green
  - [ ] Rejected = Red
- [ ] Buttons are properly styled
- [ ] Form is responsive on mobile

### Step 2: Verify Messages
- [ ] All success messages are clear
- [ ] All error messages are helpful
- [ ] Timestamps are formatted correctly
- [ ] Admin responses are clearly displayed

### Step 3: Verify Loading States
- [ ] Loading spinner appears while fetching appeals
- [ ] Submit button shows "Submitting..." while processing
- [ ] No duplicate submissions possible

---

## Test 8: Browser Console ✅

### Step 1: Check for Errors
- [ ] Open DevTools → Console
- [ ] Submit appeal
- [ ] Verify NO errors appear
- [ ] Verify NO "No token provided" messages
- [ ] Verify NO 401 Unauthorized errors

### Step 2: Check Network Tab
- [ ] Open DevTools → Network
- [ ] Submit appeal
- [ ] Verify POST request to `/api/suspension-requests/submit`
- [ ] Verify response status is 201 (Created)
- [ ] Verify response includes success message

### Step 3: Check Storage
- [ ] Open DevTools → Application → Local Storage
- [ ] Verify `token` is stored
- [ ] Verify `user` is stored
- [ ] Verify `suspendedEmail` is stored

---

## Final Verification ✅

- [ ] All tests passed
- [ ] No console errors
- [ ] No network errors
- [ ] Appeals appear on admin dashboard
- [ ] Approve/reject functionality works
- [ ] User reactivation works
- [ ] System is production-ready

---

## Notes

If any test fails:
1. Check browser console for errors
2. Check network tab for failed requests
3. Check backend logs for server errors
4. Verify token is in localStorage
5. Verify backend is running
6. Verify MongoDB is connected

---

**Status**: Ready for Testing ✅

