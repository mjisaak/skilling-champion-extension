const QUERY_KEY = "WT.mc_id";
const extensionPrefix = "-skch"; // skch stands for skilling champion
const parentIdPagePostfix = extensionPrefix + "-page";
const parentIdLinkPostfix = extensionPrefix + "-link";
const regex = /\/en-us/i; //look for URLs that force English language
const regexIdPostfix = new RegExp(
  parentIdPagePostfix + "$|" + parentIdLinkPostfix + "$",
  "i"
);
const suitableSites = [
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
  "https://csc.docs.microsoft.com/*",
];
const regexAll = /(?<=\.com)\/[a-zA-Z]{2}(-[a-zA-Z]{4}){0,1}-[a-zA-Z]{2}/i; //look for URLs that force any language - assumes the format is xxxxxxx.com/xx-yy or xxxxxxx.com/xx-zzzz-yy
var makeNeutralURL = false; // toggle for removal of language code from English URLs
var makeNeutralURLAll = false; // toggle for removal of language code from language specific URLs in any language

chrome.contextMenus.onClicked.addListener(function (itemData) {
  console.log("itemData", itemData);
  var linkUrl =
    itemData.linkUrl !== undefined ? itemData.linkUrl : itemData.pageUrl;
  console.log("linkurl", linkUrl);
  var url = new URL(linkUrl);

  // remove the postfix to get the actual creator Id e. g. AZ-MVP-5003203-skch-page => AZ-MVP-5003203
  var creatorId = itemData.menuItemId.replace(regexIdPostfix, "");

  url.searchParams.set(QUERY_KEY, creatorId);
  if (makeNeutralURL) {
    url.href = url.href.replace(regex, "");
  } //remove language code from URL
  if (makeNeutralURLAll) {
    url.href = url.href.replace(regexAll, "");
  } //remove language code from URL

  copyTextToClipboard(url.href);
});

function copyTextToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

function createContextMenues(creatorIds) {
  chrome.contextMenus.removeAll();
  if (creatorIds.length < 1) {
    return;
  }

  let linkParentId =
    creatorIds.length > 1
      ? "root" + parentIdLinkPostfix
      : creatorIds[0] + parentIdLinkPostfix;

  let pageParentId =
    creatorIds.length > 1
      ? "root" + parentIdPagePostfix
      : creatorIds[0] + parentIdPagePostfix;

  chrome.contextMenus.create({
    title: "Copy link address with CreatorID",
    id: linkParentId,
    targetUrlPatterns: suitableSites,
    contexts: ["link"],
  });

  chrome.contextMenus.create({
    title: "Copy page url with CreatorID",
    id: pageParentId,
    documentUrlPatterns: suitableSites,
    contexts: ["page"],
  });

  if (creatorIds.length > 1) {
    creatorIds.forEach(function (creatorId) {
      chrome.contextMenus.create({
        title: creatorId,
        id: creatorId + parentIdLinkPostfix,
        parentId: linkParentId,
        contexts: ["link"],
      });
      chrome.contextMenus.create({
        title: creatorId,
        id: creatorId + parentIdPagePostfix,
        parentId: pageParentId,
        contexts: ["page"],
      });
    });
  }
}

function updateContextMenues() {
  chrome.storage.sync.get(
    {
      list: [],
    },
    function (items) {
      if (items) {
        createContextMenues(items.list);
      } else {
        chrome.contextMenus.removeAll();
      }
    }
  );
}

// Load  Language options from  chrome.storage
function restoreLangOptions() {
  // Use default value makeNeutralURL = false.
  chrome.storage.sync.get(
    {
      makeNeutralURL: false,
      makeNeutralURLAll: false,
    },
    function (items) {
      makeNeutralURL = items.makeNeutralURL;
      makeNeutralURLAll = items.makeNeutralURLAll;
    }
  );
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request === "updateSkillingChampionContextMenues") {
    updateContextMenues();
    restoreLangOptions();
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    updateContextMenues();
    restoreLangOptions();
  }
});
