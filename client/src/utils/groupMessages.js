const MS = {
	minute: 60 * 1000,
	hour: 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000
}

const startOfDayKey = date => {
	const d = new Date(date)
	d.setHours(0, 0, 0, 0)
	return d.toISOString()
}

const formatDateHeader = date => {
	const d = new Date(date)
	const now = new Date()

	const startToday = new Date(now)
	startToday.setHours(0, 0, 0, 0)

	const startYesterday = new Date(startToday)
	startYesterday.setDate(startYesterday.getDate() - 1)

	const dayStart = new Date(d)
	dayStart.setHours(0, 0, 0, 0)

	if (dayStart.getTime() === startToday.getTime()) return 'Today'
	if (dayStart.getTime() === startYesterday.getTime()) return 'Yesterday'

	return d.toLocaleDateString()
}

export function groupMessages(
	messages = [],
	{ thresholdMs = 5 * MS.minute } = {}
) {
	if (!messages || messages.length === 0) return []

	const result = []
	let currentDateKey = null
	let currentUserGroup = null

	for (let i = 0; i < messages.length; i++) {
		const msg = messages[i]
		const createdAt = new Date(msg.createdAt).getTime()
		const msgDateKey = startOfDayKey(createdAt)

		if (currentDateKey !== msgDateKey) {
			currentDateKey = msgDateKey
			const dateGroup = {
				dateKey: currentDateKey,
				dateLabel: formatDateHeader(createdAt),
				userGroups: []
			}
			result.push(dateGroup)
			currentUserGroup = null
		}

		const dateGroup = result[result.length - 1]

		if (
			!currentUserGroup ||
			currentUserGroup.author._id !== msg.author._id ||
			(currentUserGroup.messages.length > 0 &&
				createdAt -
					new Date(
						currentUserGroup.messages[
							currentUserGroup.messages.length - 1
						].createdAt
					).getTime() >
					thresholdMs)
		) {
			currentUserGroup = {
				author: msg.author,
				messages: []
			}
			dateGroup.userGroups.push(currentUserGroup)
		}

		currentUserGroup.messages.push(msg)
	}

	return result
}

// export const groupMessagesByUsers = messages => {
// 	if (!messages || messages.length === 0) return []

// 	const result = []
// 	let currentGroup = null

// 	for (let i = 0; i < messages.length; i++) {
// 		const message = messages[i]

// 		if (!currentGroup || currentGroup.author._id !== message.author._id) {
// 			currentGroup = {
// 				author: message.author,
// 				messages: [message]
// 			}
// 			result.push(currentGroup)
// 		} else {
// 			currentGroup.messages.push(message)
// 		}
// 	}

// 	return result
// }
