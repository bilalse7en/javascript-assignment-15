// FontAwesome icons
const editIcon = '<i class="fas fa-pencil-alt"></i>';
const saveIcon = '<i class="fas fa-check"></i>';
const trashIcon = '<i class="fas fa-trash-alt"></i>';

// Initialize an array to store tasks
let tasks = [];
let taskToDeleteId = null; // Variable to store the ID of the task to be deleted

// Function to add a new task
function addTask(taskName) {
  const task = {
    id: Date.now(),
    name: taskName,
    column: 'todo',
    priority: 'normal', // Added priority field
    createdAt: new Date(),
    updatedAt: new Date()
  };
  tasks.push(task);
  renderTasks();
}

// Function to render tasks
function renderTasks() {
  const todoList = document.getElementById('todo-list');
  const inProcessList = document.getElementById('in-process-list');
  const completedList = document.getElementById('completed-list');

  todoList.innerHTML = '';
  inProcessList.innerHTML = '';
  completedList.innerHTML = '';

  tasks.forEach((task) => {
    const taskElement = document.createElement('li');
    taskElement.className = 'task list-group-item my-1';
    taskElement.textContent = task.name;
    taskElement.draggable = true;
    taskElement.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', task.id.toString());
    });

    const editButton = document.createElement('button');
    editButton.className = 'bg-transparent border-0 end-0 position-absolute text-black';
    editButton.innerHTML = editIcon;
    editButton.addEventListener('click', () => {
      const taskNameElement = document.createElement('input');
      taskNameElement.type = 'text';
      taskNameElement.className = 'form-control';
      taskNameElement.value = task.name;
      taskElement.textContent = '';
      taskElement.appendChild(taskNameElement);

      const saveButton = document.createElement('button');
      saveButton.className = 'bg-transparent border-0 end-0 position-absolute text-black';
      saveButton.innerHTML = saveIcon;
      saveButton.addEventListener('click', () => {
        const newName = taskNameElement.value.trim();
        if (newName) {
          task.name = newName;
          task.updatedAt = new Date();
          renderTasks();
        }
      });
      taskElement.appendChild(saveButton);

      taskNameElement.focus();
    });
    taskElement.appendChild(editButton);

    const trashButton = document.createElement('button');
    trashButton.className = 'bg-transparent border-0 end-0 position-absolute text-black top-0';
    trashButton.innerHTML = trashIcon;
    trashButton.addEventListener('click', () => {
      taskToDeleteId = task.id;
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      deleteModal.show();
    });
    taskElement.appendChild(trashButton);

    const priorityDropdown = document.createElement('select');
    priorityDropdown.className = `form-select mt-2 ${getPriorityClass(task.priority)}`;

    // Add options without background color classes
    priorityDropdown.innerHTML = `
      <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
      <option value="normal" ${task.priority === 'normal' ? 'selected' : ''}>Normal</option>
      <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
      <option value="urgent" ${task.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
    `;

    priorityDropdown.addEventListener('change', (e) => {
      task.priority = e.target.value;
      priorityDropdown.className = `form-select mt-2 ${getPriorityClass(task.priority)}`;
      renderTasks();
    });

    taskElement.appendChild(priorityDropdown);

    const createdAtElement = document.createElement('span');
    createdAtElement.className = "ca-date right";
    createdAtElement.innerHTML = `Created at: ${formatDate(task.createdAt)}`;
    taskElement.appendChild(createdAtElement);

    const updatedAtElement = document.createElement('span');
    updatedAtElement.className = "ua-date left";
    updatedAtElement.innerHTML = `Updated at: ${formatDate(task.updatedAt)}`;
    taskElement.appendChild(updatedAtElement);

    switch (task.column) {
      case 'todo':
        todoList.appendChild(taskElement);
        break;
      case 'in-process':
        inProcessList.appendChild(taskElement);
        taskElement.classList.add('yellow');
        break;
      case 'completed':
        completedList.appendChild(taskElement);
        taskElement.classList.add('light-green');
        break;
    }
  });
}

// Function to format a date
function formatDate(date) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// Function to handle dragover and drop events
function handleDragEvents(column) {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    const task = tasks.find((task) => task.id === parseInt(taskId));
    task.column = column.id;
    task.updatedAt = new Date();
    renderTasks();
  });
}

// Function to get priority class based on task priority
function getPriorityClass(priority) {
  switch (priority) {
    case 'low':
      return 'bg-light';
    case 'normal':
      return 'bg-secondary';
    case 'high':
      return 'bg-warning';
    case 'urgent':
      return 'bg-danger';
    default:
      return '';
  }
}

// DOM elements
const todoList = document.getElementById('todo-list');
const inProcessList = document.getElementById('in-process-list');
const completedList = document.getElementById('completed-list');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');

// Event listeners
addTaskButton.addEventListener('click', () => {
  const taskName = newTaskInput.value.trim();
  if (taskName) {
    addTask(taskName);
    newTaskInput.value = '';
  }
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  tasks = tasks.filter(t => t.id !== taskToDeleteId);
  taskToDeleteId = null;
  renderTasks();
  const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
  deleteModal.hide();
});

handleDragEvents(todoList.parentNode);
handleDragEvents(inProcessList.parentNode);
handleDragEvents(completedList.parentNode);

// Initialize the Kanban board
renderTasks();