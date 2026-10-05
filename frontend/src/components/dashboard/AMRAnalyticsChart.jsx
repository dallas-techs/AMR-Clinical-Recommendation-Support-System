import { useEffect, useState } from "react";

import {
  Box,
  Card,
  Typography,
  CircularProgress,
} from "@mui/material";

import BarChartIcon from "@mui/icons-material/BarChart";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import api from "../../services/api";


function AnalyticsPlaceholder() {

  const [analytics, setAnalytics] =
    useState({
      high_risk_cases: 0,
      low_risk_cases: 0,
      average_risk_score: 0,
    });


  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const response =
          await api.get("/dashboard/");


        setAnalytics({
          high_risk_cases:
            response.data.high_risk_cases,

          low_risk_cases:
            response.data.low_risk_cases,

          average_risk_score:
            response.data.average_risk_score,
        });

      } catch (error) {

        console.error(
          "Failed to load AMR analytics:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchAnalytics();

  }, []);


  const totalCases =
    analytics.high_risk_cases +
    analytics.low_risk_cases;


  const highRiskPercentage =
    totalCases > 0
      ? (
          analytics.high_risk_cases /
          totalCases
        ) * 100
      : 0;


  const lowRiskPercentage =
    totalCases > 0
      ? (
          analytics.low_risk_cases /
          totalCases
        ) * 100
      : 0;


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

            <BarChartIcon
              sx={{
                color: "#1764C0",
                fontSize: 23,
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
              AMR Risk Analytics
            </Typography>


            <Typography
              sx={{
                mt: 0.3,

                fontSize: "12px",

                color: "#7A879B",
              }}
            >
              Distribution of predicted AMR risk
            </Typography>

          </Box>

        </Box>

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

      ) : (

        <Box
          sx={{
            px: 2.4,
            py: 2.2,
          }}
        >

          {/* HIGH RISK */}

          <Box
            sx={{
              mb: 2.8,
            }}
          >

            <Box
              sx={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                mb: 0.8,
              }}
            >

              <Typography
                sx={{
                  fontSize: "13px",

                  fontWeight: 700,

                  color: "#1A2F55",
                }}
              >
                High AMR Risk
              </Typography>


              <Box
                sx={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: 0.8,
                }}
              >

                <Typography
                  sx={{
                    fontSize: "13px",

                    fontWeight: 700,

                    color: "#172B50",
                  }}
                >
                  {analytics.high_risk_cases}
                </Typography>


                <Typography
                  sx={{
                    fontSize: "12px",

                    fontWeight: 700,

                    color: "#E11D2E",
                  }}
                >
                  (
                  {highRiskPercentage.toFixed(
                    1
                  )}
                  %)
                </Typography>

              </Box>

            </Box>


            <Box
              sx={{
                width: "100%",

                height: "12px",

                background:
                  "#E7ECF2",

                borderRadius:
                  "10px",

                overflow: "hidden",
              }}
            >

              <Box
                sx={{
                  width:
                    `${highRiskPercentage}%`,

                  height: "100%",

                  background:
                    "#E51C2A",

                  borderRadius:
                    "10px",

                  transition:
                    "width 0.5s ease",
                }}
              />

            </Box>

          </Box>


          {/* LOW RISK */}

          <Box
            sx={{
              mb: 2.8,
            }}
          >

            <Box
              sx={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                mb: 0.8,
              }}
            >

              <Typography
                sx={{
                  fontSize: "13px",

                  fontWeight: 700,

                  color: "#1A2F55",
                }}
              >
                Low AMR Risk
              </Typography>


              <Box
                sx={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: 0.8,
                }}
              >

                <Typography
                  sx={{
                    fontSize: "13px",

                    fontWeight: 700,

                    color: "#172B50",
                  }}
                >
                  {analytics.low_risk_cases}
                </Typography>


                <Typography
                  sx={{
                    fontSize: "12px",

                    fontWeight: 700,

                    color: "#159447",
                  }}
                >
                  (
                  {lowRiskPercentage.toFixed(
                    1
                  )}
                  %)
                </Typography>

              </Box>

            </Box>


            <Box
              sx={{
                width: "100%",

                height: "12px",

                background:
                  "#E7ECF2",

                borderRadius:
                  "10px",

                overflow: "hidden",
              }}
            >

              <Box
                sx={{
                  width:
                    `${lowRiskPercentage}%`,

                  height: "100%",

                  background:
                    "#159447",

                  borderRadius:
                    "10px",

                  transition:
                    "width 0.5s ease",
                }}
              />

            </Box>

          </Box>


          {/* AVERAGE RISK SCORE */}

          <Box
            sx={{
              mt: 2.8,

              p: 1.8,

              borderRadius: "12px",

              background:
                "linear-gradient(135deg, #F0F6FF 0%, #EAF2FF 100%)",

              border:
                "1px solid #DDE9FA",

              display: "flex",

              alignItems: "center",

              gap: 1.5,
            }}
          >

            {/* ICON */}

            <Box
              sx={{
                width: 58,
                height: 58,

                flexShrink: 0,

                borderRadius: "10px",

                background:
                  "#DDEBFF",

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",
              }}
            >

              <TrackChangesIcon
                sx={{
                  fontSize: 34,

                  color: "#1554A5",
                }}
              />

            </Box>


            {/* SCORE */}

            <Box
              sx={{
                flex: 1,
              }}
            >

              <Typography
                sx={{
                  fontSize: "12px",

                  fontWeight: 700,

                  color: "#1E3968",
                }}
              >
                Average Risk Score
              </Typography>


              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: "27px",

                  lineHeight: 1.1,

                  fontWeight: 800,

                  color: "#102653",
                }}
              >
                {Number(
                  analytics.average_risk_score
                ).toFixed(2)}
                %
              </Typography>

            </Box>


            {/* TREND ICON */}

            <Box
              sx={{
                display: "flex",

                alignItems:
                  "flex-end",

                gap: "3px",

                height: 45,
              }}
            >

              <Box
                sx={{
                  width: 7,
                  height: 15,
                  borderRadius: "3px",
                  background: "#CDB8FF",
                }}
              />

              <Box
                sx={{
                  width: 7,
                  height: 24,
                  borderRadius: "3px",
                  background: "#B99BFF",
                }}
              />

              <Box
                sx={{
                  width: 7,
                  height: 34,
                  borderRadius: "3px",
                  background: "#A67BFF",
                }}
              />

              <TrendingUpIcon
                sx={{
                  ml: 0.3,

                  color: "#7B3FE4",

                  fontSize: 25,
                }}
              />

            </Box>

          </Box>

        </Box>

      )}

    </Card>

  );

}


export default AnalyticsPlaceholder;