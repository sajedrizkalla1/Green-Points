document.addEventListener('DOMContentLoaded', function () {

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'index.html';
    }
    if (userData) {
        console.log("userData",userData);
        document.querySelector('input[name="username"]').value = userData.name || '';
        document.querySelector('input[name="age"]').value = userData.age || '';
        document.querySelector('input[name="email"]').value = userData.email || '';
        // Password is not populated for security reasons
    }

    const editDetailsBtn = document.getElementById('editDetails');
    const generalTabLink = document.querySelector('a[href="#account-general"]');
    const changePasswordLink = document.querySelector('a[data-toggle="list"][href="#account-change-password"]');
    const inputs = document.querySelectorAll('#account-general input');
    const saveCancelButtons = document.querySelector('.ops-buttons');

    editDetailsBtn.addEventListener('click', function () {
        // Enable input fields for editing
        inputs.forEach(input => {
            input.disabled = false;
        });

        // Show save/cancel buttons
        saveCancelButtons.style.display = 'block';

        // Adjust active class for navigation links
        editDetailsBtn.classList.add('active');
        generalTabLink.classList.add('active');
        changePasswordLink.classList.remove('active');

        // Adjust visibility of tab content
        const generalTabContent = document.getElementsByClassName('generalTab')[0];
        const changePasswordTabContent = document.getElementById('account-change-password');

        generalTabContent.classList.remove('show', 'active'); // Ensure general tab content is shown and active
        changePasswordTabContent.classList.remove('show', 'active'); // Hide change password tab content

        // Scroll to the top of the general tab content for better user experience
    });


    // Logic for when other tabs are clicked to ensure correct active class assignment
    generalTabLink.addEventListener('click', function() {
        // Show the general tab content and ensure it's marked as active
        const generalTabContent = document.getElementById('account-general'); // Corrected ID for general tab content
    
        // Hide save/cancel buttons since we are just viewing the general info
        saveCancelButtons.style.display = 'none';
    
        // Update active class assignments for the navigation links
        editDetailsBtn.classList.remove('active'); // Remove active from "Change Details"
        generalTabLink.classList.add('active'); // Add active to "General" tab link
        changePasswordLink.classList.remove('active'); // Ensure "Change Password" is not marked as active
    
        // Adjust visibility of tab content
        generalTabContent.classList.add('show', 'active'); // Show and activate general tab content
        const changePasswordTabContent = document.getElementById('account-change-password');
        changePasswordTabContent.classList.remove('show', 'active'); // Hide change password tab content
    
        // Disable inputs in the General tab to return to view-only state
        const inputs = document.querySelectorAll('#account-general input');
        inputs.forEach(input => input.disabled = true);
    
        // Scroll to the top of the General tab content for a better user experience
        generalTabContent.scrollIntoView();
    });
    

    changePasswordLink.addEventListener('click', function () {
        // Add 'active' class to the Change Password link
        changePasswordLink.classList.add('active');
        editDetailsBtn.classList.remove('active');
        generalTabLink.classList.remove('active');

        // Show save/cancel buttons
        saveCancelButtons.style.display = 'block';

        // Hide the General tab content and show the Change Password tab content
        // const generalTabContent = document.getElementById('account-general');
        const changePasswordTabContent = document.getElementById('account-change-password');

        // generalTabContent.classList.remove('show', 'active');
        changePasswordTabContent.classList.add('show', 'active');

        // If there's a need to disable inputs in the General tab when switching
        const inputsInGeneralTab = document.querySelectorAll('#account-general input');
        inputsInGeneralTab.forEach(input => {
            input.disabled = true;
        });
    });


    // Assuming you have a mechanism to "cancel" or "save"
    // document.querySelector('.btn-default').addEventListener('click', function () {
    //     // Disable inputs again
    //     inputs.forEach(input => input.disabled = true);

    //     // Hide save/cancel buttons
    //     saveCancelButtons.style.display = 'none';

    //     // Add active class back to General and remove from Change Details
    //     generalTabLink.classList.add('active');
    //     editDetailsBtn.classList.remove('active');
    //     changePasswordLink.classList.remove('active');

    //     // Optionally, revert any unsaved changes here
    // });

    document.querySelector('.btn-default').addEventListener('click', function () {
        // Disable inputs again
        inputs.forEach(input => input.disabled = true);
    
        // Hide save/cancel buttons
        saveCancelButtons.style.display = 'none';
    
        // Update active class assignments for the navigation links
        generalTabLink.classList.add('active');
        editDetailsBtn.classList.remove('active');
        changePasswordLink.classList.remove('active');
    
        // Adjust visibility of tab content to show the General tab and hide the others
        const generalTabContent = document.getElementById('account-general');
        const changePasswordTabContent = document.getElementById('account-change-password');
    
        generalTabContent.classList.add('show', 'active'); // Show and activate general tab content
        changePasswordTabContent.classList.remove('show', 'active'); // Hide change password tab content
    
        // Scroll to the top of the General tab content for a better user experience
        generalTabContent.scrollIntoView();
    
        // Optionally, revert any unsaved changes here
    });
    document.querySelector('.btn-primary').addEventListener('click', async function(e) {
        e.preventDefault(); // Prevent default form submission
        const user = JSON.parse(localStorage.getItem('userData'));
        const userId = user.id; // Assuming the user's ID is stored in userData
        const url = `https://green-points-fe682babb5dc.herokuapp.com/api/users/${userId}/updateUser`;
    
        const updatedUserData = {
            name: document.querySelector('input[name="username"]').value,
            age: document.querySelector('input[name="age"]').value,
            email: document.querySelector('input[name="email"]').value,
            oldPassword: document.querySelector('input[name="oldPassword"]').value,
            password: document.querySelector('input[name="newPassword"]').value
        };
    
        // Remove empty fields to only send the fields that were actually updated
        Object.keys(updatedUserData).forEach(key => {
            if (!updatedUserData[key]) {
                delete updatedUserData[key];
            }
        });
    
        try {
            const response = await fetch(url, {
                method: 'PUT', // Assuming PUT is used for updates
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': user.accessToken // Include authorization headers if needed
                },
                body: JSON.stringify(updatedUserData)
            });
    
            const result = await response.json();
            if (response.ok) {
                alert('User details updated successfully');
    
                // Merge updated data with existing userData and save back to localStorage
                const newUserData = { 
                    ...user,
                    ...{ 
                        name: updatedUserData.name, 
                        age: updatedUserData.age, 
                        email: updatedUserData.email 
                    }
                }; // Assuming the API returns the updated user object
                console.log("newUserData",newUserData);
                localStorage.setItem('userData', JSON.stringify(newUserData));
    
                // Redirect or update UI as needed
            } else {
                alert(`Failed to update user details: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            alert('An error occurred. Please try again.');
        }
    });
    
    

    // Implement additional logic for "Save changes" button
});

document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default anchor action
  
    // Clear local storage or specific items related to user session
    localStorage.clear();
    // localStorage.removeItem('userData'); // Uncomment if you prefer to remove specific item
  
    // Redirect to index.html or your landing page
    window.location.href = 'index.html';
  });