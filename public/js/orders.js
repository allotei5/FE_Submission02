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
        window.location.reload()
    }
    return data.orders
}

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
        window.location.reload()
    }
    return data.orders
}

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

window.addEventListener('load', (e) => {
    getOrders()
    .then(res => {
        displayOrders(res)
    })
})

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

document.getElementById('searchInput').addEventListener('keyup', (e) => displaySearch(e.target.value))