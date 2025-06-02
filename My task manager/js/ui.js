/**
 * UI module
 * Handles the user interface interactions and rendering
 */

const UI = (function() {
  // DOM Elements cache
  const elements = {
    tasksList: document.getElementById('tasks-list'),
    noTasksMessage: document.getElementById('no-tasks-message'),
    newTaskBtn: document.getElementById('new-task-btn'),
    taskModal: document.getElementById('task-modal'),
    closeModal: document.getElementById('close-modal'),
    taskForm: document.getElementById('task-form'),
    taskId: document.getElementById('task-id'),
    taskTitle: document.getElementById('task-title'),
    taskDescription: document.getElementById('task-description'),
    taskDueDate: document.getElementById('task-due-date'),
    taskPriority: document.getElementById('task-priority'),
    saveTask: document.getElementById('save-task'),
    cancelTask: document.getElementById('cancel-task'),
    deleteModal: document.getElementById('delete-modal'),
    closeDeleteModal: document.getElementById('close-delete-modal'),
    confirmDelete: document.getElementById('confirm-delete'),
    cancelDelete: document.getElementById('cancel-delete'),
    toastContainer: document.getElementById('toast-container'),
    modalTitle: document.getElementById('modal-title')
  };
  
  // Form validation error elements
  const errorElements = {
    title: document.getElementById('title-error'),
    date: document.getElementById('date-error'),
    priority: document.getElementById('priority-error')
  };
  
  // Current task being edited or deleted
  let currentTaskId = null;
  
  /**
   * Initialize UI
   * Set up event listeners
   */
  function init() {
    // Set today as the min date for task due date
    const today = new Date().toISOString().split('T')[0];
    elements.taskDueDate.min = today;
    
    // Button event listeners
    elements.newTaskBtn.addEventListener('click', showAddTaskModal);
    elements.closeModal.addEventListener('click', closeTaskModal);
    elements.cancelTask.addEventListener('click', closeTaskModal);
    elements.closeDeleteModal.addEventListener('click', closeDeleteModal);
    elements.cancelDelete.addEventListener('click', closeDeleteModal);
    
    // Form submission
    elements.taskForm.addEventListener('submit', handleTaskFormSubmit);
    
    // Delete confirmation
    elements.confirmDelete.addEventListener('click', confirmDeleteTask);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === elements.taskModal) {
        closeTaskModal();
      }
      if (e.target === elements.deleteModal) {
        closeDeleteModal();
      }
    });
    
    // Keyboard accessibility
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (elements.taskModal.classList.contains('show')) {
          closeTaskModal();
        }
        if (elements.deleteModal.classList.contains('show')) {
          closeDeleteModal();
        }
      }
    });
  }
  
  /**
   * Render the tasks list
   * @param {Array} tasks - Array of task objects to render
   */
  function renderTasksList(tasks) {
    // Clear previous tasks
    elements.tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
      elements.noTasksMessage.style.display = 'block';
      return;
    }
    
    elements.noTasksMessage.style.display = 'none';
    
    // Create HTML for each task
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      elements.tasksList.appendChild(taskElement);
    });
  }
  
  /**
   * Create a DOM element for a task
   * @param {Object} task - Task object
   * @returns {HTMLElement} Task DOM element
   */
  function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card priority-${task.priority}`;
    taskCard.setAttribute('data-task-id', task.id);
    taskCard.setAttribute('tabindex', '0');
    
    if (task.completed) {
      taskCard.classList.add('completed');
    }
    
    // Create the task header
    const taskHeader = document.createElement('div');
    taskHeader.className = 'task-header';
    
    const taskTitle = document.createElement('h3');
    taskTitle.className = 'task-title';
    taskTitle.textContent = task.title;
    
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    // Create action buttons
    const completeBtn = createActionButton(
      task.completed ? '✓' : '○',
      'complete',
      `Marquer comme ${task.completed ? 'non terminée' : 'terminée'}`,
      () => handleToggleComplete(task.id)
    );
    
    const editBtn = createActionButton(
      '✎',
      'edit',
      'Modifier',
      () => handleEditTask(task.id)
    );
    
    const deleteBtn = createActionButton(
      '×',
      'delete',
      'Supprimer',
      () => handleDeleteTask(task.id)
    );
    
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);
    
    taskHeader.appendChild(taskTitle);
    taskHeader.appendChild(taskActions);
    
    // Create the task content
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    if (task.description) {
      const taskDescription = document.createElement('p');
      taskDescription.className = 'task-description';
      taskDescription.textContent = task.description;
      taskContent.appendChild(taskDescription);
    }
    
    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';
    
    // Due date with proper formatting
    const dueDateClass = Validators.getDueDateClass(task.dueDate);
    const taskDueDate = document.createElement('div');
    taskDueDate.className = `task-due-date ${dueDateClass}`;
    
    if (Validators.isToday(task.dueDate)) {
      taskDueDate.textContent = 'Aujourd\'hui';
    } else {
      taskDueDate.textContent = Validators.formatDate(task.dueDate);
    }
    
    // Priority label
    const taskPriority = document.createElement('div');
    taskPriority.className = `task-priority priority-${task.priority}`;
    taskPriority.textContent = Validators.getPriorityText(task.priority);
    
    taskMeta.appendChild(taskDueDate);
    taskMeta.appendChild(taskPriority);
    
    taskContent.appendChild(taskMeta);
    
    // Add all elements to the card
    taskCard.appendChild(taskHeader);
    taskCard.appendChild(taskContent);
    
    return taskCard;
  }
  
  /**
   * Create an action button
   * @param {String} icon - Button icon/text
   * @param {String} type - Button type (class)
   * @param {String} ariaLabel - Accessibility label
   * @param {Function} clickHandler - Click event handler
   * @returns {HTMLButtonElement} Action button
   */
  function createActionButton(icon, type, ariaLabel, clickHandler) {
    const button = document.createElement('button');
    button.className = `action-btn ${type}`;
    button.innerHTML = icon;
    button.setAttribute('aria-label', ariaLabel);
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      clickHandler();
    });
    return button;
  }
  
  /**
   * Show the add task modal
   */
  function showAddTaskModal() {
    resetTaskForm();
    elements.modalTitle.textContent = 'Ajouter une Tâche';
    elements.taskModal.classList.add('show');
    elements.taskTitle.focus();
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  /**
   * Show the edit task modal
   * @param {Object} task - Task object to edit
   */
  function showEditTaskModal(task) {
    resetTaskForm();
    
    elements.modalTitle.textContent = 'Modifier la Tâche';
    elements.taskId.value = task.id;
    elements.taskTitle.value = task.title;
    elements.taskDescription.value = task.description || '';
    elements.taskDueDate.value = task.dueDate.split('T')[0];
    elements.taskPriority.value = task.priority;
    
    elements.taskModal.classList.add('show');
    elements.taskTitle.focus();
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  /**
   * Close the task modal
   */
  function closeTaskModal() {
    elements.taskModal.classList.remove('show');
    resetTaskForm();
    document.body.style.overflow = '';
  }
  
  /**
   * Reset the task form
   */
  function resetTaskForm() {
    elements.taskForm.reset();
    elements.taskId.value = '';
    
    // Clear validation errors
    clearFormErrors();
  }
  
  /**
   * Clear form validation errors
   */
  function clearFormErrors() {
    Object.values(errorElements).forEach(element => {
      element.textContent = '';
    });
  }
  
  /**
   * Display form validation errors
   * @param {Object} errors - Object containing error messages by field
   */
  function displayFormErrors(errors) {
    clearFormErrors();
    
    if (errors.title) {
      errorElements.title.textContent = errors.title;
    }
    
    if (errors.dueDate) {
      errorElements.date.textContent = errors.dueDate;
    }
    
    if (errors.priority) {
      errorElements.priority.textContent = errors.priority;
    }
  }
  
  /**
   * Handle task form submission
   * @param {Event} e - Form submission event
   */
  function handleTaskFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
      title: elements.taskTitle.value,
      description: elements.taskDescription.value,
      dueDate: elements.taskDueDate.value,
      priority: elements.taskPriority.value
    };
    
    const validation = Validators.validateTaskForm(formData);
    
    if (!validation.isValid) {
      displayFormErrors(validation.errors);
      return;
    }
    
    const taskId = elements.taskId.value;
    
    if (taskId) {
      // Update existing task
      formData.id = taskId;
      TaskManager.updateTask(formData);
    } else {
      // Add new task
      TaskManager.addTask(formData);
    }
    
    closeTaskModal();
  }
  
  /**
   * Handle task edit button click
   * @param {String} taskId - ID of the task to edit
   */
  function handleEditTask(taskId) {
    const task = TaskManager.getTaskById(taskId);
    if (task) {
      showEditTaskModal(task);
    }
  }
  
  /**
   * Handle task delete button click
   * @param {String} taskId - ID of the task to delete
   */
  function handleDeleteTask(taskId) {
    currentTaskId = taskId;
    elements.deleteModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close the delete confirmation modal
   */
  function closeDeleteModal() {
    elements.deleteModal.classList.remove('show');
    currentTaskId = null;
    document.body.style.overflow = '';
  }
  
  /**
   * Confirm task deletion
   */
  function confirmDeleteTask() {
    if (currentTaskId) {
      TaskManager.deleteTask(currentTaskId);
      closeDeleteModal();
    }
  }
  
  /**
   * Handle task completion toggle
   * @param {String} taskId - ID of the task to toggle
   */
  function handleToggleComplete(taskId) {
    TaskManager.toggleTaskCompletion(taskId);
  }
  
  // Public API
  return {
    init,
    renderTasksList,
    showAddTaskModal,
    closeTaskModal
  };
})();

/**
 * Display a toast notification
 * @param {String} message - Notification message
 * @param {String} type - Notification type (success, error, info, warning)
 */
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });
  
  toast.appendChild(messageSpan);
  toast.appendChild(closeBtn);
  
  toastContainer.appendChild(toast);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 5000);
}