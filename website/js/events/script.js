const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

searchInput.addEventListener("input", (e) => {
  const vlaue = e.target.value.toLowerCase()
  user.forEach(usr => {
    const isVisible =
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    user.element.classList.toggle("hide", !isVisible)
  });

})


// fetch("https://jsonplaceholder.typicode.com/users") 
//   .then(res => res.json()).then
//   .then(data => {
//     user = data.map(user => {

//        const card = userCardTemplate.content.cloneNode(true).children[0]
//        const header = card.querySelector("[data-header]")
//        const body = card.querySelector("[data-body]")
//        header.textContent = user.name
//        body.textContent = user.email
//        console.log(user)
//        userCardContainer.append(card)
//        return { name: user.name, email: user.email, element: card }
//     });
//   })


let allEvents = [];
document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('userData'));
  if (!user) {
    window.location.href = 'index.html';
  }
  loadComments();
  // Check if the user is an organizer and append "Add Event" button if true
  if (user && user.isOrganizer) {
    const addButtonContainer = document.querySelector('.addButtonContainer');
    if (addButtonContainer) {
      const addButton = document.createElement('button');
      addButton.className = 'btn1';
      addButton.setAttribute('data-modal-target', '#modal');
      addButton.textContent = '+';
      addButtonContainer.appendChild(addButton);

      addButton.addEventListener('click', () => {
        const modal = document.querySelector(addButton.getAttribute('data-modal-target'));
        if (modal) {
          modal.classList.add('active');
          document.getElementById('overlay').classList.add('active');
        }
      });
    }
  }

  const searchInput = document.querySelector("[data-search]");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filteredEvents = allEvents.filter(event => {
      // Adjust these conditions based on the actual structure of your event objects
      const eventNameMatch = event.title.toLowerCase().includes(searchTerm);
      const eventDateMatch = event.time && event.time.toLowerCase().includes(searchTerm); // Assuming each event has a 'date' field
      return eventNameMatch || eventDateMatch;
    });

    displayEvents(filteredEvents);
  });



  // Fetch and display all events
  try {
    // Adjust the fetch URL to your actual API endpoint
    console.log("user", user);
    const url = `https://green-points-fe682babb5dc.herokuapp.com/api/events`;
    const response = await fetch(url, {
      headers: {
        'x-access-token': user.accessToken, // Include the token if user is logged in
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    allEvents = await response.json();
    // Assuming you have a function or logic to display these events
    displayEvents(allEvents);
  } catch (error) {
    console.error('Error loading events:', error);
  }

  const addButton = document.querySelector('.btn1[data-modal-target="#modal"]');
  const confirmButton = document.querySelector('.Confirm-B'); // The Confirm button inside the modal
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');
  const closeButton = document.querySelector('.close-button');

  // Function to toggle the modal visibility
  function toggleModal(isOpen) {
    if (isOpen) {
      modal.classList.add('active');
      overlay.classList.add('active');
    } else {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  // Event listeners for opening and closing the modal
  addButton.addEventListener('click', () => toggleModal(true));
  overlay.addEventListener('click', () => toggleModal(false));
  closeButton.addEventListener('click', () => toggleModal(false));

  // Event listener for the confirm button to submit a new event
  confirmButton.addEventListener('click', async () => {
    const title = document.getElementById('ProjectName').value;
    const location = document.getElementById('ProjectAdress').value;
    const time = document.getElementById('TimeMeting').value;
    const maxCapacity = document.getElementById('maxCapacity').value;
    const description = document.getElementById('description').value;

    const eventData = {
      title,
      location, // Placeholder for location, adjust as necessary
      time,
      maxCapacity: parseInt(maxCapacity, 10),
      currentCapacity: 0, // Assuming this starts at 0
      description
    };

    try {
      const url = `https://green-points-fe682babb5dc.herokuapp.com/api/events`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': user.accessToken // Adjust based on your auth strategy
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to add the event');
      }

      const data = await response.json();
      console.log('Event added successfully:', data);
      const eventId = data.eventId; // Extract eventId from the response
      toggleModal(false); // Close the modal

      // Update localStorage with new eventId
      console.log("user before update", user);
      if (user.OrganizerEvents && !user.OrganizerEvents.includes(eventId)) {
        user.OrganizerEvents.push(eventId);
        localStorage.setItem('userData', JSON.stringify(user));
      }
      console.log("user after update", user);

      window.location.reload(); // Consider dynamically updating the UI instead
    } catch (error) {
      console.error('Error adding the event:', error);
    }

  });
});


// Example function to display events (implement based on your HTML structure)
function displayEvents(events) {
  const eventsContainer = document.querySelector('.box12');
  const user = JSON.parse(localStorage.getItem('userData'));

  eventsContainer.innerHTML = '';

  events.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = 'box1';
    eventElement.style.position = 'relative'; // Allows absolute positioning of the buttonContainer

    // Create a container for the event details
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'event-details';

    const address = event.location;

    detailsContainer.innerHTML = `
          <h2 class="titleP">Event name: ${event.title}</h2>
          <h3 class="ep">Address: ${address}</h3>
          <h3 class="ep">Max Capacity: ${event.maxCapacity}</h3>
          <h3 class="ep">Current Capacity: ${event.currentCapacity}</h3>
          <h3 class="ep">Time: ${event.time}</h3>
          <h3 class="ep">Description: ${event.description}</h3>
      `;

    eventElement.appendChild(detailsContainer); // Add the details container to the event element

    // Your existing logic for determining the user's relation to the event and adding buttons/message
    const isOrganizerEvent = user && user.isOrganizer && user.OrganizerEvents.includes(event._id);
    const isVolunteerAppliedEvent = user && user.volunteerEvents && user.volunteerEvents.includes(event._id);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'btn2';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';

    if (!isOrganizerEvent && !isVolunteerAppliedEvent) {
      // buttonContainer.innerHTML += `<input class="Aplly-b" type="submit" value="Apply">`;
      const applyButton = document.createElement('input');
      applyButton.className = 'Aplly-b';
      applyButton.setAttribute('type', 'submit');
      applyButton.value = 'Apply';

      applyButton.addEventListener('click', async () => {
        try {
          const userId = user._id; // Assuming your user object has an _id field
          const eventId = event._id; // Assuming your event object has an _id field
          const url = `https://green-points-fe682babb5dc.herokuapp.com/api/events/apply/${eventId}/${userId}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Include an Authorization header if your API requires authentication
              'x-access-token': user.accessToken, // Adjust as needed
            },
          });

          if (!response.ok) {
            throw new Error('Failed to apply to event');
          }

          const result = await response.json();
          console.log(result.message);
          alert('Successfully applied to the event!');
          if (!user.volunteerEvents.includes(eventId)) {
            user.volunteerEvents.push(eventId);
            // Save the updated user object back to localStorage
            localStorage.setItem('userData', JSON.stringify(user));
          }
          window.location.reload()
          // Optionally, refresh the events list or update the UI here
        } catch (err) {
          console.error('Error applying to event:', err);
          alert('Failed to apply to the event.');
        }
      });

      buttonContainer.appendChild(applyButton);
    } else if (isOrganizerEvent) {
      buttonContainer.innerHTML += `<button class="Edit-b">Edit</button><button class="Delete-b">Delete</button>`;
      const editButton = buttonContainer.querySelector('.Edit-b');
      const deleteButton = buttonContainer.querySelector('.Delete-b');
      deleteButton.addEventListener('click', async () => {
        // Confirm deletion with the user
        if (!confirm("Are you sure you want to delete this event?")) {
          return; // Stop if user cancels the deletion
        }

        try {
          const url = `https://green-points-fe682babb5dc.herokuapp.com/api/events/${event._id}`; // Use the correct event ID
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'x-access-token': user.accessToken, // Include the auth token
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete the event');
          }

          alert('Event deleted successfully');
          // Optionally, remove the event element from the DOM or refresh the events list
          eventElement.remove(); // Assuming eventElement is the container for the event's details
          // window.location.reload();

        } catch (error) {
          console.error('Error deleting the event:', error);
          alert(`Error: ${error.message}`);
        }
      });


      editButton.addEventListener('click', () => {
        // Save current details for potential restoration
        const originalDetailsHTML = detailsContainer.innerHTML;

        // Transform detailsContainer to editable fields
        detailsContainer.innerHTML = `
            <label class="titleP">Event name:</label>
            <input type="text" class="edit-event-name" value="${event.title}"><br>
            <label>Address:</label>
            <input type="text" class="edit-event-address" value="${address}"><br>
            <label>Max Capacity:</label>
            <input type="number" class="edit-event-max-capacity" value="${event.maxCapacity}"><br>
            <label>Current Capacity:</label>
            <input type="number" class="edit-event-current-capacity" value="${event.currentCapacity}" disabled><br>
            <label>Time:</label>
            <input type="datetime-local" class="edit-event-time" value="${event.time}"><br>
            <label>Description:</label>
            <textarea class="edit-event-description">${event.description}</textarea><br>

            <button class="save-event">Save</button>
            <button class="cancel-edit">Cancel</button>
        `;

        // Save Event Button Logic
        const saveButton = detailsContainer.querySelector('.save-event');
        saveButton.addEventListener('click', async () => {
          const eventData = {
            title: document.querySelector('.edit-event-name').value,
            location: document.querySelector('.edit-event-address').value,
            maxCapacity: parseInt(document.querySelector('.edit-event-max-capacity').value, 10),
            time: document.querySelector('.edit-event-time').value,
            description: document.querySelector('.edit-event-description').value,
          };

          try {
            const url = `https://green-points-fe682babb5dc.herokuapp.com/api/events/${event._id}`;
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                // Assuming you're using bearer tokens for authentication
                'x-access-token': user.accessToken
              },
              body: JSON.stringify(eventData)
            });

            if (!response.ok) {
              throw new Error('Failed to update the event');
            }

            // Assuming the server response includes the updated event data
            const result = await response.json();
            alert('Event updated successfully');
            // Update UI accordingly without reloading the page, if possible
            window.location.reload();
          } catch (error) {
            console.error('Error updating the event:', error);
            alert('Failed to update the event.');
          }
        });


        // Cancel Edit Button Logic
        const cancelButton = detailsContainer.querySelector('.cancel-edit');
        cancelButton.addEventListener('click', () => {
          // Restore the original non-editable event details
          detailsContainer.innerHTML = `
            <h2 class="titleP">Event name: ${event.title}</h2>
            <h3 class="ep">Address: ${address}</h3>
            <h3 class="ep">Max Capacity: ${event.maxCapacity}</h3>
            <h3 class="ep">Current Capacity: ${event.currentCapacity}</h3>
            <h3 class="ep">Time: ${event.time}</h3>
            <h3 class="ep">Description: ${event.description}</h3>
        `;

          // Re-bind the edit and delete button events since innerHTML overwrite removes previous event listeners
          // This may require refactoring your button setup code into a function that can be called here
        });
      });

    } else {
      buttonContainer.innerHTML += `<h3 class="applied-message">You have applied for this event</h3>`;
    }

    eventElement.appendChild(buttonContainer); // Add the button container to the event element
    eventsContainer.appendChild(eventElement); // Add the complete event element to the events container


  });
}

document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the form from submitting the traditional way

  const commentText = document.getElementById('comment-text').value;
  if (!commentText.trim()) {
    alert("Comment cannot be empty!");
    return;
  }
  const user = JSON.parse(localStorage.getItem('userData'));


  // Assuming you have an API endpoint to submit a new comment
  try {
    const url = `https://green-points-fe682babb5dc.herokuapp.com/api/comments`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authentication token if needed
        'x-access-token': user.accessToken
      },
      body: JSON.stringify({ comment: commentText })
    });

    if (!response.ok) {
      throw new Error('Failed to post comment');
    }

    document.getElementById('comment-text').value = ''; // Clear the textarea
    loadComments(); // Reload comments to include the new one
  } catch (error) {
    console.error('Error posting comment:', error);
  }
});

document.getElementById('cancel-comment').addEventListener('click', () => {
  document.getElementById('comment-text').value = ''; // Clear the textarea
});





async function loadComments() {
  try {
      const url = `https://green-points-fe682babb5dc.herokuapp.com/api/comments`;
      const user = JSON.parse(localStorage.getItem('userData'));
      const response = await fetch(url, {
          headers: {
              'Content-Type': 'application/json',
              'x-access-token': user.accessToken
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch comments');
      }

      const comments = await response.json();
      const commentsContainer = document.getElementById('comments-container');
      commentsContainer.innerHTML = '';

      comments.forEach(comment => {
          const commentElement = document.createElement('div');
          commentElement.classList.add('comment');
          commentElement.innerHTML = `
          <div class="comment-content">
              <p class="comment-text">${comment.text}</p>
              ${user.isOrganizer ? `<button class="delete-comment" data-id="${comment._id}">Delete</button>` : ''}
          </div>
      `;
          commentsContainer.appendChild(commentElement);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-comment').forEach(button => {
          button.addEventListener('click', async () => {
              const commentId = button.getAttribute('data-id');
              await deleteComment(commentId);
          });
      });

  } catch (error) {
      console.error('Error loading comments:', error);
  }
}


async function deleteComment(commentId) {
  try {
      const url = `https://green-points-fe682babb5dc.herokuapp.com/api/comments/${commentId}`;
      const user = JSON.parse(localStorage.getItem('userData'));
      const response = await fetch(url, {
          method: 'DELETE',
          headers: {
              'x-access-token': user.accessToken
          },
      });

      if (!response.ok) {
          throw new Error('Failed to delete comment');
      }

      alert('Comment deleted successfully');
      loadComments(); // Refresh comments to reflect deletion
  } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
  }
}

document.getElementById('logout').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default anchor action

  // Clear local storage or specific items related to user session
  localStorage.clear();
  // localStorage.removeItem('userData'); // Uncomment if you prefer to remove specific item

  // Redirect to index.html or your landing page
  window.location.href = 'index.html';
});
