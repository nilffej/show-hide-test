console.log(fin.me);

const body = document.getElementById("body-container");

const showButton = document.createElement("button");
showButton.innerHTML = "Show Window";
showButton.onclick = () => {
    console.log("Emitting show");
    fin.InterApplicationBus.publish("show");
};

const hideButton = document.createElement("button");
hideButton.innerHTML = "Hide Window";
hideButton.onclick = () => {
    console.log("Emitting hide");
    fin.InterApplicationBus.publish("hide");
};

body.appendChild(showButton);
body.appendChild(hideButton);
