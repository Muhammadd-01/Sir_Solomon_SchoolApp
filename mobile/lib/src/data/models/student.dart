class Student {
  final String id;
  final String studentId;
  final String firstName;
  final String lastName;
  final DateTime dob;
  final String gender;
  final String className;
  final String section;
  final List<Guardian> guardians;
  final Medical medical;
  final String? photoUrl;
  final String status;
  final String? firebaseUid;
  final DateTime admissionDate;

  Student({
    required this.id,
    required this.studentId,
    required this.firstName,
    required this.lastName,
    required this.dob,
    required this.gender,
    required this.className,
    required this.section,
    required this.guardians,
    required this.medical,
    this.photoUrl,
    required this.status,
    this.firebaseUid,
    required this.admissionDate,
  });

  String get fullName => '$firstName $lastName';

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['_id'] ?? json['id'],
      studentId: json['studentId'],
      firstName: json['name']['first'],
      lastName: json['name']['last'],
      dob: DateTime.parse(json['dob']),
      gender: json['gender'],
      className: json['class'],
      section: json['section'],
      guardians: (json['guardians'] as List)
          .map((g) => Guardian.fromJson(g))
          .toList(),
      medical: Medical.fromJson(json['medical'] ?? {}),
      photoUrl: json['photoUrl'],
      status: json['status'],
      firebaseUid: json['firebaseUid'],
      admissionDate: DateTime.parse(json['admissionDate']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'studentId': studentId,
      'name': {'first': firstName, 'last': lastName},
      'dob': dob.toIso8601String(),
      'gender': gender,
      'class': className,
      'section': section,
      'guardians': guardians.map((g) => g.toJson()).toList(),
      'medical': medical.toJson(),
      'photoUrl': photoUrl,
      'status': status,
      'firebaseUid': firebaseUid,
    };
  }
}

class Guardian {
  final String name;
  final String relation;
  final String phone;
  final String? email;

  Guardian({
    required this.name,
    required this.relation,
    required this.phone,
    this.email,
  });

  factory Guardian.fromJson(Map<String, dynamic> json) {
    return Guardian(
      name: json['name'],
      relation: json['relation'],
      phone: json['phone'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {'name': name, 'relation': relation, 'phone': phone, 'email': email};
  }
}

class Medical {
  final List<String> allergies;
  final String? notes;

  Medical({this.allergies = const [], this.notes});

  factory Medical.fromJson(Map<String, dynamic> json) {
    return Medical(
      allergies: json['allergies'] != null
          ? List<String>.from(json['allergies'])
          : [],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {'allergies': allergies, 'notes': notes};
  }
}
