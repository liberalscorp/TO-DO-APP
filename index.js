// Getting required fields for data handling using DOM
// using let to avoid redeclaration of variables

let form = document.getElementById("form");
let titleInput = document.getElementById("titleInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let deleteAll = document.getElementById("deleteAllBtn");
// Variable to toggle between Edit and Add 
let editFlag = false;
// List required to store the task data
let taskData = [];

// Function to show deleteAll div
showDeleteAll = () => {
    if (customLength(taskData)> 1)
    {
        // show DeleteAll div
        deleteAll.removeAttribute("hidden");
        // make event listener for deleteAll
        deleteBtn = document.querySelector("#deletebtn");
        deletebtn.addEventListener("click" , () => {
            // delete all the tasks
            tasks.innerHTML = "";
            // remove all the tasks from the array
            taskData.splice(0, customLength(taskData));
            // stringify the updated array
            localStorage.setItem("taskData", JSON.stringify(taskData));
            // hide the deleteAll div
            deleteAll.setAttribute("hidden" , "true");
        })
    }
    else
    {
        // hide DeleteAll div
        deleteAll.setAttribute("hidden" , "true");
    }

}
//Validate the date
validateDate = () => {  
    var currentDate = new Date();
    var taskDate = new Date(dateInput.value);
    currentDate.setHours(0,0,0,0);
    taskDate.setHours(0,0,0,0);
    if (taskDate < currentDate){
        dateInput.value = "";
        return true;
    }
    return false;
}

// Validate the form to check if it is empty or not

form.addEventListener("submit", (e) => {
    
    
    e.preventDefault();
    var wrongDate = validateDate()
    if (titleInput.value == "" || dateInput.value == "" ) {
        
        if (!wrongDate)
        {
            msg.innerHTML = "Note: Please fill the required fields.";
            msg.style.color = "black";
    
        }
        else
        {
            msg.innerHTML = "Note: Enter today's date or any later date.";
            msg.style.color = "black";
        }
       
        
        
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
    
    showDeleteAll();
        

})


// Function to reset the form after submitting the data
resetForm = () => {
    titleInput.value = "";
    dateInput.value = "";
    textarea.value = "";
}
// takes in list and element object to be added and returns the updated list
function customPush(array , element)
{
    array[customLength(array)] = element;
    //console.log(array);
    return array;
}

function customLength(array)
{
    let count = 0;
    for (let key in array)
        count++;

    return count;
}
// format the date
function formatDate(date) {
    const [year, month, day] = date.split("-");

    return [day, month, year].join("-");
}

// Function to fetch the data from input fields and store it in taskData array
addTask = () => {
    taskData = customPush ( taskData ,
        {   
            title: titleInput.value,
            date: formatDate(dateInput.value),
            description: textarea.value,
            status: "Pending"
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
    date: formatDate(dateInput.value),
    description: textarea.value
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
    taskData.sort((a,b)=> {
        return new Date(a.date) - new Date(b.date);
    })
    taskData.forEach((task, index) => {
        const statusLabel = task.status == "Completed" ? '<span class="status-label completed">Completed</span>' : '<span class="status-label pending">Pending</span>';
        tasks.innerHTML += `
        <div id=${index}>
            <span>${task.title}  ${statusLabel}</span>
            <span class="small text-secondary">${task.date}</span>
            <p>${task.description}</p>
            <span class="options">
                <i class="fas fa-clipboard-list" onclick="completeTask(${index})"></i>
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
    if (confirm("Are you sure you want to delete this task?")){

        
        e.parentElement.parentElement.remove();
        // remove that task from the array
        taskData.splice(e.parentElement.parentElement.id, 1);
        // stringify the updated array
        localStorage.setItem("taskData", JSON.stringify(taskData));
    
        console.log(taskData);
        showDeleteAll();
    }
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


completeTask = (index) => {
    // Change the status of the task to Completed
    if (taskData[index].status == "Completed"){
        taskData[index].status = "Pending";
        
    }else
        taskData[index].status = "Completed";

    // Save the updated entry in localStorage
    localStorage.setItem("taskData", JSON.stringify(taskData));
    console.log(taskData);
    displayTask();

}
// Retrieve taskData from localStorage on page load (persistent data)
const savedData = localStorage.getItem("taskData");
if (savedData) {
  taskData = JSON.parse(savedData);
  displayTask();
  showDeleteAll();
}

// Search functionality

let search = document.getElementById("search");

function PerformSearch() {
    let taskToSearch = document.getElementById("searchInput");
    taskToSearch = taskToSearch.value.toLowerCase();

    let searchedindex ;
    
    const found = taskData.find((searchkey)=>{
        searchkey.title = searchkey.title.toLowerCase();
        searchkey.description = searchkey.description.toLowerCase();
        searchedindex == taskData.indexOf(searchkey)
        
        return (
            (searchkey.title === taskToSearch ||
            searchkey.description === taskToSearch ||
            searchkey.date === taskToSearch ) 
            
        )
    })
    
    if (found)
    {
        console.log(found);
    }
        
    else
        console.log("Not Found")

    displayTask();
}

searchBtn.addEventListener("click", PerformSearch);
searchInput.addEventListener("keypress", (e)=>{
    if (e.key == "Enter")
        PerformSearch();
});