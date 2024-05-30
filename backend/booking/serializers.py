from rest_framework import serializers
from .models import ActivityBooking, PackageBooking, TourBooking
from offers.serializers import ActivitySerializer, PackageSerializer, TourSerializer


class ActivityBookingSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer()

    class Meta:
        model = ActivityBooking
        fields = '__all__'


class PackageBookingSerializer(serializers.ModelSerializer):
    package = PackageSerializer()

    class Meta:
        model = PackageBooking
        fields = '__all__'


class TourBookingSerializer(serializers.ModelSerializer):
    tour = TourSerializer()

    class Meta:
        model = TourBooking
        fields = '__all__'
