/**
 * Input validation utilities
 */

const MIN_PROMPT_LENGTH = 3;
const MAX_PROMPT_LENGTH = 500;

/**
 * Validate prompt text
 * @param {string} prompt - The prompt to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validatePrompt(prompt) {
	// Prompt is optional, so allow empty strings
	if (!prompt || typeof prompt !== 'string') {
		return { valid: true };
	}

	const trimmed = prompt.trim();

	// Empty prompts are allowed
	if (trimmed.length === 0) {
		return { valid: true };
	}

	// Only validate length if prompt is provided
	if (trimmed.length > MAX_PROMPT_LENGTH) {
		return {
			valid: false,
			error: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters`
		};
	}

	return { valid: true };
}

/**
 * Validate denoise value
 * @param {number} denoise - The denoise value (0-1)
 * @returns {{valid: boolean, error?: string}}
 */
export function validateDenoise(denoise) {
	if (typeof denoise !== 'number' || isNaN(denoise)) {
		return { valid: false, error: 'Invalid familiarity value' };
	}

	if (denoise < 0 || denoise > 1) {
		return { valid: false, error: 'Familiarity must be between 0 and 1' };
	}

	return { valid: true };
}

/**
 * Sanitize prompt text
 * @param {string} prompt - The prompt to sanitize
 * @returns {string}
 */
export function sanitizePrompt(prompt) {
	if (!prompt) return '';

	// Remove excessive whitespace
	return prompt
		.trim()
		.replace(/\s+/g, ' ')
		.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remove control characters
}
