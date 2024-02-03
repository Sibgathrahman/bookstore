from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import views
from .serializers import *
from rest_framework import status


# Create your views here.

# View to add a product to the cart
class AddToCartView(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        try:
            # Extract product_id from request data
            product_id = request.data.get('id')

            # Retrieve the product object based on product_id
            product_obj = Product.objects.get(id=product_id)

            # Find the incomplete cart associated with the user
            incomplete_cart = Cart.objects.filter(customer=request.user.profile, complete=False).first()

            # Check if an incomplete cart exists
            if incomplete_cart:
                # Check if the product is already in the cart
                this_product_in_cart = incomplete_cart.cartproduct_set.filter(product=product_obj).first()
                if this_product_in_cart:
                    # If the product is in the cart, update its quantity and subtotal
                    this_product_in_cart.quantity += 1
                    this_product_in_cart.subtotal += product_obj.selling_price
                    this_product_in_cart.save()
                    incomplete_cart.total += product_obj.selling_price
                    incomplete_cart.save()
                else:
                    # If the product is not in the cart, create a new cart product
                    new_cart_product = CartProduct.objects.create(
                        cart=incomplete_cart,
                        price=product_obj.selling_price,
                        quantity=1,
                        subtotal=product_obj.selling_price
                    )
                    new_cart_product.product.add(product_obj)
                    incomplete_cart.total += product_obj.selling_price
                    incomplete_cart.save()
            else:
                # If no incomplete cart exists, create a new one along with a new cart product
                new_cart = Cart.objects.create(customer=request.user.profile, total=product_obj.selling_price, complete=False)
                new_cart_product = CartProduct.objects.create(
                    cart=new_cart,
                    price=product_obj.selling_price,
                    quantity=1,
                    subtotal=product_obj.selling_price
                )
                new_cart_product.product.add(product_obj)

            message = {'error': False, 'message': "Product added to Cart", "productid": product_id}

        except Product.DoesNotExist:
            message = {'error': True, 'message': "Product not found"}
        except Exception as e:
            print(e)
            message = {'error': True, 'message': "Product not added to Cart! Something went wrong"}

        return Response(message, status=status.HTTP_200_OK)


# ViewSet to retrieve and list user's cart information
class MyCart(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def list(self, request):
        try:
            # Retrieve carts associated with the user
            query = Cart.objects.filter(customer=request.user.profile)
            
            # Serialize the cart data
            cart_serializer = CartSerializer(query, many=True)
            all_data = []

            # Iterate through each cart, fetch associated cart products, and serialize
            for cart_data in cart_serializer.data:
                cart_product_query = CartProduct.objects.filter(cart=cart_data["id"])
                cart_product_serializer = CartProductSerializer(cart_product_query, many=True)
                
                # Add cart products to the cart data
                cart_data["cart_product"] = cart_product_serializer.data
                all_data.append(cart_data)
            
            return Response(all_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# APIView to handle updating quantity and subtotal of a cart product
class UpdateCartProduct(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        try:
            # Retrieve the CartProduct and its associated Cart
            cp_obj = CartProduct.objects.get(id=request.data["id"])
            cart_obj = cp_obj.cart

            # Increment quantity and update subtotal of the CartProduct
            cp_obj.quantity += 1
            cp_obj.subtotal += cp_obj.price

            cp_obj.save()

            # Update total of the Cart
            cart_obj.total += cp_obj.price
            cart_obj.save()

            return Response({"message": "CartProduct Add Update", "product": request.data['id']}, status=status.HTTP_200_OK)
        
        except CartProduct.DoesNotExist:
            return Response({"error": "CartProduct not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# APIView to handle editing quantity and subtotal of a cart product
class EditCartProduct(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        try:
            # Retrieve the CartProduct and its associated Cart
            cp_obj = CartProduct.objects.get(id=request.data["id"])
            cart_obj = cp_obj.cart

            # Decrement quantity and update subtotal of the CartProduct
            cp_obj.quantity -= 1
            cp_obj.subtotal -= cp_obj.price

            # Ensure the quantity is not negative
            if cp_obj.quantity < 0:
                raise ValueError("Quantity cannot be negative.")
            
            cp_obj.save()

            # Update total of the Cart
            cart_obj.total -= cp_obj.price
            cart_obj.save()

            # Delete the CartProduct if its quantity becomes zero
            if cp_obj.quantity == 0:
                cp_obj.delete()

            return Response({"message": "CartProduct Edit Update", "product": request.data['id']}, status=status.HTTP_200_OK)
        
        except CartProduct.DoesNotExist:
            return Response({"error": "CartProduct not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# APIView to handle deleting a cart product
class DeleteCartProduct(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        try:
            # Retrieve the CartProduct using the provided ID
            cp_obj = CartProduct.objects.get(id=request.data['id'])

            # Delete the CartProduct
            cp_obj.delete()

            message = {"message": "CartProduct Deleted", "product": request.data['id']}
        except CartProduct.DoesNotExist:
            # Handle the case where the specified CartProduct does not exist
            message = {"message": "CartProduct not found"}
        except Exception as e:
            # Handle other exceptions (e.g., database errors)
            print(e)
            message = {"message": "Something went wrong"}

        return Response(message)


