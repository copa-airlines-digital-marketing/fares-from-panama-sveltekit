// See https://kit.svelte.dev/docs/types#app

import type { Query, QueryItem } from "@directus/sdk"

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

  namespace Directus {
    // Directus types

    type TermsAndConditionsTranslations = {
      title: string
      termAndConditions: string
      path: string
    }

    type TermsAndConditions = {
      id: string
      name: string
      status: string
      translations: TermsAndConditionsTranslations[]
    }

    type TextContentCallToAction = {
      text: string
      link: string
      open_in: string
    }

    type TextContentTranslation = {
      description: string
      embed_media: string
      languages_code: string
      media: string //id of the asset
      title: string
      call_to_actions: TextContentCallToAction[]
    }

    type TextContent = {
      name: string
      icon: string
      icon_from_library: array[]
      translations: TextContentTranslation[]
    }

    // Applies for icons and logos
    type SVGAsset = {
      image: string //id of the asset
      code: string //svg tag of the icon
    }

    type NavigationLinks = {
      title: string
      link: string
      icon_id: string
      open_in: string
    }

    type NavigationTranslations = {
      languages_code: string
      title: string
      links: NavigationLinks[]
    }

    type Navigation = {
      icon: string,
      translations: NavigationTranslations[]
    }

    type InputOpions = {
      value: string
      labele: string
    }

    type FormInput = {
      name: string
      label: string
      placeholder: string
      type: string
      value: string
      required: boolean
      checked: boolean
      options: InputOpions[]
      options_api: string
      max: number
      min: number
      step: number
      icon: string
    }

    type Form = {
      action: string
      method: string
      name: string
      inputs: FormInput[]
    }

    type CarrouselSlide = {
      title: string
      description: string //HTML code
      imageID: string //id of the asset
      imageDescription: string
      clickTrhoughURL: string
    }

    type Carrousel = {
      name: string
      autoSlide: boolean
      autoSlideDelayMS: number
      slides: string
    }

    type CopyrightTranslations = {
      languages_code: string
      copyright:string
    }

    type Copyrights = {
      name: string
      status: string
      translations: CopyrightTranslations[]
    }

    type Links = {
      url: string,
      name: string,
      opens_in: string,
      icon: SVGAsset
    }

    type FollowLink = {
      links_url: Link
    }

    type FollowButtonsTranslations = {
      languages_code: string
      title: string
      social_network: FollowLink[]
    }

    type FollowButtons = {
      name: string
      status: string
      translations: FollowButtonsTranslations[]
    }

    type ColorName = 'alternative-dark-orange' | 'alternative-gold' | 'alternative-light-orange' | 'alternative-pardo' | 'alternative-prefer-member-blue' | 'background-light-blue' | 'background-paper' | 'black' | 'grey-100' | 'grey-300' | 'grey-400' | 'grey-500' | 'grey-600' | 'grey-700' | 'grey-75' | 'grey-800' | 'primary' | 'primary-dark' | 'primary-faded' | 'primary-light' | 'primary-ultradark' | 'primary-ultralight' | 'secondary' | 'secondary-faded' | 'status-gold' | 'status-silver' | 'system-error' | 'system-error-faded' | 'system-success' | 'system-success-faded' | 'system-warning' | 'system-warning-faded' | 'tertiary' | 'white'

    type Colors ={
      hex: string
      name: ColorName
    }

    type MFAItem = Carrousel | Navigation | TextContent | SVGAsset | Form | TermsAndConditions | Copyrights | FollowButtons

    type ContentCollectionNames = 'carrousel' | 'form' | 'icon' | 'logos' | 'navigation' | 'terms_and_conditions' | 'Text_Content' | 'copyrights' | 'follow_buttons'

    type ContentDisplay = '100' | '75' | '50' | '25'

    type VerticalAlignment = 'top' | 'center' | 'bottom' | 'stretch' | 'baseline'

    type HorizontalAlignment = 'left' | 'center' | 'right' | 'stretch'

    type ContentDistribution = 'space_around' | 'space_between' | 'space_evenly'

    type Theme = 'light' | 'dark'

    type PageSectionContent = {
      "item:Text_Content": TextContent[]
      "item:navigation": Navigation[]
      "item:terms_and_conditions": TermsAndConditions[]
      "item:copyrights": Copyrights[]
      "item:follow_buttons": FollowButtons[]
      collection: ContentCollectionNames
      component_name: string
      display: ContentDisplay
      horizontal_alignment: HorizontalAlignment
      item: MFAItem
      theme: Theme
      vertical_alignment: VerticalAlignment
    }

    type SectionLandmark = 'aside' | 'footer' | 'header' | 'hero' | 'loading' | 'modal' | 'regular' | 'section'

    type HorizontalBehaviour = 'contained' | 'full'

    type ContentSpacing = 'none' | 'minimal' | 'tiny' | 'petit' | 'normal' | 'roomy' | 'spacious' | 'big' | 'huge'

    type Section = {
      content_horizontal_alignment: HorizontalAlignment
      content_horizontal_distribution: HorizontalAlignment | ContentDistribution
      content_vertical_alignment: VerticalAlignment
      content_vertical_distribution: VerticalAlignment | ContentDistribution
      content_spacing: ContentSpacing
      horizontal_behaviour: HorizontalBehaviour
      background_color: Color
      landmark: SectionLandmark
      section_id: string
      section_content: PageSectionContent[]
    }

    type PageStorefrontsSections = {
      id: number
      sections_id: Section
    }

    type PageStorefront = {
      storefronts_code: string
      sections: PageStorefrontsSections[]
    }

    type PageTranslation = {
      languages_code: string
      meta_description: string
      title_tag: string
    }

    type Page = {
      id: number
      name: string
      share_image: string //id of the asset library
      storefronts: PageStorefront[]
      translations: PageTranslation[]
    }

    type Site = {
      favIcon: SVGAsset[] //id of the asset library
      pages: Page[]
    }

    type CountryTranslation = {
      languages_code: string
      name: string
    }

    type Country = {
      code: string
      translations: CountryTranslation[]
    }

    type CategoryTranslation = {
      languages_code: string
      name: string
    }

    type Category = {
      translations: CategoryTranslation[]
    }

    type DestinationCategory = {
      destination_category_id: Category
    }

    type DestinationTranslation = {
      languages_code: string
      name: string
    }

    type Destination = {
      categories: DestinationCategory[]
      country: Country
      iata_code: string
      main_image: string
      translations: DestinationTranslation[] 
    }

    type Schema = {
      sites: Site[]
      pages: Page[]
      translations: PageTranslation[] | TextContentTranslation[] | NavigationTranslations[] | CategoryTranslation[] | CountryTranslation[] | DestinationTranslation[]
      storefronts: PageStorefront[]
      sections_id: PageStorefrontsSections[]
      sections: Section[]
      section_content: PageSectionContent[]
      item: MFAItem
      Text_Content: TextContent[]
      logos: SVGAsset[]
      icon: SVGAsset[]
      form: Form[]
      navigation: Navigation[]
      carrousel: Carrousel[]
      favIcon: SVGAsset[]
      terms_and_conditions: TermsAndConditions[]
      copyrights: Copyrights[]
      follow_buttons: FollowButtons[]
      links: Link[]
      links_url: Link[]
      colors: Color[]
      destinatons: Destination[]
      countries: Country[]
      destination_category: Category[]
      "item:copyrights": Copyrights[]
      "item:terms_and_conditions": TermsAndConditions[]
      "item:Text_Content": TextContent[]
      "item:navigation": Navigation[]
      "item:follow_buttons": FollowButtons[]
    }
    
    type Params<Schema, Item> = {
      host: string,
      token: string,
      collection: string,
      id?: string | number,
      items?: Query<Schema, Item>
      item?: QueryItem<Schema, Item>
    }
  }
}