const btnAdd = document.querySelector('#btnAdd');
const btnRemove = document.querySelector('#btnRemove');
const sb = document.querySelector('#list');
const name = document.querySelector('#name');

btnAdd.onclick = (e) => {
    e.preventDefault();

    // Ensure the CreatorID doesn't contain whitespaces and remove the query key if present
    let creatorId = name.value.replace('?WT.mc_id=', '').trim()



    const option = new Option(creatorId, creatorId);
    sb.add(option, undefined);

    chrome.storage.sync.set({
        list: Object.keys(sb.options).map(f => sb.options[f].value)
    }, function () { });

    // reset the value of the input
    name.value = '';
    name.focus();
};

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
};

function save_options() {
    var creatorId = document.getElementById('creatorId').value.replace('?WT.mc_id=', '');
    document.getElementById('creatorId').value = creatorId;


}

function restore_options() {

    chrome.storage.sync.get({
        list: [],
    }, function (items) {




        console.log("items:", items)
        items.list.forEach(function (item) {
            const option = new Option(item, item);
            sb.add(option, undefined);

            console.log("item:", item)


        })



    });



}

console.log("resoptiontore")
document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click',
//     save_options);