from django.shortcuts import render
from rest_framework.views import APIView  #RestFramework CBV
from rest_framework.response import Response # getting response from restframe api


from rest_framework.permissions import IsAuthenticated # token permission 

class Home(APIView):
    """" class based views in django rest framework a sample Api"""
    def get(self,request):
        content ={"message":"Hello world"}
        return Response(content)



class Jwtview(APIView):
    """"created a simple jwt auth in this class using rest framework jwtauth"""
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        content = {'message': 'django rest framework JWT auth'}
        return Response(content)


class Tokenview(APIView):
    """"created a simple Token auth in this class using rest framework Tokenauth"""
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        content = {'message': 'django rest framework Token auth'}
        return Response(content)