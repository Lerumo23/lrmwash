/*

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addVehicle').addEventListener('click', addVehicle);
    document.getElementById('bookingForm').addEventListener('submit', submitBooking);

    let now = new Date();
    let currentDate = now.toISOString().split("T")[0];
    document.getElementById('date').setAttribute('min', currentDate);
    document.getElementById('date').addEventListener('change', function() {
        let allTimeInputs = document.querySelectorAll('.time-input');
        if (this.value === currentDate) {
            let currentTime = now.toTimeString().split(" ")[0].substring(0, 5);
            allTimeInputs.forEach(timeInput => {
                timeInput.setAttribute('min', currentTime);
            });
        } else {
            allTimeInputs.forEach(timeInput => {
                timeInput.setAttribute('min', '08:00');
                timeInput.setAttribute('max', '18:00');
            });
        }
    });

    function addVehicle() {
        let vehicleContainer = document.getElementById('vehicleContainer');
        vehicleContainer.style.display = 'block'; // Ensure the container is visible
        let vehicleIndex = vehicleContainer.children.length;

        let vehicleTemplate = `
            <div class="vehicle-form" id="vehicle${vehicleIndex}">
                <h4>Vehicle ${vehicleIndex + 1}</h4>
                <div class="form-group">
                    <label for="brand${vehicleIndex}">Vehicle Brand</label>
                    <input type="text" class="form-control" id="brand${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="model${vehicleIndex}">Vehicle Model</label>
                    <input type="text" class="form-control" id="model${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="registration${vehicleIndex}">Vehicle Registration Number</label>
                    <input type="text" class="form-control" id="registration${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="type${vehicleIndex}">Vehicle Type</label>
                    <select class="form-control" id="type${vehicleIndex}" required onchange="calculateAmount(${vehicleIndex})">
                        <option value="">Select Type</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="4x4">4x4</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reason${vehicleIndex}">Reason</label>
                    <select class="form-control" id="reason${vehicleIndex}" required multiple onchange="calculateAmount(${vehicleIndex})">
                        <option value="Polish">Polish</option>
                        <option value="Full wash">Full wash</option>
                        <option value="Engine wash">Engine wash</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="time${vehicleIndex}">Time</label>
                    <input type="time" class="form-control time-input" id="time${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="amount${vehicleIndex}">Total Amount</label>
                    <input type="text" class="form-control amount" id="amount${vehicleIndex}" readonly>
                </div>
            </div>
        `;

        vehicleContainer.insertAdjacentHTML('beforeend', vehicleTemplate);
    }

    window.calculateAmount = function(index) {
        let type = document.getElementById(`type${index}`).value;
        let reasons = document.getElementById(`reason${index}`);
        let amount = 0;

        if (type) {
            for (let option of reasons.options) {
                if (option.selected) {
                    if (option.value === 'Polish') {
                        if (type === 'Hatchback' || type === 'Sedan') amount += 50;
                        else if (type === 'SUV') amount += 70;
                        else if (type === '4x4') amount += 90;
                    } else if (option.value === 'Full wash') {
                        if (type === 'Hatchback') amount += 70;
                        else if (type === 'Sedan') amount += 90;
                        else if (type === 'SUV') amount += 110;
                        else if (type === '4x4') amount += 150;
                    } else if (option.value === 'Engine wash') {
                        if (type === 'Hatchback' || type === 'Sedan') amount += 60;
                        else if (type === 'SUV' || type === '4x4') amount += 70;
                    }
                }
            }
        }

        document.getElementById(`amount${index}`).value = amount;
    }

    function submitBooking(event) {
        event.preventDefault();

        let name = document.getElementById('name').value;
        let phone = document.getElementById('phone').value;
        let date = document.getElementById('date').value;
        let bookingTime = new Date().toLocaleString();

        if (!name || !phone || !date) {
            alert("All fields are required.");
            return;
        }

        let vehicles = [];
        let vehicleForms = document.querySelectorAll('.vehicle-form');
        vehicleForms.forEach((form, index) => {
            let vehicle = {
                brand: document.getElementById(`brand${index}`).value,
                model: document.getElementById(`model${index}`).value,
                registration: document.getElementById(`registration${index}`).value,
                type: document.getElementById(`type${index}`).value,
                reason: Array.from(document.getElementById(`reason${index}`).selectedOptions).map(option => option.value),
                time: document.getElementById(`time${index}`).value,
                amount: document.getElementById(`amount${index}`).value,
            };

            if (!vehicle.brand || !vehicle.model || !vehicle.registration || !vehicle.type || !vehicle.reason.length || !vehicle.time) {
                alert("All vehicle fields are required.");
                return;
            }

            vehicles.push(vehicle);
        });

        let booking = {
            name: name,
            phone: phone,
            date: date,
            bookingTime: bookingTime,
            vehicles: vehicles
        };

        // Store the booking in localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Clear fields after booking
        document.getElementById('bookingForm').reset();
        document.getElementById('vehicleContainer').innerHTML = '';
        document.getElementById('vehicleContainer').style.display = 'none';

        // Show success message
        $('#successModal').modal('show');

        // Refresh the booking summary
        displayBookingSummary();
    }

    function displayBookingSummary() {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        let bookingSummary = document.getElementById('bookingSummary');

        bookingSummary.innerHTML = '';
        bookings.forEach(function(booking, index) {
            let vehiclesSummary = '';
            booking.vehicles.forEach(function(vehicle, vehicleIndex) {
                vehiclesSummary += `
                    <div>
                        <strong>Vehicle ${vehicleIndex + 1}:</strong><br>
                        Brand: ${vehicle.brand} <br>
                        Model: ${vehicle.model} <br>
                        Registration: ${vehicle.registration} <br>
                        Type: ${vehicle.type} <br>
                        Reason: ${vehicle.reason.join(', ')} <br>
                        Time: ${vehicle.time} <br>
                        Amount: R${vehicle.amount} <br>
                    </div><hr>`;
            });

            let summary = `
                <li class="list-group-item">
                    <div style="float: right; font-size: 12px;">${booking.bookingTime}</div>
                    <strong>Name:</strong> ${booking.name} <br>
                    <strong>Phone:</strong> ${booking.phone} <br>
                    <strong>Date:</strong> ${booking.date} <br>
                    ${vehiclesSummary}
                    <button class="btn btn-danger btn-sm" onclick="removeBooking(${index})">Remove</button>
                </li>`;
            
            bookingSummary.innerHTML += summary;
        });
    }

    window.removeBooking = function(index) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookingSummary();
    }

    displayBookingSummary();
});

*/









document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addVehicle').addEventListener('click', addVehicle);
    document.getElementById('bookingForm').addEventListener('submit', submitBooking);

    let errorLabel = document.createElement('label');
    errorLabel.setAttribute('id', 'errorLabel');
    errorLabel.style.color = 'red';
    errorLabel.style.display = 'none';
    document.getElementById('bookingForm').appendChild(errorLabel);

    let now = new Date();
    let currentDate = now.toISOString().split("T")[0];
    document.getElementById('date').setAttribute('min', currentDate);

    document.getElementById('date').addEventListener('change', function() {
        let allTimeInputs = document.querySelectorAll('.time-input');
        if (this.value === currentDate) {
            let currentTime = now.toTimeString().split(" ")[0].substring(0, 5);
            allTimeInputs.forEach(timeInput => {
                timeInput.setAttribute('min', currentTime);
                timeInput.setAttribute('max', '18:00');
            });
        } else {
            allTimeInputs.forEach(timeInput => {
                timeInput.setAttribute('min', '08:00');
                timeInput.setAttribute('max', '18:00');
            });
        }
    });

    function addVehicle() {
        let vehicleContainer = document.getElementById('vehicleContainer');
        vehicleContainer.style.display = 'block';
        let vehicleIndex = vehicleContainer.children.length;

        let vehicleTemplate = `
            <div class="vehicle-form" id="vehicle${vehicleIndex}">
                <h4>Vehicle ${vehicleIndex + 1}</h4>
                <div class="form-group">
                    <label for="brand${vehicleIndex}">Vehicle Brand</label>
                    <input type="text" class="form-control" id="brand${vehicleIndex}" name="brand${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="model${vehicleIndex}">Vehicle Model</label>
                    <input type="text" class="form-control" id="model${vehicleIndex}" name="model${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="registration${vehicleIndex}">Vehicle Registration Number</label>
                    <input type="text" class="form-control" id="registration${vehicleIndex}" name="registration${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="type${vehicleIndex}">Vehicle Type</label>
                    <select class="form-control" id="type${vehicleIndex}" name="type${vehicleIndex}" required onchange="calculateAmount(${vehicleIndex})">
                        <option value="">Select Type</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="4x4">4x4</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Reason</label><br>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="polish${vehicleIndex}" name="reason${vehicleIndex}" value="Polish" onchange="calculateAmount(${vehicleIndex})">
                        <label class="form-check-label" for="polish${vehicleIndex}">Polish</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="fullWash${vehicleIndex}" name="reason${vehicleIndex}" value="Full wash" onchange="calculateAmount(${vehicleIndex})">
                        <label class="form-check-label" for="fullWash${vehicleIndex}">Full wash</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="engineWash${vehicleIndex}" name="reason${vehicleIndex}" value="Engine wash" onchange="calculateAmount(${vehicleIndex})">
                        <label class="form-check-label" for="engineWash${vehicleIndex}">Engine wash</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="time${vehicleIndex}">Time (08:00 - 18:00)</label>
                    <input type="time" class="form-control time-input" id="time${vehicleIndex}" name="time${vehicleIndex}" required>
                </div>
                <div class="form-group">
                    <label for="amount${vehicleIndex}">Total Amount</label>
                    <input type="text" class="form-control amount" id="amount${vehicleIndex}" name="amount${vehicleIndex}" readonly>
                </div>
            </div>
        `;

        vehicleContainer.insertAdjacentHTML('beforeend', vehicleTemplate);
        errorLabel.style.display = 'none';
    }

    window.calculateAmount = function(index) {
        let type = document.getElementById(`type${index}`).value;
        let reasons = document.querySelectorAll(`input[name="reason${index}"]:checked`);
        let amount = 0;

        if (type) {
            reasons.forEach(reason => {
                if (reason.value === 'Polish') {
                    if (type === 'Hatchback' || type === 'Sedan') amount += 50;
                    else if (type === 'SUV') amount += 70;
                    else if (type === '4x4') amount += 90;
                } else if (reason.value === 'Full wash') {
                    if (type === 'Hatchback') amount += 70;
                    else if (type === 'Sedan') amount += 90;
                    else if (type === 'SUV') amount += 110;
                    else if (type === '4x4') amount += 150;
                } else if (reason.value === 'Engine wash') {
                    if (type === 'Hatchback' || type === 'Sedan') amount += 60;
                    else if (type === 'SUV' || type === '4x4') amount += 70;
                }
            });
        }

        document.getElementById(`amount${index}`).value = amount;
    }

    function submitBooking(event) {
        event.preventDefault();

        let name = document.getElementById('name').value;
        let phone = document.getElementById('phone').value;
        let date = document.getElementById('date').value;
        let bookingTime = new Date().toLocaleString();

        let errorLabel = document.getElementById('errorLabel');

        if (!name || !phone || !date) {
            errorLabel.textContent = "All fields are required.";
            errorLabel.style.display = 'block';
            return;
        }

        let vehicleForms = document.querySelectorAll('.vehicle-form');
        if (vehicleForms.length === 0) {
            errorLabel.textContent = "Add at least one vehicle.";
            errorLabel.style.display = 'block';
            return;
        }

        let vehicles = [];
        for (let form of vehicleForms) {
            let vehicle = {
                brand: form.querySelector(`[name^=brand]`).value,
                model: form.querySelector(`[name^=model]`).value,
                registration: form.querySelector(`[name^=registration]`).value,
                type: form.querySelector(`[name^=type]`).value,
                reason: Array.from(form.querySelectorAll(`input[name^=reason]:checked`)).map(option => option.value),
                time: form.querySelector(`[name^=time]`).value,
                amount: form.querySelector(`[name^=amount]`).value,
            };

            if (!vehicle.brand || !vehicle.model || !vehicle.registration || !vehicle.type || !vehicle.reason.length || !vehicle.time) {
                errorLabel.textContent = "All vehicle fields are required.";
                errorLabel.style.display = 'block';
                return;
            }

            vehicles.push(vehicle);
        }

        let booking = {
            name: name,
            phone: phone,
            date: date,
            bookingTime: bookingTime,
            vehicles: vehicles
        };

        // Send booking data to email
        sendEmail(booking);

        // Store the booking in localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Clear fields after booking
        document.getElementById('bookingForm').reset();
        document.getElementById('vehicleContainer').innerHTML = '';
        document.getElementById('vehicleContainer').style.display = 'none';

        // Show success message
        $('#successModal').modal('show');

        // Refresh the booking summary
        displayBookingSummary();
    }

    function sendEmail(booking) {
        const formData = new FormData();

        formData.append('access_key', '47fbf702-b530-439f-8eb6-b5d28beed127');
        formData.append('name', booking.name);
        formData.append('phone', booking.phone);
        formData.append('date', booking.date);
        formData.append('bookingTime', booking.bookingTime);

        booking.vehicles.forEach((vehicle, index) => {
            formData.append(`Vehicle ${index + 1} Brand`, vehicle.brand);
            formData.append(`Vehicle ${index + 1} Model`, vehicle.model);
            formData.append(`Vehicle ${index + 1} Registration`, vehicle.registration);
            formData.append(`Vehicle ${index + 1} Type`, vehicle.type);
            formData.append(`Vehicle ${index + 1} Reason`, vehicle.reason.join(', '));
            formData.append(`Vehicle ${index + 1} Time`, vehicle.time);
            formData.append(`Vehicle ${index + 1} Amount`, vehicle.amount);
        });

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
        })
        .catch(error => {
            console.error(error);
        });
    }

    function displayBookingSummary() {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        let bookingSummary = document.getElementById('bookingSummary');

        bookingSummary.innerHTML = '';
        bookings.forEach(function(booking, index) {
            let vehiclesSummary = '';
            booking.vehicles.forEach(function(vehicle, vehicleIndex) {
                vehiclesSummary += `
                    <div>
                        <strong>Vehicle ${vehicleIndex + 1}:</strong><br>
                        Brand: ${vehicle.brand} <br>
                        Model: ${vehicle.model} <br>
                        Registration: ${vehicle.registration} <br>
                        Type: ${vehicle.type} <br>
                        Reason: ${vehicle.reason.join(', ')} <br>
                        Time: ${vehicle.time} <br>
                        Amount: R${vehicle.amount} <br>
                    </div><hr>`;
            });

            let summary = `
                <li class="list-group-item">
                    <div style="float: right; font-size: 12px;">Booked on: ${booking.bookingTime}</div>
                    <strong>Name:</strong> ${booking.name} <br>
                    <strong>Phone:</strong> ${booking.phone} <br>
                    <strong>Date:</strong> ${booking.date} <br>
                    ${vehiclesSummary}
                    <button class="btn btn-danger btn-sm" onclick="removeBooking(${index})">Remove Booking</button>
                </li>`;
            
            bookingSummary.innerHTML += summary;
        });
    }

    window.removeBooking = function(index) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookingSummary();
    }

    displayBookingSummary();
});


