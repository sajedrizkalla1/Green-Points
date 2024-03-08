

// unitetst 1
function testOTPValidation() {
    // Example OTP code for testing
    var correctOTP = "12345";
  
    // Set the OTP input value for testing
    document.getElementById("otp").value = correctOTP;
  
    // Call the resetPassword function to simulate user input
    resetPassword();
  
    // Check if the OTP validation logic behaves correctly
    var successMessage = "Correct OTP code. Password reset successful.";
    var errorMessage = "Incorrect OTP code. Please try again.";
  
    // Get the alert message displayed
    var alertMessage = getAlertMessage();
  
    // Compare the alert message with the expected outcome
    if (alertMessage === successMessage) {
      console.log("Test passed: Correct OTP code.");
    } else if (alertMessage === errorMessage) {
      console.log("Test passed: Incorrect OTP code.");
    } else {
      console.log("Test failed: Unexpected alert message.");
    }
  }
  
  // Helper function to get the alert message
  function getAlertMessage() {
    var alertMessage;
    // Mocking the alert function to capture the message
    window.alert = function (message) {
      alertMessage = message;
    };
  
    // Call the replaceContent function to trigger the alert
    replaceContent();
  
    // Return the captured alert message
    return alertMessage;
  }
  

  // unitetst 2

  function testPasswordValidation() {
    // Example password for testing
    var validPassword = "StrongPassword123";
  
    // Set the password input value for testing
    document.getElementById("newPassword").value = validPassword;
  
    // Call the resetPassword function to simulate user input
    resetPassword();
  
    // Check if the password validation logic behaves correctly
    var successMessage = "Password reset successful.";
    var errorMessage = "Invalid password. Please choose a stronger password.";
  
    // Get the alert message displayed
    var alertMessage = getAlertMessage();
  
    // Compare the alert message with the expected outcome
    if (alertMessage === successMessage) {
      console.log("Test passed: Valid password.");
    } else if (alertMessage === errorMessage) {
      console.log("Test passed: Invalid password.");
    } else {
      console.log("Test failed: Unexpected alert message.");
    }
  }
  
  // Helper function to get the alert message
  function getAlertMessage() {
    var alertMessage;
    // Mocking the alert function to capture the message
    window.alert = function (message) {
      alertMessage = message;
    };
  
    // Call the replaceContent function to trigger the alert
    replaceContent();
  
    // Return the captured alert message
    return alertMessage;
  }

  // unitetst 3
  
  function testContinueButton() {
    // Set the email input value for testing
    document.getElementById("user_email").value = "test@example.com";
  
    // Call the replaceContent function to simulate user input
    replaceContent();
  
    // Check if the expected changes have occurred
    var contentDiv = document.getElementById("content");
    var modal = document.getElementById("myModal");
  
    // You can check if the contentDiv is hidden and modal is displayed
    if (contentDiv.style.display === "none" && modal.style.display === "block") {
      console.log("Test passed: Continue button works correctly.");
    } else {
      console.log("Test failed: Continue button did not work as expected.");
    }
  }
  
  // call test functions
  testOTPValidation();
  testPasswordValidation();
  testContinueButton();