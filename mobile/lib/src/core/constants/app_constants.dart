class AppConstants {
  // API Configuration
  // TODO: Update with your actual server URL
  static const String baseUrl = 'http://localhost:4000/api';
  static const String socketUrl = 'http://localhost:4000';

  // Timeouts
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyUserId = 'user_id';
  static const String keyUserRole = 'user_role';
  static const String keyThemeMode = 'theme_mode';
  static const String keyLanguage = 'language';
  static const String keySyncQueue = 'sync_queue';

  // User Roles
  static const String roleStudent = 'student';
  static const String roleParent = 'parent';
  static const String roleTeacher = 'teacher';
  static const String roleAdmin = 'admin';

  // Attendance Status
  static const String statusPresent = 'present';
  static const String statusAbsent = 'absent';
  static const String statusLate = 'late';

  // Attendance Methods
  static const String methodQR = 'qr';
  static const String methodManual = 'manual';
  static const String methodBarcode = 'barcode';
  static const String methodFace = 'face';

  // Firebase Collections (if using Firestore)
  static const String collectionStudents = 'students';
  static const String collectionTeachers = 'teachers';
  static const String collectionAttendance = 'attendance';
  static const String collectionAnnouncements = 'announcements';

  // Pagination
  static const int defaultPageSize = 20;

  // File Upload
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedDocTypes = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
  ];

  // QR Code
  static const String qrPrefix = 'SOLOMON_STUDENT_';
  static const String qrSessionPrefix = 'SOLOMON_SESSION_';

  // Notification Channels
  static const String notificationChannelId = 'solomon_school_notifications';
  static const String notificationChannelName = 'School Notifications';
  static const String notificationChannelDesc =
      'Notifications for announcements, assignments, and updates';

  // Cache Duration
  static const Duration cacheDuration = Duration(hours: 24);

  // Sync Settings
  static const Duration syncInterval = Duration(minutes: 15);
  static const int maxRetryAttempts = 3;

  // Validation
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 50;

  // Date Formats
  static const String dateFormat = 'yyyy-MM-dd';
  static const String dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
  static const String displayDateFormat = 'MMM dd, yyyy';
  static const String displayTimeFormat = 'hh:mm a';
}
