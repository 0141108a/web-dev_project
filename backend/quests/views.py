from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Quest, QuestLog
from .serializers import CategoryModelSerializer, QuestModelSerializer


class CategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.filter(owner=request.user)
        serializer = CategoryModelSerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategoryModelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        return Category.objects.get(pk=pk, owner=user)

    def put(self, request, pk):
        category = self.get_object(pk, request.user)
        serializer = CategoryModelSerializer(category, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        category = self.get_object(pk, request.user)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        quests = Quest.objects.filter(owner=request.user).order_by('-created_at')
        status_filter = request.query_params.get('status')
        if status_filter:
            quests = quests.filter(status=status_filter)
        serializer = QuestModelSerializer(quests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuestModelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quest = serializer.save(owner=request.user)
        QuestLog.objects.create(quest=quest, user=request.user, action='Quest created')
        return Response(QuestModelSerializer(quest).data, status=status.HTTP_201_CREATED)


class QuestDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        return Quest.objects.get(pk=pk, owner=user)

    def get(self, request, pk):
        quest = self.get_object(pk, request.user)
        return Response(QuestModelSerializer(quest).data)

    def put(self, request, pk):
        quest = self.get_object(pk, request.user)
        serializer = QuestModelSerializer(quest, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        quest = serializer.save()
        QuestLog.objects.create(quest=quest, user=request.user, action='Quest updated')
        return Response(QuestModelSerializer(quest).data)

    def delete(self, request, pk):
        quest = self.get_object(pk, request.user)
        quest.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CompleteQuestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        quest = Quest.objects.get(pk=pk, owner=request.user)
        quest.status = Quest.Status.COMPLETED
        quest.save()
        QuestLog.objects.create(quest=quest, user=request.user, action='Quest completed')
        return Response({'message': 'Quest completed successfully.'})
