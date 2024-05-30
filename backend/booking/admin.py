from django.contrib import admin
from .models import ActivityBooking

class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer',  'start_date', 'start_time', 'end_time', 'confirmed')
    list_filter = ('start_date', 'confirmed', 'customer')
    search_fields = ('customer__user__username', 'booked_item__title')

admin.site.register(ActivityBooking, BookingAdmin)
