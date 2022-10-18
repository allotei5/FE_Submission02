var chartToggle = false
var data = {}
/**
 * It fetches data from an API and returns the data
 * @returns An object with the following structure:
 */
const fetchData = async () => {
  const myHeaders = new Headers();
  const access_token = getCookie("access_token");
  myHeaders.append("Authorization", `Bearer ${access_token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = await fetch(
    "https://freddy.codesubmit.io/dashboard",
    requestOptions
  );
  const dataFromApi = await res.json();

  if (dataFromApi.msg !== undefined) {
    alert("Internal server error");
    return;
  }

  data = dataFromApi.dashboard;
  return dataFromApi.dashboard;
};

/**
 * It takes in data, loops through the data, and then creates a string of HTML that is then added to
 * the DOM.
 * @param data - the data that is returned from the API
 */
const bestSellers = (data) => {
    const bestSellersDom = document.getElementById('bestsellers');
    let jsx =``
    data.bestsellers.forEach((item) => {
        jsx += `
            <div class="grid grid-cols-4">
                <p>${item.product.name}</p>
                <p>${(item.revenue/item.units).toFixed(2)}</p>
                <p>${item.units}</p>
                <p>${item.revenue}</p>
            </div>
            `
    })
    bestSellersDom.innerHTML = jsx
}

/**
 * It takes in an object, loops through the object, and then displays the data in a div.
 * @param data - {
 */
const orderSummary = (data) => {

    const summary = document.getElementById('summary')
    // const data = await fetchData()
    console.log(data)

    const week = {
        total: 0, 
        orders: 0
    }

    const days = [1, 2, 3, 4, 5, 6, 7]
    days.forEach((day) => {
        week.total += data.sales_over_time_week[day].total
        week.orders += data.sales_over_time_week[day].orders
    })


  let jsx = `
    <div class="border w-30 p-5">
        <div>
            <p>Today</p>
        </div>
        <div>
            <p>$ ${data.sales_over_time_week['1'].total} / ${data.sales_over_time_week['1'].orders} orders</p>
        </div>
    </div>
    <div class="border w-30 p-5">
        <div>
            <p>Last week</p>
        </div>
        <div>
            <p>$ ${week.total} / ${week.orders} orders</p>
        </div>
    </div>
    <div class="border w-30 p-5">
        <div>
            <p>Last month</p>
        </div>
        <div>
        <p>$ ${data.sales_over_time_year['1'].total} / ${data.sales_over_time_year['1'].orders} orders</p>
        </div>
    </div>
`;
    summary.innerHTML = jsx
};

let toggle = document.querySelector(".toggle");

const AnimatedToggle = () => {
    const chartHead = document.getElementById("chartHead");
    toggle.classList.toggle("active")
    chartToggle = !chartToggle

    let chartStatus = Chart.getChart("myChart")
    if (chartStatus !== undefined) {
        chartStatus.destroy();
      }
    if(chartToggle) {
        chartHead.innerHTML = "Revenue (last 12 Months)"
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]
        const dataForChart = months.map((month, index) => data.sales_over_time_year[index+1].total)
        drawChart("Revenue (Last 12 Months)", months, dataForChart)

    }else {
        chartHead.innerHTML = "Revenue (last 7 Days)"
        const daysOfTheWeek = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
        const dataForChart = daysOfTheWeek.map((day, index) => data.sales_over_time_week[index+1].total)
        drawChart("Revenue (Last 7 days)", daysOfTheWeek, dataForChart)
    }
}

const drawChart = (label, labels, data) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: ['rgba(242, 117, 3, 0.2)',],
                borderColor: ['rgba(242, 117, 3, 1)',],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/* Listening for the window to load and then it is calling the fetchData function. */
window.addEventListener("load", (e) => {
    fetchData()
    .then(res => {
        orderSummary(res)
        bestSellers(res)
        const daysOfTheWeek = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
        const dataForChart = daysOfTheWeek.map((day, index) => res.sales_over_time_week[index+1].total)
        drawChart("Revenue (Last 7 days)", daysOfTheWeek, dataForChart)
    })
//   orderSummary();
});

