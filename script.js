let getData = () => {
    fetch("https://pushdata.io/cranky_skunk5@example.com/person1")
        .then(res => res.json())
        .then(data => console.log(data));
}

let postData = (value) => {
    var url = "https://pushdata.io/cranky_skunk5@example.com/person1/" + value
    var xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send()
}
