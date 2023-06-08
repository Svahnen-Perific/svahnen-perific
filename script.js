let getData = (email, serie) => {
    fetch("https://pushdata.io/" + email + "/" + serie)
        .then(res => res.json())
        .then(data => console.log(data));
}

let postData = (email, serie, value) => {
    var url = "https://pushdata.io/" + email + "/" + serie + "/" + value
    console.log(url)
    var xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send()
}
