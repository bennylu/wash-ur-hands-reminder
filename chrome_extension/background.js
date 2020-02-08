chrome.runtime.onInstalled.addListener(() => {
	let default_reminders = {
		'reminder-1': {
			hour: 10,
			minute: 0,
			text: '快起來動一動洗手上廁所！'
		},
		'reminder-2': {
			hour: 15,
			minute: 30,
			text: '快起來動一動洗手上廁所！'
		}
	};

	chrome.storage.local.set(default_reminders, () => {
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

function scheduleReminders() {
	chrome.storage.local.get(null, reminders => {
		chrome.alarms.clearAll();

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
			console.log('schedule reminder', name, reminderTime);
			chrome.alarms.create(name, {
				when: reminderTime.getTime()
			});
		});
	});
}