from django.urls import path
from api.views import book_views as views


urlpatterns = [
    path('',views.getBooks,name="books"),
    path('<str:pk>/reviews/',views.createBookReview,name="create-review"),
    path('top/',views.getTopBooks,name="top-books"),
    path('<str:pk>/',views.getBook,name="book"),
]
