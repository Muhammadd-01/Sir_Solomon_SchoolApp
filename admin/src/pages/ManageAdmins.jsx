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

export default function ManageAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', displayName: '' });
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

            fetchAdmins();
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchAdmins = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'admin'));
            const querySnapshot = await getDocs(q);
            const adminList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAdmins(adminList);
        } catch (err) {
            console.error('Error fetching admins:', err);
            setError('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = await auth.currentUser.getIdToken();
            await axios.post(
                `${API_URL}/users/admin`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('Admin created successfully!');
            setFormData({ email: '', password: '', displayName: '' });
            setDialogOpen(false);
            fetchAdmins();
        } catch (err) {
            console.error('Error creating admin:', err);
            setError(err.response?.data?.error || 'Failed to create admin');
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
                            <h1 className="text-3xl font-bold">Manage Admins</h1>
                            <p className="text-muted-foreground">Create and manage admin accounts</p>
                        </div>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Admin</DialogTitle>
                                <DialogDescription>
                                    Add a new admin user to the system
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateAdmin}>
                                <div className="space-y-4 py-4">
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
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Admin</Button>
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
                        <CardTitle>Admin Users</CardTitle>
                        <CardDescription>Total: {admins.length} admins</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No admins found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    admins.map((admin) => (
                                        <TableRow key={admin.id}>
                                            <TableCell className="font-medium">{admin.displayName}</TableCell>
                                            <TableCell>{admin.email}</TableCell>
                                            <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
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
