from django.urls import path
from .views import RegisterAPI, LoginAPI, LogoutAPI, LogoutAllAPI, UserAPI

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('logoutall/', LogoutAllAPI.as_view(), name='logoutall'),
    path('user/', UserAPI.as_view(), name='user'),
]
