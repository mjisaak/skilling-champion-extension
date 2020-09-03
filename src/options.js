
function save_options() {
    var creatorId = document.getElementById('creatorId').value.replace('?WT.mc_id=', '');
    document.getElementById('creatorId').value = creatorId;

    chrome.storage.sync.set({
        creatorId: creatorId
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

function restore_options() {

    chrome.storage.sync.get({
        creatorId: '',
    }, function (items) {
        document.getElementById('creatorId').value = items.creatorId;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);