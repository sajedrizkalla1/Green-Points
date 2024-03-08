function testReplaceContent() {


    // case 1:
    console.log("Test Case 1: Empty Email");
    document.getElementById("user_email").value = "";
    var alertShown = replaceContent();
    console.log("Alert Shown:  ",alertShown); // This should log undefiend
    // case 2:
    console.log("Test Case 2: invalid email format ");
    document.getElementById("user_email").value = "gmail.com";
    var alertShown = replaceContent();
    console.log("Alert Shown:  ",alertShown); // This should log undefiend

  
}

testReplaceContent();