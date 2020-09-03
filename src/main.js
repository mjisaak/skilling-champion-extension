const QUERY_KEY = 'WT.mc_id';

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        title: 'Copy link address with CreatorID',
        id: 'docslearnchampion',
        documentUrlPatterns: [
            "http://social.technet.microsoft.com/*",
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
});

chrome.contextMenus.onClicked.addListener(function (itemData) {
    chrome.storage.sync.get({
        creatorId: '',
    }, function (items) {
        creatorId = items.creatorId;
        var url = new URL(itemData.linkUrl);
        url.searchParams.append(QUERY_KEY, creatorId);
        copyTextToClipboard(url.href);
    });

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