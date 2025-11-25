import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TeacherDashboardScreen extends ConsumerWidget {
  const TeacherDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Teacher Dashboard'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications), onPressed: () {}),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: Theme.of(context).primaryColor),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, size: 40),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Teacher Name',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                  Text(
                    'Mathematics',
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
              leading: const Icon(Icons.qr_code_scanner),
              title: const Text('Take Attendance'),
              onTap: () {
                Navigator.pop(context);
                // TODO: Navigate to scanner
              },
            ),
            ListTile(
              leading: const Icon(Icons.assignment),
              title: const Text('Assignments'),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.grade),
              title: const Text('Grades'),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.schedule),
              title: const Text('My Timetable'),
              onTap: () {},
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () {},
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Quick Actions
          Text('Quick Actions', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _ActionCard(
                  icon: Icons.qr_code_scanner,
                  title: 'Take Attendance',
                  color: Colors.green,
                  onTap: () {
                    // TODO: Navigate to scanner
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ActionCard(
                  icon: Icons.assignment_add,
                  title: 'Create Assignment',
                  color: Colors.blue,
                  onTap: () {},
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _ActionCard(
                  icon: Icons.announcement,
                  title: 'Post Announcement',
                  color: Colors.orange,
                  onTap: () {},
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ActionCard(
                  icon: Icons.grade,
                  title: 'Submit Grades',
                  color: Colors.purple,
                  onTap: () {},
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Today's Classes
          Text(
            'Today\'s Classes',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          const _ClassCard(
            className: 'Grade 10-A',
            subject: 'Mathematics',
            time: '09:00 - 09:40',
            room: 'Room 101',
            attendanceTaken: true,
          ),
          const _ClassCard(
            className: 'Grade 10-B',
            subject: 'Mathematics',
            time: '09:45 - 10:25',
            room: 'Room 101',
            attendanceTaken: false,
          ),
          const _ClassCard(
            className: 'Grade 9-A',
            subject: 'Mathematics',
            time: '11:00 - 11:40',
            room: 'Room 101',
            attendanceTaken: false,
          ),
          const SizedBox(height: 24),

          // Pending Tasks
          Text('Pending Tasks', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          const _TaskCard(
            title: 'Grade Assignment: Algebra Quiz',
            subtitle: '25 submissions pending',
            icon: Icons.grade,
          ),
          const _TaskCard(
            title: 'Review Leave Requests',
            subtitle: '3 requests pending',
            icon: Icons.approval,
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.title,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Icon(icon, size: 40, color: color),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ClassCard extends StatelessWidget {
  final String className;
  final String subject;
  final String time;
  final String room;
  final bool attendanceTaken;

  const _ClassCard({
    required this.className,
    required this.subject,
    required this.time,
    required this.room,
    required this.attendanceTaken,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
          child: Icon(Icons.class_, color: Theme.of(context).primaryColor),
        ),
        title: Text('$className - $subject'),
        subtitle: Text('$time • $room'),
        trailing: attendanceTaken
            ? const Chip(
                label: Text('Done', style: TextStyle(fontSize: 12)),
                backgroundColor: Colors.green,
                labelStyle: TextStyle(color: Colors.white),
              )
            : TextButton(
                onPressed: () {},
                child: const Text('Take Attendance'),
              ),
      ),
    );
  }
}

class _TaskCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;

  const _TaskCard({
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.orange.withOpacity(0.1),
          child: Icon(icon, color: Colors.orange),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}
