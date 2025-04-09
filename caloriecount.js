// Wait until the HTML document is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- Get References to HTML Elements ---
    const setGoalButton = document.getElementById('set-calorie-goal-btn');
    const dailyGoalDisplay = document.getElementById('daily-goal-display');
    const calorieModal = document.getElementById('calorie-modal');
    const calorieInput = document.getElementById('calorie-input');
    const saveButton = document.getElementById('calorie-save-btn');
    const cancelButton = document.getElementById('calorie-cancel-btn');
    const closeButton = calorieModal.querySelector('.calorie-close-button'); // More specific selector
    const errorMessage = document.getElementById('calorie-error-message');
    const overlay = document.getElementById('overlay-bg'); // Get overlay reference
  
    // --- Constants ---
    const CALORIE_GOAL_STORAGE_KEY = 'dailyCalorieGoal';
  
    // --- Functions ---
  
    // Function to show the modal
    function openModal() {
      errorMessage.style.display = 'none'; // Hide error message on open
      calorieInput.value = ''; // Clear previous input
      // Optionally set the input to the current goal when opening
      // const currentGoal = localStorage.getItem(CALORIE_GOAL_STORAGE_KEY) || 0;
      // calorieInput.value = currentGoal > 0 ? currentGoal : '';
      calorieModal.classList.add('calorie-modal-visible'); // Use the CSS class to show
      if (overlay) { // Check if overlay exists
          overlay.style.display = 'block'; // Show overlay
      }
      calorieInput.focus(); // Set focus to the input field
    }
  
    // Function to hide the modal
    function closeModal() {
      calorieModal.classList.remove('calorie-modal-visible'); // Use the CSS class to hide
       if (overlay) { // Check if overlay exists
          overlay.style.display = 'none'; // Hide overlay
      }
    }
  
    // Function to update the displayed goal on the page
    function updateGoalDisplay(goal) {
      dailyGoalDisplay.textContent = goal;
    }
  
    // Function to save the goal
    function saveGoal() {
      const goalValue = calorieInput.value.trim();
      const goalNumber = parseInt(goalValue, 10); // Parse as integer
  
      // Validation: Check if it's a positive number
      if (goalValue === '' || isNaN(goalNumber) || goalNumber <= 0) {
        errorMessage.style.display = 'block'; // Show error message
        return; // Stop the function if validation fails
      }
  
      // Save to localStorage
      localStorage.setItem(CALORIE_GOAL_STORAGE_KEY, goalNumber);
  
      // Update the display on the page
      updateGoalDisplay(goalNumber);
  
      // Close the modal
      closeModal();
    }
  
     // Function to handle clicking outside the modal (on the overlay)
     function handleOverlayClick(event) {
         // Check if the click target is the overlay itself
         if (event.target === overlay) {
             closeModal();
         }
     }
  
    // --- Event Listeners ---
  
    // Open modal when the "Set Daily Calorie Goal" button is clicked
    if (setGoalButton) {
        setGoalButton.addEventListener('click', openModal);
    } else {
        console.error("Element with ID 'set-calorie-goal-btn' not found.");
    }
  
  
    // Save goal when the Save button inside the modal is clicked
    if (saveButton) {
        saveButton.addEventListener('click', saveGoal);
    } else {
         console.error("Element with ID 'calorie-save-btn' not found.");
    }
  
  
    // Close modal when the Cancel button inside the modal is clicked
    if (cancelButton) {
         cancelButton.addEventListener('click', closeModal);
     } else {
         console.error("Element with ID 'calorie-cancel-btn' not found.");
     }
  
  
    // Close modal when the Close button (X) inside the modal is clicked
    if (closeButton) {
         closeButton.addEventListener('click', closeModal);
     } else {
         console.error("Element with class '.calorie-close-button' not found inside modal.");
     }
  
     // Close modal when clicking on the overlay background
     if (overlay) {
         overlay.addEventListener('click', handleOverlayClick);
     }
     // Note: Your existing overlay likely already has an onclick="closePopup()"
     // which might call a function in script.js. If closing the calorie modal
     // via the overlay doesn't work, we might need to adjust this slightly
     // or ensure your `closePopup` function handles the calorie modal too.
  
  
     // Add listener for Enter key within the input field
     if (calorieInput) {
         calorieInput.addEventListener('keypress', (event) => {
             // Check if the key pressed was 'Enter'
             if (event.key === 'Enter' || event.keyCode === 13) {
                 event.preventDefault(); // Prevent default form submission (if any)
                 saveGoal(); // Call the save function
             }
         });
     } else {
          console.error("Element with ID 'calorie-input' not found.");
     }
  
  
    // --- Initial Setup on Page Load ---
  
    // Load the saved goal from localStorage when the page loads
    const savedGoal = localStorage.getItem(CALORIE_GOAL_STORAGE_KEY);
    if (savedGoal) {
      updateGoalDisplay(savedGoal);
    } else {
      updateGoalDisplay('0'); // Default to 0 if nothing is saved
    }
  
    // Basic check to ensure the display element exists
    if (!dailyGoalDisplay) {
        console.error("Element with ID 'daily-goal-display' not found.");
    }
  
  }); // End of DOMContentLoaded listener