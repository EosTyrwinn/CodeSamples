export function downloadFile(url,callbackRef) {
    const xhr = new XMLHttpRequest();

    xhr.onerror = (e) => console.log("error");

    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        callbackRef(jsonString);
    };

    xhr.open("GET",url);

    xhr.send();
}