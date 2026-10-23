
import { createTask } from "./task.js";
import {
    validateTaskTitle,
    validateTaskPriority
} from "./validation.js";
import { getTasks, saveTasks } from "./storage.js";

let tasks = getTasks();
let currentFilter = "all";

// Get the HTML elements
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskPriorityInput = document.getElementById("task-priority");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll("[data-filter]");
const taskList = document.getElementById("task-list");
const totalTasksElement = document.getElementById("total-tasks");
const completedTasksElement = document.getElementById("completed-tasks");
const pendingTasksElement = document.getElementById("pending-tasks");

// Check that the required HTML elements exist
if (
    !taskForm ||
    !taskTitleInput ||
    !taskDescriptionInput ||
    !taskPriorityInput ||
    !searchInput ||
    !taskList ||
    !totalTasksElement ||
    !completedTasksElement ||
    !pendingTasksElement
) {
    throw new Error("Some required HTML elements are missing.");
}

// Check that saved tasks have the expected basic structure
if (
    !Array.isArray(tasks) ||
    !tasks.every(function (task) {
        return (
            task &&
            typeof task.title === "string" &&
            typeof task.completed === "boolean" &&
            ["low", "medium", "high"].includes(task.priority)
        );
    })
) {
    tasks = [];
    saveTasks(tasks);
}

// Update the task statistics
function updateStatistics() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pendingTasks = totalTasks - completedTasks;

    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    pendingTasksElement.textContent = pendingTasks;
}

// Display tasks on the page
function renderTasks() {
    updateStatistics();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.textContent = "No tasks yet.";
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(function (task) {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchText);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "completed" && task.completed) ||
            (currentFilter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.textContent = "No matching tasks found.";
        return;
    }

    filteredTasks.forEach(function (task) {
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

        // Create the completion button
        const completeButton = document.createElement("button");
        completeButton.type = "button";
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

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            const newTitle = prompt(
                "Enter the new task title:",
                task.title
            );

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

            const cleanedPriority = newPriority.trim().toLowerCase();

            if (!validateTaskPriority(cleanedPriority)) {
                alert("Please enter low, medium, or high.");
                return;
            }

            const oldTitle = task.title;
            const oldDescription = task.description;
            const oldPriority = task.priority;

            task.title = newTitle.trim();
            task.description = newDescription.trim();
            task.priority = cleanedPriority;

            if (!saveTasks(tasks)) {
                task.title = oldTitle;
                task.description = oldDescription;
                task.priority = oldPriority;

                alert("Could not save your changes.");
                return;
            }

            renderTasks();
        });

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            const confirmed = confirm(
                "Are you sure you want to delete this task?"
            );

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

        // Add all task information and buttons to the task
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

// Add a new task when the form is submitted
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const priority = taskPriorityInput.value;

    if (!validateTaskTitle(title)) {
        alert("Please enter a task title.");
        return;
    }

    if (!validateTaskPriority(priority)) {
        alert("Please select a valid priority.");
        return;
    }

    const newTask = createTask(title, description, priority);

    tasks.push(newTask);

    if (!saveTasks(tasks)) {
        tasks.pop();
        alert("Could not save the task. Please try again.");
        return;
    }

    taskForm.reset();
    renderTasks();
});

// Search tasks while the user types
searchInput.addEventListener("input", function () {
    renderTasks();
});

// Change the task filter
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

// Display saved tasks when the page opens
renderTasks();
