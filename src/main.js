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
  "https://azure.microsoft.com/*",
  "https://blog.fabric.microsoft.com/*",
  "https://blogs.msdn.microsoft.com/*",
  "https://blogs.technet.microsoft.com/*",
  "https://channel9.msdn.com/*",
  "https://cloudblogs.microsoft.com/*",
  "https://code.visualstudio.com/*",
  "https://community.fabric.microsoft.com/*",
  "https://csc.docs.microsoft.com/*",
  "https://devblogs.microsoft.com/*",
  "https://developer.microsoft.com/*",
  "https://docs.azure.cn/*",
  "https://docs.microsoft.com/*",
  "https://dotnet.microsoft.com/*",
  "https://events.microsoft.com/*",
  "https://foundershub.startups.microsoft.com/*",
  "https://gallery.technet.microsoft.com/*",
  "https://imaginecup.microsoft.com/*",
  "https://learn.microsoft.com/*",
  "https://microsoft.com/handsonlabs/*",
  "https://msdn.microsoft.com/*",
  "https://mvp.microsoft.com/*",
  "https://powerbi.microsoft.com/*",
  "https://reactor.microsoft.com/*",
  "https://social.msdn.microsoft.com/*",
  "https://social.technet.microsoft.com/*",
  "https://techcommunity.microsoft.com/*",
  "https://technet.microsoft.com/*",
  "https://www.azure.cn/*",
];
const regexAll = /(?<=\.com)\/[a-zA-Z]{2}(-[a-zA-Z]{4}){0,1}-[a-zA-Z]{2}/i; //look for URLs that force any language - assumes the format is xxxxxxx.com/xx-yy or xxxxxxx.com/xx-zzzz-yy
var makeNeutralURL = false; // toggle for removal of language code from English URLs
var makeNeutralURLAll = false; // toggle for removal of language code from language specific URLs in any language

chrome.contextMenus.onClicked.addListener(async function (itemData) {
  var linkUrl =
    itemData.linkUrl !== undefined ? itemData.linkUrl : itemData.pageUrl;
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

  await setClipboardUsingOffscreenDocument(url.href);
});

async function setClipboardUsingOffscreenDocument(text) {
  // Create offscreen document if it doesn't exist
  try {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: "Write text to the clipboard.",
    });
  } catch (e) {
    // If the offscreen document already exists, an error will be thrown. This is expected.
  }

  // Send message to offscreen document
  chrome.runtime.sendMessage({
    type: "copy-to-clipboard",
    target: "offscreen",
    data: text,
  });
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
