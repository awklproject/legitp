from django.db import models
from users.models import Supplier


class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Activity(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='activities/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    requests = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    available_from = models.DateField()
    available_to = models.DateField()
    categories = models.ManyToManyField(Category, related_name='activities', blank=True)
    stock = models.PositiveIntegerField(default=0)
    period = models.PositiveIntegerField(help_text="Period in minutes")
    days_off = models.CharField(max_length=255, blank=True, null=True, help_text="Days off (comma-separated)")
    unit = models.CharField(max_length=50)
    start_time = models.TimeField(help_text="Start time of the activity")
    end_time = models.TimeField(help_text="End time of the activity")

    def __str__(self):
        return self.title


class Period(models.Model):
    day = models.DateField()
    time_from = models.TimeField()
    time_to = models.TimeField()
    stock = models.IntegerField()
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="parent_activity")


class Package(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='packages/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    requests = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    available_from = models.DateField()
    available_to = models.DateField()
    categories = models.ManyToManyField(Category, related_name='packages', blank=True)
    stock = models.PositiveIntegerField(default=0)
    period = models.PositiveIntegerField(help_text="Period in days")
    days_off = models.CharField(max_length=255, blank=True, null=True, help_text="Days off (comma-separated)")
    unit = models.CharField(max_length=50)

    def __str__(self):
        return self.title


class Tour(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='tours/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    requests = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    available_from = models.DateField()
    available_to = models.DateField()
    categories = models.ManyToManyField(Category, related_name='tours', blank=True)
    stock = models.PositiveIntegerField(default=0)
    period = models.PositiveIntegerField(help_text="Period in days")
    days_off = models.CharField(max_length=255, blank=True, null=True, help_text="Days off (comma-separated)")
    unit = models.CharField(max_length=50)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "tours"
