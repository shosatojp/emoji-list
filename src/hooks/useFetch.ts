import React from 'react';

export interface FetchResult {
    loading: boolean
    error: boolean
}

export const useFetchText: (url: string) => [string | null, FetchResult] = (url: string) => {
    const [data, setData] = React.useState<string | null>(null);
    const [error, setError] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    if (!data && !loading) {
        setLoading(true);
        (async () => {
            const res = await fetch(url);
            if (Math.floor(res.status / 100) === 2) {
                const _data = await res.text();
                setData(_data);
            } else {
                console.log('error');
                setError(true);
            }
            setLoading(false);
        })();
    }

    return [data, { loading, error }];
};
