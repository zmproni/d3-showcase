<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import cloud from 'd3-cloud';
	import * as d3 from 'd3';

	// TODO Allow for custom colors
	export let data: { text: string; count: number; [key: string]: unknown }[];
	export let fontFamily = 'Impact';
	export let fontSize = [10, 100];
	export let background = 'white';
	export let width = 1000;
	export let height = 400;
	export let wordPadding = 1;

	const dispatch = createEventDispatcher();

	let words: any[];
	let isMounted = false;

	$: linearScale = d3
		.scaleLinear()
		.domain([d3.min(data.map((d) => d.count)) || 0, d3.max(data.map((d) => d.count)) || 1])
		.range(fontSize);

	//TODO: Move out, should be an option, not baked in.
	const colorMap: { [key: string]: string } = {
		NOUN: '#000000',
		PROPN: '#67001f',
		ADJ: '#878787',
		VERB: '#1a1a1a',
		ADV: '#d6604d'
	};

	const getTextStyle = (word: any) =>
		`font-family: "${fontFamily}"; 
      font-size: ${word.size}px; 
      cursor: pointer; 
      fill: ${colorMap[word.pos]};`;

	const computeLayout = (
		data: any[],
		width: number,
		height: number,
		wordPadding: number,
		fontFamily: string,
		linearScale: Function
	) => {
		const layout = cloud()
			.size([width, height])
			.words(data.map((d) => ({ ...d, size: d.count })))
			.padding(wordPadding)
			.rotate((w) => w.rotate || 0)
			.font(fontFamily)
			.fontSize((d) => linearScale(d.size || 0))
			.on('end', (data) => {
				words = data;
			})
			.start();

		return layout;
	};

	onMount(() => (isMounted = true));
	$: isMounted ? computeLayout(data, width, height, wordPadding, fontFamily, linearScale) : null;

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

<figure>
	<svg style="background: {background};" {height} {width}>
		<g transform={`translate(${width / 2}, ${height / 2})`}>
			{#if words}
				{#each words as word (word.text + word.pos)}
					<text
						on:mouseover={(event) => dispatch('mouseover', { event, word })}
						on:mouseleave={(event) => dispatch('mouseleave', { event, word })}
						on:focus={(event) => dispatch('focus', { event, word })}
						on:focusout={(event) => dispatch('focusout', { event, word })}
						on:click={(event) => dispatch('click', { event, word })}
						on:keydown={(event) => dispatch('keydown', { event, word })}
						transition:popup={{ delay: 0, duration: 300, x: 0, y: 0 }}
						style={`${getTextStyle(word)} --word-color: ${colorMap[word.pos]};`}
						text-anchor="middle"
						transform={`rotate(${word.rotate})`}
						x={word.x}
						y={word.y}
						tabIndex="0"
						>{word.text}
					</text>
				{/each}
			{/if}
		</g>
	</svg>
</figure>

<slot name="tooltip" />

<style>
	svg {
		transition: all 200ms ease;
	}

	text {
		transition: all 200ms ease;
	}

	text:hover,
	text:focus {
		text-shadow: 0 0 1px var(--word-color), 0 0 1px var(--word-color), 0 0 1px var(--word-color),
			0 0 1px var(--word-color);
	}
</style>
