import api from "./api";

const patientService = {
  getPatients: async () => {
    const response = await api.get("/patients/");
    return response.data;
  },

  getPatient: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  addPatient: async (patient) => {
    const response = await api.post("/patients/", patient);
    return response.data;
  },

  updatePatient: async (id, patient) => {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

export default patientService;