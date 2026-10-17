from django.urls import path
from .views import admin_login_view, admin_stats_view, admin_users_view, admin_user_detail_view, google_auth_view, user_register_view, user_login_view, verify_otp_view, admin_ads_view

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
]
