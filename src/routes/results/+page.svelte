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

	onMount(() => {
		chartContext = chartContext.getContext('2d');

		intervalId = setInterval(refreshData, 5000);

		chartInstance = new Chart(chartContext, {
			plugins: [CategoryScale, Title, BarController, ChartDataLabels],
			data: {
				labels: data.voteResults.map((voteResults) => voteResults.name),
				datasets: [
					{
		
						data: data.voteResults.map((voteResults) => voteResults.voteCount),
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1,
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
					   display: (context) => context.dataset.data[context.dataIndex] !== 0,
					   font: {
					     size: 20
					   }
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

<div class="w-full flex justify-center max-w-5xl mx-auto">
	<div class="px-4 pb-4">
		<canvas bind:this={chartContext} class="w-full mt-4 bg-white rounded-lg shadow-lg" />
	</div>
</div>
