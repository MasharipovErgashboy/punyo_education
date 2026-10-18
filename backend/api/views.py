from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import datetime
import json
from .models import CustomUser, Ad, Category, Course, Teacher

PENDING_USERS = {}

@api_view(['POST'])
@permission_classes([AllowAny])
def user_register_view(request):
    name = request.data.get('name', '')
    phone = request.data.get('phone', '')
    email = request.data.get('email', '')
    password = request.data.get('password', '')

    if not name or not email or not password:
        return Response({'success': False, 'message': 'Ism, email va parol kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email__iexact=email).exists():
        return Response({'success': False, 'message': 'Bu email manzili bilan allaqachon ro\'yxatdan o\'tilgan!'}, status=status.HTTP_400_BAD_REQUEST)

    today_str = datetime.date.today().strftime('%d.%m.%Y')
    new_id = f"USR-{1001 + CustomUser.objects.count()}"
    
    user = CustomUser.objects.create(
        user_id=new_id,
        name=name,
        email=email,
        phone=phone,
        password=password,
        role='Talaba',
        courses_count=0,
        coins=500,
        status='Faol',
        joined_date=today_str,
        auth_provider='email'
    )
    
    user_data = {
        'id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'courses_count': user.courses_count,
        'coins': user.coins,
        'status': user.status,
        'joined_date': user.joined_date,
        'auth_provider': user.auth_provider,
    }
    
    return Response({
        'success': True,
        'message': "Hisobingiz muvaffaqiyatli yaratildi!",
        'token': f"punyo_token_user_{user.user_id}",
        'user': user_data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    email = request.data.get('email', '')
    code = request.data.get('code', '')
    
    if not email or not code:
        return Response({'success': False, 'message': 'Email va kod kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)
        
    pending_user = PENDING_USERS.get(email.lower())
    if not pending_user:
        return Response({'success': False, 'message': 'Bunday email tasdiqlash kutilmayapti.'}, status=status.HTTP_404_NOT_FOUND)
        
    if pending_user['otp'] != code:
        return Response({'success': False, 'message': 'Noto\'g\'ri tasdiqlash kodi!'}, status=status.HTTP_400_BAD_REQUEST)
        
    today_str = datetime.date.today().strftime('%d.%m.%Y')
    new_id = f"USR-{1001 + CustomUser.objects.count()}"
    
    user = CustomUser.objects.create(
        user_id=new_id,
        name=pending_user['name'],
        email=pending_user['email'],
        phone=pending_user.get('phone', ''),
        password=pending_user.get('password', ''),
        role='Talaba',
        courses_count=0,
        coins=500,
        status='Faol',
        joined_date=today_str,
        auth_provider='email'
    )
    del PENDING_USERS[email.lower()]
    
    user_data = {
        'id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'courses_count': user.courses_count,
        'coins': user.coins,
        'status': user.status,
        'joined_date': user.joined_date,
        'auth_provider': user.auth_provider,
    }
    
    return Response({
        'success': True,
        'message': "Hisobingiz muvaffaqiyatli yaratildi!",
        'token': f"punyo_token_user_{user.user_id}",
        'user': user_data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login_view(request):
    email_or_phone = request.data.get('emailOrPhone', '').strip()
    password = request.data.get('password', '')

    if not email_or_phone or not password:
        return Response({'success': False, 'message': 'Email/Telefon va parol kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.filter(email__iexact=email_or_phone).first()
    if not user:
        user = CustomUser.objects.filter(phone=email_or_phone).first()

    if user and user.password and user.password != password:
        return Response({'success': False, 'message': 'Noto\'g\'ri parol!'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user:
        # Create user dynamically for demo if logging in for first time
        today_str = datetime.date.today().strftime('%d.%m.%Y')
        new_id = f"USR-{1001 + CustomUser.objects.count()}"
        user = CustomUser.objects.create(
            user_id=new_id,
            name=email_or_phone.split('@')[0].capitalize() if '@' in email_or_phone else 'Foydalanuvchi',
            email=email_or_phone if '@' in email_or_phone else f"{email_or_phone}@punyo.uz",
            password=password,
            role='Talaba',
            courses_count=1,
            coins=500,
            status='Faol',
            joined_date=today_str,
            auth_provider='email'
        )

    user_data = {
        'id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'courses_count': user.courses_count,
        'coins': user.coins,
        'status': user.status,
        'joined_date': user.joined_date,
        'auth_provider': user.auth_provider,
    }

    return Response({
        'success': True,
        'message': "Tizimga muvaffaqiyatli kirdingiz!",
        'token': f"punyo_token_user_{user.user_id}",
        'user': user_data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_view(request):
    email = request.data.get('email', '')
    name = request.data.get('name', '')
    google_id = request.data.get('google_id', '')

    if not email:
        email = 'user.google@gmail.com'
    if not name:
        name = 'Google Foydalanuvchisi'

    user = CustomUser.objects.filter(email__iexact=email).first()

    if user:
        created = False
    else:
        today_str = datetime.date.today().strftime('%d.%m.%Y')
        new_id = f"USR-{1001 + CustomUser.objects.count()}"
        user = CustomUser.objects.create(
            user_id=new_id,
            name=name,
            email=email,
            phone=None,
            role='Talaba',
            courses_count=0,
            coins=500,
            status='Faol',
            joined_date=today_str,
            auth_provider='google'
        )
        created = True

    user_data = {
        'id': user.user_id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'courses_count': user.courses_count,
        'coins': user.coins,
        'status': user.status,
        'joined_date': user.joined_date,
        'auth_provider': user.auth_provider,
    }

    return Response({
        'success': True,
        'created': created,
        'message': "Google orqali muvaffaqiyatli ro'yxatdan o'tildi!" if created else "Google orqali tizimga kirdingiz!",
        'token': f"punyo_token_google_{user.user_id}",
        'user': user_data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            'success': False,
            'message': 'Username va parol kiritilishi shart!'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user is not None and (user.is_staff or user.is_superuser):
        login(request, user)
        return Response({
            'success': True,
            'message': 'Muvaffaqiyatli tizimga kirdingiz!',
            'token': f'punyo_admin_session_token_{user.id}',
            'user': {
                'username': user.username,
                'email': user.email or 'admin@punyo.uz',
                'first_name': user.first_name or 'Admin',
                'last_name': user.last_name or 'User',
                'is_superuser': user.is_superuser,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'message': "Username yoki parol noto'g'ri yoki administrator huquqi yo'q!"
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_stats_view(request):
    return Response({
        'total_students': CustomUser.objects.count() + 12444,
        'active_courses': 28,
        'completed_tests': 48320,
        'total_revenue': "128,450,000 UZS",
        'recent_users': []  # You can query last 5 if needed
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_users_view(request):
    users = CustomUser.objects.all().order_by('-id')
    users_data = []
    for u in users:
        users_data.append({
            'id': u.user_id,
            'name': u.name,
            'email': u.email,
            'phone': u.phone,
            'role': u.role,
            'courses_count': u.courses_count,
            'coins': u.coins,
            'status': u.status,
            'joined_date': u.joined_date,
        })
    return Response({'success': True, 'count': users.count(), 'users': users_data}, status=status.HTTP_200_OK)

@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def admin_user_detail_view(request, user_id):
    try:
        user = CustomUser.objects.get(user_id=user_id)
    except CustomUser.DoesNotExist:
        return Response({'success': False, 'message': 'Foydalanuvchi topilmadi'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'DELETE':
        user.delete()
        return Response({'success': True, 'message': 'Foydalanuvchi muvaffaqiyatli o\'chirildi'})
        
    elif request.method == 'PUT':
        user.name = request.data.get('name', user.name)
        user.email = request.data.get('email', user.email)
        user.role = request.data.get('role', user.role)
        user.status = request.data.get('status', user.status)
        
        coins_str = str(request.data.get('coins', user.coins)).replace(',', '').replace(' ', '')
        if coins_str.isdigit():
            user.coins = int(coins_str)
            
        user.save()
        return Response({'success': True, 'message': 'Ma\'lumotlar yangilandi'})

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
def admin_ads_view(request):
    if request.method == 'GET':
        ads = Ad.objects.all().order_by('order_index')
        ads_data = []
        for ad in ads:
            ads_data.append({
                'id': ad.ad_id,
                'image_url': ad.image_url,
                'order_index': ad.order_index
            })
        return Response({'success': True, 'count': ads.count(), 'ads': ads_data}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        image_file = request.FILES.get('image')
        image_url = request.data.get('image_url')
        order_index = request.data.get('order_index', 999)
        
        if image_file:
            from django.core.files.storage import default_storage
            from django.conf import settings
            import os
            
            # Save file to media/ads directory
            file_path = default_storage.save(os.path.join('ads', image_file.name), image_file)
            image_url = request.build_absolute_uri(settings.MEDIA_URL + file_path)
        
        if not image_url:
            return Response({'success': False, 'message': 'Rasm yuklanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)
            
        new_id = f"AD-{1001 + Ad.objects.count()}"
        ad = Ad.objects.create(
            ad_id=new_id,
            image_url=image_url,
            order_index=int(order_index)
        )
        
        ad_data = {
            'id': ad.ad_id,
            'image_url': ad.image_url,
            'order_index': ad.order_index
        }
        
        return Response({'success': True, 'message': 'Reklama muvaffaqiyatli qo\'shildi!', 'ad': ad_data}, status=status.HTTP_201_CREATED)
    
    elif request.method == 'DELETE':
        ad_id = request.GET.get('id')
        if not ad_id:
            return Response({'success': False, 'message': 'Reklama ID kiritilmadi!'}, status=status.HTTP_400_BAD_REQUEST)
            
        ad = Ad.objects.filter(ad_id=ad_id).first()
        if ad:
            ad.delete()
            return Response({'success': True, 'message': 'Reklama muvaffaqiyatli o\'chirildi!'})
        return Response({'success': False, 'message': 'Bunday reklama topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
def categories_view(request):
    if request.method == 'GET':
        categories = Category.objects.all().order_by('-created_at')
        data = []
        for cat in categories:
            data.append({
                'id': cat.id,
                'name': cat.name,
                'courses_count': cat.courses.count(),
                'created_at': cat.created_at.strftime('%d.%m.%Y %H:%M')
            })
        return Response({'success': True, 'count': len(data), 'categories': data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'success': False, 'message': 'Kategoriya nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Category.objects.filter(name__iexact=name).exists():
            return Response({'success': False, 'message': 'Bunday kategoriya allaqachon mavjud!'}, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.create(name=name)
        return Response({
            'success': True,
            'message': 'Kategoriya muvaffaqiyatli yaratildi!',
            'category': {
                'id': category.id,
                'name': category.name,
                'courses_count': 0,
                'created_at': category.created_at.strftime('%d.%m.%Y %H:%M')
            }
        }, status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        cat_id = request.GET.get('id') or request.data.get('id')
        if not cat_id:
            return Response({'success': False, 'message': 'Kategoriya ID berilmadi!'}, status=status.HTTP_400_BAD_REQUEST)
        cat = Category.objects.filter(id=cat_id).first()
        if cat:
            cat.delete()
            return Response({'success': True, 'message': 'Kategoriya o\'chirildi!'})
        return Response({'success': False, 'message': 'Kategoriya topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
def courses_view(request):
    if request.method == 'GET':
        category_id = request.GET.get('category_id')
        category_name = request.GET.get('category')
        
        courses_qs = Course.objects.all().select_related('category').prefetch_related('teachers')
        if category_id:
            courses_qs = courses_qs.filter(category_id=category_id)
        elif category_name:
            courses_qs = courses_qs.filter(category__name__iexact=category_name)

        data = []
        for c in courses_qs:
            icon_url = request.build_absolute_uri(c.icon.url) if c.icon else None
            teachers_list = []
            for t in c.teachers.all():
                avatar_url = request.build_absolute_uri(t.avatar.url) if t.avatar else None
                teachers_list.append({
                    'id': t.id,
                    'name': t.name,
                    'role': t.role,
                    'avatar_url': avatar_url,
                    'avatar': avatar_url
                })

            data.append({
                'id': c.id,
                'category_id': c.category_id,
                'category_name': c.category.name,
                'title': c.title,
                'name': c.title,
                'hint': c.hint,
                'icon_url': icon_url,
                'icon': icon_url,
                'intro_video_url': c.intro_video_url,
                'description': c.description,
                'students_count': c.students_count,
                'duration': c.duration,
                'has_certificate': c.has_certificate,
                'price': c.price,
                'rating': c.rating,
                'teachers': teachers_list,
                'created_at': c.created_at.strftime('%d.%m.%Y %H:%M')
            })
        return Response({'success': True, 'count': len(data), 'courses': data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        category_id = request.data.get('category_id') or request.data.get('category')
        title = (request.data.get('title') or request.data.get('name') or '').strip()
        hint = request.data.get('hint', '').strip()
        intro_video_url = request.data.get('intro_video_url', '').strip()
        description = request.data.get('description', '').strip()
        students_count = request.data.get('students_count', "0 o'quvchi").strip()
        duration = request.data.get('duration', '0 soat').strip()
        has_certificate_raw = request.data.get('has_certificate')
        has_certificate = str(has_certificate_raw).lower() in ['true', '1', 'yes']
        price = request.data.get('price', "0 UZS").strip()

        if not category_id:
            return Response({'success': False, 'message': 'Kategoriya tanlanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)
        category = Category.objects.filter(id=category_id).first()
        if not category:
            return Response({'success': False, 'message': 'Bunday kategoriya topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        if not title:
            return Response({'success': False, 'message': 'Kurs nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        icon_file = request.FILES.get('icon')

        course = Course.objects.create(
            category=category,
            title=title,
            hint=hint,
            icon=icon_file,
            intro_video_url=intro_video_url,
            description=description,
            students_count=students_count,
            duration=duration,
            has_certificate=has_certificate,
            price=price
        )

        # Teachers handling
        teachers_raw = request.data.get('teachers')
        if teachers_raw:
            try:
                teachers_list = json.loads(teachers_raw) if isinstance(teachers_raw, str) else teachers_raw
                for idx, t_data in enumerate(teachers_list):
                    t_name = t_data.get('name', '').strip()
                    t_role = t_data.get('role', '').strip()
                    if t_name:
                        avatar_file = request.FILES.get(f'teacher_avatar_{idx}')
                        Teacher.objects.create(
                            course=course,
                            name=t_name,
                            role=t_role,
                            avatar=avatar_file
                        )
            except Exception as e:
                print("Error parsing teachers:", e)

        icon_url = request.build_absolute_uri(course.icon.url) if course.icon else None
        teachers_res = []
        for t in course.teachers.all():
            avatar_url = request.build_absolute_uri(t.avatar.url) if t.avatar else None
            teachers_res.append({
                'id': t.id,
                'name': t.name,
                'role': t.role,
                'avatar_url': avatar_url,
                'avatar': avatar_url
            })

        course_data = {
            'id': course.id,
            'category_id': course.category_id,
            'category_name': course.category.name,
            'title': course.title,
            'name': course.title,
            'hint': course.hint,
            'icon_url': icon_url,
            'icon': icon_url,
            'intro_video_url': course.intro_video_url,
            'description': course.description,
            'students_count': course.students_count,
            'duration': course.duration,
            'has_certificate': course.has_certificate,
            'price': course.price,
            'rating': course.rating,
            'teachers': teachers_res,
            'created_at': course.created_at.strftime('%d.%m.%Y %H:%M')
        }

        return Response({'success': True, 'message': 'Kurs muvaffaqiyatli yaratildi!', 'course': course_data}, status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        course_id = request.GET.get('id') or request.data.get('id')
        if not course_id:
            return Response({'success': False, 'message': 'Kurs ID berilmadi!'}, status=status.HTTP_400_BAD_REQUEST)
        c = Course.objects.filter(id=course_id).first()
        if c:
            c.delete()
            return Response({'success': True, 'message': 'Kurs o\'chirildi!'})
        return Response({'success': False, 'message': 'Kurs topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail_view(request, course_id):
    c = Course.objects.filter(id=course_id).select_related('category').prefetch_related('teachers').first()
    if not c:
        return Response({'success': False, 'message': 'Kurs topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

    icon_url = request.build_absolute_uri(c.icon.url) if c.icon else None
    teachers_list = []
    for t in c.teachers.all():
        avatar_url = request.build_absolute_uri(t.avatar.url) if t.avatar else None
        teachers_list.append({
            'id': t.id,
            'name': t.name,
            'role': t.role,
            'avatar_url': avatar_url,
            'avatar': avatar_url
        })

    data = {
        'id': c.id,
        'category_id': c.category_id,
        'category_name': c.category.name,
        'title': c.title,
        'name': c.title,
        'hint': c.hint,
        'icon_url': icon_url,
        'icon': icon_url,
        'intro_video_url': c.intro_video_url,
        'description': c.description,
        'students_count': c.students_count,
        'duration': c.duration,
        'has_certificate': c.has_certificate,
        'price': c.price,
        'rating': c.rating,
        'teachers': teachers_list,
        'created_at': c.created_at.strftime('%d.%m.%Y %H:%M')
    }
    return Response({'success': True, 'course': data}, status=status.HTTP_200_OK)
