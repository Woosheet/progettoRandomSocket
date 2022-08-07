
let socket = io("http://localhost:5050",
    { transports: ['websocket', 'polling', 'flashsocket'] }
)

socket.on("connect", () => {
    console.log("connected");
    console.log(socket.id);
});

var count = 0;

socket.on("message", (arg) => {

    console.log("Chiamata Effettuata") + "_" + count;
    count++
    var marker = new Array();
    arg.forEach((element, i) => {        
        var LamMarker = new L.marker([element.position.latitude, element.position.longitude]).bindTooltip("Id: " + element.route_id + "\n current_stop: " + element.current_stop).openTooltip();
        marker.push(LamMarker);
        map.addLayer(marker[i])

    });
    setTimeout(function () {
        arg.forEach((element, i) => {
            map.removeLayer(marker[i])
        })
    }, 10700)
})

var map = L.map('map').setView([41.90007781982422, 12.465636253356934], 13);

var searchbox = L.control.searchbox({
    position: 'topright',
    expand: 'left'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);
