
let socket = io("http://localhost:5050",
{ transports: ['websocket', 'polling', 'flashsocket'] }
)

socket.on("connect", () => {
console.log("connected"); 
console.log(socket.id); 
});

socket.on("message", (arg) => {
console.log(arg);
})

socket.on("hello", (arg) => {
console.log(arg);
})