from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Supplier, Customer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_supplier', 'is_customer')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password',
                  'email', 'is_supplier', 'is_customer')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_supplier=validated_data['is_supplier'],
            is_customer=validated_data['is_customer']
        )
        if validated_data['is_supplier']:
            Supplier.objects.create(user=user)
        elif validated_data['is_customer']:
            Customer.objects.create(user=user)
        return user
