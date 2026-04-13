// Imports: React tools for context, state, and lifecycle.
import React, { createContext, useCallback, useEffect, useState } from "react";
import {
    createEvent,
    deleteEvent,
    EventItem,
    getEvents,
    updateEvent as updateEventApi
} from "../api/eventApi";

// Context type: shared event data and helper functions.
type EventContextType = {
    events: EventItem[];
    setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
    addEvent: (newEvent: EventItem) => Promise<void>;
    removeEvent: (eventId: number) => Promise<void>;
    updateEvent: (eventId: number, updatedEvent: EventItem) => Promise<void>;
    refreshEvents: () => Promise<void>;
};

// Default empty context values.
export const EventContext = createContext<EventContextType>({
    events: [],
    setEvents: () => { },
    addEvent: async () => { },
    removeEvent: async () => { },
    updateEvent: async () => { },
    refreshEvents: async () => { }
});

// Props type for provider wrapper.
type Props = {
    children: React.ReactNode;
};

// Context provider used in App.tsx.
export const EventProvider: React.FC<Props> = ({ children }) => {
    // Main shared event list state.
    const [events, setEvents] = useState<EventItem[]>([]);

    const refreshEvents = useCallback(async () => {
        try {
            const list = await getEvents();
            setEvents(Array.isArray(list) ? list : []);
        } catch {
            setEvents([]);
        }
    }, []);

    // Load events from backend when app starts.
    useEffect(() => {
        refreshEvents();
    }, []);

    // Add a new event to backend and shared list.
    const addEvent = async (newEvent: EventItem) => {
        const created = await createEvent(newEvent);
        setEvents((prev) => [created, ...prev]);
    };

    // Remove an event by id.
    const removeEvent = async (eventId: number) => {
        const result = await deleteEvent(String(eventId));
        const updated = result?.eventItem;

        if (updated?.id) {
            setEvents((prev) => prev.map((event) => (event.id === eventId ? updated : event)));
            return;
        }

        await refreshEvents();
    };

    // Update an event by id.
    const updateEvent = async (eventId: number, updatedEvent: EventItem) => {
        const saved = await updateEventApi(String(eventId), updatedEvent);
        setEvents((prev) => prev.map((event) => (event.id === eventId ? saved : event)));
    };

    return (
        <EventContext.Provider
            value={{
                events,
                setEvents,
                addEvent,
                removeEvent,
                updateEvent,
                refreshEvents
            }}
        >
            {children}
        </EventContext.Provider>
    );
};