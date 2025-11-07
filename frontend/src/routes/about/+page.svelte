<script>
	import { goto } from '$app/navigation';
</script>

<div class="about-container">
	<div class="about-content">
		<button class="back-button" onclick={() => goto('/')}>
			← Back
		</button>
		
		<h1 class="title">About Futures Lens</h1>
		
		<div class="about-text">
			<p>
				Futures Lens is an interactive tool for exploring and generating future scenarios through AI-powered image transformation.
			</p>
			
			<p>
				Capture or upload an image, provide a prompt describing a potential future, and watch as the AI transforms your vision into a visual representation of what might be.
			</p>
			
			<h2>How to Use</h2>
			<ol>
				<li><strong>Capture or Upload:</strong> Use your camera to capture the present moment or upload an existing image.</li>
				<li><strong>Describe the Future:</strong> Enter a prompt describing how you envision the future transformation.</li>
				<li><strong>Adjust Familiarity:</strong> Use the familiarity slider to control how closely the result resembles the input.</li>
				<li><strong>Transfer:</strong> Click the transfer button to generate your future vision.</li>
				<li><strong>Reuse:</strong> Click the top handle to reuse the result as a new starting point.</li>
			</ol>
			
			<h2>Tips</h2>
			<ul>
				<li>Be specific and descriptive in your prompts for better results.</li>
				<li>Lower familiarity values create more dramatic transformations.</li>
				<li>Higher familiarity values keep the result closer to the original.</li>
				<li>Use the history feature to compare different variations.</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.about-container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
	}

	.about-content {
		width: 100%;
		max-width: 800px;
		position: relative;
	}

	.back-button {
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-accent);
		background-color: transparent;
		color: var(--color-accent);
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
		margin-bottom: 2rem;
	}

	.back-button:hover {
		background-color: var(--color-accent);
		color: white;
	}

	.title {
		font-size: 2.5rem;
		font-weight: 300;
		font-style: italic;
		color: white;
		margin: 0 0 2rem 0;
	}

	.about-text {
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.8;
	}

	.about-text p {
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.about-text h2 {
		color: var(--color-accent);
		font-size: 1.5rem;
		font-weight: 400;
		margin: 2rem 0 1rem 0;
	}

	.about-text ol,
	.about-text ul {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.about-text li {
		margin-bottom: 0.75rem;
		font-size: 1rem;
	}

	.about-text strong {
		color: var(--color-accent);
		font-weight: 500;
	}

	@media (max-width: 600px) {
		.title {
			font-size: 2rem;
		}

		.about-text p {
			font-size: 1rem;
		}

		.about-text h2 {
			font-size: 1.3rem;
		}
	}
</style>
