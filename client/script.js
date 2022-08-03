
let socket = io("http://localhost:5050",
    { transports: ['websocket', 'polling', 'flashsocket'] }
)

socket.on("connect", () => {
    console.log("connected");
    console.log(socket.id);
});

socket.on("message", (arg) => {
    console.log(arg[0].position.latitude);
    L.marker([arg[0].position.latitude, arg[0].position.longitude]).addTo(map)
    
    setTimeout(function removeMarker() {
        L.marker().removeTo(map)
    }, 3000);
})

socket.on("hello", (arg) => {
    console.log(arg);
})

var map = L.map('map').setView([41.90007781982422, 12.465636253356934], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);
