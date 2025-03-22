function workoutPopup(name, desc, category, type) {
    let givenName = name || "";
    let givenDesc = desc || "";
    let givenCategory = category || "";
    
    document.getElementById("popup-content").innerHTML = `
        <div>
            <button id="popup-close-btn" class="close-btn">Close</button>
            <div id="workout-popup">
                <div id="workout-title"><h2>Workouts: </h2></div>
                <div id="workout-editor" class="workout-tab">
                    <h3>Add Workouts</h3>
                    <form id="workout-form">
                        <label for="workout-name">Workout Name</label>
                        <br>
                        <textarea id="workout-name" name="workout-name" maxlength="63" placeholder="Name workout here..." required>${givenName}</textarea>
                        
                        <br>
                        <label for="workout-desc">Description:</label>
                        <br>
                        <textarea id="workout-desc" name="workout-desc" rows="6" cols="30" maxlength="255" placeholder="Describe your workout here..." required>${givenDesc}</textarea>

                        <br>
                        <label for="workout-category">Category:</label>
                        <br>
                        <textarea id="workout-category" name="workout-category" rows="3" cols="30" maxlength="255" placeholder="Add categories here separated by spaces">${givenCategory}</textarea>
                        
                        <br>
                        <input type="submit" value="Add Workout" id="workout-submit">
                    </form>
                </div>
                <div id="workout-lib" class="workout-tab">
                    <h3>Workout Library</h3>
                </div>
            </div>
        </div>
    `;

    // Close button functionality
    document.getElementById("popup-close-btn").addEventListener("click", closePopup);
    document.getElementById("popup").style.display = "block";   // display popup
    document.getElementById("overlay-bg").style.display = "block";  // display background overlay
    
    const form = document.getElementById("workout-form");

    form.onsubmit = function(event) {
        if (form.checkValidity()) {
            event.preventDefault();  // prevent the form from submitting

            // check if name and desc are undefined
            if (name !== undefined && desc !== undefined) {
                editWorkout(type);  // edit workout
            } else {
                addWorkout();  // add workout
            }
        } else {
            console.log("Form is not valid.");
            event.preventDefault();  // prevent form submission
        }
    };

    // change button if editing workout
    if (name !== undefined && desc !== undefined) {
        document.getElementById("workout-submit").value = "Edit Workout";
    }

    showWorkoutLibrary();  // show the workout library
}


function addWorkout() {
    // gets the new workout information
    var name = document.getElementById("workout-name").value;
    var desc = document.getElementById("workout-desc").value;
    var categories = document.getElementById("workout-category").value;

    // checks if there are any workouts
    if (localStorage.getItem("workout-amount") === "" || localStorage.getItem("workout-amount") === null) {
        // if no workouts
        localStorage.setItem("workout-amount", 1)   // sets the workout amount to 1

        // set the first item in local storage
        localStorage.setItem("workout-name-1", name)
        localStorage.setItem("workout-desc-1", desc)
        localStorage.setItem("workout-categories-1", categories)
    } else {
        // if at least 1 workouts
        var amount = parseInt(localStorage.getItem("workout-amount"));  // get the number of workouts
        amount = amount + 1;    // increment amount by one

        // storing data
        // store new identifier
        localStorage.setItem("workout-amount", amount)
        // store new workout
        localStorage.setItem(`workout-name-${amount}`, name)
        localStorage.setItem(`workout-desc-${amount}`, desc)
        localStorage.setItem(`workout-categories-${amount}`, categories)
    }
    workoutPopup();
}

function showWorkoutLibrary() {
    // check if there are workouts
    if (localStorage.getItem("workout-amount") !== null) {
        // if there are workouts
        var amount = localStorage.getItem("workout-amount");

        // loop through all workouts to put in library
        for (let i=1; i <= amount; i++) {
            workout = document.createElement("div");    // create a new div for a workout
            workout.className = "task-Long";    // add a styling class

            // get values for workouts
            let name = localStorage.getItem(`workout-name-${i}`);
            let desc = localStorage.getItem(`workout-desc-${i}`);
            let category = localStorage.getItem(`workout-categories-${i}`);

            // set workout values
            let element = `<p class="workout-text">Name: ${name}</p>
                <p class="workout-text">Description: ${desc}</p>
            `
            // check if there is a category listed
            if (category !== "") {
                element += `<p class="workout-text">Categories: ${category}</p>`;   // add category if listed
            }
            
            // add edit and remove buttons
            element += `
                <button class="edit-Task" id="edit-workout-${i}">edit</button>
                <button class="remove-Task" id="remove-workout-${i}">remove</button>`
                
            // add to elements
            workout.innerHTML = element;    // add html to new div
            document.getElementById("workout-lib").appendChild(workout) // add new div to workouts tab

            // add functionality to the buttons
            document.getElementById(`edit-workout-${i}`).addEventListener("click", () => editWorkoutsSetup(i))
            document.getElementById(`remove-workout-${i}`).addEventListener("click", () => removeWorkout(i))
        }
    } else {
        // if there arn't any workouts, append no workouts message
        document.getElementById("workout-lib").innerHTML += "No workouts to show!<br>Try adding some new workouts to see them here!"
    }
}

function editWorkoutsSetup(type) {
    // get data for edited workout
    var name = localStorage.getItem(`workout-name-${type}`);
    var desc = localStorage.getItem(`workout-desc-${type}`);
    var category = localStorage.getItem(`workout-categories-${type}`);

    // reload workout popup with information given
    workoutPopup(name, desc, category, type)
}

function editWorkout(type) {
    // store edited workout
    // get new values
    let name = document.getElementById("workout-name").value;
    let desc = document.getElementById("workout-desc").value;
    let category = document.getElementById("workout-category").value;

    // set new values
    localStorage.setItem(`workout-name-${type}`, name)
    localStorage.setItem(`workout-desc-${type}`, desc)
    localStorage.setItem(`workout-categories-${type}`, category)

    // call popup to update information
    workoutPopup()
}

function removeWorkout(type) {
    // get the last element for workouts
    var last = localStorage.getItem("workout-amount")

    // decrement workout amount
    localStorage.setItem("workout-amount", last - 1)

    // set last item data to item getting removed
    localStorage.setItem(`workout-name-${type}`, localStorage.getItem(`workout-name-${last}`))
    localStorage.setItem(`workout-desc-${type}`, localStorage.getItem(`workout-desc-${last}`))
    localStorage.setItem(`workout-categories-${type}`, localStorage.getItem(`workout-categories-${last}`))

    // remove last element
    localStorage.removeItem(`workout-name-${last}`)
    localStorage.removeItem(`workout-desc-${last}`)
    localStorage.removeItem(`workout-categories-${last}`)

    // reload popup
    workoutPopup()
}