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
