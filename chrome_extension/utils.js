getRemindersAsync = () => {
  return new Promise(resolve => {
    chrome.storage.local.get(null, values => {
      resolve(values);
    });
  });
};

setRemindersAsync = async reminders => {
  return new Promise(resolve => {
    chrome.storage.local.set(reminders, () => {
      resolve();
    });
  });
};

addReminderAsync = async (hour, minute, text) => {
  return new Promise(resolve => {
    let pair = {};
    pair["reminder-" + new Date().getTime()] = {
      hour,
      minute,
      text
    };

    chrome.storage.local.set(pair, () => {
      scheduleReminders();
      resolve();
    });
  });
};

deleteReminderAsync = async name => {
  return new Promise(resolve => {
    chrome.storage.local.remove(name, () => {
      scheduleReminders();
      resolve();
    });
  });
};

scheduleReminders = async () => {
  chrome.alarms.clearAll();

  let reminders = await getRemindersAsync();
  let names = Object.keys(reminders);

  names.forEach(name => {
    let reminder = reminders[name];
    let reminderTime = new Date();
    reminderTime.setHours(reminder.hour, reminder.minute, 0, 0);

    let now = new Date();
    if (reminderTime < now) {
      // see you tomorrow
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    // schedule alarm
    console.log("schedule reminder", name, reminderTime);
    chrome.alarms.create(name, {
      when: reminderTime.getTime()
    });
  });
};
