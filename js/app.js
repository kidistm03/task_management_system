
import { createTask } from "./task.js";
import { validateTaskTitle } from "./validation.js";
import { getTasks, saveTasks } from "./storage.js";

let tasks = getTasks();

const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskPriorityInput = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");

function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.textContent = "No tasks yet.";
        return;
    }

    tasks.forEach(function (task) {
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "No description";


        const priority = document.createElement("p");
        priority.textContent = "Priority: " + task.priority;

        const status = document.createElement("p");
        status.textContent = task.completed ? "Completed" : "Pending";

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed
            ? "Mark as Pending"
            : "Mark as Completed";

        completeButton.addEventListener("click", function () {
            task.completed = !task.completed;

            if (!saveTasks(tasks)) {
                task.completed = !task.completed;
                alert("Could not save the task status.");
                return;
            }

            renderTasks();
        });

        taskElement.append(
            title,
            description,
            priority,
            status,
            completeButton
        );

        taskList.appendChild(taskElement);
    });
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const priority = taskPriorityInput.value;

    if (!validateTaskTitle(title)) {
        alert("Please enter a task title.");
        return;
    }

    const newTask = createTask(title, description, priority);

    tasks.push(newTask);

    const saved = saveTasks(tasks);

    if (!saved) {
        tasks.pop();
        alert("Could not save the task. Please try again.");
        return;
    }

    renderTasks();
    taskForm.reset();
});

renderTasks();
