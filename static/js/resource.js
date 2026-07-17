alert("JavaScript Loaded");
// Load Company Dropdown
// Load Companies
function loadCompanies() {

    fetch("/company")
    .then(response => response.json())
    .then(data => {

        let companyDropdown = document.getElementById("company_id");

        companyDropdown.innerHTML = '<option value="">Select Company</option>';

        data.forEach(company => {

            companyDropdown.innerHTML += `
                <option value="${company.company_id}">
                    ${company.company_name}
                </option>
            `;
        });

    });
}


// Save Resource
function saveResource() {

    let employee_id = document.getElementById("employee_id").value.trim();
    let first_name = document.getElementById("first_name").value.trim();
    let last_name = document.getElementById("last_name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let designation = document.getElementById("designation").value.trim();
    let company_name = document.getElementById("company_name").value.trim();
    let resource_type = document.getElementById("resource_type").value;
    let company_id = document.getElementById("company_id").value;
    let status = document.getElementById("status").value;

    // Validation
    if (employee_id === "") {
        alert("Employee ID is required");
        return;
    }

    if (first_name === "") {
        alert("First Name is required");
        return;
    }

    if (last_name === "") {
        alert("Last Name is required");
        return;
    }

    if (email === "") {
        alert("Email is required");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits");
        return;
    }

    if (designation === "") {
        alert("Designation is required");
        return;
    }
    if (company_name === "") {
        alert("Company Name is required");
        return;
    }
    if (resource_type === "") {
        alert("Please select a resource type");
        return;
    }

    if (company_id === "") {
        alert("Please select Company");
        return;
    }

    fetch("/resource", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            employee_id,
            first_name,
            last_name,
            email,
            phone,
            designation,
            company_name,
            resource_type,
            company_id,
            status
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}


// Update Resource
function updateResource() {

    let resource_id = document.getElementById("resource_id").value;

    let employee_id = document.getElementById("employee_id").value.trim();
    let first_name = document.getElementById("first_name").value.trim();
    let last_name = document.getElementById("last_name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let designation = document.getElementById("designation").value.trim();
    let company_name = document.getElementById("company_name").value.trim();
    let resource_type = document.getElementById("resource_type").value;
    let company_id = document.getElementById("company_id").value;
    let status = document.getElementById("status").value;

    if (!resource_id) {
        alert("Resource ID is required");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits");
        return;
    }

    fetch(`/resource/${resource_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            employee_id,
            first_name,
            last_name,
            email,
            phone,
            designation,
            company_name,
            resource_type,
            company_id,
            status
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}


// Load Companies
window.onload = function () {
    loadCompanies();
};