import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import api from "../services/api";


function PredictionHistory() {

  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Prediction details dialog
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);


  // ============================================================
  // LOAD PREDICTION HISTORY
  // ============================================================

  useEffect(() => {

    const loadPredictionHistory = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await api.get("/predict/history");

        setPredictions(response.data);

      } catch (err) {

        console.error(
          "Failed to load prediction history:",
          err
        );

        setError(
          err?.response?.data?.detail ||
          "Unable to load prediction history."
        );

      } finally {

        setLoading(false);

      }

    };

    loadPredictionHistory();

  }, []);


  // ============================================================
  // FILTER
  // ============================================================

  const filteredPredictions = useMemo(() => {

    return predictions.filter((item) => {

      const patientMatch =
        String(item.patient_id)
          .toLowerCase()
          .includes(search.toLowerCase());

      const riskMatch =
        riskFilter === "All" ||
        item.risk_level === riskFilter;

      return patientMatch && riskMatch;

    });

  }, [predictions, search, riskFilter]);


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  };


  // ============================================================
  // RISK CHIP
  // ============================================================

  const getRiskChip = (riskLevel) => {

    if (riskLevel === "High") {

      return (
        <Chip
          label="High"
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
          }}
        />
      );

    }

    if (riskLevel === "Low") {

      return (
        <Chip
          label="Low"
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: "#dcfce7",
            color: "#15803d",
          }}
        />
      );

    }

    return (
      <Chip
        label={riskLevel || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          backgroundColor: "#f1f5f9",
          color: "#475569",
        }}
      />
    );

  };


  // ============================================================
  // VIEW DETAILS
  // ============================================================

  const handleViewDetails = (prediction) => {

    setSelectedPrediction(prediction);
    setDialogOpen(true);

  };


  // ============================================================
  // CLOSE DETAILS DIALOG
  // ============================================================

  const handleCloseDialog = () => {

    setDialogOpen(false);
    setSelectedPrediction(null);

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
      }}
    >

      {/* ========================================================
          NAVBAR
      ======================================================== */}

      <Navbar />


      <Box
        sx={{
          display: "flex",
        }}
      >

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <Sidebar />


        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <Box
          sx={{
            flex: 1,
            p: {
              xs: 2,
              md: 3,
            },
            minWidth: 0,
          }}
        >


          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #0b3b70, #145da0)",
                color: "#fff",
              }}
            >
              <HistoryIcon />
            </Box>


            <Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0f2742",
                }}
              >
                Prediction History
              </Typography>


              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  mt: 0.4,
                }}
              >
                Review previously generated AMR risk predictions
              </Typography>

            </Box>

          </Box>


          {/* ==================================================
              MAIN CARD
          ================================================== */}

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <Box
              sx={{
                p: 2.5,
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
                borderBottom: "1px solid #e2e8f0",
              }}
            >

              {/* SEARCH */}

              <TextField
                size="small"
                placeholder="Search Patient ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        color: "#64748b",
                        mr: 1,
                      }}
                    />
                  ),
                }}
                sx={{
                  width: {
                    xs: "100%",
                    sm: 280,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />


              {/* RISK FILTER */}

              <FormControl
                size="small"
                sx={{
                  minWidth: 150,
                }}
              >

                <InputLabel>
                  Risk Level
                </InputLabel>

                <Select
                  value={riskFilter}
                  label="Risk Level"
                  onChange={(e) =>
                    setRiskFilter(e.target.value)
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >

                  <MenuItem value="All">
                    All
                  </MenuItem>

                  <MenuItem value="High">
                    High
                  </MenuItem>

                  <MenuItem value="Low">
                    Low
                  </MenuItem>

                </Select>

              </FormControl>


              {/* RECORD COUNT */}

              <Box
                sx={{
                  marginLeft: {
                    xs: 0,
                    sm: "auto",
                  },
                }}
              >

                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {filteredPredictions.length} records
                </Typography>

              </Box>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <Box sx={{ p: 2.5 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >

                <CircularProgress />

              </Box>

            ) : filteredPredictions.length === 0 ? (

              /* =================================================
                 EMPTY
              ================================================= */

              <Box
                sx={{
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                }}
              >

                <HistoryIcon
                  sx={{
                    fontSize: 52,
                    color: "#94a3b8",
                    mb: 1,
                  }}
                />


                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  No predictions found
                </Typography>


                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    mt: 0.5,
                  }}
                >
                  Try changing your search or filter.
                </Typography>

              </Box>

            ) : (

              /* =================================================
                 TABLE
              ================================================= */

              <TableContainer>

                <Table>

                  <TableHead>

                    <TableRow
                      sx={{
                        backgroundColor: "#f8fafc",
                      }}
                    >

                      <TableCell
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Patient
                      </TableCell>


                      <TableCell
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Risk Score
                      </TableCell>


                      <TableCell
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Risk Level
                      </TableCell>


                      <TableCell
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Confidence
                      </TableCell>


                      <TableCell
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Model
                      </TableCell>


                      <TableCell
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Date
                      </TableCell>


                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 800,
                          color: "#334155",
                        }}
                      >
                        Action
                      </TableCell>

                    </TableRow>

                  </TableHead>


                  <TableBody>

                    {filteredPredictions.map((item) => (

                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                        }}
                      >

                        {/* PATIENT */}

                        <TableCell>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#0f2742",
                            }}
                          >
                            PAT-
                            {String(
                              item.patient_id
                            ).padStart(4, "0")}
                          </Typography>


                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748b",
                            }}
                          >
                            Prediction #{item.id}
                          </Typography>

                        </TableCell>


                        {/* RISK SCORE */}

                        <TableCell>

                          <Typography
                            sx={{
                              fontWeight: 800,
                              color:
                                item.risk_level === "High"
                                  ? "#b91c1c"
                                  : "#15803d",
                            }}
                          >
                            {Number(
                              item.risk_score
                            ).toFixed(1)}
                            %
                          </Typography>

                        </TableCell>


                        {/* RISK LEVEL */}

                        <TableCell>
                          {getRiskChip(
                            item.risk_level
                          )}
                        </TableCell>


                        {/* CONFIDENCE */}

                        <TableCell>

                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {(
                              Number(
                                item.confidence
                              ) * 100
                            ).toFixed(1)}
                            %
                          </Typography>

                        </TableCell>


                        {/* MODEL */}

                        <TableCell>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            {item.model_version}
                          </Typography>

                        </TableCell>


                        {/* DATE */}

                        <TableCell>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(
                              item.created_at
                            )}
                          </Typography>

                        </TableCell>


                        {/* ACTION */}

                        <TableCell align="center">

                          <Tooltip title="View Prediction">

                            <IconButton
                              onClick={() =>
                                handleViewDetails(item)
                              }
                              sx={{
                                color: "#145da0",
                                "&:hover": {
                                  backgroundColor:
                                    "#e8f1fb",
                                },
                              }}
                            >

                              <VisibilityIcon />

                            </IconButton>

                          </Tooltip>

                        </TableCell>

                      </TableRow>

                    ))}

                  </TableBody>

                </Table>

              </TableContainer>

            )}

          </Paper>


          {/* ============================================================
              PREDICTION DETAILS DIALOG
          ============================================================ */}

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: "hidden",
              },
            }}
          >

            {/* DIALOG HEADER */}

            <DialogTitle
              sx={{
                background:
                  "linear-gradient(135deg, #0b3b70 0%, #145da0 100%)",
                color: "#ffffff",
                px: 3,
                py: 2.2,
              }}
            >

              <Typography
                sx={{
                  fontSize: "19px",
                  fontWeight: 800,
                }}
              >
                Prediction Details
              </Typography>


              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#cfe5ff",
                  mt: 0.4,
                }}
              >
                AMR risk prediction record
              </Typography>

            </DialogTitle>


            {/* DIALOG CONTENT */}

            <DialogContent sx={{ p: 3 }}>

              {selectedPrediction && (

                <Box>

                  {/* PATIENT / PREDICTION */}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                      },
                      gap: 2,
                      mb: 2.5,
                    }}
                  >

                    <Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        Patient ID
                      </Typography>


                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#0f2742",
                          mt: 0.3,
                        }}
                      >
                        PAT-
                        {String(
                          selectedPrediction.patient_id
                        ).padStart(4, "0")}
                      </Typography>

                    </Box>


                    <Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        Prediction ID
                      </Typography>


                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#334155",
                          mt: 0.3,
                        }}
                      >
                        #{selectedPrediction.id}
                      </Typography>

                    </Box>

                  </Box>


                  <Divider sx={{ mb: 2.5 }} />


                  {/* AMR RISK RESULT */}

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      backgroundColor:
                        selectedPrediction.risk_level === "High"
                          ? "#fef2f2"
                          : "#f0fdf4",
                      border:
                        selectedPrediction.risk_level === "High"
                          ? "1px solid #fecaca"
                          : "1px solid #bbf7d0",
                      mb: 2.5,
                    }}
                  >

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                      }}
                    >
                      AMR Risk Result
                    </Typography>


                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 1,
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >

                      <Typography
                        sx={{
                          fontSize: "26px",
                          fontWeight: 800,
                          color:
                            selectedPrediction.risk_level ===
                            "High"
                              ? "#b91c1c"
                              : "#15803d",
                        }}
                      >
                        {Number(
                          selectedPrediction.risk_score
                        ).toFixed(1)}
                        %
                      </Typography>


                      {getRiskChip(
                        selectedPrediction.risk_level
                      )}

                    </Box>


                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {selectedPrediction.prediction}
                    </Typography>

                  </Box>


                  {/* DETAILS GRID */}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                      },
                      gap: 2,
                    }}
                  >

                    {/* CONFIDENCE */}

                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        Confidence
                      </Typography>


                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#0f2742",
                          mt: 0.3,
                        }}
                      >
                        {(
                          Number(
                            selectedPrediction.confidence
                          ) * 100
                        ).toFixed(1)}
                        %
                      </Typography>

                    </Box>


                    {/* MODEL VERSION */}

                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        Model Version
                      </Typography>


                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#0f2742",
                          mt: 0.3,
                        }}
                      >
                        {selectedPrediction.model_version}
                      </Typography>

                    </Box>


                    {/* GENERATED ON */}

                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        Generated On
                      </Typography>


                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#334155",
                          mt: 0.3,
                        }}
                      >
                        {formatDate(
                          selectedPrediction.created_at
                        )}
                      </Typography>

                    </Box>


                    {/* STATUS */}

                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        Prediction Status
                      </Typography>


                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#15803d",
                          mt: 0.3,
                        }}
                      >
                        Completed
                      </Typography>

                    </Box>

                  </Box>


                  {/* CLINICAL DISCLAIMER */}

                  <Box
                    sx={{
                      mt: 2.5,
                      p: 1.8,
                      borderRadius: 2,
                      backgroundColor: "#eff6ff",
                      border: "1px solid #bfdbfe",
                    }}
                  >

                    <Typography
                      sx={{
                        fontSize: "12px",
                        lineHeight: 1.6,
                        color: "#1e40af",
                      }}
                    >
                      This prediction is a clinical
                      decision-support output and should be
                      interpreted together with patient-specific
                      clinical evidence and professional medical
                      judgment.
                    </Typography>

                  </Box>

                </Box>

              )}

            </DialogContent>


            {/* DIALOG FOOTER */}

            <DialogActions
              sx={{
                px: 3,
                py: 2,
                borderTop: "1px solid #e2e8f0",
              }}
            >

              <Button
                onClick={handleCloseDialog}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  background:
                    "linear-gradient(135deg, #0b3b70, #145da0)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #082d56, #104d88)",
                  },
                }}
              >
                Close
              </Button>

            </DialogActions>

          </Dialog>

        </Box>

      </Box>

    </Box>

  );

}


export default PredictionHistory;