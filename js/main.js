/**
 * It sets a cookie with the name and value you pass to it, and it expires in the amount of time you
 * pass to it.
 * @param cookie_name - The name of the cookie you want to set.
 * @param cookie_value - The value of the cookie.
 * @param time_to_expire - The time in milliseconds that you want the cookie to last.
 */
const setCookie = (cookie_name, cookie_value, time_to_expire) => {
    let now = new Date()
    let time = now.getTime()
    let expireTime = time + time_to_expire
    now.setTime(expireTime)
    document.cookie = cookie_name + "=" + cookie_value + ";expires=" + now.toUTCString() + ";path=/"
}

/**
 * It takes a cookie name as a parameter and returns the value of the cookie.
 * @param cname - The name of the cookie you want to get.
 * @returns The value of the cookie.
 */
const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const logout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
 * It gets a new access token from the server using the refresh token
 * @returns a promise.
 */
const getNewAccessToken = async () => {
    const refreshToken = getCookie("refresh_token")
    if (refreshToken === "") {  
        if (!window.location.href.match("/index.html")) {
            window.location.href = "/index.html"
        }
    }

    if (!window.location.href.match("/index.html")) {

        const myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${refreshToken}`)

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        }

        const res = await fetch("https://freddy.codesubmit.io/refresh", requestOptions)
        const data = await res.json()

        if (data.msg !== undefined) {
            // window.location.reload()
            return;
        }

        setCookie("access_token", data.access_token, 900000)
    }
}

/* Checking if the access token is empty, if it is, it gets a new access token. */
window.addEventListener('load', (e) => {
    const access_token = getCookie('access_token')
    if(access_token === "") {
        getNewAccessToken()
    }
})

/* Checking if the access token is empty, if it is, it gets a new access token. */
setInterval(() => {
    let access_token = getCookie("access_token")
    let refresh_token = getCookie("refresh_token")
    if (access_token === "" || refresh_token == "") {
        getNewAccessToken()
    }
}, 500)