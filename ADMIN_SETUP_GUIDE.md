# 🔐 Admin Dashboard Setup Guide

## ✅ What Has Been Done

1. ✅ Admin Dashboard page created (`frontend/src/pages/AdminDashboard.jsx`)
2. ✅ Admin API routes created (`backend/src/routes/adminRoutes.js`)
3. ✅ Admin controller with all functions created (`backend/src/controllers/adminController.js`)
4. ✅ Admin middleware for RBAC created (`backend/src/middleware/adminMiddleware.js`)
5. ✅ User model updated with role field
6. ✅ All existing users migrated with role field
7. ✅ Your user (yash@gmail.com) promoted to admin role
8. ✅ Auth controller updated to return role field in login/signup responses
9. ✅ Navbar updated to show Admin link for admin users
10. ✅ App routes updated with /admin route

## 🚀 Steps to Access Admin Dashboard

### Step 1: Log Out
1. Go to http://localhost:5173/dashboard
2. Click the **Logout** button (🚪) in the navbar
3. You should be redirected to the login page

### Step 2: Log Back In
1. On the login page, enter your credentials:
   - **Email**: yash@gmail.com
   - **Password**: (your password)
2. Click **Login**
3. You should be redirected to the dashboard

### Step 3: Verify Role is Loaded
1. After logging in, check the navbar
2. You should now see an **⚙️ Admin** link in the navbar (between "Upload PDF" and your name)
3. If you don't see it, the role field wasn't loaded. Try refreshing the page (Ctrl+R)

### Step 4: Access Admin Dashboard
1. Click the **⚙️ Admin** link in the navbar
2. You should see the Admin Dashboard with three tabs:
   - **Analytics**: View statistics (total users, active users, AI requests, etc.)
   - **Users**: Manage all users (suspend, promote, delete)
   - **Templates**: View featured note templates

## 📊 Admin Dashboard Features

### Analytics Tab
- **Total Users**: Count of all users in the system
- **Active Users**: Count of users with active status
- **Suspended Users**: Count of suspended users
- **Admin Users**: Count of admin users
- **Total Notes**: Count of all notes created
- **AI Requests Today**: Count of AI API requests made today
- **Average Notes Per User**: Average notes per user

### Users Tab
- **View All Users**: Table showing all users with their details
- **Columns**: Name, Email, Role, Status, AI Limit, Actions
- **Actions**:
  - **Suspend/Activate**: Toggle user account status
  - **Promote/Demote**: Change user role between admin and regular user
  - **Delete**: Remove user and their notes

### Templates Tab
- **Featured Templates**: View pre-made note templates
- **Categories**: Science, History, Mathematics, Literature
- **Use Cases**: Templates can be used as starting points for new notes

## 🔧 Troubleshooting

### Issue: Admin link doesn't appear in navbar
**Solution:**
1. Make sure you logged out and logged back in
2. Check browser console (F12) for errors
3. Verify the role field is being returned from the login API
4. Try refreshing the page (Ctrl+R)

### Issue: Getting "Access denied" error when accessing /admin
**Solution:**
1. Make sure your user role is set to 'admin' in MongoDB
2. Run the promotion script again:
   ```bash
   cd backend
   node scripts/promoteToAdmin.js yash@gmail.com
   ```
3. Log out and log back in

### Issue: Admin dashboard shows errors
**Solution:**
1. Check browser console (F12) for error messages
2. Check backend console (Terminal 8) for API errors
3. Make sure MongoDB is connected
4. Verify all admin routes are properly registered

## 📝 Useful Commands

### Promote a user to admin
```bash
cd backend
node scripts/promoteToAdmin.js <email>
```

Example:
```bash
node scripts/promoteToAdmin.js test@gmail.com
```

### View all users and their roles
```bash
cd backend
node scripts/migrateUsers.js
```

## 🎯 Next Steps

1. ✅ Log out and log back in
2. ✅ Verify the Admin link appears in navbar
3. ✅ Click the Admin link to access the dashboard
4. ✅ Test the analytics, users, and templates tabs
5. ✅ Try managing users (suspend, promote, delete)

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Check the backend console for API errors
3. Make sure both frontend and backend servers are running
4. Try refreshing the page or restarting the servers

---

**Note**: The admin dashboard is now fully implemented and ready to use. Just log out and log back in to see the Admin link in the navbar!

