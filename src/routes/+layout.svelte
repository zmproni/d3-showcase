<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	// import { LightSwitch } from '@skeletonlabs/skeleton'
</script>

<div class="absolute right-4 top-4 z-[999]">
	<!-- <LightSwitch></LightSwitch> -->
</div>
<slot />
