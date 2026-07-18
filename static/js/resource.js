alert("RESOURCE JAVASCRIPT LOADED");


// ==========================================
// PAGE LOAD
// ==========================================

window.onload = function () {


    console.log(

        "Resource Page Loaded"

    );


    loadCompanies();

};


// ==========================================
// LOAD COMPANIES
// ==========================================

function loadCompanies() {


    console.log(

        "Loading Companies..."

    );


    const companyDropdown =

        document.getElementById(

            "company_id"

        );


    if (!companyDropdown) {


        console.error(

            "company_id dropdown not found"

        );


        return;

    }


    fetch("/company")


        .then(response => {


            console.log(

                "Company API Status:",

                response.status

            );


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


            companyDropdown.innerHTML = `

                <option value="">

                    Select Company

                </option>

            `;


            data.forEach(company => {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value =

                    company.company_id;


                option.textContent =

                    company.company_name;


                companyDropdown.appendChild(

                    option

                );

            });


            console.log(

                "Companies Loaded Successfully"

            );

        })


        .catch(error => {


            console.error(

                "Error loading companies:",

                error

            );


            alert(

                "Companies could not be loaded"

            );

        });

}


// ==========================================
// SAVE RESOURCE
// ==========================================

function saveResource() {


    const employee_id =

        document.getElementById(

            "employee_id"

        ).value.trim();


    const first_name =

        document.getElementById(

            "first_name"

        ).value.trim();


    const last_name =

        document.getElementById(

            "last_name"

        ).value.trim();


    const email =

        document.getElementById(

            "email"

        ).value.trim();


    const phone =

        document.getElementById(

            "phone"

        ).value.trim();


    const designation =

        document.getElementById(

            "designation"

        ).value.trim();


    const company_name =

        document.getElementById(

            "company_name"

        ).value.trim();


    const resource_type =

        document.getElementById(

            "resource_type"

        ).value;


    const company_id =

        document.getElementById(

            "company_id"

        ).value;


    const status =

        document.getElementById(

            "status"

        ).value;


    const start_date =

        document.getElementById(

            "start_date"

        ).value;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!employee_id) {


        alert(

            "Employee ID is required"

        );


        return;

    }


    if (!first_name) {


        alert(

            "First Name is required"

        );


        return;

    }


    if (!last_name) {


        alert(

            "Last Name is required"

        );


        return;

    }


    if (!email) {


        alert(

            "Email is required"

        );


        return;

    }


    if (

        !/^[0-9]{10}$/.test(

            phone

        )

    ) {


        alert(

            "Phone number must be exactly 10 digits"

        );


        return;

    }


    if (!designation) {


        alert(

            "Designation is required"

        );


        return;

    }


    if (!company_name) {


        alert(

            "Company Name is required"

        );


        return;

    }


    if (!resource_type) {


        alert(

            "Please select Resource Type"

        );


        return;

    }


    if (!company_id) {


        alert(

            "Please select Company"

        );


        return;

    }


    if (!status) {


        alert(

            "Please select Status"

        );


        return;

    }


    if (!start_date) {


        alert(

            "Start Date is required"

        );


        return;

    }


    const data = {


        employee_id:

            employee_id,


        first_name:

            first_name,


        last_name:

            last_name,


        email:

            email,


        phone:

            phone,


        designation:

            designation,


        company_name:

            company_name,


        resource_type:

            resource_type,


        company_id:

            company_id,


        status:

            status,


        start_date:

            start_date

    };


    console.log(

        "Saving Resource:",

        data

    );


    fetch(

        "/resource",

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


        .then(response => {


            return response.json();

        })


        .then(result => {


            console.log(

                "Save Response:",

                result

            );


            if (result.error) {


                alert(

                    result.error

                );


                return;

            }


            alert(

                result.message

                ||

                "Resource Saved Successfully"

            );


            location.reload();

        })


        .catch(error => {


            console.error(

                "Save Error:",

                error

            );


            alert(

                "Error Saving Resource"

            );

        });

}


// ==========================================
// UPDATE RESOURCE
// ==========================================

function updateResource() {


    const resource_id =

        document.getElementById(

            "resource_id"

        ).value;


    const employee_id =

        document.getElementById(

            "employee_id"

        ).value.trim();


    const first_name =

        document.getElementById(

            "first_name"

        ).value.trim();


    const last_name =

        document.getElementById(

            "last_name"

        ).value.trim();


    const email =

        document.getElementById(

            "email"

        ).value.trim();


    const phone =

        document.getElementById(

            "phone"

        ).value.trim();


    const designation =

        document.getElementById(

            "designation"

        ).value.trim();


    const company_name =

        document.getElementById(

            "company_name"

        ).value.trim();


    const resource_type =

        document.getElementById(

            "resource_type"

        ).value;


    const company_id =

        document.getElementById(

            "company_id"

        ).value;


    const status =

        document.getElementById(

            "status"

        ).value;


    const start_date =

        document.getElementById(

            "start_date"

        ).value;


    if (!resource_id) {


        alert(

            "Resource ID is required"

        );


        return;

    }


    if (!employee_id) {


        alert(

            "Employee ID is required"

        );


        return;

    }


    if (!first_name) {


        alert(

            "First Name is required"

        );


        return;

    }


    if (!last_name) {


        alert(

            "Last Name is required"

        );


        return;

    }


    if (!email) {


        alert(

            "Email is required"

        );


        return;

    }


    if (

        !/^[0-9]{10}$/.test(

            phone

        )

    ) {


        alert(

            "Phone number must be exactly 10 digits"

        );


        return;

    }


    if (!designation) {


        alert(

            "Designation is required"

        );


        return;

    }


    if (!company_name) {


        alert(

            "Company Name is required"

        );


        return;

    }


    if (!resource_type) {


        alert(

            "Resource Type is required"

        );


        return;

    }


    if (!company_id) {


        alert(

            "Company is required"

        );


        return;

    }


    if (!status) {


        alert(

            "Status is required"

        );


        return;

    }


    if (!start_date) {


        alert(

            "Start Date is required"

        );


        return;

    }


    const data = {


        employee_id:

            employee_id,


        first_name:

            first_name,


        last_name:

            last_name,


        email:

            email,


        phone:

            phone,


        designation:

            designation,


        company_name:

            company_name,


        resource_type:

            resource_type,


        company_id:

            company_id,


        status:

            status,


        start_date:

            start_date

    };


    fetch(

        `/resource/${resource_id}`,

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


        .then(response => {


            return response.json();

        })


        .then(result => {


            if (result.error) {


                alert(

                    result.error

                );


                return;

            }


            alert(

                result.message

                ||

                "Resource Updated Successfully"

            );


            location.reload();

        })


        .catch(error => {


            console.error(

                "Update Error:",

                error

            );


            alert(

                "Error Updating Resource"

            );

        });

}