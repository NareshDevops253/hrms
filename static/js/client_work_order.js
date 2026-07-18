console.log("CLIENT WORK ORDER JS LOADED");

let editId = null;

let allResources = [];

let allCompanies = [];


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Client Work Order Page Loaded");

    loadClientMSA();

    loadCompanies();

    loadResources();

    loadClientWorkOrders();


    const resourceDropdown =
        document.getElementById("resource_name");


    if (resourceDropdown) {

        resourceDropdown.addEventListener(
            "change",
            resourceSelected
        );

    }

    else {

        console.error(
            "resource_name dropdown not found"
        );

    }

});


// ======================================
// LOAD CLIENT MSA
// ======================================

function loadClientMSA() {

    fetch("/client_msa")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Client MSA API Failed"
                );

            }

            return response.json();

        })

        .then(data => {

            const dropdown =
                document.getElementById(
                    "client_msa_id"
                );


            if (!dropdown) {

                return;

            }


            dropdown.innerHTML = `

                <option value="">

                    Select Client MSA

                </option>

            `;


            data.forEach(msa => {

                dropdown.innerHTML += `

                    <option value="${msa.id}">

                        ${msa.msa_number}

                        -

                        ${msa.client_name}

                    </option>

                `;

            });

        })

        .catch(error => {

            console.error(
                "Client MSA Error:",
                error
            );

        });

}


// ======================================
// LOAD COMPANIES
// ======================================

function loadCompanies() {

    console.log(
        "Loading Companies..."
    );


    fetch("/company")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Company API Failed"
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Company Data:",
                data
            );


            allCompanies = data;

        })

        .catch(error => {

            console.error(
                "Company Loading Error:",
                error
            );

        });

}


// ======================================
// LOAD RESOURCES
// ======================================

function loadResources() {

    console.log(
        "Loading Resources..."
    );


    fetch("/resource")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Resource API Failed"
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Resource Data:",
                data
            );


            allResources = data;


            const dropdown =
                document.getElementById(
                    "resource_name"
                );


            if (!dropdown) {

                return;

            }


            dropdown.innerHTML = `

                <option value="">

                    Select Resource

                </option>

            `;


            data.forEach(resource => {

                const fullName = (

                    resource.first_name

                    + " "

                    + resource.last_name

                ).trim();


                const option =
                    document.createElement(
                        "option"
                    );


                // IMPORTANT
                // VALUE = RESOURCE ID

                option.value =
                    resource.resource_id;


                // DISPLAY = RESOURCE NAME

                option.textContent =
                    fullName;


                dropdown.appendChild(
                    option
                );

            });


            console.log(
                "Resources Loaded Successfully"
            );

        })

        .catch(error => {

            console.error(
                "Resource Loading Error:",
                error
            );

        });

}


// ======================================
// RESOURCE SELECTED
// ======================================

function resourceSelected() {

    const resourceId =
        this.value;


    console.log(
        "Selected Resource ID:",
        resourceId
    );


    const companyInput =
        document.getElementById(
            "company_name"
        );


    const resourceTypeInput =
        document.getElementById(
            "resource_type"
        );


    const startDateInput =
        document.getElementById(
            "start_date"
        );


    if (!resourceId) {

        companyInput.value = "";

        resourceTypeInput.value = "";

        startDateInput.value = "";

        return;

    }


    const selectedResource =
        allResources.find(

            resource =>

                String(
                    resource.resource_id
                )

                ===

                String(
                    resourceId
                )

        );


    console.log(
        "Selected Resource:",
        selectedResource
    );


    if (!selectedResource) {

        alert(
            "Selected Resource Not Found"
        );

        return;

    }


    // ======================================
    // COMPANY NAME
    // ======================================

    const selectedCompany =
        allCompanies.find(

            company =>

                String(
                    company.company_id
                )

                ===

                String(
                    selectedResource.company_id
                )

        );


    if (selectedCompany) {

        companyInput.value =
            selectedCompany.company_name;

    }

    else {

        companyInput.value =
            selectedResource.company_name
            || "";

    }


    // ======================================
    // RESOURCE TYPE
    // ======================================

    resourceTypeInput.value =
        selectedResource.resource_type
        || "";


    // ======================================
    // RESOURCE START DATE
    // ======================================

    startDateInput.value =
        formatDate(
            selectedResource.start_date
        );


    console.log(
        "Company:",
        companyInput.value
    );


    console.log(
        "Resource Type:",
        resourceTypeInput.value
    );


    console.log(
        "Resource Start Date:",
        startDateInput.value
    );

}


// ======================================
// DATE FORMAT
// ======================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "";

    }


    if (

        typeof dateValue === "string"

        &&

        dateValue.length === 10

        &&

        dateValue[4] === "-"

        &&

        dateValue[7] === "-"

    ) {

        return dateValue;

    }


    const date =
        new Date(dateValue);


    if (

        isNaN(
            date.getTime()
        )

    ) {

        return "";

    }


    return date

        .toISOString()

        .split("T")[0];

}


// ======================================
// GET SELECTED RESOURCE NAME
// ======================================

function getSelectedResourceName() {

    const dropdown =
        document.getElementById(
            "resource_name"
        );


    if (

        !dropdown

        ||

        dropdown.selectedIndex < 0

    ) {

        return "";

    }


    return dropdown.options[
        dropdown.selectedIndex
    ].text.trim();

}


// ======================================
// GET FORM DATA
// ======================================

function getWorkOrderFormData() {

    const resourceDropdown =
        document.getElementById(
            "resource_name"
        );


    const resourceId =
        resourceDropdown.value;


    const resourceName =
        getSelectedResourceName();


    const data = {

        client_msa_id:

            document.getElementById(
                "client_msa_id"
            ).value,


        work_order_number:

            document.getElementById(
                "work_order_number"
            ).value.trim(),


        // IMPORTANT

        resource_id:

            resourceId,


        resource_name:

            resourceName,


        company_name:

            document.getElementById(
                "company_name"
            ).value.trim(),


        resource_type:

            document.getElementById(
                "resource_type"
            ).value,


        project_name:

            document.getElementById(
                "project_name"
            ).value.trim(),


        start_date:

            document.getElementById(
                "start_date"
            ).value,


        end_date:

            document.getElementById(
                "end_date"
            ).value,


        status:

            document.getElementById(
                "status"
            ).value

    };


    console.log(
        "Sending Data:",
        data
    );


    return data;

}


// ======================================
// VALIDATION
// ======================================

function validateWorkOrder(data) {

    if (!data.client_msa_id) {

        alert(
            "Please Select Client MSA"
        );

        return false;

    }


    if (!data.work_order_number) {

        alert(
            "Please Enter Work Order Number"
        );

        return false;

    }


    if (!data.resource_id) {

        alert(
            "Please Select Resource"
        );

        return false;

    }


    if (!data.resource_name) {

        alert(
            "Resource Name Not Found"
        );

        return false;

    }


    if (!data.company_name) {

        alert(
            "Company Name Not Found"
        );

        return false;

    }


    if (!data.resource_type) {

        alert(
            "Resource Type Not Found"
        );

        return false;

    }


    if (!data.start_date) {

        alert(
            "Work Order Start Date Not Found"
        );

        return false;

    }


    if (!data.end_date) {

        alert(
            "Please Select Work Order End Date"
        );

        return false;

    }


    if (

        data.end_date

        <

        data.start_date

    ) {

        alert(
            "Work Order End Date Cannot Be Before Work Order Start Date"
        );

        return false;

    }


    return true;

}


// ======================================
// SAVE CLIENT WORK ORDER
// ======================================

function saveClientWorkOrder() {

    console.log(
        "SAVE BUTTON CLICKED"
    );


    const data =
        getWorkOrderFormData();


    if (
        !validateWorkOrder(data)
    ) {

        return;

    }


    fetch(

        "/client_work_order",

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(data)

        }

    )


        .then(async response => {

            console.log(
                "Save API Status:",
                response.status
            );


            const result =
                await response.json();


            console.log(
                "Backend Response:",
                result
            );


            if (!response.ok) {

                throw new Error(

                    result.error

                    ||

                    result.message

                    ||

                    JSON.stringify(result)

                );

            }


            return result;

        })


        .then(result => {

            alert(

                result.message

                ||

                "Client Work Order Saved Successfully"

            );


            clearForm();


            loadClientWorkOrders();

        })


        .catch(error => {

            console.error(
                "SAVE ERROR:",
                error
            );


            alert(

                "SAVE ERROR:\n\n"

                +

                error.message

            );

        });

}


// ======================================
// LOAD WORK ORDERS
// ======================================

function loadClientWorkOrders() {

    fetch(
        "/client_work_order"
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Work Order API Failed"
                );

            }

            return response.json();

        })

        .then(data => {

            const tableBody =
                document.getElementById(
                    "workOrderTableBody"
                );


            if (!tableBody) {

                return;

            }


            tableBody.innerHTML = "";


            data.forEach(order => {

                tableBody.innerHTML += `

                    <tr>

                        <td>
                            ${order.id || ""}
                        </td>

                        <td>
                            ${order.msa_number || ""}
                        </td>

                        <td>
                            ${order.work_order_number || ""}
                        </td>

                        <td>
                            ${order.company_name || ""}
                        </td>

                        <td>
                            ${order.resource_name || ""}
                        </td>

                        <td>
                            ${order.resource_type || ""}
                        </td>

                        <td>
                            ${order.project_name || ""}
                        </td>

                        <td>
                            ${formatDate(
                                order.start_date
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                order.end_date
                            )}
                        </td>

                        <td>
                            ${order.status || ""}
                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                onclick="editClientWorkOrder(${order.id})"
                            >
                                Edit
                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteClientWorkOrder(${order.id})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            });

        })

        .catch(error => {

            console.error(
                "Load Work Order Error:",
                error
            );

        });

}


// ======================================
// EDIT CLIENT WORK ORDER
// ======================================

function editClientWorkOrder(id) {

    fetch(
        `/client_work_order/${id}`
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed To Load Work Order"
                );

            }

            return response.json();

        })

        .then(order => {

            editId = id;


            document.getElementById(
                "client_msa_id"
            ).value =
                order.client_msa_id;


            document.getElementById(
                "work_order_number"
            ).value =
                order.work_order_number;


            const resourceDropdown =
                document.getElementById(
                    "resource_name"
                );


            const selectedOption =
                Array.from(
                    resourceDropdown.options
                ).find(

                    option =>

                        option.text.trim()

                        ===

                        order.resource_name

                );


            if (selectedOption) {

                resourceDropdown.value =
                    selectedOption.value;


                resourceDropdown.dispatchEvent(
                    new Event("change")
                );

            }


            document.getElementById(
                "project_name"
            ).value =
                order.project_name || "";


            document.getElementById(
                "end_date"
            ).value =
                formatDate(
                    order.end_date
                );


            document.getElementById(
                "status"
            ).value =
                order.status;


            document.getElementById(
                "saveBtn"
            ).style.display =
                "none";


            document.getElementById(
                "updateBtn"
            ).style.display =
                "inline-block";

        })

        .catch(error => {

            console.error(
                "Edit Error:",
                error
            );


            alert(
                error.message
            );

        });

}


// ======================================
// UPDATE CLIENT WORK ORDER
// ======================================

function updateClientWorkOrder() {

    if (!editId) {

        alert(
            "Please Select Work Order To Update"
        );

        return;

    }


    const data =
        getWorkOrderFormData();


    console.log(
        "Update Data:",
        data
    );


    if (
        !validateWorkOrder(data)
    ) {

        return;

    }


    fetch(

        `/client_work_order/${editId}`,

        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(data)

        }

    )

        .then(async response => {

            console.log(
                "Update API Status:",
                response.status
            );


            const result =
                await response.json();


            console.log(
                "Update Backend Response:",
                result
            );


            if (!response.ok) {

                throw new Error(

                    result.error

                    ||

                    result.message

                    ||

                    JSON.stringify(result)

                );

            }


            return result;

        })


        .then(result => {

            alert(

                result.message

                ||

                "Client Work Order Updated Successfully"

            );


            clearForm();


            loadClientWorkOrders();

        })


        .catch(error => {

            console.error(
                "UPDATE ERROR:",
                error
            );


            alert(

                "UPDATE ERROR:\n\n"

                +

                error.message

            );

        });

}


// ======================================
// DELETE CLIENT WORK ORDER
// ======================================

function deleteClientWorkOrder(id) {

    if (

        !confirm(
            "Are you sure you want to delete?"
        )

    ) {

        return;

    }


    fetch(

        `/client_work_order/${id}`,

        {

            method: "DELETE"

        }

    )

        .then(async response => {

            console.log(
                "Delete API Status:",
                response.status
            );


            const result =
                await response.json();


            console.log(
                "Delete Backend Response:",
                result
            );


            if (!response.ok) {

                throw new Error(

                    result.error

                    ||

                    result.message

                    ||

                    JSON.stringify(result)

                );

            }


            return result;

        })


        .then(result => {

            alert(

                result.message

                ||

                "Client Work Order Deleted Successfully"

            );


            loadClientWorkOrders();

        })


        .catch(error => {

            console.error(
                "DELETE ERROR:",
                error
            );


            alert(

                "DELETE ERROR:\n\n"

                +

                error.message

            );

        });

}


// ======================================
// CLEAR FORM
// ======================================

function clearForm() {

    editId = null;


    document.getElementById(
        "client_msa_id"
    ).value = "";


    document.getElementById(
        "work_order_number"
    ).value = "";


    document.getElementById(
        "resource_name"
    ).value = "";


    document.getElementById(
        "company_name"
    ).value = "";


    document.getElementById(
        "resource_type"
    ).value = "";


    document.getElementById(
        "start_date"
    ).value = "";


    document.getElementById(
        "project_name"
    ).value = "";


    document.getElementById(
        "end_date"
    ).value = "";


    document.getElementById(
        "status"
    ).value = "Active";


    document.getElementById(
        "saveBtn"
    ).style.display =
        "inline-block";


    document.getElementById(
        "updateBtn"
    ).style.display =
        "none";

}