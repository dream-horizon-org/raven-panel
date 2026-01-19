import { EventListItem } from "@/api/services/types/events.interface";

export const generateRandomJourneyName = (): string => {
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `Journey ${randomNumber}`;
};

export const findMatchingEvent = (
  eventName: string,
  eventList: EventListItem[]
): EventListItem | undefined => {
  return eventList.find((event) => event.eventName === eventName);
};

export const createEventSelection = (
  matchingEvent: EventListItem,
  eventList: EventListItem[],
  eventName: string
): { id: number; label: string } => {
  const eventIndex = eventList.indexOf(matchingEvent);
  return {
    id: eventIndex + 1,
    label: eventName,
  };
};
