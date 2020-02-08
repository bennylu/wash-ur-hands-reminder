chrome.runtime.onInstalled.addListener(() => {
  let reminders = {
    "reminder-1": {
      hour: 10,
      minute: 0,
      text: "快起來動一動洗手上廁所！"
    },
    "reminder-2": {
      hour: 15,
      minute: 30,
      text: "快起來動一動洗手上廁所！"
    }
  };

  setRemindersAsync(reminders).then(() => {
    scheduleReminders();
  });
});

chrome.windows.onCreated.addListener(() => {
  scheduleReminders();
});

chrome.alarms.onAlarm.addListener(alarm => {
  chrome.storage.local.get(alarm.name, values => {
    let reminder = values[alarm.name];
    if (reminder) alert(reminder.text);

    scheduleReminders();
  });
});
