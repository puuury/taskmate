// 🎯 Render a single task
import { saveTasks } from './storage.js';
import { checkDeadlines } from './app.js';

// Import tasks and defaultAddHandler from app.js
let tasks = [];
let defaultAddHandler = null;

// Function to set tasks and defaultAddHandler from app.js
export function setTasksAndHandler(tasksArray, defaultHandler) {
  tasks = tasksArray;
  defaultAddHandler = defaultHandler;
}

export function renderTask(task, taskList) {
  const taskItem = document.createElement("li");

  taskItem.setAttribute("data-title", task.title);
  taskItem.setAttribute("data-date", task.date);

  if (task.done) taskItem.classList.add("done");
  taskItem.classList.add(`priority-${task.priority}`);
  if (task.isAboutJs === "yes") taskItem.classList.add("about-js");
  if (task.isExpired) taskItem.classList.add("expired");
  
  // Disable edit button for expired tasks
  if (task.isExpired) {
    editBtn.disabled = true;
    editBtn.style.opacity = "0.5";
  }

  // Create enhanced task display with deadline information
  const span = document.createElement("span");
  let deadlineInfo = "";
  
  if (task.daysUntilDue !== undefined) {
    if (task.isExpired) {
      deadlineInfo = ` (OVERDUE: ${Math.abs(task.daysUntilDue)} days)`;
    } else if (task.daysUntilDue === 0) {
      deadlineInfo = " (DUE TODAY!)";
    } else if (task.daysUntilDue <= 2) {
      deadlineInfo = ` (DUE IN ${task.daysUntilDue} days)`;
    } else {
      deadlineInfo = ` (DUE: ${task.date})`;
    }
  } else {
    deadlineInfo = ` (DUE: ${task.date})`;
  }
  
  span.textContent = `About JS: ${task.isAboutJs} | Title: ${task.title}${deadlineInfo}`;

  // ✅ Toggle task done status on click
  span.addEventListener("click", () => {
    task.done = !task.done;
    taskItem.classList.toggle("done");
    saveTasks(tasks);
    checkDeadlines();
  });

  // ❌ Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className = "delete";
  delBtn.addEventListener("click", () => {
    taskItem.remove();
    tasks = tasks.filter((t) => t !== task);
    saveTasks(tasks);
  });

  // ✏️ Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className = "edit";
  
  // Disable edit for expired tasks
  if (task.isExpired) {
    editBtn.disabled = true;
    editBtn.style.opacity = "0.5";
  }
  
  editBtn.addEventListener("click", () => {
    try {
      // Get DOM elements
      const titleInput = document.getElementById("task-title");
      const dateInput = document.getElementById("task-date");
      const priorityInput = document.getElementById("task-priority");
      const aboutJs = document.getElementById("is-about-js");
      const addButton = document.getElementById("add-task");
      
      if (!titleInput || !dateInput || !priorityInput || !aboutJs || !addButton) {
        console.error("Some DOM elements not found");
        return;
      }
      
      // Fill the form with task data
      titleInput.value = task.title;
      dateInput.value = task.date;
      priorityInput.value = task.priority;
      aboutJs.value = task.isAboutJs;
      addButton.textContent = "Update Task";

      // 🔄 Handler for update
      addButton.onclick = () => {
        const newTitle = titleInput.value.trim();
        const newDate = dateInput.value;
        const newPriority = priorityInput.value;
        const newAbout = aboutJs.value;

        if (newTitle === "") {
          alert("Please enter a task title.");
          return;
        }

        // Update the task
        task.title = newTitle;
        task.date = newDate;
        task.priority = newPriority;
        task.isAboutJs = newAbout;

        saveTasks(tasks);
        renderAllTasks(tasks, taskList);
        checkDeadlines();

        // Reset form
        titleInput.value = "";
        dateInput.value = "";
        priorityInput.value = "low";
        aboutJs.value = "yes";
        addButton.textContent = "Add Task";
        addButton.onclick = defaultAddHandler;
      };
    } catch (error) {
      console.error("Error in edit button:", error);
    }
  });

  taskItem.appendChild(span);
  taskItem.appendChild(delBtn);
  taskItem.appendChild(editBtn);
  taskList.appendChild(taskItem);
}

// 🔄 Render all tasks with enhanced sorting
export function renderAllTasks(tasks, taskList) {
  taskList.innerHTML = "";
  
  // Enhanced sorting: non-expired tasks first (by date), then expired tasks
  const sortedTasks = tasks.sort((a, b) => {
    if (a.isExpired !== b.isExpired) {
      return a.isExpired ? 1 : -1; // Expired tasks go to the end
    }
    return new Date(a.date) - new Date(b.date); // Sort by date for non-expired tasks
  });
  
  sortedTasks.forEach((task) => renderTask(task, taskList));
  checkDeadlines();
}