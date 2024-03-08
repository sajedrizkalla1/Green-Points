function validemail() {


    // case 1:
    console.log("Test Case 1: Empty Email");
    document.getElementById("user_email").value = "";
    var alertShown = replaceContent();
    console.log("Alert Shown:  ",alertShown); // This should log undefiend
    // case 2:
    console.log("Test Case 2: valid email format ");
    document.getElementById("user_email").value = "ameer@gmail.com";
    var alertShown = replaceContent();
    console.log("Alert Shown:  ",alertShown); // This should log nothing

  
}

validemail();