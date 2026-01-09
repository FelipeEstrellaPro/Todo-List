const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
    const pending = tasks.filter(task => !task.completed).length;
    counter.textContent = `Tareas pendientes: ${pending}`;
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(index));

        const span = document.createElement("span");
        span.textContent = task.text;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(span);

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.addEventListener("click", () => deleteTask(index));

        actions.appendChild(deleteBtn);

        li.appendChild(taskContent);
        li.appendChild(actions);
        taskList.appendChild(li);
    });

    updateCounter();
}

function addTask(text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (text === "") {
        alert("La tarea no puede estar vacía");
        return;
    }

    addTask(text);
    input.value = "";
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();
