const STORAGE_KEY = "smart-todos";
const THEME_KEY = "smart-todos-theme";

const elements = {
  input: document.querySelector("#task-input"),
  addButton: document.querySelector("#add-task"),
  list: document.querySelector("#todo-list"),
  template: document.querySelector("#todo-item-template"),
  emptyState: document.querySelector("#empty-state"),
  filters: document.querySelectorAll(".filter"),
  clearCompleted: document.querySelector("#clear-completed"),
  themeButtons: document.querySelectorAll(".theme-toggle button"),
};

let state = {
  filter: "all",
  todos: loadTodos(),
};

initializeTheme();
render();
attachEventHandlers();

function attachEventHandlers() {
  elements.addButton.addEventListener("click", () => {
    createTodo(elements.input.value.trim());
  });

  elements.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      createTodo(event.target.value.trim());
    }
  });

  elements.filters.forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      updateFilterUI();
      render();
    });
  });

  elements.clearCompleted.addEventListener("click", () => {
    state.todos = state.todos.filter((todo) => !todo.completed);
    persistTodos();
    render();
  });

  elements.themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.dataset.theme);
    });
  });
}

function createTodo(text) {
  if (!text) return;

  const newTodo = {
    id: generateId(),
    text,
    completed: false,
    createdAt: Date.now(),
  };

  state.todos = [newTodo, ...state.todos];
  elements.input.value = "";
  persistTodos();
  render();
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  persistTodos();
  render();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  persistTodos();
  render();
}

function render() {
  const filtered = getFilteredTodos();
  elements.list.innerHTML = "";

  if (!filtered.length) {
    elements.emptyState.hidden = false;
  } else {
    elements.emptyState.hidden = true;
  }

  filtered.forEach((todo) => {
    const clone = elements.template.content.firstElementChild.cloneNode(true);
    clone.dataset.id = todo.id;
    clone.querySelector(".todo__text").textContent = todo.text;

    if (todo.completed) {
      clone.classList.add("is-completed");
    }

    const checkbox = clone.querySelector(".todo__checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const removeButton = clone.querySelector(".todo__delete");
    removeButton.addEventListener("click", () => deleteTodo(todo.id));

    elements.list.appendChild(clone);
  });
}

function getFilteredTodos() {
  switch (state.filter) {
    case "active":
      return state.todos.filter((todo) => !todo.completed);
    case "completed":
      return state.todos.filter((todo) => todo.completed);
    default:
      return state.todos;
  }
}

function updateFilterUI() {
  elements.filters.forEach((button) => {
    const isActive = button.dataset.filter === state.filter;
    button.classList.toggle("is-active", isActive);
  });
}

function persistTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Failed to load todos", error);
    return [];
  }
}

function generateId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function initializeTheme() {
  const stored = localStorage.getItem(THEME_KEY) || "light";
  setTheme(stored);
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  elements.themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.setAttribute("aria-pressed", isActive.toString());
  });
}
