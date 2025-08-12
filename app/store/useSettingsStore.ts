import {create} from 'zustand'
import {Settings} from "@/app/lib/types/settings";

interface SettingsStore {
    data: Settings;
    setData: (newData: Settings) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    data: {},
    setData: (newData: Settings) => set({data: newData})
}))