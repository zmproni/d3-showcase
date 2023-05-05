<script lang="ts">
	import WordCloud from '$lib/components/WordCloud.svelte';
	import { getSentences, highlightWords } from '$lib/utils/string';

	export let words: any[];
	export let textContent: string;
	export let width: number = 300;
	export let height: number = 400;
	export let wordPadding: number;
	export let fontSize: number[];

	let pageWidth: number;
	let timeout: NodeJS.Timeout;
	let detail: { x: number; y: number; word: string; count:number; sentences: number[] } | null;
	let resizeHeight = 0;

	let container: HTMLElement;

	$: popupX = (detail?.x ?? 0) + width / 2;
	$: popupStyle = detail
		? `top:${detail.y + height / 2 + container.getBoundingClientRect().y}px;
		left:${popupX + container.getBoundingClientRect().x + 360 > pageWidth ? pageWidth - 360 : popupX + container.getBoundingClientRect().x}px; 
		transition: all 300ms ease;`
		: '';

	const displayTooltip = (event: CustomEvent<any>) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		const { x, y, text, count, sentences } = event.detail.word;
		detail = { x, y, word: text, sentences, count };
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
        transform: ${transform} translate(${t * x}px, ${t * y}px);opacity: ${t};`
		};
	};
</script>

<svelte:window bind:innerWidth={pageWidth} />

<section bind:this={container} class="card resize shadow-md" bind:clientWidth={width} bind:clientHeight={height}>
	<WordCloud
		{fontSize}
		data={words}
		{width}
		height={height-10}
		{wordPadding}
		on:focus={displayTooltip}
		on:focusout={hideTooltip}
		on:click={displayTooltip}
	/>
</section>
{#if detail}
	<div
		class="z-index absolute z-[999] max-h-80 w-80 overflow-y-scroll border border-black bg-white p-4 text-black"
		style={popupStyle}
		transition:popup={{ delay: 0, duration: 300, x: 0, y: 0 }}
	>
		<p class="pb-2 !text-sm"><b>{detail.word} [{detail.count}]</b></p>
		{#each getSentences(textContent, detail.sentences) as sentence}
			<p class="pb-2 !text-sm">{@html highlightWords(detail.word, sentence)}</p>
		{/each}
	</div>
{/if}
<!-- 
{#each words as word}
	{JSON.stringify(word)}
{/each} -->

<style>
	.resize {
		overflow: auto;
		resize: vertical;
		margin-left: auto;
		padding-bottom: 10px;
	}
</style>
