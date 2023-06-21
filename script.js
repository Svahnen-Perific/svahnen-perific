


let getData = (email, serie) => {
    let savedData = "test"
    // fetch and save data in savedData
    fetch("https://pushdata.io/" + email + "/" + serie)
        .then(res => res.json())
        .then(data => savedData = data)
        .then(() => returnData(savedData, serie))

    console.log("https://pushdata.io/" + email + "/" + serie)
}

let returnData = (data, serie) => {
    console.log(serie)
    let results = document.getElementById("result")
    for (let i = 0; i < data.points.length; i++) {
        console.log(data.points[i].time, data.points[i].value)
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
    getData(email, "cards")
    getData(email, "folds")
    getData(email, "devices")

}