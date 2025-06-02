/**
 * Storage service for handling localStorage operations
 * This module provides methods to interact with localStorage for task persistence
 */

const StorageService = (function() {
  const STORAGE_KEY = 'taskManager_tasks';
  
  /**
   * Get all tasks from localStorage
   * @returns {Array} Array of task objects or empty array if none found
   */
  function getTasks() {
    try {
      const tasksJSON = localStorage.getItem(STORAGE_KEY);
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    } catch (error) {
      console.error('Error retrieving tasks from localStorage:', error);
      showToast('Erreur lors de la récupération des tâches', 'error');
      return [];
    }
  }
  
  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of task objects to save
   * @returns {Boolean} True if save was successful, false otherwise
   */
  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      showToast('Erreur lors de la sauvegarde des tâches', 'error');
      return false;
    }
  }
  
  /**
   * Add a new task to localStorage
   * @param {Object} task - Task object to add
   * @returns {Object} The added task with generated ID
   */
  function addTask(task) {
    try {
      const tasks = getTasks();
      // Generate a unique ID
      task.id = generateUniqueId();
      // Add created date
      task.createdAt = new Date().toISOString();
      // Set initial completed state
      task.completed = false;
      
      tasks.push(task);
      saveTasks(tasks);
      return task;
    } catch (error) {
      console.error('Error adding task:', error);
      showToast('Erreur lors de l\'ajout de la tâche', 'error');
      return null;
    }
  }
  
  /**
   * Update an existing task in localStorage
   * @param {Object} updatedTask - Task object with updates
   * @returns {Boolean} True if update was successful, false otherwise
   */
  function updateTask(updatedTask) {
    try {
      const tasks = getTasks();
      const index = tasks.findIndex(task => task.id === updatedTask.id);
      
      if (index !== -1) {
        // Preserve the created date and completed status if not explicitly changed
        updatedTask.createdAt = tasks[index].createdAt;
        if (typeof updatedTask.completed === 'undefined') {
          updatedTask.completed = tasks[index].completed;
        }
        
        tasks[index] = updatedTask;
        saveTasks(tasks);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      showToast('Erreur lors de la mise à jour de la tâche', 'error');
      return false;
    }
  }
  
  /**
   * Delete a task from localStorage
   * @param {String} taskId - ID of the task to delete
   * @returns {Boolean} True if deletion was successful, false otherwise
   */
  function deleteTask(taskId) {
    try {
      const tasks = getTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      
      if (tasks.length !== filteredTasks.length) {
        saveTasks(filteredTasks);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Erreur lors de la suppression de la tâche', 'error');
      return false;
    }
  }
  
  /**
   * Toggle the completed status of a task
   * @param {String} taskId - ID of the task to toggle
   * @returns {Object|null} Updated task object or null if not found
   */
  function toggleTaskCompletion(taskId) {
    try {
      const tasks = getTasks();
      const index = tasks.findIndex(task => task.id === taskId);
      
      if (index !== -1) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        return tasks[index];
      }
      
      return null;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      showToast('Erreur lors de la modification du statut de la tâche', 'error');
      return null;
    }
  }
  
  /**
   * Generate a unique ID for a task
   * @returns {String} Unique ID string
   */
  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  // Public API
  return {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
})();