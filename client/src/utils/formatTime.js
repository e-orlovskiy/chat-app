export const formatTime = (dateString, addDate = false) => {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)
		if (isNaN(date.getTime())) return ''

		const now = new Date()

		const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate())

		const today = stripTime(now)
		const yesterday = new Date(today)
		yesterday.setDate(today.getDate() - 1)
		const inputDate = stripTime(date)

		const time = date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})

		if (addDate) {
			if (inputDate.getTime() === today.getTime()) {
				return [`today`, `${time}`]
			}

			if (inputDate.getTime() === yesterday.getTime()) {
				return [`yesterday`, `${time}`]
			}

			const day = String(date.getDate()).padStart(2, '0')
			const month = String(date.getMonth() + 1).padStart(2, '0')
			return [`${day}.${month}`, `${time}`]
		}

		return time
	} catch {
		return ''
	}
}
