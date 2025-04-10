// /**
//  * meals.js - Manages meal-related functionality for the calendar application.
//  * This module handles the creation, logging, and viewing of meals
//  */

const CREATED_MEALS_STORAGE_KEY = 'createdMeals'; 

/**
 * Safely retrieves the array of created meal templates from localStorage.
 * @returns {Array} 
 */
function getCreatedMeals() {
    const mealsJSON = localStorage.getItem(CREATED_MEALS_STORAGE_KEY);
    try {

        return mealsJSON ? JSON.parse(mealsJSON) : [];
    } catch (e) {
        console.error("Error parsing created meals from localStorage", e);
        return []; 
    }
}

/**
 * Safely saves an array of created meal templates to localStorage.
 * @param {Array} mealsArray 
 */
function saveCreatedMeals(mealsArray) {
    try {
        localStorage.setItem(CREATED_MEALS_STORAGE_KEY, JSON.stringify(mealsArray));
    } catch (e) {
        console.error("Error saving created meals to localStorage", e);
    }
}

/**
 * Opens a popup for creating a new meal with a form to input meal details.
 * Attaches event listeners for closing the popup and submitting the form.
 */
function openCreateMealPopup() {
  document.getElementById("popup-content").innerHTML = `
    <div>
      <h2>Create Meal</h2>
      <hr>
      <br>
      <button id="popup-close-btn" class="close-btn">Close</button>
      <form id="create-meal-form">
        <div>
          <label for="create-meal-name">Meal Name:</label>
          <input
            type="text"
            id="create-meal-name"
            name="create-meal-name"
            class="inputArea"
            required
          >
        </div>
        <br>
        <div>
          <label for="create-meal-calories">Calories (per serving):</label>
          <input
            type="number"
            id="create-meal-calories"
            name="create-meal-calories"
            min="0"
            class="inputArea"
            required
          >
        </div>
        <br>
        <div>
          <label for="create-meal-protein">Protein (grams per serving) (Optional):</label>
          <input
            type="number"
            id="create-meal-protein"
            name="create-meal-protein"
            min="0"
            class="inputArea"
          >
        </div>
        <br>
        <div>
          <label for="create-meal-carbs">Carbohydrates (grams per serving) (Optional):</label>
          <input
            type="number"
            id="create-meal-carbs"
            name="create-meal-carbs"
            min="0"
            class="inputArea"
          >
        </div>
        <br>
        <div>
          <label for="create-meal-fats">Fats (grams per serving) (Optional):</label>
          <input
            type="number"
            id="create-meal-fats"
            name="create-meal-fats"
            min="0"
            class="inputArea"
          >
        </div>
        <br>
        <div>
          <label for="create-meal-serving-size">Serving Size:</label>
          <input
            type="text"
            id="create-meal-serving-size"
            name="create-meal-serving-size"
            class="inputArea"
            required
          >
        </div>
        <br>
        <button type="submit" class="submenuBtn">Create Meal</button>
      </form>
    </div>
  `;

  // Attach event listeners after DOM update
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document
    .getElementById("create-meal-form")
    .addEventListener("submit", handleCreateMealSubmit);

  // Show the popup and overlay
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
}

/**
 * Opens a popup for logging a meal, pre-filling the date with today's date.
 * Attaches event listeners for closing the popup and submitting the form.
 * UPDATED to match the input style of Create Meal
 * ADDED meal template buttons section.
 */
function openLogMealPopup() {
  document.getElementById("popup-content").innerHTML = `
  <div>
    <h2>Log Meal</h2>
    <hr>
    <br>
    <button id="popup-close-btn" class="close-btn">Close</button>

    <!-- START: Add this section for template buttons -->
    <div class="meal-templates-container" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ccc;">
        <h4>Created Meals:</h4>
        <div id="log-meal-template-buttons">
            <!-- Saved meal buttons will be added here by JavaScript -->
            <p>Loading templates...</p>
        </div>
    </div>
    <!-- END: Add this section for template buttons -->

    <form id="log-meal-form">
      <div>
        <label for="meal-name">Meal Name:</label>
        <input
          type="text"
          id="meal-name"
          name="meal-name"
          class="inputArea"
          required
        >
      </div>
      <br>
      <div>
        <label for="meal-date">Date:</label>
        <input
          type="date"
          id="meal-date"
          name="meal-date"
          value="${new Date().toISOString().split("T")[0]}"
          class="inputArea"
          required
        >
      </div>
      <br>
      <div>
        <label for="meal-calories">Calories (per serving):</label>
        <input
          type="number"
          id="meal-calories"
          name="meal-calories"
          min="0"
          class="inputArea"
          required
        >
      </div>
      <br>
      <div>
        <label for="log-meal-protein">Protein (grams per serving) (Optional):</label>
        <input
          type="number"
          id="log-meal-protein"
          name="log-meal-protein"
          min="0"
          class="inputArea"
        >
      </div>
      <br>
      <div>
        <label for="log-meal-carbs">Carbohydrates (grams per serving) (Optional):</label>
        <input
          type="number"
          id="log-meal-carbs"
          name="log-meal-carbs"
          min="0"
          class="inputArea"
        >
      </div>
      <br>
      <div>
        <label for="log-meal-fats">Fats (grams per serving) (Optional):</label>
        <input
          type="number"
          id="log-meal-fats"
          name="log-meal-fats"
          min="0"
          class="inputArea"
        >
      </div>
      <br>
      <div>
        <label for="serving-size">Serving Size (Optional):</label>
        <input
          type="text"
          id="serving-size"
          name="serving-size"
          class="inputArea"

        >
      </div>
      <br>
      <button type="submit" class="submenuBtn">Log Meal</button>
    </form>
  </div>
`;

  // Attach event listeners after DOM update
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);
  document
      .getElementById("log-meal-form")
      .addEventListener("submit", handleLogMealSubmit);

  // Display the meal template buttons
  displayMealTemplatesForLogging();

  // Show the popup and overlay
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
}

/**
 * Opens a popup to view logged and created meals from localStorage.
 * Displays meals in two sections with conditional rendering for empty states.
 * UPDATED to display protein/carbs/fats for logged meals and format created meals display.
 */
function openViewMealsPopup() {
  let loggedMealsHTML = "<h3>Logged Meals:</h3>";
  let createdMealsHTML = "<h3>Created Meals:</h3>";

  // Fetch and parse logged meals
  let loggedMeals = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("loggedMeal-")) {
      try {
        const meal = JSON.parse(localStorage.getItem(key));
        loggedMeals.push(meal);
      } catch (e) {
        console.error("Error parsing logged meal:", key, e);
      }
    }
  }

  // Build HTML for logged meals - UPDATED
  if (loggedMeals.length > 0) {
    loggedMeals.forEach((meal) => {
      loggedMealsHTML += `
        <div class="meal-entry">
          <strong>${meal.name}</strong> (${meal.date})<br>
          Calories: ${meal.calories}
          ${meal.protein ? `<br>Protein: ${meal.protein}g` : ""}
          ${meal.carbs ? `<br>Carbs: ${meal.carbs}g` : ""}
          ${meal.fats ? `<br>Fats: ${meal.fats}g` : ""}
          ${meal.servingSize ? `<br>Serving Size: ${meal.servingSize}` : ""}
        </div>
         <hr>
      `;
    });

  } else {
    loggedMealsHTML += "<p>No meals have been logged yet.</p>";
  }

  // Fetch and parse created meals
  let createdMeals = [];
  const createdMealsString = localStorage.getItem("createdMeals");
  if (createdMealsString) {
    try {
      createdMeals = JSON.parse(createdMealsString);
    } catch (e) {
      console.error("Error parsing created meals:", e);
    }
  }

  // Build HTML for created meals - UPDATED (added <br> before Serving Size)
  if (createdMeals.length > 0) {
    createdMeals.forEach((meal) => {
      createdMealsHTML += `
        <div class="meal-entry">
          <strong>${meal.name}</strong><br>
          Calories (per serving): ${meal.calories}
          ${meal.protein ? `<br>Protein: ${meal.protein}g` : ""}
          ${meal.carbs ? `<br>Carbs: ${meal.carbs}g` : ""}
          ${meal.fats ? `<br>Fats: ${meal.fats}g` : ""}
          <br>Serving Size: ${meal.servingSize} 
        </div>
        <hr>
      `;
    });

  } else {
    createdMealsHTML += "<p>No meals have been created yet.</p>";
  }

  // Update popup content
  document.getElementById("popup-content").innerHTML = `
    <div>
      <h2>View Meals</h2>
      <button id="popup-close-btn" class="close-btn">Close</button>
      ${loggedMealsHTML}
      <hr>
      ${createdMealsHTML}
    </div>
  `;

  // Attach event listener for closing
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);

  // Show the popup and overlay
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";
}

/**
 * Handles the submission of the log meal form.
 * Stores the meal data in localStorage with a unique key and closes the popup.
 * Parameter: {Event} event - The form submission event.
 * UPDATED to save protein, carbs, and fats.
 */
function handleLogMealSubmit(event) {
  event.preventDefault();

  // Extract form values
  const mealName = document.getElementById("meal-name").value;
  const mealDate = document.getElementById("meal-date").value;
  const mealCalories = document.getElementById("meal-calories").value;
  // --- New values ---
  const mealProtein = document.getElementById("log-meal-protein").value;
  const mealCarbs = document.getElementById("log-meal-carbs").value;
  const mealFats = document.getElementById("log-meal-fats").value;
  // --- Get serving size (was already optional) ---
  const servingSize = document.getElementById("serving-size").value;


  // Create meal object
  const loggedMeal = {
    name: mealName,
    date: mealDate,
    calories: mealCalories,
    // --- Add the new fields to the object ---
    protein: mealProtein,
    carbs: mealCarbs,
    fats: mealFats,
    // --- Add serving size ---
    servingSize: servingSize,
  };

  // Store with a unique key using timestamp
  const timestamp = new Date().getTime();
  localStorage.setItem(
    `loggedMeal-${mealDate}-${timestamp}`,
    JSON.stringify(loggedMeal)
  );

  // Close the popup
  closePopup();
}

/**
 * Handles the submission of the create meal form.
 * Adds the new meal template to the list in localStorage and closes the popup.
 * Parameter: {Event} event - The form submission event.
 */

function handleCreateMealSubmit(event) {
  event.preventDefault(); 

  // Extract form values 
  const mealName = document.getElementById("create-meal-name").value.trim(); 
  const calories = parseInt(document.getElementById("create-meal-calories").value) || 0;
  const protein = parseInt(document.getElementById("create-meal-protein").value) || 0;
  const carbs = parseInt(document.getElementById("create-meal-carbs").value) || 0;
  const fats = parseInt(document.getElementById("create-meal-fats").value) || 0;
  const servingSize = document.getElementById("create-meal-serving-size").value.trim(); 

  if (!mealName) {
      alert('Please enter a meal name for the template.');
      return; 
  }
   if (!servingSize) {
      alert('Please enter a serving size for the template.');
      return; 
  }
 
  // Create meal template object 
  const newMealTemplate = {
      id: Date.now().toString(), 
      name: mealName,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fats: fats,
      servingSize: servingSize,
  };

  // Load existing, add new, and save using helper functions 
  const existingMeals = getCreatedMeals();
  existingMeals.push(newMealTemplate);
  saveCreatedMeals(existingMeals);

  // User Feedback
  alert(`Meal template "${mealName}" saved successfully!`);

  document.getElementById("create-meal-form").reset();

  closePopup();
}

/**
 * Fetches created meal templates from localStorage and displays them as buttons
 * in the "Log Meal" popup. Clicking a button populates the form.
 */
function displayMealTemplatesForLogging() {
  const templates = getCreatedMeals(); 
  const container = document.getElementById('log-meal-template-buttons'); 

  if (!container) {
      console.error("Template button container not found in Log Meal popup.");
      return; 
  }

  container.innerHTML = ''; 

  if (templates.length === 0) {
      container.innerHTML = '<p>A meal has not been created yet. Create one using the "Create Meal" button!</p>';
      return; 
  }

  templates.forEach(template => {
      const button = document.createElement('button');
      button.textContent = template.name; 
      button.type = 'button'; 
      button.classList.add('meal-template-btn'); 
      button.style.margin = '3px'; 

      // Add event listener 
      button.addEventListener('click', () => {

          document.getElementById('meal-name').value = template.name;
          document.getElementById('meal-calories').value = template.calories;
          document.getElementById('log-meal-protein').value = template.protein;
          document.getElementById('log-meal-carbs').value = template.carbs;
          document.getElementById('log-meal-fats').value = template.fats;
          document.getElementById('serving-size').value = template.servingSize;

      });

      container.appendChild(button); 
  });
}