const setCookie = (cookie_name, cookie_value) => {
    let now = new Date()
    let time = now.getTime()
    let expireTime = time + 6000 * 3600
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