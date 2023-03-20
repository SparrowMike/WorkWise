export function countdown(minutes: number, calcTimeLeft: (timeLeft: number) => void): void {
    const initialTime = minutes * 60;
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

        let timeLeft = minutes * 60 + seconds;
        calcTimeLeft(timeLeft);
        updateGradientColor(timeLeft, initialTime);
    }, 1000);
}

function updateGradientColor(countdown: number, initialTime: number) {
    const stop1: HTMLElement | null = document.getElementById("stop1");
    const stop2: HTMLElement | null = document.getElementById("stop2");
    const color1Start = [90, 160, 64];
    const color1End = [233, 0, 100];
    const color2Start = [105, 232, 120];
    const color2End = [179, 0, 94];
    let diff = Math.abs(countdown / initialTime - 1);

    if (countdown === 0) {
        if (stop1) stop1.style.stopColor = "rgb(233, 0, 100)";
        if (stop2) stop2.style.stopColor = "rgb(179, 0, 94)";
        return;
    }

    const r1 = color1Start[0] + (color1End[0] - color1Start[0]) * diff;
    const g1 = color1Start[1] - (color1Start[1] - color1End[1]) * diff;
    const b1 = color1Start[2] + (color1End[2] - color1Start[2]) * diff;

    const r2 = color2Start[0] + (color2End[0] - color2Start[0]) * diff;
    const g2 = color2Start[1] - (color2Start[1] - color2End[1]) * diff;
    const b2 = color2Start[2] - (color2Start[2] - color2End[2]) * diff;

    if (stop1) stop1.style.stopColor = `rgb(${r1}, ${g1}, ${b1})`;
    if (stop2) stop2.style.stopColor = `rgb(${r2}, ${g2}, ${b2})`;
}
