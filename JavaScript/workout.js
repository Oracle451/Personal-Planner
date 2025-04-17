/**
 * workouts.js
 * 
 * This module manages workout and routine-related functionality for the application. It provides
 * functions to create, edit, remove, and display workouts and routines stored in localStorage using JSON.
 */

function workoutPopup(name, desc, category, type) {

  transitionWorkouts(); // delete this like when not needed

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

function isNameUnique(type, name, position) {
  const data = JSON.parse(localStorage.getItem(type + "s") || "[]");
  return !data.some((item, index) => item.name === name && index + 1 !== position);
}

function addWorkout() {
  const name = document.getElementById("workout-name").value;
  const desc = document.getElementById("workout-desc").value;
  const categories = document.getElementById("workout-category").value;

  // Get existing workouts or initialize empty array
  let workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  
  // Add new workout
  workouts.push({
    name,
    desc,
    categories
  });

  // Save to localStorage
  localStorage.setItem("workouts", JSON.stringify(workouts));

  // Refresh popup
  workoutPopup();
}

function showWorkoutLibrary(where) {
  const workouts = JSON.parse(localStorage.getItem("workouts") || "[]");

  if (workouts.length > 0) {
    workouts.forEach((workout, index) => {
      const workoutDiv = document.createElement("div");
      workoutDiv.className = "task-Long";
      workoutDiv.id = "workout";

      let element = `
        <p class="workout-text">Name: ${workout.name}</p>
        <p class="workout-text">Description: ${workout.desc}</p>
      `;
      if (workout.categories) {
        element += `<p class="workout-text">Categories: ${workout.categories}</p>`;
      }
      if (where !== "routine") {
        element += `
          <button class="edit-Task" id="edit-workout-${index + 1}">Edit</button>
          <button class="remove-Task" id="remove-workout-${index + 1}">Remove</button>
        `;
      }

      workoutDiv.innerHTML = element;
      document.getElementById("workout-lib").appendChild(workoutDiv);

      if (where !== "routine") {
        document.getElementById(`edit-workout-${index + 1}`).addEventListener("click", () => editWorkoutsSetup(index + 1));
        document.getElementById(`remove-workout-${index + 1}`).addEventListener("click", () => removeWorkout(index + 1));
      }
    });
  } else {
    document.getElementById("workout-lib").innerHTML += `
      No workouts to show!<br>Try adding some new workouts to see them here!
    `;
  }
}

function editWorkoutsSetup(type) {
  const workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  const workout = workouts[type - 1];
  
  workoutPopup(workout.name, workout.desc, workout.categories, type);
}

function editWorkout(type) {
  const name = document.getElementById("workout-name").value;
  const desc = document.getElementById("workout-desc").value;
  const category = document.getElementById("workout-category").value;

  if (isNameUnique("workout", name, type)) {
    let workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
    
    // Update the specific workout
    workouts[type - 1] = {
      name,
      desc,
      categories: category
    };

    localStorage.setItem("workouts", JSON.stringify(workouts));
    workoutPopup();
  } else {
    showToast("Name must be unique");
  }
}

function removeWorkout(type) {
  let workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  
  // Remove the workout at the specified index
  workouts.splice(type - 1, 1);
  
  localStorage.setItem("workouts", JSON.stringify(workouts));
  workoutPopup();
}

function routinePopup(name, desc, workouts, type) {

  transitionWorkouts(); // delete this line when not needed

  // Default values for optional parameters
  const givenName = name || "";
  const givenDesc = desc || "";
  const givenWorkouts = workouts || "";

  // Inject HTML for the routine popup
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

      // Check if the routine is being edited
      if (name !== undefined && desc !== undefined && workouts !== undefined) {
        editRoutine(type);
      } else {
        // Check if the name is unique
        if (!isNameUnique("routine", document.getElementById("routine-name").value)) { 
          showToast("Name must be unique");
        } else if (!doWorkoutsExist()) {
          showToast("Workouts must exist");
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

  // Show both libraries in the routine popup
  showRoutineLibrary();
  showWorkoutLibrary("routine");
}

function doWorkoutsExist() {
  const input = document.getElementById("routine-workouts").value;
  const workoutNames = input.split(", ").filter(name => name.trim() !== "");
  const storedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");

  for (let name of workoutNames) {
    if (!storedWorkouts.some(workout => workout.name === name)) {
      showToast(`Workout "${name}" doesn't exist`);
      return false;
    }
  }
  return true;
}

function addRoutine() {
  const name = document.getElementById("routine-name").value;
  const desc = document.getElementById("routine-desc").value;
  const workouts = document.getElementById("routine-workouts").value;

  let routines = JSON.parse(localStorage.getItem("routines") || "[]");
  
  routines.push({
    name,
    desc,
    workouts
  });

  localStorage.setItem("routines", JSON.stringify(routines));
  routinePopup();
}

function showRoutineLibrary() {
  const routines = JSON.parse(localStorage.getItem("routines") || "[]");

  if (routines.length > 0) {
    routines.forEach((routine, index) => {
      const routineDiv = document.createElement("div");
      routineDiv.className = "task-Long";

      let element = `
        <p class="routine-text">Name: ${routine.name}</p>
        <p class="routine-text">Description: ${routine.desc}</p>
      `;
      if (routine.workouts) {
        element += `<p class="routine-text">Workouts: ${routine.workouts}</p>`;
      }
      element += `
        <button class="edit-Task" id="edit-routine-${index + 1}">Edit</button>
        <button class="remove-Task" id="remove-routine-${index + 1}">Remove</button>
      `;

      routineDiv.innerHTML = element;
      document.getElementById("routine-lib").appendChild(routineDiv);

      document.getElementById(`edit-routine-${index + 1}`).addEventListener("click", () => editRoutineSetup(index + 1));
      document.getElementById(`remove-routine-${index + 1}`).addEventListener("click", () => removeRoutine(index + 1));
    });
  } else {
    document.getElementById("routine-lib").innerHTML += `
      No routines to show!<br>Try adding some new routines to see them here!
    `;
  }
}

function editRoutineSetup(type) {
  const routines = JSON.parse(localStorage.getItem("routines") || "[]");
  const routine = routines[type - 1];
  
  routinePopup(routine.name, routine.desc, routine.workouts, type);
}

function editRoutine(type) {
  const name = document.getElementById("routine-name").value;
  const desc = document.getElementById("routine-desc").value;
  const workouts = document.getElementById("routine-workouts").value;

  if (isNameUnique("routine", name, type)) {
    if (doWorkoutsExist()) {
      let routines = JSON.parse(localStorage.getItem("routines") || "[]");
      
      routines[type - 1] = {
        name,
        desc,
        workouts
      };

      localStorage.setItem("routines", JSON.stringify(routines));
      routinePopup();
    }
  } else {
    showToast("Name must be unique");
  }
}

function removeRoutine(type) {
  let routines = JSON.parse(localStorage.getItem("routines") || "[]");
  
  routines.splice(type - 1, 1);
  
  localStorage.setItem("routines", JSON.stringify(routines));
  routinePopup();
}

// Export functions for testing or module use
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { 
    workoutPopup, 
    addWorkout, 
    showWorkoutLibrary, 
    editWorkoutsSetup, 
    editWorkout, 
    removeWorkout,
    routinePopup,
    addRoutine,
    showRoutineLibrary,
    editRoutineSetup,
    editRoutine,
    removeRoutine
  };
}

// removes old workout saving and turns it into new workout saving
// delete when no longer useful
function transitionWorkouts() {
  if (localStorage.getItem("workout-amount") !== null) {
    for (let i = 1; i <= localStorage.getItem("workout-amount"); i++) {
      // get all old workouts
      let name = localStorage.getItem(`workout-name-${i}`);
      let desc = localStorage.getItem(`workout-desc-${i}`);
      let categories = localStorage.getItem(`workout-categories-${i}`);

      // delete all old workouts
      localStorage.removeItem(`workout-name-${i}`);
      localStorage.removeItem(`workout-desc-${i}`);
      localStorage.removeItem(`workout-categories-${i}`);

      // Get workouts or initialize empty array
      let workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  
      // Add new workout
      workouts.push({
        name,
        desc,
        categories
      });
    
      // Save to localStorage
      localStorage.setItem("workouts", JSON.stringify(workouts));
    }
    localStorage.removeItem("workout-amount");
  }

  if (localStorage.getItem("routine-amount") !== null) {
    for (let i = 1; i <= localStorage.getItem("routine-amount"); i++) {
      // get all old routines
      let name = localStorage.getItem(`routine-name-${i}`);
      let desc = localStorage.getItem(`routine-desc-${i}`);
      let workouts = localStorage.getItem(`routine-workouts-${i}`);

      // delete all old routines
      localStorage.removeItem(`routine-name-${i}`);
      localStorage.removeItem(`routine-desc-${i}`);
      localStorage.removeItem(`routine-workouts-${i}`);

      // Get workouts or initialize empty array
      let routines = JSON.parse(localStorage.getItem("routines") || "[]");
  
      // Add new workout
      routines.push({
        name,
        desc,
        workouts
      });
    
      // Save to localStorage
      localStorage.setItem("routines", JSON.stringify(routines));
    }
    localStorage.removeItem("routine-amount");
  }
}