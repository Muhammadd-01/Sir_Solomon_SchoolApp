import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Sample student data
    final student = {
      'studentId': 'STU001',
      'firstName': 'Ahmed',
      'lastName': 'Khan',
      'class': 'Grade 10',
      'section': 'A',
      'email': 'ahmed.khan@student.solomon.school',
      'phone': '+92-300-1234567',
      'bloodGroup': 'O+',
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Navigate to edit profile
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Picture
            CircleAvatar(
              radius: 60,
              backgroundColor: Theme.of(context).primaryColor,
              child: Text(
                '${student['firstName']![0]}${student['lastName']![0]}',
                style: const TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              '${student['firstName']} ${student['lastName']}',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            Text(
              student['studentId'] as String,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
            const SizedBox(height: 8),
            Chip(
              label:
                  Text('${student['class']} - Section ${student['section']}'),
            ),
            const SizedBox(height: 24),

            // Information Cards
            _InfoCard(
              title: 'Contact Information',
              items: [
                _InfoItem(
                  icon: Icons.email,
                  label: 'Email',
                  value: student['email'] as String,
                ),
                _InfoItem(
                  icon: Icons.phone,
                  label: 'Phone',
                  value: student['phone'] as String,
                ),
              ],
            ),
            const SizedBox(height: 16),
            _InfoCard(
              title: 'Medical Information',
              items: [
                _InfoItem(
                  icon: Icons.bloodtype,
                  label: 'Blood Group',
                  value: student['bloodGroup'] as String,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final String title;
  final List<Widget> items;

  const _InfoCard({
    required this.title,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            ...items,
          ],
        ),
      ),
    );
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                      ),
                ),
                Text(
                  value,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
