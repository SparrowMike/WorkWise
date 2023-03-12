export function countdown(minutes: number): void {
    let seconds = 0;

    const intervalId = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(intervalId);
                console.log("Timer Done!");
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }

    }, 1000);
}
