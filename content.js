  // This code listens for messages from the background script of a Google Chrome extension
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // This line selects the login form on the current page
  var loginForm = document.querySelector('form[name="signIn"]');

  // This block checks if the login form exists and if it is the Amazon login form
  if (!loginForm && loginForm.action !== 'https://www.amazon.com/ap/signin') {
    sendResponse({ match: false });
  }

  // These lines select the email input, password input, and submit button on the form
  var emailInput = loginForm.querySelector("input[type=email], input#ap_email");
  var passwordInput = loginForm.querySelector("input[type=password]");
  var submitButton = loginForm.querySelector("input[type=submit]");

  // This block checks if the email input, password input, and submit button all exist
  if (!emailInput || !passwordInput || !submitButton) {
    sendResponse({ match: false });
    return; 
  }

  // This line selects the label for the email input
  var emailLabel = document.querySelector(`label[for=${emailInput.id}]`);

  // This block checks if the label for the email input exists
  if (!emailLabel ) {
    sendResponse({ match: false });
    return;
  }

  // This line extracts the text of the label for the email input and removes any asterisks and whitespace
  var emailLabelText = emailLabel.textContent.replace("*", "").trim();

  // This block checks if the label for the email input matches the expected text
  console.log("passed lable",emailLabelText);
  if (emailLabelText != "Mobile phone number or email") {
    sendResponse({ match: false });
    return;
  }

  // This line sends a response to the background script indicating a successful match
  sendResponse({ match: true });
});