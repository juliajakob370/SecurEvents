import React, { createContext, useState, ReactNode } from "react";

export interface EventType {
  title: string;
  organizer: string;
  location: string;
  price: string;
  image: string;
  dateTime: string;
  description: string;
  capacity: number;
  status: string;
}

interface EventContextType {
  events: EventType[];
  addEvent: (event: EventType) => void;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  addEvent: () => {}
});

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventType[]>([]);

  const addEvent = (event: EventType) => {
    setEvents((prev) => [event, ...prev]); // add to the top of the event page
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};