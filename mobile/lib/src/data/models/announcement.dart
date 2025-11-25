class Announcement {
  final String id;
  final String title;
  final String content;
  final String type;
  final String targetAudience;
  final List<Attachment> attachments;
  final DateTime publishedAt;
  final DateTime? expiresAt;
  final String status;

  Announcement({
    required this.id,
    required this.title,
    required this.content,
    required this.type,
    required this.targetAudience,
    required this.attachments,
    required this.publishedAt,
    this.expiresAt,
    required this.status,
  });

  bool get isExpired => expiresAt != null && DateTime.now().isAfter(expiresAt!);

  factory Announcement.fromJson(Map<String, dynamic> json) {
    return Announcement(
      id: json['_id'] ?? json['id'],
      title: json['title'],
      content: json['content'],
      type: json['type'],
      targetAudience: json['targetAudience'],
      attachments:
          (json['attachments'] as List?)
              ?.map((a) => Attachment.fromJson(a))
              .toList() ??
          [],
      publishedAt: DateTime.parse(json['publishedAt']),
      expiresAt: json['expiresAt'] != null
          ? DateTime.parse(json['expiresAt'])
          : null,
      status: json['status'],
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
}
