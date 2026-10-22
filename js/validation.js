
export function validateTaskTitle(title) {
    if (title.trim() === "") {
        return false;
    }

    return true;
}
