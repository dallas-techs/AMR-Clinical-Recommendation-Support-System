import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";


function Navbar() {

  const navigate = useNavigate();


  // =====================================================
  // LOGGED-IN DOCTOR DETAILS
  // =====================================================

  const doctorId = localStorage.getItem("doctor_id") || "";

const getDoctorName = () => {
  const storedName = localStorage.getItem("doctor_name");

  if (storedName && storedName.trim() !== "") {
    return storedName;
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(
        atob(
          token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

      if (payload.doctor_name) {
        localStorage.setItem("doctor_name", payload.doctor_name);
        return payload.doctor_name;
      }
    } catch (error) {
      console.error("Unable to read doctor name from token:", error);
    }
  }

  return "Doctor";
};

const doctorName = getDoctorName();

const doctorInitial =
  doctorName
    .replace("Dr.", "")
    .replace("Dr ", "")
    .trim()
    .charAt(0)
    .toUpperCase() || "D";
  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title: "AMR Risk Review",
        message:
          "Review recent AMR risk predictions.",
        type: "prediction",
        path: "/prediction",
        read: false,
      },

      {
        id: 2,
        title: "Susceptibility Evidence",
        message:
          "Antibiotic susceptibility results are available for review.",
        type: "culture",
        path: "/clinical",
        read: false,
      },

      {
        id: 3,
        title: "Clinical Reports",
        message:
          "Generated reports are available for verification.",
        type: "report",
        path: "/report",
        read: false,
      },
    ]);


  const notificationRef = useRef(null);


  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("doctor_id");
    localStorage.removeItem("doctor_name");

    navigate("/");
  };


  // =====================================================
  // NOTIFICATION CLICK
  // =====================================================

  const handleNotificationClick =
    (notification) => {

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );

      setNotificationOpen(false);

      navigate(notification.path);
    };


  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================

  const handleMarkAllRead = () => {

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };


  // =====================================================
  // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }
    };


    if (notificationOpen) {

      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, [notificationOpen]);


  // =====================================================
  // NOTIFICATION STYLE
  // =====================================================

  const getNotificationStyle = (type) => {

    if (type === "prediction") {

      return {
        background: "#FFF1E8",
        color: "#E46B19",
        symbol: "!",
      };
    }


    if (type === "culture") {

      return {
        background: "#EAF5FF",
        color: "#1769C2",
        symbol: "S",
      };
    }


    return {
      background: "#EEF2FF",
      color: "#4758A8",
      symbol: "R",
    };
  };


  return (

    <Box
      component="header"
      className="navbar"

      sx={{
        height: "62px",
        width: "100%",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        px: {
          xs: 2,
          md: 3,
        },

        background:
          "linear-gradient(90deg, #062957 0%, #0A3975 55%, #124D8D 100%)",

        color: "#FFFFFF",

        boxSizing: "border-box",

        position: "relative",

        zIndex: 100,

        boxShadow:
          "0 2px 10px rgba(2,14,51,0.18)",
      }}
    >


      {/* ==================================================
          LEFT - BRAND
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
        }}
      >

        {/* Hospital Logo */}

        <Box
          sx={{
            width: 38,
            height: 38,

            flexShrink: 0,

            borderRadius: "10px",

            background: "#FFFFFF",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            boxShadow:
              "0 3px 10px rgba(0,0,0,0.15)",
          }}
        >

          <LocalHospitalIcon
            sx={{
              color: "#1473E6",
              fontSize: 29,
            }}
          />

        </Box>


        {/* System Title */}

        <Typography
          sx={{
            fontSize: {
              xs: "15px",
              md: "19px",
            },

            fontWeight: 800,

            letterSpacing: "-0.2px",

            whiteSpace: "nowrap",

            overflow: "hidden",

            textOverflow: "ellipsis",
          }}
        >
          AMR Clinical Recommendation Support System
        </Typography>

      </Box>


      {/* ==================================================
          RIGHT - DOCTOR AREA
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          gap: {
            xs: 1,
            md: 2,
          },

          flexShrink: 0,
        }}
      >


        {/* ==================================================
            NOTIFICATION CENTER
        ================================================== */}

        <Box
          ref={notificationRef}

          sx={{
            position: "relative",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <IconButton
            onClick={() =>
              setNotificationOpen(
                (current) => !current
              )
            }

            aria-label="Notifications"

            sx={{
              color: "#FFFFFF",

              width: 42,
              height: 42,

              "&:hover": {
                background:
                  "rgba(255,255,255,0.10)",
              },
            }}
          >

            <NotificationsNoneIcon
              sx={{
                fontSize: 27,
              }}
            />

          </IconButton>


          {/* Unread Badge */}

          {unreadCount > 0 && (

            <Box
              sx={{
                position: "absolute",

                top: 4,
                right: 4,

                minWidth: 18,
                height: 18,

                px: 0.3,

                borderRadius: "10px",

                background: "#FF3B4B",

                border:
                  "2px solid #0A3975",

                color: "#FFFFFF",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontSize: "9px",
                fontWeight: 800,

                boxSizing: "border-box",
              }}
            >
              {unreadCount}
            </Box>

          )}


          {/* Notification Panel */}

          {notificationOpen && (

            <Paper
              elevation={12}

              sx={{
                position: "absolute",

                top: 51,
                right: -12,

                width: {
                  xs: 330,
                  sm: 390,
                },

                maxWidth:
                  "calc(100vw - 24px)",

                borderRadius: "12px",

                overflow: "hidden",

                background: "#FFFFFF",

                border:
                  "1px solid #D8E2ED",

                boxShadow:
                  "0 14px 38px rgba(4,25,55,0.24)",
              }}
            >


              {/* Notification Header */}

              <Box
                sx={{
                  px: 2,
                  py: 1.7,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  background:
                    "linear-gradient(90deg, #F1F6FB 0%, #E8F1FA 100%)",

                  borderBottom:
                    "1px solid #D9E3ED",
                }}
              >

                <Box>

                  <Typography
                    sx={{
                      color: "#092C50",
                      fontSize: "17px",
                      fontWeight: 800,
                    }}
                  >
                    Notifications
                  </Typography>


                  <Typography
                    sx={{
                      color: "#68809A",
                      fontSize: "11px",
                      mt: 0.2,
                    }}
                  >
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1
                            ? "s"
                            : ""
                        }`
                      : "All notifications are read"}
                  </Typography>

                </Box>


                {unreadCount > 0 && (

                  <Button
                    onClick={handleMarkAllRead}
                    size="small"

                    sx={{
                      textTransform: "none",
                      color: "#1769C2",
                      fontSize: "11px",
                      fontWeight: 700,
                      minWidth: 0,
                      px: 1,
                    }}
                  >
                    Mark all as read
                  </Button>

                )}

              </Box>


              {/* Notification List */}

              {notifications.length > 0 ? (

                <List
                  disablePadding

                  sx={{
                    maxHeight: 330,
                    overflowY: "auto",
                  }}
                >

                  {notifications.map(
                    (notification) => {

                      const style =
                        getNotificationStyle(
                          notification.type
                        );


                      return (

                        <ListItemButton
                          key={notification.id}

                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }

                          sx={{
                            px: 2,
                            py: 1.5,

                            alignItems:
                              "flex-start",

                            background:
                              notification.read
                                ? "#FFFFFF"
                                : "#F4F8FD",

                            borderBottom:
                              "1px solid #E5EBF2",

                            "&:hover": {
                              background:
                                "#EAF3FC",
                            },
                          }}
                        >

                          {/* Notification Symbol */}

                          <Box
                            sx={{
                              width: 34,
                              height: 34,

                              minWidth: 34,

                              borderRadius: "9px",

                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",

                              background:
                                style.background,

                              color: style.color,

                              fontSize: "14px",
                              fontWeight: 900,

                              mr: 1.5,
                              mt: 0.2,
                            }}
                          >
                            {style.symbol}
                          </Box>


                          <ListItemText

                            primary={

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.7,
                                }}
                              >

                                <Typography
                                  sx={{
                                    color:
                                      "#153555",

                                    fontSize:
                                      "13px",

                                    fontWeight:
                                      notification.read
                                        ? 600
                                        : 800,
                                  }}
                                >
                                  {notification.title}
                                </Typography>


                                {!notification.read && (

                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,

                                      borderRadius:
                                        "50%",

                                      background:
                                        "#FF3B4B",
                                    }}
                                  />

                                )}

                              </Box>
                            }


                            secondary={

                              <Typography
                                component="span"

                                sx={{
                                  display: "block",

                                  mt: 0.4,

                                  color: "#607892",

                                  fontSize: "11px",

                                  lineHeight: 1.45,
                                }}
                              >
                                {notification.message}
                              </Typography>
                            }

                          />

                        </ListItemButton>

                      );
                    }
                  )}

                </List>

              ) : (

                <Box
                  sx={{
                    py: 5,
                    px: 2,
                    textAlign: "center",
                  }}
                >

                  <Box
                    sx={{
                      width: 44,
                      height: 44,

                      borderRadius: "50%",

                      background: "#EAF7EF",
                      color: "#49A56A",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      margin: "0 auto 10px",

                      fontSize: "22px",
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </Box>


                  <Typography
                    sx={{
                      color: "#153555",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    No new notifications
                  </Typography>


                  <Typography
                    sx={{
                      color: "#71869C",
                      fontSize: "11px",
                      mt: 0.5,
                    }}
                  >
                    You're all caught up.
                  </Typography>

                </Box>

              )}

            </Paper>

          )}

        </Box>


        {/* Divider */}

        <Divider
          orientation="vertical"
          flexItem

          sx={{
            borderColor:
              "rgba(255,255,255,0.35)",

            height: 28,

            alignSelf: "center",
          }}
        />


        {/* ==================================================
            LOGGED-IN DOCTOR
        ================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >

          {/* Doctor Avatar */}

          <Avatar
            sx={{
              width: 38,
              height: 38,

              background:
                "#EEF3F9",

              color:
                "#61738E",

              border:
                "2px solid rgba(255,255,255,0.45)",
            }}
          >

            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 700,
              }}
            >
              {doctorInitial}
            </Typography>

          </Avatar>


          {/* Doctor Name + ID */}

          <Box
            sx={{
              display: "flex",

              flexDirection: "column",

              justifyContent: "center",

              minWidth: 105,
            }}
          >

            <Typography
              sx={{
                color: "#FFFFFF",

                fontSize: "14px",

                fontWeight: 700,

                lineHeight: 1.2,

                whiteSpace: "nowrap",
              }}
            >
              {doctorName}
            </Typography>


            <Typography
              sx={{
                color:
                  "rgba(255,255,255,0.72)",

                fontSize: "10px",

                fontWeight: 500,

                lineHeight: 1.4,
              }}
            >
              ID: {doctorId}
            </Typography>

          </Box>

        </Box>


        {/* Divider */}

        <Divider
          orientation="vertical"
          flexItem

          sx={{
            borderColor:
              "rgba(255,255,255,0.35)",

            height: 28,

            alignSelf: "center",
          }}
        />


        {/* ==================================================
            LOGOUT
        ================================================== */}

        <Box
          component="button"

          onClick={handleLogout}

          sx={{
            display: "flex",

            alignItems: "center",

            gap: 0.8,

            px: 1.5,
            py: 0.8,

            borderRadius: "8px",

            border:
              "1px solid rgba(255,255,255,0.45)",

            background:
              "rgba(255,255,255,0.04)",

            color: "#FFFFFF",

            cursor: "pointer",

            fontFamily: "inherit",

            fontSize: "13px",

            fontWeight: 700,

            transition:
              "all 0.2s ease",

            "&:hover": {
              background:
                "rgba(255,255,255,0.14)",
            },
          }}
        >

          <LogoutIcon
            sx={{
              fontSize: 18,
            }}
          />


          <Typography
            component="span"

            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "inherit",
            }}
          >
            Logout
          </Typography>

        </Box>

      </Box>

    </Box>
  );
}


export default Navbar;
