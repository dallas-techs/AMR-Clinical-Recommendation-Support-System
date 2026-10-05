import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";

function PatientViewDialog({ open, onClose, patient }) {
  if (!patient) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Patient Details
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Patient ID"
              value={patient.patient_id || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={patient.full_name || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Age"
              value={patient.age ?? ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Gender"
              value={patient.gender || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Blood Group"
              value={patient.blood_group || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone"
              value={patient.phone || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email"
              value={patient.email || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              value={patient.address || ""}
              multiline
              minRows={2}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Date of Birth"
              value={patient.date_of_birth || ""}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: "#020E33",
            "&:hover": {
              background: "#03154D",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientViewDialog;