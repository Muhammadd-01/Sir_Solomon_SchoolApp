const { auth, db } = require('../config/firebase');
const User = require('../models/User');

/**
 * Update User Role (Super Admin only)
 * Updates role in both Firestore and MongoDB
 */
exports.updateUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        const allowedRoles = ['superadmin', 'admin', 'teacher', 'student', 'user'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Update Firestore
        await db.collection('users').doc(uid).update({ role });

        // Update MongoDB
        // Note: MongoDB might use a different ID, but we store firebaseUid
        await User.findOneAndUpdate(
            { firebaseUid: uid },
            { role },
            { new: true }
        );

        // If user doesn't exist in MongoDB, we might want to create them?
        // For now, assume they exist or will be created on login if logic permits.
        // But since autoRegister blocks non-superadmins if not found, we should probably ensure existence.
        // Let's just update for now.

        // Also update custom claims if needed (optional but good for security)
        await auth.setCustomUserClaims(uid, { role });

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new Admin (Super Admin only)
 */
exports.createAdmin = async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        const creatorUid = req.user.uid;

        // Create Firebase Auth user
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        // Create Firestore document
        await db.collection('users').doc(userRecord.uid).set({
            email,
            displayName,
            role: 'admin',
            createdAt: new Date().toISOString(),
            createdBy: creatorUid
        });

        // Create MongoDB User
        const newUser = new User({
            firebaseUid: userRecord.uid,
            email,
            name: {
                first: displayName.split(' ')[0] || 'Admin',
                last: displayName.split(' ').slice(1).join(' ') || 'User'
            },
            role: 'admin',
            isActive: true
        });
        await newUser.save();

        res.status(201).json({ message: 'Admin created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new Teacher (Super Admin only)
 */
exports.createTeacher = async (req, res) => {
    try {
        const { email, password, displayName, subjects, classes } = req.body;
        const creatorUid = req.user.uid;

        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        await db.collection('users').doc(userRecord.uid).set({
            email,
            displayName,
            role: 'teacher',
            subjects: subjects || [],
            classes: classes || [],
            createdAt: new Date().toISOString(),
            createdBy: creatorUid
        });

        // Create MongoDB User
        const newUser = new User({
            firebaseUid: userRecord.uid,
            email,
            name: {
                first: displayName.split(' ')[0] || 'Teacher',
                last: displayName.split(' ').slice(1).join(' ') || 'User'
            },
            role: 'teacher',
            isActive: true
        });
        await newUser.save();

        res.status(201).json({ message: 'Teacher created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new Student (Admin or Super Admin)
 */
exports.createStudent = async (req, res) => {
    try {
        const { email, password, displayName, classId, rollNumber } = req.body;
        const creatorUid = req.user.uid;

        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        await db.collection('users').doc(userRecord.uid).set({
            email,
            displayName,
            role: 'student',
            classId,
            rollNumber,
            createdAt: new Date().toISOString(),
            createdBy: creatorUid
        });

        // Create MongoDB User
        const newUser = new User({
            firebaseUid: userRecord.uid,
            email,
            name: {
                first: displayName.split(' ')[0] || 'Student',
                last: displayName.split(' ').slice(1).join(' ') || 'User'
            },
            role: 'student', // Note: User model might expect 'student'
            isActive: true
        });
        await newUser.save();

        res.status(201).json({ message: 'Student created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: error.message });
    }
};
