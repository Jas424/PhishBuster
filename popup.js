function checkPage() {
    console.log("called cehck");
  
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0].url;
  
      // Check if the page is HTTPS
      if (!url.startsWith("https")) {
        setStatus("Check if the page is HTTPS", "Phishing Alert: The page is not using HTTPS encryption.");
      } else {
        setStatus("Check if the page is HTTPS", "Page is using HTTPS encryption.");
      }
  
      // Check if the page is using TLS or SSL
      var protocol = url.split("://")[0];
      if (protocol != "https" && protocol != "tls" && protocol != "ssl") {
        setStatus("Check if the page is using TLS or SSL", "Phishing Alert: The page is not using TLS or SSL.");
      } else {
        setStatus("Check if the page is using TLS or SSL", "Page is using TLS or SSL.");
      }
  
      // Check if the domain name is correct
      var hostname = new URL(url).hostname;
      if (hostname != "www.amazon.com") {
        setStatus("Check if the domain name is correct", "Phishing Alert: The domain name is different from Amazon.");
      } else {
        setStatus("Check if the domain name is correct", "Domain name is correct.");
      }
  
  
      const urlPattern = "https://www.amazon.com/ap/*";
  
  
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currentTab = tabs[0];
        // if (currentTab.url.match(urlPattern)) {
        // Check if the content matches
        console.log("testing");
        console.log("testing", currentTab.id);
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          files: ["content.js"]
        }).then(() => {
          chrome.tabs.sendMessage(currentTab.id, {}, function (response) {
            console.log(response);
            if (response && response.match) {
              setStatus("Check if the content matches Amazon's login page", "Safe: The page is not a phishing site.");
            } else {
              setStatus("Check if the content matches Amazon's login page", "Phishing Alert: The content of the page does not match Amazon's login page.");
            }
          });
        }).catch(err => {
          // console.error(err);
          setStatus("Check if the content matches Amazon's login page", "Phishing Alert: The content of the page does not match Amazon's login page.");
        });
        // }
      });
  
  
    });
  }
  
  var checkStatus = {
    "Check if the page is HTTPS": [],
    "Check if the page is using TLS or SSL": [],
    "Check if the domain name is correct": [],
    "Check if the content matches Amazon's login page": []
  };
  
  function resetTable() {
    checkStatus = {
      "Check if the page is HTTPS": [],
      "Check if the page is using TLS or SSL": [],
      "Check if the domain name is correct": [],
      "Check if the content matches Amazon's login page": []
    };
    var tableBody = document.getElementById('status-table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
  }
  
  
  function setStatus(check, status) {
    checkStatus[check].push(status);
    console.log(status);
    var tableRow = document.createElement('tr');
    var checkColumn = document.createElement('td');
    var statusColumn = document.createElement('td');
    checkColumn.textContent = check;
    statusColumn.textContent = status;
    tableRow.appendChild(checkColumn);
    tableRow.appendChild(statusColumn);
    if (status.includes("Phishing Alert")) {
      tableRow.classList.add("failed");
    } else {
      tableRow.classList.add("success");
    }
    document.getElementById('status-table-body').appendChild(tableRow);
  }
  
  
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("check-me").addEventListener("click", function () {
      console.log("cliecked");
      resetTable();
      checkPage();
    });
  });