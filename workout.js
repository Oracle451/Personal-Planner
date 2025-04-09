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
            maxlength="31"
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
      <div id="workout-lib" class="workout-tab workout-lib">
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
        if (isNameUnique("workout", document.getElementById("workout-name").value)) {
          addWorkout(); // Add new workout
        } else {
          showToast("Name must be unique");
        }
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

function isNameUnique(type, name, possition) {
  var amount = localStorage.getItem(`${type}-amount`);
  if (amount === undefined) {
    amount = 0;
  }
  for (let i = 1; i <= amount; i++) {
    if (localStorage.getItem(`${type}-name-${i}`) === name && possition !== i) {
      return false;
    }
  }
  return true;
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

function showWorkoutLibrary(where) {
  // Get the total number of workouts
  const amount = localStorage.getItem("workout-amount");

  if (amount && amount > 0) {
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
      // Add edit and remove buttons if in workouts tab
      if (where !== "routine") {
        element += `
          <button class="edit-Task" id="edit-workout-${i}">Edit</button>
          <button class="remove-Task" id="remove-workout-${i}">Remove</button>
        `;
      }

      // Set the HTML and append to the library
      workout.innerHTML = element;
      document.getElementById("workout-lib").appendChild(workout);

      // Add event listeners for edit and remove buttons
      if (where !== "routine") {
        document.getElementById(`edit-workout-${i}`).addEventListener("click", () => editWorkoutsSetup(i));
        document.getElementById(`remove-workout-${i}`).addEventListener("click", () => removeWorkout(i));
      }
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

  if (isNameUnique("workout", name, type)) {
    // Store the updated values in localStorage
    localStorage.setItem(`workout-name-${type}`, name);
    localStorage.setItem(`workout-desc-${type}`, desc);
    localStorage.setItem(`workout-categories-${type}`, category);

    // Refresh the popup to reflect changes
    workoutPopup();
  } else {
    showToast("Name must be unique");
  }
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

// Routines section
function routinePopup(name, desc, workouts, type) {
    // Default values for optional parameters
    const givenName = name || "";
    const givenDesc = desc || "";
    const givenWorkouts = workouts || "";

  // Inject HTML for the workout popup
  document.getElementById("popup-content").innerHTML = `
    <button id="popup-close-btn" class="close-btn">Close</button>
    <div id="routine-popup">
      <div id="routine-title">
        <h2>Routines:</h2>
      </div>
      <div id="routine-editor" class="routine-tab">
        <h3>Add Routines</h3>
        <form id="routine-form">
          <label for="routine-name">Routine Name</label>
          <br>
          <textarea
            id="routine-name"
            name="routine-name"
            maxlength="63"
            placeholder="Name routine here..."
            required
          >${givenName}</textarea>
          <br>
          <label for="routine-desc">Description:</label>
          <br>
          <textarea
            id="routine-desc"
            name="routine-desc"
            rows="6"
            cols="30"
            maxlength="255"
            placeholder="Describe your routine here..."
            required
          >${givenDesc}</textarea>
          <br>
          <label for="routine-workouts">Workouts Included:</label>
          <br>
          <textarea
            id="routine-workouts"
            name="routine-workouts"
            rows="3"
            cols="30"
            maxlength="63"
            placeholder="Name workouts here separated by ', '"
            required
          >${givenWorkouts}</textarea>
          <br>
          <input
            type="submit"
            value="Add Routine"
            id="routine-submit"
            class="submenuBtn"
          >
        </form>
      </div>
      <div id="routine-showcase">
        <div id="routine-lib" class="routine-lib routine-tab">
          <h3>Routine Library</h3>
        </div>
        <div></div>
        <div id="workout-lib" class="routine-workout-lib routine-tab">
          <h3>Workout Library</h3>
        </div>
      </div>
    </div>
  `;

  // Add close button functionality
  document.getElementById("popup-close-btn").addEventListener("click", closePopup);

  // Show the popup and overlay
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay-bg").style.display = "block";

  // Handle form submission
  const form = document.getElementById("routine-form");
  form.onsubmit = function (event) {
    if (form.checkValidity()) {
      event.preventDefault(); // Prevent default form submission

      // check if the routine is geting edited
      if (name !== undefined && desc !== undefined && workouts !== undefined) {
        editRoutine(type);
      } else {
        // check if the name is unique
        if (!isNameUnique("routine", document.getElementById("routine-name").value)) { 
          showToast("Name must be unique");
        }
        
        // check of all the workouts exist
        else if (!doWorkoutsExist()) {
          showToast("Workouts must exist")
        } else {
        addRoutine(); // Add new routine
        }
      }

    } else {
      console.log("Form is not valid.");
      event.preventDefault(); // Prevent submission if invalid
    }
  };

  // Update submit button text if editing
  if (name !== undefined && desc !== undefined) {
    document.getElementById("routine-submit").value = "Edit Routine";
  }

  // show both libraries in the routine popup
  showRoutineLibrary();
  showWorkoutLibrary("routine");
}

function doWorkoutsExist() {
  // the the input results
  var input = document.getElementById("routine-workouts").value;
  var workouts = input.split(", ");
  var length = workouts.length;

  // get stored workouts
  var storedAmount = localStorage.getItem("workout-amount")
  var storedWorkouts = [storedAmount];
  for (let i = 0; i < storedAmount; i++) {
    storedWorkouts[i] = localStorage.getItem(`workout-name-${i+1}`)
  }

  // compare all inputted workouts to stored workouts
  for (let i = 0; i < length; i++) {
    let stored = false
    for (let j = 0; j < storedAmount; j++) {
      if (stored) {
        break;
      } else {
        if (workouts[i] == storedWorkouts[j]) {
          stored = true;
        }
      }
    }
    if (!stored) {
      showToast(`Workout "${workouts[i]}" doesn't exist`)
      return false
    }
  }
  return true;
}

function addRoutine() {
  // Retrieve form input values
  const name = document.getElementById("routine-name").value;
  const desc = document.getElementById("routine-desc").value;
  const workouts = document.getElementById("routine-workouts").value;

  // Check if there are any existing workouts
  const routineAmount = localStorage.getItem("routine-amount");
  if (!routineAmount) {
    // If no workouts exist, initialize with the first one
    localStorage.setItem("routine-amount", "1");
    localStorage.setItem("routine-name-1", name);
    localStorage.setItem("routine-desc-1", desc);
    localStorage.setItem("routine-workouts-1", workouts);
  } else {
    // Increment the workout count and store the new workout
    const newAmount = parseInt(routineAmount, 10) + 1;
    localStorage.setItem("routine-amount", newAmount);
    localStorage.setItem(`routine-name-${newAmount}`, name);
    localStorage.setItem(`routine-desc-${newAmount}`, desc);
    localStorage.setItem(`routine-workouts-${newAmount}`, workouts);
  }

  // Refresh the popup to reflect changes
  routinePopup();
}

function showRoutineLibrary() {
  // Get the total number of workouts
  const amount = localStorage.getItem("routine-amount");

  if (amount && amount > 0) {
    // Loop through all routines and display them
    for (let i = 1; i <= amount; i++) {
      const routine = document.createElement("div");
      routine.className = "task-Long";

      // Fetch routine details from storage
      const name = localStorage.getItem(`routine-name-${i}`);
      const desc = localStorage.getItem(`routine-desc-${i}`);
      const workouts = localStorage.getItem(`routine-workouts-${i}`);

      // Build the workout HTML content
      let element = `
        <p class="routine-text">Name: ${name}</p>
        <p class="routine-text">Description: ${desc}</p>
      `;
      if (workouts) {
        element += `<p class="routine-text">Workouts: ${workouts}</p>`;
      }
      // Add edit and remove buttons if in routines tab
      element += `
        <button class="edit-Task" id="edit-routine-${i}">Edit</button>
        <button class="remove-Task" id="remove-routine-${i}">Remove</button>
      `;

      // Set the HTML and append to the library
      routine.innerHTML = element;
      document.getElementById("routine-lib").appendChild(routine);

      // Add event listeners for edit and remove buttons
      document.getElementById(`edit-routine-${i}`).addEventListener("click", () => editRoutineSetup(i));
      document.getElementById(`remove-routine-${i}`).addEventListener("click", () => removeRoutine(i));
    }
  } else {
    // Display message if no workouts exist
    document.getElementById("routine-lib").innerHTML += `
      No routines to show!<br>Try adding some new routines to see them here!
    `;
  }
}

function removeRoutine(type) {
  // Get the current total number of workouts
  const last = localStorage.getItem("routine-amount");

  // Decrease the workout count
  localStorage.setItem("routine-amount", last - 1);

  // Move the last workout's data to the removed position
  localStorage.setItem(`routine-name-${type}`, localStorage.getItem(`routine-name-${last}`));
  localStorage.setItem(`routine-desc-${type}`, localStorage.getItem(`routine-desc-${last}`));
  localStorage.setItem(`routine-workouts-${type}`, localStorage.getItem(`routine-workouts-${last}`));

  // Remove the last workout's data
  localStorage.removeItem(`routine-name-${last}`);
  localStorage.removeItem(`routine-desc-${last}`);
  localStorage.removeItem(`routine-workouts-${last}`);

  // Refresh the popup to reflect changes
  routinePopup();
}

function editRoutineSetup(type) {
  // Retrieve data for the workout to be edited
  const name = localStorage.getItem(`routine-name-${type}`);
  const desc = localStorage.getItem(`routine-desc-${type}`);
  const workouts = localStorage.getItem(`routine-workouts-${type}`);

  // Open the popup with pre-filled data for editing
  routinePopup(name, desc, workouts, type);
}

function editRoutine(type) {
  // Update routine with new values from the form
  const name = document.getElementById("routine-name").value;
  const desc = document.getElementById("routine-desc").value;
  const workouts = document.getElementById("routine-workouts").value;

  if (isNameUnique("routine", name, type)) {
    if (doWorkoutsExist()) {
        // Store the updated values in localStorage
        localStorage.setItem(`routine-name-${type}`, name);
        localStorage.setItem(`routine-desc-${type}`, desc);
        localStorage.setItem(`routine-workouts-${type}`, workouts);

        // Refresh the popup to reflect changes
        routinePopup();
    }
  } else {
    showToast("Name must be unique")
  }
}