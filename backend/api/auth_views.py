# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# from dj_rest_auth.registration.views import SocialLoginView
# from django.conf import settings
# from django.shortcuts import redirect

# class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
#     adapter_class = GoogleOAuth2Adapter
#     callback_url = settings.GOOGLE_REDIRECT_URI
#     client_class = OAuth2Client

# def google_login_redirect(request) :
#     return redirect(settings.GOOGLE_LOGIN_REDIRECT_URL)