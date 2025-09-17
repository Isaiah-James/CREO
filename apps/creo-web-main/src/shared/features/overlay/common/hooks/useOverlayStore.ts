import { create } from "zustand";

interface IOverlayStore {
    isOpen: boolean,
    module: string,
    section: string,
    subsection: string,

    open(): void;
    close(): void;
};

export const useOverlayStore = create<IOverlayStore>((set) => ({
    isOpen: false,
    module: 'default',
    section: 'default',
    subsection: 'default',

    open() {
        set({ isOpen: true})
    },

    close() {
        set({ isOpen: false});
    }
}))