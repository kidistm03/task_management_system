
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
            completeButton,
            editButton,
            deleteButton
        );

        taskList.appendChild(taskElement);
    });
}

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", function () {
    const confirmed = confirm("Are you sure you want to delete this task?");

    if (!confirmed) {
        return;
    }

    const taskIndex = tasks.findIndex(function (item) {
        return item.id === task.id;
    });

    if (taskIndex === -1) {
        return;
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    if (!saveTasks(tasks)) {
        tasks.splice(taskIndex, 0, deletedTask);
        alert("Could not delete the task. Please try again.");
        return;
    }

    renderTasks();
});


const editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.addEventListener("click", function () {
    const newTitle = prompt("Enter the new task title:", task.title);

    if (newTitle === null) {
        return;
    }

    if (!validateTaskTitle(newTitle)) {
        alert("Task title cannot be empty.");
        return;
    }

    const newDescription = prompt(
        "Enter the new description:",
        task.description
    );

    if (newDescription === null) {
        return;
    }

    const newPriority = prompt(
        "Enter priority: low, medium, or high",
        task.priority
    );

    if (newPriority === null) {
        return;
    }

    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(newPriority.trim().toLowerCase())) {
        alert("Please enter low, medium, or high.");
        return;
    }

    const oldTitle = task.title;
    const oldDescription = task.description;
    const oldPriority = task.priority;

    task.title = newTitle.trim();
    task.description = newDescription.trim();
    task.priority = newPriority.trim().toLowerCase();

    if (!saveTasks(tasks)) {
        task.title = oldTitle;
        task.description = oldDescription;
        task.priority = oldPriority;

        alert("Could not save your changes.");
        return;
    }

    renderTasks();
});


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
