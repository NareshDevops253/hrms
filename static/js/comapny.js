alert("JavaScript Loaded");

function saveCompany() {

    let company_name = document.getElementById("company_name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let status = document.getElementById("status").value;

    fetch("/company", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            company_name: company_name,
            email: email,
            phone: phone,
            address: address,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}
