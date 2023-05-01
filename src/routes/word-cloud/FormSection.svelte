<!-- TODO: Improve options list -->
<script lang="ts">
	export let minFontSize = 8;
	export let maxFontSize = 90;
	export let maxWords = 200;
	export let wordPadding = 1;
	export let textContent = '';
</script>

<section class="card z-10 my-8 bg-white shadow-md">
	<h3 class="p-4">Options</h3>
	<hr />
	<div class="grid grid-cols-2 p-4">
		<label class="label m-4">
			<span class="label-text">Low Frequency Font Size ({minFontSize}px)</span>
			<input
				class="input-bordered input"
				type="range"
				min="8"
				max="90"
				step="1"
				bind:value={minFontSize}
				style="width: 100%;"
			/>
		</label>

		<label class="label m-4">
			<span class="label-text">High Frequency Font Size ({maxFontSize}px)</span>
			<input
				class="input-bordered input"
				type="range"
				min="8"
				max="150"
				step="1"
				bind:value={maxFontSize}
				style="width: 100%;"
			/>
		</label>

		<label class="label m-4">
			<span class="label-text">Max Words</span>
			<input
				class="input-bordered input border border-black text-sm"
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
				class="input-bordered input border border-black text-sm"
				type="number"
				min="0"
				max="150"
				step="1"
				bind:value={wordPadding}
				style="width: 100%;"
			/>
		</label>
	</div>
</section>

<section class="card z-10 my-8 bg-white shadow-md">
	<h3 class="p-4">Word Cloud Text</h3>
	<label class="label">
		<textarea
			class="textarea border-r-0 !bg-white px-4 py-8 text-sm"
			bind:value={textContent}
			rows="16"
			placeholder="Add your text here"
		/>
	</label>
</section>
