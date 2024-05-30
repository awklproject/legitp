from django.contrib import admin
from .models import Category, Activity, Package, Tour, Period
from datetime import datetime, timedelta, date


class PeriodInline(admin.TabularInline):
    model = Period
    extra = 0
    readonly_fields = ('day', 'time_from', 'time_to', 'stock', 'activity')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'supplier', 'price', 'available_from', 'available_to', 'stock')
    list_filter = ('supplier', 'categories', 'available_from', 'available_to')
    search_fields = ('title', 'description', 'supplier__name')
    filter_horizontal = ('categories',)

    inlines = [PeriodInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:  # Only create periods if the activity is newly created
            self.create_periods(obj)

    def create_periods(self, activity):

        current_date = activity.available_from
        delta = timedelta(days=1)
        period_duration = timedelta(minutes=activity.period)
        activity_start_time = activity.start_time
        activity_end_time = activity.end_time

        while current_date <= activity.available_to:
            period_start_time = datetime.combine(current_date, activity_start_time)
            period_end_time = period_start_time + period_duration

            while period_end_time.time() <= activity_end_time:
                Period.objects.create(
                    day=current_date,
                    time_from=period_start_time.time(),
                    time_to=period_end_time.time(),
                    stock=activity.stock,
                    activity=activity
                )
                period_start_time = period_end_time
                period_end_time = period_start_time + period_duration
            current_date += delta


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'supplier', 'price', 'available_from', 'available_to', 'stock')
    list_filter = ('supplier', 'categories', 'available_from', 'available_to')
    search_fields = ('title', 'description', 'supplier__name')
    filter_horizontal = ('categories',)

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('title', 'supplier', 'price', 'available_from', 'available_to', 'stock')
    list_filter = ('supplier', 'categories', 'available_from', 'available_to')
    search_fields = ('title', 'description', 'supplier__name')
    filter_horizontal = ('categories',)

