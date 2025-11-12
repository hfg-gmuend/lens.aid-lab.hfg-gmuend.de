/**
 * API Client with retry logic and error handling
 */

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // Start with 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
	constructor(message, status, response) {
		super(message);
		this.name = 'APIError';
		this.status = status;
		this.response = response;
	}
}

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
function getRetryDelay(attempt) {
	return RETRY_DELAY_BASE * Math.pow(2, attempt);
}

/**
 * Check if error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
function isRetryableError(error) {
	// Retry on network errors
	if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
		return true;
	}

	// Retry on specific HTTP status codes
	if (error instanceof APIError) {
		const retryableStatuses = [408, 429, 500, 502, 503, 504];
		return retryableStatuses.includes(error.status);
	}

	return false;
}

/**
 * Fetch with timeout
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		clearTimeout(id);
		return response;
	} catch (error) {
		clearTimeout(id);
		if (error.name === 'AbortError') {
			throw new Error('Request timeout - please try again');
		}
		throw error;
	}
}

/**
 * Make API request with retry logic
 * @param {string} url - The URL to request
 * @param {RequestInit} options - Fetch options
 * @param {Object} config - Additional configuration
 * @param {number} config.maxRetries - Maximum number of retries
 * @param {Function} config.onRetry - Callback called on retry (attempt, error)
 * @param {Function} config.onProgress - Callback for progress updates
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(
	url,
	options = {},
	{ maxRetries = MAX_RETRIES, onRetry = null, onProgress = null } = {}
) {
	let lastError;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			if (onProgress) {
				onProgress({ stage: 'requesting', attempt, maxRetries });
			}

			const response = await fetchWithTimeout(url, options);

			// Check for HTTP errors
			if (!response.ok) {
				const errorMessage = await response.text().catch(() => 'Unknown error');
				throw new APIError(
					`HTTP ${response.status}: ${response.statusText || errorMessage}`,
					response.status,
					response
				);
			}

			if (onProgress) {
				onProgress({ stage: 'success', attempt });
			}

			return response;
		} catch (error) {
			lastError = error;

			// Don't retry if we've exhausted attempts
			if (attempt >= maxRetries) {
				break;
			}

			// Don't retry if error is not retryable
			if (!isRetryableError(error)) {
				break;
			}

			// Calculate delay and notify
			const delay = getRetryDelay(attempt);

			if (onRetry) {
				onRetry(attempt + 1, error, delay);
			}

			if (onProgress) {
				onProgress({ stage: 'retrying', attempt, delay, error: error.message });
			}

			// Wait before retrying
			await sleep(delay);
		}
	}

	// All retries exhausted
	throw lastError;
}

/**
 * Upload image to API with progress tracking
 * @param {string} apiUrl - Base API URL
 * @param {Blob} imageBlob - The image to upload
 * @param {Object} params - Query parameters
 * @param {Function} onProgress - Progress callback
 * @param {Function} onRetry - Retry callback
 * @returns {Promise<Object>} API response data
 */
export async function uploadImage(apiUrl, imageBlob, params, onProgress = null, onRetry = null) {
	// Prepare form data
	const formData = new FormData();
	formData.append('file', imageBlob);

	// Build query params
	const queryParams = new URLSearchParams(params);

	// Create fetch options
	const options = {
		mode: 'cors',
		method: 'POST',
		body: formData,
		credentials: 'include'
	};

	try {
		if (onProgress) {
			onProgress({ stage: 'uploading', progress: 0 });
		}

		const response = await fetchWithRetry(`${apiUrl}lens?${queryParams.toString()}`, options, {
			maxRetries: MAX_RETRIES,
			onRetry,
			onProgress: (progressInfo) => {
				if (onProgress && progressInfo.stage === 'retrying') {
					onProgress(progressInfo);
				}
			}
		});

		if (onProgress) {
			onProgress({ stage: 'parsing', progress: 90 });
		}

		const data = await response.json();

		if (onProgress) {
			onProgress({ stage: 'complete', progress: 100 });
		}

		return data;
	} catch (error) {
		if (onProgress) {
			onProgress({ stage: 'error', error: error.message });
		}

		// Provide user-friendly error messages
		if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
			throw new Error(
				'Network error: Unable to reach the server. Please check your internet connection.'
			);
		}

		if (error instanceof APIError) {
			if (error.status === 429) {
				throw new Error('Too many requests. Please wait a moment and try again.');
			}
			if (error.status === 413) {
				throw new Error('Image file is too large. Please use a smaller image.');
			}
			if (error.status === 400) {
				throw new Error('Invalid request. Please check your input and try again.');
			}
			if (error.status >= 500) {
				throw new Error('Server error. Please try again later.');
			}
		}

		throw error;
	}
}

/**
 * Check network connectivity
 * @returns {Promise<boolean>}
 */
export async function checkConnectivity() {
	if (!navigator.onLine) {
		return false;
	}

	try {
		await fetch('https://www.google.com/favicon.ico', {
			mode: 'no-cors',
			cache: 'no-cache'
		});
		return true;
	} catch {
		return false;
	}
}
