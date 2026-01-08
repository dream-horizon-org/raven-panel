export interface EventProperty {
  propertyName: string;
  type: string;
  expectedValue: string;
  isMandatory: boolean;
  description: string;
}

export interface EventListItem {
  eventName: string;
  properties: EventProperty[];
}

export interface EventNamesResponse {
  data: {
    eventNames: string[];
  };
}

export interface EventDetailsResponse {
  data: {
    eventName: string;
    properties: EventProperty[];
  };
}

export interface EventsSchemaResponse {
  data: {
    eventList: EventListItem[];
  };
}
