
export function validateTaskTitle(title) {
    if (typeof title !== "string" || title.trim() === "") {
        return false;
    }

    return true;
}

export function validateTaskPriority(priority) {
    const validPriorities = ["low", "medium", "high"];

    return validPriorities.includes(priority);
}
