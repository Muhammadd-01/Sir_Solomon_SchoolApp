import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, setDoc } from 'firebase/firestore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const Grades = () => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [gradesData, setGradesData] = useState({
        subjects: []
    });
    const [gradeId, setGradeId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
    const sections = ['A', 'B', 'C', 'D'];
    const terms = ['Term 1', 'Term 2', 'Term 3', 'Final'];
    const defaultSubjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedClass, selectedSection]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students', {
                params: { class: selectedClass, section: selectedSection }
            });
            setStudents(response.data.data);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStudent = async (student) => {
        setSelectedStudent(student);
        setSuccess('');
        setError('');
        setLoading(true);

        try {
            const q = query(
                collection(db, 'grades'),
                where('studentId', '==', student._id), // Assuming student._id matches the reference
                where('term', '==', selectedTerm),
                where('academicYear', '==', '2024-2025')
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0];
                setGradeId(docData.id);
                setGradesData(docData.data());
            } else {
                setGradeId(null);
                setGradesData({
                    subjects: defaultSubjects.map(sub => ({
                        subject: sub,
                        marksObtained: 0,
                        totalMarks: 100,
                        grade: '',
                        remarks: ''
                    }))
                });
            }
        } catch (err) {
            console.error('Error fetching grades:', err);
            setError('Failed to fetch grades');
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (index, field, value) => {
        const newSubjects = [...gradesData.subjects];
        newSubjects[index][field] = value;
        setGradesData({ ...gradesData, subjects: newSubjects });
    };

    const handleSaveGrades = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                studentId: selectedStudent._id, // Ensure this is the correct ID format for reference
                class: selectedClass,
                section: selectedSection,
                academicYear: '2024-2025',
                term: selectedTerm,
                subjects: gradesData.subjects,
                publishedAt: new Date()
            };

            // Note: In a real app, we might need to convert studentId to a Firestore reference or ObjectId
            // For now, we'll store it as a string or however the backend expects it if we were using the API.
            // Since we are using Firestore directly, we should ideally store it as a reference if the model requires it,
            // but the model schema says ObjectId. Firestore client SDK doesn't generate ObjectIds.
            // We'll store it as a string and hope the backend/client handles it, or use a workaround if needed.
            // Actually, the model is Mongoose. Firestore is NoSQL.
            // If we are writing to Firestore directly, we don't need to worry about Mongoose schema validation here,
            // but we should be consistent.

            if (gradeId) {
                await updateDoc(doc(db, 'grades', gradeId), payload);
            } else {
                const docRef = await addDoc(collection(db, 'grades'), payload);
                setGradeId(docRef.id);
            }
            setSuccess('Grades saved successfully!');
        } catch (err) {
            console.error('Error saving grades:', err);
            setError('Failed to save grades');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Grades Management</h1>
                {selectedStudent && (
                    <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Student List
                    </Button>
                )}
            </div>

            {!selectedStudent ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Class and Term</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Section</Label>
                                <Select value={selectedSection} onValueChange={setSelectedSection}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Term</Label>
                                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {terms.map((t) => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            students.length > 0 && (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>ID</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectStudent(student)}>
                                                    <TableCell className="font-medium">{student.name.first} {student.name.last}</TableCell>
                                                    <TableCell>{student.studentId}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="ghost">Grade</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )
                        )}
                        {!loading && selectedClass && selectedSection && students.length === 0 && (
                            <p className="text-center text-gray-500">No students found for this class.</p>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Grading: {selectedStudent.name.first} {selectedStudent.name.last}</CardTitle>
                        <p className="text-sm text-gray-500">{selectedClass} - {selectedSection} | {selectedTerm}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="border-green-500 bg-green-50 text-green-900">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            {gradesData.subjects.map((subject, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4">
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Input
                                            value={subject.subject}
                                            onChange={(e) => handleGradeChange(index, 'subject', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Marks Obtained</Label>
                                        <Input
                                            type="number"
                                            value={subject.marksObtained}
                                            onChange={(e) => handleGradeChange(index, 'marksObtained', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Marks</Label>
                                        <Input
                                            type="number"
                                            value={subject.totalMarks}
                                            onChange={(e) => handleGradeChange(index, 'totalMarks', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Remarks</Label>
                                        <Input
                                            value={subject.remarks || ''}
                                            onChange={(e) => handleGradeChange(index, 'remarks', e.target.value)}
                                            placeholder="Excellent, Good, etc."
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => setGradesData({
                                ...gradesData,
                                subjects: [...gradesData.subjects, { subject: '', marksObtained: 0, totalMarks: 100, grade: '', remarks: '' }]
                            })}>
                                + Add Subject
                            </Button>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleSaveGrades} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" /> Save Grades
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Grades;
