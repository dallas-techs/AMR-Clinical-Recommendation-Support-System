import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HistoryIcon from "@mui/icons-material/History";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import appLogo from "../../assets/logo/app_logo.png";

function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();


  const menuItems = [

    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlinedIcon />,
    },

    {
      label: "Patients",
      path: "/patient",
      icon: <PeopleIcon />,
    },

    {
      label: "Clinical Records",
      path: "/clinical",
      icon: <AssignmentOutlinedIcon />,
    },

    {
      label: "Prediction",
      path: "/prediction",
      icon: <PsychologyOutlinedIcon />,
    },

    {
    label: "Prediction History",
    path: "/prediction-history",
    icon: <HistoryIcon />,
  },

    {
      label: "Recommendation",
      path: "/recommendation",
      icon: <MedicalServicesOutlinedIcon />,
    },

    {
      label: "Reports",
      path: "/report",
      icon: <DescriptionOutlinedIcon />,
    },

  ];


  return (

    <Box
      component="aside"

      className="sidebar"

      sx={{
        width: {
          xs: "210px",
          md: "238px",
        },

        flexShrink: 0,

        minHeight:
          "calc(100vh - 62px)",

        background:
          "linear-gradient(180deg, #092C50 0%, #031E3B 100%)",

        color: "#FFFFFF",

        display: "flex",

        flexDirection: "column",

        position: "relative",

        overflow: "hidden",

        boxSizing: "border-box",
      }}
    >

      {/* ==================================================
          NAVIGATION
      ================================================== */}
      <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  }}
>
  <img
    src={appLogo}
    alt="AMR Clinical Recommendation Support System"
    style={{
      width: "400px",
      height: "200px",
      objectFit: "contain",
      display: "block",
    }}
  />
</Box>
      <List
        disablePadding

        sx={{
          pt: 4.2,

          px: 0.8,
        }}
      >

        {menuItems.map((item) => {

          const active =
            location.pathname ===
            item.path;


          return (

            <ListItemButton
              key={item.path}

              onClick={() =>
                navigate(item.path)
              }

              sx={{
                position: "relative",

                minHeight: 52,

                mb: 0.7,

                px: 2.2,

                borderRadius:
                  "0 10px 10px 0",

                color: active
                  ? "#FFFFFF"
                  : "#D9E4F1",

                background: active
                  ? "linear-gradient(90deg, #1264C5 0%, #174A91 100%)"
                  : "transparent",

                transition:
                  "all 0.2s ease",

                "&:hover": {
                  background:
                    active
                      ? "linear-gradient(90deg, #1264C5 0%, #174A91 100%)"
                      : "rgba(255,255,255,0.08)",

                  color: "#FFFFFF",
                },

                "&::before": active
                  ? {
                      content: '""',

                      position:
                        "absolute",

                      left: 0,

                      top: 0,

                      bottom: 0,

                      width: "4px",

                      background:
                        "#3B9CFF",

                      borderRadius:
                        "0 4px 4px 0",
                    }
                  : {},
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: 43,

                  color: "inherit",

                  "& svg": {
                    fontSize: 24,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>


              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize:
                        "14px",

                      fontWeight:
                        active
                          ? 700
                          : 500,

                      color:
                        "inherit",
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />

            </ListItemButton>

          );

        })}

      </List>


      {/* ==================================================
          BOTTOM BRAND AREA
      ================================================== */}

      <Box
        sx={{
          mt: "auto",

          position: "relative",

          px: 3,

          pb: 4,

          pt: 6,

          overflow: "hidden",
        }}
      >

        {/* Decorative circle */}

        <Box
          sx={{
            position:
              "absolute",

            width: 180,
            height: 180,

            borderRadius: "50%",

            border:
              "1px solid rgba(72,157,255,0.12)",

            right: -70,
            bottom: -50,
          }}
        />


        {/* Shield */}

        <Box
          sx={{
            width: 90,
            height: 90,

            margin:
              "0 auto 18px",

            borderRadius:
              "50%",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              "rgba(28,111,202,0.18)",

            border:
              "1px solid rgba(74,164,255,0.25)",

            boxShadow:
              "0 8px 25px rgba(0,0,0,0.15)",
          }}
        >

          <ShieldOutlinedIcon
            sx={{
              fontSize: 58,

              color: "#4A9FFF",
            }}
          />

        </Box>


        <Typography
          sx={{
            textAlign: "center",

            fontSize: "17px",

            fontWeight: 700,

            color: "#8EC4FF",

            lineHeight: 1.4,
          }}
        >
          AI for Safer
          <br />
          Antibiotic Use
        </Typography>


        <Box
          sx={{
            width: 45,

            height: "2px",

            background:
              "#4A9FFF",

            opacity: 0.65,

            margin:
              "12px auto",
          }}
        />


        <Typography
          sx={{
            textAlign: "center",

            fontSize: "11px",

            lineHeight: 1.6,

            color: "#8BA8C7",
          }}
        >
          Early Detection
          <br />
          Better Decisions
          <br />
          Healthier Tomorrow
        </Typography>

      </Box>

    </Box>

  );
}


export default Sidebar;