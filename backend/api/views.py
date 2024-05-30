from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView  # Import APIView here
from django.db.models import Sum
from datetime import date, datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist

from offers.models import Activity, Package, Tour, Category
from booking.models import ActivityBooking, PackageBooking, TourBooking
from users.models import Customer, Supplier
from offers.serializers import ActivitySerializer, PackageSerializer, TourSerializer, CategorySerializer
from booking.serializers import ActivityBookingSerializer, PackageBookingSerializer, TourBookingSerializer


class SupplierActivitiesView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'is_supplier') and user.is_supplier:
            return Activity.objects.filter(supplier__user=user)
        return Activity.objects.none()


class UpdateActivityView(generics.UpdateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        activity = self.get_object()
        if activity.supplier.user != user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        return self.partial_update(request, *args, **kwargs)


class SupplierPackagesView(generics.ListAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'is_supplier') and user.is_supplier:
            return Package.objects.filter(supplier__user=user)
        return Package.objects.none()


class UpdatePackageView(generics.UpdateAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        package = self.get_object()
        if package.supplier.user != user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        return self.partial_update(request, *args, **kwargs)


class SupplierToursView(generics.ListAPIView):
    serializer_class = TourSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'is_supplier') and user.is_supplier:
            return Tour.objects.filter(supplier__user=user)
        return Tour.objects.none()

class UpdateTourView(generics.UpdateAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        tour = self.get_object()
        if tour.supplier.user != user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        return self.partial_update(request, *args, **kwargs)


# Activity Views
class ActivityListCreateAPIView(generics.ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_ids = self.request.query_params.getlist('category_ids', [])
        if category_ids:
            queryset = queryset.filter(categories__id__in=category_ids).distinct()
        return queryset

class ActivityDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

# Package Views
class PackageListCreateAPIView(generics.ListCreateAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_ids = self.request.query_params.getlist('category_ids', [])
        if category_ids:
            queryset = queryset.filter(categories__id__in=category_ids).distinct()
        return queryset

class PackageDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

# Tour Views
class TourListCreateAPIView(generics.ListCreateAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_ids = self.request.query_params.getlist('category_ids', [])
        if category_ids:
            queryset = queryset.filter(categories__id__in=category_ids).distinct()
        return queryset

class TourDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

# Booking Views
class ActivityBookingCreateAPIView(generics.CreateAPIView):
    queryset = ActivityBooking.objects.all()
    serializer_class = ActivityBookingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_customer:
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = JSONParser().parse(request)
        try:
            activity = Activity.objects.get(pk=data['activity_id'])
            customer = Customer.objects.get(user=request.user)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        start_date = date.fromisoformat(data['start_date'])
        start_time = datetime.strptime(data['start_time'], '%H:%M').time()

        if not (activity.available_from <= start_date <= activity.available_to):
            return Response({'detail': 'Activity is not available at the selected date.'}, status=status.HTTP_400_BAD_REQUEST)
        if not (activity.start_time <= start_time <= activity.end_time):
            return Response({'detail': 'Activity is not available at the selected time.'}, status=status.HTTP_400_BAD_REQUEST)

        if activity.stock <= 0:
            return Response({'detail': 'Activity is out of stock.'}, status=status.HTTP_400_BAD_REQUEST)
        activity.stock -= 1
        activity.save()

        booking = ActivityBooking(
            activity=activity,
            customer=customer,
            start_date=start_date,
            start_time=start_time
        )
        booking.save()
        return Response({'id': booking.id}, status=status.HTTP_201_CREATED)

class PackageBookingCreateAPIView(generics.CreateAPIView):
    queryset = PackageBooking.objects.all()
    serializer_class = PackageBookingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_customer:
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = JSONParser().parse(request)
        try:
            package = Package.objects.get(pk=data['package_id'])
            customer = Customer.objects.get(user=request.user)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        start_date = date.fromisoformat(data['start_date'])

        if not (package.available_from <= start_date <= package.available_to):
            return Response({'detail': 'Package is not available at the selected date.'}, status=status.HTTP_400_BAD_REQUEST)

        if package.stock <= 0:
            return Response({'detail': 'Package is out of stock.'}, status=status.HTTP_400_BAD_REQUEST)
        package.stock -= 1
        package.save()

        booking = PackageBooking(
            package=package,
            customer=customer,
            start_date=start_date
        )
        booking.save()
        return Response({'id': booking.id}, status=status.HTTP_201_CREATED)

class TourBookingCreateAPIView(generics.CreateAPIView):
    queryset = TourBooking.objects.all()
    serializer_class = TourBookingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_customer:
            return Response(status=status.HTTP_403_FORBIDDEN)
        data = JSONParser().parse(request)
        try:
            tour = Tour.objects.get(pk=data['tour_id'])
            customer = Customer.objects.get(user=request.user)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        start_date = date.fromisoformat(data['start_date'])

        if not (tour.available_from <= start_date <= tour.available_to):
            return Response({'detail': 'Tour is not available at the selected date.'}, status=status.HTTP_400_BAD_REQUEST)

        if tour.stock <= 0:
            return Response({'detail': 'Tour is out of stock.'}, status=status.HTTP_400_BAD_REQUEST)
        tour.stock -= 1
        tour.save()

        booking = TourBooking(
            tour=tour,
            customer=customer,
            start_date=start_date
        )
        booking.save()
        return Response({'id': booking.id}, status=status.HTTP_201_CREATED)

class CustomerActivityBookingsAPIView(generics.ListAPIView):
    serializer_class = ActivityBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_customer:
            return ActivityBooking.objects.filter(customer__user=user)
        return ActivityBooking.objects.none()

class CustomerPackageBookingsAPIView(generics.ListAPIView):
    serializer_class = PackageBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_customer:
            return PackageBooking.objects.filter(customer__user=user)
        return PackageBooking.objects.none()

class CustomerTourBookingsAPIView(generics.ListAPIView):
    serializer_class = TourBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_customer:
            return TourBooking.objects.filter(customer__user=user)
        return TourBooking.objects.none()


class SupplierActivityBookingsAPIView(generics.ListAPIView):
    serializer_class = ActivityBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_supplier:
            return ActivityBooking.objects.filter(activity__supplier__user=user)
        return ActivityBooking.objects.none()


class SupplierPackageBookingsAPIView(generics.ListAPIView):
    serializer_class = PackageBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_supplier:
            return PackageBooking.objects.filter(package__supplier__user=user)
        return PackageBooking.objects.none()

class SupplierTourBookingsAPIView(generics.ListAPIView):
    serializer_class = TourBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_supplier:
            return TourBooking.objects.filter(tour__supplier__user=user)
        return TourBooking.objects.none()

class ConfirmActivityBookingAPIView(generics.UpdateAPIView):
    queryset = ActivityBooking.objects.all()
    serializer_class = ActivityBookingSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.activity.supplier.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        booking.confirmed = True
        booking.save()
        return Response({'status': 'Booking confirmed'})

class ConfirmPackageBookingAPIView(generics.UpdateAPIView):
    queryset = PackageBooking.objects.all()
    serializer_class = PackageBookingSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.package.supplier.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        booking.confirmed = True
        booking.save()
        return Response({'status': 'Booking confirmed'})

class ConfirmTourBookingAPIView(generics.UpdateAPIView):
    queryset = TourBooking.objects.all()
    serializer_class = TourBookingSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.tour.supplier.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        booking.confirmed = True
        booking.save()
        return Response({'status': 'Booking confirmed'})

# Sales Report View
class SupplierSalesReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_supplier:
            return Response(status=status.HTTP_403_FORBIDDEN)

        today = date.today()
        start_of_month = today.replace(day=1)

        activity_bookings = ActivityBooking.objects.filter(activity__supplier__user=request.user)
        package_bookings = PackageBooking.objects.filter(package__supplier__user=request.user)
        tour_bookings = TourBooking.objects.filter(tour__supplier__user=request.user)

        total_sales_activity = activity_bookings.aggregate(total=Sum('activity__price'))['total'] or 0
        total_sales_package = package_bookings.aggregate(total=Sum('package__price'))['total'] or 0
        total_sales_tour = tour_bookings.aggregate(total=Sum('tour__price'))['total'] or 0

        sales_today_activity = activity_bookings.filter(start_date=today).aggregate(total=Sum('activity__price'))['total'] or 0
        sales_today_package = package_bookings.filter(start_date=today).aggregate(total=Sum('package__price'))['total'] or 0
        sales_today_tour = tour_bookings.filter(start_date=today).aggregate(total=Sum('tour__price'))['total'] or 0

        sales_this_month_activity = activity_bookings.filter(start_date__gte=start_of_month).aggregate(total=Sum('activity__price'))['total'] or 0
        sales_this_month_package = package_bookings.filter(start_date__gte=start_of_month).aggregate(total=Sum('package__price'))['total'] or 0
        sales_this_month_tour = tour_bookings.filter(start_date__gte=start_of_month).aggregate(total=Sum('tour__price'))['total'] or 0

        total_sales = total_sales_activity + total_sales_package + total_sales_tour
        sales_today = sales_today_activity + sales_today_package + sales_today_tour
        sales_this_month = sales_this_month_activity + sales_this_month_package + sales_this_month_tour

        total_bookings = activity_bookings.count() + package_bookings.count() + tour_bookings.count()
        accepted_bookings = activity_bookings.filter(confirmed=True).count() + package_bookings.filter(confirmed=True).count() + tour_bookings.filter(confirmed=True).count()
        bookings_on_hold = activity_bookings.filter(confirmed=False).count() + package_bookings.filter(confirmed=False).count() + tour_bookings.filter(confirmed=False).count()

        return Response({
            'total_sales': total_sales,
            'sales_today': sales_today,
            'sales_this_month': sales_this_month,
            'total_bookings': total_bookings,
            'accepted_bookings': accepted_bookings,
            'bookings_on_hold': bookings_on_hold,
        })

# Category View
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

