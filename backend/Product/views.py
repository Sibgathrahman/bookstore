import json

from django.http import JsonResponse
from rest_framework import views, viewsets, generics, mixins
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


class ProductView(generics.GenericAPIView, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Product.objects.all().order_by("-id")
    serializer_class = ProductSerializers
    lookup_field = "id"

    def get(self, request, id=None):
        try:
            # If 'id' is provided, retrieve a specific product
            if id:
                return self.retrieve(request)
            # If 'id' is not provided, list all products
            else:
                return self.list(request)
        except Product.DoesNotExist:
            # Handle the case where the requested product does not exist
            return Response({"error": True, "message": f"Product with id {id} not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Handle other unexpected errors
            return Response({"error": True, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class RegisterView(views.APIView):
    def post(self, request):
        try:
            # Create a user using the provided data
            serializer = UserSerializer(data=request.data)

            # Check if the serializer is valid
            if serializer.is_valid():
                # Save the user and return a success response
                serializer.save()
                return Response({
                    "error": False,
                    "message": f"User created for '{serializer.data['username']}'",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)  # HTTP 201 Created for successful creation
            else:
                # Return validation errors if the serializer is not valid
                return Response({
                    "error": True,
                    "message": "Validation error",
                    "data": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)  # HTTP 400 Bad Request for validation errors

        except Exception as e:
            # Handle unexpected errors and return an appropriate response
            return Response({
                "error": True,
                "message": f"An unexpected error occurred: {str(e)}",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # HTTP 500 Internal Server Error for unexpected errors



class ProfileView(views.APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            # Retrieve the profile associated with the authenticated user
            query = Profile.objects.get(user=request.user)
            serializer = ProfileSerializers(query)

            # Return a success response with the profile data
            response_message = {"error": False, "data": serializer.data}
            return Response(response_message)

        except Profile.DoesNotExist:
            # Handle the case where the profile for the authenticated user does not exist
            response_message = {"error": True, "message": "Profile not found for the authenticated user"}
            return Response(response_message, status=404)  # HTTP 404 Not Found

        except Exception as e:
            # Handle other unexpected errors
            print(e)
            response_message = {"error": True, "message": "Something went wrong"}
            return Response(response_message, status=500)  # HTTP 500 Internal Server Error



class CategoryViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            # Retrieve all categories and serialize the data
            query = Category.objects.all()
            serializer = CategorySerializer(query, many=True)
            return Response(serializer.data)

        except Exception as e:
            # Handle unexpected errors
            print(e)
            return Response({"error": True, "message": "Something went wrong"}, status=500)  # HTTP 500 Internal Server Error

    def retrieve(self, request, pk=None):
        try:
            # Retrieve a specific category by its primary key, return 404 if not found
            query = get_object_or_404(Category, id=pk)
            serializer = CategorySerializer(query)
            data_data = serializer.data
            all_data = []

            # Retrieve products associated with the category and serialize the data
            category_product = Product.objects.filter(category_id=data_data['id'])
            category_product_serializer = ProductSerializers(category_product, many=True)
            data_data['category_product'] = category_product_serializer.data
            all_data.append(data_data)

            return Response(all_data)

        except Exception as e:
            # Handle unexpected errors
            print(e)
            return Response({"error": True, "message": "Category not found"}, status=404)  # HTTP 404 Not Found



class UpdateUser(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        try:
            # Retrieve the authenticated user and update user data
            user = request.user
            data = request.data
            user_obj = User.objects.get(username=user)

            # Update user details
            user_obj.first_name = data["first_name"]
            user_obj.last_name = data["last_name"]
            user_obj.email = data["email"]
            user_obj.save()

            response_data = {"error": False, "message": "User data is updated"}

        except User.DoesNotExist:
            # Handle the case where the authenticated user does not exist
            response_data = {"error": True, "message": "User not found", "status": 404}  # HTTP 404 Not Found

        except Exception as e:
            # Handle unexpected errors
            print(e)
            response_data = {"error": True, "message": "User data could not be updated. Try again!", "status": 500}  # HTTP 500 Internal Server Error

        return Response(response_data)



class UpdateProfile(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        try:
            # Retrieve the authenticated user and associated profile
            user = request.user
            profile_query = Profile.objects.get(user=user)
            data = request.data

            # Serialize and validate the profile data
            serializer = ProfileSerializers(profile_query, data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)

            # Save the updated profile data
            serializer.save()

            return_res = {"error": False, "message": "Profile is updated"}

        except Profile.DoesNotExist:
            # Handle the case where the profile for the authenticated user does not exist
            return_res = {"error": True, "message": "Profile not found", "status": 404}  # HTTP 404 Not Found

        except Exception as e:
            # Handle unexpected errors
            print(e)
            return_res = {"error": True, "message": "Something went wrong. Try again!", "status": 500}  # HTTP 500 Internal Server Error

        return Response(return_res)

