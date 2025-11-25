import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TimetableScreen extends ConsumerWidget {
  const TimetableScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return Scaffold(
      appBar: AppBar(title: const Text('Timetable')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: days.length,
        itemBuilder: (context, index) {
          return _DayCard(day: days[index]);
        },
      ),
    );
  }
}

class _DayCard extends StatelessWidget {
  final String day;

  const _DayCard({required this.day});

  @override
  Widget build(BuildContext context) {
    // Sample schedule data
    final schedule = [
      {
        'time': '09:00 - 09:40',
        'subject': 'Mathematics',
        'teacher': 'Mr. Ahmed',
        'room': '101',
      },
      {
        'time': '09:45 - 10:25',
        'subject': 'English',
        'teacher': 'Ms. Sarah',
        'room': '205',
      },
      {
        'time': '10:30 - 11:10',
        'subject': 'Physics',
        'teacher': 'Mr. Ali',
        'room': '301',
      },
      {
        'time': '11:15 - 11:55',
        'subject': 'Chemistry',
        'teacher': 'Dr. Khan',
        'room': '302',
      },
      {
        'time': '12:00 - 12:40',
        'subject': 'Biology',
        'teacher': 'Ms. Fatima',
        'room': '303',
      },
    ];

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ExpansionTile(
        title: Text(day, style: Theme.of(context).textTheme.titleLarge),
        children: [
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: schedule.length,
            separatorBuilder: (context, index) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final period = schedule[index];
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: Theme.of(
                    context,
                  ).primaryColor.withOpacity(0.1),
                  child: Text(
                    '${index + 1}',
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                title: Text(period['subject']!),
                subtitle: Text(
                  '${period['time']} • ${period['teacher']} • Room ${period['room']}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  // TODO: Show period details
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
