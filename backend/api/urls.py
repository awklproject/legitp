from django.urls import path
from .views import (
    ActivityListCreateAPIView, ActivityDetailAPIView,
    PackageListCreateAPIView, PackageDetailAPIView,
    TourListCreateAPIView, TourDetailAPIView,
    ActivityBookingCreateAPIView, PackageBookingCreateAPIView, TourBookingCreateAPIView,
    CustomerActivityBookingsAPIView, CustomerPackageBookingsAPIView, CustomerTourBookingsAPIView,
    SupplierActivityBookingsAPIView, SupplierPackageBookingsAPIView, SupplierTourBookingsAPIView,
    ConfirmActivityBookingAPIView, ConfirmPackageBookingAPIView, ConfirmTourBookingAPIView,
    SupplierSalesReportView, CategoryListView, UpdateActivityView, UpdatePackageView,
    UpdateTourView, SupplierActivitiesView, SupplierPackagesView, SupplierToursView,
)

urlpatterns = [

    path('supplier/activities/', SupplierActivitiesView.as_view(), name='suploaded_activities'),
    path('supplier/packages/', SupplierPackagesView.as_view(), name='suploaded_packages'),
    path('supplier/tours/', SupplierToursView.as_view(), name='suploaded_tours'),
    path('activities/<int:pk>/update/', UpdateActivityView.as_view(), name='update-activity'),
    path('packages/<int:pk>/update/', UpdatePackageView.as_view(), name='update-package'),
    path('tours/<int:pk>/update/', UpdateTourView.as_view(), name='update-tour'),

    # Activity URLs
    path('activities/', ActivityListCreateAPIView.as_view(), name='activity_list_create'),
    path('activities/<int:pk>/', ActivityDetailAPIView.as_view(), name='activity_detail'),

    # Package URLs
    path('packages/', PackageListCreateAPIView.as_view(), name='package_list_create'),
    path('packages/<int:pk>/', PackageDetailAPIView.as_view(), name='package_detail'),

    # Tour URLs
    path('tours/', TourListCreateAPIView.as_view(), name='tour_list_create'),
    path('tours/<int:pk>/', TourDetailAPIView.as_view(), name='tour_detail'),

    # Booking URLs
    path('bookings/activities/', ActivityBookingCreateAPIView.as_view(), name='activity_booking_create'),
    path('bookings/packages/', PackageBookingCreateAPIView.as_view(), name='package_booking_create'),
    path('bookings/tours/', TourBookingCreateAPIView.as_view(), name='tour_booking_create'),
    path('bookings/customer/activities/', CustomerActivityBookingsAPIView.as_view(), name='customer_activity_bookings'),
    path('bookings/customer/packages/', CustomerPackageBookingsAPIView.as_view(), name='customer_package_bookings'),
    path('bookings/customer/tours/', CustomerTourBookingsAPIView.as_view(), name='customer_tour_bookings'),
    path('bookings/supplier/activities/', SupplierActivityBookingsAPIView.as_view(), name='supplier_activity_bookings'),
    path('bookings/supplier/packages/', SupplierPackageBookingsAPIView.as_view(), name='supplier_package_bookings'),
    path('bookings/supplier/tours/', SupplierTourBookingsAPIView.as_view(), name='supplier_tour_bookings'),
    path('bookings/activities/confirm/<int:pk>/', ConfirmActivityBookingAPIView.as_view(), name='confirm_activity_booking'),
    path('bookings/packages/confirm/<int:pk>/', ConfirmPackageBookingAPIView.as_view(), name='confirm_package_booking'),
    path('bookings/tours/confirm/<int:pk>/', ConfirmTourBookingAPIView.as_view(), name='confirm_tour_booking'),

    # Sales Report
    path('sales/reports/', SupplierSalesReportView.as_view(), name='supplier_sales_report'),

    # Category URLs
    path('categories/', CategoryListView.as_view(), name='category_list'),
]
