from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, RegisterSerializer
from quests.models import Quest


def build_user_stats(user):
    quests = Quest.objects.filter(owner=user)
    completed_qs = quests.filter(status=Quest.Status.COMPLETED)
    completed = completed_qs.count()
    xp = sum(q.xp_reward for q in completed_qs)
    badges = []
    if completed >= 1:
        badges.append('First Blood')
    if completed >= 5:
        badges.append('Quest Hunter')
    if xp >= 200:
        badges.append('XP Grinder')
    if xp >= 500:
        badges.append('Legend')
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'total_quests': quests.count(),
        'completed_quests': completed,
        'xp': xp,
        'level': xp // 100 + 1,
        'badges': badges,
    }


def build_weekly_data(user):
    now = timezone.localtime()
    week_start = (now - timezone.timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    week_end = week_start + timezone.timedelta(days=7)
    completed = Quest.objects.filter(owner=user, status=Quest.Status.COMPLETED, updated_at__gte=week_start, updated_at__lt=week_end)
    created = Quest.objects.filter(owner=user, created_at__gte=week_start, created_at__lt=week_end)
    items = [
        {'id': 1, 'title': 'Complete 3 quests this week', 'description': 'Finish any three quests before weekly reset.', 'progress': min(completed.count(), 3), 'goal': 3, 'xp_reward': 120},
        {'id': 2, 'title': 'Create 2 new quests', 'description': 'Add two new quests to your board.', 'progress': min(created.count(), 2), 'goal': 2, 'xp_reward': 60},
        {'id': 3, 'title': 'Beat 1 hard quest', 'description': 'Complete one hard quest this week.', 'progress': min(completed.filter(difficulty=Quest.Difficulty.HARD).count(), 1), 'goal': 1, 'xp_reward': 100},
    ]
    for item in items:
        item['completed'] = item['progress'] >= item['goal']
    return {'week_start': str(week_start.date()), 'week_end': str((week_end - timezone.timedelta(days=1)).date()), 'items': items}


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response({'message': 'Registration successful.', 'user': {'id': user.id, 'username': user.username, 'email': user.email}, 'access': str(refresh.access_token), 'refresh': str(refresh)}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    return Response({'message': 'Login successful.', 'user': {'id': user.id, 'username': user.username, 'email': user.email}, 'access': str(refresh.access_token), 'refresh': str(refresh)})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'message': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token).blacklist()
            return Response({'message': 'Logout successful.'})
        except Exception:
            return Response({'message': 'Invalid refresh token.'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = build_user_stats(request.user)
        data['weekly'] = build_weekly_data(request.user)
        return Response(data)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response([build_user_stats(user) for user in User.objects.order_by('username')])


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = User.objects.get(pk=user_id)
        data = build_user_stats(user)
        data['weekly'] = build_weekly_data(user)
        return Response(data)


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = sorted([build_user_stats(user) for user in User.objects.all()], key=lambda x: (-x['xp'], x['username'].lower()))
        for i, item in enumerate(data, start=1):
            item['rank'] = i
        return Response(data)


class WeeklyQuestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(build_weekly_data(request.user))
