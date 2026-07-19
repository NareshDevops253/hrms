console.log("Dashboard JS Loaded");


// ==========================================
// LOAD DASHBOARD DATA
// ==========================================

function loadDashboard() {

    fetch("/dashboard")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(

                    "Failed to load dashboard data"

                );

            }

            return response.json();

        })

        .then(function (data) {

            console.log(

                "Dashboard Data:",

                data

            );


            // TOTAL COMPANIES

            document.getElementById(

                "totalCompanies"

            ).innerText =

                data.total_companies;


            // TOTAL RESOURCES

            document.getElementById(

                "totalResources"

            ).innerText =

                data.total_resources;


            // TOTAL CLIENTS

            document.getElementById(

                "totalClients"

            ).innerText =

                data.total_clients;


            // TOTAL TIMESHEETS

            document.getElementById(

                "totalTimesheets"

            ).innerText =

                data.total_timesheets;


        })

        .catch(function (error) {

            console.error(

                "Dashboard Error:",

                error

            );

        });

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadDashboard();

    }

);