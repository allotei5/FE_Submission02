const setCookie = (cookie_name, cookie_value, time_to_expire) => {
    let now = new Date()
    let time = now.getTime()
    let expireTime = time + time_to_expire
    now.setTime(expireTime)
    document.cookie = cookie_name + "=" + cookie_value + ";expires=" + now.toUTCString() + ";path=/"
}

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

const getNewAccessToken = async () => {
    const refreshToken = getCookie("refresh_token")
    if (refreshToken === "") {
        window.location.href = "/index.html"
    }

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
        window.location.reload()
        return;
    }

    setCookie("access_token", data.access_token, 900000)
}

window.addEventListener('load', (e) => {
    const access_token = getCookie('access_token')
    if(access_token === "") {
        getNewAccessToken()
    }
})