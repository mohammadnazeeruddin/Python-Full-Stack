
from django.contrib import admin
from django.conf.urls import url,include

from myapp import views

from rest_framework.authtoken.views import obtain_auth_token  #token

from rest_framework_simplejwt import views as jwt_views # jwt auth


urlpatterns = [

    url('admin/', admin.site.urls),

    # url('',views.sample),


    url('hello/',views.Home.as_view(),name = 'home'),

    url('book/',views.Book_list.as_view(),name = 'book_list'),

    url('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'), #jwt auth
    url('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'), #jwt auth


    # url('student/',views.StudentViewSet,name = 'student'),
    # url('api-token-auth/', obtain_auth_token, name='api_token_auth'), # token Authorization




]












# pip install djangorestframework # token auth

# pip install djangorestframework_simplejwt # jwt auth

# pip install httpie

"""
#Token Authorization

python manage.py createsuperuser
http post http://127.0.0.1:8001/api-token-auth/ username=python password=python@7
http http://127.0.0.1:8001/hello/ 'Authorization: Token 961d2c078e1af4d1bf0a05e44f2d8ba7f33adde8'
"""

"""
# Jwt Authorization

python manage.py createsuperuser
http post http://127.0.0.1:8001/api/token/ username=nazeer2 password=mohammad    # Jwt auth
http http://127.0.0.1:8001/hello/ "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"     # jwt auth
"""


"""
The access token is usually short-lived (expires in 5 min or so, can be customized though).

The refresh token lives a little bit longer (expires in 24 hours, also customizable). 
It is comparable to an authentication session. After it expires, 
you need a full login with username + password again.

"""