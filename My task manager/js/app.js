/**
 * Main application entry point
 * Initializes the task manager application
 */

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('TaskManager application initialized');
  
  // Initialize UI components
  UI.init();
  
  // Initialize TaskManager and load tasks
  TaskManager.init();
  
  // Add keyboard support for task interactions
  addKeyboardSupport();
  
  // Set dark mode based on user preference
  setColorSchemeListener();
});

/**
 * Add keyboard support for tasks interaction
 */
function addKeyboardSupport() {
  document.addEventListener('keydown', function(e) {
    // Check if focus is on a task card
    const focusedElement = document.activeElement;
    
    if (focusedElement && focusedElement.classList.contains('task-card')) {
      const taskId = focusedElement.getAttribute('data-task-id');
      
      if (taskId) {
        // Enter key to view/edit
        if (e.key === 'Enter') {
          e.preventDefault();
          const task = TaskManager.getTaskById(taskId);
          if (task) {
            UI.showEditTaskModal(task);
          }
        }
        
        // Space to toggle completion
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          TaskManager.toggleTaskCompletion(taskId);
        }
        
        // Delete key to prompt deletion
        if (e.key === 'Delete') {
          e.preventDefault();
          currentTaskId = taskId;
          elements.deleteModal.classList.add('show');
        }
      }
    }
  });
}

/**
 * Set color scheme listener for dark mode support
 */
function setColorSchemeListener() {
  // Check for user's color scheme preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Listen for changes in the color scheme preference
  prefersDarkScheme.addEventListener('change', (e) => {
    if (e.matches) {
      console.log('Dark mode active');
    } else {
      console.log('Light mode active');
    }
  });
}