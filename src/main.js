document.getElementById("fact-btn").addEventListener("click", fetchFacts);
document.getElementById("photo-btn").addEventListener("click", fetchPhotos);
document.getElementById("fact-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fetchFacts();
    }
});
document.getElementById("photo-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fetchPhotos();
    }
});

function showError(message) {
    let errorDiv = document.getElementById("error-message");
    errorDiv.textContent = message;
    errorDiv.classList.add("visible");
}

function hideError() {
    let errorDiv = document.getElementById("error-message");
    errorDiv.classList.remove("visible");
}

document.querySelectorAll(".cats button").forEach((button, index) => {
    button.addEventListener("click", function () {
        let input = document.querySelectorAll(".cats input")[index];
        let value = parseInt(input.value.trim(), 10);
        if (isNaN(value) || value <= 0) {
            showError("Please enter a valid number!");
            return;
        }

        hideError();
        if (index === 0) {
            fetchFacts(value);
        } else {
            fetchPhotos(value);
        }
    });
});

async function fetchFacts() {
    let factInput = document.getElementById("fact-input").value;
    let factList = document.getElementById("fact-list");
    let photoContainer = document.getElementById("photo-container");
    let spinner = document.getElementById("loading-spinner");

    factList.innerHTML = ""; 
    photoContainer.innerHTML = "";
    spinner.classList.remove("hidden"); 

    let count = parseInt(factInput);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 50) count = 50;

    try {
        let response = await fetch(`https://meowfacts.herokuapp.com/?count=${count}`);
        let data = await response.json();
        let facts = data.data;

        spinner.classList.add("hidden");

        facts.forEach((fact, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${fact}`;
            factList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching cat facts:", error);
        spinner.classList.add("hidden");
    }
}

async function fetchPhotos() {
    let photoInput = document.getElementById("photo-input").value;
    let photoContainer = document.getElementById("photo-container");
    let factList = document.getElementById("fact-list");
    let spinner = document.getElementById("loading-spinner");

    photoContainer.innerHTML = ""; 
    factList.innerHTML = "";
    spinner.classList.remove("hidden");

    let count = parseInt(photoInput);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 10) count = 10;

    try {
        let response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}`);
        let data = await response.json();

        spinner.classList.add("hidden"); 

        displayPhotos(data, count);
    } catch (error) {
        console.error("Error fetching cat photos:", error);
        spinner.classList.add("hidden");
    }
}

function displayPhotos(data, count) {
    let photoContainer = document.getElementById("photo-container");
    data.slice(0, count).forEach(photo => {
        let img = document.createElement("img");
        img.src = photo.url;
        img.alt = "Cute Cat";
        photoContainer.appendChild(img);
    });
}
