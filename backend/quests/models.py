from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='purple')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name


class Quest(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'easy', 'Easy'
        MEDIUM = 'medium', 'Medium'
        HARD = 'hard', 'Hard'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.EASY)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    xp_reward = models.PositiveIntegerField(default=25)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quests')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='quests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        difficulty_map = {'easy': 25, 'medium': 50, 'hard': 100}
        self.xp_reward = difficulty_map.get(self.difficulty, 25)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class QuestLog(models.Model):
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quest_logs')
    action = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.action}'
