from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    QuestListCreateView,
    QuestDetailView,
    CompleteQuestView,
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('quests/', QuestListCreateView.as_view(), name='quest-list-create'),
    path('quests/<int:pk>/', QuestDetailView.as_view(), name='quest-detail'),
    path('quests/<int:pk>/complete/', CompleteQuestView.as_view(), name='quest-complete'),
]
