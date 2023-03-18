export const samplePref = {
  theme: true,
  reminder: 'my current sprint sample, it being big kinda breaks the entire thing, will need to come up with solution',
  isActive: false,
  showReminder: true,
  timeLeft: 5,
}

const data = {
  isBlobActive: false,
  preference: {
    theme: 'dark', // or boolean
    showReminder: true, // inside the blob
    stickyBlob: false,
    hideBlob: false,
    sprintTiming: 5,
    blobPosition: {
      x: 10,
      y: 10
    }
  },
  reminders: [
    {
      title: '',
      description: '',
      priority: 0,
      reminder: false,
    }
  ]
}
