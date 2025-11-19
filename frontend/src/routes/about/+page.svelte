<script>
	import { base } from '$app/paths';

	const capabilities = [
		{
			title: 'Explore Diverse Futures',
			description:
				'Futures are shaped by different perspectives, each offering unique possibilities. Use AI as a design method to prototype alternative realities and understand how context transforms everyday objects.'
		},
		{
			title: 'Speculative Design Strategies',
			description:
				'Apply critical design techniques like constraints, exaggeration, and absurdity. Turn these into AI prompts to create provocative, thought-provoking artifacts that challenge assumptions.'
		},
		{
			title: 'Iterative Co-Creation',
			description:
				'Engage in playful collaboration with AI across multiple iterations. Decontextualize familiar objects and redefine their purpose, building a catalog of fantastic things.'
		}
	];

	const workflow = [
		{
			title: 'Decontextualize',
			steps: ['Select an everyday object', 'Consider its current context and function', 'Imagine removing it from familiar surroundings']
		},
		{
			title: 'Apply Speculative Strategies',
			steps: ['Choose constraints, exaggeration, or absurdity', 'Craft prompts that challenge assumptions', 'Use AI to generate speculative interpretations']
		},
		{
			title: 'Iterate & Catalog',
			steps: ['Create multiple variations across iterations', 'Build narratives around transformed objects', 'Curate your catalog of fantastic things']
		}
	];

	const stack = [
		{ name: 'SvelteKit', url: 'https://kit.svelte.dev', note: 'Reactive interface and PWA shell' },
		{ name: 'IndexedDB', url: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API', note: 'Client-side history storage' },
		{ name: 'FastAPI', url: 'https://fastapi.tiangolo.com', note: 'Orchestrates ComfyUI pipelines' },
		{ name: 'ComfyUI', url: 'https://comfyui.com', note: 'Diffusion workflow backend' }
	];

	const contributors = [
		{ name: 'Jordi Tost', role: 'Concept' },
		{ name: 'Christopher Pietsch', role: 'AI Pipeline & Engineering' }
	];
</script>

<div class="about-container">
	<div class="header">
		<h1 class="title">About Futures Lens</h1>
		<a href="{base}/" class="back-link">← Back to App</a>
	</div>

	<section class="hero">
		<p class="lead">
			Futures Lens is a speculative design tool that fosters reflection on possible futures. 
			Capture familiar objects, prompt new contexts, and grow a catalog of transformed artifacts that reveal how 
			AI can expand the imaginative range of design practice.
		</p>
	</section>

	<section class="section">
		<h2 class="section-title">Workshop Methodology</h2>
		<div class="card-grid">
			{#each capabilities as capability}
				<article class="card">
					<h3>{capability.title}</h3>
					<p>{capability.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Design Process</h2>
		<div class="card-grid">
			{#each workflow as block}
				<div class="card">
					<h3>{block.title}</h3>
					<ol>
						{#each block.steps as step}
							<li>{step}</li>
						{/each}
					</ol>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Technology Stack</h2>
		<div class="card-grid">
			{#each stack as item}
				<div class="card">
					<h3>{item.name}</h3>
					<p>{item.note}</p>
					<!-- {#if item.url}
						<a href={item.url} target="_blank" rel="noopener noreferrer" class="tech-link">Learn more →</a>
					{/if} -->
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">AI Pipeline</h2>
		<div class="pipeline-description">
			<p>
				The AI pipeline uses ComfyUI to orchestrate a sophisticated image-to-image transformation workflow powered by Stable Diffusion XL:
			</p>
			
			<div class="pipeline-steps">
				<div class="pipeline-step" data-step="1">
					<h3>Input Processing</h3>
					<p>Your uploaded or captured image is resized to 1024×1024 pixels and encoded into latent space using VAE (Variational Autoencoder) for efficient processing.</p>
				</div>
				
				<div class="pipeline-step" data-step="2">
					<h3>IP-Adapter Conditioning</h3>
					<p>The input image is processed through IP-Adapter, which extracts visual features and conditions the generation to maintain structural similarity while allowing creative transformation.</p>
				</div>
				
				<div class="pipeline-step" data-step="3">
					<h3>Model Enhancement</h3>
					<p>The base JuggernautXL model is enhanced with a detail-focused LoRA (Low-Rank Adaptation) that improves texture and fine detail generation.</p>
				</div>
				
				<div class="pipeline-step" data-step="4">
					<h3>Text Guidance</h3>
					<p>Your prompt is encoded and combined with the visual conditioning. The familiarity slider controls the denoising strength, balancing between faithful reproduction and creative interpretation.</p>
				</div>
				
				<div class="pipeline-step" data-step="5">
					<h3>Diffusion Sampling</h3>
					<p>The KSampler uses DPM++ 2M with Karras scheduling for 20 steps at CFG 6.5, generating the final transformed image through iterative denoising.</p>
				</div>
				
				<div class="pipeline-step" data-step="6">
					<h3>Output Decoding</h3>
					<p>The latent result is decoded back to pixel space and returned as your transformed image.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Team</h2>
		<div class="card-grid">
			{#each contributors as contributor}
				<div class="card">
					<h3>{contributor.name}</h3>
					<p>{contributor.role}</p>
				</div>
			{/each}
		</div>
		<p class="cta">
			View the broader research program at
			<a href="https://aid-lab.hfg-gmuend.de" target="_blank" rel="noopener noreferrer">AI+Design Lab ↗</a>
		</p>
	</section>

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

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		width: 100%;
		max-width: 1200px;
	}

	.title {
		font-size: 2rem;
		font-weight: 300;
		font-style: italic;
		font-family: ui-sans-serif, system-ui, sans-serif;
		color: white;
		margin: 0;
	}

	.back-link {
		padding: 0.75rem 1.5rem;
		border-radius: 2rem;
		background-color: #5757578a;
		/* color: var(--color-accent); */
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		font-size: 0.9rem;
		white-space: nowrap;
	}	
	.back-link:hover {
		background-color: var(--color-accent);
		color: white;
	}

	.hero,
	.section {
		width: 100%;
		max-width: 1200px;
		color: rgba(255, 255, 255, 0.9);
	}

	.hero {
		margin-bottom: 2.5rem;
	}

	.lead {
		font-size: 1.3rem;
		line-height: 1.9;
		max-width: 900px;
		margin: 0;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-accent);
		margin: 0;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.card h3 {
		margin: 0;
		font-size: 1.2rem;
		color: white;
	}

	.card p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.7;
	}

	.cta {
		margin-top: 1rem;
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.cta a {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		padding-bottom: 0.1rem;
	}

	.pipeline-description {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		font-size: 1rem;
		line-height: 1.6;
	}

	.pipeline-description p {
		margin: 0 0 1.5rem 0;
		color: rgba(255, 255, 255, 0.85);
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.pipeline-steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.pipeline-step {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 1.75rem;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.pipeline-step::before {
		content: attr(data-step);
		position: absolute;

		width: 2rem;
		height: 2rem;
		background: var(--color-accent);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		font-weight: 600;
		z-index: 1;
	}

	.pipeline-step h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
		color: white;
		font-weight: 600;
		padding-left: 3rem;
	}

	.pipeline-step p {
		margin: 0;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	@media (max-width: 600px) {
		.title {
			font-size: 1.75rem;
		}

		.lead {
			font-size: 1.1rem;
		}

		.section-title {
			font-size: 1.3rem;
		}

		.card {
			padding: 1.25rem;
		}

		.pipeline-steps {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.pipeline-step {
			padding: 1.5rem;
		}
	}
</style>
