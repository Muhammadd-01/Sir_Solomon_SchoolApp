const { auth, db } = require('../config/firebase');

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

        // Also create a student profile in 'students' collection if needed for easier querying
        // But per requirements, we keep it simple. We can query users where role == 'student'

        res.status(201).json({ message: 'Student created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: error.message });
    }
};
