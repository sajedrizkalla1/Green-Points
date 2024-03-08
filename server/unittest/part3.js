function testPasswordInput(password) {
    // Set the password input value
    document.getElementById('password').value = password;

    // Trigger form submission
    document.getElementById('loginForm').submit();

    // Wait for the fetch request to complete
    setTimeout(() => {
        // Check if the alert message indicates a successful login or an error
        const successMessage = 'Success:';
        const errorMessage = 'wrong email or password';

        const alertMessage = getAlertMessage();

        if (alertMessage.includes(successMessage)) {
            console.log('Test passed: Valid password - ${password}');
        } else if (alertMessage.includes(errorMessage)) {
            console.log('Test passed: Invalid password - ${password}');
        } else {
            console.log('Test failed: Unexpected alert message.');
        }
    }, 1000);
}

// Helper function to get the alert message
function getAlertMessage() {
    let alertMessage;

    // Mocking the alert function to capture the message
    window.alert = function (message) {
        alertMessage = message;
    };

    // Call the form submission function to trigger the alert
    document.getElementById('loginForm').submit();

    // Return the captured alert message
    return alertMessage;
}

// Example usage:
testPasswordInput('ValidPassword123');
testPasswordInput('InvalidPassword');