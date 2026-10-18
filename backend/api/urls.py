from django.urls import path
from .views import (
    admin_login_view, admin_stats_view, admin_users_view, admin_user_detail_view, 
    google_auth_view, user_register_view, user_login_view, verify_otp_view, 
    admin_ads_view, categories_view, courses_view, course_detail_view,
    course_modules_view, course_lessons_view, course_tests_view, course_certificates_view,
    course_applications_view, user_enrolled_courses_view
)

urlpatterns = [
    path('auth/register/', user_register_view, name='user_register'),
    path('auth/verify-otp/', verify_otp_view, name='verify_otp'),
    path('auth/login/', user_login_view, name='user_login'),
    path('auth/google/', google_auth_view, name='google_auth'),
    path('admin/login/', admin_login_view, name='admin_login'),
    path('admin/stats/', admin_stats_view, name='admin_stats'),
    path('admin/users/', admin_users_view, name='admin_users'),
    path('admin/users/<str:user_id>/', admin_user_detail_view, name='admin_user_detail'),
    path('admin/ads/', admin_ads_view, name='admin_ads'),
    path('categories/', categories_view, name='categories'),
    path('courses/', courses_view, name='courses'),
    path('courses/<int:course_id>/', course_detail_view, name='course_detail'),
    path('course-modules/', course_modules_view, name='course_modules'),
    path('course-lessons/', course_lessons_view, name='course_lessons'),
    path('course-tests/', course_tests_view, name='course_tests'),
    path('course-certificates/', course_certificates_view, name='course_certificates'),
    path('course-applications/', course_applications_view, name='course_applications'),
    path('course-applications/<int:application_id>/', course_applications_view, name='course_application_detail'),
    path('my-courses/', user_enrolled_courses_view, name='user_enrolled_courses'),
]
