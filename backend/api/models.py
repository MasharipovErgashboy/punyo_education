from django.db import models
import uuid

class CustomUser(models.Model):
    user_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=50, default='Talaba')
    courses_count = models.IntegerField(default=0)
    coins = models.IntegerField(default=500)
    status = models.CharField(max_length=50, default='Faol')
    joined_date = models.CharField(max_length=50)
    auth_provider = models.CharField(max_length=50, default='email')

    def __str__(self):
        return self.email

class Ad(models.Model):
    ad_id = models.CharField(max_length=50, unique=True)
    image_url = models.URLField(max_length=1000)
    order_index = models.IntegerField(default=999)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ad {self.ad_id} - Order {self.order_index}"


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Course(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=255)
    hint = models.CharField(max_length=255, blank=True, default='')
    icon = models.FileField(upload_to='courses/icons/', blank=True, null=True)
    intro_video_url = models.CharField(max_length=500, blank=True, default='')
    description = models.TextField(blank=True, default='')
    students_count = models.CharField(max_length=100, default='0')
    duration = models.CharField(max_length=100, default='0 soat')
    has_certificate = models.BooleanField(default=True)
    price = models.CharField(max_length=100, default='0 UZS')
    rating = models.FloatField(default=4.8)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Teacher(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='teachers')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True, default='')
    avatar = models.FileField(upload_to='teachers/avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"


class CourseModule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    lessons_count = models.IntegerField(default=0)
    tests_count = models.IntegerField(default=0)
    duration = models.CharField(max_length=100, default='0 soat')
    order_index = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_index', 'id']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class CourseLesson(models.Model):
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=100, default='15 daqiqa')
    youtube_url = models.CharField(max_length=500, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order_index = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_index', 'id']

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class CourseTest(models.Model):
    TEST_TYPES = (
        ('listening', 'Eshitish'),
        ('reading', 'O\'qish'),
        ('writing', 'Yozish'),
        ('abcd', 'ABCD'),
        ('speaking', 'Gapirish'),
    )
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=255)
    test_type = models.CharField(max_length=50, choices=TEST_TYPES, default='abcd')
    question = models.TextField(blank=True, default='')
    audio_file = models.FileField(upload_to='tests/audio/', blank=True, null=True)
    reading_text = models.TextField(blank=True, default='')
    options = models.JSONField(default=list, blank=True)
    correct_answer = models.CharField(max_length=255, blank=True, default='')
    tg_bot_link = models.CharField(max_length=500, blank=True, default='')
    tg_channel = models.CharField(max_length=255, blank=True, default='')
    order_index = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order_index', 'id']

    def __str__(self):
        return f"[{self.test_type}] {self.title}"


class CourseCertificate(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    title = models.CharField(max_length=255, default='Sertifikat')
    pdf_file = models.FileField(upload_to='certificates/templates/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class CourseApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Kutilmoqda'),
        ('approved', 'Tasdiqlangan'),
        ('rejected', 'Rad etilgan'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='course_applications')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='applications')
    user_name = models.CharField(max_length=255)
    user_phone = models.CharField(max_length=50)
    user_email = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user_name} - {self.course.title} ({self.status})"


class UserCourseEnrollment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='enrolled_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrolled_students')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress_percent = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.name} -> {self.course.title}"


