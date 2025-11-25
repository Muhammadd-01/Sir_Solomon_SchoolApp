import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class StudentDashboardScreen extends ConsumerWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // TODO: Navigate to notifications
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: Theme.of(context).primaryColor),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white,
                    child: Icon(
                      Icons.person,
                      size: 40,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Student Name',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                  const Text(
                    'Grade 10-A',
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: const Text('Dashboard'),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.schedule),
              title: const Text('Timetable'),
              onTap: () {
                // TODO: Navigate to timetable
              },
            ),
            ListTile(
              leading: const Icon(Icons.assignment),
              title: const Text('Assignments'),
              onTap: () {
                // TODO: Navigate to assignments
              },
            ),
            ListTile(
              leading: const Icon(Icons.grade),
              title: const Text('Grades'),
              onTap: () {
                // TODO: Navigate to grades
              },
            ),
            ListTile(
              leading: const Icon(Icons.announcement),
              title: const Text('Announcements'),
              onTap: () {
                // TODO: Navigate to announcements
              },
            ),
            ListTile(
              leading: const Icon(Icons.payment),
              title: const Text('Fees'),
              onTap: () {
                // TODO: Navigate to fees
              },
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Profile'),
              onTap: () {
                // TODO: Navigate to profile
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () async {
                // TODO: Implement logout
              },
            ),
          ],
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // TODO: Refresh data
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Welcome Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome back!',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Here\'s what\'s happening today',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Quick Stats
            Row(
              children: [
                Expanded(
                  child: _StatCard(
                    icon: Icons.assignment,
                    title: 'Assignments',
                    value: '5',
                    subtitle: 'Pending',
                    color: Colors.orange,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _StatCard(
                    icon: Icons.check_circle,
                    title: 'Attendance',
                    value: '95%',
                    subtitle: 'This month',
                    color: Colors.green,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Today's Classes
            Text(
              'Today\'s Classes',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            _ClassCard(
              subject: 'Mathematics',
              time: '09:00 - 09:40',
              teacher: 'Mr. Ahmed',
              room: 'Room 101',
            ),
            _ClassCard(
              subject: 'English',
              time: '09:45 - 10:25',
              teacher: 'Ms. Sarah',
              room: 'Room 205',
            ),
            const SizedBox(height: 16),

            // Recent Announcements
            Text(
              'Recent Announcements',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            _AnnouncementCard(
              title: 'Sports Day',
              content: 'Annual sports day will be held on Friday...',
              date: 'Today',
              type: 'event',
            ),
            _AnnouncementCard(
              title: 'Exam Schedule',
              content: 'Mid-term exams will start from next week...',
              date: 'Yesterday',
              type: 'exam',
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(value, style: Theme.of(context).textTheme.headlineMedium),
            Text(title, style: Theme.of(context).textTheme.bodySmall),
            Text(
              subtitle,
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}

class _ClassCard extends StatelessWidget {
  final String subject;
  final String time;
  final String teacher;
  final String room;

  const _ClassCard({
    required this.subject,
    required this.time,
    required this.teacher,
    required this.room,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
          child: Icon(Icons.book, color: Theme.of(context).primaryColor),
        ),
        title: Text(subject),
        subtitle: Text('$time • $teacher • $room'),
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}

class _AnnouncementCard extends StatelessWidget {
  final String title;
  final String content;
  final String date;
  final String type;

  const _AnnouncementCard({
    required this.title,
    required this.content,
    required this.date,
    required this.type,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getTypeColor(type).withOpacity(0.1),
          child: Icon(Icons.announcement, color: _getTypeColor(type)),
        ),
        title: Text(title),
        subtitle: Text(content, maxLines: 2, overflow: TextOverflow.ellipsis),
        trailing: Text(date, style: Theme.of(context).textTheme.bodySmall),
      ),
    );
  }

  Color _getTypeColor(String type) {
    switch (type) {
      case 'urgent':
        return Colors.red;
      case 'event':
        return Colors.blue;
      case 'exam':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }
}
