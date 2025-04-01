from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
import os
from django.utils import timezone


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Email should be unique
    phone_number = models.CharField(
        max_length=15, unique=True, blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"  # Login using email
    REQUIRED_FIELDS = ["username"]  # Keep username as required

    def __str__(self):
        return self.email


User = get_user_model()


class BaseModel(models.Model):
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="%(class)s_created_by")
    updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="%(class)s_updated_by")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        abstract = True  # Ensures Django does not create a separate table for BaseModel

    def save(self, *args, user=None, **kwargs):
        """
        Overrides save method to automatically set created_by and updated_by.
        """
        if user:
            if not self.pk:  # Object is being created
                self.created_by = user
            self.updated_by = user  # Always update updated_by

        super().save(*args, **kwargs)  # Call the original save method


class Address(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="addresses")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)  # Mark the default address

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.country}, {self.zip_code}"


class Document(BaseModel):
    name = models.CharField(max_length=255, blank=False, null=False)
    size = models.PositiveIntegerField()  # Size in bytes
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='documents/', null=True)

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"

    def delete_file(self):
        """
        Deletes the file from storage and clears the file field in the database.
        """
        if self.file:
            # Delete the file from storage
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
            # Clear the file field
            self.file = None
            self.save(update_fields=['file'])
