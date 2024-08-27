import { addHours, isAfter, isBefore, parseJSON } from "date-fns"
import { getFromStorage, saveToLocalStorage } from "./local-storage"
import { faresReturnSchema, isViajaPanamaFareDaysArray, isViajaPanamaFareDestinationArray } from "./fares"
import { all, groupBy, has, isEmpty, isNil, keys, map, path, pick, prop, sortBy, values } from "ramda"
import { isDestinationArray, } from "./destinations"
import { getLowestFaresByDestinationAndDays } from "../modules/lowests"
import { getLowestByInterest } from "../modules/interest-fares"
import { prepareCalendarOfDestination, type CalendarModules } from "../modules/calendar-fares"
import { isObject } from "@melt-ui/svelte/internal/helpers"

type FaresRequestParams = {
  days?: string,
  destination?: string,
  month?: string,
}

type KeyReturnTypeMap = {
  days: number[]
  destinations: unknown[]
  calendar: unknown[]
  histogram: unknown[]
}

const FIRST_DATE = new Date(2024, 1, 1)

const HOURS_TO_CHECK = 2

const UPDATE_TIME_KEY = 'nextUpdate'

const NOT_FOUND_VALUE = 'not found'

const fetchAPI = (name: string) => (data: FaresRequestParams) => {
  const params = new URLSearchParams(Object.entries(data))
  return fetch(`/api/${name}?${params.toString()}`, { method: 'GET'})
}

const requestedDataMap: Record<keyof KeyReturnTypeMap, (data: FaresRequestParams) => Promise<Response>> = {
  days: fetchAPI('days'),
  destinations: fetchAPI('destinations'),
  calendar: fetchAPI('calendar'),
  histogram: fetchAPI('histogram')
}

const getDateFromFares = (response: unknown) => {
  let dateString: string = NOT_FOUND_VALUE

  if (isViajaPanamaFareDaysArray(response))
    dateString = response[0].min.updated_at

  if (dateString === NOT_FOUND_VALUE) 
    return FIRST_DATE

  try {
    return parseJSON(dateString)
  } catch (error) {
    console.error(error)
    return FIRST_DATE
  }
}

const getDaysOfFares = (response: unknown, accumulatedValue?: unknown) => {
  if(isViajaPanamaFareDaysArray(response))
    return {
      days: response.map(value => value.days)
    }

  return {}
}

const getDestinationsOfFares = (response: unknown, accumulatedValue?: unknown) => {
  try {

    if (!Array.isArray(response))
      return {}

    const [destinationResult, lowestsResult] = response

    if(isDestinationArray(destinationResult) && isViajaPanamaFareDestinationArray(lowestsResult)) {
      const lowests = getLowestFaresByDestinationAndDays(lowestsResult)
      const destinations = pick(keys(groupBy(prop('destination'),lowestsResult)),map((value) => value[0], groupBy(prop('iata_code'), destinationResult)))
      const interests = getLowestByInterest(destinations, lowests)
      return {destinations: {
        lowests,
        destinations,
        ...interests
      }}
    }
    return {}

  } catch (error) {
    console.error('Error while loading destinations and lowests', error)
    return {}
  }
}

const getCalendarFares = (response: unknown, currentCalendar?: CalendarModules): {calendar: CalendarModules}  => {
  try {
    faresReturnSchema.array().parse(response)

    const calendar = prepareCalendarOfDestination(response)
    
    if(!currentCalendar)
      return {calendar}

    return { calendar:{
      calendarFares: { ...calendar.calendarFares, ...currentCalendar.calendarFares },
      calendarMonths: { ...calendar.calendarMonths, ...currentCalendar.calendarMonths }
    }}

  } catch (error) {
    console.error(`Error while loading calendar fares for`, error)
    return <{calendar: CalendarModules}>{}
  }
}

const processRequestDataMap: Record<keyof KeyReturnTypeMap,(response: unknown, accumulatedValue?: unknown) => Record<string, unknown>> = {
  days: getDaysOfFares,
  destinations: getDestinationsOfFares,
  calendar: getCalendarFares,
  histogram: () => {},
}

const getRequestedData = async (key: keyof KeyReturnTypeMap, params: FaresRequestParams, accumulatedValue?: unknown) => {

  try {
    
    const getDataRequest = await requestedDataMap[key](params)
    
    const data = await getDataRequest.json()
    
    const processedData = processRequestDataMap[key](data, accumulatedValue)

    if(isEmpty(processedData) || isNil(processedData) || all(isNil, values(processedData)) || all(isEmpty, values(processedData)))
      return []

    Object.keys(processedData).map(key => {
      try {
        saveToLocalStorage(window.localStorage, key, processedData[key])
      } catch (error) {
        console.error('error while saving to localStorage', error)
      }
    })
    
    const lastUpdate = getDateFromFares(data)
    
    const nextUpdate = parseJSON(getFromStorage(window.localStorage, UPDATE_TIME_KEY, (new Date()).toISOString()))
        
    if (isBefore(nextUpdate, lastUpdate)) 
      saveToLocalStorage(window.localStorage, UPDATE_TIME_KEY, addHours(lastUpdate, HOURS_TO_CHECK).toISOString())
    
    return values(processedData)

  } catch (error) {
    console.error(`Error while loading data: ${key}`, error)

    return Promise.resolve([])
  }
}

const validateCalendarOnLocalStorage = (values: unknown, params?: FaresRequestParams) => {
  if(!params || !isObject(params) || !has('destination', params)) 
    return []

  const { destination } = params

  if(!destination) return []

  if(!values || !Array.isArray(values))
    return getRequestedData('calendar', params)
  
  const calendar = values[0]
  
  if(!calendar || !isObject(calendar) || !has('calendarMonths', calendar) || !has('calendarFares', calendar))
    return getRequestedData('calendar', params)
  
  const { calendarMonths, calendarFares } = calendar

  if(!calendarMonths || !isObject(calendarMonths) || !has(destination, calendarMonths) || !calendarFares || !isObject(calendarFares) || !has(destination, calendarFares))
    return getRequestedData('calendar', params, calendar)
  
  return values
}

const validateProperData: Record<keyof KeyReturnTypeMap, (values: unknown, params?: FaresRequestParams) => unknown> = {
  days: (values: unknown, params?: FaresRequestParams) =>  values,
  destinations: (values: unknown, params?: FaresRequestParams) =>  values,
  calendar: validateCalendarOnLocalStorage,
  histogram: () => {},
}

export const requestData = (key: keyof KeyReturnTypeMap, params: FaresRequestParams) => {
  const dataFromLocalStorage = getFromStorage(window.localStorage,key, NOT_FOUND_VALUE)

  const nextUpdateFromLocalStorage = getFromStorage(window.localStorage, key, NOT_FOUND_VALUE)

  try {
    const nextUpdate = parseJSON(nextUpdateFromLocalStorage)

    if (dataFromLocalStorage === NOT_FOUND_VALUE || isAfter(nextUpdate, new Date()))
      return getRequestedData(key, params)

    const parsedData = JSON.parse(dataFromLocalStorage)
    
    return Promise.resolve(validateProperData[key]([parsedData], params))

  } catch (error) {
    console.error(error)

    return getRequestedData(key, params) // request data to fix any issue

  }
}