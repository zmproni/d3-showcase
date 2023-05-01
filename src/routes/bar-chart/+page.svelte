<script lang="js">
	//@ts-nocheck
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

  let anchor;

	onMount(() => {
		initApp();
	});

	const initApp = async () => {
		const url =
			'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
		const response = await fetch(url);
		const dataset = await response.json();

		const height = 460;
		const width = 900;
		const padding = 92;
		const barColorHighlight = 'black';
		const dates = dataset.data.map(([date, _]) => new Date(date));
		const formatDate = d3.timeFormat('%B %Y');
		let USDollar = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		});

		//
		const svg = d3
			.select(anchor)
			.append('svg')
			.attr('height', height)
			.attr('width', width)
			.style('margin', 'auto')
			.append('g')
			.style('transform', `translate(-${padding / 4}px, ${padding / 4}px)`);

		const yMax = d3.max(dataset.data.map(([_, gdp]) => gdp));
		const xMax = d3.max(dates);
		xMax.setMonth(xMax.getMonth() + 3);

		const xScale = d3
			.scaleTime()
			.domain([d3.min(dates), xMax])
			.range([0, width - padding]);
		const yScale = d3
			.scaleLinear()
			.domain([0, yMax])
			.range([0, height - padding]);
		const yAxisScale = d3
			.scaleLinear()
			.domain([0, yMax])
			.range([height - padding, 0]);
		const colorHueScale = d3.scaleLinear().domain([0, yMax]).range([50, 110]);

		const drawXAxis = d3.axisBottom(xScale);
		const xAxis = svg
			.append('g')
			.style('transform', `translate(${padding}px, ${height - padding}px)`)
			.attr('id', 'x-axis');
		xAxis.call(drawXAxis);

		const drawYAxis = d3.axisLeft(yAxisScale);
		const yAxis = svg
			.append('g')
			.style('transform', `translate(${padding}px, ${0}px)`)
			.attr('id', 'y-axis')
			.call(drawYAxis);

		svg
			.append('text')
			.text('Gross Domestic Product')
			.style('transform', `rotate(-90deg)`)
			.attr('x', '-200')
			.attr('y', '120')
			.attr('font-size', '1em')
			.style('color', 'black');

		svg
			.append('text')
			.text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
			.attr('text-anchor', 'middle')
			.attr('x', width / 2 + padding / 2)
			.attr('y', height - padding / 2 + 10)
			.attr('font-size', '1em')
			.style('color', 'black');

		const rect = svg
			.append('g')
			.style('transform', `translate(${padding}px, -${padding}px)`)
			.selectAll('rect')
			.data(dataset.data)
			.enter()
			.append('rect')
			.attr('width', 3)
			.attr('height', ([_, value]) => yScale(value))
			.attr('x', (data, _) => xScale(new Date(data[0])))
			.attr('y', ([_, value]) => height - yScale(value))
			.attr('fill', ([_, gdp]) => `hsl(${colorHueScale(gdp)}, 100%, 40%)`)
			.attr('class', 'bar')
			.attr('data-date', ([date, _]) => date)
			.attr('data-gdp', ([_, gdp]) => gdp)
			.on('mouseover', mouseover)
			.on('mouseout', mouseout);

		function mouseover(event, [date, gdp]) {
			d3.select(this).attr('fill', barColorHighlight);
			d3.select('#tooltip')
				.attr('style', 'opacity: 1;')
				.html(
					() => `
        <p><b>US GDP</b></p><p>${formatDate(new Date(date))}<br/>${USDollar.format(gdp)}</p>`
				)
				.attr('data-date', date);
		}

		function mouseout(event, [_, gdp]) {
			d3.select(this).attr('fill', `hsl(${colorHueScale(gdp)}, 100%, 40%)`);
			d3.select('#tooltip').attr('style', 'opacity:0;');
		}
	};
</script>

<article>
	<h1 id="title">United States Quarterly GDP</h1>
	<div bind:this={anchor} id="container" />
	<div id="tooltip" class='tooltip'/>
</article>

<style>
	/* body {
		background: #708090;
		font-family: 'Roboto';
	} */

	#title {
		margin-top: 0.5em;
		font-size: 2.5em;
		font-weight: normal;
		text-align: center;
	}

	article {
		width: 1000px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding: 20px 20px 20px 20px;
		align-self: center;
		position: relative;
		margin: 64px auto 0 auto;
		box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	.tooltip {
		position: absolute;
		z-index: 999;
		width: 120px;
		height: 100px;
		top: 200px;
		left: 250px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		opacity: 0;
		transition: all 200ms ease-out;
		padding: 16px;
	}
</style>
