interface CountdownProps {
    minutes: number;
    onTick: (minutes: number, seconds: number) => void;
    onEnd: () => void;
}

export function countdown({ minutes, onTick, onEnd }: CountdownProps) {
    let seconds = 0;

    const intervalId = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(intervalId);
                onEnd();
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }

        onTick(minutes, seconds);
    }, 1000);

    return intervalId;
}
