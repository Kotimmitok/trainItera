import { useEffect, useRef, useState } from 'react';

export function useTimer(startedAt: string | null, finishedAt: string | null) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!startedAt) return;

        if (timerRef.current) clearInterval(timerRef.current);

        if (finishedAt) {
            const diff = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
            setElapsedSeconds(Math.floor(diff / 1000));
            return;
        }

        const update = () => {
            const diff = Date.now() - new Date(startedAt).getTime();
            setElapsedSeconds(Math.floor(diff / 1000));
        };
        update();
        timerRef.current = setInterval(update, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startedAt, finishedAt]);

    const formattedTime = () => {
        const h = Math.floor(elapsedSeconds / 3600);
        const m = Math.floor((elapsedSeconds % 3600) / 60);
        const s = elapsedSeconds % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return { elapsedSeconds, formattedTime: formattedTime() };
}