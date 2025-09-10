export const ERROR_TYPES = {
	AUTH: 'auth',
	NETWORK: 'network',
	SERVER: 'server',
	VALIDATION: 'validation',
	NOT_FOUND: 'not_found',
	UNKNOWN: 'unknown'
}

export const normalizeError = (error, isInitial = false) => {
	if (!error || !error.isAxiosError) {
		return {
			type: ERROR_TYPES.UNKNOWN,
			message: error.message || 'An unknown error occurred.',
			status: null
		}
	}

	const status = error.response?.status ?? null
	const data = error.response?.data

	if (status === 401) {
		return {
			type: ERROR_TYPES.AUTH,
			message: data?.message || 'Unauthorized',
			status: status,
			isInitial
		}
	}
	if (status >= 500) {
		return {
			type: ERROR_TYPES.SERVER,
			message: data?.message || 'Server error',
			status: status
		}
	}
	if (status === 404) {
		return {
			type: ERROR_TYPES.NOT_FOUND,
			message: data?.message || 'Not found',
			status: status
		}
	}
	if (status >= 400 && status < 500) {
		return {
			type: ERROR_TYPES.VALIDATION,
			message: data?.message || 'Validation error',
			status: status
		}
	}
	if (!error.response) {
		return {
			type: ERROR_TYPES.NETWORK,
			message: error.message || 'Network error',
			status: null
		}
	}

	return {
		type: ERROR_TYPES.UNKNOWN,
		message: error.message || 'An unknown error occurred.',
		status: null
	}
}
