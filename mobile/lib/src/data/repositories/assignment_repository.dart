import '../services/api_service.dart';
import '../models/assignment.dart';

class AssignmentRepository {
  final ApiService _apiService;

  AssignmentRepository(this._apiService);

  Future<List<Assignment>> getAllAssignments({
    String? className,
    String? section,
    String? subject,
    String? status,
  }) async {
    final queryParams = <String, dynamic>{};
    if (className != null) queryParams['class'] = className;
    if (section != null) queryParams['section'] = section;
    if (subject != null) queryParams['subject'] = subject;
    if (status != null) queryParams['status'] = status;

    final response = await _apiService.get(
      '/assignments',
      queryParameters: queryParams,
    );
    final List data = response.data['data'];
    return data.map((json) => Assignment.fromJson(json)).toList();
  }

  Future<void> submitAssignment(
    String assignmentId,
    List<Map<String, dynamic>> files,
  ) async {
    await _apiService.post(
      '/assignments/$assignmentId/submit',
      data: {'files': files},
    );
  }
}
