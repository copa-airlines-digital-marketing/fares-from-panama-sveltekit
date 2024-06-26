<script lang="ts">
	import { getDaysContext } from '$lib/components/days';
	import { getDestinationsContext } from '$lib/components/destination/context';
	import { getFareModulesContext } from '../context';
	import { getContext, setContext } from 'svelte';
	import { SkeliView } from '$lib/components/skeleton';
	import { isEmpty, isNil, isNotNil } from 'ramda';
	import StatusWrapper from '$lib/components/skeleton/status-wrapper.svelte';
	import HistogramTabs from './histogram-tabs.svelte';
	import HistogramTabsSkeleton from './histogram-tabs-skeleton.svelte';
	import HistogramAccordion from './histogram-accordion.svelte';
	import HistogramAccordionSkeleton from './histogram-accordion-skeleton.svelte';
	import { writable } from 'svelte/store';

	const { all: destinations } = getDestinationsContext();
	const { selected: selectedStay } = getDaysContext();
	const modules = getFareModulesContext();

	const section: string = getContext('section');

	const labels = getContext<Record<string, string>>('moduleLabels');

	$: interestNames = $modules.interestNames;

	$: interestFares = $modules.interests;

	$: innerWidth = undefined;

	$: selectedStayOfSection = $selectedStay[section];

	$: showModule =
		isNotNil($destinations) &&
		isNotNil(selectedStayOfSection) &&
		isNotNil(labels) &&
		isNotNil(interestNames) &&
		isNotNil(interestFares);

	setContext('scrollIndicator', writable(0));
</script>

<svelte:window bind:innerWidth />

{#if innerWidth === undefined}
	<SkeliView></SkeliView>
{:else if innerWidth < 1180}
	{#if showModule}
		<HistogramAccordion />
	{:else}
		<div class="relative">
			<HistogramAccordionSkeleton pulse={isNil($modules) || isEmpty($modules)}
			></HistogramAccordionSkeleton>
			<div class="absolute bg-grey-100/60 blur h-full top-0 w-full"></div>
			<div class="absolute grid h-full px-16 py-roomy top-0 w-full">
				<StatusWrapper
					name={section}
					{labels}
					theme={'light'}
					fares={isNil($modules) || isEmpty($modules)}
					days={!$selectedStay[section]}
					noFares={isNotNil(selectedStayOfSection) &&
						isNotNil(interestNames) &&
						isNil(interestNames[parseInt(selectedStayOfSection)])}
				></StatusWrapper>
			</div>
		</div>
	{/if}
{:else if showModule}
	<HistogramTabs></HistogramTabs>
{:else}
	<div class="relative">
		<HistogramTabsSkeleton pulse={isNil($modules) || isEmpty($modules)} />
		<StatusWrapper
			name={section}
			{labels}
			theme={'light'}
			fares={isNil($modules) || isEmpty($modules)}
			days={!$selectedStay[section]}
			noFares={!(
				isNotNil(selectedStayOfSection) &&
				isNotNil(interestNames) &&
				isNil(interestNames[parseInt(selectedStayOfSection)])
			)}
		></StatusWrapper>
	</div>
{/if}
