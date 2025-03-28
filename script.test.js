const { addTask, removeTask, doesDayHaveTasks } = require("./script"); // Adjust the path accordingly
const dateString = "2025-03-22"

beforeEach(() => {
    // Mock the DOM
    document.body.innerHTML = `
    <input id="date" value="2025-03-22" />
    <input id="time" value="17:30" />
    <input id="location" value="Office" />
    <input id="desc" value="Team Meeting with Frank" />
    <input id="title" value="Meeting" />
  `;

    // Mock localStorage
    global.localStorage = {
        store: {},
        getItem: function (key) {
            return this.store[key] || null;
        },
        setItem: function (key, value) {
            this.store[key] = value.toString();
        },
        clear: function () {
            this.store = {};
        }
    };
});

//ACTUAL TESTS BELOW

test("addTask is handling all of its responsibilites", () => {
    localStorage.clear();
    addTask(0, "");


    expect(localStorage.getItem(`${dateString}-task1`)).toBe("Meeting");
    expect(localStorage.getItem(`${dateString}-desc1`)).toBe("Team Meeting with Frank");
    expect(localStorage.getItem(`${dateString}-time1`)).toBe("5:30 pm");
    expect(localStorage.getItem(`${dateString}-addy1`)).toBe("Office");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("1");

    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("2");

    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("3");

});


test("doesDayHaveTasks function properly returns true or false depending on given day", () => {
    localStorage.clear();
    addTask(0, "");
    expect(doesDayHaveTasks(dateString)).toBeTruthy();

    removeTask(dateString, 1)

    expect(doesDayHaveTasks(dateString)).toBeFalsy();



});

test("removeTask function properly deletes a task from localStorage.", () => {
    localStorage.clear();

    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-task1")).toBe("Meeting");
    expect(localStorage.getItem("2025-03-22-desc1")).toBe("Team Meeting with Frank");
    expect(localStorage.getItem("2025-03-22-time1")).toBe("5:30 pm");
    expect(localStorage.getItem("2025-03-22-addy1")).toBe("Office");

    removeTask("2025-03-22", 1);

    expect(doesDayHaveTasks(dateString)).toBeFalsy();

    addTask(0, "");
    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("2");

    removeTask("2025-03-22", 2);

    expect(localStorage.getItem("2025-03-22-task1")).toBe(null);
    expect(doesDayHaveTasks(dateString)).toBeTruthy();

});
