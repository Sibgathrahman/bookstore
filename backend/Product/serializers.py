from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        depth = 1


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    # Email field with unique validation
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already in use")]
    )

    # Username field with unique validation
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already in use")]
    )

    # Password fields with validation
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("id", 'username', 'password', 'password2', 'first_name', 'last_name', 'email')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        # Validate if password and password2 match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        try:
            # Create a new user with validated data
            user = User.objects.create_user(
                validated_data['username'],
                validated_data['email'],
                validated_data['password']
            )

            # Update additional user fields
            user.first_name = validated_data['first_name']
            user.last_name = validated_data['last_name']
            user.save()

            # Create a token for the user
            Token.objects.create(user=user)

            # Create a profile for the user
            Profile.objects.create(user=user)

            return user
        except Exception as e:
            # Handle any unexpected exceptions
            raise serializers.ValidationError({"error": str(e)})



class ProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ['user']

    def validate(self, attrs):
        # Set the user field in the attributes to the current user making the request
        attrs['user'] = self.context['request'].user
        return attrs

    def to_representation(self, instance):
        # Override to_representation to include user details along with profile details
        response = super().to_representation(instance)
        
        # Include serialized user data
        response['user'] = UserSerializer(instance.user).data
        return response



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
