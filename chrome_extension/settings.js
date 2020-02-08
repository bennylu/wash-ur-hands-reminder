document.addEventListener('DOMContentLoaded', () => {
    inflateReminders();

    $('#btn-add').on('click', () => {
        addReminder();
    });
});

getReminders = () => {
    return new Promise(resolve => {
        chrome.storage.local.get(null, values => {
            resolve(values);
        });
    });
};

addReminder = () => {
    let hour = $('#hour').val();
    let minute = $('#minute').val();
    let text = $('#text').val();

    if (hour == '' || minute == '' || text == '') {
        return;
    }

    let pair = {};
    pair['reminder-' + new Date().getTime()] = {
        hour, minute, text
    };

    chrome.storage.local.set(pair, () => {
        inflateReminders();
	});
};

deleteReminder = name => {
    chrome.storage.local.remove(name, () => {
        inflateReminders();
	});
};

getFormatedTime = reminder => {
    let hh = reminder.hour < 10 ? '0' + reminder.hour : reminder.hour;
    let mm = reminder.minute < 10 ? '0' + reminder.minute : reminder.minute;
    return hh + ':' + mm;
};

getFormattedText = reminder => {
    let text =  reminder.text;
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return text;
}

inflateReminders = async () => {
    let reminders = await getReminders();
    let div = $('#div_reminders');
    let tb = $('#tb_reminders');
    tb.empty();

    let names = Object.keys(reminders);

    if (names.length > 0) {
        div.show();

        let header = $('<tr><th width="20%">時間</th><th width="60%">提醒內容</th><th>刪除</th></tr>');
        tb.append(header);
    
        names = names.sort((n1, n2) => {
            let r1 = reminders[n1];
            let r2 = reminders[n2];

            if (parseInt(r1.hour) < parseInt(r2.hour)) {
                return -1;
            } else if (parseInt(r1.hour) > parseInt(r2.hour)) {
                return 1;
            }

            if (parseInt(r1.minute) < parseInt(r2.minute)) {
                return -1;
            } else if (parseInt(r1.minute) > parseInt(r2.minute)) {
                return 1;
            }

            return 0;
        });
    
        names.forEach(name => {
            let reminder = reminders[name];
    
            let tr = $('<tr class="item"></tr>');
            tr.append('<td>' + getFormatedTime(reminder) + '</td>');
            tr.append('<td>' + getFormattedText(reminder) + '</td>');
            tr.append('<td><a id="del-' + name + '"><div class="btn btn-danger">刪除</div></a></td>');
            tb.append(tr);
    
            $('#del-' + name).on('click', () => {
                deleteReminder(name);
            });
        });
    } else {
        div.hide();
    }
};