import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { MessageSnackbar } from './components/MessageSnackbar';

type MessageType = 'success' | 'error';

export interface Message {
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

    const value = useMemo(() => ({
        showMessage, clearMessage}), 
        [showMessage, clearMessage]
    );

    return (
        <MessageContext.Provider value={value}>
            {children}
            <MessageSnackbar message={message} clearMessage={clearMessage}/>
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
