<script lang="ts">
	import { longText } from '$lib/data/text';
	import { getWordPoSFrequencyTable } from '$lib/utils/string';
	import FormSection from './FormSection.svelte';
	import WordCloudSection from './WordCloudSection.svelte';

	let textContent = longText;

	let minFontSize = 8;
	let maxFontSize = 90;
	let maxWords = 200;
	let wordPadding = 1;

	$: fontSize = [minFontSize, maxFontSize];
	$: words = getWordPoSFrequencyTable(textContent, false, maxWords);
</script>

<svelte:head>
	<title>D3 Word Cloud</title>
</svelte:head>

<main class="bg-slate-100 pt-16">
	<div class="m-auto max-w-4xl p-8 text-sm">
		<article>
			<h1 class="p-4 text-center">D3 Svelte Word Cloud</h1>
			<br />
			<WordCloudSection {words} {fontSize} {wordPadding} {textContent} />
			<FormSection
				bind:minFontSize
				bind:maxFontSize
				bind:maxWords
				bind:wordPadding
				bind:textContent
			/>
		</article>
	</div>
</main>
