function testContent() {
    // case 1:
    console.log("Test Case 1: Empty name");
    document.getElementsByName("name").value = "";
    var alertShown = Content();
    console.log("Alert Shown:  ",alertShown); // This should log undefiend
    // case 2:
    console.log("Test Case 2: Empty password ");
    document.getElementsByName("password").value = "";
    var alertShown = Content();
    console.log("Alert Shown:  ",alertShown); // This should log undefiend

  
}

testContent();