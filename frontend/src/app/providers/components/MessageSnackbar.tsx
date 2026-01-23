import React, { useState, useEffect } from "react";
import { Message } from "../MessageProvider";
import {
  StyledSnackbar,
  StyledAlert,
  SlideTransition,
  ProgressIndicator,
  AccentBorderContainer,
} from "./MessageSnackbar.styles";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MessageSnackbarProps {
  message: Message;
  clearMessage: () => void;
}

export const MessageSnackbar = React.memo(
  ({ message, clearMessage }: MessageSnackbarProps) => {
    const [open, setOpen] = useState(false);
    const [progressKey, setProgressKey] = useState(0);

    useEffect(() => {
      if (message.type && message.text) {
        setOpen(true);
        setProgressKey((prev) => prev + 1); // Reiniciar animación de progreso
      } else {
        setOpen(false);
      }
    }, [message]);

    const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: string,
    ) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
      setTimeout(clearMessage, 300); // Esperar a que termine la animación
    };

    const handleExited = () => {
      // Reset del estado cuando la animación termina
      if (!open) {
        clearMessage();
      }
    };

    if (!message.type || !message.text) return null;

    return (
      <StyledSnackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          marginTop: 8,
          "& .MuiSnackbarContent-root": {
            padding: 0,
          },
        }}
      >
        <AccentBorderContainer severity={message.type}>
          <StyledAlert
            severity={message.type}
            action={
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            }
          >
            {message.text}
            <ProgressIndicator
              key={progressKey}
              severity={message.type}
              duration={4000}
            />
          </StyledAlert>
        </AccentBorderContainer>
      </StyledSnackbar>
    );
  },
);

MessageSnackbar.displayName = "MessageSnackbar";
