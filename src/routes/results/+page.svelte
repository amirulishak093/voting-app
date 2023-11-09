<script lang="ts">
	import { Chart, CategoryScale, Title, BarController, Tooltip } from 'chart.js/auto';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { onMount } from 'svelte';

	let chartContext: any;
	let chartInstance: any;
	let intervalId: any;


	export let data;

	let names: { name: string }[] = [];
	let voteCounts: { voteCount: number }[] = [];

	async function refreshData() {
		try {
			const response = await fetch('/api/voteResults');

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const responseData = await response.json();
			names = responseData.voteResults.map((voteResult: { name: string }) => voteResult.name);
			voteCounts = responseData.voteResults.map(
				(voteResult: { voteCount: number }) => voteResult.voteCount
			);

			chartInstance.data.labels = names;
			chartInstance.data.datasets[0].data = voteCounts;
			chartInstance.update();
		} catch (error) {
			console.error('Error refreshing vote counts', error);
			throw new Error('Failed to refresh vote counts');
		}
	}

	const labels = data.voteResults.map((voteResults) => voteResults.name);
	const dataValues = data.voteResults.map((voteResults) => voteResults.voteCount);

	onMount(() => {
		chartContext = chartContext.getContext('2d');

		intervalId = setInterval(refreshData, 3500);

		chartInstance = new Chart(chartContext, {
			plugins: [CategoryScale, Title, BarController, ChartDataLabels],
			data: {
				labels: labels,
				datasets: [
					{
		
						data: dataValues,
						backgroundColor: ['#F25489', '#ded640', '#AF78E9', '#42D9C0'],
						borderColor: 'rgba(75, 192, 192, 1)',
						type: 'bar'
					}
				]
			},
			options: {
			        layout: {
			            padding: 20
			        },
				plugins: {
					legend: {
				                display: false
					},
					datalabels: {
				     	   color: '#FFFFFF',
					   display: (context) => context.dataset.data[context.dataIndex] !== 0,
					   font: {
	
					     size: 20
					   }
					},
					tooltip: {
					 enabled: false
					}
				},
				indexAxis: 'y',
				scales: {
					x: { display: false },
					y: {
						beginAtZero: true,
				                 ticks: {
				                        font: {
				                            size: 18 
				                        }
				                    }
					}
				}
			}
		});
	});
</script>

<div class="w-full max-w-5xl mx-auto">

	  <video class="w-full aspect-video" autoplay loop muted>
	    <source src="video.mp4" type="video/mp4">
	  </video>

	<div class="px-4 pb-4">
		<div class="flex flex-col items-center justify-center mt-4">
			<h1 class="text-center font-bold text-4xl text-white">Vote Result</h1>
		 	<canvas bind:this={chartContext} class="w-full bg-white rounded-lg shadow-lg mt-4" />
		</div>
		

		<div class="flex flex-col items-center justify-center mt-8">
			<h1 class="text-center font-bold text-4xl text-white">Vote Now</h1>
		 	<img class="mt-4 w-[36rem]" src={'/MGT-VOTING.png'} />
		</div>

	</div>
</div>
