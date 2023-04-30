<script lang="ts">
	import WordCloud from '$lib/components/WordCloud.svelte';
	import { longText } from '$lib/data/text';
	import { getWordPoSFrequencyTable, getSentences, highlightWords } from '$lib/utils/string';

	let textContent = longText;
	let height = 500;
	let width: number;
	let detail: { x: number; y: number; word: string; sentences: number[] } | null;

	let minFontSize = 8;
	let maxFontSize = 90;
	let maxWords = 200;
	let wordPadding = 1;
	let timeout: NodeJS.Timeout;
	let pageWidth: number;

	$: popupX = (detail?.x ?? 0) + width / 2;

	$: fontSize = [minFontSize, maxFontSize];
	$: words = getWordPoSFrequencyTable(textContent, false, maxWords);
	$: popupStyle = detail
		? `top:${detail.y + height / 2}px;
		left:${popupX + 360 > pageWidth ? pageWidth - 360 : popupX}px; 
		transition: all 300ms ease;`
		: '';

	const displayTooltip = (event: CustomEvent<any>) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		const { x, y, text, sentences } = event.detail.word;
		detail = { x, y, word: text, sentences };
	};

	const hideTooltip = () => {
		timeout = setTimeout(() => {
			detail = null;
		}, 100);
	};

	// TODO: Figure out why I need this for the transition to work
	export const popup = (node: any, { delay = 0, duration = 250, x = 0, y = 0 }) => {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			delay,
			duration,
			css: (t: any) => `
        transform: ${transform} translate(${t * x}px, ${t * y}px);
        opacity: ${t};
      `
		};
	};
</script>

<svelte:head>
	<title>D3 Word Cloud</title>
</svelte:head>
<svelte:window bind:innerWidth={pageWidth} />

<main class="m-auto p-8 max-w-4xl text-sm">
	<article>
		<section class="my-8 text-center">
			<h1>D3 Svelte Word Cloud</h1>
		</section>

		<section class=" card shadow-md" bind:clientWidth={width}>
			<br />
			<WordCloud
				{fontSize}
				data={words}
				{width}
				{height}
				{wordPadding}
				on:focus={displayTooltip}
				on:focusout={hideTooltip}
				on:click={displayTooltip}
			/>

			{#if detail}
				<div
					class="w-80 max-h-80 overflow-y-scroll absolute z-index text-black bg-white border border-black p-4 z-[999]"
					style={popupStyle}
					transition:popup={{ delay: 0, duration: 300, x: 0, y: 0 }}
				>
					<p class="!text-sm pb-2"><b>{detail.word}</b></p>
					{#each getSentences(textContent, detail.sentences) as sentence}
						<p class="!text-sm pb-2">{@html highlightWords(detail.word, sentence)}</p>
					{/each}
				</div>
			{/if}
		</section>

		<!-- TODO: Improve options list -->
		<section class="my-8 card bg-white shadow-md z-10">
			<h3 class="p-4">Options</h3>
			<hr />
			<div class="p-4 grid grid-cols-2">
				<label class="label m-4">
					<span class="label-text">Minimum Font Size ({minFontSize}px)</span>
					<input
						class="input input-bordered"
						type="range"
						min="8"
						max="90"
						step="1"
						bind:value={minFontSize}
						style="width: 100%;"
					/>
				</label>

				<label class="label m-4">
					<span class="label-text">Maximum Font Size ({maxFontSize}px)</span>
					<input
						class="input input-bordered"
						type="range"
						min="8"
						max="90"
						step="1"
						bind:value={maxFontSize}
						style="width: 100%;"
					/>
				</label>
				<label class="label m-4">
					<span class="label-text">Max Words</span>
					<input
						class="input input-bordered text-sm border border-black"
						type="number"
						min="0"
						max="1000"
						step="10"
						bind:value={maxWords}
						style="width: 100%;"
					/>
				</label>
				<label class="label m-4">
					<span class="label-text">Word Padding</span>
					<input
						class="input input-bordered text-sm border border-black"
						type="number"
						min="0"
						max="100"
						step="1"
						bind:value={wordPadding}
						style="width: 100%;"
					/>
				</label>
			</div>
		</section>

		<section class=" card my-8 bg-white shadow-md z-10">
			<h3 class="p-4">Text</h3>
			<label class="label">
				<textarea
					class="textarea !bg-white border-r-0 px-4 py-8 text-sm"
					bind:value={textContent}
					rows="16"
					placeholder="Add your text here"
				/>
			</label>
		</section>
	</article>
</main>

<!-- <div>
	used for debugging
	{JSON.stringify(words)}
</div> -->
