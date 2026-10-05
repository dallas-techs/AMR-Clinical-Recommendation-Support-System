import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ClinicalRecordTable({
  records,
  patients,
  onView,
  onEdit,
  onDelete,
}) {
  const getPatientName = (patientId) => {
    const patient = patients.find(
      (item) => item.id === patientId
    );

    if (!patient) {
      return `Patient #${patientId}`;
    }

    return `${patient.patient_id} - ${patient.full_name}`;
  };
  const sortedRecords = [...records].sort(
  (a, b) => a.patient_id - b.patient_id
);

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#020E33" }}>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Patient
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Diagnosis
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Creatinine
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Glucose
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Hemoglobin
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              WBC
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="text.secondary">
                  No Clinical Records Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  {getPatientName(record.patient_id)}
                </TableCell>

                <TableCell>
                  {record.diagnosis}
                </TableCell>

                <TableCell>
                  {record.creatinine}
                </TableCell>

                <TableCell>
                  {record.glucose}
                </TableCell>

                <TableCell>
                  {record.hemoglobin}
                </TableCell>

                <TableCell>
                  {record.white_blood_cells}
                </TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      onView && onView(record)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    color="warning"
                    onClick={() =>
                      onEdit && onEdit(record)
                    }
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      onDelete && onDelete(record)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ClinicalRecordTable;