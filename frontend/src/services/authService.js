import api from "./api";


// =========================================================
// LOGIN DOCTOR
// =========================================================

export const loginUser = async (
  doctor_id,
  password
) => {

  const response = await api.post(
    "/auth/login",
    {
      doctor_id,
      password,
    }
  );

  return response.data;
};


// =========================================================
// REGISTER DOCTOR
// =========================================================

export const registerDoctor = async (
  doctor_id,
  doctor_name,
  password
) => {

  const response = await api.post(
    "/auth/register",
    {
      doctor_id,
      doctor_name,
      password,
    }
  );

  return response.data;
};