import streamifier from 'streamifier'
import cloudinary from './cloudinaryConfig.js'

export function uploadBufferToCloudinary(buffer, options = {}) {
	// options: {public_Id, folder, overwrite, invalidate, transformation}
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			options,
			(error, result) => {
				if (error) return reject(error)
				resolve(result)
			}
		)
		streamifier.createReadStream(buffer).pipe(uploadStream)
	})
}
