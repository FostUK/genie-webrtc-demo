import geckos from "@geckos.io/server"

const options = {
	iceServers: geckos.iceServers,
}

const io = geckos.default()

io.listen(4571)
const lastFrames = {}

const update = channel => data => {
	data.id = channel.id
	lastFrames[channel.id] = data
	channel.broadcast.emit("update", data)
}

const disconnect = channel => () => channel.broadcast.emit("drop", channel.id)
const addToAll = channel => channel.broadcast.emit("new", { id: channel.id, x: 0, y: 0 })
const addChannels = channel => Object.values(lastFrames).forEach(data => channel.emit("new", data))

const connect = channel => {
	addToAll(channel)
	addChannels(channel)

	lastFrames[channel.id] = {}

	channel.on("disconnect", disconnect(channel))
	channel.on("update", update(channel))
}

io.onConnection(connect)
