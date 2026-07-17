console.log("Supplier MSA JS Loaded");

let editId = null;


// ===============================
// SAVE SUPPLIER MSA
// ===============================
function saveSupplierMSA(){

    let data = {

        supplier_name: document.getElementById("supplier_name").value,
        msa_number: document.getElementById("msa_number").value,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
        status: document.getElementById("status").value

    };


    fetch("/supplier_msa",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    })

    .then(response=>response.json())

    .then(result=>{

        alert(result.message);

        clearForm();

        loadSupplierMSA();

    })

    .catch(error=>console.log(error));

}



// ===============================
// LOAD SUPPLIER MSA
// ===============================
function loadSupplierMSA(){


    fetch("/supplier_msa")

    .then(response=>response.json())

    .then(data=>{


        let table = document.getElementById("supplierMSATable");

        table.innerHTML="";


        data.forEach(msa=>{


            table.innerHTML += `

            <tr>

                <td>${msa.id}</td>

                <td>${msa.supplier_name}</td>

                <td>${msa.msa_number}</td>

                <td>${msa.start_date}</td>

                <td>${msa.end_date}</td>

                <td>${msa.status}</td>


                <td>

                    <button onclick="editSupplierMSA(${msa.id})">
                    Edit
                    </button>


                    <button onclick="deleteSupplierMSA(${msa.id})">
                    Delete
                    </button>


                </td>


            </tr>

            `;


        });


    })

    .catch(error=>console.log(error));


}



// ===============================
// EDIT SUPPLIER MSA
// ===============================
function editSupplierMSA(id){


    fetch("/supplier_msa")

    .then(response=>response.json())

    .then(data=>{


        let msa = data.find(item=>item.id == id);


        document.getElementById("supplier_name").value = msa.supplier_name;

        document.getElementById("msa_number").value = msa.msa_number;

        document.getElementById("start_date").value = msa.start_date;

        document.getElementById("end_date").value = msa.end_date;

        document.getElementById("status").value = msa.status;


        editId = id;


        document.getElementById("saveBtn").style.display="none";

        document.getElementById("updateBtn").style.display="inline";


    });


}



// ===============================
// UPDATE SUPPLIER MSA
// ===============================
function updateSupplierMSA(){


    let data = {


        supplier_name: document.getElementById("supplier_name").value,

        msa_number: document.getElementById("msa_number").value,

        start_date: document.getElementById("start_date").value,

        end_date: document.getElementById("end_date").value,

        status: document.getElementById("status").value


    };



    fetch(`/supplier_msa/${editId}`,{


        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },


        body:JSON.stringify(data)


    })


    .then(response=>response.json())


    .then(result=>{


        alert(result.message);


        clearForm();

        loadSupplierMSA();


    });



}




// ===============================
// DELETE SUPPLIER MSA
// ===============================
function deleteSupplierMSA(id){


    if(confirm("Are you sure you want to delete?")){


        fetch(`/supplier_msa/${id}`,{


            method:"DELETE"


        })


        .then(response=>response.json())


        .then(result=>{


            alert(result.message);

            loadSupplierMSA();


        });


    }


}



// ===============================
// CLEAR FORM
// ===============================
function clearForm(){


    document.getElementById("supplier_name").value="";

    document.getElementById("msa_number").value="";

    document.getElementById("start_date").value="";

    document.getElementById("end_date").value="";

    document.getElementById("status").value="";


    editId=null;


    document.getElementById("saveBtn").style.display="inline";

    document.getElementById("updateBtn").style.display="none";


}



// Load data when page opens
window.onload=function(){

    loadSupplierMSA();

};