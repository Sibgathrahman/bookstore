from django.contrib import admin
from .models import *


class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "selling_price", "date")


admin.site.register(Product, ProductAdmin)


class AuthorAdmin(admin.ModelAdmin):
    list_display = ("id", 'name', 'date')


admin.site.register(Author, AuthorAdmin)
