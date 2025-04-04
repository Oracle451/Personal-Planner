/**
 * workouts.js
 * 
 * This module manages workout-related functionality for the application. It provides
 * functions to create, edit, remove, and display workouts stored in localStorage.
 */

function workoutPopup(name, desc, category, type) {
  // Default values for optional parameters
  const givenName = name || "";
  const givenDesc = desc || "";
  const givenCategory = category || "";

  // Inject HTML for the workout popup
  document.getElementById("popup-content").innerHTML = `
    <button id="popup-close-btn" class="close-btn">Close</button>
    <div id="workout-popup">
      <div id="workout-title">
        <h2>Workouts:</h2>
      </div>
      <div id="workout-editor" class="workout-tab">
        <h3>Add Workouts</h3>
        <form id="workout-form">
          <label for="workout-name">Workout Name</label>
          <br>
          <textarea
            id="workout-name"
            name="workout-name"
            maxlength="63"
            placeholder="Name workout here..."
            required
          >${givenName}</textarea>
          <br>
          <label for="workout-desc">Description:</label>
          <br>
          <textarea
            id="workout-desc"
            name="workout-desc"
            rows="6"
            cols="30"
            maxlength="255"
            placeholder="Describe your workout here..."
            required
          >${givenDesc}</textarea>
          <br>
          <label for="workout-category">Category:</label>
          <br>
          <textarea
            id="workout-category"
            name="workout-category"
            rows="3"
            cols="30"
            maxlength="255"
            placeholder="Add categories here separated by spaces"
          >${givenCategory}</textarea>
          <br>
          <input
            type="submit"
            value="Add Workout"
            id="workout-submit"
            class="submenuBtn"
          >
        </form>
      </div>
      <div id="workout-lib" class="workout-tab">
        <h3>Workout Library</h3>
      </div>
    </div>
  `;

  // Add close button functionality
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);

  // Show the popup and overlay
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";

  // Handle form submission
  const form = document.getElementById("workout-form");
  form.onsubmit = function (event) {
    if (form.checkValidity()) {
      event.preventDefault(); // Prevent default form submission

      // Determine if editing or adding a workout
      if (name !== undefined && desc !== undefined) {
        editWorkout(type); // Edit existing workout
      } else {
        addWorkout(); // Add new workout
      }
    } else {
      console.log("Form is not valid.");
      event.preventDefault(); // Prevent submission if invalid
    }
  };

  // Update submit button text if editing
  if (name !== undefined && desc !== undefined) {
    document.getElementById("workout-submit").value = "Edit Workout";
  }

  // Populate the workout library
  showWorkoutLibrary();
}

function addWorkout() {
  // Retrieve form input values
  const name = document.getElementById("workout-name").value;
  const desc = document.getElementById("workout-desc").value;
  const categories = document.getElementById("workout-category").value;

  // Check if there are any existing workouts
  const workoutAmount = localStorage.getItem("workout-amount");
  if (!workoutAmount) {
    // If no workouts exist, initialize with the first one
    localStorage.setItem("workout-amount", "1");
    localStorage.setItem("workout-name-1", name);
    localStorage.setItem("workout-desc-1", desc);
    localStorage.setItem("workout-categories-1", categories);
  } else {
    // Increment the workout count and store the new workout
    const newAmount = parseInt(workoutAmount, 10) + 1;
    localStorage.setItem("workout-amount", newAmount);
    localStorage.setItem(`workout-name-${newAmount}`, name);
    localStorage.setItem(`workout-desc-${newAmount}`, desc);
    localStorage.setItem(`workout-categories-${newAmount}`, categories);
  }

  // Refresh the popup to reflect changes
  workoutPopup();
}

function showWorkoutLibrary() {
  // Get the total number of workouts
  const amount = localStorage.getItem("workout-amount");

  if (amount) {
    // Loop through all workouts and display them
    for (let i = 1; i <= amount; i++) {
      const workout = document.createElement("div");
      workout.className = "task-Long";

      // Fetch workout details from storage
      const name = localStorage.getItem(`workout-name-${i}`);
      const desc = localStorage.getItem(`workout-desc-${i}`);
      const category = localStorage.getItem(`workout-categories-${i}`);

      // Build the workout HTML content
      let element = `
        <p class="workout-text">Name: ${name}</p>
        <p class="workout-text">Description: ${desc}</p>
      `;
      if (category) {
        element += `<p class="workout-text">Categories: ${category}</p>`;
      }
      element += `
        <button class="edit-Task" id="edit-workout-${i}">Edit</button>
        <button class="remove-Task" id="remove-workout-${i}">Remove</button>
      `;

      // Set the HTML and append to the library
      workout.innerHTML = element;
      document.getElementById("workout-lib").appendChild(workout);

      // Add event listeners for edit and remove buttons
      document.getElementById(`edit-workout-${i}`).addEventListener("click", () => editWorkoutsSetup(i));
      document.getElementById(`remove-workout-${i}`).addEventListener("click", () => removeWorkout(i));
    }
  } else {
    // Display message if no workouts exist
    document.getElementById("workout-lib").innerHTML += `
      No workouts to show!<br>Try adding some new workouts to see them here!
    `;
  }
}

function editWorkoutsSetup(type) {
  // Retrieve data for the workout to be edited
  const name = localStorage.getItem(`workout-name-${type}`);
  const desc = localStorage.getItem(`workout-desc-${type}`);
  const category = localStorage.getItem(`workout-categories-${type}`);

  // Open the popup with pre-filled data for editing
  workoutPopup(name, desc, category, type);
}

function editWorkout(type) {
  // Update workout with new values from the form
  const name = document.getElementById("workout-name").value;
  const desc = document.getElementById("workout-desc").value;
  const category = document.getElementById("workout-category").value;

  // Store the updated values in localStorage
  localStorage.setItem(`workout-name-${type}`, name);
  localStorage.setItem(`workout-desc-${type}`, desc);
  localStorage.setItem(`workout-categories-${type}`, category);

  // Refresh the popup to reflect changes
  workoutPopup();
}

function removeWorkout(type) {
  // Get the current total number of workouts
  const last = localStorage.getItem("workout-amount");

  // Decrease the workout count
  localStorage.setItem("workout-amount", last - 1);

  // Move the last workout's data to the removed position
  localStorage.setItem(`workout-name-${type}`, localStorage.getItem(`workout-name-${last}`));
  localStorage.setItem(`workout-desc-${type}`, localStorage.getItem(`workout-desc-${last}`));
  localStorage.setItem(`workout-categories-${type}`, localStorage.getItem(`workout-categories-${last}`));

  // Remove the last workout's data
  localStorage.removeItem(`workout-name-${last}`);
  localStorage.removeItem(`workout-desc-${last}`);
  localStorage.removeItem(`workout-categories-${last}`);

  // Refresh the popup to reflect changes
  workoutPopup();
}

// Export functions for testing or module use (optional)
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { workoutPopup, addWorkout, showWorkoutLibrary, editWorkoutsSetup, editWorkout, removeWorkout };
}