/**
 * Image utility functions for validation and compression
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 4096;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImage(file) {
	if (!file) {
		return { valid: false, error: 'No file provided' };
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return {
			valid: false,
			error: 'Invalid file type. Please use JPEG, PNG, or WebP images.'
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
		};
	}

	return { valid: true };
}

/**
 * Compress an image to fit within size constraints
 * @param {File|Blob} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<Blob>}
 */
export async function compressImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.85) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			const img = new Image();

			img.onload = () => {
				const canvas = document.createElement('canvas');
				let { width, height } = img;

				// Calculate new dimensions while maintaining aspect ratio
				if (width > height) {
					if (width > maxWidth) {
						height = (height * maxWidth) / width;
						width = maxWidth;
					}
				} else {
					if (height > maxHeight) {
						width = (width * maxHeight) / height;
						height = maxHeight;
					}
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error('Failed to compress image'));
						}
					},
					'image/jpeg',
					quality
				);
			};

			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = e.target.result;
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

/**
 * Get image dimensions
 * @param {File|Blob} file - The image file
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			const img = new Image();

			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};

			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = e.target.result;
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

/**
 * Load image from File/Blob with progress
 * @param {File|Blob} file - The image file
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<HTMLImageElement>}
 */
export async function loadImage(file, onProgress = null) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onprogress = (e) => {
			if (e.lengthComputable && onProgress) {
				const progress = (e.loaded / e.total) * 100;
				onProgress(progress);
			}
		};

		reader.onload = (e) => {
			const img = new Image();

			img.onload = () => {
				if (onProgress) onProgress(100);
				resolve(img);
			};

			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = e.target.result;
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

/**
 * Convert data URL to Blob
 * @param {string} dataUrl - The data URL
 * @returns {Blob}
 */
export function dataURLtoBlob(dataUrl) {
	const arr = dataUrl.split(',');
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
