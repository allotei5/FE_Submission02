const loginRequest = async (username, password) => {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
        username,
        password
    })

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }
    
    const res = await fetch("https://freddy.codesubmit.io/login", requestOptions)
    const data = await res.json()


    if (data.access_token === undefined) {
        alert("username or password is incorrect.")
    }

    const { access_token, refresh_token } = data
    setCookie("access_token", access_token, 900000)
    setCookie("refresh_token", refresh_token, 2.5920E+9)

    window.location.href = window.location.href.replace("/index.html", "/dashboard.html")
    
}

const login = (e) => {
    e.preventDefault()
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        alert("Inputs cannot be empty")
        return;
    }

    loginRequest(username, password)

}


const form = document.getElementById("loginForm")
form.addEventListener("submit", login)