from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Task(BaseModel):
    id: int
    title: str
    status: bool

tasks = [
    Task(id=1, title="Task 1", status=False),
    Task(id=2, title="Task 2", status=True)
]


class User(BaseModel):
    id: int
    username: str

users = [
    User(id=1, username="user1"),
    User(id=2, username="user2")
]


@app.get("/users/{user_id}/tasks/", response_model=List[Task])
async def get_user_tasks(user_id: int):
    user_tasks = []
    for task in tasks:
        if task.id == user_id:
            user_tasks.append(task)
    if not user_tasks:
        raise HTTPException(status_code=404, detail="User tasks not found")
    return user_tasks

@app.get("/tasks/", response_model=List[Task])
async def get_tasks():
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    tasks.append(task)
    return task


@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: Task):
    for t in tasks:
        if t.id == task_id:
            t.title = task.title
            t.status = task.status
            return t
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    for i, task in enumerate(tasks):
        if task.id == task_id:
            del tasks[i]
            return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")
