let savedCards = []
let savedFolds = []
let savedDevices = []

let splitData = (data) => {
    console.log(data)
    for (let index = 0; index < data.length; index++) {
        console.log("Serie: " + data[index].time)
        console.log("Time: " + data[index].value)
    }
}

let getData = (email, serie) => {
    // fetch and save data in savedData
    if (serie == "cards") {
        fetch("https://pushdata.io/" + email + "/" + serie)
            .then(res => res.json())
            .then(data => savedCards = data)
            .then(() => returnData(savedCards, serie))
    }
    else if (serie == "folds") {
        fetch("https://pushdata.io/" + email + "/" + serie)
            .then(res => res.json())
            .then(data => savedFolds = data)
            .then(() => returnData(savedFolds, serie))
    }
    else if (serie == "devices") {
        fetch("https://pushdata.io/" + email + "/" + serie)
            .then(res => res.json())
            .then(data => savedDevices = data)
            .then(() => returnData(savedDevices, serie))
    }

    //TODO: Add function that looks to see if the arrays are empty ar all filled with data, if they are filled with data then render the graph
    // Call the function from here


    console.log("https://pushdata.io/" + email + "/" + serie)
}

let returnData = (data, serie) => {
    console.log(serie)
    let results = document.getElementById("result")
    for (let i = 0; i < data.points.length; i++) {
        //console.log(data.points[i].time, data.points[i].value)
        results.innerHTML += "<p>" + serie + "</p>" + "<p>" + data.points[i].time + " " + data.points[i].value + "</p>"
    }
}

let postData = (email, serie, value) => {
    let modal = document.getElementById("report_status")
    var url = "https://pushdata.io/" + email + "/" + serie + "/" + value
    console.log(url)
    var xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send()

    xhr.onload = function () {
        console.log(this)
        if (this.status == 201) {
            modal.innerHTML += "<p>" + serie + ": sparat</p>"
        } else {
            modal.innerHTML += "<p>" + serie + ": misslyckades</p>"
        }
    }
}


let addRow = () => {
    let main = document.getElementsByTagName("main")[0]
    let innerHTML = document.getElementsByClassName("report_form")[0].innerHTML
    main.appendChild(document.createElement("div")).innerHTML = innerHTML
}

let changeValue = (event) => {
    event = event || window.event
    let input = event.target.parentElement.children[0]
    let direction = event.target.innerText
    if (direction == "+") {
        if (parseInt(input.value)) {
            input.value = parseInt(input.value) + 1
        } else {
            input.value = 1
        }
    }
    else if (direction == "-") {
        if (input.value -= 1) { } else {
            input.value = 0
        }
    }
}

let report = (event) => {
    modal = document.getElementById("report_status")
    modal.innerHTML = "" // clear modal
    event = event || window.event
    let cards = event.target.parentElement.parentElement.children[1].children[0].children[1].children[0].value
    let folds = event.target.parentElement.parentElement.children[1].children[1].children[1].children[0].value
    let devices = event.target.parentElement.parentElement.children[1].children[2].children[1].children[0].value
    let email = event.target.parentElement.parentElement.children[0].value

    console.log(cards, folds, devices, email)

    postData(email, "cards", cards)
    postData(email, "folds", folds)
    postData(email, "devices", devices)

}

let getDataButtonHandler = (event) => {
    event = event || window.event
    let email = event.target.parentElement.children[0].value
    console.log(email)
    let results = document.getElementById("result")
    results.innerHTML = ""

    // Reset arrays
    savedCards = []
    savedFolds = []
    savedDevices = []

    getData(email, "cards")
    getData(email, "folds")
    getData(email, "devices")

}
// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#result")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function (data) {

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d.Country; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 13000])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.Country); })
        .attr("y", function (d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.Value); })
        .attr("fill", "#69b3a2")

})

// This function is called by the buttons on top of the plot
function changeColor(color) {
    d3.selectAll("rect")
        .transition()
        .duration(2000)
        .style("fill", color)
}
