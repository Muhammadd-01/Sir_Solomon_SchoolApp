# Superadmin Credentials

**Email:** admin@solomon.school  
**Password:** Admin@123456

**Role:** superadmin

---

## Setup Instructions

1. Create Firebase account with this email
2. Set password to: `Admin@123456`
3. In Firebase Console, go to Authentication
4. Manually add this user or use the sign-up flow
5. After creating the user, run the backend to set custom claims:

```javascript
// In Firebase Admin SDK or backend
admin.auth().setCustomUserClaims(uid, { role: 'superadmin' });
```

Or use the seed script which will create the user in MongoDB.

---

## Alternative Test Credentials

**Teacher Account:**
- Email: teacher@solomon.school
- Password: Teacher@123456
- Role: teacher

**Accountant Account:**
- Email: accountant@solomon.school  
- Password: Accountant@123456
- Role: accountant

---

## Important Notes

⚠️ **Change these passwords in production!**

These are development credentials only. In production:
1. Use strong, unique passwords
2. Enable 2FA
3. Rotate credentials regularly
4. Use environment-specific accounts
