from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import datetime
import json
from .models import CustomUser, Ad, Category, Course, Teacher, CourseModule, CourseLesson, CourseTest, CourseCertificate, CourseApplication, UserCourseEnrollment

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


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
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

    elif request.method in ['POST', 'PUT']:
        cat_id = request.data.get('id') or request.data.get('cat_id') or request.GET.get('id')
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'success': False, 'message': 'Kategoriya nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        # Edit existing category
        if cat_id:
            cat = Category.objects.filter(id=cat_id).first()
            if not cat:
                return Response({'success': False, 'message': 'Kategoriya topilmadi!'}, status=status.HTTP_404_NOT_FOUND)
            if Category.objects.filter(name__iexact=name).exclude(id=cat.id).exists():
                return Response({'success': False, 'message': 'Bunday nomli boshqa kategoriya allaqachon mavjud!'}, status=status.HTTP_400_BAD_REQUEST)
            cat.name = name
            cat.save()
            return Response({
                'success': True,
                'message': 'Kategoriya muvaffaqiyatli tahrirlandi!',
                'category': {
                    'id': cat.id,
                    'name': cat.name,
                    'courses_count': cat.courses.count(),
                    'created_at': cat.created_at.strftime('%d.%m.%Y %H:%M')
                }
            }, status=status.HTTP_200_OK)

        # Create new category
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


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
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

            modules_count = c.modules.count()
            lessons_count = CourseLesson.objects.filter(module__course=c).count()
            tests_count = CourseTest.objects.filter(module__course=c).count()
            cert = c.certificates.first()
            certificate_pdf_url = request.build_absolute_uri(cert.pdf_file.url) if (cert and cert.pdf_file) else None

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
                'modules_count': modules_count,
                'lessons_count': lessons_count,
                'tests_count': tests_count,
                'has_certificate_file': bool(certificate_pdf_url),
                'certificate_pdf_url': certificate_pdf_url,
                'created_at': c.created_at.strftime('%d.%m.%Y %H:%M')
            })
        return Response({'success': True, 'count': len(data), 'courses': data}, status=status.HTTP_200_OK)

    elif request.method in ['POST', 'PUT']:
        course_id = request.data.get('id') or request.data.get('course_id') or request.GET.get('id')
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
        icon_file = request.FILES.get('icon')

        # Check Category
        category = None
        if category_id:
            category = Category.objects.filter(id=category_id).first()
            if not category:
                return Response({'success': False, 'message': 'Bunday kategoriya topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        # UPDATE COURSE
        if course_id:
            course = Course.objects.filter(id=course_id).first()
            if not course:
                return Response({'success': False, 'message': 'Tahrirlanayotgan kurs topilmadi!'}, status=status.HTTP_404_NOT_FOUND)
            
            if category:
                course.category = category
            if title:
                course.title = title
            course.hint = hint
            course.intro_video_url = intro_video_url
            course.description = description
            course.students_count = students_count
            course.duration = duration
            course.has_certificate = has_certificate
            course.price = price
            if icon_file:
                course.icon = icon_file
            course.save()

            # Teachers update
            teachers_raw = request.data.get('teachers')
            if teachers_raw is not None:
                try:
                    teachers_list = json.loads(teachers_raw) if isinstance(teachers_raw, str) else teachers_raw
                    old_teachers = list(course.teachers.all())
                    course.teachers.all().delete()
                    for idx, t_data in enumerate(teachers_list):
                        t_name = t_data.get('name', '').strip()
                        t_role = t_data.get('role', '').strip()
                        if t_name:
                            avatar_file = request.FILES.get(f'teacher_avatar_{idx}')
                            if not avatar_file and idx < len(old_teachers) and old_teachers[idx].avatar:
                                avatar_file = old_teachers[idx].avatar
                            Teacher.objects.create(
                                course=course,
                                name=t_name,
                                role=t_role,
                                avatar=avatar_file
                            )
                except Exception as e:
                    print("Error updating teachers:", e)

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
            return Response({'success': True, 'message': 'Kurs muvaffaqiyatli tahrirlandi!', 'course': course_data}, status=status.HTTP_200_OK)

        # CREATE NEW COURSE
        if not category:
            return Response({'success': False, 'message': 'Kategoriya tanlanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)
        if not title:
            return Response({'success': False, 'message': 'Kurs nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

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


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def course_modules_view(request):
    if request.method == 'GET':
        course_id = request.GET.get('course_id')
        course_title = request.GET.get('course_title')
        qs = CourseModule.objects.all()
        if course_id:
            qs = qs.filter(course_id=course_id)
        elif course_title:
            qs = qs.filter(course__title__iexact=course_title.strip())


        data = []
        for m in qs:
            data.append({
                'id': m.id,
                'course_id': m.course_id,
                'course_title': m.course.title if m.course else '',
                'title': m.title,
                'lessons_count': m.lessons_count,
                'tests_count': m.tests_count,
                'actual_lessons_count': m.lessons.count(),
                'actual_tests_count': m.tests.count(),
                'duration': m.duration,
                'order_index': m.order_index,
                'created_at': m.created_at.strftime('%d.%m.%Y %H:%M') if m.created_at else ''
            })
        return Response({'success': True, 'count': len(data), 'modules': data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        course_id = request.data.get('course_id')
        title = (request.data.get('title') or '').strip()
        lessons_count = int(request.data.get('lessons_count') or 0)
        tests_count = int(request.data.get('tests_count') or 0)
        duration = (request.data.get('duration') or '0 soat').strip()
        order_index = int(request.data.get('order_index') or (CourseModule.objects.filter(course_id=course_id).count() + 1))

        if not course_id:
            return Response({'success': False, 'message': 'Kurs tanlanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)
        if not title:
            return Response({'success': False, 'message': 'Modul nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        course = Course.objects.filter(id=course_id).first()
        if not course:
            return Response({'success': False, 'message': 'Kurs topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        mod = CourseModule.objects.create(
            course=course,
            title=title,
            lessons_count=lessons_count,
            tests_count=tests_count,
            duration=duration,
            order_index=order_index
        )
        return Response({
            'success': True,
            'message': 'Modul muvaffaqiyatli yaratildi!',
            'module': {
                'id': mod.id,
                'course_id': mod.course_id,
                'title': mod.title,
                'lessons_count': mod.lessons_count,
                'tests_count': mod.tests_count,
                'duration': mod.duration,
                'order_index': mod.order_index,
            }
        }, status=status.HTTP_201_CREATED)

    elif request.method == 'PUT':
        mod_id = request.data.get('id') or request.GET.get('id')
        if not mod_id:
            return Response({'success': False, 'message': 'Modul ID ko\'rsatilmadi!'}, status=status.HTTP_400_BAD_REQUEST)

        mod = CourseModule.objects.filter(id=mod_id).first()
        if not mod:
            return Response({'success': False, 'message': 'Modul topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get('title')
        if title is not None:
            mod.title = title.strip()
        if 'lessons_count' in request.data:
            mod.lessons_count = int(request.data.get('lessons_count') or 0)
        if 'tests_count' in request.data:
            mod.tests_count = int(request.data.get('tests_count') or 0)
        if 'duration' in request.data:
            mod.duration = (request.data.get('duration') or '').strip()
        if 'order_index' in request.data:
            mod.order_index = int(request.data.get('order_index') or mod.order_index)

        mod.save()
        return Response({
            'success': True,
            'message': 'Modul muvaffaqiyatli yangilandi!',
            'module': {
                'id': mod.id,
                'course_id': mod.course_id,
                'title': mod.title,
                'lessons_count': mod.lessons_count,
                'tests_count': mod.tests_count,
                'duration': mod.duration,
                'order_index': mod.order_index,
            }
        }, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        mod_id = request.GET.get('id') or request.data.get('id')
        if not mod_id:
            return Response({'success': False, 'message': 'Modul ID ko\'rsatilmadi!'}, status=status.HTTP_400_BAD_REQUEST)
        mod = CourseModule.objects.filter(id=mod_id).first()
        if mod:
            mod.delete()
            return Response({'success': True, 'message': 'Modul o\'chirildi!'})
        return Response({'success': False, 'message': 'Modul topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def course_lessons_view(request):
    if request.method == 'GET':
        module_id = request.GET.get('module_id')
        course_id = request.GET.get('course_id')
        qs = CourseLesson.objects.all().select_related('module', 'module__course')
        if module_id:
            qs = qs.filter(module_id=module_id)
        elif course_id:
            qs = qs.filter(module__course_id=course_id)

        data = []
        for l in qs:
            data.append({
                'id': l.id,
                'module_id': l.module_id,
                'module_title': l.module.title if l.module else '',
                'course_id': l.module.course_id if l.module else None,
                'title': l.title,
                'duration': l.duration,
                'youtube_url': l.youtube_url,
                'description': l.description,
                'order_index': l.order_index,
                'created_at': l.created_at.strftime('%d.%m.%Y %H:%M') if l.created_at else ''
            })
        return Response({'success': True, 'count': len(data), 'lessons': data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        lessons_data = request.data.get('lessons')
        module_id = request.data.get('module_id')

        # Batch creation support
        if lessons_data:
            if isinstance(lessons_data, str):
                try:
                    lessons_data = json.loads(lessons_data)
                except Exception:
                    lessons_data = []

            if not isinstance(lessons_data, list):
                lessons_data = [lessons_data]

            created_lessons = []
            for item in lessons_data:
                m_id = item.get('module_id') or module_id
                mod = CourseModule.objects.filter(id=m_id).first()
                if not mod:
                    continue
                title = (item.get('title') or '').strip()
                if not title:
                    continue
                duration = (item.get('duration') or '15 daqiqa').strip()
                youtube_url = (item.get('youtube_url') or '').strip()
                description = (item.get('description') or '').strip()
                order_index = int(item.get('order_index') or (mod.lessons.count() + 1))

                lesson = CourseLesson.objects.create(
                    module=mod,
                    title=title,
                    duration=duration,
                    youtube_url=youtube_url,
                    description=description,
                    order_index=order_index
                )
                created_lessons.append(lesson.id)

            if module_id:
                m = CourseModule.objects.filter(id=module_id).first()
                if m:
                    m.lessons_count = m.lessons.count()
                    m.save(update_fields=['lessons_count'])

            return Response({
                'success': True,
                'message': f"{len(created_lessons)} ta video darslik muvaffaqiyatli qo'shildi!",
                'count': len(created_lessons)
            }, status=status.HTTP_201_CREATED)

        # Single lesson creation
        if not module_id:
            return Response({'success': False, 'message': 'Modul tanlanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        mod = CourseModule.objects.filter(id=module_id).first()
        if not mod:
            return Response({'success': False, 'message': 'Modul topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        title = (request.data.get('title') or '').strip()
        if not title:
            return Response({'success': False, 'message': 'Video nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        duration = (request.data.get('duration') or '15 daqiqa').strip()
        youtube_url = (request.data.get('youtube_url') or '').strip()
        description = (request.data.get('description') or '').strip()
        order_index = int(request.data.get('order_index') or (mod.lessons.count() + 1))

        lesson = CourseLesson.objects.create(
            module=mod,
            title=title,
            duration=duration,
            youtube_url=youtube_url,
            description=description,
            order_index=order_index
        )
        mod.lessons_count = mod.lessons.count()
        mod.save(update_fields=['lessons_count'])

        return Response({
            'success': True,
            'message': 'Video darslik muvaffaqiyatli yaratildi!',
            'lesson': {
                'id': lesson.id,
                'module_id': lesson.module_id,
                'title': lesson.title,
                'duration': lesson.duration,
                'youtube_url': lesson.youtube_url,
                'description': lesson.description,
                'order_index': lesson.order_index
            }
        }, status=status.HTTP_201_CREATED)

    elif request.method == 'PUT':
        lesson_id = request.data.get('id') or request.GET.get('id')
        lesson = CourseLesson.objects.filter(id=lesson_id).first()
        if not lesson:
            return Response({'success': False, 'message': 'Darslik topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        if 'title' in request.data:
            lesson.title = (request.data.get('title') or '').strip()
        if 'duration' in request.data:
            lesson.duration = (request.data.get('duration') or '').strip()
        if 'youtube_url' in request.data:
            lesson.youtube_url = (request.data.get('youtube_url') or '').strip()
        if 'description' in request.data:
            lesson.description = (request.data.get('description') or '').strip()
        if 'order_index' in request.data:
            lesson.order_index = int(request.data.get('order_index') or lesson.order_index)

        lesson.save()
        return Response({'success': True, 'message': 'Darslik yangilandi!'}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        lesson_id = request.GET.get('id') or request.data.get('id')
        lesson = CourseLesson.objects.filter(id=lesson_id).first()
        if lesson:
            mod = lesson.module
            lesson.delete()
            if mod:
                mod.lessons_count = mod.lessons.count()
                mod.save(update_fields=['lessons_count'])
            return Response({'success': True, 'message': 'Darslik o\'chirildi!'})
        return Response({'success': False, 'message': 'Darslik topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def course_tests_view(request):
    if request.method == 'GET':
        module_id = request.GET.get('module_id')
        course_id = request.GET.get('course_id')
        qs = CourseTest.objects.all().select_related('module', 'module__course')
        if module_id:
            qs = qs.filter(module_id=module_id)
        elif course_id:
            qs = qs.filter(module__course_id=course_id)

        data = []
        for t in qs:
            audio_url = request.build_absolute_uri(t.audio_file.url) if t.audio_file else None
            data.append({
                'id': t.id,
                'module_id': t.module_id,
                'module_title': t.module.title if t.module else '',
                'course_id': t.module.course_id if t.module else None,
                'title': t.title,
                'test_type': t.test_type,
                'question': t.question,
                'audio_url': audio_url,
                'reading_text': t.reading_text,
                'options': t.options or [],
                'correct_answer': t.correct_answer,
                'tg_bot_link': t.tg_bot_link,
                'tg_channel': t.tg_channel,
                'duration_minutes': t.duration_minutes or 15,
                'passing_percentage': t.passing_percentage or 60,
                'order_index': t.order_index,
                'created_at': t.created_at.strftime('%d.%m.%Y %H:%M') if t.created_at else ''
            })
        return Response({'success': True, 'count': len(data), 'tests': data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        module_id = request.data.get('module_id')
        if not module_id:
            return Response({'success': False, 'message': 'Modul tanlanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        mod = CourseModule.objects.filter(id=module_id).first()
        if not mod:
            return Response({'success': False, 'message': 'Modul topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        title = (request.data.get('title') or '').strip()
        if not title:
            return Response({'success': False, 'message': 'Test nomi kiritilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        test_type = request.data.get('test_type', 'abcd').strip()
        question = (request.data.get('question') or '').strip()
        reading_text = (request.data.get('reading_text') or '').strip()
        correct_answer = (request.data.get('correct_answer') or '').strip()
        tg_bot_link = (request.data.get('tg_bot_link') or '').strip()
        tg_channel = (request.data.get('tg_channel') or '').strip()
        duration_minutes = int(request.data.get('duration_minutes') or 15)
        passing_percentage = int(request.data.get('passing_percentage') or 60)
        order_index = int(request.data.get('order_index') or (mod.tests.count() + 1))

        # Audio file upload (for listening)
        audio_file = request.FILES.get('audio') or request.FILES.get('audio_file')

        # Options parsing
        options_raw = request.data.get('options')
        options = []
        if options_raw:
            if isinstance(options_raw, str):
                try:
                    options = json.loads(options_raw)
                except Exception:
                    options = [opt.strip() for opt in options_raw.split(',') if opt.strip()]
            elif isinstance(options_raw, list):
                options = options_raw

        test_obj = CourseTest.objects.create(
            module=mod,
            title=title,
            test_type=test_type,
            question=question,
            audio_file=audio_file,
            reading_text=reading_text,
            options=options,
            correct_answer=correct_answer,
            tg_bot_link=tg_bot_link,
            tg_channel=tg_channel,
            duration_minutes=duration_minutes,
            passing_percentage=passing_percentage,
            order_index=order_index
        )

        mod.tests_count = mod.tests.count()
        mod.save(update_fields=['tests_count'])

        audio_url = request.build_absolute_uri(test_obj.audio_file.url) if test_obj.audio_file else None
        return Response({
            'success': True,
            'message': 'Test muvaffaqiyatli yaratildi!',
            'test': {
                'id': test_obj.id,
                'module_id': test_obj.module_id,
                'title': test_obj.title,
                'test_type': test_obj.test_type,
                'question': test_obj.question,
                'audio_url': audio_url,
                'reading_text': test_obj.reading_text,
                'options': test_obj.options,
                'correct_answer': test_obj.correct_answer,
                'tg_bot_link': test_obj.tg_bot_link,
                'tg_channel': test_obj.tg_channel,
                'duration_minutes': test_obj.duration_minutes,
                'passing_percentage': test_obj.passing_percentage,
                'order_index': test_obj.order_index
            }
        }, status=status.HTTP_201_CREATED)

    elif request.method == 'PUT':
        test_id = request.data.get('id') or request.GET.get('id')
        test_obj = CourseTest.objects.filter(id=test_id).first()
        if not test_obj:
            return Response({'success': False, 'message': 'Test topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        if 'title' in request.data:
            test_obj.title = (request.data.get('title') or '').strip()
        if 'test_type' in request.data:
            test_obj.test_type = request.data.get('test_type').strip()
        if 'question' in request.data:
            test_obj.question = (request.data.get('question') or '').strip()
        if 'reading_text' in request.data:
            test_obj.reading_text = (request.data.get('reading_text') or '').strip()
        if 'correct_answer' in request.data:
            test_obj.correct_answer = (request.data.get('correct_answer') or '').strip()
        if 'tg_bot_link' in request.data:
            test_obj.tg_bot_link = (request.data.get('tg_bot_link') or '').strip()
        if 'tg_channel' in request.data:
            test_obj.tg_channel = (request.data.get('tg_channel') or '').strip()
        if 'duration_minutes' in request.data:
            test_obj.duration_minutes = int(request.data.get('duration_minutes') or 15)
        if 'passing_percentage' in request.data:
            test_obj.passing_percentage = int(request.data.get('passing_percentage') or 60)
        if 'order_index' in request.data:
            test_obj.order_index = int(request.data.get('order_index') or test_obj.order_index)

        audio_file = request.FILES.get('audio') or request.FILES.get('audio_file')
        if audio_file:
            test_obj.audio_file = audio_file

        options_raw = request.data.get('options')
        if options_raw is not None:
            if isinstance(options_raw, str):
                try:
                    test_obj.options = json.loads(options_raw)
                except Exception:
                    test_obj.options = [opt.strip() for opt in options_raw.split(',') if opt.strip()]
            elif isinstance(options_raw, list):
                test_obj.options = options_raw

        test_obj.save()
        return Response({'success': True, 'message': 'Test muvaffaqiyatli yangilandi!'}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        test_id = request.GET.get('id') or request.data.get('id')
        test_obj = CourseTest.objects.filter(id=test_id).first()
        if test_obj:
            mod = test_obj.module
            test_obj.delete()
            if mod:
                mod.tests_count = mod.tests.count()
                mod.save(update_fields=['tests_count'])
            return Response({'success': True, 'message': 'Test o\'chirildi!'})
        return Response({'success': False, 'message': 'Test topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
def course_certificates_view(request):
    if request.method == 'GET':
        course_id = request.GET.get('course_id')
        if not course_id:
            return Response({'success': False, 'message': 'Kurs ID ko\'rsatilmadi!'}, status=status.HTTP_400_BAD_REQUEST)

        cert = CourseCertificate.objects.filter(course_id=course_id).first()
        if not cert:
            return Response({'success': True, 'certificate': None}, status=status.HTTP_200_OK)

        pdf_url = request.build_absolute_uri(cert.pdf_file.url) if cert.pdf_file else None
        pdf_name = cert.pdf_file.name.split('/')[-1] if cert.pdf_file else ''

        return Response({
            'success': True,
            'certificate': {
                'id': cert.id,
                'course_id': cert.course_id,
                'title': cert.title,
                'pdf_url': pdf_url,
                'pdf_name': pdf_name,
                'created_at': cert.created_at.strftime('%d.%m.%Y %H:%M') if cert.created_at else ''
            }
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        course_id = request.data.get('course_id')
        if not course_id:
            return Response({'success': False, 'message': 'Kurs ID ko\'rsatilmadi!'}, status=status.HTTP_400_BAD_REQUEST)

        course = Course.objects.filter(id=course_id).first()
        if not course:
            return Response({'success': False, 'message': 'Kurs topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        pdf_file = request.FILES.get('pdf') or request.FILES.get('pdf_file')
        if not pdf_file:
            return Response({'success': False, 'message': 'PDF fayl yuklanishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        title = (request.data.get('title') or 'Sertifikat').strip()

        cert = CourseCertificate.objects.filter(course=course).first()
        if cert:
            cert.title = title
            cert.pdf_file = pdf_file
            cert.save()
        else:
            cert = CourseCertificate.objects.create(
                course=course,
                title=title,
                pdf_file=pdf_file
            )

        course.has_certificate = True
        course.save(update_fields=['has_certificate'])

        pdf_url = request.build_absolute_uri(cert.pdf_file.url) if cert.pdf_file else None
        pdf_name = cert.pdf_file.name.split('/')[-1] if cert.pdf_file else ''

        return Response({
            'success': True,
            'message': 'Sertifikat muvaffaqiyatli yuklandi va saqlandi!',
            'certificate': {
                'id': cert.id,
                'course_id': cert.course_id,
                'title': cert.title,
                'pdf_url': pdf_url,
                'pdf_name': pdf_name,
                'created_at': cert.created_at.strftime('%d.%m.%Y %H:%M') if cert.created_at else ''
            }
        }, status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        cert_id = request.GET.get('id') or request.data.get('id')
        course_id = request.GET.get('course_id') or request.data.get('course_id')

        cert = None
        if cert_id:
            cert = CourseCertificate.objects.filter(id=cert_id).first()
        elif course_id:
            cert = CourseCertificate.objects.filter(course_id=course_id).first()

        if cert:
            course = cert.course
            cert.delete()
            return Response({'success': True, 'message': 'Sertifikat muvaffaqiyatli o\'chirildi!'})
        return Response({'success': False, 'message': 'Sertifikat topilmadi!'}, status=status.HTTP_404_NOT_FOUND)


def _serialize_application(request, app):
    return {
        'id': app.id,
        'user_id': app.user.user_id if app.user else None,
        'user_name': app.user_name,
        'user_phone': app.user_phone,
        'user_email': app.user_email,
        'course_id': app.course.id if app.course else None,
        'course_title': app.course.title if app.course else '',
        'course_category': app.course.category.name if (app.course and app.course.category) else '',
        'course_price': app.course.price if app.course else '',
        'status': app.status,
        'created_at': app.created_at.strftime('%d.%m.%Y %H:%M') if app.created_at else '',
        'created_at_raw': app.created_at.isoformat() if app.created_at else '',
    }


@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def course_applications_view(request, application_id=None):
    from django.db.models import Q

    if request.method == 'GET':
        app_id = application_id or request.GET.get('id')
        status_filter = request.GET.get('status')
        search_query = request.GET.get('search', '').strip()

        qs = CourseApplication.objects.select_related('course', 'course__category', 'user').all()

        if app_id:
            app = qs.filter(id=app_id).first()
            if not app:
                return Response({'success': False, 'message': 'Ariza topilmadi!'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'success': True, 'application': _serialize_application(request, app)})

        if status_filter and status_filter != 'all':
            qs = qs.filter(status=status_filter)

        if search_query:
            qs = qs.filter(
                Q(user_name__icontains=search_query) |
                Q(user_phone__icontains=search_query) |
                Q(user_email__icontains=search_query) |
                Q(course__title__icontains=search_query)
            )

        apps_list = [_serialize_application(request, a) for a in qs]

        total_count = CourseApplication.objects.count()
        pending_count = CourseApplication.objects.filter(status='pending').count()
        approved_count = CourseApplication.objects.filter(status='approved').count()
        rejected_count = CourseApplication.objects.filter(status='rejected').count()

        return Response({
            'success': True,
            'count': len(apps_list),
            'applications': apps_list,
            'stats': {
                'total': total_count,
                'pending': pending_count,
                'approved': approved_count,
                'rejected': rejected_count
            }
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        course_id = request.data.get('course_id')
        user_id = request.data.get('user_id')
        user_name = (request.data.get('user_name') or '').strip()
        user_phone = (request.data.get('user_phone') or '').strip()
        user_email = (request.data.get('user_email') or '').strip()

        if not course_id:
            return Response({'success': False, 'message': 'Kurs ID ko\'rsatilishi shart!'}, status=status.HTTP_400_BAD_REQUEST)

        course = Course.objects.filter(id=course_id).first()
        if not course:
            return Response({'success': False, 'message': 'Kurs topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        user = None
        if user_id:
            user = CustomUser.objects.filter(user_id=user_id).first()
        if not user and user_email:
            user = CustomUser.objects.filter(email__iexact=user_email).first()
        if not user and user_phone:
            user = CustomUser.objects.filter(phone=user_phone).first()

        if user:
            if not user_name:
                user_name = user.name
            if not user_phone and user.phone:
                user_phone = user.phone
            if not user_email and user.email:
                user_email = user.email

        if not user_name:
            user_name = 'Talaba'
        if not user_phone:
            user_phone = 'Noma\'lum'

        # Check existing pending application
        existing_app = None
        if user:
            existing_app = CourseApplication.objects.filter(user=user, course=course, status='pending').first()
        elif user_phone and user_phone != 'Noma\'lum':
            existing_app = CourseApplication.objects.filter(user_phone=user_phone, course=course, status='pending').first()

        if existing_app:
            return Response({
                'success': True,
                'message': 'Siz ushbu kursga ariza berdingiz, sizga operatorlarimiz aloqaga chiqishadi',
                'application': _serialize_application(request, existing_app)
            }, status=status.HTTP_200_OK)

        app = CourseApplication.objects.create(
            user=user,
            course=course,
            user_name=user_name,
            user_phone=user_phone,
            user_email=user_email,
            status='pending'
        )

        return Response({
            'success': True,
            'message': 'Siz ushbu kursga ariza berdingiz, sizga operatorlarimiz aloqaga chiqishadi',
            'application': _serialize_application(request, app)
        }, status=status.HTTP_201_CREATED)

    elif request.method in ['PUT', 'PATCH']:
        app_id = application_id or request.data.get('id') or request.GET.get('id')
        if not app_id:
            return Response({'success': False, 'message': 'Ariza ID ko\'rsatilmadi!'}, status=status.HTTP_400_BAD_REQUEST)

        app = CourseApplication.objects.filter(id=app_id).first()
        if not app:
            return Response({'success': False, 'message': 'Ariza topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['pending', 'approved', 'rejected']:
            return Response({'success': False, 'message': 'Noto\'g\'ri status qiymati!'}, status=status.HTTP_400_BAD_REQUEST)

        app.status = new_status
        app.save()

        # If approved, enroll user!
        if new_status == 'approved':
            user = app.user
            if not user:
                if app.user_email:
                    user = CustomUser.objects.filter(email__iexact=app.user_email).first()
                if not user and app.user_phone and app.user_phone != 'Noma\'lum':
                    user = CustomUser.objects.filter(phone=app.user_phone).first()

                if not user:
                    new_id = f"USR-{1001 + CustomUser.objects.count()}"
                    today_str = datetime.date.today().strftime('%d.%m.%Y')
                    user = CustomUser.objects.create(
                        user_id=new_id,
                        name=app.user_name,
                        email=app.user_email or f"user_{app.id}@punyo.uz",
                        phone=app.user_phone,
                        role='Talaba',
                        status='Faol',
                        joined_date=today_str,
                        auth_provider='application'
                    )

                app.user = user
                app.save(update_fields=['user'])

            # Enroll user in course
            enrollment, created = UserCourseEnrollment.objects.get_or_create(user=user, course=app.course)
            if not created:
                enrollment.completed_lessons = []
                enrollment.test_histories = {}
                enrollment.progress_percent = 0
                enrollment.save(update_fields=['completed_lessons', 'test_histories', 'progress_percent'])

            # Update user courses count
            user.courses_count = UserCourseEnrollment.objects.filter(user=user).count()
            user.save(update_fields=['courses_count'])

            # Update course students count
            enrollment_count = UserCourseEnrollment.objects.filter(course=app.course).count()
            app.course.students_count = str(enrollment_count)
            app.course.save(update_fields=['students_count'])

        elif new_status == 'rejected':
            # If rejected, unenroll user from course if they were enrolled
            if app.course:
                user = app.user
                if not user and app.user_email:
                    user = CustomUser.objects.filter(email__iexact=app.user_email).first()
                if not user and app.user_phone and app.user_phone != 'Noma\'lum':
                    user = CustomUser.objects.filter(phone=app.user_phone).first()
                if user:
                    UserCourseEnrollment.objects.filter(user=user, course=app.course).delete()
                    user.courses_count = UserCourseEnrollment.objects.filter(user=user).count()
                    user.save(update_fields=['courses_count'])
                enrollment_count = UserCourseEnrollment.objects.filter(course=app.course).count()
                app.course.students_count = str(enrollment_count)
                app.course.save(update_fields=['students_count'])

        return Response({
            'success': True,
            'message': 'Ariza holati muvaffaqiyatli yangilandi!',
            'application': _serialize_application(request, app)
        }, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        app_id = application_id or request.data.get('id') or request.GET.get('id')
        app = CourseApplication.objects.filter(id=app_id).first()
        if not app:
            return Response({'success': False, 'message': 'Ariza topilmadi!'}, status=status.HTTP_404_NOT_FOUND)
        app.delete()
        return Response({'success': True, 'message': 'Ariza muvaffaqiyatli o\'chirildi!'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def user_enrolled_courses_view(request):
    user_id = request.GET.get('user_id')
    email = request.GET.get('email')
    phone = request.GET.get('phone')

    user = None
    if user_id:
        if str(user_id).isdigit():
            user = CustomUser.objects.filter(id=int(user_id)).first()
        if not user:
            user = CustomUser.objects.filter(user_id=str(user_id)).first()
    if not user and email:
        user = CustomUser.objects.filter(email__iexact=email).first()
    if not user and phone:
        user = CustomUser.objects.filter(phone=phone).first()

    # Sync any approved applications for this user/phone
    if user:
        approved_apps = CourseApplication.objects.filter(user=user, status='approved')
        for app in approved_apps:
            if app.course:
                UserCourseEnrollment.objects.get_or_create(user=user, course=app.course)
    elif phone:
        approved_apps = CourseApplication.objects.filter(user_phone=phone, status='approved')
        for app in approved_apps:
            if app.user and app.course:
                UserCourseEnrollment.objects.get_or_create(user=app.user, course=app.course)
                user = app.user

    if not user:
        return Response({'success': True, 'count': 0, 'courses': []}, status=status.HTTP_200_OK)

    enrollments = UserCourseEnrollment.objects.filter(user=user).select_related('course', 'course__category').all()
    courses_data = []
    for enr in enrollments:
        c = enr.course
        icon_url = request.build_absolute_uri(c.icon.url) if c.icon else None
        modules_count = c.modules.count()
        lessons_count = CourseLesson.objects.filter(module__course=c).count()
        tests_count = CourseTest.objects.filter(module__course=c).count()

        courses_data.append({
            'id': c.id,
            'course_id': c.id,
            'title': c.title,
            'name': c.title,
            'category_name': c.category.name if c.category else '',
            'icon': icon_url,
            'icon_url': icon_url,
            'hint': c.hint,
            'level': c.hint or 'Boshlang\'ich daraja',
            'duration': c.duration,
            'price': c.price,
            'progress': enr.progress_percent,
            'enrolled_at': enr.enrolled_at.strftime('%d.%m.%Y') if enr.enrolled_at else '',
            'modules_count': modules_count,
            'lessons_count': lessons_count,
            'tests_count': tests_count,
        })

    return Response({'success': True, 'count': len(courses_data), 'courses': courses_data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def course_user_status_view(request):
    course_id = request.GET.get('course_id')
    user_id = request.GET.get('user_id')
    email = request.GET.get('email')
    phone = request.GET.get('phone')

    if not course_id:
        return Response({'success': False, 'message': 'course_id kiritilishi shart'}, status=status.HTTP_400_BAD_REQUEST)

    course = Course.objects.filter(id=course_id).first()
    if not course:
        return Response({'success': False, 'message': 'Kurs topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    user = None
    if user_id:
        if str(user_id).isdigit():
            user = CustomUser.objects.filter(id=int(user_id)).first()
        if not user:
            user = CustomUser.objects.filter(user_id=str(user_id)).first()
    if not user and email:
        user = CustomUser.objects.filter(email__iexact=email).first()
    if not user and phone:
        user = CustomUser.objects.filter(phone=phone).first()

    # 1. Check if enrolled
    enrolled = False
    if user:
        enrolled = UserCourseEnrollment.objects.filter(user=user, course=course).exists()

    # 2. Check application status
    app = None
    if user:
        app = CourseApplication.objects.filter(user=user, course=course).order_by('-created_at').first()
    if not app and phone:
        app = CourseApplication.objects.filter(user_phone=phone, course=course).order_by('-created_at').first()
    if not app and email:
        app = CourseApplication.objects.filter(user_email__iexact=email, course=course).order_by('-created_at').first()

    app_status = app.status if app else None
    if enrolled:
        app_status = 'approved'

    return Response({
        'success': True,
        'course_id': course.id,
        'enrolled': enrolled,
        'application_status': app_status,  # 'pending', 'approved', 'rejected' or None
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def course_enrolled_students_view(request, enrollment_id=None):
    from django.db.models import Q

    if request.method == 'GET':
        course_id = request.GET.get('course_id')
        search_query = request.GET.get('search', '').strip()

        qs = UserCourseEnrollment.objects.select_related('user', 'course', 'course__category').all()

        if course_id and course_id != 'all':
            qs = qs.filter(course_id=course_id)

        if search_query:
            qs = qs.filter(
                Q(user__name__icontains=search_query) |
                Q(user__email__icontains=search_query) |
                Q(user__phone__icontains=search_query) |
                Q(user__user_id__icontains=search_query) |
                Q(course__title__icontains=search_query)
            )

        students_data = []
        for enr in qs:
            app = CourseApplication.objects.filter(user=enr.user, course=enr.course, status='approved').first()
            students_data.append({
                'id': enr.id,
                'enrollment_id': enr.id,
                'user_id': enr.user.user_id,
                'name': enr.user.name or (app.user_name if app else 'Talaba'),
                'email': enr.user.email or (app.user_email if app else ''),
                'phone': enr.user.phone or (app.user_phone if app else ''),
                'course_id': enr.course.id,
                'course_title': enr.course.title,
                'course_category': enr.course.category.name if enr.course.category else '',
                'course_price': enr.course.price,
                'progress_percent': enr.progress_percent,
                'enrolled_at': enr.enrolled_at.strftime('%d.%m.%Y %H:%M') if enr.enrolled_at else '',
                'status': 'Faol o\'quvchi',
            })

        unique_users_count = qs.values('user').distinct().count()
        unique_courses_count = qs.values('course').distinct().count()

        return Response({
            'success': True,
            'count': len(students_data),
            'students': students_data,
            'stats': {
                'total_enrolled': len(students_data),
                'unique_students': unique_users_count,
                'courses_count': unique_courses_count,
            }
        }, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        enr_id = enrollment_id or request.GET.get('id') or request.data.get('id')
        if not enr_id:
            return Response({'success': False, 'message': 'Enrollment ID ko\'rsatilmadi!'}, status=status.HTTP_400_BAD_REQUEST)

        enr = UserCourseEnrollment.objects.filter(id=enr_id).first()
        if not enr:
            return Response({'success': False, 'message': 'O\'quvchi topilmadi!'}, status=status.HTTP_404_NOT_FOUND)

        course = enr.course
        user = enr.user
        enr.delete()

        # Remove any corresponding application records for this user and course
        if course:
            app_qs = CourseApplication.objects.filter(course=course)
            if user:
                apps_to_del = app_qs.filter(Q(user=user) | Q(user_id=user.id))
                if user.phone and user.phone != 'Noma\'lum':
                    apps_to_del = apps_to_del | app_qs.filter(user_phone=user.phone)
                if user.email:
                    apps_to_del = apps_to_del | app_qs.filter(user_email__iexact=user.email)
                apps_to_del.delete()

        # Update counters
        if course:
            course.students_count = str(UserCourseEnrollment.objects.filter(course=course).count())
            course.save(update_fields=['students_count'])
        if user:
            user.courses_count = UserCourseEnrollment.objects.filter(user=user).count()
            user.save(update_fields=['courses_count'])

        return Response({'success': True, 'message': 'O\'quvchi kursdan muvaffaqiyatli chiqarildi!'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def course_progress_view(request):
    from django.db.models import Q

    if request.method == 'GET':
        course_id = request.GET.get('course_id')
        module_id = request.GET.get('module_id')
        user_id = request.GET.get('user_id')
        email = request.GET.get('email')
        phone = request.GET.get('phone')

        course = None
        if course_id:
            course = Course.objects.filter(id=course_id).first()
        elif module_id:
            mod = CourseModule.objects.filter(id=module_id).first()
            if mod:
                course = mod.course

        if not course:
            return Response({'success': False, 'message': 'Kurs topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        user = None
        if user_id:
            if str(user_id).isdigit():
                user = CustomUser.objects.filter(id=int(user_id)).first()
            if not user:
                user = CustomUser.objects.filter(user_id=str(user_id)).first()
        if not user and email:
            user = CustomUser.objects.filter(email__iexact=email).first()
        if not user and phone:
            user = CustomUser.objects.filter(phone=phone).first()

        if not user:
            return Response({
                'success': True,
                'enrolled': False,
                'completed_ids': [],
                'test_histories': {},
                'progress_percent': 0
            }, status=status.HTTP_200_OK)

        enr = UserCourseEnrollment.objects.filter(user=user, course=course).first()
        if not enr:
            return Response({
                'success': True,
                'enrolled': False,
                'completed_ids': [],
                'test_histories': {},
                'progress_percent': 0
            }, status=status.HTTP_200_OK)

        return Response({
            'success': True,
            'enrolled': True,
            'completed_ids': enr.completed_lessons or [],
            'test_histories': enr.test_histories or {},
            'progress_percent': enr.progress_percent or 0
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        course_id = request.data.get('course_id')
        module_id = request.data.get('module_id')
        user_id = request.data.get('user_id')
        email = request.data.get('email')
        phone = request.data.get('phone')
        item_id = request.data.get('item_id')
        test_history = request.data.get('test_history')
        completed_ids = request.data.get('completed_ids')

        course = None
        if course_id:
            course = Course.objects.filter(id=course_id).first()
        elif module_id:
            mod = CourseModule.objects.filter(id=module_id).first()
            if mod:
                course = mod.course

        if not course:
            return Response({'success': False, 'message': 'Kurs topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        user = None
        if user_id:
            if str(user_id).isdigit():
                user = CustomUser.objects.filter(id=int(user_id)).first()
            if not user:
                user = CustomUser.objects.filter(user_id=str(user_id)).first()
        if not user and email:
            user = CustomUser.objects.filter(email__iexact=email).first()
        if not user and phone:
            user = CustomUser.objects.filter(phone=phone).first()

        if not user:
            return Response({'success': False, 'message': 'Foydalanuvchi topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        enr = UserCourseEnrollment.objects.filter(user=user, course=course).first()
        if not enr:
            return Response({'success': False, 'message': 'O\'quvchi ushbu kursga a\'zo emas'}, status=status.HTTP_400_BAD_REQUEST)

        is_passed = True
        if test_history:
            if isinstance(test_history, list) and len(test_history) > 0:
                any_passed = any(att.get('isPassed') is True for att in test_history if isinstance(att, dict))
                if not any_passed:
                    is_passed = False
            elif isinstance(test_history, dict):
                if test_history.get('isPassed') is False:
                    is_passed = False

        if completed_ids is not None and isinstance(completed_ids, list):
            curr_completed = [cid for cid in completed_ids]
        else:
            curr_completed = list(enr.completed_lessons or [])
            if item_id and is_passed and item_id not in curr_completed:
                curr_completed.append(item_id)

        enr.completed_lessons = curr_completed

        if test_history and item_id:
            curr_histories = dict(enr.test_histories or {})
            if isinstance(test_history, list):
                curr_histories[item_id] = test_history
            elif isinstance(test_history, dict):
                existing = curr_histories.get(item_id)
                if isinstance(existing, list):
                    existing.append(test_history)
                    curr_histories[item_id] = existing
                elif isinstance(existing, dict):
                    curr_histories[item_id] = [existing, test_history]
                else:
                    curr_histories[item_id] = [test_history]
            enr.test_histories = curr_histories

        total_lessons = CourseLesson.objects.filter(module__course=course).count()
        total_tests = CourseTest.objects.filter(module__course=course).count()
        total_items = total_lessons + total_tests
        if total_items > 0:
            enr.progress_percent = min(100, int((len(curr_completed) / total_items) * 100))

        enr.save(update_fields=['completed_lessons', 'test_histories', 'progress_percent'])

        return Response({
            'success': True,
            'completed_ids': enr.completed_lessons,
            'test_histories': enr.test_histories,
            'progress_percent': enr.progress_percent
        }, status=status.HTTP_200_OK)



