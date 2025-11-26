import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, setDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';

const Timetable = () => {
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [slots, setSlots] = useState([]);
    const [timetableId, setTimetableId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
    const sections = ['A', 'B', 'C', 'D'];

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedSection && selectedDay) {
            fetchTimetable();
        } else {
            setSlots([]);
            setTimetableId(null);
        }
    }, [selectedClass, selectedSection, selectedDay]);

    const fetchTeachers = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
            const querySnapshot = await getDocs(q);
            const teacherList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeachers(teacherList);
        } catch (err) {
            console.error('Error fetching teachers:', err);
            setError('Failed to fetch teachers');
        }
    };

    const fetchTimetable = async () => {
        setLoading(true);
        setError('');
        try {
            const q = query(
                collection(db, 'timetables'),
                where('class', '==', selectedClass),
                where('section', '==', selectedSection),
                where('day', '==', selectedDay)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0];
                setTimetableId(docData.id);
                setSlots(docData.data().slots || []);
            } else {
                setTimetableId(null);
                setSlots([]);
            }
        } catch (err) {
            console.error('Error fetching timetable:', err);
            setError('Failed to fetch timetable');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = () => {
        setSlots([...slots, { startTime: '', endTime: '', subject: '', teacherId: '', room: '' }]);
    };

    const handleSlotChange = (index, field, value) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const handleRemoveSlot = (index) => {
        const newSlots = slots.filter((_, i) => i !== index);
        setSlots(newSlots);
    };

    const handleSave = async () => {
        if (!selectedClass || !selectedSection) {
            setError('Please select Class and Section');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const timetableData = {
                class: selectedClass,
                section: selectedSection,
                day: selectedDay,
                academicYear: '2024-2025', // Hardcoded for now, could be dynamic
                slots: slots,
                active: true
            };

            if (timetableId) {
                await updateDoc(doc(db, 'timetables', timetableId), timetableData);
            } else {
                const docRef = await addDoc(collection(db, 'timetables'), timetableData);
                setTimetableId(docRef.id);
            }
            setSuccess('Timetable saved successfully!');
        } catch (err) {
            console.error('Error saving timetable:', err);
            setError('Failed to save timetable');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            <Label>Day</Label>
                            <Select value={selectedDay} onValueChange={setSelectedDay}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {days.map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

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

            {(selectedClass && selectedSection) && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Slots for {selectedDay}</CardTitle>
                        <Button onClick={handleAddSlot} size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Slot
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {slots.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4">No slots added yet.</p>
                                ) : (
                                    slots.map((slot, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border p-4 rounded-lg bg-slate-50">
                                            <div className="space-y-2">
                                                <Label>Start Time</Label>
                                                <Input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Time</Label>
                                                <Input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Subject</Label>
                                                <Input
                                                    value={slot.subject}
                                                    onChange={(e) => handleSlotChange(index, 'subject', e.target.value)}
                                                    placeholder="Subject Name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Teacher</Label>
                                                <Select
                                                    value={slot.teacherId}
                                                    onValueChange={(value) => handleSlotChange(index, 'teacherId', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Teacher" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {teachers.map((t) => (
                                                            <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveSlot(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                                <div className="flex justify-end mt-4">
                                    <Button onClick={handleSave} disabled={loading}>
                                        <Save className="w-4 h-4 mr-2" /> Save Timetable
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Timetable;
