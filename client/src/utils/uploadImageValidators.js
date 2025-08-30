export const validateImage = image => {
	const allowed = ['image/png', 'image/jpeg', 'image/webp']

	if (!image) return 'Image is required'
	if (!image.type.startsWith('image/')) return 'Invalid image format'
	if (!allowed.includes(image.type)) return 'Invalid image format'
	if (image.size > 5 * 1024 * 1024) return 'Image must be less than 5MB'
	return null
}
