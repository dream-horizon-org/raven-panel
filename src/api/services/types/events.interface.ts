export interface EventProperty {
  propertyName: string;
  type: string;
  expectedValue: string;
  isMandatory: boolean;
  description: string;
  archived: boolean;
}

export interface EventMetadata {
  eventName: string;
  eventType: string;
  description: string;
  eventSources: string[];
  screenNames: string[];
  featureName?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  owners: string[];
  dtName: string;
  companyName: string;
  archived: boolean;
  isActive: boolean;
}

export interface EventListItem {
  properties: EventProperty[];
  metadata: EventMetadata;
}

export interface EventsSchemaResponse {
  data: {
    eventList: EventListItem[];
  };
}
