import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function StatCard({
  title,
  value,
  icon,
  color = "#1976D2",
}) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "126px",
        width: "100%",

        background: "#FFFFFF",

        borderRadius: "14px",

        border: "1px solid #E6EBF2",

        borderLeft: `3px solid ${color}`,

        boxShadow:
          "0 5px 18px rgba(15, 35, 70, 0.07)",

        overflow: "hidden",

        transition:
          "transform 0.2s ease, box-shadow 0.2s ease",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow:
            "0 10px 24px rgba(15, 35, 70, 0.12)",
        },
      }}
    >

      {/* CONTENT */}
      <Box
        sx={{
          height: "100%",
          minHeight: "126px",

          display: "flex",
          alignItems: "center",

          px: {
            xs: 2,
            md: 2.2,
          },

          gap: 2,
        }}
      >

        {/* ICON BOX */}
        <Box
          sx={{
            width: 66,
            height: 66,

            flexShrink: 0,

            borderRadius: "12px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background: `${color}18`,

            color: color,

            "& svg": {
              fontSize: 34,
            },
          }}
        >
          {icon}
        </Box>


        {/* TEXT */}
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >

          {/* VALUE */}
          <Typography
            sx={{
              fontSize: {
                xs: "26px",
                md: "29px",
              },

              lineHeight: 1.05,

              fontWeight: 800,

              color: "#102653",

              letterSpacing: "-0.6px",

              mb: 0.6,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Typography>


          {/* TITLE */}
          <Typography
            sx={{
              fontSize: "14px",

              fontWeight: 700,

              color: "#102653",

              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>


          {/* DESCRIPTION */}
          <Typography
            sx={{
              mt: 0.4,

              fontSize: "11px",

              color: "#71809A",

              lineHeight: 1.35,
            }}
          >
            {title === "Total Patients" &&
              "Registered in the system"}

            {title === "Clinical Records" &&
              "Patient clinical data entries"}

            {title === "Predictions" &&
              "AMR risk assessments"}

            {title === "Verified Reports" &&
              "Doctor verified reports"}

            {title === "High AMR Risk" &&
              "Predicted high risk cases"}

            {title === "Low AMR Risk" &&
              "Predicted low risk cases"}

            {title === "Average Risk Score" &&
              "Across all predictions"}
          </Typography>

        </Box>


        {/* ARROW */}
        <Box
          sx={{
            width: 34,
            height: 34,

            flexShrink: 0,

            borderRadius: "50%",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background: "#F2F6FB",

            color: color,
          }}
        >
          <ArrowForwardIcon
            sx={{
              fontSize: 18,
            }}
          />
        </Box>

      </Box>

    </Box>
  );
}

export default StatCard;