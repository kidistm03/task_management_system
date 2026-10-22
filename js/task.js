export function createTask(title, description, priority) {
    const task = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        completed: false
    };

    return task;
}

