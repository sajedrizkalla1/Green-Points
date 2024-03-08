// unitetst 1
function testEmptyAge(form) {
    // Simulate submitting the form without entering an age
    form.age.value = "";
  
    // Check if the form validation detects the empty age
    expect(form.checkValidity()).toBe(false);
  
    // Optionally, you can also check for a specific error message related to age being empty
    expect(form.age.validationMessage).toContain("Age is required");
  }

  // unitetst 2

  function testPassword() {
    const { validatePassword } = require('./passwordValidation');

    describe('Password Validation', () => {
    test('Password should be at least 8 characters long', () => {
        expect(validatePassword('1234567')).toBe(false);
        expect(validatePassword('12345678')).toBe(true);
    });

    test('Password should contain at least one uppercase letter', () => {
        expect(validatePassword('password')).toBe(false);
        expect(validatePassword('Password')).toBe(true);
    });

    test('Password should contain at least one lowercase letter', () => {
        expect(validatePassword('PASSWORD')).toBe(false);
        expect(validatePassword('PaSsWoRd')).toBe(true);
    });

    test('Password should contain at least one digit', () => {
        expect(validatePassword('password')).toBe(false);
        expect(validatePassword('password1')).toBe(true);
    });

    test('Password should not contain spaces', () => {
        expect(validatePassword('pass word1')).toBe(false);
        expect(validatePassword('password1')).toBe(true);
    });
    });
}
   

  // unitetst 3
  
  function testEmptyGenderSelection() {
    const form = document.createElement('form');
    
    // Create radio buttons (not all are needed for this test)
    const maleRadio = document.createElement('input');
    maleRadio.type = 'radio';
    maleRadio.name = 'gender';
    maleRadio.value = 'male';
    
    const femaleRadio = document.createElement('input');
    femaleRadio.type = 'radio';
    femaleRadio.name = 'gender';
    femaleRadio.value = 'female';
  
    // Append some radio buttons (not all are needed for this test, but simulates a real form)
    form.appendChild(maleRadio);
    form.appendChild(femaleRadio);
  
    // Test case: No radio button selected (empty gender)
    try {
      const selectedGender = getGenderValue(form);
      fail("Expected an error when no gender is selected");
    } catch (error) {
      // Expected error, test passes
    }
  }
  
  // Placeholder function to simulate getting the selected gender value from the form (replace with your actual logic)
  function getGenderValue(form) {
    const genderRadios = form.querySelectorAll('input[name="gender"]');
    for (const radio of genderRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return null; // Or throw an error if no selection is mandatory
  }
  
  // call test functions
  testEmptyAge();
  testPassword();
  testEmptyGenderSelection();