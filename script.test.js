const { addTask } = require("./script"); // Adjust the path accordingly

beforeEach(() => {
    // Mock the DOM
    document.body.innerHTML = `
    <input id="date" value="2025-03-22" />
    <input id="time" value="17:30" />
    <input id="location" value="Office" />
    <input id="desc" value="Team Meeting" />
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

test("addTask stores task in localStorage", () => {
    localStorage.clear();
    addTask(0, ""); // Call function with test parameters

    expect(localStorage.getItem("2025-03-22-task1")).toBe("Meeting");
    expect(localStorage.getItem("2025-03-22-desc1")).toBe("Team Meeting");
    expect(localStorage.getItem("2025-03-22-time1")).toBe("5:30 pm");
    expect(localStorage.getItem("2025-03-22-addy1")).toBe("Office");
});

test("addTask increments task count", () => {
    localStorage.clear();
    addTask(0, "");
    addTask(0, "");

    expect(localStorage.getItem("2025-03-22-taskAmount")).toBe("2");
    expect(localStorage.getItem("2025-03-22-task2")).toBe("Meeting");
});
