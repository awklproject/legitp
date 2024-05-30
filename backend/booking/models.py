from django.db import models
from users.models import Customer
from offers.models import Activity, Package, Tour, Period


class ActivityBooking(models.Model):
    period = models.ForeignKey(Period, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    paid = models.BooleanField(default=False)
    start_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Booking for {self.activity.title} by {self.customer.user.username} on {self.start_date} from {self.start_time} to {self.end_time}'


class PackageBooking(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    start_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Booking for {self.package.title} by {self.customer.user.username} on {self.start_date}'


class TourBooking(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    start_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Booking for {self.tour.title} by {self.customer.user.username} on {self.start_date}'

