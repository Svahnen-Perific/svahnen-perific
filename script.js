let cards = { date: [], value: [] }
let folds = { date: [], value: [] }
let em1 = { date: [], value: [] }
let one = { date: [], value: [] }
let label = { date: [], value: [] }
let sent = { date: [], value: [] }

let listOfEmails = ["info@perific.com", "oscar.forslund@perific.com", "zara.paktinat@perific.com", "yasir.ali@perific.com"]

let getData = (email, serie) => {
    let savedData
    // fetch and save data in savedData
    fetch("https://pushdata.io/" + email + "/" + serie)
        .then(res => res.json())
        .then(data => savedData = data)
        .then(() => returnData(savedData, serie))

    console.log("https://pushdata.io/" + email + "/" + serie)
}
let resetData = () => {
    cards = { date: [], value: [] }
    folds = { date: [], value: [] }
    em1 = { date: [], value: [] }
    one = { date: [], value: [] }
    label = { date: [], value: [] }
    sent = { date: [], value: [] }
}

let returnDataCounter = 0
let returnData = (data, serie) => {
    returnDataCounter++
    console.log(serie)

    for (let i = 0; i < data.points.length; i++) {
        if (serie == "cards") {
            cards.value.push(data.points[i].value)
            cards.date.push(data.points[i].time.split("T")[0])
        } else if (serie == "folds") {

            folds.value.push(data.points[i].value)
            folds.date.push(data.points[i].time.split("T")[0])
        } else if (serie == "em1") {
            em1.value.push(data.points[i].value)
            em1.date.push(data.points[i].time.split("T")[0])
        } else if (serie == "one") {
            one.value.push(data.points[i].value)
            one.date.push(data.points[i].time.split("T")[0])
        } else if (serie == "label") {
            label.value.push(data.points[i].value)
            label.date.push(data.points[i].time.split("T")[0])
        } else if (serie == "sent") {
            sent.value.push(data.points[i].value)
            sent.date.push(data.points[i].time.split("T")[0])
        }
        console.log(data.points[i].time, data.points[i].value)
    }
    if (returnDataCounter == 6) {
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

    let form = document.getElementsByClassName("report_form")[0]

    main.appendChild(document.createElement("div")).innerHTML = form.innerHTML


    let email

    if (email = listOfEmails.pop()) {
        document.getElementsByTagName("main")[0].lastChild.children[0].value = email
    } else {
        document.getElementsByTagName("main")[0].lastChild.children[0].value = ""
    }

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
    let em1 = event.target.parentElement.parentElement.children[1].children[2].children[1].children[0].value
    let one = event.target.parentElement.parentElement.children[1].children[3].children[1].children[0].value
    let label = event.target.parentElement.parentElement.children[1].children[4].children[1].children[0].value
    let sent = event.target.parentElement.parentElement.children[1].children[5].children[1].children[0].value
    let email = event.target.parentElement.parentElement.children[0].value

    console.log(cards, folds, em1, one, label, sent, email)


    postData(email, "cards", cards)
    postData(email, "folds", folds)
    postData(email, "em1", em1)
    postData(email, "one", one)
    postData(email, "label", label)
    postData(email, "sent", sent)
}

let getDataButtonHandler = (event) => {
    returnDataCounter = 0
    event = event || window.event
    let email = event.target.parentElement.children[0].value
    console.log(email)
    let results = document.getElementById("result")
    results.innerHTML = ""
    getData(email, "cards")
    getData(email, "folds")
    getData(email, "em1")
    getData(email, "one")
    getData(email, "label")
    getData(email, "sent")
}

let drawGraph = () => {


    let card_trace = {
        x: cards.date,
        y: cards.value,
        name: 'Cards',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: cards.date,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };

    let fold_trace = {
        x: folds.date,
        y: folds.value,
        name: 'Folds',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: folds.date,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };

    let em1_trace = {
        x: em1.date,
        y: em1.value,
        name: 'EM1',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: em1.date,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };
    let one_trace = {
        x: one.date,
        y: one.value,
        name: 'One',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: one.date,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };
    let label_trace = {
        x: label.date,
        y: label.value,
        name: 'Label',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: label.date,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };
    let sent_trace = {
        x: sent.date,
        y: sent.value,
        name: 'Sent',
        type: 'bar',
        transforms: [{
            type: 'aggregate',
            groups: sent.date,
            aggregations: [
                { target: 'y', func: 'sum', enabled: true },
            ]
        }]
    };

    let data = [card_trace, fold_trace, em1_trace, one_trace, label_trace, sent_trace];

    let layout = { barmode: 'group' };

    Plotly.newPlot('result', data, layout);
}

addRow()
addRow()
addRow()
addRow()