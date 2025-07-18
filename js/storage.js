// 💾 Save tasks to localStorage
export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 📚 Load tasks from localStorage
export function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}