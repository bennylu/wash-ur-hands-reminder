chrome.runtime.onInstalled.addListener(async () => {
  await addReminderAsync(10, 0, "快起來動一動洗手上廁所！");
  await addReminderAsync(15, 30, "快起來動一動洗手上廁所！");
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