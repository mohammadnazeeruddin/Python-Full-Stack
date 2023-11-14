from rest_framework import serializers
from .models import University, Student

class UniversitySerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = University
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student