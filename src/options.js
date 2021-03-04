const btnAdd = document.querySelector('#btnAdd');
const btnRemove = document.querySelector('#btnRemove');
const sb = document.querySelector('#list');
const namefield = document.querySelector('#name');
const error = document.querySelector('#error');

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

function createContextMenues(creatorIds) {
    chrome.contextMenus.removeAll();
    if (creatorIds.length < 1) {
        return
    }

    let parentId = (creatorIds.length > 1) ? "docslearnchampion" : creatorIds[0];

    chrome.contextMenus.create({
        title: 'Copy link address with CreatorID',
        id: parentId,
        targetUrlPatterns: [
            "https://social.technet.microsoft.com/*",
            "https://docs.microsoft.com/*",
            "https://azure.microsoft.com/*",
            "https://techcommunity.microsoft.com/*",
            "https://social.msdn.microsoft.com/*",
            "https://devblogs.microsoft.com/*",
            "https://developer.microsoft.com/*",
            "https://channel9.msdn.com/*",
            "https://gallery.technet.microsoft.com/*",
            "https://cloudblogs.microsoft.com/*",
            "https://technet.microsoft.com/*",
            "https://docs.azure.cn/*",
            "https://www.azure.cn/*",
            "https://msdn.microsoft.com/*",
            "https://blogs.msdn.microsoft.com/*",
            "https://blogs.technet.microsoft.com/*",
            "https://microsoft.com/handsonlabs/*"
        ],
        contexts: ['link']
    });

    if (creatorIds.length > 1) {
        creatorIds.forEach(function (creatorId) {
            console.log("creator", creatorId)
            chrome.contextMenus.create({
                title: creatorId,
                id: creatorId,
                parentId: parentId,
                contexts: ['link']
            });
        });
    }
}

function saveCreatorIds() {

    let creatorIds = Object.keys(sb.options).map(f => sb.options[f].value);

    chrome.storage.sync.set({
        list: creatorIds
    }, function () { });

    createContextMenues(creatorIds);

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


function restoreOptions() {
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