describe('Iron Man Planner - Feature Tests', () => {
       beforeEach(() => {
         // Clear localStorage to ensure a clean state
         cy.window().then((win) => {
           win.localStorage.clear();
         });
         // Visit the planner website
         cy.visit('http://localhost:3000');
       });

       it('should allow a user to create a new meal and save it to localStorage', () => {
         // Arrange: Click the "Create Meal" button to open the popup
         cy.get('#create-Meal').click();
         cy.get('#popup').should('be.visible');
         cy.get('#popup-content').should('contain', 'Create Meal');

         // Act: Fill out the create meal form
         const mealName = 'Grilled Chicken Salad';
         cy.get('#create-meal-name').type(mealName);
         cy.get('#create-meal-calories').type('400');
         cy.get('#create-meal-protein').type('30');
         cy.get('#create-meal-carbs').type('20');
         cy.get('#create-meal-fats').type('15');
         cy.get('#create-meal-serving-size').type('1 plate');

         // Mock the alert to capture its message
         cy.window().then((win) => {
           cy.stub(win, 'alert').as('alertStub');
         });

         // Submit the form
         cy.get('#create-meal-form').submit();

         // Assert: Verify the alert confirmation
         cy.get('@alertStub').should('be.calledWith', `Meal template "${mealName}" saved successfully!`);

         // Assert: Verify the meal is saved in localStorage
         cy.window().then((win) => {
           const createdMeals = JSON.parse(win.localStorage.getItem('createdMeals') || '[]');
           expect(createdMeals).to.have.length(1);
           expect(createdMeals[0]).to.include({
             name: mealName,
             calories: 400,
             protein: 30,
             carbs: 20,
             fats: 15,
             servingSize: '1 plate'
           });
         });

         // Assert: Verify the popup closes
         cy.get('#popup').should('not.be.visible');

         // Capture screenshot
         cy.screenshot('create-meal-test-success', { capture: 'fullPage' });
       });

       it('should log a meal and save it to localStorage', () => {
         cy.get('#log-Meal').click();
         cy.get('#popup').should('be.visible');
         cy.get('#meal-name').type('Oatmeal');
         cy.get('#meal-calories').type('200');
         // Set value to current date
         cy.get('#meal-date').should('have.value', '2025-04-18');
         cy.get('#log-meal-form').submit();
         cy.window().then((win) => {
           const keys = Object.keys(win.localStorage).filter(k => k.startsWith('loggedMeal-'));
           expect(keys).to.have.length(1);
           const meal = JSON.parse(win.localStorage.getItem(keys[0]));
           expect(meal).to.include({ name: 'Oatmeal', calories: '200' });
         });
         cy.get('#popup').should('not.be.visible');
       });

       it('should display created and logged meals', () => {
         cy.window().then((win) => {
           win.localStorage.setItem('createdMeals', JSON.stringify([{ name: 'Test Meal', calories: 300, servingSize: '1 serving' }]));
           win.localStorage.setItem('loggedMeal-2025-04-17-123456789', JSON.stringify({
             name: 'Logged Meal',
             date: '2025-04-17',
             calories: '250'
           }));
         });
         cy.get('#view-Meals').click();
         cy.get('#popup').should('be.visible');
         cy.get('#popup-content').should('contain', 'Test Meal');
         cy.get('#popup-content').should('contain', 'Logged Meal');
       });

       it('should add a task and display it on the calendar', () => {
         cy.get('#add-task').click();
         cy.get('#popup').should('be.visible');
         cy.get('#title').type('Meeting');
         cy.get('#date').type('2025-04-17');
         cy.get('#time').type('14:00');
         cy.get('#pushTask').click();
         cy.get('.calendar .date').contains('17').parent().should('contain', 'Meeting');
       });

       it('should set a daily calorie goal', () => {
         cy.get('#set-calorie-goal').click();
         cy.get('#popup').should('be.visible');
         cy.get('#calorie-goal').clear().type('2000');
         cy.get('#calorie-goal-form').submit();
         cy.get('#daily-goal').should('have.text', '2000');
         cy.get('body').should('contain', 'Daily Calorie Goal set to 2000 calories');
       });

       it('should create a new workout', () => {
         cy.get('.sidebarBtn[onclick="workoutPopup()"]').click();
         cy.get('#popup').should('be.visible');
         cy.get('#workout-name').type('Push-Ups');
         cy.get('#workout-desc').type('30 reps');
         cy.get('#workout-form').submit();
         cy.get('#workout').should('contain', 'Name: Push-Ups');
         cy.get('#workout').should('contain', 'Description: 30 reps');
       });
     });