from rest_framework import generics, permissions
from .serializers import AddressSerializer
from .models import Address
from .serializers import UserDetailsSerializer
from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Document
from .serializers import DocumentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from rest_framework.views import APIView


class DocumentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, request.user)
        headers = self.get_success_headers(serializer.data)
        # raise ValueError()
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, user):
        serializer.save(created_by=user, updated_by=user)


class DocumentListView(generics.ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class UserUpdateView(APIView):
    # Only authenticated users can update their data
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """
        Handle partial update (PATCH) for username and phone_number.
        """
        user = request.user  # Get the current authenticated user
        # partial=True allows updating only provided fields
        serializer = UserDetailsSerializer(
            user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressListCreateView(generics.ListCreateAPIView):
    """
    API to list and create user addresses.
    """
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """
    API to update or delete an address.
    """
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
