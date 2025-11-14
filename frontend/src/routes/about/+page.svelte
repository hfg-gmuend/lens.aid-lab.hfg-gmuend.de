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
		{ name: 'Konva', url: 'https://konvajs.org', note: 'Interactive canvas visualization' },
		{ name: 'IndexedDB', url: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API', note: 'Client-side history storage' },
		{ name: 'FastAPI', url: 'https://fastapi.tiangolo.com', note: 'Orchestrates ComfyUI pipelines' },
		{ name: 'ComfyUI', url: 'https://comfyui.com', note: 'Diffusion workflow backend' }
	];

	const contributors = [
		{ name: 'Jordi Trost', role: 'Concept & Workshop' },
		{ name: 'Christopher Pietsch', role: 'Concept & Engineering' }
	];
</script>

<div class="about-container">
	<div class="header">
		<h1 class="title">About Futures Lens</h1>
		<a href="{base}/" class="back-link">← Back to App</a>
	</div>

	<section class="hero">
		<p class="lead">
			Futures Lens is a speculative design tool that helps studios and classrooms prototype alternative futures.
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
		<div class="workflow-grid">
			{#each workflow as block}
				<div class="workflow-card">
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
		<h2 class="section-title">Technology stack</h2>
		<ul class="stack-list">
			{#each stack as item}
				<li>
					<a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
					<span>— {item.note}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section class="section">
		<h2 class="section-title">Team</h2>
		<ul class="contributors">
			{#each contributors as contributor}
				<li>
					<strong>{contributor.name}</strong>
					<span>{contributor.role}</span>
				</li>
			{/each}
		</ul>
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
	.section,
	.cta-panel {
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

	.card:hover {
		border-color: var(--color-accent);
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

	.workflow-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.workflow-card {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.workflow-card h3 {
		margin: 0;
		font-size: 1.1rem;
		color: white;
	}

	.workflow-card ol {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.stack-list,
	.contributors {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		font-size: 1rem;
	}

	.stack-list li,
	.contributors li {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	.stack-list a {
		color: white;
		text-decoration: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}

	.stack-list a:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.stack-list span {
		color: rgba(255, 255, 255, 0.6);
	}

	.contributors strong {
		color: white;
	}

	.contributors span {
		color: rgba(255, 255, 255, 0.6);
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

	.cta a:hover {
		border-color: var(--color-accent);
	}

	.cta-panel {
		margin-top: 4rem;
		background: rgba(255, 255, 255, 0.04);
		border-radius: 1.25rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
	}

	.cta-panel h2 {
		margin: 0;
		color: white;
		font-size: 1.6rem;
	}

	.cta-panel p {
		margin: 0;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.6;
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cta-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		border-radius: 0.75rem;
		border: 1px solid var(--color-accent);
		color: white;
		text-decoration: none;
		font-weight: 500;
	}

	.cta-link:hover {
		background-color: var(--color-accent);
	}

	.cta-link.secondary {
		border-color: rgba(255, 255, 255, 0.4);
		color: rgba(255, 255, 255, 0.85);
	}

	.cta-link.secondary:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
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

		.card,
		.workflow-card,
		.cta-panel {
			padding: 1.25rem;
		}
	}
</style>
