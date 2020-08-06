const { PeerServer } = require("peer")
//const { Peer } = require("peerjs")


const peerServer = PeerServer({
	port: 4570,
	path: "/handshake",
	allow_discovery: true,
	key: "api",
	//generateClientId: customGenerationFunction,
})



peerServer.on("connection", client => {
	console.log(client)
})

peerServer.on("disconnect", client => {
	console.log(client)
})
