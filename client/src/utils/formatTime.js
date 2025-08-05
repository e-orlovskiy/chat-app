export const formatTime = dateString => {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)
		return isNaN(date.getTime())
			? ''
			: date.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
			  })
	} catch {
		return ''
	}
}
