alert("Client MSA JavaScript Loaded");

// Save Client MSA
function saveClientMSA() {

    let client_name = document.getElementById("client_name").value.trim();
    let msa_number = document.getElementById("msa_number").value.trim();
    let start_date = document.getElementById("start_date").value;
    let end_date = document.getElementById("end_date").value;
    let status = document.getElementById("status").value;

    // Validation
    if (client_name === "") {
        alert("Client Name is required");
        return;
    }

    if (msa_number === "") {
        alert("MSA Number is required");
        return;
    }

    if (start_date === "") {
        alert("Start Date is required");
        return;
    }

    if (end_date === "") {
        alert("End Date is required");
        return;
    }

    fetch("/client_msa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_name,
            msa_number,
            start_date,
            end_date,
            status
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}


// Update Client MSA
function updateClientMSA() {

    let client_msa_id = document.getElementById("client_msa_id").value;

    let client_name = document.getElementById("client_name").value.trim();
    let msa_number = document.getElementById("msa_number").value.trim();
    let start_date = document.getElementById("start_date").value;
    let end_date = document.getElementById("end_date").value;
    let status = document.getElementById("status").value;

    if (client_msa_id === "") {
        alert("Client MSA ID is required");
        return;
    }

    fetch(`/client_msa/${client_msa_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_name,
            msa_number,
            start_date,
            end_date,
            status
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}


// Delete Client MSA
function deleteClientMSA() {

    let client_msa_id = document.getElementById("client_msa_id").value;

    if (client_msa_id === "") {
        alert("Enter Client MSA ID");
        return;
    }

    fetch(`/client_msa/${client_msa_id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}