chrome.runtime.onInstalled.addListener(() => {
	let stored_values = {
		'reminders': [
			{ name: 'reminder-1', hour: 10, minute: 0 },
			{ name: 'reminder-2', hour: 15, minute: 30 }
		]
	};

	chrome.storage.local.set(stored_values, () => {
		console.log('values stored', stored_values);
	});

	scheduleReminders();
});

chrome.windows.onCreated.addListener(() => {
	scheduleReminders();
});

chrome.alarms.onAlarm.addListener(alarm => {
	alert('快起來動一動洗手上廁所！');
	scheduleReminders();
});

function scheduleReminders() {
	chrome.storage.local.get('reminders', values => {
		let reminders = values.reminders;

		reminders.forEach(reminder => {
			chrome.alarms.clear(reminder.name);

			let reminderTime = new Date();
			reminderTime.setHours(reminder.hour, reminder.minute, 0, 0);

			let now = new Date();
			if (reminderTime < now) {
				// see you tomorrow
				reminderTime.setDate(reminderTime.getDate() + 1);
			}

			// schedule reminder
			console.log('schedule reminder', reminder.name, reminderTime);
			chrome.alarms.create(reminder.name, {
				when: reminderTime.getTime()
			});
		});
	})
}