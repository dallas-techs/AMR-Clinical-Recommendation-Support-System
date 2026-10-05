import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";

import patientService from "../services/patientService";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/patient.css";

const emptyForm = {
  full_name: "",
  age: "",
  gender: "",
  blood_group: "",
  phone: "",
  email: "",
  address: "",
  date_of_birth: "",
};

const genderOptions = ["Male", "Female", "Other"];

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

function Patient() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openView, setOpenView] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deletePatient, setDeletePatient] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const loadPatients = async () => {
    try {
      setLoading(true);

      const data = await patientService.getPatients();

      const sorted = [...data].sort((a, b) => {
        const aId = Number(a.id) || 0;
        const bId = Number(b.id) || 0;
        return aId - bId;
      });

      setPatients(sorted);
    } catch (error) {
      console.error("Error loading patients:", error);

      showSnackbar(
        error.response?.data?.detail ||
          "Unable to load patient records.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return patients;
    }

    return patients.filter((patient) => {
      return [
        patient.patient_id,
        patient.full_name,
        patient.age,
        patient.gender,
        patient.phone,
        patient.email,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        );
    });
  }, [patients, search]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddPatient = () => {
    setEditMode(false);
    setSelectedPatient(null);
    setFormData(emptyForm);
    setOpenForm(true);
  };

  const openEditPatient = (patient) => {
    setEditMode(true);
    setSelectedPatient(patient);

    setFormData({
      full_name: patient.full_name || "",
      age: patient.age ?? "",
      gender: patient.gender || "",
      blood_group: patient.blood_group || "",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      date_of_birth: patient.date_of_birth
        ? String(patient.date_of_birth).slice(0, 10)
        : "",
    });

    setOpenForm(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setOpenForm(false);
    setEditMode(false);
    setSelectedPatient(null);
    setFormData(emptyForm);
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      showSnackbar("Please enter the patient's full name.", "warning");
      return false;
    }

    if (!formData.age) {
      showSnackbar("Please enter the patient's age.", "warning");
      return false;
    }

    if (!formData.gender) {
      showSnackbar("Please select gender.", "warning");
      return false;
    }

    if (!formData.phone.trim()) {
      showSnackbar("Please enter the phone number.", "warning");
      return false;
    }

    return true;
  };

  const handleSavePatient = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        full_name: formData.full_name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        blood_group: formData.blood_group || null,
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        date_of_birth: formData.date_of_birth || null,
      };

      if (editMode && selectedPatient) {
        await patientService.updatePatient(
          selectedPatient.id,
          payload
        );

        showSnackbar(
          "Patient updated successfully.",
          "success"
        );
      } else {
        await patientService.addPatient(payload);

        showSnackbar(
          "Patient added successfully.",
          "success"
        );
      }

      closeForm();
      await loadPatients();
    } catch (error) {
      console.error("Error saving patient:", error);

      showSnackbar(
        error.response?.data?.detail ||
          "Failed to save patient.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setOpenView(true);
  };

  const closeView = () => {
    setOpenView(false);
    setSelectedPatient(null);
  };

  const handleDeletePatient = (patient) => {
    setDeletePatient(patient);
    setOpenDelete(true);
  };

  const closeDelete = () => {
    setOpenDelete(false);
    setDeletePatient(null);
  };

  const confirmDelete = async () => {
    if (!deletePatient) {
      return;
    }

    try {
      await patientService.deletePatient(deletePatient.id);

      closeDelete();
      await loadPatients();

      showSnackbar(
        "Patient deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error deleting patient:", error);

      showSnackbar(
        error.response?.data?.detail ||
          "Failed to delete patient.",
        "error"
      );

      closeDelete();
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    const value = String(date).slice(0, 10);
    const parts = value.split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return value;
  };

  return (
    <div className="patient-page">
      <Navbar />

      <div className="patient-body">
        <Sidebar />

        <main className="patient-content">
          <div className="patient-content-inner">

            {/* PAGE HEADER */}
            <Box className="patient-page-header">
              <Box className="patient-title-group">
                <Box className="patient-title-icon">
                  <PeopleIcon />
                </Box>

                <Box>
                  <Typography className="patient-page-title">
                    Patient Management
                  </Typography>

                  <Typography className="patient-page-subtitle">
                    Manage all patient records
                  </Typography>
                </Box>
              </Box>

              <Box className="patient-toolbar">
                <TextField
                  className="patient-search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search Patient..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="patient-symbol patient-search-symbol">⌕</span>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  className="patient-add-button"
                  variant="contained"
                  startIcon={<span className="patient-add-symbol">+</span>}
                  onClick={openAddPatient}
                >
                  ADD PATIENT
                </Button>
              </Box>
            </Box>

            {/* PATIENT TABLE */}
            <Paper
              className="patient-table-card"
              elevation={0}
            >
              <Box className="patient-table-scroll">
                <table className="patient-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Full Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="patient-loading-cell"
                        >
                          <CircularProgress size={28} />
                          <span>
                            Loading patient records...
                          </span>
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="patient-empty-cell"
                        >
                          No patient records found.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="patient-id-cell">
                            {patient.patient_id}
                          </td>

                          <td className="patient-name-cell">
                            {patient.full_name}
                          </td>

                          <td>{patient.age}</td>

                          <td>{patient.gender}</td>

                          <td>{patient.phone}</td>

                          <td>
                            <Box className="patient-actions">
                              <IconButton
                                className="patient-action-view"
                                onClick={() =>
                                  handleViewPatient(
                                    patient
                                  )
                                }
                                title="View patient"
                              >
                                <span className="patient-action-symbol">◉</span>
                              </IconButton>

                              <IconButton
                                className="patient-action-edit"
                                onClick={() =>
                                  openEditPatient(
                                    patient
                                  )
                                }
                                title="Edit patient"
                              >
                                <span className="patient-action-symbol">✎</span>
                              </IconButton>

                              <IconButton
                                className="patient-action-delete"
                                onClick={() =>
                                  handleDeletePatient(
                                    patient
                                  )
                                }
                                title="Delete patient"
                              >
                                <span className="patient-action-symbol">▮</span>
                              </IconButton>
                            </Box>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Box>

              {!loading && (
                <Box className="patient-table-footer">
                  <Typography>
                    Showing {filteredPatients.length} of{" "}
                    {patients.length} patients
                  </Typography>
                </Box>
              )}
            </Paper>
          </div>
        </main>
      </div>

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={openForm}
        onClose={closeForm}
        fullWidth
        maxWidth="sm"
        className="patient-dialog"
      >
        <DialogTitle className="patient-dialog-title">
          <Box className="patient-dialog-title-content">
            <Box className="patient-dialog-icon">
              <span className="patient-symbol">●</span>
            </Box>

            <Typography>
              {editMode
                ? "Edit Patient"
                : "Add New Patient"}
            </Typography>
          </Box>

          <IconButton
            onClick={closeForm}
            disabled={saving}
            className="patient-dialog-close"
          >
            <span className="patient-symbol close-symbol">×</span>
          </IconButton>
        </DialogTitle>

        <DialogContent className="patient-dialog-content">
          {/* PERSONAL INFORMATION */}
          <Box className="patient-dialog-section">
            <Box className="patient-dialog-section-title">
              <span className="patient-symbol">●</span>
              <Typography>
                Personal Information
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="Age"
                  name="age"
                  type="number"
                  inputProps={{ min: 0, max: 120 }}
                  value={formData.age}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                >
                  {genderOptions.map((gender) => (
                    <MenuItem
                      key={gender}
                      value={gender}
                    >
                      {gender}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  select
                  label="Blood Group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleFormChange}
                >
                  <MenuItem value="">
                    Select Blood Group
                  </MenuItem>

                  {bloodGroups.map((group) => (
                    <MenuItem
                      key={group}
                      value={group}
                    >
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleFormChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* CONTACT INFORMATION */}
          <Box className="patient-dialog-section">
            <Box className="patient-dialog-section-title">
              <span className="patient-symbol">☎</span>
              <Typography>
                Contact Information
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="patient-symbol">☎</span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="patient-symbol">✉</span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ADDRESS */}
          <Box className="patient-dialog-section">
            <Box className="patient-dialog-section-title">
              <span className="patient-symbol">●</span>
              <Typography>
                Address
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Enter full address"
            />
          </Box>
        </DialogContent>

        <DialogActions className="patient-dialog-actions">
          <Button
            onClick={closeForm}
            disabled={saving}
            className="patient-cancel-button"
          >
            CANCEL
          </Button>

          <Button
            onClick={handleSavePatient}
            disabled={saving}
            variant="contained"
            className="patient-save-button"
          >
            {saving ? (
              <CircularProgress
                size={21}
                sx={{ color: "#ffffff" }}
              />
            ) : (
              "SAVE PATIENT"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog
        open={openView}
        onClose={closeView}
        fullWidth
        maxWidth="sm"
        className="patient-dialog"
      >
        <DialogTitle className="patient-dialog-title">
          <Box className="patient-dialog-title-content">
            <Box className="patient-dialog-icon">
              <span className="patient-action-symbol">◉</span>
            </Box>

            <Typography>
              View Patient Details
            </Typography>
          </Box>

          <IconButton
            onClick={closeView}
            className="patient-dialog-close"
          >
            <span className="patient-symbol close-symbol">×</span>
          </IconButton>
        </DialogTitle>

        <DialogContent className="patient-dialog-content">
          {selectedPatient && (
            <>
              <Box className="patient-dialog-section">
                <Box className="patient-dialog-section-title">
                  <span className="patient-symbol">●</span>
                  <Typography>
                    Patient Information
                  </Typography>
                </Box>

                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box className="patient-detail-box">
                      <span>Patient ID</span>
                      <strong>
                        {selectedPatient.patient_id}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Box className="patient-detail-box">
                      <span>Full Name</span>
                      <strong>
                        {selectedPatient.full_name}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Box className="patient-detail-box">
                      <span>Age</span>
                      <strong>
                        {selectedPatient.age}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box className="patient-detail-box">
                      <span>Gender</span>
                      <strong>
                        {selectedPatient.gender ||
                          "Not provided"}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box className="patient-detail-box">
                      <span>Blood Group</span>
                      <strong>
                        {selectedPatient.blood_group ||
                          "Not provided"}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box className="patient-detail-box">
                      <span>Phone</span>
                      <strong>
                        {selectedPatient.phone ||
                          "Not provided"}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className="patient-detail-box">
                      <span>Email</span>
                      <strong>
                        {selectedPatient.email ||
                          "Not provided"}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className="patient-detail-box">
                      <span>Date of Birth</span>
                      <strong>
                        {formatDate(
                          selectedPatient.date_of_birth
                        )}
                      </strong>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box className="patient-detail-box">
                      <span>Address</span>
                      <strong>
                        {selectedPatient.address ||
                          "Not provided"}
                      </strong>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions className="patient-dialog-actions">
          <Button
            onClick={closeView}
            className="patient-cancel-button"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog
        open={openDelete}
        onClose={closeDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Delete Patient
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>
              {deletePatient?.full_name}
            </strong>
            ?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDelete}>
            CANCEL
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Patient;