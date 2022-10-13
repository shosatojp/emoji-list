import React from 'react';
import { createRoot } from 'react-dom/client';

import { SnackbarProvider } from './hooks/useSnackbar';
import { ListPage } from './pages/ListPage';

window.addEventListener('DOMContentLoaded', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = createRoot(document.getElementById('root')!);
    root.render(
        <>
            <SnackbarProvider>
                <ListPage />
            </SnackbarProvider>
        </>
    );
});
