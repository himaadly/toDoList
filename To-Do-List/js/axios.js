let quote = document.getElementById("quotes");
let btn = document.getElementById("quoteActivator");

axios.get('http://api.quotable.io/random')
    .then((res) => { handleRequest(res) })

function handleRequest() {
    axios.get('http://api.quotable.io/random')
        .then((res) => {
            quote.innerText = res.data.content
        })

}



btn.addEventListener("click", handleRequest);
window.addEventListener("load", handleRequest);