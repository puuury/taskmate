// 🌟 Main app logic
import { saveTasks, loadTasks } from './storage.js';
import { renderTask, renderAllTasks, setTasksAndHandler } from './render.js';

// 📚 Load banned words from JSON file
let bannedWords = [];
fetch('../data/bannedWords.json')
  .then(response => response.json())
  .then(data => {
    bannedWords = data.map(item => item.title.toLowerCase());
  })
  .catch(error => {
    console.error('Error loading banned words:', error);

  });

// 📚 Load green words from JSON file
let greenWords = [];
fetch('../data/greenWords.json')
  .then(response => response.json())
  .then(data => {
    greenWords = data.map(item => item.title.toLowerCase());
  })
  .catch(error => {
    console.error('Error loading green words:', error);
  });

// 🚫 Check if text contains banned words
function containsBannedWords(text) {
  const lowerText = text.toLowerCase();
  return bannedWords.some(word => lowerText.includes(word));
}

function containsGreenWords(text) {
  const lowerText = text.toLowerCase();
  return greenWords.some(word => lowerText.includes(word));
}

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

let tasks = loadTasks(); // 📚 Load tasks from storage
let defaultAddHandler; // 🔄 To restore default add task action
let showingOnlyJs = false; // 🟨 Toggle for JS-only view

// 🚨 Show error message in DOM
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

// ✅ Highlight tasks due within 2 days
export function checkDeadlines() {
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
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  // 🌙 Change moon to sun and vice versa
  const moonIcon = themeToggle.querySelector(".moon, .sun");
  if (isDark) {
    moonIcon.textContent = "☀️";
    moonIcon.classList.remove("moon");
    moonIcon.classList.add("sun");
  } else {
    moonIcon.textContent = "🌙";
    moonIcon.classList.remove("sun");
    moonIcon.classList.add("moon");
  }
});

// 🟩 Show green modal for angry/عصبانی
function showGreenModal() {
  // Remove existing modal if present
  const oldModal = document.querySelector('.green-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.className = 'green-modal';
  modal.innerHTML = `
    <div>قول بده بیشتر بهش فکر کنی<br/>Promise to think about it more</div>
    <button class="promise-btn">Promise</button>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.promise-btn').onclick = () => {
    modal.remove();
  };
}

// ✅ Load saved theme and tasks on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const moonIcon = themeToggle.querySelector(".moon, .sun");
    moonIcon.textContent = "☀️";
    moonIcon.classList.remove("moon");
    moonIcon.classList.add("sun");
  } else {
    const moonIcon = themeToggle.querySelector(".moon, .sun");
    moonIcon.textContent = "🌙";
    moonIcon.classList.remove("sun");
    moonIcon.classList.add("moon");
  }
  setTasksAndHandler(tasks, defaultAddHandler);
  renderAllTasks(tasks, taskList);
  checkDeadlines();
});

// ➕ Default handler for adding new task
defaultAddHandler = () => {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;
  const isAboutJs = aboutJs.value;

  const errors = [];
  if (title === "") errors.push("task title");
  if (date === "") errors.push("task date");

  // 🟩 Check for green words (modal trigger)
  if (title && containsGreenWords(title)) {
    showGreenModal();
    return;
  }

  // 🚫 Check for banned words in title
  if (title && containsBannedWords(title)) {
    showError("Task title contains inappropriate language. Please use appropriate words.");
    return;
  }

  // ✅ Check if date is valid and not in the past
  if (date) {
    const taskDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(taskDate) || taskDate < today) {
      errors.push("valid future date");
    }
  }

  if (errors.length > 0) {
    showError(`Please enter a ${errors.join(" and ")}.`);
    return;
  }

  const task = { title, date, priority, isAboutJs, done: false };
  tasks.push(task);
  saveTasks(tasks);
  renderTask(task, taskList);
  checkDeadlines();

  // Reset form
  titleInput.value = "";
  dateInput.value = "";
  priorityInput.value = "low";
  aboutJs.value = "yes";
};

addButton.onclick = defaultAddHandler;

// 🧹 Clear done tasks
clearButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks(tasks);
  renderAllTasks(tasks, taskList);
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

    renderAllTasks(filtered, taskList);
  });
});

// 🔍 Search functionality
const searchToggle = document.getElementById("search-toggle");

// Live search by title
searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const filtered = tasks.filter((task) =>
    task.title.toLowerCase().includes(query)
  );
  renderAllTasks(filtered, taskList);
});

// Toggle search box on mobile/tablet
searchToggle.addEventListener("click", () => {
  if (window.innerWidth <= 1024) {
    searchBox.style.display = searchBox.style.display === "block" ? "none" : "block";
    if (searchBox.style.display === "block") {
      searchBox.focus();
    }
  }
});

// 📅 Sort by date
sortButton.addEventListener("click", () => {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveTasks(tasks);
  renderAllTasks(tasks, taskList);
});

// 🟨 Filter only JS-related tasks
jsBox.addEventListener("click", () => {
  if (!showingOnlyJs) {
    const jsTasks = tasks.filter(task => task.isAboutJs === "yes");
    renderAllTasks(jsTasks, taskList);
    jsBox.textContent = "Only JS";
    showingOnlyJs = true;
  } else {
    renderAllTasks(tasks, taskList);
    jsBox.textContent = "JS Box";
    showingOnlyJs = false;
  }
});