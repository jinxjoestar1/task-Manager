/**
 * Filters module
 * Handles task filtering and sorting functionality
 */

const Filters = (function() {
  /**
   * Apply filters to tasks
   * @param {Array} tasks - Tasks array to filter
   * @param {String} statusFilter - Status filter value
   * @returns {Array} Filtered tasks
   */
  function filterByStatus(tasks, statusFilter) {
    switch (statusFilter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'all':
      default:
        return tasks;
    }
  }
  
  /**
   * Sort tasks by different criteria
   * @param {Array} tasks - Tasks array to sort
   * @param {String} sortBy - Sort criteria
   * @returns {Array} Sorted tasks
   */
  function sortTasks(tasks, sortBy) {
    const sortedTasks = [...tasks];
    
    switch (sortBy) {
      case 'date-asc':
        return sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      case 'date-desc':
        return sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      
      case 'priority-desc':
        return sortedTasks.sort((a, b) => {
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        });
      
      case 'priority-asc':
        return sortedTasks.sort((a, b) => {
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityValues[a.priority] - priorityValues[b.priority];
        });
      
      default:
        return sortedTasks;
    }
  }
  
  /**
   * Apply all filters and sorting to tasks
   * @param {Array} tasks - Original tasks array
   * @param {String} statusFilter - Status filter
   * @param {String} sortBy - Sort criteria
   * @returns {Array} Filtered and sorted tasks
   */
  function applyFiltersAndSort(tasks, statusFilter, sortBy) {
    const filteredTasks = filterByStatus(tasks, statusFilter);
    return sortTasks(filteredTasks, sortBy);
  }
  
  /**
   * Search tasks by keyword
   * @param {Array} tasks - Tasks array to search
   * @param {String} keyword - Search keyword
   * @returns {Array} Filtered tasks matching the keyword
   */
  function searchTasks(tasks, keyword) {
    if (!keyword || keyword.trim() === '') {
      return tasks;
    }
    
    const normalizedKeyword = keyword.toLowerCase().trim();
    
    return tasks.filter(task => {
      return (
        task.title.toLowerCase().includes(normalizedKeyword) ||
        (task.description && task.description.toLowerCase().includes(normalizedKeyword))
      );
    });
  }
  
  // Public API
  return {
    filterByStatus,
    sortTasks,
    applyFiltersAndSort,
    searchTasks
  };
})();