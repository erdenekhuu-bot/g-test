import { create } from "zustand";
import axios from "axios";

type NotificationStore = {
  notificationCount: number;
  getNotification: (slug: number) => Promise<void>;
  reportNotificationCount: number;
  takeReportNotification: (slug: number) => Promise<void>;
  checkout: boolean;
  setCheckout: (value: boolean) => void;
  documentId: number;
  setDocumentId: (slug: number) => void;
  planNotification: number;
  setPlanNotification: (slug: number) => Promise<void>;
  documentName: string;
  getDocumentName: (slug: string) => void;
};

export const globalState = create<NotificationStore>((set) => ({
  notificationCount: 0,
  checkout: false,
  getNotification: async (slug: number) => {
    try {
      const res = await axios.get(`/api/badge/${slug}`);
      if (res.data.success) {
        set({ notificationCount: res.data.data.length });
      }
    } catch (error) {
      console.log(error);
    }
  },
  reportNotificationCount: 0,
  takeReportNotification: async (slug: number) => {
    try {
      const res = await axios.get(`/api/reportnotification/${slug}`);
      if (res.data.success) {
        set({ reportNotificationCount: res.data.data[0].report.length });
      }
    } catch (error) {
      console.log(error);
    }
  },
  setCheckout: (value: boolean) => set({ checkout: value }),
  documentId: 0,
  setDocumentId: (slug: number) => set({ documentId: slug }),
  planNotification: 0,
  setPlanNotification: async (slug: number) => {
    try {
      const res = await axios.get(`/api/planbadge/${slug}`);
      if (res.data.success) {
        const documentCounts = res.data.data.map((item: any) => ({
          id: item.id,
          firstname: item.firstname,
          lastname: item.lastname,
          documentCount: item.authUser?.Document?.length,
        }));
        let sum = 0;
        documentCounts.forEach((doc: any) => (sum += doc.documentCount));
        set({ planNotification: sum });
      }
    } catch (error) {
      console.log(error);
    }
  },
  documentName: "",
  getDocumentName: (slug: string) => set({ documentName: slug }),
}));
