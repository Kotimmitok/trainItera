import { useTimer } from '../hooks/useTimer';

interface Props {
    startedAt: string;
    finishedAt: string | null;
}

const WorkoutTimer: React.FC<Props> = ({ startedAt, finishedAt }) => {
    const { formattedTime } = useTimer(startedAt, finishedAt);
    return <span>{formattedTime}</span>;
};

export default WorkoutTimer;