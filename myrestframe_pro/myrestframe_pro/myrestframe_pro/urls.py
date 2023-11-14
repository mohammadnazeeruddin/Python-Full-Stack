"""myrestframe_pro URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from restapp import views

from rest_framework_simplejwt import views as jwt_views  # JWT token views here

urlpatterns = [
    path('admin/', admin.site.urls),

    path('hello/',views.Home.as_view(),name = 'home'), # restframework with CBV

    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'), # token generating here
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path('welcome/', views.Jwtview.as_view(), name='hello'), # creating a simple jwt auth 

    path('token/', views.Tokenview.as_view(), name='hello'), # creating a simple jwt auth 

]

# createsuperuser  


# http post http://127.0.0.1:8000/api/token/ username=nazeer123 password=mohammad

# http http://127.0.0.1:8000/welcome/ "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTQ1MjI0MjAwLCJqdGkiOiJlMGQxZDY2MjE5ODc0ZTY3OWY0NjM0ZWU2NTQ2YTIwMCIsInVzZXJfaWQiOjF9.9eHat3CvRQYnb5EdcgYFzUyMobXzxlAVh_IAgqyvzCE"

# http post http://127.0.0.1:8000/api/token/refresh/ refresh=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTU4MTIzMzUzMSwianRpIjoiYTEyNDg4YjgyODI1NDM5NWIzODM4YmY2YmZhOGVhYjciLCJ1c2VyX2lkIjoxfQ.YfvoncSp_S2Pwg-igMbvcwjyWpgbQgtU2ABfO1WN-Ss


# python3 manage.py drf_create_token username

# http http://127.0.0.1:8000/token/ 'Authorization: Token 9054f7aa9305e012b3c2300408c3dfdf390fcddf'


# pip3 install httpie