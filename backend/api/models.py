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
