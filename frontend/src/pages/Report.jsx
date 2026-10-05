import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Chip,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VerifiedIcon from "@mui/icons-material/Verified";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import api from "../services/api";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/report.css";


function Report() {

  // ============================================================
  // STATE
  // ============================================================

  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] =
    useState("");

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingVerification, setLoadingVerification] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [verification, setVerification] =
    useState(null);

  const [doctorNotes, setDoctorNotes] =
    useState("");

  const [error, setError] =
    useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  // ============================================================
  // LOAD PATIENTS
  // ============================================================

  useEffect(() => {

    const loadPatients = async () => {

      try {

        setLoadingPatients(true);
        setError("");

        const response =
          await api.get("/patients/");

        const sortedPatients =
          [...response.data].sort(
            (a, b) => a.id - b.id
          );

        setPatients(sortedPatients);

      } catch (err) {

        console.error(
          "Error loading patients:",
          err
        );

        const message =
          err.response?.data?.detail ||
          "Failed to load patient records.";

        setError(message);

      } finally {

        setLoadingPatients(false);

      }

    };

    loadPatients();

  }, []);


  // ============================================================
  // SNACKBAR
  // ============================================================

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


  // ============================================================
  // LOAD EXISTING VERIFICATION
  // ============================================================

  const loadVerification = async (patientId) => {

    if (!patientId) {

      setVerification(null);
      setDoctorNotes("");

      return;

    }

    try {

      setLoadingVerification(true);

      const response =
        await api.get(
          `/doctor-verification/patient/${patientId}`
        );

      setVerification(response.data);

      setDoctorNotes(
        response.data.doctor_notes || ""
      );

    } catch (err) {

      // --------------------------------------------------------
      // 404 MEANS NO VERIFICATION YET
      // --------------------------------------------------------

      if (err.response?.status === 404) {

        setVerification(null);
        setDoctorNotes("");

      } else {

        console.error(
          "Error loading doctor verification:",
          err
        );

        showSnackbar(
          "Failed to load doctor verification.",
          "error"
        );

      }

    } finally {

      setLoadingVerification(false);

    }

  };


  // ============================================================
  // PATIENT CHANGE
  // ============================================================

  const handlePatientChange = async (event) => {

    const patientId =
      event.target.value;

    setSelectedPatient(patientId);

    // Clear old verification
    setVerification(null);

    // Clear old notes
    setDoctorNotes("");

    // Load verification from database
    await loadVerification(patientId);

  };


  // ============================================================
  // DOCTOR VERIFICATION
  // ============================================================

  const handleVerifyReport = async () => {

    if (!selectedPatient) {

      showSnackbar(
        "Please select a patient.",
        "warning"
      );

      return;

    }


    try {

      setVerifying(true);

      const response =
        await api.post(
          "/doctor-verification/verify",
          {
            patient_id:
              Number(selectedPatient),

            verification_status:
              "Verified",

            doctor_notes:
              doctorNotes.trim() ||
              "Prediction, SHAP explanation and clinical recommendation reviewed.",
          }
        );


      // Save returned verification
      setVerification(response.data);

      // Update notes
      setDoctorNotes(
        response.data.doctor_notes || ""
      );


      showSnackbar(
        "Clinical report verified successfully.",
        "success"
      );


    } catch (err) {

      console.error(
        "Doctor verification error:",
        err
      );


      const message =
        err.response?.data?.detail ||
        "Failed to verify clinical report.";


      showSnackbar(
        message,
        "error"
      );


    } finally {

      setVerifying(false);

    }

  };


  // ============================================================
  // GENERATE PDF REPORT
  // ============================================================

  const handleGenerateReport = async () => {

    if (!selectedPatient) {

      showSnackbar(
        "Please select a patient.",
        "warning"
      );

      return;

    }


    if (!verification) {

      showSnackbar(
        "Please verify the report before generating the PDF.",
        "warning"
      );

      return;

    }


    try {

      setGenerating(true);


      const response =
        await api.get(
          `/generate/${selectedPatient}`,
          {
            responseType: "blob",
          }
        );


      const blob =
        new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        );


      const url =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        `AMR-Report-${selectedPatient}.pdf`;


      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);


      showSnackbar(
        "AMR report generated successfully.",
        "success"
      );


    } catch (err) {

      console.error(
        "Report generation error:",
        err
      );


      let message =
        "Failed to generate AMR report.";


      // --------------------------------------------------------
      // HANDLE BLOB ERROR RESPONSE
      // --------------------------------------------------------

      if (err.response?.data) {

        try {

          const errorText =
            await err.response.data.text();

          const errorData =
            JSON.parse(errorText);


          if (errorData.detail) {

            message =
              errorData.detail;

          }

        } catch {

          // Keep default message

        }

      }


      showSnackbar(
        message,
        "error"
      );


    } finally {

      setGenerating(false);

    }

  };


  // ============================================================
  // SELECTED PATIENT
  // ============================================================

  const selectedPatientData =
    patients.find(
      (item) =>
        item.id ===
        Number(selectedPatient)
    );


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDateTime = (dateValue) => {

    if (!dateValue) {
      return "";
    }

    const date =
      new Date(dateValue);

    return date.toLocaleString();

  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="report-page">
      <Navbar />

      <div className="report-body">
        <Sidebar />

        <main className="report-content">
          <div className="report-content-inner">

            {/* PAGE HEADER */}
            <Box className="report-hero">
              <Box className="report-hero-icon">
                <FactCheckIcon />
              </Box>

              <Box>
                <Typography className="report-page-title">
                  Clinical Report
                </Typography>

                <Typography className="report-page-subtitle">
                  Review, verify and generate the complete AI-powered AMR clinical report.
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                className="report-error"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* MAIN REPORT CARD */}
            <Paper className="report-card" elevation={0}>

              {/* SECTION HEADER */}
              <Box className="report-section-header">
                <Box className="report-section-icon">
                  <PictureAsPdfIcon />
                </Box>

                <Typography className="report-section-title">
                  Generate Patient Report
                </Typography>
              </Box>

              <Typography className="report-card-subtitle">
                Select a patient, verify the clinical assessment and generate the final report.
              </Typography>

              <Divider className="report-divider" />

              {/* PATIENT SELECTION */}
              {loadingPatients ? (
                <Box className="report-loading">
                  <CircularProgress size={24} />
                  <Typography>
                    Loading patients...
                  </Typography>
                </Box>
              ) : (
                <TextField
                  className="report-field"
                  fullWidth
                  select
                  required
                  label="Select Patient"
                  value={selectedPatient}
                  onChange={handlePatientChange}
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
                        {patient.patient_id} - {patient.full_name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              )}

              {/* SELECTED PATIENT */}
              {selectedPatientData && (
                <Paper
                  className="selected-patient-card"
                  variant="outlined"
                >
                  <Typography className="selected-patient-label">
                    Selected Patient
                  </Typography>

                  <Typography className="selected-patient-name">
                    {selectedPatientData.patient_id} -{" "}
                    {selectedPatientData.full_name}
                  </Typography>

                  <Typography className="selected-patient-meta">
                    Age: {selectedPatientData.age}
                    {" | "}
                    Gender: {selectedPatientData.gender}
                  </Typography>
                </Paper>
              )}

              {/* DOCTOR VERIFICATION */}
              {selectedPatient && (
                <Paper
                  className="verification-card"
                  variant="outlined"
                >
                  <Box className="verification-header">
                    <FactCheckIcon />
                    <Typography>
                      Doctor Verification
                    </Typography>
                  </Box>

                  <Typography className="verification-description">
                    Review the AI prediction and clinical recommendation before verifying the report.
                  </Typography>

                  {loadingVerification ? (
                    <Box className="report-loading">
                      <CircularProgress size={24} />
                      <Typography>
                        Checking verification status...
                      </Typography>
                    </Box>
                  ) : !verification ? (
                    <>
                      <TextField
                        className="report-field report-notes-field"
                        fullWidth
                        multiline
                        minRows={3}
                        label="Doctor Notes"
                        placeholder="Enter your verification notes..."
                        value={doctorNotes}
                        onChange={(e) =>
                          setDoctorNotes(e.target.value)
                        }
                      />

                      <Box className="verification-button-row">
                        <Button
                          variant="contained"
                          startIcon={
                            verifying ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: "#fff" }}
                              />
                            ) : (
                              <FactCheckIcon />
                            )
                          }
                          onClick={handleVerifyReport}
                          disabled={verifying}
                          className="verify-button"
                        >
                          {verifying
                            ? "Verifying..."
                            : "Verify Report"}
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Paper
                      className="verified-card"
                      variant="outlined"
                    >
                      <Box className="verified-header">
                        <Box className="verified-title-wrap">
                          <VerifiedIcon />
                          <Typography>
                            Report Verified
                          </Typography>
                        </Box>

                        <Chip
                          label={verification.verification_status}
                          color="success"
                          size="small"
                        />
                      </Box>

                      <Typography>
                        <strong>Doctor:</strong>{" "}
                        {verification.doctor_name}
                      </Typography>

                      <Typography>
                        <strong>Verified On:</strong>{" "}
                        {formatDateTime(
                          verification.verified_at
                        )}
                      </Typography>

                      <Typography>
                        <strong>Notes:</strong>{" "}
                        {verification.doctor_notes ||
                          "No additional notes provided."}
                      </Typography>
                    </Paper>
                  )}
                </Paper>
              )}

              {/* GENERATE PDF */}
              <Box className="report-generate-row">
                <Button
                  variant="contained"
                  startIcon={
                    generating ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "#fff" }}
                      />
                    ) : (
                      <PictureAsPdfIcon />
                    )
                  }
                  onClick={handleGenerateReport}
                  disabled={
                    generating ||
                    loadingPatients ||
                    loadingVerification ||
                    !selectedPatient ||
                    !verification
                  }
                  className="generate-pdf-button"
                >
                  {generating
                    ? "Generating Report..."
                    : "Generate PDF Report"}
                </Button>
              </Box>

            </Paper>

            {/* SNACKBAR */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
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

export default Report;
