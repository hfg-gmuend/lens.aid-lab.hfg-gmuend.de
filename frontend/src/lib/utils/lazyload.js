/**
 * Lazy loading utility for images
 */

/**
 * Create an intersection observer for lazy loading images
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver}
 */
export function createLazyLoader(callback, options = {}) {
	const defaultOptions = {
		root: null,
		rootMargin: '50px',
		threshold: 0.01
	};

	return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

/**
 * Lazy load an image element
 * @param {HTMLImageElement} img - Image element to lazy load
 * @param {string} src - Image source URL
 */
export function lazyLoadImage(img, src) {
	if (!img || !src) return;

	const observer = createLazyLoader((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const image = entry.target;
				image.src = src;
				image.classList.add('loaded');
				observer.unobserve(image);
			}
		});
	});

	observer.observe(img);

	return () => observer.disconnect();
}

/**
 * Svelte action for lazy loading images
 * @param {HTMLImageElement} node - Image element
 * @param {string} src - Image source URL
 */
export function lazyload(node, src) {
	if (!src) return;

	const observer = createLazyLoader((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				node.src = src;
				node.classList.add('loaded');
				observer.unobserve(node);
			}
		});
	});

	observer.observe(node);

	return {
		update(newSrc) {
			if (newSrc !== src) {
				observer.disconnect();
				node.src = newSrc;
			}
		},
		destroy() {
			observer.disconnect();
		}
	};
}
