import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AssignmentsScreen extends ConsumerStatefulWidget {
  const AssignmentsScreen({super.key});

  @override
  ConsumerState<AssignmentsScreen> createState() => _AssignmentsScreenState();
}

class _AssignmentsScreenState extends ConsumerState<AssignmentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assignments'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Pending'),
            Tab(text: 'Submitted'),
            Tab(text: 'Graded'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _AssignmentList(status: 'pending'),
          _AssignmentList(status: 'submitted'),
          _AssignmentList(status: 'graded'),
        ],
      ),
    );
  }
}

class _AssignmentList extends StatelessWidget {
  final String status;

  const _AssignmentList({required this.status});

  @override
  Widget build(BuildContext context) {
    // Sample data
    final assignments = [
      {
        'title': 'Algebra Quiz',
        'subject': 'Mathematics',
        'dueDate': '2024-02-01',
        'totalMarks': 100,
        'obtainedMarks': status == 'graded' ? 85 : null,
      },
      {
        'title': 'Essay on Climate Change',
        'subject': 'English',
        'dueDate': '2024-02-05',
        'totalMarks': 50,
        'obtainedMarks': status == 'graded' ? 42 : null,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: assignments.length,
      itemBuilder: (context, index) {
        final assignment = assignments[index];
        final dueDate = DateTime.parse(assignment['dueDate'] as String);
        final isOverdue =
            dueDate.isBefore(DateTime.now()) && status == 'pending';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              // TODO: Navigate to assignment details
            },
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          assignment['title'] as String,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ),
                      if (isOverdue)
                        const Chip(
                          label: Text(
                            'Overdue',
                            style: TextStyle(fontSize: 12),
                          ),
                          backgroundColor: Colors.red,
                          labelStyle: TextStyle(color: Colors.white),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.book, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      Text(
                        assignment['subject'] as String,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(width: 16),
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Due: ${dueDate.day}/${dueDate.month}/${dueDate.year}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Total Marks: ${assignment['totalMarks']}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      if (status == 'graded')
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'Score: ${assignment['obtainedMarks']}/${assignment['totalMarks']}',
                            style: const TextStyle(
                              color: Colors.green,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      if (status == 'pending')
                        ElevatedButton(
                          onPressed: () {
                            // TODO: Submit assignment
                          },
                          child: const Text('Submit'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
