const btnAdd = document.querySelector('#btnAdd');
const btnRemove = document.querySelector('#btnRemove');
const sb = document.querySelector('#list');
const namefield = document.querySelector('#name');
const error = document.querySelector('#error');
const chkLanguageneutral = document.querySelector('#chkLanguageneutral');
const chkLanguageneutralAll = document.querySelector('#chkLanguageneutralAll');

btnAdd.onclick = (e) => {
    e.preventDefault();

    let creatorId = trimCreatorId(namefield.value);
    let values = Object.keys(sb.options).map(f => sb.options[f].value);

    // ensure there are no duplicates
    if (values.includes(creatorId)) {
        error.textContent = 'CreatorId already exists';

        setTimeout(function () {
            error.textContent = '';
        }, 2000);

        namefield.focus();
        return;
    }

    const option = new Option(creatorId, creatorId);
    sb.add(option, undefined);

    saveCreatorIds();


    // reset the value of the input
    namefield.value = '';
    namefield.focus();
};

function trimCreatorId(creatorId) {
    return creatorId.replace('?WT.mc_id=', '').trim();
}



function saveCreatorIds() {

    let creatorIds = Object.keys(sb.options).map(f => sb.options[f].value);

    chrome.storage.sync.set({
        list: creatorIds
    }, function () { });

    chrome.runtime.sendMessage('updateDocsLearnContextMenues');
}

btnRemove.onclick = (e) => {
    e.preventDefault();

    // save the selected option
    let selected = [];

    for (let i = 0; i < sb.options.length; i++) {
        selected[i] = sb.options[i].selected;
    }

    // remove all selected option
    let index = sb.options.length;
    while (index--) {
        if (selected[index]) {
            sb.remove(index);
        }
    }

    saveCreatorIds();

};

chkLanguageneutral.onchange = (e) => {
    e.preventDefault();
    saveLangOptions();

};

chkLanguageneutralAll.onchange = (e) => {
    e.preventDefault();
    saveLangOptions();

};

// Saves Language options to chrome.storage
function saveLangOptions() {
	var makeNeutralURL = document.getElementById('chkLanguageneutral').checked;
	var makeNeutralURLAll = document.getElementById('chkLanguageneutralAll').checked;
	chrome.storage.sync.set({
			makeNeutralURL: makeNeutralURL,
			makeNeutralURLAll: makeNeutralURLAll
	}, function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
			}, 750);
	});
}

// Load  Language options from  chrome.storage
function restoreLangOptions() {
	// Use default value makeNeutralURL = false to preserve legacy bahavior of the extension
	chrome.storage.sync.get({
			makeNeutralURL: false,
			makeNeutralURLAll: false
        }, function(items) {
			document.getElementById('chkLanguageneutral').checked = items.makeNeutralURL;
			document.getElementById('chkLanguageneutralAll').checked = items.makeNeutralURLAll;
	});
}


function restoreOptions() {
    restoreLangOptions();
	chrome.storage.sync.get({
        list: [],
    }, function (items) {

        if (items) {
            items.list.forEach(function (item) {
                const option = new Option(item, item);
                sb.add(option, undefined);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);