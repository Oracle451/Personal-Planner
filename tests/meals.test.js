// tests/meals.test.js

const {
    saveCreatedMeals,
    getCreatedMeals,
    CREATED_MEALS_STORAGE_KEY
} = require('../JavaScript/meals.js');

// Fake storage for testing
const localStorageMock = (() => {
    let store = {};
    return {
        getItem(key) { return store[key] || null; },
        setItem(key, value) { store[key] = value.toString(); },
        clear() { store = {}; },
        removeItem(key) { delete store[key]; },
        get length() { return Object.keys(store).length; },
        key(index) { return Object.keys(store)[index] || null; }
    };
})();

// 3. Replace real localStorage with fake for the tests
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
});

//Mock console.error to keep test output clean 
const originalConsoleError = console.error;
beforeAll(() => {
    // replace console.error with a Jest mock function
    console.error = jest.fn().mockImplementation(() => {});
});
afterAll(() => {
    // put the original console.error back
    console.error = originalConsoleError;
});

// defining test suite for Meals Storage
describe('Meals Storage Functions', () => {

    beforeEach(() => {
        localStorageMock.clear(); 
        jest.clearAllMocks();    
    });

    // 6. Tests specifically for 'saveCreatedMeals'
    describe('saveCreatedMeals', () => {
        it('should save stringified array to localStorage with the correct key', () => {
            // Arrange
            const mealsToSave = [ { id: '1', name: 'Test Meal' } ];
            const expectedKey = CREATED_MEALS_STORAGE_KEY; 
            const expectedValue = JSON.stringify(mealsToSave);
            const setItemSpy = jest.spyOn(localStorageMock, 'setItem'); 

            // Act
            saveCreatedMeals(mealsToSave); 

            // Assert
            expect(setItemSpy).toHaveBeenCalledTimes(1); 
            expect(setItemSpy).toHaveBeenCalledWith(expectedKey, expectedValue);
            expect(localStorageMock.getItem(expectedKey)).toBe(expectedValue); 

            // Clean 
            setItemSpy.mockRestore(); 
        });

        it('should handle saving an empty array', () => {
            // Arrange
            const mealsToSave = [];
            const expectedKey = CREATED_MEALS_STORAGE_KEY;
            const expectedValue = JSON.stringify(mealsToSave); // 
            const setItemSpy = jest.spyOn(localStorageMock, 'setItem');

            // Act
            saveCreatedMeals(mealsToSave);

            // Assert
            expect(setItemSpy).toHaveBeenCalledTimes(1);
            expect(setItemSpy).toHaveBeenCalledWith(expectedKey, expectedValue);
            expect(localStorageMock.getItem(expectedKey)).toBe(expectedValue);

            // Clean 
            setItemSpy.mockRestore();
        });
    });  // End 'saveCreatedMeals'

    // 7. Tests specifically for 'getCreatedMeals'
    describe('getCreatedMeals', () => {
        it('should return empty array if localStorage item is null', () => {
            // Arrange 
            const getItemSpy = jest.spyOn(localStorageMock, 'getItem');

            // Act
            const result = getCreatedMeals();

            // Assert
            expect(getItemSpy).toHaveBeenCalledWith(CREATED_MEALS_STORAGE_KEY);
            expect(result).toEqual([]); // Use toEqual for arrays/objects

            // Clean 
            getItemSpy.mockRestore();
        });

        it('should return parsed array if localStorage has valid JSON', () => {
            // Arrange
            const storedMeals = [ { id: '2', name: 'Saved Meal' } ];
            localStorageMock.setItem(CREATED_MEALS_STORAGE_KEY, JSON.stringify(storedMeals));

            // Act
            const result = getCreatedMeals();

            // Assert
            expect(result).toEqual(storedMeals);
        });

        it('should return empty array and log error for invalid JSON', () => {
            // Arrange
            localStorageMock.setItem(CREATED_MEALS_STORAGE_KEY, 'this is not json');
            const errorSpy = jest.spyOn(console, 'error'); 
            // Act
            const result = getCreatedMeals();

            // Assert
            expect(result).toEqual([]); 
            expect(errorSpy).toHaveBeenCalled(); 
            expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("Error parsing created meals"), expect.any(SyntaxError));

        });
    }); // End 'getCreatedMeals'

}); 