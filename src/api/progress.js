import api from "./api";

const ProgressAPI = {
  async get(courseId) {
    const res = await api.get(`/progress?courseId=${courseId}`);
    return res.data[0] || null;
  },

  async create(courseId, totalLessons) {
    const payload = {
      courseId,
      totalLessons,
      completedLessons: [],
      lastLesson: null
    };
 
    const res = await api.post("/progress", payload);
    return res.data;
  },

  async update(id, data) {
    const res = await api.patch(`/progress/${id}`, data);
    return res.data;
  }
};

export default ProgressAPI;
