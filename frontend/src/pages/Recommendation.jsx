import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import "../styles/recommendation.css";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import patientService from "../services/patientService";
import api from "../services/api";

const emptyForm = {
  patient_id: "",
  prediction: "",
};

function Recommendation() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [loadingPatients, setLoadingPatients] =
    useState(true);

  const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);

  const [result, setResult] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);

      const data = await patientService.getPatients();

      const sortedPatients = [...data].sort(
        (a, b) => a.id - b.id
      );

      setPatients(sortedPatients);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous recommendation when patient/prediction changes
    setResult(null);
  };

  const handleGetRecommendation = async () => {
    if (!formData.patient_id) {
      showSnackbar(
        "Please select a patient.",
        "warning"
      );
      return;
    }

    if (!formData.prediction) {
      showSnackbar(
        "Please select the AMR prediction.",
        "warning"
      );
      return;
    }

    try {
      setLoadingRecommendation(true);
      setResult(null);

      const requestData = {
        patient_id: Number(formData.patient_id),
        prediction: formData.prediction,
      };

      const response = await api.post(
        "/recommend/",
        requestData
      );

      setResult(response.data);

      showSnackbar(
        "Clinical recommendations generated successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Recommendation error:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Failed to generate clinical recommendations.";

      showSnackbar(message, "error");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(
      (item) => item.id === patientId
    );

    if (!patient) {
      return `Patient #${patientId}`;
    }

    return `${patient.patient_id} - ${patient.full_name}`;
  };

  return (
    <div className="recommendation-page">
      <Navbar />

      <div className="recommendation-body">
        <Sidebar />

        <main className="recommendation-content">
          <div className="recommendation-content-inner">

            {/* PAGE HEADER */}
            <div className="recommendation-hero">
              <div className="recommendation-hero-icon">
                <MedicalServicesOutlinedIcon />
              </div>

              <div>
                <Typography className="recommendation-page-title">
                  Clinical Recommendation
                </Typography>

                <Typography className="recommendation-page-subtitle">
                  Generate clinical recommendations based on the predicted AMR risk
                </Typography>
              </div>
            </div>

            {/* INPUT CARD */}
            <Paper
              className="recommendation-card"
              elevation={0}
            >
              <div className="recommendation-section-header">
                <div className="recommendation-section-icon">
                  <AssignmentOutlinedIcon />
                </div>

                <Typography className="recommendation-section-title">
                  Recommendation Input
                </Typography>
              </div>

              <div className="recommendation-form">

                {/* PATIENT */}
                <div className="recommendation-field-wrap">
                  {loadingPatients ? (
                    <Box className="recommendation-loading">
                      <CircularProgress
                        size={22}
                        sx={{ color: "#1769C2" }}
                      />
                      <Typography>
                        Loading patients...
                      </Typography>
                    </Box>
                  ) : (
                    <TextField
                      className="recommendation-field"
                      fullWidth
                      required
                      select
                      label="Select Patient"
                      name="patient_id"
                      value={formData.patient_id}
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
                            {patient.patient_id} - {patient.full_name}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  )}
                </div>

                {/* PREDICTION */}
                <div className="recommendation-field-wrap">
                  <TextField
                    className="recommendation-field"
                    fullWidth
                    required
                    select
                    label="AMR Prediction"
                    name="prediction"
                    value={formData.prediction}
                    onChange={handleChange}
                  >
                    <MenuItem value="High AMR Risk">
                      High AMR Risk
                    </MenuItem>

                    <MenuItem value="Low AMR Risk">
                      Low AMR Risk
                    </MenuItem>
                  </TextField>
                </div>

                {/* BUTTON */}
                <div className="recommendation-button-row">
                  <Button
                    className="recommendation-generate-button"
                    variant="contained"
                    onClick={handleGetRecommendation}
                    disabled={
                      loadingRecommendation ||
                      loadingPatients
                    }
                    startIcon={
                      !loadingRecommendation ? (
                        <DescriptionOutlinedIcon />
                      ) : null
                    }
                  >
                    {loadingRecommendation ? (
                      <CircularProgress
                        size={22}
                        sx={{ color: "#fff" }}
                      />
                    ) : (
                      "GENERATE RECOMMENDATION"
                    )}
                  </Button>
                </div>
              </div>
            </Paper>

            {/* RESULT SECTION */}
            {result && (
              <Paper
                className="recommendation-result-card"
                elevation={0}
              >
                <div className="recommendation-section-header">
                  <div className="recommendation-section-icon">
                    <MedicalServicesOutlinedIcon />
                  </div>

                  <Typography className="recommendation-section-title">
                    Clinical Recommendation
                  </Typography>
                </div>

                <TextField
                  className="recommendation-field"
                  fullWidth
                  label="Patient"
                  value={getPatientName(result.patient_id)}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

                <TextField
                  className="recommendation-field"
                  fullWidth
                  label="AMR Prediction"
                  value={result.prediction}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />

                <Typography className="recommendation-actions-title">
                  Recommended Clinical Actions
                </Typography>

                <List className="recommendation-actions-list">
                  {result.recommendations.map(
                    (recommendation, index) => (
                      <ListItem
                        key={index}
                        className="recommendation-action-item"
                      >
                        <ListItemIcon>
                          <CheckCircleIcon
                            sx={{ color: "#1769C2" }}
                          />
                        </ListItemIcon>

                        <ListItemText
                          primary={recommendation}
                        />
                      </ListItem>
                    )
                  )}
                </List>

                <Typography className="recommendation-disclaimer">
                  These recommendations are intended to support
                  clinical decision-making. Final treatment decisions
                  must be made by the responsible healthcare
                  professional based on the complete clinical context.
                </Typography>
              </Paper>
            )}

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

export default Recommendation;
