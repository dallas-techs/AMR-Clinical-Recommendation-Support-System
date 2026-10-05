import { useEffect, useState } from "react";

import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import api from "../../services/api";


function RecentActivity() {

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchRecentActivity = async () => {

      try {

        const response =
          await api.get("/dashboard/");

        setActivities(
          response.data.recent_activity || []
        );

      } catch (error) {

        console.error(
          "Failed to load recent activity:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


    fetchRecentActivity();

  }, []);


  const getActivityIcon = (activity) => {

    const text =
      String(activity || "").toLowerCase();


    if (
      text.includes("verified") ||
      text.includes("report")
    ) {

      return (
        <CheckCircleIcon
          sx={{
            fontSize: 18,
            color: "#FFFFFF",
          }}
        />
      );

    }


    if (
      text.includes("prediction")
    ) {

      return (
        <BarChartIcon
          sx={{
            fontSize: 18,
            color: "#FFFFFF",
          }}
        />
      );

    }


    if (
      text.includes("clinical")
    ) {

      return (
        <DescriptionIcon
          sx={{
            fontSize: 18,
            color: "#FFFFFF",
          }}
        />
      );

    }


    return (
      <PeopleIcon
        sx={{
          fontSize: 18,
          color: "#FFFFFF",
        }}
      />
    );

  };


  const getActivityColor = (activity) => {

    const text =
      String(activity || "").toLowerCase();


    if (
      text.includes("verified") ||
      text.includes("report")
    ) {
      return "#16A34A";
    }


    if (
      text.includes("prediction")
    ) {
      return "#2563EB";
    }


    if (
      text.includes("clinical")
    ) {
      return "#F97316";
    }


    return "#1976D2";

  };


  const formatDateTime = (value) => {

    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

  };


  return (

    <Card
      elevation={0}
      sx={{
        height: "100%",

        minHeight: "332px",

        borderRadius: "14px",

        border:
          "1px solid #E5EAF1",

        background: "#FFFFFF",

        boxShadow:
          "0 6px 20px rgba(15,35,70,0.07)",

        overflow: "hidden",
      }}
    >

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          px: 2.4,
          py: 1.8,

          borderBottom:
            "1px solid #E8EDF3",
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.4,
          }}
        >

          <Box
            sx={{
              width: 38,
              height: 38,

              borderRadius: "10px",

              background:
                "#EEF5FF",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <AccessTimeIcon
              sx={{
                color: "#1554A5",
                fontSize: 22,
              }}
            />

          </Box>


          <Box>

            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#102653",
                lineHeight: 1.2,
              }}
            >
              Recent Activity
            </Typography>


            <Typography
              sx={{
                mt: 0.3,
                fontSize: "12px",
                color: "#7A879B",
              }}
            >
              Latest actions in the system
            </Typography>

          </Box>

        </Box>


        <Button
          variant="outlined"
          size="small"
          endIcon={
            <ArrowForwardIcon
              sx={{ fontSize: 16 }}
            />
          }
          sx={{
            textTransform: "none",

            fontWeight: 700,

            fontSize: "12px",

            color: "#123B78",

            borderColor:
              "#D7E2F0",

            borderRadius: "9px",

            px: 1.5,

            "&:hover": {
              borderColor: "#123B78",
              background: "#F5F8FC",
            },
          }}
        >
          View All
        </Button>

      </Box>


      {/* BODY */}

      {loading ? (

        <Box
          sx={{
            height: 250,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >

          <CircularProgress
            size={28}
          />

        </Box>

      ) : activities.length === 0 ? (

        <Box
          sx={{
            height: 250,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >

          <Typography
            sx={{
              color: "#7A879B",
              fontSize: "13px",
            }}
          >
            No recent activity available
          </Typography>

        </Box>

      ) : (

        <Box
          sx={{
            px: 2.4,
            py: 1.4,
          }}
        >

          {activities
            .slice(0, 6)
            .map((item, index) => {

              const color =
                getActivityColor(
                  item.activity
                );


              return (

                <Box
                  key={`${item.patient_id}-${item.created_at}-${index}`}
                  sx={{
                    position: "relative",

                    display: "grid",

                    gridTemplateColumns:
                      "38px minmax(0,1fr) 190px 74px",

                    gap: 1.4,

                    alignItems: "center",

                    minHeight: "54px",

                    borderBottom:
                      index !==
                      Math.min(
                        activities.length,
                        6
                      ) - 1
                        ? "1px solid #EDF1F5"
                        : "none",

                    "@media (max-width: 900px)": {
                      gridTemplateColumns:
                        "38px minmax(0,1fr)",
                      gap: 1,
                    },
                  }}
                >

                  {/* TIMELINE */}

                  <Box
                    sx={{
                      position: "relative",

                      height: "100%",

                      display: "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >

                    {index <
                      Math.min(
                        activities.length,
                        6
                      ) - 1 && (

                      <Box
                        sx={{
                          position:
                            "absolute",

                          top: "50%",

                          bottom: "-50%",

                          width: "2px",

                          background:
                            "#DCE5F0",

                          zIndex: 0,
                        }}
                      />

                    )}


                    <Box
                      sx={{
                        position:
                          "relative",

                        zIndex: 1,

                        width: 32,
                        height: 32,

                        borderRadius:
                          "50%",

                        display: "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        background:
                          color,

                        boxShadow:
                          `0 0 0 5px ${color}12`,
                      }}
                    >
                      {getActivityIcon(
                        item.activity
                      )}
                    </Box>

                  </Box>


                  {/* ACTIVITY */}

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >

                    <Typography
                      sx={{
                        fontSize: "13px",

                        fontWeight: 700,

                        color: "#17305F",

                        whiteSpace:
                          "nowrap",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {item.activity}
                    </Typography>


                    <Typography
                      sx={{
                        mt: 0.25,

                        fontSize: "11.5px",

                        color: "#71809A",

                        whiteSpace:
                          "nowrap",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      Patient:{" "}
                      {item.patient_name}
                    </Typography>

                  </Box>


                  {/* DATE */}

                  <Typography
                    sx={{
                      fontSize: "11px",

                      color: "#71809A",

                      textAlign: "right",

                      "@media (max-width: 900px)": {
                        display: "none",
                      },
                    }}
                  >
                    {formatDateTime(
                      item.created_at
                    )}
                  </Typography>


                  {/* TYPE CHIP */}

                  <Box
                    sx={{
                      justifySelf:
                        "end",

                      px: 1.2,
                      py: 0.55,

                      borderRadius: "7px",

                      background:
                        `${color}14`,

                      color: color,

                      fontSize: "10px",

                      fontWeight: 700,

                      textAlign: "center",

                      minWidth: "58px",

                      "@media (max-width: 900px)": {
                        display: "none",
                      },
                    }}
                  >

                    {String(
                      item.activity || ""
                    )
                      .toLowerCase()
                      .includes("prediction")
                      ? "Prediction"
                      : String(
                          item.activity || ""
                        )
                          .toLowerCase()
                          .includes(
                            "clinical"
                          )
                      ? "Clinical"
                      : String(
                          item.activity || ""
                        )
                          .toLowerCase()
                          .includes(
                            "report"
                          ) ||
                        String(
                          item.activity || ""
                        )
                          .toLowerCase()
                          .includes(
                            "verified"
                          )
                      ? "Report"
                      : "Patient"}

                  </Box>

                </Box>

              );

            })}

        </Box>

      )}

    </Card>

  );

}


export default RecentActivity;