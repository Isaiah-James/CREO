import { create } from "zustand";

export interface IModalStore {
    isOpen: boolean;
    data: unknown;
    type: string | null;

    open(type: string | null, data?: unknown): void;
    close(): void;
}

export const useModal = create<IModalStore>((set) => ({
    isOpen: false,
    data: null,
    type: null,

    open(type: string | null, data?: unknown): void {
        set({ isOpen: true, type, data });
    },
    close(): void {
        set({ isOpen: false, type: null, data: null });
    },
}));