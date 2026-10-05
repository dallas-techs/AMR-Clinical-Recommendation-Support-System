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

function PatientTable({ patients, onView, onEdit, onDelete }) {
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
          <TableRow
            sx={{
              background: "#020E33",
            }}
          >
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Patient ID
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Full Name
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Age
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Gender
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Phone
            </TableCell>

            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography>
                  No Patients Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <TableRow
                key={patient.id}
                hover
              >
                <TableCell>{patient.patient_id}</TableCell>

                <TableCell>{patient.full_name}</TableCell>

                <TableCell>{patient.age}</TableCell>

                <TableCell>{patient.gender}</TableCell>

                <TableCell>{patient.phone}</TableCell>

                <TableCell>
                  {/* View */}
                  <IconButton
                    color="primary"
                    onClick={() => onView && onView(patient)}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {/* Edit */}
                  <IconButton
                    color="warning"
                    onClick={() => onEdit && onEdit(patient)}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    color="error"
                    onClick={() => onDelete && onDelete(patient)}
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

export default PatientTable;