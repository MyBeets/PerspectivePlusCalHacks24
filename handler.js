var captionArr = null;
var idx = 0;

$( document ).ready(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.time("side panel callback")
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        if (captionArr == null) {
            //get captions from server
            $.ajax({ 
                type: "GET",
                //url: "https://perspective-plus-337f21f44542.herokuapp.com/captions", 
                url: "http://127.0.0.1:5000/captions", 
                data: "id=" + activeTab.url,
                dataType: "json",

                success: function(response_data){
                    console.log(response_data);
                    console.timeLog("side panel callback")
                    if (response_data.is_video == false) {
                        document.getElementById("content").innerHTML = response_data.message;
                    } else {
                        captionArr = JSON.parse(response_data.message);

                        //listener to do on document update?
                        timechecker(activeTabId);
                        

                    }
                },
                error : function(request,error)
                {
                    alert("request failed");
                }
            })
        } 
        });
});

async function timechecker(tabID){
    res = await chrome.scripting.executeScript({
      target: {tabId: tabID},
      func: () => document.querySelector('.ytp-time-current')?.textContent,
      //ytp-time-current
    });
    timestamp = convertToSeconds(res[0].result);
    document.getElementById("timestamp").innerHTML = timestamp;
    while (timestamp > captionArr[idx][0]) {
        idx += 1;
    }
    document.getElementById("caption").innerHTML = captionArr[idx][1];
    if (captionArr.length > 2) {
        document.getElementById("content").innerHTML = captionArr[idx][2];
    } 
    timechecker(tabID)
}

function convertToSeconds(timestamp) {
    let arr = timestamp.split(":");
    let seconds = 0;
    for (let i = 0; i < arr.length; i++) {
      let n = parseInt(arr[i]);
      let exp = arr.length-1-i;
      seconds += Math.pow(60, exp)*n; 
    }
    return seconds;
}