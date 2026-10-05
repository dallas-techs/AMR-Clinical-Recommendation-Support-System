import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";

const emptyForm = {
  patient_id: "",
  full_name: "",
  age: "",
  gender: "",
  blood_group: "",
  phone: "",
  email: "",
  address: "",
  date_of_birth: "",
};

function PatientForm({
  open,
  onClose,
  onSave,
  patient = null,
  editMode = false,
}) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editMode && patient) {
      setFormData({
        patient_id: patient.patient_id || "",
        full_name: patient.full_name || "",
        age: patient.age ?? "",
        gender: patient.gender || "",
        blood_group: patient.blood_group || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        date_of_birth: patient.date_of_birth || "",
      });
    } else if (!open) {
      setFormData(emptyForm);
    }
  }, [patient, editMode, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
  };

  const handleSubmit = async () => {
    const success = await onSave(formData);

    if (success) {
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {editMode ? "Edit Patient" : "Add New Patient"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>

          {/* Patient ID - Only shown while editing */}
          {editMode && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Patient ID"
                name="patient_id"
                value={formData.patient_id}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                helperText="Patient ID cannot be changed"
              />
            </Grid>
          )}

          {/* Full Name */}
          <Grid size={{ xs: 12, md: editMode ? 6 : 12 }}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </Grid>

          {/* Age */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              required
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
          </Grid>

          {/* Gender */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              required
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>

          {/* Blood Group */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Blood Group"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            />
          </Grid>

          {/* Phone */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>

          {/* Date of Birth */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            background: "#020E33",
            "&:hover": {
              background: "#03154D",
            },
          }}
        >
          {editMode ? "Update Patient" : "Save Patient"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientForm;