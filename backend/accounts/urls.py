from django.urls import path
from .views import LeaderboardView, LogoutView, ProfileView, UserListView, UserProfileView, WeeklyQuestView, login_view, register_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('users/', UserListView.as_view(), name='users'),
    path('users/<int:user_id>/', UserProfileView.as_view(), name='user-profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('weekly/', WeeklyQuestView.as_view(), name='weekly'),
]
