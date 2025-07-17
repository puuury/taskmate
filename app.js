// DOM element references
const titleInput = document.getElementById("task-title");
const dateInput = document.getElementById("task-date");
const priorityInput = document.getElementById("task-priority");
const aboutJs = document.getElementById("is-about-js");
const addButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const clearButton = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("theme-toggle");
const sortButton = document.getElementById("sort-date");
const searchBox = document.getElementById("search-box");
const jsBox = document.getElementById("js-box");

let tasks = []; // Task storage array
let defaultAddHandler; // To restore default add task action
let showingOnlyJs = false; // Toggle for JS-only view

// ✅ Highlight tasks due within 2 days
function checkDeadlines() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allTaskElements = [...taskList.children];
  allTaskElements.forEach(taskElement => {
    taskElement.style.animation = "";
    taskElement.style.border = "";
  });

  tasks.forEach(task => {
    if (task.done || !task.date) return;

    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2 && diffDays >= 0) {
      const taskElement = allTaskElements.find(el =>
        el.textContent.includes(task.title)
      );
      if (taskElement) {
        taskElement.style.animation = "pulse 1s infinite";
        taskElement.style.border = "2px solid red";
      }
    }
  });
}

// 🌓 Dark mode toggle and localStorage sync
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// ✅ Load saved theme and tasks on page load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }

  renderAllTasks(tasks);
  checkDeadlines();
});

// ➕ Default handler for adding new task
defaultAddHandler = () => {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;
  const isAboutJs = aboutJs.value;

  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  const task = { title, date, priority, isAboutJs, done: false };
  tasks.push(task);
  saveTasks();
  renderTask(task);
  checkDeadlines();

  // Reset form
  titleInput.value = "";
  dateInput.value = "";
  priorityInput.value = "low";
  aboutJs.value = "yes";
};

addButton.onclick = defaultAddHandler;

// 💾 Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🔄 Render all tasks
function renderAllTasks(taskArray) {
  taskList.innerHTML = "";
  taskArray.forEach((task) => renderTask(task));
}

// 🎯 Render a single task
function renderTask(task) {
  const taskItem = document.createElement("li");

  if (task.done) taskItem.classList.add("done");
  taskItem.classList.add(`priority-${task.priority}`);
  if (task.isAboutJs === "yes") taskItem.classList.add("about-js");

  const span = document.createElement("span");
  span.textContent = `About JS: ${task.isAboutJs} | Title: ${task.title} (DUE: ${task.date})`;

  // ✅ Toggle task done status on click
  span.addEventListener("click", () => {
    task.done = !task.done;
    taskItem.classList.toggle("done");
    saveTasks();
    checkDeadlines();
  });

  // ❌ Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className = "delete";
  delBtn.addEventListener("click", () => {
    taskItem.remove();
    tasks = tasks.filter((t) => t !== task);
    saveTasks();
  });

  // ✏️ Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className = "edit";
  editBtn.addEventListener("click", () => {
    titleInput.value = task.title;
    dateInput.value = task.date;
    priorityInput.value = task.priority;
    aboutJs.value = task.isAboutJs;
    addButton.textContent = "Update Task";

    // 👇 Handler for update
    addButton.onclick = () => {
      const newTitle = titleInput.value.trim();
      const newDate = dateInput.value;
      const newPriority = priorityInput.value;
      const newAbout = aboutJs.value;

      if (newTitle === "") {
        alert("Please enter a task title.");
        return;
      }

      task.title = newTitle;
      task.date = newDate;
      task.priority = newPriority;
      task.isAboutJs = newAbout;

      saveTasks();
      renderAllTasks(tasks);
      checkDeadlines();

      titleInput.value = "";
      dateInput.value = "";
      priorityInput.value = "low";
      aboutJs.value = "yes";
      addButton.textContent = "Add Task";
      addButton.onclick = defaultAddHandler;
    };
  });

  taskItem.appendChild(span);
  taskItem.appendChild(delBtn);
  taskItem.appendChild(editBtn);
  taskList.appendChild(taskItem);
}

// 🧹 Clear done tasks
clearButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderAllTasks(tasks);
});

// 🔍 Filter by done / not-done / all
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    let filtered = tasks;
    if (filter === "done") {
      filtered = tasks.filter((t) => t.done);
    } else if (filter === "not-done") {
      filtered = tasks.filter((t) => !t.done);
    }

    renderAllTasks(filtered);
  });
});

// 🔎 Live search by title
searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const filtered = tasks.filter((task) =>
    task.title.toLowerCase().includes(query)
  );
  renderAllTasks(filtered);
});

// 📅 Sort by date
sortButton.addEventListener("click", () => {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveTasks();
  renderAllTasks(tasks);
});

// 🟨 Filter only JS-related tasks
jsBox.addEventListener("click", () => {
  if (!showingOnlyJs) {
    const jsTasks = tasks.filter(task => task.isAboutJs === "yes");
    renderAllTasks(jsTasks);
    jsBox.textContent = "Only JS";
    showingOnlyJs = true;
  } else {
    renderAllTasks(tasks);
    jsBox.textContent = "JS Box";
    showingOnlyJs = false;
  }
});
