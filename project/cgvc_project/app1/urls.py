from django.urls import path
from . import views
urlpatterns = [
    path('request_img/', views.request_img, name='request_img'),
    path('game/',views.game, name='game'),
    path('newdrawer/', views.newdrawer, name='newdrawer'),
    path('login/', views.login, name='login'),
    path('predict/', views.predict_image, name='predict'),
    path('save_image/', views.save_image, name='save_image'),
    path('drawer/', views.drawer, name='drawer'),
    path('', views.index, name='index'),
]