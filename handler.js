$( document ).ready(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.time("side panel callback")
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        $.ajax({ 
            type: "GET",
            url: "https://perspective-plus-337f21f44542.herokuapp.com/captions", 
            data: "id=" + activeTab.url,
            dataType: "json",

            success: function(response_data){
                console.log(response_data)
                console.timeLog("side panel callback")
                if (response_data.is_video == false) {
                    document.getElementById("content").innerHTML = response_data.message;
                } else {
                    var captionDict = response_data.message；
                    document.getElementById("content").innerHTML = JSON.stringify(captionDict);
                    console.log(captionDict)

                }
            },
            error : function(request,error)
            {
                alert("request failed");
            }
        })
        });
});