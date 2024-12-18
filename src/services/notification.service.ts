import { axiosInstance } from "@/lib/axios";

export const notificationService = {
  getAll: async () => {
    const response = await axiosInstance.get("/notifications");
    // Ensure we return an array even if the API fails
    console.log(response.data);
    return {
      data: response.data || [],
    };
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get("/notifications/unread-count");
    console.log("Unread", response.data);
    return {
      data: response.data || 0,
    };
  },

  markAsRead: async (notificationId: string) => {
    console.log(notificationId);
    const response = await axiosInstance.patch(
      `/notifications/${notificationId}/read`
    );
    console.log(response.data);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.post("/notifications/mark-all-read");
    return response.data;
  },
};
