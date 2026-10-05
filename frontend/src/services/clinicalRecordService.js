import api from "./api";

const clinicalRecordService = {
  getRecords: async () => {
    const response = await api.get("/clinical-records/");
    return response.data;
  },

  getRecord: async (id) => {
    const response = await api.get(`/clinical-records/${id}`);
    return response.data;
  },

  addRecord: async (record) => {
    const response = await api.post("/clinical-records/", record);
    return response.data;
  },

  updateRecord: async (id, record) => {
    const response = await api.put(
      `/clinical-records/${id}`,
      record
    );
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await api.delete(
      `/clinical-records/${id}`
    );
    return response.data;
  },
};

export default clinicalRecordService;