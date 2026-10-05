import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";

import patientService from "../services/patientService";
import clinicalRecordService from "../services/clinicalRecordService";
import ClinicalRecordTable from "../components/clinical/ClinicalRecordTable";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/clinical.css";
// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {
  patient_id: "",
  diagnosis: "",
  admission_type: "",
  length_of_stay: "",

  // Raw data for feature engineering
  diagnoses: "",
  drugs: "",
  org_name: "",
  antibiotic_results: "",

  // Laboratory values
  creatinine: "",
  glucose: "",
  hemoglobin: "",
  white_blood_cells: "",
  platelet_count: "",
  potassium: "",
  sodium: "",
  urea_nitrogen: "",
};


// ======================================================
// ADMISSION TYPES
// ======================================================

const admissionTypes = [
  "URGENT",
  "ELECTIVE",
  "EW EMER.",
  "DIRECT EMER.",
  "EU OBSERVATION",
  "OBSERVATION ADMIT",
  "DIRECT OBSERVATION",
  "AMBULATORY OBSERVATION",
  "SURGICAL SAME DAY ADMISSION",
];


function Clinical() {
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingRecords, setLoadingRecords] =
    useState(true);

  const [saving, setSaving] = useState(false);

  // View
  const [openView, setOpenView] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  // Edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    loadPatients();
    loadRecords();
  }, []);


  const loadPatients = async () => {
    try {
      setLoadingPatients(true);

      const data =
        await patientService.getPatients();

      setPatients(data);
    } catch (error) {
      console.error(
        "Error loading patients:",
        error
      );

      showSnackbar(
        "Unable to load patient records.",
        "error"
      );
    } finally {
      setLoadingPatients(false);
    }
  };


  const loadRecords = async () => {
    try {
      setLoadingRecords(true);

      const data =
        await clinicalRecordService.getRecords();

      setRecords(data);
    } catch (error) {
      console.error(
        "Error loading clinical records:",
        error
      );

      showSnackbar(
        "Unable to load clinical records.",
        "error"
      );
    } finally {
      setLoadingRecords(false);
    }
  };


  // ======================================================
  // SNACKBAR
  // ======================================================

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };


  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };


  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  // ======================================================
  // VALIDATION
  // ======================================================

  const validateClinicalForm = () => {
    if (!formData.patient_id) {
      showSnackbar(
        "Please select a patient.",
        "warning"
      );
      return false;
    }

    if (!formData.diagnosis.trim()) {
      showSnackbar(
        "Please enter the diagnosis.",
        "warning"
      );
      return false;
    }

    if (!formData.admission_type) {
      showSnackbar(
        "Please select the admission type.",
        "warning"
      );
      return false;
    }

    if (
      formData.length_of_stay === "" ||
      Number(formData.length_of_stay) < 0
    ) {
      showSnackbar(
        "Please enter a valid length of stay.",
        "warning"
      );
      return false;
    }

    if (!formData.diagnoses.trim()) {
      showSnackbar(
        "Please enter the diagnoses used for feature engineering.",
        "warning"
      );
      return false;
    }

    if (!formData.drugs.trim()) {
      showSnackbar(
        "Please enter the drugs / antibiotics used. Use No_Drug if none.",
        "warning"
      );
      return false;
    }

    if (!formData.org_name.trim()) {
      showSnackbar(
        "Please enter the culture / organism information. Use No_Culture if unavailable.",
        "warning"
      );
      return false;
    }

    return true;
  };


  // ======================================================
  // ADD CLINICAL RECORD
  // ======================================================

  const handleSubmit = async () => {
    if (!validateClinicalForm()) {
      return;
    }

    try {
      setSaving(true);

      const record = {
        patient_id: Number(
          formData.patient_id
        ),

        diagnosis:
          formData.diagnosis.trim(),

        admission_type:
          formData.admission_type,

        length_of_stay:
          Number(formData.length_of_stay),

        // Raw feature-engineering data
        diagnoses:
          formData.diagnoses.trim(),

        drugs:
          formData.drugs.trim(),

        org_name:
          formData.org_name.trim(),

        antibiotic_results:
          formData.antibiotic_results.trim(),


        // Laboratory values
        creatinine:
          Number(formData.creatinine),

        glucose:
          Number(formData.glucose),

        hemoglobin:
          Number(formData.hemoglobin),

        white_blood_cells:
          Number(formData.white_blood_cells),

        platelet_count:
          Number(formData.platelet_count),

        potassium:
          Number(formData.potassium),

        sodium:
          Number(formData.sodium),

        urea_nitrogen:
          Number(formData.urea_nitrogen),
      };

      await clinicalRecordService.addRecord(
        record
      );

      setFormData(emptyForm);

      await loadRecords();

      showSnackbar(
        "Clinical record saved successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Error saving clinical record:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Failed to save clinical record.";

      showSnackbar(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };


  // ======================================================
  // VIEW
  // ======================================================

  const handleViewRecord = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };


  const handleCloseView = () => {
    setOpenView(false);
    setViewRecord(null);
  };


  // ======================================================
  // EDIT
  // ======================================================

  const handleEditRecord = (record) => {
    setEditRecord(record);

    setFormData({
      patient_id:
        record.patient_id,

      diagnosis:
        record.diagnosis || "",

      admission_type:
        record.admission_type || "",

      length_of_stay:
        record.length_of_stay ?? "",

      diagnoses:
        record.diagnoses || "",

      drugs:
        record.drugs || "",

      org_name:
        record.org_name || "",

      antibiotic_results:
        record.antibiotic_results || "",

      creatinine:
        record.creatinine ?? "",

      glucose:
        record.glucose ?? "",

      hemoglobin:
        record.hemoglobin ?? "",

      white_blood_cells:
        record.white_blood_cells ?? "",

      platelet_count:
        record.platelet_count ?? "",

      potassium:
        record.potassium ?? "",

      sodium:
        record.sodium ?? "",

      urea_nitrogen:
        record.urea_nitrogen ?? "",
    });

    setOpenEdit(true);
  };


  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditRecord(null);
    setFormData(emptyForm);
  };


  const handleUpdateRecord = async () => {
    if (!editRecord) {
      return;
    }

    if (!formData.diagnosis.trim()) {
      showSnackbar(
        "Please enter the diagnosis.",
        "warning"
      );
      return;
    }

    if (!formData.admission_type) {
      showSnackbar(
        "Please select the admission type.",
        "warning"
      );
      return;
    }

    if (
      formData.length_of_stay === "" ||
      Number(formData.length_of_stay) < 0
    ) {
      showSnackbar(
        "Please enter a valid length of stay.",
        "warning"
      );
      return;
    }

    if (!formData.diagnoses.trim()) {
      showSnackbar(
        "Please enter the diagnoses.",
        "warning"
      );
      return;
    }

    if (!formData.drugs.trim()) {
      showSnackbar(
        "Please enter the drugs / antibiotics. Use No_Drug if none.",
        "warning"
      );
      return;
    }

    if (!formData.org_name.trim()) {
      showSnackbar(
        "Please enter the culture / organism. Use No_Culture if unavailable.",
        "warning"
      );
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        diagnosis:
          formData.diagnosis.trim(),

        admission_type:
          formData.admission_type,

        length_of_stay:
          Number(formData.length_of_stay),

        diagnoses:
          formData.diagnoses.trim(),

        drugs:
          formData.drugs.trim(),

        org_name:
          formData.org_name.trim(),

        antibiotic_results:
          formData.antibiotic_results.trim(),

        creatinine:
          Number(formData.creatinine),

        glucose:
          Number(formData.glucose),

        hemoglobin:
          Number(formData.hemoglobin),

        white_blood_cells:
          Number(formData.white_blood_cells),

        platelet_count:
          Number(formData.platelet_count),

        potassium:
          Number(formData.potassium),

        sodium:
          Number(formData.sodium),

        urea_nitrogen:
          Number(formData.urea_nitrogen),
      };

      await clinicalRecordService.updateRecord(
        editRecord.id,
        updateData
      );

      setOpenEdit(false);
      setEditRecord(null);
      setFormData(emptyForm);

      await loadRecords();

      showSnackbar(
        "Clinical record updated successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Error updating clinical record:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Failed to update clinical record.";

      showSnackbar(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };


  // ======================================================
  // DELETE
  // ======================================================

  const handleDeleteRecord = (record) => {
    setDeleteRecord(record);
    setOpenDelete(true);
  };


  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteRecord(null);
  };


  const handleConfirmDelete = async () => {
    if (!deleteRecord) {
      return;
    }

    try {
      await clinicalRecordService.deleteRecord(
        deleteRecord.id
      );

      setOpenDelete(false);
      setDeleteRecord(null);

      await loadRecords();

      showSnackbar(
        "Clinical record deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Error deleting clinical record:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Failed to delete clinical record.";

      setOpenDelete(false);
      setDeleteRecord(null);

      showSnackbar(
        message,
        "error"
      );
    }
  };


  // ======================================================
  // PATIENT FINDER
  // ======================================================

  const getPatient = (patientId) => {
    return patients.find(
      (patient) =>
        patient.id === patientId
    );
  };


return (
  <div className="clinical-page">

    <Navbar />

    <div className="clinical-body">

      <Sidebar />

        <main className="clinical-content">

        <div className="clinical-content-inner">

          {/* ==================================================
              HEADER
          ================================================== */}

      <div className="clinical-page-header">
        <div className="clinical-title-row">
          <div className="clinical-title-icon">
            <DescriptionOutlinedIcon />
          </div>
          <div>
            <Typography
              variant="h4"
              fontWeight="bold"
              className="clinical-page-title"
            >
              Clinical Records
            </Typography>
            <Typography className="clinical-page-subtitle">
              Enter and manage patient clinical information
            </Typography>
          </div>
        </div>
      </div>


      {/* ==================================================
          ADD FORM
      ================================================== */}

      <Paper
        elevation={0}
        className="clinical-form-card"
      >

        <div className="clinical-section-header">
          <div className="clinical-section-icon">
            <AssignmentOutlinedIcon />
          </div>
          <Typography variant="h6" fontWeight="bold">
            Clinical Information
          </Typography>
        </div>


        <Grid container spacing={2}>

          {/* Patient */}

          <Grid size={{ xs: 12 }}>

            {loadingPatients ? (

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >

                <CircularProgress
                  size={24}
                  sx={{
                    color: "#020E33",
                  }}
                />

                <Typography color="text.secondary">
                  Loading patients...
                </Typography>

              </Box>

            ) : (

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                select
                label="Select Patient"
                name="patient_id"
                value={
                  formData.patient_id
                }
                onChange={handleChange}
              >

                {patients.length === 0 ? (

                  <MenuItem disabled>
                    No patients available
                  </MenuItem>

                ) : (

                  patients.map((patient) => (

                    <MenuItem
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.patient_id} -{" "}
                      {patient.full_name}
                    </MenuItem>

                  ))

                )}

              </TextField>

            )}

          </Grid>


          {/* Diagnosis */}

          <Grid size={{ xs: 12 }}>

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              label="Diagnosis"
              name="diagnosis"
              value={
                formData.diagnosis
              }
              onChange={handleChange}
              placeholder="Enter primary diagnosis"
            />

          </Grid>


          {/* Admission Type */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              select
              label="Admission Type"
              name="admission_type"
              value={
                formData.admission_type
              }
              onChange={handleChange}
            >

              <MenuItem value="">
                Select Admission Type
              </MenuItem>

              {admissionTypes.map(
                (type) => (

                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type}
                  </MenuItem>

                )
              )}

            </TextField>

          </Grid>


          {/* Length of Stay */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              label="Length of Stay (Days)"
              name="length_of_stay"
              type="number"
              inputProps={{
                min: 0,
              }}
              value={
                formData.length_of_stay
              }
              onChange={handleChange}
              placeholder="Number of hospital stay days"
            />

          </Grid>


          {/* ==================================================
              RAW FEATURE ENGINEERING DATA
          ================================================== */}

          <Grid size={{ xs: 12 }}>

            <div className="clinical-section-header clinical-section-header-spaced">
              <div className="clinical-section-icon">
                <AssignmentOutlinedIcon />
              </div>
              <Typography variant="h6" fontWeight="bold">
                Clinical Data for Feature Engineering
              </Typography>
            </div>

            <Typography className="clinical-section-description">
              Enter multiple values using semicolons (;). Use No_Drug or No_Culture when applicable.
            </Typography>

          </Grid>


          {/* Diagnoses */}

          <Grid size={{ xs: 12 }}>

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              label="Diagnoses"
              name="diagnoses"
              value={
                formData.diagnoses
              }
              onChange={handleChange}
              placeholder="Example: Pneumonia;Diabetes;Hypertension"
              helperText="Separate multiple diagnoses using ;"
            />

          </Grid>


          {/* Drugs */}

          <Grid size={{ xs: 12 }}>

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              label="Drugs / Antibiotics"
              name="drugs"
              value={
                formData.drugs
              }
              onChange={handleChange}
              placeholder="Example: Cefepime;Vancomycin"
              helperText="Use No_Drug if no drug exposure is recorded"
            />

          </Grid>


          {/* Culture / Organism */}

          <Grid size={{ xs: 12 }}>

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              label="Culture / Organism"
              name="org_name"
              value={
                formData.org_name
              }
              onChange={handleChange}
              placeholder="Example: E.coli;Klebsiella"
              helperText="Use No_Culture if culture information is unavailable"
            />

          </Grid>
          {/* Antibiotic Susceptibility Results */}

<Grid size={{ xs: 12 }}>

  <TextField
    fullWidth
    label="Antibiotic Susceptibility Results"
    name="antibiotic_results"
    value={formData.antibiotic_results}
    onChange={handleChange}
    multiline
    minRows={3}
    placeholder="Example: CEFEPIME:S; CEFTAZIDIME:R; MEROPENEM:S"
    helperText="Enter reported susceptibility results using S = Susceptible, I = Intermediate, R = Resistant. Use No_Test if unavailable."
  />

</Grid>


          {/* ==================================================
              LABORATORY VALUES
          ================================================== */}

          <Grid size={{ xs: 12 }}>

            <div className="clinical-section-header clinical-section-header-spaced">
              <div className="clinical-section-icon">
                <ScienceOutlinedIcon />
              </div>
              <Typography variant="h6" fontWeight="bold">
                Laboratory Values
              </Typography>
            </div>

          </Grid>


          {/* Creatinine */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Creatinine"
              name="creatinine"
              type="number"
              value={
                formData.creatinine
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Glucose */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Glucose"
              name="glucose"
              type="number"
              value={
                formData.glucose
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Hemoglobin */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Hemoglobin"
              name="hemoglobin"
              type="number"
              value={
                formData.hemoglobin
              }
              onChange={handleChange}
            />

          </Grid>


          {/* WBC */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="White Blood Cells"
              name="white_blood_cells"
              type="number"
              value={
                formData.white_blood_cells
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Platelet */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Platelet Count"
              name="platelet_count"
              type="number"
              value={
                formData.platelet_count
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Potassium */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Potassium"
              name="potassium"
              type="number"
              value={
                formData.potassium
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Sodium */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Sodium"
              name="sodium"
              type="number"
              value={
                formData.sodium
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Urea Nitrogen */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >

            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Urea Nitrogen"
              name="urea_nitrogen"
              type="number"
              value={
                formData.urea_nitrogen
              }
              onChange={handleChange}
            />

          </Grid>


          {/* Save */}

          <Grid size={{ xs: 12 }}>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                mt: 2,
              }}
            >

              <Button
                variant="contained"
                onClick={
                  handleSubmit
                }
                disabled={
                  saving ||
                  loadingPatients
                }
                sx={{
                  background:
                    "#020E33",
                  px: 4,
                  py: 1.2,

                  "&:hover": {
                    background:
                      "#03154D",
                  },
                }}
              >

                {saving ? (

                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#fff",
                    }}
                  />

                ) : (

                  "Save Clinical Record"

                )}

              </Button>

            </Box>

          </Grid>

        </Grid>

      </Paper>


      {/* ==================================================
          SAVED RECORDS
      ================================================== */}

      <Box sx={{ mt: 4 }}>

        <Typography
          variant="h6"
          fontWeight="bold"
          className="saved-records-title"
          sx={{ mb: 2 }}
        >
          Saved Clinical Records
        </Typography>


        {loadingRecords ? (

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "center",
              py: 5,
            }}
          >

            <CircularProgress
              sx={{
                color: "#020E33",
              }}
            />

          </Box>

        ) : (

          <ClinicalRecordTable
            records={records}
            patients={patients}
            onView={
              handleViewRecord
            }
            onEdit={
              handleEditRecord
            }
            onDelete={
              handleDeleteRecord
            }
          />

        )}

      </Box>


      {/* ==================================================
          VIEW DIALOG
      ================================================== */}

      <Dialog
        open={openView}
        onClose={handleCloseView}
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>
          Clinical Record Details
        </DialogTitle>


        <DialogContent>

          {viewRecord && (

            <Grid
              container
              spacing={2}
              sx={{ mt: 1 }}
            >

              {/* Patient */}

              <Grid size={{ xs: 12 }}>

                <TextField
                  fullWidth
                  label="Patient"
                  value={
                    getPatient(
                      viewRecord.patient_id
                    )
                      ? `${getPatient(viewRecord.patient_id).patient_id} - ${getPatient(viewRecord.patient_id).full_name}`
                      : `Patient #${viewRecord.patient_id}`
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Diagnosis */}

              <Grid size={{ xs: 12 }}>

                <TextField
                  fullWidth
                  label="Diagnosis"
                  value={
                    viewRecord.diagnosis ||
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Admission */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Admission Type"
                  value={
                    viewRecord.admission_type ||
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* LOS */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Length of Stay (Days)"
                  value={
                    viewRecord.length_of_stay ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Diagnoses */}

              <Grid size={{ xs: 12 }}>

                <TextField
                  fullWidth
                  label="Diagnoses"
                  value={
                    viewRecord.diagnoses ||
                    "Not Recorded"
                  }
                  multiline
                  minRows={2}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Drugs */}

              <Grid size={{ xs: 12 }}>

                <TextField
                  fullWidth
                  label="Drugs / Antibiotics"
                  value={
                    viewRecord.drugs ||
                    "Not Recorded"
                  }
                  multiline
                  minRows={2}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Culture */}

              <Grid size={{ xs: 12 }}>

                <TextField
                  fullWidth
                  label="Culture / Organism"
                  value={
                    viewRecord.org_name ||
                    "Not Recorded"
                  }
                  multiline
                  minRows={2}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Antibiotic Susceptibility */}

              <Grid size={{ xs: 12 }}>

                <TextField
                  fullWidth
                  label="Antibiotic Susceptibility Results"
                  value={
                    viewRecord.antibiotic_results ||
                    "Not Recorded"
                  }
                  multiline
                  minRows={3}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  helperText="S = Susceptible | I = Intermediate | R = Resistant"
                />

              </Grid>


              {/* Creatinine */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Creatinine"
                  value={
                    viewRecord.creatinine ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Glucose */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Glucose"
                  value={
                    viewRecord.glucose ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Hemoglobin */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Hemoglobin"
                  value={
                    viewRecord.hemoglobin ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* WBC */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="White Blood Cells"
                  value={
                    viewRecord.white_blood_cells ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Platelet */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Platelet Count"
                  value={
                    viewRecord.platelet_count ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Potassium */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Potassium"
                  value={
                    viewRecord.potassium ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Sodium */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Sodium"
                  value={
                    viewRecord.sodium ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>


              {/* Urea */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  label="Urea Nitrogen"
                  value={
                    viewRecord.urea_nitrogen ??
                    ""
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

              </Grid>

            </Grid>

          )}

        </DialogContent>


        <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={
              handleCloseView
            }
            variant="contained"
            sx={{
              background:
                "#020E33",

              "&:hover": {
                background:
                  "#03154D",
              },
            }}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>


      {/* ==================================================
          EDIT DIALOG
      ================================================== */}

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>
          Edit Clinical Record
        </DialogTitle>


        <DialogContent>

          <Grid
            container
            spacing={2}
            sx={{ mt: 1 }}
          >

            {/* Patient */}

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Patient"
                value={
                  editRecord &&
                  getPatient(
                    editRecord.patient_id
                  )
                    ? `${getPatient(editRecord.patient_id).patient_id} - ${getPatient(editRecord.patient_id).full_name}`
                    : ""
                }
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                helperText="Patient cannot be changed"
              />

            </Grid>


            {/* Diagnosis */}

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                label="Diagnosis"
                name="diagnosis"
                value={
                  formData.diagnosis
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Admission */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                select
                label="Admission Type"
                name="admission_type"
                value={
                  formData.admission_type
                }
                onChange={
                  handleChange
                }
              >

                <MenuItem value="">
                  Select Admission Type
                </MenuItem>

                {admissionTypes.map(
                  (type) => (

                    <MenuItem
                      key={type}
                      value={type}
                    >
                      {type}
                    </MenuItem>

                  )
                )}

              </TextField>

            </Grid>


            {/* LOS */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                label="Length of Stay (Days)"
                name="length_of_stay"
                type="number"
                inputProps={{
                  min: 0,
                }}
                value={
                  formData.length_of_stay
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Diagnoses */}

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                label="Diagnoses"
                name="diagnoses"
                value={
                  formData.diagnoses
                }
                onChange={
                  handleChange
                }
                multiline
                minRows={2}
              />

            </Grid>


            {/* Drugs */}

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                label="Drugs / Antibiotics"
                name="drugs"
                value={
                  formData.drugs
                }
                onChange={
                  handleChange
                }
                multiline
                minRows={2}
              />

            </Grid>


            {/* Culture */}

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                label="Culture / Organism"
                name="org_name"
                value={
                  formData.org_name
                }
                onChange={
                  handleChange
                }
                multiline
                minRows={2}
              />

            </Grid>


            {/* Antibiotic Susceptibility */}

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Antibiotic Susceptibility Results"
                name="antibiotic_results"
                value={formData.antibiotic_results}
                onChange={handleChange}
                multiline
                minRows={3}
                placeholder="Example: CEFEPIME:S; CEFTAZIDIME:R; MEROPENEM:S"
                helperText="S = Susceptible | I = Intermediate | R = Resistant. Use No_Test if unavailable."
              />

            </Grid>


            {/* Creatinine */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Creatinine"
                name="creatinine"
                type="number"
                value={
                  formData.creatinine
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Glucose */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Glucose"
                name="glucose"
                type="number"
                value={
                  formData.glucose
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Hemoglobin */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Hemoglobin"
                name="hemoglobin"
                type="number"
                value={
                  formData.hemoglobin
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* WBC */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="White Blood Cells"
                name="white_blood_cells"
                type="number"
                value={
                  formData.white_blood_cells
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Platelet */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Platelet Count"
                name="platelet_count"
                type="number"
                value={
                  formData.platelet_count
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Potassium */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Potassium"
                name="potassium"
                type="number"
                value={
                  formData.potassium
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Sodium */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Sodium"
                name="sodium"
                type="number"
                value={
                  formData.sodium
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* Urea */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >

              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Urea Nitrogen"
                name="urea_nitrogen"
                type="number"
                value={
                  formData.urea_nitrogen
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

          </Grid>

        </DialogContent>


        <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={
              handleCloseEdit
            }
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            onClick={
              handleUpdateRecord
            }
            disabled={saving}
            sx={{
              background:
                "#020E33",

              "&:hover": {
                background:
                  "#03154D",
              },
            }}
          >

            {saving ? (

              <CircularProgress
                size={24}
                sx={{
                  color: "#fff",
                }}
              />

            ) : (

              "Update Clinical Record"

            )}

          </Button>

        </DialogActions>

      </Dialog>


      {/* ==================================================
          DELETE DIALOG
      ================================================== */}

      <Dialog
        open={openDelete}
        onClose={
          handleCloseDelete
        }
        fullWidth
        maxWidth="xs"
      >

        <DialogTitle>
          Delete Clinical Record
        </DialogTitle>


        <DialogContent>

          <Typography>
            Are you sure you want to
            delete this clinical record?
          </Typography>


          {deleteRecord && (

            <Typography
              sx={{
                mt: 2,
                fontWeight: "bold",
              }}
            >
              {getPatient(
                deleteRecord.patient_id
              )
                ? `${getPatient(deleteRecord.patient_id).patient_id} - ${getPatient(deleteRecord.patient_id).full_name}`
                : `Patient #${deleteRecord.patient_id}`}
            </Typography>

          )}


          {deleteRecord && (

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Diagnosis:{" "}
              {deleteRecord.diagnosis}
            </Typography>

          )}

        </DialogContent>


        <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={
              handleCloseDelete
            }
          >
            Cancel
          </Button>


          <Button
            onClick={
              handleConfirmDelete
            }
            variant="contained"
            color="error"
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>


      {/* ==================================================
          SNACKBAR
      ================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >

        <Alert
          onClose={
            handleCloseSnackbar
          }
          severity={
            snackbar.severity
          }
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

        </div>
      </main>
    </div>
  </div>
  );
}


export default Clinical;