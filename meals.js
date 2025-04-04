// /**
//  * meals.js - Manages meal-related functionality for the calendar application.
//  * This module handles the creation, logging, and viewing of meals
//  */

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
 */
function openLogMealPopup() {
  document.getElementById("popup-content").innerHTML = `
    <div>
      <h2>Log Meal</h2>
      <hr>
      <br>
      <button id="popup-close-btn" class="close-btn">Close</button>
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
 * Adds the new meal to the existing list in localStorage and closes the popup.
 * Parameter: {Event} event - The form submission event.
 */
function handleCreateMealSubmit(event) {
  event.preventDefault();

  // Extract form values
  const mealName = document.getElementById("create-meal-name").value;
  const calories = document.getElementById("create-meal-calories").value;
  const protein = document.getElementById("create-meal-protein").value;
  const carbs = document.getElementById("create-meal-carbs").value;
  const fats = document.getElementById("create-meal-fats").value;
  const servingSize = document.getElementById("create-meal-serving-size").value;

  // Create meal object
  const newMeal = {
    name: mealName,
    calories: calories,
    protein: protein,
    carbs: carbs,
    fats: fats,
    servingSize: servingSize,
  };

  // Load existing meals or initialize empty array
  const existingMealsString = localStorage.getItem("createdMeals");
  let existingMeals = [];
  if (existingMealsString) {
    try {
      existingMeals = JSON.parse(existingMealsString);
    } catch (e) {
      console.error("Error parsing existing created meals:", e);
    }
  }

  // Add new meal and save
  existingMeals.push(newMeal);
  localStorage.setItem("createdMeals", JSON.stringify(existingMeals));

  // Close the popup
  closePopup();
}