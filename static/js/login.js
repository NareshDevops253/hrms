function login() {

    const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })

    .then(response => response.json())

    .then(result => {

        document.getElementById("message").innerHTML = result.message;

        if(result.message === "Login Successful"){

            window.location.href = "/companypage";

        }

    })

    .catch(error => console.log(error));

}