import { Screen } from "/node_modules/genie/src/core/screen.js"

let peers = []

const localDev = false

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

const velocity = 0.2

export class Game extends Screen {
	create() {
		this.addBackgroundItems()

		const peer = new Peer({
			host: localDev ? "localhost" : "handshake.bigredmonster.com",
			port: localDev? 4570 : 80,
			path: "/handshake",
			debug: 2,
			key: "api",
			config: {
				iceServers: [
					{ url: "stun:stun.l.google.com:19302" },
					{ url: "stun:stun1.l.google.com:19302" },
					{ url: "stun:stun2.l.google.com:19302" },
					{ url: "stun:stun3.l.google.com:19302" },
					{ url: "stun:stun4.l.google.com:19302" },
				],
			},
		})

		this.player = this.add.sprite(0, 0, "game.dino1")
		this.player.scale = 4

		this.keys = this.input.keyboard.createCursorKeys()

		const handshake = localDev
				? "http://localhost:4570/handshake/api/peers"
				: "http://handshake.bigredmonster.com/handshake/api/peers"

		//connect existing
		fetch(handshake)
			.then(response => response.json())
			.then(ids => ids.forEach(connectionFromId(this, peer)))

		//recieve new connections
		peer.on("connection", initialiseConnection(this))

		peer.on("error", err => {
			console.error(err.type)
		})
	}

	update(time, delta) {
		if (time - (this.lastTime || 0) < 33 ) return
		const deltaV = velocity * (time - (this.lastTime || 0))

		const deltaX = getV(this.keys.left, this.keys.right, deltaV)
		const deltaY = getV(this.keys.up, this.keys.down, deltaV)

		const dirty = Boolean(deltaX) || Boolean(deltaY)

		this.player.x += deltaX
		this.player.y += deltaY
		deltaX < 0 && (this.player.flipX = true)
		deltaX > 0 && (this.player.flipX = false)

		dirty && peers.forEach(peer => peer.send({ x: this.player.x, y: this.player.y }))

		this.lastTime = time
	}
}

const getV = (a, b, v) => v * (a.isDown ? -1 : b.isDown ? 1 : 0)
