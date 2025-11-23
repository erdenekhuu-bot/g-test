import { create } from "zustand";
import axios from "axios";

type GlobalStore = {
  checkout: number;
  getCheckout: (value: number) => void;
  employeeId: number;
  getEmployeeId: (value: number) => void;
  documentId: number;
  getDocumentId: (value: number) => void;
};

export const ZUSTAND = create<GlobalStore>((set) => ({
  checkout: 0,
  getCheckout: (value: number) => set({ checkout: value }),
  employeeId: 0,
  getEmployeeId: (value: number) => set({ employeeId: value }),
  documentId: 0,
  getDocumentId: (value: number) => set({ documentId: value }),
}));
