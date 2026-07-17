console.log("JS FILE LOADED");
alert("Client Work Order JavaScript Loaded");


// ============================
// Load Client MSA
// ============================
function loadClientMSA(){

    console.log("Loading Client MSA...");


    fetch("/client_msa")

    .then(response=>{

        console.log("MSA Response:", response.status);

        return response.json();

    })

    .then(data=>{


        console.log("Client MSA Data:",data);



        let dropdown =
        document.getElementById("client_msa_id");



        dropdown.innerHTML =
        '<option value="">Select Client MSA</option>';



        data.forEach(msa=>{


            dropdown.innerHTML += `

            <option value="${msa.id}">
                ${msa.client_name} - ${msa.msa_number}
            </option>

            `;


        });



    })

    .catch(error=>{

        console.log("MSA Error:",error);

    });


}





// ============================
// Load Company
// ============================
function loadCompanies(){


    fetch("/company")


    .then(response=>response.json())


    .then(data=>{


        console.log("Company Data:",data);


        let dropdown =
        document.getElementById("company_name");


        dropdown.innerHTML =
        '<option value="">Select Company</option>';



        data.forEach(company=>{


            dropdown.innerHTML += `

            <option value="${company.company_name}">
                ${company.company_name}
            </option>

            `;


        });


    })


    .catch(error=>console.log(error));


}





// ============================
// Load Resource By Company
// ============================
function loadResources(){


    let company =
    document.getElementById("company_name").value;



    let dropdown =
    document.getElementById("resource_name");



    dropdown.innerHTML =
    '<option value="">Select Resource</option>';



    fetch("/resource")


    .then(response=>response.json())


    .then(data=>{


        console.log("Resource Data:",data);



        data.forEach(resource=>{


            if(resource.company_name === company){



                dropdown.innerHTML += `


                <option value="${resource.first_name}">
                    ${resource.first_name} ${resource.last_name}
                </option>


                `;


            }


        });


    })

    .catch(error=>console.log(error));


}






// ============================
// Auto Populate Details
// ============================
function getResourceDetails(){


    let company =
    document.getElementById("company_name").value;


    let resource =
    document.getElementById("resource_name").value;



    fetch(`/resource_details/${company}/${resource}`)


    .then(response=>response.json())


    .then(data=>{


        console.log("Resource Details:",data);



        document.getElementById("resource_type").value =
        data.resource_type || "";



        document.getElementById("start_date").value =
        data.start_date || "";



        document.getElementById("end_date").value =
        data.end_date || "";



    })


    .catch(error=>console.log(error));


}






// ============================
// Save Client Work Order
// ============================
function saveClientWorkOrder(){



    let data={


        client_msa_id:
        document.getElementById("client_msa_id").value,


        work_order_number:
        document.getElementById("work_order_number").value,


        project_name:
        document.getElementById("project_name").value,


        company_name:
        document.getElementById("company_name").value,


        resource_name:
        document.getElementById("resource_name").value,


        resource_type:
        document.getElementById("resource_type").value,


        start_date:
        document.getElementById("start_date").value,


        end_date:
        document.getElementById("end_date").value,


        status:
        document.getElementById("status").value


    };



    console.log("Sending Data:",data);



    fetch("/client_work_order",{


        method:"POST",


        headers:{

            "Content-Type":"application/json"

        },


        body:JSON.stringify(data)



    })


    .then(response=>response.json())


    .then(result=>{


        alert(result.message);


        loadClientWorkOrders();


    });



}






// ============================
// Load Table
// ============================
function loadClientWorkOrders(){


    fetch("/client_work_order")


    .then(response=>response.json())


    .then(data=>{


        let table =
        document.getElementById("clientWorkOrderTable");


        table.innerHTML="";


        data.forEach(wo=>{


            table.innerHTML += `

            <tr>

            <td>${wo.id}</td>

            <td>${wo.client_name} - ${wo.msa_number}</td>

            <td>${wo.work_order_number}</td>

            <td>${wo.project_name}</td>

            <td>${wo.company_name || ""}</td>

            <td>${wo.resource_name || ""}</td>

            <td>${wo.resource_type}</td>

            <td>${wo.start_date}</td>

            <td>${wo.end_date}</td>

            <td>${wo.status}</td>

            </tr>

            `;


        });



    });


}






// ============================
// Page Load
// ============================
document.addEventListener("DOMContentLoaded",function(){


    console.log("DOM Loaded");


    loadClientMSA();

    loadCompanies();

    loadClientWorkOrders();



    document
    .getElementById("company_name")
    .addEventListener(
        "change",
        loadResources
    );



    document
    .getElementById("resource_name")
    .addEventListener(
        "change",
        getResourceDetails
    );


});
