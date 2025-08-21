export const formatDate = dateString => {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)
		if (isNaN(date.getTime())) return ''

		const now = new Date()

		const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate())

		const today = stripTime(now)
		const yesterday = new Date(today)
		yesterday.setDate(today.getDate() - 1)

		const currentDate = stripTime(date)

		const time = date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})

		if (currentDate.getTime() === today.getTime()) {
			return `today at ${time}`
		}

		if (currentDate.getTime() === yesterday.getTime()) {
			return `yesterday at ${time}`
		}

		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = String(date.getFullYear()).slice(-2)

		return `${day}.${month}.${year} at ${time}`
	} catch {
		return ''
	}
}
