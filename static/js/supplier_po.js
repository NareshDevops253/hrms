console.log("Supplier PO JS Loaded");


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {


    console.log("Supplier PO Page Loaded");


    loadSupplierMSA();


    loadResources();


    loadSupplierPO();


    const resourceDropdown =

        document.getElementById("resource_id");


    if (resourceDropdown) {


        resourceDropdown.addEventListener(

            "change",

            function () {


                const selectedOption =

                    this.options[this.selectedIndex];


                // AUTO POPULATE RESOURCE TYPE

                document.getElementById(

                    "resource_type"

                ).value =

                    selectedOption.dataset.type || "";


                // AUTO POPULATE RESOURCE START DATE

                const resourceStartDate =

                    selectedOption.dataset.startDate || "";


                if (resourceStartDate) {


                    document.getElementById(

                        "start_date"

                    ).value =

                        formatDate(resourceStartDate);


                }


            }

        );


    }


});


// ==========================================
// LOAD SUPPLIER MSA
// ==========================================

function loadSupplierMSA() {


    fetch("/supplier_msa_active")


        .then(response => {


            if (!response.ok) {


                throw new Error(

                    "Supplier MSA API Error"

                );


            }


            return response.json();


        })


        .then(data => {


            console.log(

                "Supplier MSA Data:",

                data

            );


            const dropdown =

                document.getElementById(

                    "supplier_msa_id"

                );


            dropdown.innerHTML =

                '<option value="">Select Supplier MSA</option>';


            data.forEach(msa => {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value = msa.id;


                option.textContent =

                    msa.supplier_name

                    +

                    " - "

                    +

                    msa.msa_number;


                dropdown.appendChild(option);


            });


        })


        .catch(error => {


            console.error(

                "Supplier MSA Error:",

                error

            );


        });


}


// ==========================================
// LOAD C2C RESOURCES
// ==========================================

function loadResources() {


    fetch("/supplier_po_resources")


        .then(response => {


            if (!response.ok) {


                throw new Error(

                    "Resource API Error"

                );


            }


            return response.json();


        })


        .then(data => {


            console.log(

                "Resource Data:",

                data

            );


            const dropdown =

                document.getElementById(

                    "resource_id"

                );


            dropdown.innerHTML =

                '<option value="">Select Resource</option>';


            data.forEach(resource => {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value =

                    resource.resource_id;


                option.textContent =

                    resource.first_name

                    +

                    " "

                    +

                    resource.last_name

                    +

                    " - "

                    +

                    resource.resource_type;


                // RESOURCE TYPE

                option.dataset.type =

                    resource.resource_type || "";


                // RESOURCE START DATE

                option.dataset.startDate =

                    resource.start_date || "";


                dropdown.appendChild(option);


            });


        })


        .catch(error => {


            console.error(

                "Resource Error:",

                error

            );


        });


}


// ==========================================
// SAVE SUPPLIER PO
// ==========================================

function saveSupplierPO() {


    const supplierMsaId =

        document.getElementById(

            "supplier_msa_id"

        ).value;


    const resourceId =

        document.getElementById(

            "resource_id"

        ).value;


    const startDate =

        document.getElementById(

            "start_date"

        ).value;


    const endDate =

        document.getElementById(

            "end_date"

        ).value;


    const data = {


        supplier_msa_id:

            supplierMsaId,


        resource_id:

            resourceId,


        po_number:

            document.getElementById(

                "po_number"

            ).value.trim(),


        project_name:

            document.getElementById(

                "project_name"

            ).value.trim(),


        start_date:

            startDate,


        end_date:

            endDate,


        amount:

            document.getElementById(

                "amount"

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


    // ======================================
    // VALIDATION
    // ======================================


    if (!supplierMsaId) {


        alert(

            "Please select Supplier MSA"

        );


        return;


    }


    if (!resourceId) {


        alert(

            "Please select Resource"

        );


        return;


    }


    if (!startDate) {


        alert(

            "Start Date is required"

        );


        return;


    }


    if (!endDate) {


        alert(

            "End Date is required"

        );


        return;


    }


    // ======================================
    // SAVE API
    // ======================================


    fetch("/supplier_po", {


        method: "POST",


        headers: {


            "Content-Type":

                "application/json"


        },


        body: JSON.stringify(data)


    })


        .then(response => {


            return response.json();


        })


        .then(result => {


            alert(result.message);


            if (

                result.message ===

                "Supplier PO Saved Successfully"

            ) {


                clearForm();


                loadSupplierPO();


            }


        })


        .catch(error => {


            console.error(

                "Save Error:",

                error

            );


        });


}


// ==========================================
// LOAD SUPPLIER PO
// ==========================================

function loadSupplierPO() {


    fetch("/supplier_po")


        .then(response => {


            if (!response.ok) {


                throw new Error(

                    "Supplier PO API Error"

                );


            }


            return response.json();


        })


        .then(data => {


            const table =

                document.getElementById(

                    "supplier_po_table"

                );


            table.innerHTML = "";


            data.forEach(po => {


                table.innerHTML += `

                    <tr>

                        <td>

                            ${po.id || ""}

                        </td>


                        <td>

                            ${po.supplier_name || ""}

                            -

                            ${po.msa_number || ""}

                        </td>


                        <td>

                            ${po.resource_name || ""}

                        </td>


                        <td>

                            ${po.resource_type || ""}

                        </td>


                        <td>

                            ${po.po_number || ""}

                        </td>


                        <td>

                            ${po.project_name || ""}

                        </td>


                        <td>

                            ${po.amount || ""}

                        </td>


                        <td>

                            ${po.status || ""}

                        </td>


                        <td>


                            <button

                                onclick="deleteSupplierPO(${po.id})"

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

                "Load Supplier PO Error:",

                error

            );


        });


}


// ==========================================
// DELETE SUPPLIER PO
// ==========================================

function deleteSupplierPO(id) {


    if (

        !confirm(

            "Are you sure you want to delete this Supplier PO?"

        )

    ) {


        return;


    }


    fetch(

        "/supplier_po/" + id,

        {


            method: "DELETE"


        }

    )


        .then(response => {


            return response.json();


        })


        .then(result => {


            alert(result.message);


            loadSupplierPO();


        })


        .catch(error => {


            console.error(

                "Delete Error:",

                error

            );


        });


}


// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {


    document.getElementById(

        "supplier_msa_id"

    ).value = "";


    document.getElementById(

        "resource_id"

    ).value = "";


    document.getElementById(

        "resource_type"

    ).value = "";


    document.getElementById(

        "po_number"

    ).value = "";


    document.getElementById(

        "project_name"

    ).value = "";


    document.getElementById(

        "start_date"

    ).value = "";


    document.getElementById(

        "end_date"

    ).value = "";


    document.getElementById(

        "amount"

    ).value = "";


    document.getElementById(

        "status"

    ).value = "Active";


}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {


    if (!date) {


        return "";


    }


    // If already YYYY-MM-DD

    if (

        /^\d{4}-\d{2}-\d{2}$/.test(date)

    ) {


        return date;


    }


    // Convert:

    // Thu, 02 Apr 2026 00:00:00 GMT

    // To:

    // 2026-04-02


    const parsedDate =

        new Date(date);


    if (

        isNaN(parsedDate.getTime())

    ) {


        return "";


    }


    const year =

        parsedDate.getUTCFullYear();


    const month =

        String(

            parsedDate.getUTCMonth() + 1

        ).padStart(2, "0");


    const day =

        String(

            parsedDate.getUTCDate()

        ).padStart(2, "0");


    return (

        year

        +

        "-"

        +

        month

        +

        "-"

        +

        day

    );


}