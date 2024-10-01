from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.authtoken.models import Token
from django.db import transaction
from django.core.mail import send_mail
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from io import BytesIO
from datetime import datetime
from django.core.files.base import ContentFile
from django.utils import timezone


from app1.models import (
    Candidate,
    Interviewer,
    Interviews,
    Rel_Intw_Ints,
    Room,
    Rel_Cand_Ints,
)
from app1.serializers import (
    candidateSerializer,
    interviewerSerializer,
    InterviewsSerializer,
    Rel_Intw_IntsSerializer,
    RoomSerializer,
    Rel_Cand_IntsSerializer,
)
from myproject import settings


# @csrf_exempt
# def candidateApi(request):
#     if request.method == "POST":
#         candidate_data = JSONParser().parse(request)
#         candidate_serializer = candidateSerializer(data=candidate_data)


#         if candidate_serializer.is_valid():
#             candidate_serializer.save()
#             return JsonResponse("Added Successfully", safe=False)
#         return JsonResponse(
#             {"message": "Failed to Add", "errors": candidate_serializer.errors},
#             status=400,
#         )


# -------------------------------------------Sign up Api for candidate-------------------------------------------
class Candidate_SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        # Parse the request data
        candidate_data = JSONParser().parse(request)
        password = candidate_data.get("Password")

        # Serialize the data
        candidate_serializer = candidateSerializer(data=candidate_data)

        # Validate and save the candidate
        if candidate_serializer.is_valid():
            candidate_obj = candidate_serializer.save()

            candidate_obj.Password = make_password(password=password)
            candidate_obj.save()
            # token, created = Token.objects.get_or_create(user=candidate_obj)

            return Response(
                # {"message": "Added Successfully!!", "id": candidate_obj.Id, 'token':token},
                {"message": "Added Successfully!!"},
                status=status.HTTP_201_CREATED,
            )

        # Return errors if validation fails
        return Response(
            {"error": "User already exist!!", "errors": candidate_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class Candidate_LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("Email")
        password = request.data.get("Password")
        # print(email)
        # print(password)
        try:
            # Try to find the candidate by email
            candidate_obj = Candidate.objects.get(Email=email)
            print(candidate_obj.Password)
            # Check if the password is correct
            if check_password(password, candidate_obj.Password):
                response = JsonResponse(
                    {"message": "Login Successful", "id": candidate_obj.Id},
                    status=status.HTTP_200_OK,
                )
                response.set_cookie(
                    "id", candidate_obj.Id, max_age=60
                )  # 60 seconds = 1 minute

                return response
            else:
                return Response(
                    {"error": "Invalid Credentials"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Candidate.DoesNotExist:
            return Response(
                {"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST
            )


# ------------------------------------------Sign up Api for Interviewer------------------------------------------
class Interviewer_SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        # Parse the request data
        interviewer_data = JSONParser().parse(request)
        password = interviewer_data.get("Password")

        # Serialize the data
        interviewer_serializer = interviewerSerializer(data=interviewer_data)

        # Validate and save the candidate
        if interviewer_serializer.is_valid():
            interviewer_obj = interviewer_serializer.save()

            interviewer_obj.Password = make_password(password=password)
            interviewer_obj.save()
            return Response(
                {"message": "Added Successfully!!", "id": interviewer_obj.Id},
                status=status.HTTP_201_CREATED,
            )

        # Return errors if validation fails
        return Response(
            {"error": "User already exist!!", "errors": interviewer_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, interviewer_id, *args, **kwargs):
        try:
            # Fetch the interviewer object by id
            interviewer_obj = Interviewer.objects.get(Id=interviewer_id)

            # Parse the request data
            updated_data = JSONParser().parse(request)

            # Partially update the fields based on the input
            interviewer_serializer = interviewerSerializer(
                interviewer_obj, data=updated_data, partial=True
            )

            if interviewer_serializer.is_valid():
                interviewer_serializer.save()
                return Response(
                    {"message": "Updated Successfully"}, status=status.HTTP_200_OK
                )

            return Response(
                {
                    "error": "Failed to Update",
                    "errors": interviewer_serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Interviewer.DoesNotExist:
            return Response(
                {"error": "Interviewer Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            # Log the error for debugging
            print(str(e))
            return Response(
                {"message": "Internal Server Error", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class Interviewer_LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("Email")
        password = request.data.get("Password")

        try:
            # Try to find the interviewer by email
            interviewer_obj = Interviewer.objects.get(Email=email)

            # Check if the password is correct
            if check_password(password, interviewer_obj.Password):
                
                return Response(
                    {"message": "Login Successful", "id": interviewer_obj.Id},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Invalid Credentials"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Interviewer.DoesNotExist:
            return Response(
                {"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST
            )
            


# ------------------------------------------------For interview Form------------------------------------------------
class add_interviews(APIView):

    # filtering from the interviewer form
    def get(self, request, *args, **kwargs):
        intwId = kwargs.get("interview_id")

        interviewer = Interviewer.objects.filter(Id=intwId).first()
        date = interviewer.interviewDate
        time_range = interviewer.interviewTime
        print(time_range)

        if len(time_range) < 2:
            return Response(
                {"error": "Insufficient time range"}, status=status.HTTP_400_BAD_REQUEST
            )
        start_time_str, end_time_str = time_range[0], time_range[1]
        start_time = timezone.datetime.strptime(start_time_str, "%H:%M").time()
        end_time = timezone.datetime.strptime(end_time_str, "%H:%M").time()

        # Filter the Interviews based on the selected interviewer and date/time
        interviews = Interviews.objects.filter(
            interview_status="Not Taken",
            interviewDate=date,
            interviewTime__gte=start_time,
            interviewTime__lte=end_time,
        )

        # Serialize the results
        serializer = InterviewsSerializer(interviews, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    # For manually adding the interview data for understanding
    def post(self, request, *args, **kwargs):
        interviews_data = JSONParser().parse(request)
        interviews_serializer = InterviewsSerializer(data=interviews_data)

        if interviews_serializer.is_valid():
            interviews_serializer.save()
            return Response(
                {"message": "Added Successfully"}, status=status.HTTP_201_CREATED
            )

        return Response(
            {"error": "Failed to Add", "errors": interviews_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Changeing from not taken to pending
    def put(self, request, *args, **kwargs):
        interview_id = kwargs.get("interview_id")
        print(interview_id)
        try:
            interview = Interviews.objects.get(interviewId=interview_id)
            interview.interview_status = "Pending"
            interview.save()
            return Response(
                {
                    "message": "Interview status updated to 'Pending' successfully",
                    "interview_status": interview.interview_status,
                }
            )
        except Interviews.DoesNotExist:
            return Response(
                {"error": f"No Interview found with id {interview_id}"},
                status=status.HTTP_404_NOT_FOUND,
            )


# ---------------------------------------------For Taking an Interview---------------------------------------------
class TakeInterviews(APIView):
    # to get pending data
    def get(self, request, *args, **kwargs):
        i = Rel_Intw_Ints.objects.filter(interview_status="Pending")

        serializer = Rel_Intw_IntsSerializer(i, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    # for saveing the interview data to Rel_Intw_Ints model and Rel_Cand_Ints model
    def post(self, request, *args, **kwargs):
        take_interviews_data = request.data  # Use request.data directly

        # print("Received data:", take_interviews_data.get("interviews"))
        interd = take_interviews_data.get("interviews")

        # Fetch the interview object
        forCandidate = Interviews.objects.filter(interviewId=interd).first()
        
        if forCandidate:
            # Pass the interview object directly to the serializer
            rel_candidate_interviews = Rel_Cand_IntsSerializer(
                data={
                    "candidate": forCandidate.candidate.Id,  # Directly using foreign key reference
                    "interviews": forCandidate.interviewId,
                    "interviewRole": forCandidate.interviewRole,
                    "interviewTechno": forCandidate.interviewTechno,
                    "interviewDate": forCandidate.interviewDate,
                    "interviewDuration": forCandidate.interviewDuration,
                    "interviewTime": forCandidate.interviewTime,
                    "interview_status": "pending",  # Default status
                }
            )

            take_interviews_serializer = Rel_Intw_IntsSerializer(
                data=take_interviews_data
            )

            if rel_candidate_interviews.is_valid():
                # Save the Rel_Cand_Ints instance
                rel_candidate_interviews.save()

                # Save the data in the Rel_Intw_Ints table
                take_interviews_serializer = Rel_Intw_IntsSerializer(
                    data=take_interviews_data
                )
                if take_interviews_serializer.is_valid():
                    try:
                        saved_instance = take_interviews_serializer.save()

                        email_subject = (
                            f"Interview Scheduled: {saved_instance.interviewRole}"
                        )
                        email_body = (
                            f"Dear Candidate,\n\n"
                            f"Your interview for the role of {saved_instance.interviewRole} has been scheduled.\n"
                            f"Here are the details:\n\n"
                            f"Date: {saved_instance.interviewDate}\n"
                            f"Time: {saved_instance.interviewTime}\n"
                            f"Duration: {saved_instance.interviewDuration}\n\n"
                            f"Please make sure to be available on time. Best of luck!\n\n"
                            f"Regards,\n"
                            f"Interview Team"
                        )
                        send_mail(
                            email_subject,
                            email_body,
                            settings.EMAIL_HOST_USER,
                            [forCandidate.candidate.Email],
                            fail_silently=False,
                        )
                        return Response(
                            {"message": "Added Successfully"},
                            status=status.HTTP_201_CREATED,
                        )
                    except Exception as e:
                        return Response(
                            {"error": f"An error occurred: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
                else:
                    print("Serializer Errors:", take_interviews_serializer.errors)

                return Response(
                    {
                        "error": "Failed to Add",
                        "errors": take_interviews_serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            {"error": "Interview not found."}, status=status.HTTP_404_NOT_FOUND
        )

    # for cancelled interview
    def put(self, request, *args, **kwargs):
        interview_id = kwargs.get("interview_id")
        print(interview_id)
        try:
            interview = Rel_Intw_Ints.objects.get(id=interview_id)
            interview.interview_status = "Cancelled"
            interview.save()
            return Response({"message": "Interview deleted successfully"})
        except Rel_Intw_Ints.DoesNotExist:
            return Response(
                {"error": f"No Interview found with id {interview_id}"},
                status=status.HTTP_404_NOT_FOUND,
            )


# --------------------------------------For interview Start and Opt Genration--------------------------------------
class interviewStart(APIView):

    # when interviewer click on start interview and genrating opt in interviewer page
    def post(self, request, *args, **kwargs):
        # Get IntId from request data
        IntId = request.data.get("id")

        try:
            # Fetch the relation instance based on IntId
            rel_instance = Rel_Intw_Ints.objects.get(id=IntId)

            # Get the candidate email
            candidate_email = rel_instance.interviews.candidate.Email

            # Create a room with candidate email and IntId
            room = Room.create_room(candidate_email, IntId)
            send_mail(
                "Your Interview Room Code",
                f"Your room code is {room.room_code}. It is valid for 10 minutes.",
                settings.EMAIL_HOST_USER,
                [candidate_email],
                fail_silently=False,
            )

            # Serialize the room object (using only fields you need for response)
            serializer = RoomSerializer(room)

            # Return the room data
            return Response(
                {"candidate_email": candidate_email, "room": room.room_code},
                status=status.HTTP_200_OK,
            )

        except Rel_Intw_Ints.DoesNotExist:
            return Response(
                {"error": "Relation not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except AttributeError:
            return Response(
                {"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST
            )

    # check the opt and validate it in candidate page
    def get(self, request, room_code, *args, **kwargs):
        try:
            # Attempt to get the room by room_code
            room = get_object_or_404(Room, room_code=room_code)
        except Http404:
            # If room is not found, return a custom error response
            return Response(
                {"error": "Code Does not Exist."}, status=status.HTTP_404_NOT_FOUND
            )
        if room.is_valid():
            # If the code is valid, redirect to the room (assuming the room exists)
            return Response({"room": room.room_code, "id": room.IntId})
        else:
            # If the code is expired, return an error message
            return Response(
                {"error": "This Interview code has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# --------------------------------------Extra to get the data via interview_id--------------------------------------
class forRoom(APIView):

    def get(self, request, *args, **kwargs):
        interview_id = kwargs.get("interview_id")

        i = Rel_Intw_Ints.objects.get(id=interview_id)

        serializer = Rel_Intw_IntsSerializer(i)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------------------------For Report Api------------------------------------------------
# to show the candidate reports in the report section
class candiReport(APIView):
    def get(self, request, *args, **kwargs):
        candi_id = kwargs.get("candi_id")

        # Fetch related interviews for the candidate
        interviews = Rel_Cand_Ints.objects.filter(candidate_id=candi_id)

        # Ensure that there are interviews to retrieve the candidate's name
        if interviews.exists():
            candidate_name = (
                interviews.first().candidate.Name
            )  # Get the name of the candidate from the first record

            # Serialize the interviews data
            serializer = Rel_Cand_IntsSerializer(interviews, many=True)

            # Add the candidate's name to the response
            return Response(
                {"candidate_name": candidate_name, "interviews": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "No interviews found for this candidate."},
                status=status.HTTP_404_NOT_FOUND,
            )


# for genrating report
class Report(APIView):
    def put(self, request, *args, **kwargs):
        # Get interview ID and answers from request data
        int_id = request.data.get("interview_id")
        answers = request.data.get("answers", {})  # Expects a dictionary

        # Fetch interview details
        interview = Rel_Cand_Ints.objects.filter(interviews_id=int_id).first()
        if not interview:
            return Response(
                {"error": "Interview not found."}, status=status.HTTP_404_NOT_FOUND
            )

        candidate_name = (
            interview.candidate.Name
        )  # Get candidate name from the interview object

        # Create a BytesIO buffer to generate the PDF in memory
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )

        elements = []

        # Styles for the document
        styles = getSampleStyleSheet()
        title_style = styles["Title"]
        title_style.fontSize = 22
        title_style.textColor = colors.HexColor("#0077B6")
        title_style.alignment = TA_CENTER

        subtitle_style = styles["Normal"]
        subtitle_style.fontSize = 12
        subtitle_style.leading = 16

        question_style = ParagraphStyle(
            "QuestionStyle",
            fontSize=14,
            textColor=colors.HexColor("#0077B6"),
            spaceAfter=14,
        )

        answer_style = ParagraphStyle("AnswerStyle", fontSize=12, spaceAfter=20)

        # Title
        elements.append(Paragraph("Candidate Technical Evaluation Report", title_style))
        elements.append(Spacer(1, 12))

        # Candidate details
        candidate_info = f"""
        <b>Candidate:</b> {candidate_name}<br/>
        <b>Report Generated:</b> {datetime.now().strftime('%d %B %Y, %I:%M %p')}<br/>
        """
        elements.append(Paragraph(candidate_info, subtitle_style))
        elements.append(Spacer(1, 12))

        # Questions
        questions = [
            "Q-1 How would you rate the candidate’s understanding of key technical concepts (e.g., algorithms, data structures, frameworks)?",
            "Q-2 How well did the candidate write and debug code? Was the approach structured and optimized?",
            "Q-3 How effective was the candidate in explaining their thought process and solutions?",
        ]

        for index, question in enumerate(questions):
            elements.append(Paragraph(question, question_style))
            answer = answers.get(f"a{index + 1}", "No answer provided")
            elements.append(Paragraph(f"Answer => {answer}", answer_style))

            # Create a box for the answer (for visual enhancement)
            answer_box_data = [[answer]]
            answer_box_table = Table(answer_box_data, colWidths=[6.5 * inch])
            answer_box_table.setStyle(
                TableStyle(
                    [
                        ("BOX", (0, 0), (-1, -1), 2, colors.HexColor("#90E0EF")),
                        ("TOPPADDING", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ]
                )
            )
            elements.append(answer_box_table)
            elements.append(Spacer(1, 20))

        # Build the PDF in the buffer
        doc.build(elements)

        # Save the PDF from buffer to a Django model (convert buffer to a file)
        buffer.seek(0)  # Move to the beginning of the buffer
        pdf_content = buffer.getvalue()  # Get the entire buffer content as binary
        buffer.close()

        # Save the PDF file in the model
        interview.report.save(f"{candidate_name}_report.pdf", ContentFile(pdf_content))

        # Return success response
        return Response(
            {
                "message": "PDF generated and saved successfully.",
                "pdf_url": interview.report.url,
            }
        )
