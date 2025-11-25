const mongoose = require('mongoose');
const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');
const User = require('../src/models/User');
require('dotenv').config();

const sampleStudents = [
    {
        studentId: 'STU001',
        name: { first: 'Ahmed', last: 'Khan' },
        dob: new Date('2008-05-15'),
        gender: 'male',
        class: 'Grade 10',
        section: 'A',
        guardians: [
            { name: 'Muhammad Khan', relation: 'father', phone: '+92-300-1234567', email: 'mkhan@email.com' }
        ],
        medical: { allergies: [], notes: 'None' },
        status: 'active',
        admissionDate: new Date('2020-04-01')
    },
    {
        studentId: 'STU002',
        name: { first: 'Fatima', last: 'Ali' },
        dob: new Date('2008-08-22'),
        gender: 'female',
        class: 'Grade 10',
        section: 'A',
        guardians: [
            { name: 'Ali Hassan', relation: 'father', phone: '+92-300-2345678', email: 'ahassan@email.com' }
        ],
        medical: { allergies: ['Peanuts'], notes: 'Asthma' },
        status: 'active',
        admissionDate: new Date('2020-04-01')
    },
    {
        studentId: 'STU003',
        name: { first: 'Usman', last: 'Sheikh' },
        dob: new Date('2008-03-10'),
        gender: 'male',
        class: 'Grade 10',
        section: 'B',
        guardians: [
            { name: 'Sheikh Abdullah', relation: 'father', phone: '+92-300-3456789', email: 'sabdullah@email.com' }
        ],
        medical: { allergies: [], notes: 'None' },
        status: 'active',
        admissionDate: new Date('2020-04-01')
    },
    {
        studentId: 'STU004',
        name: { first: 'Ayesha', last: 'Malik' },
        dob: new Date('2009-11-05'),
        gender: 'female',
        class: 'Grade 9',
        section: 'A',
        guardians: [
            { name: 'Malik Tariq', relation: 'father', phone: '+92-300-4567890', email: 'mtariq@email.com' }
        ],
        medical: { allergies: [], notes: 'None' },
        status: 'active',
        admissionDate: new Date('2021-04-01')
    },
    {
        studentId: 'STU005',
        name: { first: 'Hassan', last: 'Ahmed' },
        dob: new Date('2009-07-18'),
        gender: 'male',
        class: 'Grade 9',
        section: 'A',
        guardians: [
            { name: 'Ahmed Raza', relation: 'father', phone: '+92-300-5678901', email: 'araza@email.com' }
        ],
        medical: { allergies: [], notes: 'None' },
        status: 'active',
        admissionDate: new Date('2021-04-01')
    }
];

const sampleTeachers = [
    {
        teacherId: 'TCH001',
        name: { first: 'Muhammad', last: 'Iqbal' },
        email: 'miqbal@school.com',
        phone: '+92-300-1111111',
        subjects: ['Mathematics', 'Physics'],
        assignedClasses: [
            { class: 'Grade 10', section: 'A' },
            { class: 'Grade 10', section: 'B' }
        ],
        active: true,
        joinDate: new Date('2015-08-01')
    },
    {
        teacherId: 'TCH002',
        name: { first: 'Sarah', last: 'Khan' },
        email: 'skhan@school.com',
        phone: '+92-300-2222222',
        subjects: ['English', 'Urdu'],
        assignedClasses: [
            { class: 'Grade 9', section: 'A' },
            { class: 'Grade 10', section: 'A' }
        ],
        active: true,
        joinDate: new Date('2016-08-01')
    },
    {
        teacherId: 'TCH003',
        name: { first: 'Ali', last: 'Raza' },
        email: 'araza@school.com',
        phone: '+92-300-3333333',
        subjects: ['Chemistry', 'Biology'],
        assignedClasses: [
            { class: 'Grade 9', section: 'A' },
            { class: 'Grade 9', section: 'B' }
        ],
        active: true,
        joinDate: new Date('2017-08-01')
    }
];

const sampleUsers = [
    {
        email: 'admin@school.com',
        name: { first: 'Admin', last: 'User' },
        role: 'superadmin',
        phone: '+92-300-9999999',
        active: true
    },
    {
        email: 'teacher@school.com',
        name: { first: 'Teacher', last: 'Demo' },
        role: 'teacher',
        phone: '+92-300-8888888',
        active: true
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert sample data
        await Student.insertMany(sampleStudents);
        console.log(`✅ Inserted ${sampleStudents.length} students`);

        await Teacher.insertMany(sampleTeachers);
        console.log(`✅ Inserted ${sampleTeachers.length} teachers`);

        await User.insertMany(sampleUsers);
        console.log(`✅ Inserted ${sampleUsers.length} users`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nSample credentials:');
        console.log('Admin: admin@school.com');
        console.log('Teacher: teacher@school.com');
        console.log('\nNote: Set up Firebase accounts with these emails and link them.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
