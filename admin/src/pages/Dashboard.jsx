import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
    Users,
    GraduationCap,
    UserPlus,
    Settings,
    LogOut,
    Menu,
    BarChart3,
    Calendar,
    DollarSign
} from 'lucide-react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
                return;
            }

            try {
                // Fetch user role from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserRole(userData.role);
                    setUser({ ...firebaseUser, ...userData });
                } else {
                    console.error('User document not found');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await auth.signOut();
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const stats = [
        { title: 'Total Students', value: '1,234', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Total Teachers', value: '56', icon: GraduationCap, color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Attendance Rate', value: '94%', icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { title: 'Revenue (Month)', value: '$45,230', icon: DollarSign, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="text-2xl font-bold text-primary">Solomon's School</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Calendar className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar>
                                        <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                                        <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.displayName || 'Admin'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                        <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                                            Role: {userRole}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.displayName || 'Admin'}! Here's what's happening today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                {userRole === 'super-admin' && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Super Admin Actions</CardTitle>
                            <CardDescription>Manage system users and settings</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <Button onClick={() => navigate('/manage-admins')} className="h-24 flex flex-col items-center justify-center space-y-2">
                                <UserPlus className="h-8 w-8" />
                                <span>Manage Admins</span>
                            </Button>
                            <Button onClick={() => navigate('/manage-teachers')} className="h-24 flex flex-col items-center justify-center space-y-2">
                                <GraduationCap className="h-8 w-8" />
                                <span>Manage Teachers</span>
                            </Button>
                            <Button onClick={() => navigate('/settings')} variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                                <Settings className="h-8 w-8" />
                                <span>System Settings</span>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates from your school</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <Avatar>
                                        <AvatarFallback>ST</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">New student registered</p>
                                        <p className="text-xs text-muted-foreground">John Doe joined Grade 10-A</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">2h ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
