from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api_views import StudentViewSet, CourseViewSet

router = DefaultRouter()
router.register('students', StudentViewSet)
router.register('courses', CourseViewSet)

urlpatterns = [
    path('', views.student_list, name='student_list'),
    path('add/', views.student_create, name='student_create'),
    path('edit/<int:pk>/', views.student_update, name='student_update'),
    path('delete/<int:pk>/', views.student_delete, name='student_delete'),

    path('courses/', views.course_list, name='course_list'),
    path('courses/add/', views.course_create, name='course_create'),
    path('courses/edit/<int:pk>/', views.course_update, name='course_update'),
    path('courses/delete/<int:pk>/', views.course_delete, name='course_delete'),

    path('api/', include(router.urls)),
]