from django.urls import path
from . import views
urlpatterns = [
    path('predict/', views.predict_image, name='predict'),
    path('save_image/', views.save_image, name='save_image'),
    path('drawer/', views.drawer, name='drawer'),
    path('', views.index, name='index'),
]