import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GradesScreen extends ConsumerWidget {
  const GradesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Sample data
    final subjects = [
      {'name': 'Mathematics', 'marks': 85, 'total': 100, 'grade': 'A'},
      {'name': 'English', 'marks': 78, 'total': 100, 'grade': 'B+'},
      {'name': 'Physics', 'marks': 92, 'total': 100, 'grade': 'A+'},
      {'name': 'Chemistry', 'marks': 88, 'total': 100, 'grade': 'A'},
      {'name': 'Biology', 'marks': 81, 'total': 100, 'grade': 'A-'},
      {'name': 'Computer Science', 'marks': 95, 'total': 100, 'grade': 'A+'},
    ];

    final totalMarks = subjects.fold<int>(
      0,
      (sum, subject) => sum + (subject['marks'] as int),
    );
    final totalPossible = subjects.fold<int>(
      0,
      (sum, subject) => sum + (subject['total'] as int),
    );
    final percentage = ((totalMarks / totalPossible) * 100).toStringAsFixed(2);

    return Scaffold(
      appBar: AppBar(title: const Text('Grades')),
      body: Column(
        children: [
          // Overall Performance Card
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).primaryColor,
                  Theme.of(context).primaryColor.withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Text(
                  'Overall Performance',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  '$percentage%',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '$totalMarks / $totalPossible Marks',
                  style: const TextStyle(color: Colors.white70, fontSize: 16),
                ),
              ],
            ),
          ),

          // Subject-wise Grades
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: subjects.length,
              itemBuilder: (context, index) {
                final subject = subjects[index];
                final marks = subject['marks'] as int;
                final total = subject['total'] as int;
                final percentage = ((marks / total) * 100).toInt();

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              subject['name'] as String,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: _getGradeColor(
                                  subject['grade'] as String,
                                ).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                subject['grade'] as String,
                                style: TextStyle(
                                  color: _getGradeColor(
                                    subject['grade'] as String,
                                  ),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: LinearProgressIndicator(
                                value: percentage / 100,
                                backgroundColor: Colors.grey[200],
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  _getGradeColor(subject['grade'] as String),
                                ),
                                minHeight: 8,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              '$marks/$total',
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Color _getGradeColor(String grade) {
    if (grade.startsWith('A')) return Colors.green;
    if (grade.startsWith('B')) return Colors.blue;
    if (grade.startsWith('C')) return Colors.orange;
    return Colors.red;
  }
}
