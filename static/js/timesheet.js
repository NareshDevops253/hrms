console.log("TIMESHEET JS LOADED");


let editId = null;


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    function () {


        console.log(

            "Timesheet Page Loaded"

        );


        loadResources();


        loadTimesheets();


        addHourListeners();


        document

            .getElementById(

                "saveDraftBtn"

            )

            .addEventListener(

                "click",

                function () {


                    saveTimesheet(

                        "Draft"

                    );


                }

            );


        document

            .getElementById(

                "submitBtn"

            )

            .addEventListener(

                "click",

                function () {


                    saveTimesheet(

                        "Submitted"

                    );


                }

            );


        document

            .getElementById(

                "cancelBtn"

            )

            .addEventListener(

                "click",

                resetForm

            );


        calculateTotalHours();


    }

);


// ==========================================
// LOAD RESOURCES
// ==========================================

function loadResources() {


    fetch(

        "/resource"

    )


        .then(

            response => {


                if (

                    !response.ok

                ) {


                    throw new Error(

                        "Resource API failed"

                    );


                }


                return response.json();


            }

        )


        .then(

            data => {


                console.log(

                    "Resources:",

                    data

                );


                const dropdown =

                    document

                        .getElementById(

                            "resource_id"

                        );


                dropdown.innerHTML = `

                    <option value="">

                        Select Resource

                    </option>

                `;


                data.forEach(

                    resource => {


                        const option =

                            document

                                .createElement(

                                    "option"

                                );


                        option.value =

                            resource.resource_id;


                        option.textContent =

                            resource.first_name +

                            " " +

                            resource.last_name;


                        dropdown.appendChild(

                            option

                        );


                    }

                );


            }

        )


        .catch(

            error => {


                console.error(

                    "Load Resources Error:",

                    error

                );


                alert(

                    "Unable to load resources"

                );


            }

        );


}


// ==========================================
// HOUR INPUT LISTENERS
// ==========================================

function addHourListeners() {


    const hourFields = [


        "monday_hours",

        "tuesday_hours",

        "wednesday_hours",

        "thursday_hours",

        "friday_hours",

        "saturday_hours",

        "sunday_hours"


    ];


    hourFields.forEach(

        fieldId => {


            document

                .getElementById(

                    fieldId

                )

                .addEventListener(

                    "input",

                    calculateTotalHours

                );


        }

    );


}


// ==========================================
// CALCULATE TOTAL HOURS
// ==========================================

function calculateTotalHours() {


    const hourFields = [


        "monday_hours",

        "tuesday_hours",

        "wednesday_hours",

        "thursday_hours",

        "friday_hours",

        "saturday_hours",

        "sunday_hours"


    ];


    let total = 0;


    hourFields.forEach(

        fieldId => {


            const value =

                parseFloat(

                    document

                        .getElementById(

                            fieldId

                        )

                        .value

                ) || 0;


            total += value;


        }

    );


    document

        .getElementById(

            "total_hours"

        )

        .value =

        total.toFixed(2);


}


// ==========================================
// GET HOURS
// ==========================================

function getHours(fieldId) {


    return parseFloat(

        document

            .getElementById(

                fieldId

            )

            .value

    ) || 0;


}


// ==========================================
// SAVE TIMESHEET
// ==========================================

function saveTimesheet(status) {


    const resourceId =

        document

            .getElementById(

                "resource_id"

            )

            .value;


    const projectName =

        document

            .getElementById(

                "project_name"

            )

            .value

            .trim();


    const weekStartDate =

        document

            .getElementById(

                "week_start_date"

            )

            .value;


    const weekEndDate =

        document

            .getElementById(

                "week_end_date"

            )

            .value;


    // ==========================================
    // VALIDATION
    // ==========================================


    if (

        !resourceId

    ) {


        alert(

            "Please select resource"

        );


        return;

    }


    if (

        !projectName

    ) {


        alert(

            "Please enter project name"

        );


        return;

    }


    if (

        !weekStartDate

    ) {


        alert(

            "Please select week start date"

        );


        return;

    }


    if (

        !weekEndDate

    ) {


        alert(

            "Please select week end date"

        );


        return;

    }


    if (

        weekStartDate >

        weekEndDate

    ) {


        alert(

            "Week start date cannot be greater than week end date"

        );


        return;

    }


    const data = {


        resource_id:

            parseInt(

                resourceId

            ),


        project_name:

            projectName,


        week_start_date:

            weekStartDate,


        week_end_date:

            weekEndDate,


        monday_hours:

            getHours(

                "monday_hours"

            ),


        tuesday_hours:

            getHours(

                "tuesday_hours"

            ),


        wednesday_hours:

            getHours(

                "wednesday_hours"

            ),


        thursday_hours:

            getHours(

                "thursday_hours"

            ),


        friday_hours:

            getHours(

                "friday_hours"

            ),


        saturday_hours:

            getHours(

                "saturday_hours"

            ),


        sunday_hours:

            getHours(

                "sunday_hours"

            ),


        description:

            document

                .getElementById(

                    "description"

                )

                .value

                .trim(),


        status:

            status


    };


    let url =

        "/timesheet";


    let method =

        "POST";


    if (

        editId !== null

    ) {


        url =

            `/timesheet/${editId}`;


        method =

            "PUT";


    }


    console.log(

        "Sending Data:",

        data

    );


    fetch(

        url,

        {


            method:

                method,


            headers: {


                "Content-Type":

                    "application/json"


            },


            body:

                JSON.stringify(

                    data

                )


        }

    )


        .then(

            response => {


                return response

                    .json()

                    .then(

                        result => {


                            return {


                                status:

                                    response.status,


                                data:

                                    result


                            };


                        }

                    );


            }

        )


        .then(

            result => {


                console.log(

                    "Server Response:",

                    result

                );


                if (

                    result.status >= 200 &&

                    result.status < 300

                ) {


                    alert(

                        result.data.message ||

                        "Timesheet saved successfully"

                    );


                    resetForm();


                    loadTimesheets();


                }

                else {


                    alert(

                        result.data.error ||

                        "Something went wrong"

                    );


                }


            }

        )


        .catch(

            error => {


                console.error(

                    "Save Timesheet Error:",

                    error

                );


                alert(

                    "Server error"

                );


            }

        );


}


// ==========================================
// LOAD ALL TIMESHEETS
// ==========================================

function loadTimesheets() {


    fetch(

        "/timesheet"

    )


        .then(

            response => {


                if (

                    !response.ok

                ) {


                    throw new Error(

                        "Timesheet API failed"

                    );


                }


                return response.json();


            }

        )


        .then(

            data => {


                console.log(

                    "Timesheets:",

                    data

                );


                const tableBody =

                    document

                        .getElementById(

                            "timesheetTableBody"

                        );


                tableBody.innerHTML = "";


                if (

                    data.length === 0

                ) {


                    tableBody.innerHTML = `

                        <tr>

                            <td colspan="8">

                                No timesheets found

                            </td>

                        </tr>

                    `;


                    return;

                }


                data.forEach(

                    timesheet => {


                        const row =

                            document

                                .createElement(

                                    "tr"

                                );


                        const statusClass =

                            timesheet.status ===

                            "Submitted"


                                ?

                            "status-submitted"


                                :

                            "status-draft";


                        let actions = "";


                        if (

                            timesheet.status ===

                            "Draft"

                        ) {


                            actions = `

                                <button

                                    class="action-btn edit-btn"

                                    onclick="editTimesheet(

                                        ${timesheet.timesheet_id}

                                    )"

                                >

                                    Edit

                                </button>


                                <button

                                    class="action-btn delete-btn"

                                    onclick="deleteTimesheet(

                                        ${timesheet.timesheet_id}

                                    )"

                                >

                                    Delete

                                </button>


                                <button

                                    class="action-btn submit-action-btn"

                                    onclick="submitTimesheet(

                                        ${timesheet.timesheet_id}

                                    )"

                                >

                                    Submit

                                </button>

                            `;


                        }

                        else {


                            actions = `

                                <span>

                                    Locked

                                </span>

                            `;


                        }


                        row.innerHTML = `

                            <td>

                                ${timesheet.timesheet_id}

                            </td>


                            <td>

                                ${

                                    timesheet.resource_name

                                    || "-"

                                }

                            </td>


                            <td>

                                ${

                                    timesheet.project_name

                                    || "-"

                                }

                            </td>


                            <td>

                                ${

                                    formatDate(

                                        timesheet.week_start_date

                                    )

                                }

                            </td>


                            <td>

                                ${

                                    formatDate(

                                        timesheet.week_end_date

                                    )

                                }

                            </td>


                            <td>

                                ${

                                    timesheet.total_hours

                                    || 0

                                }

                            </td>


                            <td>


                                <span

                                    class="status ${statusClass}"

                                >

                                    ${

                                        timesheet.status

                                    }

                                </span>


                            </td>


                            <td>

                                ${actions}

                            </td>

                        `;


                        tableBody.appendChild(

                            row

                        );


                    }

                );


            }

        )


        .catch(

            error => {


                console.error(

                    "Load Timesheets Error:",

                    error

                );


                alert(

                    "Unable to load timesheets"

                );


            }

        );


}


// ==========================================
// EDIT TIMESHEET
// ==========================================

function editTimesheet(id) {


    fetch(

        `/timesheet/${id}`

    )


        .then(

            response => {


                if (

                    !response.ok

                ) {


                    throw new Error(

                        "Timesheet not found"

                    );


                }


                return response.json();


            }

        )


        .then(

            data => {


                if (

                    data.status ===

                    "Submitted"

                ) {


                    alert(

                        "Submitted timesheet cannot be edited"

                    );


                    return;

                }


                editId = id;


                document

                    .getElementById(

                        "formTitle"

                    )

                    .textContent =

                    "Edit Timesheet";


                document

                    .getElementById(

                        "resource_id"

                    )

                    .value =

                    data.resource_id;


                document

                    .getElementById(

                        "project_name"

                    )

                    .value =

                    data.project_name || "";


                document

                    .getElementById(

                        "week_start_date"

                    )

                    .value =

                    formatDateForInput(

                        data.week_start_date

                    );


                document

                    .getElementById(

                        "week_end_date"

                    )

                    .value =

                    formatDateForInput(

                        data.week_end_date

                    );


                document

                    .getElementById(

                        "monday_hours"

                    )

                    .value =

                    data.monday_hours || 0;


                document

                    .getElementById(

                        "tuesday_hours"

                    )

                    .value =

                    data.tuesday_hours || 0;


                document

                    .getElementById(

                        "wednesday_hours"

                    )

                    .value =

                    data.wednesday_hours || 0;


                document

                    .getElementById(

                        "thursday_hours"

                    )

                    .value =

                    data.thursday_hours || 0;


                document

                    .getElementById(

                        "friday_hours"

                    )

                    .value =

                    data.friday_hours || 0;


                document

                    .getElementById(

                        "saturday_hours"

                    )

                    .value =

                    data.saturday_hours || 0;


                document

                    .getElementById(

                        "sunday_hours"

                    )

                    .value =

                    data.sunday_hours || 0;


                document

                    .getElementById(

                        "description"

                    )

                    .value =

                    data.description || "";


                calculateTotalHours();


                window.scrollTo(

                    {

                        top: 0,

                        behavior: "smooth"

                    }

                );


            }

        )


        .catch(

            error => {


                console.error(

                    "Edit Timesheet Error:",

                    error

                );


                alert(

                    "Unable to load timesheet"

                );


            }

        );


}


// ==========================================
// DELETE TIMESHEET
// ==========================================

function deleteTimesheet(id) {


    const confirmDelete =

        confirm(

            "Are you sure you want to delete this timesheet?"

        );


    if (

        !confirmDelete

    ) {


        return;

    }


    fetch(

        `/timesheet/${id}`,

        {


            method:

                "DELETE"


        }

    )


        .then(

            response => {


                return response

                    .json()

                    .then(

                        result => {


                            return {


                                status:

                                    response.status,


                                data:

                                    result


                            };


                        }

                    );


            }

        )


        .then(

            result => {


                if (

                    result.status >= 200 &&

                    result.status < 300

                ) {


                    alert(

                        result.data.message

                    );


                    loadTimesheets();


                }

                else {


                    alert(

                        result.data.error ||

                        "Unable to delete timesheet"

                    );


                }


            }

        )


        .catch(

            error => {


                console.error(

                    "Delete Error:",

                    error

                );


                alert(

                    "Server error"

                );


            }

        );


}


// ==========================================
// SUBMIT TIMESHEET
// ==========================================

function submitTimesheet(id) {


    const confirmSubmit =

        confirm(

            "Are you sure you want to submit this timesheet?"

        );


    if (

        !confirmSubmit

    ) {


        return;

    }


    fetch(

        `/timesheet/${id}/submit`,

        {


            method:

                "PUT"


        }

    )


        .then(

            response => {


                return response

                    .json()

                    .then(

                        result => {


                            return {


                                status:

                                    response.status,


                                data:

                                    result


                            };


                        }

                    );


            }

        )


        .then(

            result => {


                if (

                    result.status >= 200 &&

                    result.status < 300

                ) {


                    alert(

                        result.data.message

                    );


                    loadTimesheets();


                }

                else {


                    alert(

                        result.data.error ||

                        "Unable to submit timesheet"

                    );


                }


            }

        )


        .catch(

            error => {


                console.error(

                    "Submit Error:",

                    error

                );


                alert(

                    "Server error"

                );


            }

        );


}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {


    document

        .getElementById(

            "timesheetForm"

        )

        .reset();


    editId = null;


    document

        .getElementById(

            "formTitle"

        )

        .textContent =

        "Create Timesheet";


    const hourFields = [


        "monday_hours",

        "tuesday_hours",

        "wednesday_hours",

        "thursday_hours",

        "friday_hours",

        "saturday_hours",

        "sunday_hours"


    ];


    hourFields.forEach(

        fieldId => {


            document

                .getElementById(

                    fieldId

                )

                .value =

                "0";


        }

    );


    document

        .getElementById(

            "total_hours"

        )

        .value =

        "0";


}


// ==========================================
// FORMAT DATE FOR TABLE
// ==========================================

function formatDate(dateValue) {


    if (

        !dateValue

    ) {


        return "-";

    }


    if (

        typeof dateValue ===

        "string"

    ) {


        if (

            dateValue.includes(

                "T"

            )

        ) {


            return dateValue

                .split(

                    "T"

                )[0];

        }


        if (

            dateValue.includes(

                ","

            )

        ) {


            const date =

                new Date(

                    dateValue

                );


            if (

                !isNaN(

                    date

                )

            ) {


                return date

                    .toISOString()

                    .split(

                        "T"

                    )[0];

            }

        }

    }


    return dateValue;

}


// ==========================================
// FORMAT DATE FOR INPUT
// ==========================================

function formatDateForInput(dateValue) {


    return formatDate(

        dateValue

    );

}