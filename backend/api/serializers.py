from rest_framework import serializers
from offers.models import Offer


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ('id', 'title', 'image', 'description', 'price', 'created_at', 'requests')
