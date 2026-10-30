from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    fee = models.IntegerField()

    def __str__(self):
        return self.name


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    joined_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name