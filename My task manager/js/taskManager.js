/**
 * Task Manager module
 * Handles task operations and business logic
 */

const TaskManager = (function() {
  let tasks = [];
  let currentFilter = 'all';
  let currentSort = 'date-asc';
  
  /**
   * Initialize the task manager
   * Loads tasks from storage and sets up initial state
   */
  function init() {
    loadTasks();
    
    // Add event listeners for filter and sort
    document.getElementById('status-filter').addEventListener('change', handleFilterChange);
    document.getElementById('sort-by').addEventListener('change', handleSortChange);
  }
  
  /**
   * Load tasks from storage
   */
  function loadTasks() {
    tasks = StorageService.getTasks();
    renderTasks();
  }
  
  /**
   * Add a new task
   * @param {Object} taskData - Task data object
   */
  function addTask(taskData) {
    const newTask = StorageService.addTask(taskData);
    if (newTask) {
      tasks.push(newTask);
      renderTasks();
      showToast('Tâche créée avec succès', 'success');
    }
  }
  
  /**
   * Update an existing task
   * @param {Object} taskData - Updated task data
   */
  function updateTask(taskData) {
    const success = StorageService.updateTask(taskData);
    if (success) {
      // Update in-memory tasks array
      const index = tasks.findIndex(task => task.id === taskData.id);
      if (index !== -1) {
        tasks[index] = taskData;
      }
      
      renderTasks();
      showToast('Tâche mise à jour avec succès', 'success');
    }
  }
  
  /**
   * Delete a task
   * @param {String} taskId - ID of the task to delete
   */
  function deleteTask(taskId) {
    const success = StorageService.deleteTask(taskId);
    if (success) {
      tasks = tasks.filter(task => task.id !== taskId);
      renderTasks();
      showToast('Tâche supprimée avec succès', 'info');
    }
  }
  
  /**
   * Toggle task completion status
   * @param {String} taskId - ID of the task to toggle
   */
  function toggleTaskCompletion(taskId) {
    const updatedTask = StorageService.toggleTaskCompletion(taskId);
    if (updatedTask) {
      const index = tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        tasks[index] = updatedTask;
      }
      
      renderTasks();
      const status = updatedTask.completed ? 'terminée' : 'en cours';
      showToast(`Tâche marquée comme ${status}`, 'success');
    }
  }
  
  /**
   * Handle status filter change
   * @param {Event} event - Change event
   */
  function handleFilterChange(event) {
    currentFilter = event.target.value;
    renderTasks();
  }
  
  /**
   * Handle sort change
   * @param {Event} event - Change event
   */
  function handleSortChange(event) {
    currentSort = event.target.value;
    renderTasks();
  }
  
  /**
   * Filter tasks based on current filter
   * @returns {Array} Filtered array of tasks
   */
  function getFilteredTasks() {
    switch (currentFilter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return [...tasks];
    }
  }
  
  /**
   * Sort tasks based on current sort option
   * @param {Array} filteredTasks - Array of filtered tasks to sort
   * @returns {Array} Sorted array of tasks
   */
  function getSortedTasks(filteredTasks) {
    const sortedTasks = [...filteredTasks];
    
    switch (currentSort) {
      case 'date-asc':
        sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'date-desc':
        sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
      case 'priority-desc':
        sortedTasks.sort((a, b) => {
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        });
        break;
      case 'priority-asc':
        sortedTasks.sort((a, b) => {
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityValues[a.priority] - priorityValues[b.priority];
        });
        break;
      default:
        break;
    }
    
    return sortedTasks;
  }
  
  /**
   * Render tasks to the DOM
   */
  function renderTasks() {
    const filteredTasks = getFilteredTasks();
    const sortedTasks = getSortedTasks(filteredTasks);
    UI.renderTasksList(sortedTasks);
  }
  
  /**
   * Get a task by ID
   * @param {String} taskId - Task ID to find
   * @returns {Object|undefined} Found task or undefined
   */
  function getTaskById(taskId) {
    return tasks.find(task => task.id === taskId);
  }
  
  // Public API
  return {
    init,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTaskById,
    renderTasks
  };
})();