from .views import UserUpdateView
from .views import AddressListCreateView, AddressUpdateView
from django.urls import path
from django.contrib import admin
from django.urls import path, include
from .views import DocumentCreateView, DocumentListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
# from .auth_views import GoogleLogin,google_login_redirect
urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/register/', include('dj_rest_auth.registration.urls')),

    # JWT Token Endpoints
    path('auth/token/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),  # Get access & refresh token
    path('auth/token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),  # Get new access token
    path('auth/token/verify/', TokenVerifyView.as_view(),
         name='token_verify'),  # Verify token

    path('documents/', DocumentCreateView.as_view(),
         name='document-create'),  # Upload document
    path('documents/list/', DocumentListView.as_view(),
         name='document-list'),  # List all documents
   
]


urlpatterns += [
    path("addresses/", AddressListCreateView.as_view(),
         name="address-list-create"),
    path("addresses/<int:pk>/", AddressUpdateView.as_view(), name="address-update"),
]


urlpatterns += [
    path('auth/user/update/', UserUpdateView.as_view(), name='user_update'),
]
