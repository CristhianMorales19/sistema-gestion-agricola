import { Snackbar, Alert } from "@mui/material"
import React from "react";
import { Message } from "../MessageProvider";

interface MessageSnackbarProps {
    message: Message;
    clearMessage: () => void;
}

export const MessageSnackbar = React.memo(({message, clearMessage}: MessageSnackbarProps) => {
    if (!message.type) return null;

    return(
        <Snackbar
        open
        autoHideDuration={4000}
        onClose={clearMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right"}}
        >
            <Alert
            onClose={clearMessage}
            severity={message.type}
            sx={{width: "100%"}}
            >
                {message.text}
            </Alert>
        </Snackbar>
    );
});