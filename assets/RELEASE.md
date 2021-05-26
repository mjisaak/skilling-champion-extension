# Release information

## Tag the repo to start the release workflow

git tag v1.2.1
git push origin --tags

## Upload description

This extension can be used by Microsoft MVPs for the Microsoft Docs & Learn Champion program. It allows to copy links with an added CreatorId. The context menue is only visible on certain sites:

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
"https://microsoft.com/handsonlabs/*",
"https://csc.docs.microsoft.com/*

And only on links. To test this extension:

1. Go to the extension settings and add your CreatorID (like AZ-MVP-5003203)
2. Got to one of the above listed sites e. g. https://docs.microsoft.com/en-us/
3. Right click on a link e. g. on ".NET"
4. Select "Copy link address with CreatorID"

Now your Clipboard contains the link you clicked on with your attached CreatorID, e. g.:
https://docs.microsoft.com/en-us/dotnet/?WT.mc_id=AZ-MVP-5003203
instead of
https://docs.microsoft.com/en-us/dotnet/
