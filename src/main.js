const QUERY_KEY = 'WT.mc_id';

chrome.contextMenus.onClicked.addListener(function (itemData) {

    console.log("item", itemData);
    var url = new URL(itemData.linkUrl);
    console.log("item", itemData);
    url.searchParams.append(QUERY_KEY, itemData.menuItemId);
    copyTextToClipboard(url.href);


});

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}