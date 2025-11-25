import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FeesScreen extends ConsumerWidget {
  const FeesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Sample data
    final feeRecords = [
      {
        'type': 'Tuition Fee',
        'amount': 50000,
        'paid': 50000,
        'dueDate': '2024-01-15',
        'status': 'paid',
      },
      {
        'type': 'Exam Fee',
        'amount': 5000,
        'paid': 5000,
        'dueDate': '2024-01-20',
        'status': 'paid',
      },
      {
        'type': 'Tuition Fee',
        'amount': 50000,
        'paid': 25000,
        'dueDate': '2024-02-15',
        'status': 'partial',
      },
      {
        'type': 'Library Fee',
        'amount': 2000,
        'paid': 0,
        'dueDate': '2024-02-20',
        'status': 'pending',
      },
    ];

    final totalAmount = feeRecords.fold<int>(
      0,
      (sum, fee) => sum + (fee['amount'] as int),
    );
    final totalPaid = feeRecords.fold<int>(
      0,
      (sum, fee) => sum + (fee['paid'] as int),
    );
    final totalPending = totalAmount - totalPaid;

    return Scaffold(
      appBar: AppBar(title: const Text('Fees')),
      body: Column(
        children: [
          // Summary Cards
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _SummaryCard(
                    title: 'Total',
                    amount: totalAmount,
                    color: Colors.blue,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SummaryCard(
                    title: 'Paid',
                    amount: totalPaid,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SummaryCard(
                    title: 'Pending',
                    amount: totalPending,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ),

          // Fee Records
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: feeRecords.length,
              itemBuilder: (context, index) {
                final fee = feeRecords[index];
                final dueDate = DateTime.parse(fee['dueDate'] as String);
                final status = fee['status'] as String;

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
                              fee['type'] as String,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            _StatusChip(status: status),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Amount: ₨${(fee['amount'] as int).toStringAsFixed(0)}',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                Text(
                                  'Paid: ₨${(fee['paid'] as int).toStringAsFixed(0)}',
                                  style: Theme.of(context).textTheme.bodySmall
                                      ?.copyWith(color: Colors.green),
                                ),
                                if ((fee['amount'] as int) >
                                    (fee['paid'] as int))
                                  Text(
                                    'Balance: ₨${((fee['amount'] as int) - (fee['paid'] as int)).toStringAsFixed(0)}',
                                    style: Theme.of(context).textTheme.bodySmall
                                        ?.copyWith(color: Colors.red),
                                  ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  'Due Date',
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                                Text(
                                  '${dueDate.day}/${dueDate.month}/${dueDate.year}',
                                  style: Theme.of(context).textTheme.bodyMedium
                                      ?.copyWith(fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ],
                        ),
                        if (status != 'paid')
                          Padding(
                            padding: const EdgeInsets.only(top: 12),
                            child: SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: () {
                                  // TODO: Navigate to payment
                                },
                                child: const Text('Pay Now'),
                              ),
                            ),
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
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final int amount;
  final Color color;

  const _SummaryCard({
    required this.title,
    required this.amount,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            title,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '₨${amount.toStringAsFixed(0)}',
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String status;

  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    String label;

    switch (status) {
      case 'paid':
        color = Colors.green;
        label = 'Paid';
        break;
      case 'partial':
        color = Colors.orange;
        label = 'Partial';
        break;
      case 'pending':
        color = Colors.red;
        label = 'Pending';
        break;
      default:
        color = Colors.grey;
        label = status;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
