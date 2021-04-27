const QUERY_KEY = 'WT.mc_id';
const regex = /\/en-us/i; //look for URLs that force English language
const regexAll = /(?<=\.com)\/[a-zA-Z]{2}(-[a-zA-Z]{4}){0,1}-[a-zA-Z]{2}/i;  //look for URLs that force any language - assumes the format is xxxxxxx.com/xx-yy or xxxxxxx.com/xx-zzzz-yy
var makeNeutralURL = false; // toggle for removal of language code from English URLs 
var makeNeutralURLAll = false; // toggle for removal of language code from language specific URLs in any language 

chrome.contextMenus.onClicked.addListener(function (itemData) {
   
    chrome.storage.sync.get(['includeText'], function (data) {

        if (data) {
            const url = new URL(itemData.linkUrl);

            url.searchParams.append(QUERY_KEY, itemData.menuItemId);

          	if (makeNeutralURL) {url.href = url.href.replace(regex, "")} //remove language code from URL
          	if (makeNeutralURLAll) {url.href = url.href.replace(regexAll, "")} //remove language code from URL

            let text;
            if (data.includeText) {
                let prefix;

                if (itemData.linkText) {
                    // This property only currently exists for Firefox
                    prefix = itemData.linkText + "\n";
                } else if (itemData.selectionText) {
                    prefix = itemData.selectionText + "\n";
                } else {
                    prefix = "";
                }
                text = prefix + url.href;
            } else {
                text = url.href;
            }

            copyTextToClipboard(text);
        }        
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
            "https://microsoft.com/handsonlabs/*",
            "https://csc.docs.microsoft.com/*"
        ],
        contexts: ['link']
    });

    if (creatorIds.length > 1) {
        creatorIds.forEach(function (creatorId) {
            chrome.contextMenus.create({
                title: creatorId,
                id: creatorId,
                parentId: parentId,
                contexts: ['link']
            });
        });
    }
}

function updateContextMenues() {
    chrome.storage.sync.get({
        list: [],
    }, function (items) {
        if (items) {
            createContextMenues(items.list)
        }
        else {
            chrome.contextMenus.removeAll();
        }
    });
}

// Load  Language options from  chrome.storage
function restoreLangOptions() {
	// Use default value makeNeutralURL = false.
	chrome.storage.sync.get({
			makeNeutralURL: false,
            makeNeutralURLAll: false
	}, function(items) {
			makeNeutralURL = items.makeNeutralURL;
            makeNeutralURLAll = items.makeNeutralURLAll;
	});
}

chrome.runtime.onMessage.addListener(function(request) {
    if (request === 'updateDocsLearnContextMenues') {
        updateContextMenues();
		restoreLangOptions();
    }
});


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    updateContextMenues();
	restoreLangOptions();
  }
})