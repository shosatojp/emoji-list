import React from 'react';

export interface FetchResult {
    loading: boolean
    error: boolean
}

export const useFetchText = <T = string>(url: string, mapfn?: (text: string) => T): [T | null, FetchResult] => {
    const [data, setData] = React.useState<T | null>(null);
    const [error, setError] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    if (!data && !loading && !error) {
        setLoading(true);
        (async () => {
            const res = await fetch(url);
            if (Math.floor(res.status / 100) === 2) {
                const _data: string = await res.text();
                if (mapfn) {
                    setData(mapfn(_data));
                } else {
                    setData(_data as unknown as T);
                }
            } else {
                console.log('error');
                setError(true);
            }
            setLoading(false);
        })();
    }

    return [data, { loading, error }];
};
