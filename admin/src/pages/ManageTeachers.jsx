import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ManageTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        subjects: '',
        classes: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }

            // Check if user is super-admin
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists() || userDoc.data().role !== 'super-admin') {
                navigate('/dashboard');
                return;
            }

            fetchTeachers();
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchTeachers = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
            const querySnapshot = await getDocs(q);
            const teacherList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeachers(teacherList);
        } catch (err) {
            console.error('Error fetching teachers:', err);
            setError('Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = await auth.currentUser.getIdToken();
            const payload = {
                ...formData,
                subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
                classes: formData.classes.split(',').map(c => c.trim()).filter(Boolean),
            };

            await axios.post(
                `${API_URL}/users/teacher`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('Teacher created successfully!');
            setFormData({ email: '', password: '', displayName: '', subjects: '', classes: '' });
            setDialogOpen(false);
            fetchTeachers();
        } catch (err) {
            console.error('Error creating teacher:', err);
            setError(err.response?.data?.error || 'Failed to create teacher');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Manage Teachers</h1>
                            <p className="text-muted-foreground">Create and manage teacher accounts</p>
                        </div>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Teacher
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Teacher</DialogTitle>
                                <DialogDescription>
                                    Add a new teacher user to the system
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTeacher}>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Full Name</Label>
                                            <Input
                                                id="displayName"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                                        <Input
                                            id="subjects"
                                            placeholder="Mathematics, Physics, Chemistry"
                                            value={formData.subjects}
                                            onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="classes">Classes (comma-separated)</Label>
                                        <Input
                                            id="classes"
                                            placeholder="Grade 10-A, Grade 10-B"
                                            value={formData.classes}
                                            onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Teacher</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-4 border-green-500 bg-green-50 text-green-900">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Teacher Users</CardTitle>
                        <CardDescription>Total: {teachers.length} teachers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead>Classes</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No teachers found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    teachers.map((teacher) => (
                                        <TableRow key={teacher.id}>
                                            <TableCell className="font-medium">{teacher.displayName}</TableCell>
                                            <TableCell>{teacher.email}</TableCell>
                                            <TableCell>{teacher.subjects?.join(', ') || 'N/A'}</TableCell>
                                            <TableCell>{teacher.classes?.join(', ') || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
