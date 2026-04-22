from rest_framework import serializers
from .models import Category, Quest, QuestLog


class CategoryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'owner']
        read_only_fields = ['id', 'owner']


class QuestModelSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Quest
        fields = [
            'id',
            'title',
            'description',
            'difficulty',
            'deadline',
            'status',
            'xp_reward',
            'owner',
            'category',
            'category_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'xp_reward', 'created_at', 'updated_at']


class QuestLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestLog
        fields = ['id', 'quest', 'user', 'action', 'created_at']
        read_only_fields = ['id', 'created_at']
