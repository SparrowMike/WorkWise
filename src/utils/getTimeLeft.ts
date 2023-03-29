export function getTimeLeft(createdAt: Date, durationMinutes: string): string {
  const now = new Date().getTime();
  const target = createdAt.getTime() + (Number(durationMinutes) * 60 * 1000);
  const timeLeft = target - now;
  if (timeLeft < 0) {
    return '00:00';
  }

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}