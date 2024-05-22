const arrayAvailablePets = [
    { type: 'Cat', breed: 'Russian Blue', age: '2', gender: 'Female', compatibility: 'Young Children', extra: 'Studying to become a purr-fessional therapist', image: './images/nyla.jpg' },
    { type: 'Cat', breed: 'Tuxedo', age: '1', gender: 'Female', compatibility: 'Other Cats,Young Children', extra: 'Always looks her best', image: './images/ollie.JPG' },
    { type: 'Cat', breed: 'Ginger', age: '13', gender: 'Female', compatibility: 'Other Cats,Young Children', extra: ' Brings home other animals allegedly', image: './images/ginger.JPG' },
    { type: 'Cat', breed: 'American ShortEars', age: '9', gender: 'Female', compatibility: 'Young Children', extra: 'Also known as The Kitty Who Lived, attends Meow-gwarts School of Whisker-craft and Paw-zardry', image: './images/luna.jpg' },
    { type: 'Cat', breed: 'Tabbie', age: '3', gender: 'Female', compatibility: 'Other Cats,Young Children', extra: 'Permanently ashamed', image: './images/ashamed_jasmine.JPG' },
    { type: 'Cat', breed: 'Tabbie', age: '6', gender: 'Male', compatibility: 'Other Dogs,Other Cats,Young Children', extra: ' Purr-fessional Rizzologist, affectionate, will casually steal your girl', image: './images/billy.jpg' },
    { type: 'Cat', breed: 'Tabbie', age: '4', gender: 'Male', compatibility: 'Young Children', extra: ' Has a strange addiction to Pikachu, our newest member of our family', image: './images/jj.jpg' },
    { type: 'Dog', breed: 'French Bulldog', age: '7', gender: 'Male', compatibility: 'Other Dogs,Young Children', extra: 'Loves bellie rubs and tug of war', image: './images/oscar.jpg' },
    { type: 'Dog', breed: 'Portuguese Water Dog', age: '3', gender: 'Female', compatibility: 'Other Dogs,Other Cats,Young Children', extra: 'Who is this dog and why is it in my camera roll', image: './images/romeo.jpg' }
]

function displayTime() {
    dom = document.getElementById("date");
    let dateobj = new Date();
    dom.innerHTML = dateobj.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
        year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
    })

    setTimeout(displayTime, 1000);
}
window.onload = displayTime;

function changeBreedOptions(animalType) {
    if (animalType.name === "animalTypeFind") {
        var dropdown = document.getElementById("breedDropdownFind");
    }
    else if (animalType.name === "animalTypeGive") {
        var dropdown = document.getElementById("breedDropdownGive");
    }
    dropdown.innerHTML = "";

    const uniqueBreeds = new Set();

    if (animalType.value === "Dog") {
        for (let animal of arrayAvailablePets) {
            if (animal.type === 'Dog') {
                uniqueBreeds.add(animal.breed);
            }
        }

        for (let breed of uniqueBreeds) {
            dropdown.add(new Option(breed, breed));
        }
    }

    else if (animalType.value === "Cat") {
        for (let animal of arrayAvailablePets) {
            if (animal.type === 'Cat') {
                uniqueBreeds.add(animal.breed);
            }
        }

        for (let breed of uniqueBreeds) {
            dropdown.add(new Option(breed, breed));
        }
    }

    if (animalType.name === "animalTypeFind") {
        dropdown.add(new Option("Does not matter", "doesnotmatter"));
    } else if (animalType.name === "animalTypeGive") {
        dropdown.add(new Option("Mixed"));
        dropdown.add(new Option("Unsure"));
    }
}

function compatibilityCheckboxes() {

    let findCheckboxes = document.querySelectorAll('input[name="compatibleFind"]');
    let giveCheckboxes = document.querySelectorAll('input[name="compatibleGive"]');

    allCheckboxes = [findCheckboxes, giveCheckboxes];

    allCheckboxes.forEach(function (checkboxes) {
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
                if (checkbox.value === "doesnotmatter" && checkbox.checked) {
                    checkboxes.forEach(function (otherCheckboxes) {
                        if (otherCheckboxes !== checkbox) {
                            otherCheckboxes.checked = false;
                        }
                    })
                }
                else if (checkbox.value !== "doesnotmatter" && checkbox.checked) {
                    if (checkbox.name === "compatibleFind") {
                        document.querySelector('input[name="compatibleFind"][value="doesnotmatter"]').checked = false;
                    } else if (checkbox.name === "compatibleGive") {
                        document.querySelector('input[name="compatibleGive"][value="doesnotmatter"]').checked = false;
                    }
                }
            })
        })

    })
}

function validateForm(event) {

    let form = event.target;

    if (form.id === "formFind") {
        var animalType = document.getElementsByName("animalTypeFind");
        var animalGender = document.getElementsByName("genderFind");
        var animalCompatibility = document.getElementsByName("compatibleFind");

        const fieldCategories = [animalType, animalGender, animalCompatibility];
        for (let i = 0; i < fieldCategories.length; i++) {
            let fieldSelected = false;
            for (let j = 0; j < fieldCategories[i].length; j++) {
                if (fieldCategories[i][j].checked) {
                    fieldSelected = true;
                    break;
                }
            }
            if (fieldSelected === false) {
                event.preventDefault();
                alert("Please make sure no fields are blank before submitting.");
                break;
            }
        }
    }

    else if (form.id === "formGive") {
        var animalType = document.getElementsByName("animalTypeGive");
        var animalGender = document.getElementsByName("genderGive");
        var animalCompatibility = document.getElementsByName("compatibleGive");
        var additionalInfo = document.getElementById("additionalInfo");
        var firstName = document.getElementById("firstName");
        var familyName = document.getElementById("familyName");
        var emailAddress = document.getElementById("email");

        const fieldCategories = [animalType, animalGender, animalCompatibility, additionalInfo,
            firstName, familyName];

        for (let i = 0; i < fieldCategories.length; i++) {
            let validInput = false;

            if (fieldCategories[i].type === "text" || fieldCategories[i].type === "textarea") {
                if (fieldCategories[i].value.trim() !== "") {
                    validInput = true;
                }
            }

            else if (fieldCategories[i][0].type === "radio" || fieldCategories[i][0].type === "checkbox") {
                for (let j = 0; j < fieldCategories[i].length; j++) {
                    if (fieldCategories[i][j].checked) {
                        validInput = true;
                        break;
                    }
                }
            }

            if (validInput === false) {
                event.preventDefault();
                alert("Please make sure no fields are blank before submitting.");
                break;
            }
        }
    }
}

function validateCreateAccount(event) {

    let username = document.getElementById("username");
    let password = document.getElementById("password");

    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,}$/;

    if (username.value === "" || password.value === "") {
        event.preventDefault();
        alert('Please make sure no fields are blank before submitting.');
        return;
    } else {
        if (!usernamePattern.test(username.value)) {
            event.preventDefault();
            alert('Invalid username. A username can contain letters (both upper and lowercase) and digits only.');
            return;
        }

        if (!passwordPattern.test(password.value)) {
            event.preventDefault();
            alert('Invalid password. Password must be at least 4 characters long (letters and digits only) and contain at least one letter and at least one digit.')
            return;
        }
    }
}

function validateLogin(event) {

    let username = document.getElementById("usernameLogin");
    let password = document.getElementById("passwordLogin");

    if (username.value === "" || password.value === "") {
        event.preventDefault();
        alert('Please make sure no fields are blank before submitting.');
    }
}

