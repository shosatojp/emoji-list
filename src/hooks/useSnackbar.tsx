import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { ReactElement, useState } from 'react';

type SnackbarEntry = {
    message: string,
    severity?: AlertColor,
};

type SnackbarContextValue = {
    pushQueue: (config: SnackbarEntry) => void,
};

const SnackbarContext = React.createContext<SnackbarContextValue>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pushQueue: (_config: SnackbarEntry) => { },
});

type SnackbarProviderProps = {
    children: ReactElement | ReactElement[],
};

const queue: SnackbarEntry[] = [];
let pushQueue: (entry: SnackbarEntry) => void;

export const SnackbarProvider: React.FC<SnackbarProviderProps> =
    (props: SnackbarProviderProps) => {
        const [snackbarOptions, setSnackbarOptions] = useState<{
            open: boolean,
            entry: SnackbarEntry,
        }>({ open: false, entry: { message: '' } });

        pushQueue = (entry: SnackbarEntry) => {
            if (!snackbarOptions.open) {
                setSnackbarOptions(p => ({ ...p, open: true, entry }));
            } else {
                queue.push(entry);
            }
        };

        return <SnackbarContext.Provider
            value={{ pushQueue }}
        >
            {props.children}
            <Snackbar
                message={snackbarOptions.entry.message}
                open={snackbarOptions.open}
                autoHideDuration={2000}
                onClose={(event, reason) => {
                    if (reason !== 'timeout') {
                        return;
                    }
                    setSnackbarOptions({ open: false, entry: { message: '' } });
                    const entry = queue.pop();
                    if (entry) {
                        setTimeout(() => {
                            setSnackbarOptions({ open: true, entry });
                        }, 500);
                    }
                }}
            >
                {snackbarOptions.entry.severity &&
                    <Alert severity={snackbarOptions.entry.severity}>{snackbarOptions.entry.message}</Alert>
                }
            </Snackbar>
        </SnackbarContext.Provider>;
    };

export const useSnackbar = () => {
    return { pushSnackbar: pushQueue };
};
