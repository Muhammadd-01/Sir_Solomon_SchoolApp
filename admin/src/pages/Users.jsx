import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState(null);

    useEffect(() => {
        fetchUsers();
        checkCurrentUserRole();
    }, []);

    const checkCurrentUserRole = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                setCurrentUserRole(userDoc.data().role);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        if (currentUserRole !== 'superadmin') {
            setError('Only Super Admin can change roles.');
            return;
        }

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update role');
            }

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error updating role:', err);
            setError(err.message || 'Failed to update user role.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading users...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            {error && (
                <Alert variant={error.includes('Only Super Admin') ? 'destructive' : 'default'}>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Current Role</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{user.displayName || user.name?.first + ' ' + user.name?.last || 'N/A'}</td>
                                        <td className="p-4 align-middle">{user.email}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={
                                                user.role === 'superadmin' ? 'default' :
                                                    user.role === 'admin' ? 'secondary' :
                                                        user.role === 'teacher' ? 'outline' : 'secondary'
                                            }>
                                                {user.role || 'user'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle gap-2 flex">
                                            {currentUserRole === 'superadmin' && user.role !== 'superadmin' && (
                                                <>
                                                    {user.role !== 'admin' && (
                                                        <Button size="sm" variant="outline" onClick={() => updateUserRole(user.id, 'admin')}>
                                                            Make Admin
                                                        </Button>
                                                    )}
                                                    {user.role !== 'teacher' && (
                                                        <Button size="sm" variant="outline" onClick={() => updateUserRole(user.id, 'teacher')}>
                                                            Make Teacher
                                                        </Button>
                                                    )}
                                                    {user.role !== 'user' && (user.role === 'admin' || user.role === 'teacher') && (
                                                        <Button size="sm" variant="ghost" onClick={() => updateUserRole(user.id, 'user')}>
                                                            Demote to User
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
