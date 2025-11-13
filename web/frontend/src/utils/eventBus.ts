type EventHandler = (payload: any) => void;

export const eventBus = {
    events: {} as Record<string, EventHandler[]>,

    on(event: string, callback: EventHandler) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },

    off(event: string, callback: EventHandler) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },

    emit(event: string, payload: any) {
        if (!this.events[event]) return;
        this.events[event].forEach(cb => cb(payload));
    },
};

export default eventBus;
