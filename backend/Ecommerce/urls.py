from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # Django REST Framework authentication URLs
    path('api-auth/', include('rest_framework.urls')),

    # Token-based authentication for login
    path('api/login/', obtain_auth_token),

    # Include URLs from the 'Product' app
    path('api/', include('Product.urls')),

    # Include URLs from the 'cart' app
    path('api/', include('cart.urls')),

    # Include URLs from the 'order' app
    path('api/', include('order.urls')),
]

# Serve media files during development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve static files during development
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
