class NextMessageInit {
	queque: number[] = []

	skip(chatId: number) {
		this.queque.push(chatId)
	}

	remove(chatId: number) {
		const idx = this.queque.indexOf(chatId)

		if (idx === -1) {
			return
		}

		this.queque.splice(idx, 1)
	}
}

export const NextMessage = new NextMessageInit()
