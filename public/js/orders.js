/**
 * It gets the orders from the API
 * @param [page=1] - The page number you want to get orders from.
 * @returns An array of objects.
 */
const getOrders = async (page=1) => {
    let access_token = getCookie("access_token")
    if(access_token === "") {
        getNewAccessToken()
        access_token = getCookie("access_token")
    }
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    

    const res = await fetch(`https://freddy.codesubmit.io/orders?page=${page}`, requestOptions);
    const data = await res.json()

    if (data.msg !== undefined) {
        // window.location.reload()
    }
    return data.orders
}

/**
 * It takes a search term, gets an access token, and then uses that access token to make a request to
 * the API
 * @param term - the search term
 * @returns An array of objects.
 */
const searchOrders = async (term) => {
    let access_token = getCookie("access_token")
    if(access_token === "") {
        getNewAccessToken()
        access_token = getCookie("access_token")
    }
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${access_token}`)

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    const res = await fetch(`https://freddy.codesubmit.io/orders?q=${term}`, requestOptions);
    const data = await res.json()

    if (data.msg !== undefined) {
        // window.location.reload()
    }
    return data.orders
}

/**
 * It takes an array of objects, loops through each object, and creates a string of HTML that is then
 * inserted into the DOM.
 * @param data - the data that you want to display
 */
const displayOrders = (data) => {
    const ordersDom = document.getElementById('orders');
    let jsx =``
    data.forEach((item) => {
        let date = new Date(item.created_at)
        jsx += `
            <div class="grid grid-cols-4">
                <p>${item.product.name}</p>
                <p>${date}</p>
                <p>${item.total}</p>
                <p style="color: ${item.status=='delivered' ? 'green': item.status=='processing' ?'red' : 'black' }">${item.status}</p>
            </div>
            `
    })
    ordersDom.innerHTML = jsx
}

/**
 * If the search text is empty, then get all the orders and display them. 
 * If the search text is not empty, then search for the orders and display them.
 */
const displaySearch = text => {
    if(text === "") {
        getOrders()
        .then(res => {
            displayOrders(res)
        })
    }else {
        searchOrders(text)
        .then(res => {
            displayOrders(res)
        })
    }
}

/* Listening for the window to load and then it is calling the getOrders function and then it is
calling the displayOrders function. */
window.addEventListener('load', (e) => {
    getOrders()
    .then(res => {
        displayOrders(res)
    })
})

/* Listening for a click event on the arrow element. When the arrow element is clicked, it gets the
page number element and then it checks to see if the page number is less than 3. If it is less than
3, then it increments the page number by 1 and then it calls the getOrders function and then it
calls the displayOrders function. */
document.getElementById('arrow').addEventListener('click', () => {
    const pageNumberDom = document.getElementById("pageNumber");

    if(parseInt(pageNumberDom.innerHTML) < 3) {
        pageNumberDom.innerHTML = parseInt(pageNumberDom.innerHTML) + 1
        getOrders(pageNumberDom.innerHTML)
        .then(res => {
            displayOrders(res)
        })
    }
})

/* Listening for a click event on the arrowLeft element. When the arrowLeft element is clicked, it gets
the page number element and then it checks to see if the page number is greater than 1. If it is
greater than 1, then it decrements the page number by 1 and then it calls the getOrders function and
then it calls the displayOrders function. */
document.getElementById('arrowLeft').addEventListener('click', () => {
    const pageNumberDom = document.getElementById("pageNumber");

    if(parseInt(pageNumberDom.innerHTML) > 1) {
        pageNumberDom.innerHTML = parseInt(pageNumberDom.innerHTML) - 1
        getOrders(pageNumberDom.innerHTML)
        .then(res => {
            displayOrders(res)
        })
    }
})

/* Listening for a keyup event on the searchInput element. When the keyup event is triggered, it calls
the displaySearch function and passes in the value of the searchInput element. */
document.getElementById('searchInput').addEventListener('keyup', (e) => displaySearch(e.target.value))