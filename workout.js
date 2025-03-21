function workoutPopup() {   // creates a new popup for workouts
    document.getElementById("popup-content").innerHTML = `
        <div>
            <button id="popup-close-btn" class="close-btn">Close</button>
            <div id="workout-popup">
                <div id="workout-title"><h2>Workouts: </h2></div>
                <div id="workout-editor" class="workout-tab">
                    <h3>Add Workouts</h3>
                    <label for="name">Workout Name</label>
                    <br>
                    <textarea id="workout-name" name="name" maxlength="16" placeholder="Name workout here..." required></textarea>

                    <br>
                    <label for="desc">Description:</label>
                    <br>
                    <textarea id="workout-desc" name="desc" rows="6" cols="30"  maxlength="255" placeholder="Describe your workout here..." required></textarea>

                    <br>
                    <label for="category">Category:</label>
                    <br>
                    <textarea id="workout-category" name="category" rows="3" cols="30" maxlength="255" placeholder="Add categories here separated by spaces"></textarea>
                    
                    <br>
                    <input type="submit" value="Add Workout" id="workout-submit">
                    </div>
                <div id="workout-lib" class="workout-tab">
                    <h3>Workout Library</h3>
                </div>
            </div>
        </div>
    `;

    document.getElementById("popup-close-btn").addEventListener("click", closePopup);   // add purpose to close button
    document.getElementById("popup").style.display = "block";   // add styling to popup
    document.getElementById("overlay-bg").style.display = "block";  // add styling to bg
    document.getElementById("workout-submit").addEventListener("click", () => addWorkout()) // set submit button to call adding workout function
    showWorkoutLibrary()    // show the workout library
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
            // add to elements
            workout.innerHTML = element;    // add html to new div
            document.getElementById("workout-lib").appendChild(workout) // add new div to workouts tab
        }
    } else {
        // if there arn't any workouts, append no workouts message
        document.getElementById("workout-lib").innerHTML += "No workouts to show!<br>Try adding some new workouts to see them here!"
    }
}