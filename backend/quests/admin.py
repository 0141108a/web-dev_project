from django.contrib import admin
from .models import Category, Quest, QuestLog

admin.site.register(Category)
admin.site.register(Quest)
admin.site.register(QuestLog)
