import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'punyo_backend.settings')
django.setup()

from django.contrib.auth.models import User

if not User.objects.filter(username='punyo').exists():
    User.objects.create_superuser(
        username='punyo',
        email='admin@punyo.uz',
        password='punyo123',
        first_name='Punyo',
        last_name='Admin'
    )
    print("Superuser punyo created successfully!")
else:
    user = User.objects.get(username='punyo')
    user.set_password('punyo123')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("Superuser punyo updated with password punyo123!")
