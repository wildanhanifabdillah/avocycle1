import api from "../api/axiosInstance";

const BookingService = {
  async listByUser(userId) {
    const res = await api.get(`/pembeli/booking/user/${userId}`);
    return res.data;
  },

  async create(payload) {
    const res = await api.post("/pembeli/booking", payload);
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/pembeli/booking/${id}`);
    return res.data;
  },
};

export default BookingService;
