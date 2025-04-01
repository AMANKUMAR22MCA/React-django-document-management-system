from dj_rest_auth.serializers import LoginSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Document, Address
from dj_rest_auth.registration.serializers import RegisterSerializer  # ✅ Correct Import
from dj_rest_auth.serializers import UserDetailsSerializer
from .models import CustomUser


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "street", "city", "state",
                  "country", "zip_code", "is_default"]


UserModel = get_user_model()


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model without password
    """

    @staticmethod
    def validate_username(username):
        if 'allauth.account' not in settings.INSTALLED_APPS:
            return username

        from allauth.account.adapter import get_adapter
        username = get_adapter().clean_username(username)
        return username

    class Meta:
        model = UserModel
        fields = ("pk", "username", "email", "phone_number",
                  "first_name", "last_name")  # Added phone_number
        read_only_fields = ("email",)

    def update(self, instance, validated_data):
        # Update username and phone_number if provided in the request
        instance.username = validated_data.get('username', instance.username)
        instance.phone_number = validated_data.get(
            'phone_number', instance.phone_number)
        instance.save()
        return instance


class CustomLoginSerializer(LoginSerializer):
    username = None  # Remove default username field
    email = serializers.EmailField(required=True)  # Require email for login

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request=self.context.get(
                "request"), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password.")
        else:
            raise serializers.ValidationError(
                "Must include 'email' and 'password'.")

        attrs["user"] = user
        return attrs


User = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    phone_number = serializers.CharField(required=True, max_length=15)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["phone_number"] = self.validated_data.get("phone_number", "")
        print("cleaned data ...............")
        return data

    def save(self, request):
        user = super().save(request)
        # Ensure it's explicitly set
        user.phone_number = self.validated_data["phone_number"]
        user.save()
        return user


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.created_by.username if obj.created_by else "Unknown"  # Fetch username

    def get_file_type(self, obj):
        return obj.file.name.split('.')[-1]  # Extract file extension

    class Meta:
        model = Document
        fields = ['id', 'name', 'size', 'description', 'file',
                  'file_url', 'created_by_id', "username", "file_type"]

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None
