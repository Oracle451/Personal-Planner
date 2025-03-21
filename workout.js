function workoutPopup() {

    document.getElementById("popup-content").innerHTML = `

        <div>
            <button id="popup-close-btn" class="close-btn">Close</button>
            <div id="workout-popup">
                <div id="workout-title"><h2>Workouts: </h2></div>
                <div id="workout-editor" class="workout-tab">
                    <h3>Add Workouts</h3>
                </div>
                <div id="workout-lib" class="workout-tab">
                    <h3>Workout Library</h3>
                </div>
            </div>
        </div>
    `;

    document.getElementById("popup-close-btn").addEventListener("click", closePopup);
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay-bg").style.display = "block";
}