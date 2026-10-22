
const STORAGE_KEY = "tasks";

export function getTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks === null) {
            return [];
        }

        return JSON.parse(savedTasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

export function saveTasks(tasks) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

        return true;
    } catch (error) {
        console.error("Error saving tasks:", error);
        return false;
    }
}
