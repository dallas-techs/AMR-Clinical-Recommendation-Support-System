import { Button, TextField, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function PatientToolbar({ search, setSearch, onAdd }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ mb: 3 }}
    >
      <div>
        <Typography variant="h4" fontWeight="bold">
          Patient Management
        </Typography>

        <Typography color="text.secondary">
          Manage all patient records
        </Typography>
      </div>

      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          placeholder="Search Patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            background: "#020E33",
            "&:hover": {
              background: "#03154D",
            },
          }}
        >
          Add Patient
        </Button>
      </Stack>
    </Stack>
  );
}

export default PatientToolbar;