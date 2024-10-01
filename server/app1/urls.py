from django.urls import re_path
from .views import (
    Candidate_LoginView,
    Candidate_SignUpView,
    Interviewer_LoginView,
    Interviewer_SignUpView,
    add_interviews,
    TakeInterviews,
    interviewStart,
    forRoom,
    candiReport,
    Report,
)

urlpatterns = [
    
    
    # Sign up Api for candidate
    re_path(r"^c_signup/$", Candidate_SignUpView.as_view(), name="c_signup"),
    re_path(r"^c_login/$", Candidate_LoginView.as_view(), name="c_login"),
    
    
    # Sign up Api for Interviewer
    re_path(r"^i_signup/$", Interviewer_SignUpView.as_view(), name="i_signup"),
    re_path(
        r"^i_signup/(?P<interviewer_id>\d+)/$",
        Interviewer_SignUpView.as_view(),
        name="i_signup",
    ),
    re_path(r"^i_login/$", Interviewer_LoginView.as_view(), name="i_login"),
    
    
    # For interview Form
    re_path(r"^interviews/$", add_interviews.as_view(), name="add_interviews"),
    re_path(
        r"^interviews/(?P<interview_id>\d+)/$",
        add_interviews.as_view(),
        name="add_interviews",
    ),
    
    
    # For Taking an Interview
    re_path(r"^take_int/$", TakeInterviews.as_view(), name="TakeInterviews"),
    re_path(
        r"^take_int/(?P<interview_id>\d+)/$",
        TakeInterviews.as_view(),
        name="TakeInterviews",
    ),

   
    # For interview Start and Opt Genration
    re_path(r"^interview_start/$", interviewStart.as_view(), name="interview_start"),
    re_path(
        r"^interview_start/(?P<room_code>[\w-]+)/$",
        interviewStart.as_view(),
        name="room_code",
    ),
    
    
    # For Report Api
    re_path(
        r"^candidate_report/(?P<candi_id>\d+)/$", candiReport.as_view(), name="candi_id"
    ),
    re_path(
        r"^report/$", Report.as_view(), name="Report"
    ),
    
    
    # Extra to get the data via interview_id
    re_path(r"^forRoom/(?P<interview_id>\d+)/$", forRoom.as_view(), name="forRoom"),
    
    
]
