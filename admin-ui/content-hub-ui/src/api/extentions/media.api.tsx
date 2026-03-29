import axiosClient from "../../config/axios";

export interface UploadResponse {
  path: string;   
  imageId: string;  
}

export const mediaApi = {
  // Upload file lên backend
  async uploadMedia(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosClient.post<UploadResponse>(
        "/api/media/upload-cloudinary",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      throw new Error("Upload failed");
    }
  },

  // Xóa ảnh theo publicId
  async deleteMedia(publicId: string) {
    try {
      const res = await axiosClient.delete("/api/media/remove-image", {
        params: { publicId },
      });
      return res.data;
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      throw new Error("Delete failed");
    }
  }
};