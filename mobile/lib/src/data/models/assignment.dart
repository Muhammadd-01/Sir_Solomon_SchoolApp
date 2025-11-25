class Assignment {
  final String id;
  final String title;
  final String description;
  final String className;
  final String section;
  final String subject;
  final String teacherId;
  final DateTime dueDate;
  final int totalMarks;
  final List<Attachment> attachments;
  final String status;
  final DateTime createdAt;

  Assignment({
    required this.id,
    required this.title,
    required this.description,
    required this.className,
    required this.section,
    required this.subject,
    required this.teacherId,
    required this.dueDate,
    required this.totalMarks,
    required this.attachments,
    required this.status,
    required this.createdAt,
  });

  bool get isOverdue => DateTime.now().isAfter(dueDate) && status == 'active';

  factory Assignment.fromJson(Map<String, dynamic> json) {
    return Assignment(
      id: json['_id'] ?? json['id'],
      title: json['title'],
      description: json['description'],
      className: json['class'],
      section: json['section'],
      subject: json['subject'],
      teacherId: json['teacherId'],
      dueDate: DateTime.parse(json['dueDate']),
      totalMarks: json['totalMarks'] ?? 100,
      attachments:
          (json['attachments'] as List?)
              ?.map((a) => Attachment.fromJson(a))
              .toList() ??
          [],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class Attachment {
  final String filename;
  final String url;
  final int? size;

  Attachment({required this.filename, required this.url, this.size});

  factory Attachment.fromJson(Map<String, dynamic> json) {
    return Attachment(
      filename: json['filename'],
      url: json['url'],
      size: json['size'],
    );
  }

  Map<String, dynamic> toJson() {
    return {'filename': filename, 'url': url, 'size': size};
  }
}
