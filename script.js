


let getData = (email, serie) => {
    let savedData = "test"
    // fetch and save data in savedData
    fetch("https://pushdata.io/" + email + "/" + serie)
        .then(res => res.json())
        .then(data => savedData = data)
        .then(() => returnData(savedData, serie))

    console.log("https://pushdata.io/" + email + "/" + serie)
}


let cardsDate = []
let cards = []
let foldsDate = []
let folds = []
let devicesDate = []
let devices = []

let returnDataCounter = 0
let returnData = (data, serie) => {
    returnDataCounter++
    console.log(serie)

    for (let i = 0; i < data.points.length; i++) {
        if (serie == "cards") {
            //cards += data.points[i].value
            //cardsDate += data.points[i].time
            //cards.push(Math.abs(data.points[i].value))
            cards.push(data.points[i].value)
            //cardsDate.push(data.points[i].time)
            //cardsDate.push(data.points[i].time.split("T")[0])
            cardsDate.push(data.points[i].time.split("T")[0])
            //Cut the time out of the date
            //cardsDate.push(data.points[i].time.split("T"))
            //console.log(data.points[i].time.split("T")[0])
        } else if (serie == "folds") {
            //folds += data.points[i].value
            //foldsDate += data.points[i].time
            folds.push(data.points[i].value)
            foldsDate.push(data.points[i].time.split("T")[0])
        } else if (serie == "devices") {
            //devices += data.points[i].value
            //devicesDate += data.points[i].time
            devices.push(data.points[i].value)
            devicesDate.push(data.points[i].time.split("T")[0])
        }

        console.log(data.points[i].time, data.points[i].value)
    }
    if (returnDataCounter == 3) {
        drawGraph()
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
    returnDataCounter = 0
    cardsDate = []
    cards = []
    foldsDate = []
    folds = []
    devicesDate = []
    devices = []
    event = event || window.event
    let email = event.target.parentElement.children[0].value
    console.log(email)
    let results = document.getElementById("result")
    results.innerHTML = ""
    getData(email, "cards")
    getData(email, "folds")
    getData(email, "devices")

}

//TODO: Make the labels show up on the graph

let drawGraph = () => {


    let card_trace = {
        x: cardsDate,
        y: cards,
        name: 'Cards',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: cardsDate,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };

    let fold_trace = {
        x: foldsDate,
        y: folds,
        name: 'Folds',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: foldsDate,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };

    let device_trace = {
        x: devicesDate,
        y: devices,
        name: 'Devices',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: devicesDate,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };

    let data = [card_trace, fold_trace, device_trace];

    let layout = { barmode: 'group' };

    Plotly.newPlot('result', data, layout);
}