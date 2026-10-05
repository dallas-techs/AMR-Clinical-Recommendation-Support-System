import { Card, CardContent, Typography, Box } from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import colors from "../../theme/colors";


const WelcomeCard = () => {

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }


  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  return (

    <Card
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",

        borderRadius: "20px",

        background: `
          linear-gradient(
            135deg,
            ${colors.paper} 0%,
            #F8FAFD 65%,
            #EEF4FF 100%
          )
        `,

        border: `1px solid ${colors.border}`,

        boxShadow:
          "0 10px 30px rgba(2,14,51,0.07)",

        mb: 3,
      }}
    >

      {/* Decorative background shape */}
      <Box
        sx={{
          position: "absolute",

          width: 220,
          height: 220,

          borderRadius: "50%",

          background:
            "rgba(25,118,210,0.06)",

          right: -80,
          top: -100,
        }}
      />


      <Box
        sx={{
          position: "absolute",

          width: 120,
          height: 120,

          borderRadius: "50%",

          background:
            "rgba(25,118,210,0.04)",

          right: 90,
          bottom: -80,
        }}
      />


      <CardContent
        sx={{
          position: "relative",

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 3,

          p: {
            xs: 3,
            md: 4,
          },

          "&:last-child": {
            pb: {
              xs: 3,
              md: 4,
            },
          },
        }}
      >

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >

          {/* Greeting */}
          <Typography
            sx={{
              fontSize: {
                xs: "28px",
                md: "34px",
              },

              lineHeight: 1.2,

              fontWeight: 800,

              color: colors.primary,

              letterSpacing: "-0.5px",
            }}
          >
            {greeting}
          </Typography>


          {/* Project title */}
          <Typography
            sx={{
              mt: 1.2,

              fontSize: {
                xs: "18px",
                md: "21px",
              },

              fontWeight: 700,

              color: "#172033",

              lineHeight: 1.35,

              maxWidth: "850px",
            }}
          >
            AI-Powered Clinical Recommendation Support System
          </Typography>


          {/* Project subtitle */}
          <Typography
            sx={{
              mt: 1,

              fontSize: "14px",

              color: colors.textSecondary,

              lineHeight: 1.6,

              maxWidth: "780px",
            }}
          >
            Early Detection and Management of Antimicrobial Resistance (AMR)
          </Typography>


          {/* Date */}
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,

              mt: 2.2,

              width: "fit-content",

              px: 1.5,

              py: 0.8,

              borderRadius: "10px",

              background: "#FFFFFF",

              border: `1px solid ${colors.border}`,
            }}
          >

            <AccessTimeIcon
              sx={{
                fontSize: 17,
                color: colors.secondary,
              }}
            />

            <Typography
              sx={{
                fontSize: "13px",

                fontWeight: 600,

                color: colors.secondary,
              }}
            >
              {today}
            </Typography>

          </Box>

        </Box>


        {/* =====================================================
            HOSPITAL ICON
        ===================================================== */}

        <Box
          sx={{
            width: {
              xs: 72,
              md: 100,
            },

            height: {
              xs: 72,
              md: 100,
            },

            flexShrink: 0,

            borderRadius: "24px",

            background: colors.primary,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            boxShadow:
              "0 12px 25px rgba(2,14,51,0.20)",

            transform: "rotate(3deg)",

            mr: {
              xs: 0,
              md: 2,
            },
          }}
        >

          <LocalHospitalIcon
            sx={{
              color: "#FFFFFF",

              fontSize: {
                xs: 36,
                md: 50,
              },

              transform: "rotate(-3deg)",
            }}
          />

        </Box>

      </CardContent>

    </Card>
  );
};


export default WelcomeCard;