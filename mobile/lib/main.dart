import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'src/core/config/firebase_config.dart';
import 'src/core/theme/app_theme.dart';
import 'src/presentation/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    print('Starting Firebase initialization...');
    // Initialize Firebase
    await FirebaseConfig.initialize();
    print('Firebase initialized successfully');
  } catch (e, stackTrace) {
    print('Error initializing Firebase: $e');
    print(stackTrace);
  }

  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: "Solomon's Secondary School",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const LoginScreen(),
    );
  }
}
