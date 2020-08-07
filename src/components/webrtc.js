const localDev = true

export const peers = []

const initialiseConnection = scene => conn => {
	peers.push(conn)

	console.log("initialising connection")

	const player = scene.add.sprite(0, 0, "game.dino1")
	player.scale = 4
	let lastPos = { x: 0, y: 0 }

	conn.on("data", data => {
		player.x = data.x
		player.y = data.y

		player.flipX = lastPos.x > data.x

		lastPos.x = data.x
		lastPos.y = data.y
	})

	conn.on("open", () => {
		console.log("connection open")
	})

	conn.on("error", err => {
		console.error(err)
	})
}

const connectionFromId = (scene, peer) => id => initialiseConnection(scene)(peer.connect(id))

const error = err => {
	console.error(err.type)
}

export const initWebRTC = scene => {
	const peer = new Peer({
		host: localDev ? "localhost" : "handshake.bigredmonster.com",
		port: localDev ? 4570 : 80,
		path: "/handshake",
		debug: 2,
		key: "api",
		config: {
			iceServers: [
				{ url: "stun:stun1.l.google.com:19302" },
				{ url: "stun:stun2.l.google.com:19302" },
				{ url: "stun:stun3.l.google.com:19302" },
				{ url: "stun:stun4.l.google.com:19302" },
			],
		},
	})

	const handshake = localDev
		? "http://localhost:4570/handshake/api/peers"
		: "http://handshake.bigredmonster.com/handshake/api/peers"

	//connect existing
	fetch(handshake)
		.then(response => response.json())
		.then(ids => ids.forEach(connectionFromId(scene, peer)))

	//recieve new connections
	peer.on("connection", initialiseConnection(scene))

	peer.on("error", error)
}
