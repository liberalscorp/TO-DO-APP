// Getting required fields for data handling using DOM
// using let to avoid redeclaration of variables

let form = document.getElementById("form");
let titleInput = document.getElementById("titleInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

// Variable to toggle between Edit and Add 
let editFlag = false;

// Validate the form to check if it is empty or not

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (titleInput.value == "" || dateInput.value == "" ) {
        
        msg.innerHTML = "Please fill the required fields.";
        msg.style.color = "red";
        
    } else {
        if (editFlag == false )
        {
            addTask();
            msg.innerHTML = "Task added successfully.";
            msg.style.color = "green";
        }
        else
        {
            updateTask(e);
            msg.innerHTML = "Task updated successfully.";
            msg.style.color = "#A2FF86";
        }
        
        // Exit the form after submitting the data 
        const modal = bootstrap.Modal.getInstance(form);
        modal.hide();
        msg.innerHTML = "";
    }

})

// List required to store the task data
let taskData = [];

// Function to reset the form after submitting the data
resetForm = () => {
    titleInput.value = "";
    dateInput.value = "";
    textarea.value = "";
}

// Function to fetch the data from input fields and store it in taskData array
addTask = () => {
    taskData.push (
        {   
            title: titleInput.value,
            date: dateInput.value,
            description: textarea.value
        }
    );
    // now convert the data into string using JSON.stringify
    localStorage.setItem("taskData", JSON.stringify(taskData));
    console.log(taskData);

    // Now call the function to display the task
    displayTask();
}

updateTask = (e) => {
    e.preventDefault();
    // Get the index of the edited task
    const index = parseInt(form.getAttribute("data-index"));

    // Update the task in the taskData array
    taskData[index] = {
    title: titleInput.value,
    date: dateInput.value,
    description: textarea.value,
    };

    // Update the data in localStorage
    localStorage.setItem("taskData", JSON.stringify(taskData));
    console.log(taskData);

    // Call the displayTask function to show the updated task list
    displayTask();

    // Reset the editFlag
    editFlag = false;

    // Change the Add button description
    add.innerText = "Add"

}


// Function to display the task 
displayTask = () => {   
    tasks.innerHTML = "";
    // Display each task in the taskData array using forEach loop and provide Edit and Delete options for each task
    taskData.forEach((task, index) => {
        tasks.innerHTML += `
        <div id=${index}>
            <span>${task.title}</span>
            <span class="small text-secondary">${task.date}</span>
            <p>${task.description}</p>
            <span class="options">
            <i data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit" onclick = "editTask(this , ${index})"></i>
            <i onclick = "deleteTask(this)" class="fas fa-trash-alt"></i>
            </span>
        </div>
        `;
    })
    resetForm();
}


// Function to delete the task
deleteTask = (e) => {
    e.parentElement.parentElement.remove();
    // remove that task from the array
    taskData.splice(e.parentElement.parentElement.id, 1);
    // stringify the updated array
    localStorage.setItem("taskData", JSON.stringify(taskData));
  
    console.log(taskData);
  };
  
// function to edit the task
editTask = (element, index) => {
    editFlag = true; // we dont want to add the task but update it
    form.setAttribute("data-index", index); // set the index of the task being edited
  
    // Set the input values to the task being edited
    const task = taskData[index];
    titleInput.value = task.title;
    dateInput.value = task.date;
    textarea.value = task.description;

    // Change the Add button description
    add.innerText = "Save"
  };

  // Retrieve taskData from localStorage on page load
const savedData = localStorage.getItem("taskData");
if (savedData) {
  taskData = JSON.parse(savedData);
  displayTask();
}
