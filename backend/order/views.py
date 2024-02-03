from rest_framework.response import Response
from rest_framework import viewsets
from cart.models import CartProduct
from cart.serializers import CartProductSerializer
from .serializers import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class OrderViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def list(self, request):
        try:
            # Retrieve orders associated with the user's profile
            query = Order.objects.filter(cart__customer=request.user.profile)
            serializers = OrderSerializer(query, many=True)
            all_data = []

            # Iterate through each order, fetch associated cart products, and serialize
            for order in serializers.data:
                cart_product = CartProduct.objects.filter(cart_id=order['cart']['id'])
                cart_product_serializer = CartProductSerializer(cart_product, many=True)
                order['cart_product'] = cart_product_serializer.data
                all_data.append(order)

            return Response(all_data)
        except Exception as e:
            print(e)
            return Response({"error": True, "data": "Failed to retrieve orders"}, status=500)

    def retrieve(self, request, pk=None):
        try:
            # Retrieve a specific order by ID
            queryset = Order.objects.get(id=pk)
            serializers = OrderSerializer(queryset)
            data = serializers.data
            all_data = []

            # Fetch associated cart products and serialize
            cart_product_obj = CartProduct.objects.filter(cart_id=data['cart']['id'])
            cart_product_serializer = CartProductSerializer(cart_product_obj, many=True)
            data['cart_product'] = cart_product_serializer.data
            all_data.append(data)

            return Response({"error": False, "data": all_data})
        except Order.DoesNotExist:
            return Response({"error": True, "data": f"No order found for ID {pk}"}, status=404)
        except Exception as e:
            print(e)
            return Response({"error": True, "data": "Failed to retrieve order"}, status=500)

    def destroy(self, request, pk=None):
        try:
            # Delete a specific order and its associated cart
            order_obj = Order.objects.get(id=pk)
            cart_obj = Cart.objects.get(id=order_obj.cart.id)
            order_obj.delete()
            cart_obj.delete()
            message = {"error": False, "message": "Order deleted", "order id": pk}

            return Response(message)
        except Order.DoesNotExist:
            return Response({"error": True, "message": f"No order found for ID {pk}"}, status=404)
        except Exception as e:
            print(e)
            return Response({"error": True, "message": "Failed to delete order"}, status=500)

    def create(self, request):
        try:
            # Create a new order and mark the associated cart as complete
            cart_id = request.data["cartId"]
            cart_obj = Cart.objects.get(id=cart_id)
            address = request.data["address"]
            mobile = request.data["mobile"]
            email = request.data["email"]
            cart_obj.complete = True
            cart_obj.save()
            created_order = Order.objects.create(
                cart=cart_obj,
                address=address,
                mobile=mobile,
                email=email,
                total=cart_obj.total,
                discount=3,
            )

            return Response({"message": "Order Completed", "cart id": cart_id, "order id": created_order.id})
        except Cart.DoesNotExist:
            return Response({"error": True, "message": f"No cart found for ID {cart_id}"}, status=404)
        except Exception as e:
            print(e)
            return Response({"error": True, "message": "Failed to create order"}, status=500)
