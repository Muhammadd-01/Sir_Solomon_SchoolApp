import '../services/api_service.dart';
import '../models/announcement.dart';

class AnnouncementRepository {
  final ApiService _apiService;

  AnnouncementRepository(this._apiService);

  Future<List<Announcement>> getAllAnnouncements({
    String? status,
    String? type,
  }) async {
    final queryParams = <String, dynamic>{};
    if (status != null) queryParams['status'] = status;
    if (type != null) queryParams['type'] = type;

    final response = await _apiService.get(
      '/announcements',
      queryParameters: queryParams,
    );
    final List data = response.data['data'];
    return data.map((json) => Announcement.fromJson(json)).toList();
  }
}
