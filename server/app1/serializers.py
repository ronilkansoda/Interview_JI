from rest_framework import serializers
from app1.models import Candidate, Interviewer, Interviews, Rel_Intw_Ints ,Room, Rel_Cand_Ints


class candidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = (
            "Id",
            "Name",
            "Email",
            "Phno",
            "Password",
        )


class interviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interviewer
        fields = (
            "Id",
            "Name",
            "Email",
            "Phno",
            "Password",
            "interviewDate",
            "interviewTime",
            "interviewExp",
            "interviewRole",
            "techExpertise",
        )


# Doubt
class InterviewsSerializer(serializers.ModelSerializer):
    candidate = serializers.PrimaryKeyRelatedField(queryset=Candidate.objects.all())
    # above to enter the candidate id

    # candidate = candidateSerializer()
    # above for Objenct

    class Meta:
        model = Interviews
        fields = [
            "interviewId",
            "interviewRole",
            "interviewTechno",
            "interviewPayment",
            "interviewDate",
            "candidate",
            # "interviewer",
            "interviewDuration",
            "interviewTime",
            "interview_status"
        ]


class Rel_Intw_IntsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rel_Intw_Ints
        fields = [
            "id",
            "interviewer",
            "interviews",
            "interviewRole",
            "interviewTechno",
            "interviewDate",
            "interviewDuration",
            "interview_status",
            "payment_status",
            "interviewPayment",
            "interviewTime",
        ]


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["room_code", "candidate_email", "expiration_time", "IntId"]
        read_only_fields = ["room_code", "candidate_email","IntId"]

class Rel_Cand_IntsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rel_Cand_Ints
        fields = [
            "id",
            "candidate",
            "interviews",
            "interviewRole",
            "interviewTechno",
            "interviewDate",
            "interviewDuration",
            "interview_status",
            "interviewTime",
            "report"
        ]
