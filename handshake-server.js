const { PeerServer } = require("peer")
//const { Peer } = require("peerjs")


const peerServer = PeerServer({
	port: 9000,
	path: "/handshake",
	allow_discovery: true,
	//generateClientId: customGenerationFunction,
})



//peerServer.on("connection", client => {
//	console.log(client)
//})
//
//peerServer.on("disconnect", client => {
//	console.log(client)
//})
