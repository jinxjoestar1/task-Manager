/**
 * Form validation module
 * Provides functions to validate task form inputs
 */

const Validators = (function() {
  /**
   * Validate a task form
   * @param {Object} formData - Object containing form field values
   * @returns {Object} Object with isValid flag and error messages
   */
  function validateTaskForm(formData) {
    const errors = {};
    let isValid = true;
    
    // Validate title (required, max length)
    if (!formData.title.trim()) {
      errors.title = 'Le titre est obligatoire';
      isValid = false;
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Le titre ne doit pas dépasser 100 caractères';
      isValid = false;
    }
    
    // Validate due date (required, must be a valid date, not in the past)
    if (!formData.dueDate) {
      errors.dueDate = 'La date d\'échéance est obligatoire';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison
      
      if (isNaN(selectedDate.getTime())) {
        errors.dueDate = 'Date invalide';
        isValid = false;
      } else if (selectedDate < today) {
        errors.dueDate = 'La date d\'échéance ne peut pas être dans le passé';
        isValid = false;
      }
    }
    
    // Validate priority (required)
    if (!formData.priority) {
      errors.priority = 'La priorité est obligatoire';
      isValid = false;
    } else if (!['low', 'medium', 'high'].includes(formData.priority)) {
      errors.priority = 'Priorité invalide';
      isValid = false;
    }
    
    // Validate description (optional, max length)
    if (formData.description && formData.description.length > 500) {
      errors.description = 'La description ne doit pas dépasser 500 caractères';
      isValid = false;
    }
    
    return {
      isValid,
      errors
    };
  }
  
  /**
   * Format a date string for display
   * @param {String} dateString - ISO date string
   * @returns {String} Formatted date string
   */
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }
  
  /**
   * Check if a date is today
   * @param {String} dateString - ISO date string
   * @returns {Boolean} True if date is today
   */
  function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  /**
   * Check if a date is within a number of days from now
   * @param {String} dateString - ISO date string
   * @param {Number} days - Number of days
   * @returns {Boolean} True if date is within the specified days
   */
  function isWithinDays(dateString, days) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= days;
  }
  
  /**
   * Check if a date is in the past
   * @param {String} dateString - ISO date string
   * @returns {Boolean} True if date is in the past
   */
  function isPast(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Beginning of today
    
    return date < now;
  }
  
  /**
   * Get CSS class for displaying due date based on proximity
   * @param {String} dueDate - Due date string
   * @returns {String} CSS class name
   */
  function getDueDateClass(dueDate) {
    if (isPast(dueDate)) {
      return 'due-date-overdue';
    } else if (isWithinDays(dueDate, 2)) {
      return 'due-date-soon';
    }
    return '';
  }
  
  /**
   * Get priority text in French
   * @param {String} priority - Priority value (low, medium, high)
   * @returns {String} Priority text in French
   */
  function getPriorityText(priority) {
    const priorityMap = {
      'low': 'Basse',
      'medium': 'Moyenne',
      'high': 'Élevée'
    };
    
    return priorityMap[priority] || 'Non définie';
  }
  
  // Public API
  return {
    validateTaskForm,
    formatDate,
    isToday,
    isWithinDays,
    isPast,
    getDueDateClass,
    getPriorityText
  };
})();