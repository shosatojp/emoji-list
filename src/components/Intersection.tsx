import React from 'react';

export interface IntersectionProps {
    children: React.ReactNode
    height: number
}

export const Intersection: React.FC<IntersectionProps> = (props: IntersectionProps) => {
    console.log('Intersection');
    const [hidden, setHidden] = React.useState<boolean>(true);
    const ref = React.createRef<HTMLDivElement>();
    const ob = React.useMemo(() => new IntersectionObserver((_entries, _observer) => {
        if (ref.current && hidden) {
            if (window.pageYOffset + window.innerHeight > ref.current.offsetTop) {
                console.log('show', ref.current);
                setHidden(false);
            }
        }
    }, {
        root: null,
        rootMargin: '0px',
        threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }), [props.children]);

    React.useEffect(() => {
        if (ref.current) {
            ob.observe(ref.current);
        }
        return () => ob.disconnect();
    }, [ob]);

    return <div ref={ref}>
        {hidden
            ? <div style={{ height: props.height }}></div>
            : props.children
        }
    </div>;
};
