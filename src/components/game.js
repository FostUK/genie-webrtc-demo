import { Screen } from "/node_modules/genie/src/core/screen.js"

let peers = []

const initialiseConnection = scene => conn => {
	peers.push(conn)

	const player = scene.add.sprite(0, 0, "game.dino1")
	player.scale = 4

	conn.on("data", data => {
		console.log(data)

		player.x = data.x
		player.y = data.y
	})

	conn.on("open", () => {
		conn.send("hello!")
	})
}

const connectionFromId = (scene, peer) => id => initialiseConnection(scene)(peer.connect(id))

const velocity = 0.2

export class Game extends Screen {
	create() {
		this.addBackgroundItems()

		const peer = new Peer({
			host: "localhost",
			port: 9000,
			path: "/handshake",
		})

		this.player = this.add.sprite(0, 0, "game.dino1")
		this.player.scale = 4

		this.keys = this.input.keyboard.createCursorKeys()

		//connect existing
		fetch("http://localhost:9000/handshake/peerjs/peers")
			.then(response => response.json())
			.then(ids => ids.forEach(connectionFromId(this, peer)))

		//recieve new connections
		peer.on("connection", initialiseConnection(this))
	}

	update(time, delta) {
		const deltaV = velocity * delta

		this.keys.left.isDown && (this.player.x = this.player.x - deltaV)
		this.keys.right.isDown && (this.player.x = this.player.x + deltaV)
		this.keys.up.isDown && (this.player.y = this.player.y - deltaV)
		this.keys.down.isDown && (this.player.y = this.player.y + deltaV)

		peers.forEach(peer => peer.send({ x: this.player.x, y: this.player.y }))
	}
}
