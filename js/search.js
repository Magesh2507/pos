
const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const searchHoldCustomer = document.getElementById("search-hold-customer");

// items input search
let suggestionClicked = false;
var query;
let previousLength = 0;
/*searchInput.addEventListener('input', (event) => {
    query = event.target.value.trim().toLowerCase();
    suggestionClicked = false;

    if (query.length === 2 && previousLength > 2) {
      clearSuggestions();
      categoryFilter(categoryListValue);
    }
    else if (query.length >= 3) {
      const suggestions = filterSuggestions(query);
    }
    previousLength = query.length;
});*/

searchInput.addEventListener('input', updateResults);

function updateResults(event) {
  query = event.target.value.trim().toLowerCase();
  suggestionClicked = false;

  if (query.length === 2 && previousLength > 2 || (query.length === 0 && previousLength > 2)) {
    clearSuggestions();
    categoryFilter(categoryListValue);
  }
  else if (query.length >= 3) {
    const suggestions = filterSuggestions(query);
  }
  previousLength = query.length;

}
/*searchInput.addEventListener('keydown', (event) => {
  const isDeleteKey = event.key === 'Delete' || event.key === 'Backspace';
  const isCutShortcut = (event.metaKey || event.ctrlKey) && event.key === 'x';

  if (isDeleteKey || isCutShortcut) {
    console.log("if")
    const inputField = document.getElementById('searchInput');
    console.log(inputField.value)
    // Delay the update to ensure the input value has changed after the delete/cut
    //if(inputField.value == ""){ console.log("clear")
    setTimeout(() => {
      clearSuggestions();
      categoryFilter(categoryListValue);
      //updateResults();
    }, 0);}
 // }
});*/


// get current category select to filter search products and display name and items
function filterSuggestions(query) {
  numberQuery = query;
  query = query.toLowerCase();
  currentPage = 1;
  loadershow();

  if (categoryListValue == "0") {
    filteredCriteria = `Item_name.contains(\"${query}\") || SKU.contains(\"${query}\")`; //SKU == \"${query}\"`;// 
    //console.log(filteredCriteria);
    filterQueryItems(filteredCriteria);
  }
  else {
    filteredCriteria = `${selectedCategory}  && Item_name.contains(\"${query}\") || SKU.contains(\"${query}\")`;
    filterQueryItems(filteredCriteria);
  }
}

// filter search products and display name and items
function filterQueryItems(filteredCriteria) {
  totalPage();
  updateCurrentPage();
  var allItemsFetch = {
    appName: "point-of-sales",
    reportName: "Items_Report",
    criteria: filteredCriteria,
    page: currentPage,
    pageSize: itemsPerPage
  }
  //console.log(allItemsFetch)
  ZOHO.CREATOR.API.getAllRecords(allItemsFetch).then(function (response) {
    if (response.code == 3000) {
      filteredItems = response.data;
      let filteredNames = filteredItems.filter(product => product.Item_name.toLowerCase().includes(query.toLowerCase())).map(product => product.Item_name);
      categoryItemsCount = filteredItems.length;
      totalPage();
      updateCurrentPage();
      if (!suggestionClicked) {
        displaySuggestions(filteredNames);
      }
      suggestionClicked = false;
      displayAll(filteredItems);
      // setTimeout(function() {
      //   loaderhide();
      // }, 1000);
      loaderhide();
    }
  })
    .catch(err => {
      // Check if the error is a 404 error before logging it
      //console.log(numberQuery)     

      if (err.status === 404 && isNaN(numberQuery)) {
        suggestionsContainer.innerHTML = '<div style="font-weight: bold">No results found</div>';
        const myTimeout = setTimeout(clearSuggestions, 3000);
      } else {
        console.error(err);
      }
      setTimeout(function () {
        loaderhide();
      }, 1000);
    })
}

// search related item names show to user
function displaySuggestions(suggestions) {
  suggestionsContainer.innerHTML = '';
  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('div');
    suggestionElement.textContent = suggestion;
    suggestionElement.addEventListener('click', () => {
      suggestionClicked = true;
      searchInput.value = suggestion;
      filterSuggestions(suggestion);
      clearSuggestions();
    });
    suggestionsContainer.appendChild(suggestionElement);
  });
}

function clearSuggestions() {
  suggestionsContainer.innerHTML = '';
}


let currentSuggestionIndex = -1;

// Add event listeners for keydown and keyup
searchInput.addEventListener('keydown', handleKeyDown);
searchInput.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
  // Handle the keydown event
  if (event.key === 'ArrowDown') {
    // Move down in the suggestion list
    highlightSuggestion(currentSuggestionIndex + 1);
    console.log("keydown")
  } else if (event.key === 'ArrowUp') {
    // Move up in the suggestion list
    console.log("keyup")
    highlightSuggestion(currentSuggestionIndex - 1);
  }
}

function handleKeyUp(event) {
  // Handle the keyup event
  if (event.key === 'Enter') {
    // Enter key pressed, handle selection
    if (currentSuggestionIndex >= 0) {
      // A suggestion is highlighted, select it
      selectSuggestion(currentSuggestionIndex);
    } else {
      // No suggestion highlighted, perform default search
      performSearch();
    }
  }
}

function highlightSuggestion(index) {
  const suggestionElements = suggestionsContainer.children;

  // Remove previous highlight
  if (currentSuggestionIndex >= 0) {
    suggestionElements[currentSuggestionIndex].classList.remove('highlighted');
  }

  // Update current index
  currentSuggestionIndex = (index + suggestionElements.length) % suggestionElements.length;

  // Add highlight to the new suggestion
  suggestionElements[currentSuggestionIndex].classList.add('highlighted');
}

function selectSuggestion(index) {
  const suggestionElements = suggestionsContainer.children;
  suggestionClicked = true;
  // Set input value to the selected suggestion
  searchInput.value = suggestionElements[index].textContent;
  filterSuggestions(suggestionElements[index].textContent)
  // Clear suggestions
  clearSuggestions();

  // Perform search or any other action you need
  performSearch();
}

// Modify your existing displaySuggestions function to include a class for styling purposes
function displaySuggestions(suggestions) {
  suggestionsContainer.innerHTML = '';
  suggestions.forEach((suggestion, index) => {
    const suggestionElement = document.createElement('div');
    suggestionElement.textContent = suggestion;
    suggestionElement.addEventListener('click', () => {
      suggestionClicked = true;
      searchInput.value = suggestion;
      filterSuggestions(suggestion);
      clearSuggestions();
    });
    suggestionsContainer.appendChild(suggestionElement);
  });
}

// Add a function to clear suggestions
function clearSuggestions() {
  const suggestionElements = suggestionsContainer.children;

  // Remove the 'highlighted' class from all suggestions
  for (let i = 0; i < suggestionElements.length; i++) {
    suggestionElements[i].classList.remove('highlighted');
  }

  // Clear the suggestion container
  suggestionsContainer.innerHTML = '';

  // Reset the current suggestion index
  currentSuggestionIndex = -1;
}




document.addEventListener("click", function (event) {
  clearSuggestions();
  if (!event.target.closest('.customerDetail')) {
    // Clear input values
    clearCustomerDetails();
  }
 
});




// Function to clear input values
function clearCustomerDetails() {
  customerInputId.value = "";
  customerdetailSelect();
  validationStyleSuccess(customerInputId, errSpan);

  // var customerDetail = document.querySelector('.customerDetail');
  // var inputFields = customerDetail.querySelectorAll('input');
  // for (var i = 0; i < inputFields.length; i++) {
  //   inputFields[i].value = '';
  // }
}



// hold customer script
const holdPopUp = document.getElementById("hold-main")
const posleftSide = document.querySelector(".left-side")
const showEmpty = document.getElementById("holdCustomerEmpty")

// recall button work to display holded customers
function recallCustomer() {
  posleftSide.style.display = "none";
  holdPopUp.style.display = "flex";
  var recallCustomers = {
    appName: "point-of-sales",
    reportName: "Holded_Customers"
  }

  ZOHO.CREATOR.API.getAllRecords(recallCustomers).then(function (response) {
    if (response.code == 3000) {
      showEmpty.style.display = "none";
      let holdedCustomers = response.data;
      //console.log(holdedCustomers)

      let holdedCustomersLength = response.data.length;
      if (holdedCustomersLength > 0) {

        var existingDataRows = holdCustomerTable.querySelectorAll("tr:not(:first-child)");
        existingDataRows.forEach(function (row) {
          row.remove();
        });

        holdedCustomers.forEach((holdedCustomer) => {
          const newRow = document.createElement("tr");
          newRow.classList.add("holdCustomer");
          newRow.innerHTML = `
            <td>${holdedCustomer.Customer_Name.display_value}</td>
            <td>${holdedCustomer.Customer_Name.ID}</td>
            <td><button type="button" id="${holdedCustomer.ID}" data-customer-id="${holdedCustomer.Customer_Name.ID}" onclick="removeHoldCustomer(this)" class="btn btn-success recall-btn" style="font-weight: 550;">Recall</button></td>
        `;
          holdCustomerTable.appendChild(newRow);
        })
        checkListEmpty()
      }
    }
    else {
      showEmpty.style.display = "flex";
    }
  })
    .catch(err => {
      showEmpty.style.display = "flex";
    })
}

//to close holded customer list div 
function closeHoldCustomer() {
  holdPopUp.style.display = "none";
  posleftSide.style.display = "flex";
  clearHoldCustomerSearch()
}

function clearHoldCustomerSearch() {
  searchHoldCustomer.value = "";
}

const holdCustomerEmptyDiv = document.getElementById("holdCustomerEmpty");
// check holded customers and if no show list empty
function checkListEmpty() {
  var tableRows = document.querySelectorAll("#holdCustomerTable tr:not(:first-child)");

  if (tableRows.length > 0) {
    holdCustomerEmptyDiv.style.display = "none";
  } else {
    holdCustomerEmptyDiv.style.display = "flex";
  }
}

function searchNoHoldCustomer() {
  var tableRows = document.querySelectorAll("#holdCustomerTable tr:not(:first-child)");
  var visibleRowFound = false;
  tableRows.forEach(function (row) {
    if (row.style.display !== "none") {
      visibleRowFound = true;
      return;
    }
  });

  if (visibleRowFound) {
    holdCustomerEmptyDiv.style.display = "none";
  } else {
    holdCustomerEmptyDiv.style.display = "flex";
    holdCustomerEmptyDiv.innerHTML = "<h2> Customer Not Found </h2>";
  }
}

const holdCustomerTable = document.getElementById("holdCustomerTable");

// hold customer when they added items to cart but not ordered
function holdCustomer() {
  const cartNotEmpty = checkUserCart(true);
  if (cartNotEmpty) {
    let formname = "Hold_and_Recall";
    currentUserCartUpdate(formname)
  }
}

function checkUserCart(check) {

  const customerDetail = document.getElementById("customerList");
  if (customerDetail.value === "Walk-in Customer" && !check) {
    if (productInCart.length > 0) {
      return new Promise((resolve, reject) => {

        if (Walk_in_Customer_ID === "") {
          const customerdata = {
            "data": {
              "Display_Name": "Walk-in Customer",
              "Mobile": orgMobileNumber,
              "Email": orgEmailId
            }
          }
          let config = {
            appName: "point-of-sales",
            formName: "Customers",
            data: customerdata
          }

          ZOHO.CREATOR.API.addRecord(config).then(function (response) {
            //console.log(response)
            if (response.code == 3000) {
              Walk_in_Customer_ID = response.data.ID;
              loggedUserId = response.data.ID;
            }
          })
            .then(function () {
              const formData = {
                "data": {
                  "Walk_in_Customer_ID1": Walk_in_Customer_ID
                }
              }
              var walkInCustomerUpdate = {
                appName: "point-of-sales",
                reportName: "pos_preferences_report",
                id: PosPreferanceRecId,
                data: formData
              }

              ZOHO.CREATOR.API.updateRecord(walkInCustomerUpdate).then(function (response) {
                //console.log(response);
                resolve(true)
              }).catch((err) => {
                console.log(err)
                reject(false)
              })
            })
            .catch(function (error) {
              console.log(error)
              reject(false)
            })
        }
        else {
          loggedUserId = Walk_in_Customer_ID;
          resolve(true)
        }
      })
    }

    else {
      showMessage("Your cart is empty! Add some products in cart", "error", 3000);
      return false;
    }
  }
  else if (loggedUserId !== "" && loggedUserId !== undefined && loggedUserId !== null) {
    if (productInCart.length > 0) {
      return true;
    }
    else {
      showMessage("Your cart is empty! Add some products in cart", "error", 3000);
      return false;
    }
  }
  else {
    showMessage("Please select a customer", "error", 3000);
    return false;
  }
}

// store current user added cart items to SO or Hold //local storage
function currentUserCartUpdate(formname) {
  pushCartItems(formname)
}

//show success against SO or HOLD
function successMessage(formname) {
  if (formname === "Orders") {
    showMessage("Sales Order created Successfully", "success", 5000);
  }
  if (formname === "Hold_and_Recall") {
    productInCart.length = 0;
    //localStorage.setItem("shoppingCart", JSON.stringify(productInCart));
    updateShoppingCartHtml();
    customerdetailSelect();
    loggedUserId = undefined;
    customerIdDipslay()
    showMessage("Your cart items are holded", "neutral", 5000);
  }
}

// remove hold customer from list when they click recall button
holdCustomerTable.addEventListener('click', function (event) {

  if (event.target.classList.contains('recall-btn')) {
    const row = event.target.closest('.holdCustomer');
    if (row) {
      row.remove();
    }
  }
});

// recall customer and show their cart products in UI
function removeHoldCustomer(recallButton) {
  const holdedId = recallButton.id; //holded time generated ID
  const customerNameId = recallButton.getAttribute("data-customer-id"); // customer logged id
  productInCart.length = 0;
  // get holded customer with line items
  var config = {
    appName: "point-of-sales",
    reportName: "Holded_Customers",
    id: holdedId
  }

  //get specific holded customer with line items record API
  ZOHO.CREATOR.API.getRecordById(config).then(function (response) {
    //console.log(response.data);
    let cartItems = response.data.Line_Items;

    cartItems.forEach((cartItem) => {
      //particular holded customer's line items seperate by each record id
      var config = {
        appName: "point-of-sales",
        reportName: "Order_Line_Items_Report",
        id: cartItem.ID
      }

      //get specific record API each item details
      ZOHO.CREATOR.API.getRecordById(config).then(function (response) {
        var itemId = response.data.Item_Name.ID;
        var itemQty = parseInt(response.data.Quantity.split(".")[0]);
        addtoCart(itemId, itemQty)
      })
    })
  })

  var recordId = `ID  == ${holdedId}`;
  var config = {
    appName: "point-of-sales",
    reportName: "Holded_Customers",
    criteria: recordId
  }

  ZOHO.CREATOR.API.deleteRecord(config).then(function (response) {
    //console.log(response);
  })
    .then(response => {

      var config = {
        appName: "point-of-sales",
        reportName: "Customers_Report",
        criteria: `ID == ${customerNameId}`
      }

      ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {

        //console.log(response);
        if (response.code == 3000) {
          filteredCustomer = response.data;
          customerdetailsDisplay(filteredCustomer)
        }
        else {
          const errorMessage = "No data found";
          //console.log(errorMessage);
        }
      })
        .catch(err => {
          console.log(err)
        });
    })
    .catch(err => {
      console.log(err)
    });

  updateShoppingCartHtml();
  closeHoldCustomer()
}


function holdCustomerSearch() {
  var filter, tr, td, i, txtValue;
  filter = searchHoldCustomer.value.toUpperCase();
  tr = holdCustomerTable.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  searchNoHoldCustomer(); // Call checkListEmpty after the loop completes
}


// alert message script
function showMessage(message, colorClass, time) {
  const messageDiv = $("#message");
  messageDiv.text(message).removeClass().addClass("message " + colorClass).fadeIn();
  messageDiv.css("top", "-50px");
  messageDiv.animate({ opacity: 1, top: "0px" }, 500, "swing");
  setTimeout(() => {
    messageDiv.animate({ opacity: 0, top: "-50px" }, 500, "swing");
  }, time);
}

function refreshCartPage() {
  window.location.reload(true)
}

// Add a click event listener to the document body
document.body.addEventListener("click", function (event) {

  // Check if the clicked element is not the search input
  if (event.target !== searchHoldCustomer) {
    // searchHoldCustomer.value = ""; // Clear the input value
    // holdCustomerSearch(); // Trigger the search function
    clearHoldCustomerSearch()
  }
});

function showPopup() {
  // Function to show the popup
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup-success").style.display = "block";
  // Trigger a reflow to enable the transition
  document.getElementById("popup-success").offsetHeight;

  // Apply fade-in effect
  document.getElementById("popup-success").style.opacity = 1;
}

// Function to close the popup
function closePopupSuccess() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popup-success").style.display = "none";
}