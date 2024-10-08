<script lang="ts">
	import {
		formatDateForDisplay,
		getShoppingEngingeURL,
		isBeforeSweetSpot,
		parseDate
	} from '$lib/public/utils';
	import { getContext } from 'svelte';
	import { getDestinationsContext } from '$lib/components/destination/context';
	import type { Writable } from 'svelte/store';

	export let fare: ViajaPanamaFare;

	const labels = getContext<Record<string, string>>('moduleLabels');

	const { all: destinations } = getDestinationsContext();

	const toastFN = getContext<() => void>('showToast');
	const maxAlerts = getContext<number>('maxAlerts');
	const alertsShown = getContext<Writable<number>>('alertsShown');

	const addToast = (url: string, fare: ViajaPanamaFare) => (e: Event) => {
		if (window.dataLayer)
			window.dataLayer.push({ event: 'fare_click', module: 'Histogram Fare', fare });
		if (!!toastFN && isBeforeSweetSpot(parseDate(fare.departure)) && $alertsShown <= maxAlerts) {
			toastFN();
			$alertsShown += 1;
			e.preventDefault();
			setTimeout(() => {
				open(url, '_blank')?.focus();
			}, 2500);
		}
	};
</script>

<a
	class="aspect-video sm:aspect-[4/3] fare-card--destination-image font-heading grid gap-x-4 h-full group overflow-hidden rounded-2xl shadow-tiny text-12/16 text-common-white w-full"
	href={getShoppingEngingeURL(fare)}
	target="_blank"
	on:click={addToast(getShoppingEngingeURL(fare), fare)}
>
	<img
		loading="lazy"
		class="[grid-area:image] object-cover h-full w-full"
		src="https://cm-marketing.directus.app/assets/{$destinations[fare.destination]
			.main_image}?width=800&height=600&fit=cover&access_token=4_9wJcm9uVEPXkV_3JKynLk0B4aZZ4PU"
		alt=""
	/>
	<span
		class="[grid-area:image] bg-common-black/40 group-hover:bg-red group-focus:bg-red transition-colors"
	></span>
	<span class="col-[content] font-heading-medium row-[dest]">
		<span class="text-24/32"
			>{$destinations[fare.destination]?.translations[0]?.name ?? 'not found'}</span
		>
		({fare.destination}),
		<span class="uppercase">{$destinations[fare.destination]?.country?.code ?? 'not found'}</span>
	</span>
	<span class="col-[content] mb-8 row-[date]">
		{formatDateForDisplay(parseDate(fare.departure))} -
		{formatDateForDisplay(parseDate(fare.return))} ·
		{labels['roundTrip']}
	</span>
	<span
		class="col-[content] font-heading-medium self-end justify-self-end mt-8 row-[fare] text-14/20 text-grey-100"
		>{labels['copaFare']}
		<span class="font-heading-bold text-20/24">${fare.fare}</span>
	</span>
	<span
		class="col-[content] font-heading-medium justify-self-end row-[taxs] text-14/20 text-grey-100 block border-b border-grey-300"
		>{labels['taxes']}
		<span class="font-heading-bold text-24/32">${fare.taxes}</span>
	</span>
	<span class="col-[detail] justify-self-end row-[labl] self-end">{labels['finalPrice']}</span>
	<span class="col-[detail] justify-self-end row-[crcy] self-start">{labels['currency']}</span>
	<span class="col-[price] font-heading-bold row-[labl_/_crcy] text-32/40">${fare.price}</span>
</a>

<style lang="postcss">
	.fare-card--destination-image {
		grid-template-columns: [image-start] 8px [content-start detail-start] 1fr [detail-end price-start] auto [content-end price-end] 8px [image-end];
		grid-template-rows:
			[image-start] 8px
			[dest-start] auto
			[dest-end date-start] auto
			[date-end fare-start]1fr
			[fare-end taxs-start] auto
			[taxs-end labl-start] auto
			[labl-end crcy-start] auto
			[crcy-end] 8px
			[image-end];
	}
</style>
