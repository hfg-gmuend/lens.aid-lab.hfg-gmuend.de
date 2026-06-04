<script>
	import { tick } from 'svelte';

	const CARDS = {
		future: [
			{ display: 'In a BEAUTIFUL future', keyword: 'BEAUTIFUL' },
			{ display: 'In a BIZARRE future', keyword: 'BIZARRE' },
			{ display: 'In a BRIGHT future', keyword: 'BRIGHT' },
			{ display: 'In a CREATIVE future', keyword: 'CREATIVE' },
			{ display: 'In a DECOLONIZED future', keyword: 'DECOLONIZED' },
			{ display: 'In a DEPRESSING future', keyword: 'DEPRESSING' },
			{ display: 'In a FAIR future', keyword: 'FAIR' },
			{ display: 'In a FAST future', keyword: 'FAST' },
			{ display: 'In a FEMINIST future', keyword: 'FEMINIST' },
			{ display: 'In a FREE future', keyword: 'FREE' },
			{ display: 'In a GLOBAL future', keyword: 'GLOBAL' },
			{ display: 'In a GRASSROOTS future', keyword: 'GRASSROOTS' },
			{ display: 'In a GREEN future', keyword: 'GREEN' },
			{ display: 'In a HIGH-TECH future', keyword: 'HIGH-TECH' },
			{ display: 'In a HILARIOUS future', keyword: 'HILARIOUS' },
			{ display: 'In an INNOVATIVE future', keyword: 'INNOVATIVE' },
			{ display: 'In a JOYFUL future', keyword: 'JOYFUL' },
			{ display: 'In a MUNDANE future', keyword: 'MUNDANE' },
			{ display: 'In a NOIR future', keyword: 'NOIR' },
			{ display: 'In a PLAYFUL future', keyword: 'PLAYFUL' },
			{ display: 'In a QUEER future', keyword: 'QUEER' },
			{ display: 'In a REACTIONARY future', keyword: 'REACTIONARY' },
			{ display: 'In a RECOVERING future', keyword: 'RECOVERING' },
			{ display: 'In a REGIMENTED future', keyword: 'REGIMENTED' },
			{ display: 'In a RESILIENT future', keyword: 'RESILIENT' },
			{ display: 'In a SAD future', keyword: 'SAD' },
			{ display: 'In a SCARY future', keyword: 'SCARY' },
			{ display: 'In a SELFISH future', keyword: 'SELFISH' },
			{ display: 'In a SMART future', keyword: 'SMART' },
			{ display: 'In a STERILE future', keyword: 'STERILE' },
			{ display: 'In a THRILLING future', keyword: 'THRILLING' },
			{ display: 'In a VOLATILE future', keyword: 'VOLATILE' },
			{ display: 'In a WILD future', keyword: 'WILD' },
			{ display: 'In a WISE future', keyword: 'WISE' }
		],
		thing: [
			{ display: 'there is an ANNOUNCEMENT', keyword: 'ANNOUNCEMENT' },
			{ display: 'there is an APP', keyword: 'APP' },
			{ display: 'there is a BESTSELLER', keyword: 'BESTSELLER' },
			{ display: 'there is a BREAKTHROUGH', keyword: 'BREAKTHROUGH' },
			{ display: 'there is a BUILDING', keyword: 'BUILDING' },
			{ display: 'there is a DEVICE', keyword: 'DEVICE' },
			{ display: 'there is a DISASTER', keyword: 'DISASTER' },
			{ display: 'there is a DRUG', keyword: 'DRUG' },
			{ display: 'there is a FESTIVAL', keyword: 'FESTIVAL' },
			{ display: 'there is a FLAG', keyword: 'FLAG' },
			{ display: 'there is a FOOD', keyword: 'FOOD' },
			{ display: 'there is a GAME', keyword: 'GAME' },
			{ display: 'there is a GARMENT', keyword: 'GARMENT' },
			{ display: 'there is a HEADLINE', keyword: 'HEADLINE' },
			{ display: 'there is an HEIRLOOM', keyword: 'HEIRLOOM' },
			{ display: 'there is an INVENTION', keyword: 'INVENTION' },
			{ display: 'there is a JOB', keyword: 'JOB' },
			{ display: 'there is a KIT', keyword: 'KIT' },
			{ display: 'there is a LAW', keyword: 'LAW' },
			{ display: 'there is a MACHINE', keyword: 'MACHINE' },
			{ display: 'there is a MAP', keyword: 'MAP' },
			{ display: 'there is a MASK', keyword: 'MASK' },
			{ display: 'there is a MONUMENT', keyword: 'MONUMENT' },
			{ display: 'there is a NEWS REPORT', keyword: 'NEWS REPORT' },
			{ display: 'there is an ORGANIZATION', keyword: 'ORGANIZATION' },
			{ display: 'there is a PLAYTHING', keyword: 'PLAYTHING' },
			{ display: 'there is a POSTER', keyword: 'POSTER' },
			{ display: 'there is a PRODUCT', keyword: 'PRODUCT' },
			{ display: 'there is a PUBLIC SERVICE', keyword: 'PUBLIC SERVICE' },
			{ display: 'there is a RITUAL', keyword: 'RITUAL' },
			{ display: 'there is a SONG', keyword: 'SONG' },
			{ display: 'there is a TATTOO', keyword: 'TATTOO' },
			{ display: 'there is a TOOL', keyword: 'TOOL' },
			{ display: 'there is a VIDEO', keyword: 'VIDEO' },
			{ display: 'there is a WEAPON', keyword: 'WEAPON' }
		],
		theme: [
			{ display: 'related to ANIMALS — what is it?', keyword: 'ANIMALS' },
			{
				display: 'related to ARTIFICIAL INTELLIGENCE — what is it?',
				keyword: 'ARTIFICIAL INTELLIGENCE'
			},
			{ display: 'related to CITIES — what is it?', keyword: 'CITIES' },
			{ display: 'related to CLASS — what is it?', keyword: 'CLASS' },
			{ display: 'related to CLIMATE CHANGE — what is it?', keyword: 'CLIMATE CHANGE' },
			{ display: 'related to DEATH — what is it?', keyword: 'DEATH' },
			{ display: 'related to EDUCATION — what is it?', keyword: 'EDUCATION' },
			{ display: 'related to ENERGY — what is it?', keyword: 'ENERGY' },
			{ display: 'related to FAMILY — what is it?', keyword: 'FAMILY' },
			{ display: 'related to FARMING — what is it?', keyword: 'FARMING' },
			{ display: 'related to GENETICS — what is it?', keyword: 'GENETICS' },
			{ display: 'related to GOVERNANCE — what is it?', keyword: 'GOVERNANCE' },
			{ display: 'related to HEALTH — what is it?', keyword: 'HEALTH' },
			{ display: 'related to IDENTITY — what is it?', keyword: 'IDENTITY' },
			{ display: 'related to IMAGINATION — what is it?', keyword: 'IMAGINATION' },
			{ display: 'related to JUSTICE — what is it?', keyword: 'JUSTICE' },
			{ display: 'related to LEISURE — what is it?', keyword: 'LEISURE' },
			{ display: 'related to LOVE — what is it?', keyword: 'LOVE' },
			{ display: 'related to MEMORY — what is it?', keyword: 'MEMORY' },
			{ display: 'related to MONEY — what is it?', keyword: 'MONEY' },
			{ display: 'related to RELIGION — what is it?', keyword: 'RELIGION' },
			{ display: 'related to RESOURCES — what is it?', keyword: 'RESOURCES' },
			{ display: 'related to SCIENCE — what is it?', keyword: 'SCIENCE' },
			{ display: 'related to SPACE — what is it?', keyword: 'SPACE' },
			{ display: 'related to SPIRITUALITY — what is it?', keyword: 'SPIRITUALITY' },
			{ display: 'related to STORYTELLING — what is it?', keyword: 'STORYTELLING' },
			{ display: 'related to SURVEILLANCE — what is it?', keyword: 'SURVEILLANCE' },
			{ display: 'related to THE ECONOMY — what is it?', keyword: 'THE ECONOMY' },
			{ display: 'related to THE ENVIRONMENT — what is it?', keyword: 'THE ENVIRONMENT' },
			{ display: 'related to THE OCEAN — what is it?', keyword: 'THE OCEAN' },
			{ display: 'related to TRANSPORTATION — what is it?', keyword: 'TRANSPORTATION' },
			{ display: 'related to WAR — what is it?', keyword: 'WAR' },
			{ display: 'related to WATER — what is it?', keyword: 'WATER' },
			{ display: 'related to WORK — what is it?', keyword: 'WORK' }
		]
	};

	// Pre-build the deck pages (4×3 grid, 12 cards per page) used by the deck print view.
	const sections = [
		{ suit: 'future', letter: 'F', label: 'Future', key: 'future' },
		{ suit: 'thing', letter: 'T', label: 'Thing', key: 'thing' },
		{ suit: 'concept', letter: 'C', label: 'Concept', key: 'theme' }
	];
	const perPage = 12;
	const deckPages = [];
	for (const sec of sections) {
		const items = CARDS[sec.key];
		for (let p = 0; p < items.length; p += perPage) {
			deckPages.push({
				type: 'cards',
				suit: sec.suit,
				letter: sec.letter,
				label: sec.label,
				items: items.slice(p, p + perPage)
			});
		}
		deckPages.push({ type: 'blank', suit: sec.suit, letter: sec.letter, label: sec.label });
	}

	let selected = $state({ future: null, thing: null, theme: null });
	let spinning = $state({ future: false, thing: false, theme: false });

	let promptActive = $state(false);
	let deckActive = $state(false);
	let playsheetActive = $state(false);

	function drawCard(suit) {
		const pool = CARDS[suit];
		const item = pool[Math.floor(Math.random() * pool.length)];
		selected[suit] = item;
		spinning[suit] = true;
		setTimeout(() => (spinning[suit] = false), 300);
	}

	function drawAll() {
		['future', 'thing', 'theme'].forEach((s, i) => setTimeout(() => drawCard(s), i * 110));
	}

	function resetAll() {
		selected.future = null;
		selected.thing = null;
		selected.theme = null;
	}

	function selectFromList(suit, item) {
		selected[suit] = item;
	}

	async function printPrompt() {
		if (!selected.future || !selected.thing || !selected.theme) {
			alert('Please draw all three cards first.');
			return;
		}
		promptActive = true;
		await tick();
		window.print();
		promptActive = false;
	}

	async function printPlaysheet() {
		playsheetActive = true;
		await tick();
		window.print();
		playsheetActive = false;
	}

	async function printDeck() {
		deckActive = true;
		await tick();
		window.print();
		deckActive = false;
	}
</script>

<svelte:head>
	<title>Thing From The Future · Otherwhere Edition</title>
</svelte:head>

<!-- On-screen card value (theme breaks before the em-dash) -->
{#snippet cardValue(suit, item)}
	{#if suit === 'theme'}
		{@const parts = item.display.split(' — ')}{parts[0]}<br />— {parts[1]}
	{:else}
		{item.display}
	{/if}
{/snippet}

<!-- Coloured keyword inside the prompt sentence -->
{#snippet kwSpan(item, cls)}
	{@const idx = item.display.indexOf(item.keyword)}{item.display.slice(0, idx)}<span class={cls}
		>{item.keyword}</span
	>{item.display.slice(idx + item.keyword.length)}
{/snippet}

<!-- Print card value (bold keyword, concept breaks before the em-dash) -->
{#snippet pcVal(suit, item)}
	{@const idx = item.display.indexOf(item.keyword)}{@const before = item.display.slice(
		0,
		idx
	)}{@const after = item.display.slice(idx + item.keyword.length)}{before}<span class="kw"
		>{item.keyword}</span
	>{#if suit === 'concept'}{@const a = after.split(' — ')}{a[0]}<br />— {a[1]}{:else}{after}{/if}
{/snippet}

<!-- Blank template card value -->
{#snippet blankVal(suit)}
	{#if suit === 'future'}In a
		<div class="blank-line"></div>
		future{:else if suit === 'thing'}there is a
		<div class="blank-line"></div>{:else}related to
		<div class="blank-line"></div>
		— what is it?{/if}
{/snippet}

{#snippet printCard(suit, item, letter, label)}
	<div class="pc {suit}">
		<div class="pc-ltr">{letter}</div>
		<div class="pc-label">{label}</div>
		<div class="pc-val">{@render pcVal(suit, item)}</div>
	</div>
{/snippet}

{#snippet blankCard(suit, letter, label)}
	<div class="pc {suit}">
		<div class="pc-ltr">{letter}</div>
		<div class="pc-label">{label}</div>
		<div class="pc-blank-val">{@render blankVal(suit)}</div>
	</div>
{/snippet}

<header>
	<div class="logo">Design Futuring Workshop</div>
	<h1>The Thing From The Future<br /><span>Otherwhere Edition</span></h1>
	<p class="subtitle">Generate prompts for artefacts from otherwhere futures</p>
</header>

<main>
	<p class="mode-desc">
		Click a card to draw, or use <strong>↻ Shuffle All</strong> for a full prompt.
		<strong>Future</strong> describes the world,
		<strong>Thing</strong> the artefact,
		<strong>Concept</strong> the context.
	</p>

	<div class="cards-grid three-col">
		<div
			class="card-slot future"
			class:spinning={spinning.future}
			onclick={() => drawCard('future')}
		>
			<div class="card-letter">F</div>
			<div class="card-label">Future</div>
			<div class="card-value" class:empty={!selected.future}>
				{#if selected.future}{selected.future.display}{:else}— click —{/if}
			</div>
		</div>
		<div class="card-slot thing" class:spinning={spinning.thing} onclick={() => drawCard('thing')}>
			<div class="card-letter">T</div>
			<div class="card-label">Thing</div>
			<div class="card-value" class:empty={!selected.thing}>
				{#if selected.thing}{selected.thing.display}{:else}— click —{/if}
			</div>
		</div>
		<div class="card-slot theme" class:spinning={spinning.theme} onclick={() => drawCard('theme')}>
			<div class="card-letter">C</div>
			<div class="card-label">Concept</div>
			<div class="card-value" class:empty={!selected.theme}>
				{#if selected.theme}{@render cardValue('theme', selected.theme)}{:else}— click —{/if}
			</div>
		</div>
	</div>

	<div class="prompt-box">
		<div class="prompt-label">Your Prompt</div>
		<div class="prompt-text">
			{#if !selected.future && !selected.thing && !selected.theme}
				<span class="prompt-empty">Shuffle the cards to generate a prompt …</span>
			{:else if !selected.future || !selected.thing || !selected.theme}
				<span class="prompt-empty">Not all cards drawn yet …</span>
			{:else}
				{@render kwSpan(selected.future, 'ph-future')}, {@render kwSpan(
					selected.thing,
					'ph-thing'
				)}, {@render kwSpan(selected.theme, 'ph-concept')}
			{/if}
		</div>
	</div>

	<div class="btn-row">
		<button class="btn btn-primary" onclick={drawAll}>↻ Shuffle All</button>
		<button class="btn btn-secondary" onclick={resetAll}>Reset</button>
		<button class="btn btn-secondary" onclick={printPrompt} title="Print current prompt">
			⎙ Print Prompt
		</button>
		<button class="btn btn-secondary" onclick={printDeck} title="Print all cards">
			⎙ Print Deck
		</button>
		<button class="btn btn-secondary" onclick={printPlaysheet} title="Print playsheet">
			⎙ Print Playsheet
		</button>
	</div>

	<hr class="section-divider" />

	<div class="card-list-title">All cards — click to select manually</div>
	<div class="lists-grid">
		<div class="list-group future">
			<div class="list-group-header">Future</div>
			<div class="list-items">
				{#each CARDS.future as item}
					<div
						class="list-item"
						class:selected={selected.future?.display === item.display}
						onclick={() => selectFromList('future', item)}
					>
						{item.display}
					</div>
				{/each}
			</div>
		</div>
		<div class="list-group thing">
			<div class="list-group-header">Thing</div>
			<div class="list-items">
				{#each CARDS.thing as item}
					<div
						class="list-item"
						class:selected={selected.thing?.display === item.display}
						onclick={() => selectFromList('thing', item)}
					>
						{item.display}
					</div>
				{/each}
			</div>
		</div>
		<div class="list-group theme">
			<div class="list-group-header">Concept</div>
			<div class="list-items">
				{#each CARDS.theme as item}
					<div
						class="list-item"
						class:selected={selected.theme?.display === item.display}
						onclick={() => selectFromList('theme', item)}
					>
						{item.display}
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

<footer>
	<div class="footer-inner">
		<p>
			Made by <a href="https://benedikt-gross.de/" target="_blank">Benedikt Groß</a> &amp; Jordi Tost,
			Workshop "Things from Otherwhere — Co-speculating with AI", 8 – 12 Jun 2026, @ MA Digital and Interaction
			Design, Politecnico di Milano
		</p>
		<p>
			Based on Candy, S. and Watson, J. (2018)
			<em>The Thing from the Future: Second Edition</em> (Card game). Pittsburgh: Situation Lab.
		</p>
	</div>
</footer>

<!-- PROMPT PRINT AREA (hidden, shown only on print) -->
<div class="print-prompt-area" class:active={promptActive}>
	<div class="pp-cards">
		{#if selected.future && selected.thing && selected.theme}
			{@render printCard('future', selected.future, 'F', 'Future')}
			{@render printCard('thing', selected.thing, 'T', 'Thing')}
			{@render printCard('concept', selected.theme, 'C', 'Concept')}
		{/if}
	</div>
	<div class="pp-sentence">
		{#if selected.future && selected.thing && selected.theme}
			<p>
				{@render kwSpan(selected.future, 'ph-future')}, {@render kwSpan(
					selected.thing,
					'ph-thing'
				)}, {@render kwSpan(selected.theme, 'ph-concept')}
			</p>
		{/if}
	</div>
</div>

<!-- DECK PRINT AREA (hidden, shown only on print) -->
<div class="print-deck-area" class:active={deckActive}>
	{#each deckPages as page}
		<div class="pd-page">
			{#if page.type === 'cards'}
				{#each page.items as item}
					{@render printCard(page.suit, item, page.letter, page.label)}
				{/each}
			{:else}
				{#each Array.from({ length: 12 }) as _}
					{@render blankCard(page.suit, page.letter, page.label)}
				{/each}
			{/if}
		</div>
	{/each}
</div>

<!-- PLAYSHEET PRINT AREA (hidden, shown only on print) -->
<div class="print-playsheet-area" class:active={playsheetActive}>
	<div class="ps-header">
		<div class="ps-header-title">
			<div class="ps-title">The Thing From The Future</div>
		</div>
		<div class="ps-header-fields">
			<div class="ps-field ps-field-name">
				<span class="ps-field-label">Name</span>
				<div class="ps-field-line"></div>
			</div>
			<div class="ps-field ps-field-date">
				<span class="ps-field-label">Date</span>
				<div class="ps-field-line"></div>
			</div>
		</div>
	</div>

	<div class="ps-cards">
		<div class="pc future ps-blank">
			<div class="pc-ltr">F</div>
			<div class="pc-label">Future</div>
			<div class="ps-blank-value"></div>
		</div>
		<div class="pc thing ps-blank">
			<div class="pc-ltr">T</div>
			<div class="pc-label">Thing</div>
			<div class="ps-blank-value"></div>
		</div>
		<div class="pc concept ps-blank">
			<div class="pc-ltr">C</div>
			<div class="pc-label">Concept</div>
			<div class="ps-blank-value"></div>
		</div>
	</div>

	<div class="ps-bottom">
		<div class="ps-description">
			<div class="ps-block-title">Description</div>
			<div class="ps-lines">
				<div class="ps-line"></div>
				<div class="ps-line"></div>
				<div class="ps-line"></div>
				<div class="ps-line"></div>
				<div class="ps-line"></div>
				<div class="ps-line"></div>
				<div class="ps-line"></div>
				<div class="ps-line"></div>
			</div>
		</div>
		<div class="ps-sketch">
			<div class="ps-block-title">Sketch</div>
			<div class="ps-sketch-area"></div>
		</div>
	</div>
</div>

<style>
	header {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: 2.5rem 2rem 1.8rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface);
	}

	.logo {
		font-family: 'Geist Mono', monospace;
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.35em;
		color: var(--muted);
		text-transform: uppercase;
		margin-bottom: 0.6rem;
	}

	h1 {
		font-family: 'Geist', sans-serif;
		font-size: clamp(1.8rem, 5vw, 3.2rem);
		font-weight: 800;
		line-height: 1;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	h1 span {
		color: var(--accent1);
	}

	.subtitle {
		margin-top: 0.5rem;
		font-family: 'Geist Mono', monospace;
		font-size: 0.68rem;
		color: var(--muted);
		letter-spacing: 0.04em;
	}

	main {
		position: relative;
		z-index: 1;
		max-width: 920px;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	.mode-desc {
		text-align: center;
		font-family: 'Geist Mono', monospace;
		font-size: 0.68rem;
		color: var(--muted);
		margin: 2.5rem auto 2.5rem;
		line-height: 1.9;
		max-width: 600px;
	}
	.mode-desc strong {
		color: var(--accent1);
		font-weight: 500;
	}

	.cards-grid {
		display: grid;
		gap: 0;
		border: 1.5px solid var(--border-strong);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 1.5rem;
		background: var(--border-strong);
	}
	.cards-grid.three-col {
		grid-template-columns: repeat(3, 1fr);
	}

	.card-slot {
		padding: 1.4rem 1rem 1.2rem;
		min-height: 170px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		cursor: pointer;
		transition:
			filter 0.15s,
			transform 0.12s;
		position: relative;
		overflow: hidden;
	}
	.card-slot:hover {
		filter: brightness(0.96);
		transform: scale(1.015);
		z-index: 2;
	}

	.card-slot.future {
		background: var(--card-a-bg);
		border-top: 3px solid var(--accent1);
	}
	.card-slot.thing {
		background: var(--card-o-bg);
		border-top: 3px solid var(--accent3);
	}
	.card-slot.theme {
		background: var(--card-t-bg);
		border-top: 3px solid var(--accent2);
	}

	.card-label {
		font-family: 'Geist Mono', monospace;
		font-size: 0.58rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		color: var(--muted);
		position: absolute;
		top: 0.75rem;
		left: 0.9rem;
	}

	.card-letter {
		font-family: 'Geist', sans-serif;
		font-size: 3rem;
		font-weight: 800;
		line-height: 1;
		position: absolute;
		top: 0.4rem;
		right: 0.7rem;
		opacity: 0.07;
		color: var(--text);
	}

	.card-value {
		font-family: 'Geist', sans-serif;
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		font-weight: 700;
		line-height: 1.25;
		color: var(--text);
		min-height: 2.8em;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 1;
		padding: 0 0.2rem;
	}
	.card-value.empty {
		color: var(--border-strong);
		font-family: 'Geist Mono', monospace;
		font-size: 0.65rem;
		font-weight: 400;
	}

	.card-hint {
		font-family: 'Geist Mono', monospace;
		font-size: 0.57rem;
		color: var(--muted);
		letter-spacing: 0.03em;
		position: relative;
		z-index: 1;
		margin-top: 0.2rem;
	}

	.prompt-box {
		border: 1.5px solid var(--border-strong);
		border-radius: 8px;
		padding: 1.4rem 1.6rem;
		background: var(--surface);
		margin-bottom: 1.4rem;
		position: relative;
		overflow: hidden;
	}
	.prompt-box::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--accent1), var(--accent3), var(--accent2));
	}

	.prompt-label {
		font-family: 'Geist Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.15em;
		color: var(--muted);
		margin-bottom: 0.7rem;
	}

	.prompt-text {
		font-family: 'Geist', sans-serif;
		font-size: clamp(1rem, 2.2vw, 1.3rem);
		font-weight: 400;
		line-height: 1.65;
		color: var(--text2);
	}
	.prompt-text strong {
		color: var(--accent2);
		font-weight: 700;
	}
	.prompt-text em {
		color: var(--accent1);
		font-style: normal;
		font-weight: 700;
	}
	.prompt-text u {
		text-decoration: none;
		color: var(--accent3);
		font-weight: 700;
	}
	.prompt-text b {
		color: var(--accent4);
		font-weight: 700;
	}

	/* Keyword highlights in prompt */
	.ph-future {
		color: var(--accent1);
		font-weight: 700;
	}
	.ph-thing {
		color: var(--accent3);
		font-weight: 700;
	}
	.ph-concept {
		color: var(--accent2);
		font-weight: 700;
	}

	.prompt-empty {
		font-family: 'Geist Mono', monospace;
		color: var(--border-strong);
		font-size: 0.72rem;
		font-style: italic;
	}

	.btn-row {
		display: flex;
		gap: 0.7rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		font-family: 'Geist', sans-serif;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		padding: 0.75rem 2rem;
		border-radius: 5px;
		cursor: pointer;
		transition: all 0.15s;
		border: none;
	}
	.btn-primary {
		background: var(--accent1);
		color: #fff;
	}
	.btn-primary:hover {
		background: #5248e0;
		transform: translateY(-1px);
	}
	.btn-secondary {
		background: transparent;
		color: var(--text2);
		border: 1.5px solid var(--border-strong);
	}
	.btn-secondary:hover {
		border-color: var(--accent1);
		color: var(--accent1);
		background: var(--card-a-bg);
	}

	.section-divider {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2.5rem 0;
	}

	.card-list-title {
		font-family: 'Geist Mono', monospace;
		font-size: 0.6rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		color: var(--muted);
		margin-bottom: 1.2rem;
		text-align: center;
	}

	.lists-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.list-group {
		border: 1.5px solid var(--border);
		border-radius: 6px;
		overflow: hidden;
		background: var(--surface);
	}

	.list-group-header {
		padding: 0.55rem 0.9rem;
		font-family: 'Geist', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		border-bottom: 1px solid var(--border);
	}

	.list-group.arc .list-group-header,
	.list-group.future .list-group-header {
		background: var(--card-a-bg);
		color: var(--accent1);
	}
	.list-group.terrain .list-group-header,
	.list-group.theme .list-group-header {
		background: var(--card-t-bg);
		color: var(--accent2);
	}
	.list-group.object .list-group-header,
	.list-group.thing .list-group-header {
		background: var(--card-o-bg);
		color: var(--accent3);
	}
	.list-group.mood .list-group-header {
		background: var(--card-m-bg);
		color: var(--accent4);
	}
	.list-items {
		padding: 0.3rem 0;
		max-height: 210px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.list-item {
		padding: 0.28rem 0.9rem;
		font-family: 'Geist', sans-serif;
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--text2);
		cursor: pointer;
		transition:
			background 0.1s,
			color 0.1s;
		border-left: 2px solid transparent;
		line-height: 1.5;
	}
	.list-item:hover {
		background: var(--surface2);
	}

	.list-group.arc .list-item:hover,
	.list-group.future .list-item:hover {
		color: var(--accent1);
		border-left-color: var(--accent1);
	}
	.list-group.terrain .list-item:hover,
	.list-group.theme .list-item:hover {
		color: var(--accent2);
		border-left-color: var(--accent2);
	}
	.list-group.object .list-item:hover,
	.list-group.thing .list-item:hover {
		color: var(--accent3);
		border-left-color: var(--accent3);
	}
	.list-group.mood .list-item:hover {
		color: var(--accent4);
		border-left-color: var(--accent4);
	}

	.list-group.arc .list-item.selected,
	.list-group.future .list-item.selected {
		color: var(--accent1);
		font-weight: 700;
		background: var(--card-a-bg);
		border-left-color: var(--accent1);
	}
	.list-group.terrain .list-item.selected,
	.list-group.theme .list-item.selected {
		color: var(--accent2);
		font-weight: 700;
		background: var(--card-t-bg);
		border-left-color: var(--accent2);
	}
	.list-group.object .list-item.selected,
	.list-group.thing .list-item.selected {
		color: var(--accent3);
		font-weight: 700;
		background: var(--card-o-bg);
		border-left-color: var(--accent3);
	}
	.list-group.mood .list-item.selected {
		color: var(--accent4);
		font-weight: 700;
		background: var(--card-m-bg);
		border-left-color: var(--accent4);
	}

	@keyframes cardFlip {
		0% {
			transform: scaleY(1);
		}
		40% {
			transform: scaleY(0);
			opacity: 0.3;
		}
		100% {
			transform: scaleY(1);
			opacity: 1;
		}
	}
	.card-slot.spinning .card-value {
		animation: cardFlip 0.28s ease;
	}

	footer {
		position: relative;
		z-index: 1;
		border-top: 1px solid var(--border);
		background: var(--surface);
		padding: 1.8rem 2rem;
	}
	.footer-inner {
		max-width: 920px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.footer-inner p {
		font-family: 'Geist', sans-serif;
		font-size: 0.72rem;
		font-weight: 400;
		color: var(--muted);
		line-height: 1.6;
	}
	footer a {
		color: var(--accent1);
		text-decoration: none;
	}
	footer a:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.cards-grid.three-col {
			grid-template-columns: repeat(1, 1fr);
		}
		.card-slot {
			min-height: 120px;
			padding: 1rem 0.8rem;
		}
	}

	/* =====================
   PRINT STYLES
===================== */

	.print-prompt-area,
	.print-deck-area,
	.print-playsheet-area {
		display: none;
	}

	@media print {
		@page {
			size: A4 landscape;
			margin: 8mm;
		}

		body > header,
		body > main,
		body > footer {
			display: none !important;
		}
		body {
			background: #fff;
		}
		body::before {
			display: none;
		}

		.print-prompt-area.active {
			display: flex !important;
		}
		.print-deck-area.active {
			display: block !important;
		}
		.print-playsheet-area.active {
			display: flex !important;
		}

		/* ---- Shared print card ---- */
		.pc {
			border: 1pt solid #ccc;
			border-radius: 3pt;
			padding: 5mm 6mm 5mm;
			position: relative;
			overflow: hidden;
			break-inside: avoid;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
		}
		/* Ghost letter watermark */
		.pc-ltr {
			position: absolute;
			top: 2mm;
			right: 3mm;
			font-family: 'Geist', sans-serif;
			font-size: 36pt;
			font-weight: 800;
			opacity: 0.06;
			line-height: 1;
			color: #000;
		}
		/* Label: same visual size as ghost letter, top-left */
		.pc-label {
			position: absolute;
			top: 3mm;
			left: 4mm;
			font-family: 'Geist', sans-serif;
			font-size: 12pt;
			font-weight: 700;
			letter-spacing: 0.06em;
			color: #bbb;
			line-height: 1;
		}
		/* Card value: centred, bold keyword via .kw span */
		.pc-val {
			font-family: 'Geist', sans-serif;
			font-weight: 400;
			color: #1a1814;
			line-height: 1.3;
			padding-top: 6mm; /* clear the label */
		}
		.pc-val .kw {
			font-weight: 700;
		}

		.pc.future {
			background: #e8f5ef;
			border-top: 3pt solid #2e7d5e;
		}
		.pc.thing {
			background: #faeaec;
			border-top: 3pt solid #b03040;
		}
		.pc.concept {
			background: #e8f0fa;
			border-top: 3pt solid #1a5fa8;
		}

		/* ---- PROMPT print ---- */
		/* Outer wrapper: column, full page */
		.print-prompt-area {
			width: 100%;
			height: 100vh;
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 0;
		}
		/* Top half: 3 cards side by side */
		.pp-cards {
			display: flex;
			flex-direction: row;
			gap: 5mm;
			height: 50%;
			align-items: stretch;
		}
		.pp-cards .pc {
			flex: 1;
			height: 100%;
		}
		.pp-cards .pc-val {
			font-size: 26pt;
		}
		.pp-cards .pc-label {
			font-size: 14pt;
		}
		/* Bottom half: sentence */
		.pp-sentence {
			height: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 8mm 10mm 4mm;
		}
		.pp-sentence p {
			font-family: 'Geist', sans-serif;
			font-size: 24pt;
			font-weight: 400;
			color: #4a4640;
			line-height: 1.6;
			text-align: center;
		}
		.pp-sentence .ph-future {
			color: #2e7d5e;
			font-weight: 700;
		}
		.pp-sentence .ph-thing {
			color: #b03040;
			font-weight: 700;
		}
		.pp-sentence .ph-concept {
			color: #1a5fa8;
			font-weight: 700;
		}

		/* ---- DECK print: 4×3 grid filling each page ---- */
		.print-deck-area {
			width: 100%;
		}
		.pd-page {
			width: 100%;
			height: 100vh;
			break-after: page;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-template-rows: repeat(3, 1fr);
			gap: 4mm;
			box-sizing: border-box;
		}
		.pd-page:last-child {
			break-after: avoid;
		}
		.pd-page .pc {
			height: 100%;
			width: 100%;
		}
		.pd-page .pc-val {
			font-size: 22pt;
		}
		.pd-page .pc-label {
			font-size: 12pt;
		}
		/* Blank template card */
		.pc-blank-val {
			font-family: 'Geist', sans-serif;
			font-size: 22pt;
			font-weight: 400;
			color: #1a1814;
			line-height: 1.5;
			text-align: center;
			width: 100%;
		}
		.pc-blank-val .blank-line {
			display: block;
			border-bottom: 1.5pt dashed #999;
			width: 80%;
			margin: 20mm auto 10mm;
		}
		.pc.concept .pc-blank-val .blank-line {
			margin: 13mm auto 7mm;
		}

		/* ---- PLAYSHEET print ---- */
		@page playsheet {
			size: A4 landscape;
			margin: 10mm;
		}
		.print-playsheet-area {
			page: playsheet;
		}
		.print-playsheet-area {
			width: 100%;
			height: 100vh;
			flex-direction: column;
			gap: 5mm;
			padding: 0;
		}
		/* Header: title block left, name/date fields right — all on one row */
		.ps-header {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			gap: 10mm;
			padding-bottom: 3mm;
			border-bottom: 0.5pt solid #ccc;
			flex-shrink: 0;
		}
		.ps-header-title {
			flex-shrink: 0;
		}
		.ps-title {
			font-family: 'Geist', sans-serif;
			font-size: 22pt;
			font-weight: 800;
			color: #1a1814;
			line-height: 1;
		}
		.ps-subtitle {
			font-family: 'Geist Mono', monospace;
			font-size: 7pt;
			letter-spacing: 0.2em;
			color: #bbb;
			margin-top: 1.5mm;
		}
		.ps-header-fields {
			display: flex;
			gap: 8mm;
			width: 50%;
			flex-shrink: 0;
			align-items: flex-end;
			margin-left: auto;
		}
		.ps-field {
			display: flex;
			align-items: baseline;
			gap: 2mm;
		}
		/* Name = 2x Date width */
		.ps-field-name {
			flex: 2;
		}
		.ps-field-date {
			flex: 1;
		}
		.ps-field-label {
			font-family: 'Geist Mono', monospace;
			font-size: 7pt;
			letter-spacing: 0.12em;
			color: #aaa;
			white-space: nowrap;
			flex-shrink: 0;
		}
		.ps-field-line {
			flex: 1;
			border-bottom: 0.75pt solid #ccc;
		}
		.ps-cards {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5mm;
			height: 34%;
			flex-shrink: 0;
		}
		.ps-cards .pc {
			height: 100%;
		}
		.ps-cards .pc-label {
			font-size: 14pt;
		}
		.ps-blank-value {
			flex: 1;
			width: 100%;
		}
		/* Use same grid as ps-cards so gutters align exactly */
		.ps-bottom {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5mm;
			flex: 1;
			min-height: 0;
		}
		/* Description = column 1 only */
		.ps-description {
			grid-column: 1;
			display: flex;
			flex-direction: column;
			outline: 1pt solid #ccc;
			border-radius: 3pt;
			padding: 4mm 5mm 5mm;
			background: #fff;
		}
		/* Sketch = columns 2–3 */
		.ps-sketch {
			grid-column: 2 / 4;
			display: flex;
			flex-direction: column;
			outline: 1pt solid #ccc;
			border-radius: 3pt;
			padding: 4mm 5mm 5mm;
			background: #fff;
		}
		.ps-block-title {
			font-family: 'Geist', sans-serif;
			font-size: 11pt;
			font-weight: 700;
			letter-spacing: 0.08em;
			color: #888;
			margin-bottom: 4mm;
			flex-shrink: 0;
		}
		.ps-lines {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			flex: 1;
		}
		.ps-line {
			border-bottom: 0.75pt solid #ccc;
			width: 100%;
			flex: 1;
			max-height: 10mm;
		}
		/* Sketch area: no border, just empty space */
		.ps-sketch-area {
			flex: 1;
		}
	}
</style>
