import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

type MessageType = 'success' | 'error';

interface Message {
    type: MessageType | null;
    text: string;
}

interface MessageContextProps {
    showMessage: (type: MessageType, text: string) => void;
    clearMessage: () => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<Message>({ type: null, text: '' });

    const showMessage = useCallback((type: MessageType, text: string) => {
        setMessage({ type, text });
    }, []);

    const clearMessage = useCallback(() => {
        setMessage({ type: null, text: '' });
    }, []);

    return (
        <MessageContext.Provider value={{ showMessage, clearMessage }}>
        {children}
        {!!message.type && (
            <Snackbar
                open
                autoHideDuration={4000}
                onClose={clearMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={clearMessage}
                    severity={message.type}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                {message.text}
                </Alert>
            </Snackbar>
            )}       
        </MessageContext.Provider>
    );
};

// Hook para consumir el contexto
export const useMessage = (): MessageContextProps => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};
