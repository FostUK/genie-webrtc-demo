import { geckos } from "/lib/geckos.io-client.1.6.1.min.js"

//const username = "Yannick"
//const password = "12E45"
//const authorization = `${username} ${password}` // 'Yannick 12E45'
//
//const options = {
//	authorization,
//	url: "http://localhost",
//	port: 4507,
//	cors: {
//		origin: "*",
//	},
//}

const remote = {
	url: "https://relay.bigredmonster.com",
	port: 443,
}

export let channel

const players = {} //TODO weakmap?

const drop = id => {
	if (!players[id]) return    //TODO why does this sometimes come up?
	console.log("DROPPED", id)
	players[id].sprite.destroy()
	delete players[id]
}

const update = data => {
	const player = players[data.id]
	player.sprite.x = data.x
	player.sprite.y = data.y

	player.sprite.flipX = player.lastPos.x > data.x
	player.lastPos.x = data.x
	player.lastPos.y = data.y
}

export const initGeckos = scene => {
	channel = geckos(remote)

	channel.onConnect(error => {
		console.log(channel)
	})

	channel.on("new", data => {
		console.log("new")
		const sprite = scene.add.sprite(0, 0, "game.dino1")
		sprite.scale = 4
		sprite.x = data.x
		sprite.y = data.y

		players[data.id] = {
			sprite,
			lastPos: { x: 0, y: 0 },
		}
	})

	channel.on("drop", drop)
	channel.on("update", update)
}
