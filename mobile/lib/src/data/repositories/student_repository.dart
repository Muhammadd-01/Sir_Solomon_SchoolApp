import '../services/api_service.dart';
import '../models/student.dart';

class StudentRepository {
  final ApiService _apiService;

  StudentRepository(this._apiService);

  Future<List<Student>> getAllStudents({
    String? className,
    String? section,
    String? status,
    String? search,
  }) async {
    final queryParams = <String, dynamic>{};
    if (className != null) queryParams['class'] = className;
    if (section != null) queryParams['section'] = section;
    if (status != null) queryParams['status'] = status;
    if (search != null) queryParams['search'] = search;

    final response = await _apiService.get(
      '/students',
      queryParameters: queryParams,
    );
    final List data = response.data['data'];
    return data.map((json) => Student.fromJson(json)).toList();
  }

  Future<Student> getStudentById(String id) async {
    final response = await _apiService.get('/students/$id');
    return Student.fromJson(response.data['data']);
  }

  Future<Student> createStudent(Student student) async {
    final response = await _apiService.post(
      '/students',
      data: student.toJson(),
    );
    return Student.fromJson(response.data['data']);
  }

  Future<Student> updateStudent(String id, Student student) async {
    final response = await _apiService.put(
      '/students/$id',
      data: student.toJson(),
    );
    return Student.fromJson(response.data['data']);
  }

  Future<void> deleteStudent(String id) async {
    await _apiService.delete('/students/$id');
  }
}
