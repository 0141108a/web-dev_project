# QUESTIFY

## Overview
Questify is a gamified task management web application that turns everyday tasks into quests.

Users can create tasks, assign difficulty levels, complete them, earn experience points (XP), and level up while tracking their progress.

---

## Team Members
- Bakyt Aiganym (24B031680)
- Yessenbek Ainur (24B031758)
- Eradilov Daniel (24B032125)

---

## Features
- JWT authentication (login/logout)
- Create, read, update, delete tasks
- Mark tasks as completed
- XP and level system
- User profile with progress tracking
- Basic error handling for API requests

---

## Tech Stack

### Front-End
- Angular
- TypeScript
- HTML / CSS

### Back-End
- Django Rest Framework (DRF)
- SQLite (development)

---

## Project Setup

### Front-End Setup

1. Clone the repository:
```bash
git clone https://github.com/0141108a/web-dev_project.git
cd web-dev_project/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the app:
```bash
ng serve
```

---

### Back-End Setup

1. Go to backend:
```bash
cd web-dev_project/backend
```

2. Create virtual environment:
```bash
python -m venv env
```

3. Activate environment (Windows):
```bash
env\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run server:
```bash
python manage.py migrate
python manage.py runserver
```

---

## Project Structure

```bash
web-dev_project/
├── frontend/
├── backend/
└── README.md
```

---

## Deployment
To be added...

---

## License
This project is for educational purposes.