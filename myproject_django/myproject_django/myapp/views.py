from django.shortcuts import render

from rest_framework.views import APIView 

from rest_framework.response import Response
from django.core import serializers
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated # auth 

from myapp.models import Book,Student,University

from rest_framework import viewsets
from myapp.serializers import UniversitySerializer, StudentSerializer

#Token Authentication using Django REST Framework

def sample(request):
   return render(request,"index.html")

class Home(APIView):
    permission_classes = (IsAuthenticated,) 
    def get(self,request):
        content ={"message":"Hello world"}
        return Response(content)


class Book_list(APIView):
    # permission_classes = (IsAuthenticated,) 
    def get(self,request):
        book_list = {}
        books = Book.objects.all()
        for book in books:
            book_list['title'] = book.title
            book_list['author'] = book.author
            book_list['pages'] = book.pages

        return Response(book_list)

        # data = serializers.serialize('json', books)
        # return HttpResponse(data, content_type="application/json")
        





# class StudentViewSet(viewsets.ModelViewSet):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# class UniversityViewSet(viewsets.ModelViewSet):
#     queryset = University.objects.all()
#     serializer_class = UniversitySerializer