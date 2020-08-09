import { Screen } from "/node_modules/genie/src/core/screen.js"
import { initWebRTC, peers } from "./webrtc.js"
import { initGeckos, channel } from "./geckos.js"

const velocity = 0.2

const protocol = "geckos" //"webRTC"

const protocols = {
	webRTC: initWebRTC,
	geckos: initGeckos,
}

const update = {
	webRTC: player => peers.forEach(peer => peer.send({ x: player.x, y: player.y })),
	geckos: player => channel.emit("update", { x: Math.floor(player.x), y: Math.floor(player.y) }),
}

export class Game extends Screen {
	create() {
		this.addBackgroundItems()
		this.player = this.add.sprite(0, 0, "game.dino1")
		this.player.scale = 4
		this.keys = this.input.keyboard.createCursorKeys()

		protocols[protocol](this)
	}

	update(time, delta) {
		if (time - (this.lastTime || 0) < 33) return
		const deltaV = velocity * (time - (this.lastTime || 0))

		const pointer = this.input.activePointer
		let left = this.keys.left.isDown
		let right = this.keys.right.isDown
		let up = this.keys.up.isDown
		let down = this.keys.down.isDown

		if (pointer.isDown) {
			left = pointer.x < 700
			right = pointer.x >= 700
			up = pointer.y < 300
			down = pointer.y >= 300
		}

		const deltaX = getV(left, right, deltaV)
		const deltaY = getV(up, down, deltaV)

		const dirty = Boolean(deltaX) || Boolean(deltaY)

		this.player.x += deltaX
		this.player.y += deltaY
		deltaX < 0 && (this.player.flipX = true)
		deltaX > 0 && (this.player.flipX = false)

		dirty && update[protocol](this.player)

		this.lastTime = time
	}
}

const getV = (a, b, v) => v * (a ? -1 : b ? 1 : 0)
