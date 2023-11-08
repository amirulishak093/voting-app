<script lang="ts">
	import { Chart, CategoryScale, Title, BarController, Tooltip } from 'chart.js/auto';
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
			type: 'line',
			plugins: [CategoryScale, Title, BarController, Tooltip],
			data: {
				labels: data.voteResults.map((voteResults) => voteResults.name),
				datasets: [
					{
						label: 'Votes',
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
				                labels: {
				                    font: {
				                        size: 16
				                    }
				                }
					},
				},
				indexAxis: 'y',
				scales: {
					x: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
				                        font: {
				                            size: 18 
				                        }
						}
					},
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

<div class="w-full mx-auto">
	<div class="px-4 pb-4">
		<h1 class="text-center font-bold text-2xl text-slate-900">Voting Results</h1>
		<canvas bind:this={chartContext} class="w-full mt-4 bg-white rounded-lg shadow-lg" />
	</div>
</div>
