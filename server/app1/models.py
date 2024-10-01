from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from datetime import timedelta

# Create your models here.


class Candidate(models.Model):
    Id = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Email = models.EmailField(max_length=254, unique=True)
    Phno = models.CharField(max_length=15, unique=True)
    Password = models.CharField(max_length=128)


class Interviewer(models.Model):
    Id = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    Email = models.EmailField(max_length=254, unique=True)
    Phno = models.CharField(max_length=15, unique=True)
    Password = models.CharField(max_length=128)

    interviewDate = models.DateField(null=True, blank=True)
    interviewTime = ArrayField(
        models.CharField(max_length=20), blank=True, default=list
    )
    interviewRole = models.CharField(max_length=255, default="")
    interviewExp = models.CharField(max_length=255, default="")
    techExpertise = ArrayField(
        models.CharField(max_length=100), blank=True, default=list
    )


# Doubt
class Interviews(models.Model):
    interviewId = models.AutoField(primary_key=True)
    interviewRole = models.CharField(max_length=100)
    interviewTechno = models.CharField(max_length=255)
    interviewPayment = models.DecimalField(max_digits=10, decimal_places=2)
    interviewDate = models.DateField(null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    # interviewer = models.ForeignKey(Interviewer, on_delete=models.CASCADE, default=1)
    interviewDuration = models.DurationField()
    interviewTime = models.TimeField(null=True, blank=True)
    interview_status = models.CharField(max_length=10, default="Not Taken")

    def __str__(self):
        return f"Interview {self.interviewId} for {self.candidate.Name}"


class Rel_Intw_Ints(models.Model):

    interviewer = models.ForeignKey(Interviewer, on_delete=models.CASCADE)
    interviews = models.ForeignKey(Interviews, on_delete=models.DO_NOTHING)

    interviewRole = models.CharField(max_length=100)
    interviewTechno = models.CharField(max_length=255)
    interviewPayment = models.DecimalField(max_digits=10, decimal_places=2)
    interviewDate = models.DateField(null=True, blank=True)
    interviewDuration = models.DurationField()
    interviewTime = models.TimeField(null=True, blank=True)
    # time = models.TimeField()
    interview_status = models.CharField(max_length=10, default="pending")
    payment_status = models.CharField(max_length=10, default="pending")


class Room(models.Model):
    room_code = models.CharField(max_length=6, unique=True)
    candidate_email = models.EmailField()
    expiration_time = models.DateTimeField()
    IntId = models.CharField(default=0)

    def is_valid(self):
        return timezone.now() <= self.expiration_time

    @classmethod
    def generate_room_code(self):
        from random import randint

        return str(randint(100000, 999999))

    @classmethod
    def create_room(self, Email,IntId):
        room_code = self.generate_room_code()
        expiration_time = timezone.now() + timedelta(minutes=10)
        return self.objects.create(
            room_code=room_code,
            candidate_email=Email,
            expiration_time=expiration_time,
            IntId=IntId
        )



class Rel_Cand_Ints(models.Model):
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    interviews = models.ForeignKey(Interviews, on_delete=models.DO_NOTHING)

    interviewRole = models.CharField(max_length=100)
    interviewTechno = models.CharField(max_length=255)
    interviewDate = models.DateField(null=True, blank=True)
    interviewDuration = models.DurationField()
    interviewTime = models.TimeField(null=True, blank=True)
    interview_status = models.CharField(max_length=10, default="pending")
    report = models.FileField(upload_to='pdfs/',default=None, null=True, blank=True) 
