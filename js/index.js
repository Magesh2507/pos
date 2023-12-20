var categoryList = document.getElementById('categoryList')
let customerInputId = document.getElementById("customerInput")
const customerDetail = document.getElementById("customerList")
const countryCode = document.getElementById("phone")
var dob = document.getElementById("datepicker")
let errSpan = document.getElementById('errmessage')
var customerDiv = document.getElementById('customerDiv');


// append additional items in UI  
let loading = false;

function getAllItems(totalQuantity, selectedCategory) {
  if (loading) return;
  loading = true;

  //get all items records 
  if (totalQuantity > 0) {
    const page_number = currentPage;
    const pageSize = itemsPerPage;

    var allItemsFetch = {
      appName: "point-of-sales",
      reportName: "Items_Report",
      criteria: selectedCategory,
      page: page_number,
      pageSize: pageSize
    }

    ZOHO.CREATOR.API.getAllRecords(allItemsFetch).then(function (response) {
      let itemdetail = response.data;
      filteredItems = itemdetail
      displayAll(itemdetail)
      setTimeout(function () {
        loaderhide();
        loading = false;
      }, 1000);
    });
  }
  else {
    showMessage("No data found", "error", 2000);
    loading = false
  }
}



//Add all items list from cart to sales order

const addCartDetailsBtn = document.querySelector(".proceed-btn");//(".payment-btn");
addCartDetailsBtn.addEventListener("click", async function () {
  try {
    const cartNotEmpty = await checkUserCart(false);
    if (cartNotEmpty) {
      let formname = "Orders";
      currentUserCartUpdate(formname)
    }
  } catch (error) {
    console.error("Error:", error);
  }
});



//Add all items list from cart to sales order or hold recall form
function pushCartItems(formname) {
  let lineItems = [];
  productInCart.forEach((product, index) => {

    let indItems = {
      "Item_Name": product.id,
      "Unit": product.unit,
      "Rate": product.product_price,
      "Quantity": product.count,
      "Tax": product.tax_ID.ID,
      "Tax_Amount": Number(product.tax_amount_total).toFixed(2),
      "Amount_with_tax": (Number(product.selling_price) + Number(product.tax_amount_total)).toFixed(2),
      "Amount_without_tax": product.selling_price,
      "Total_Cost": product.Cost_price * product.count,
      "S_No": index + 1
    }
    lineItems.push(indItems)
  })
  let total_amount = Number(countTheSumPrice()) + Number(countTheTaxAmount())
  const formdata = {
    "data": {
      "Customer_Name": loggedUserId,
      "Order_date": currentDate,
      "Line_Items": lineItems,
      "Sub_total": Number(countTheSumPrice()).toFixed(2),
      "Tax_Amount": Number(countTheTaxAmount()).toFixed(2),
      "Adjustment": (Math.round(total_amount) - total_amount).toFixed(2),
      "Paid_Amount": "000",
      "Total": Math.round(total_amount),
      "Balance_Amount": "0.00",
      "Total_cost_price": countTheTotalCostAmount(),
      "Total_profit": (countTheSumPrice() - countTheTotalCostAmount()).toFixed(2)
    }
  }

  const addCartDetails = {
    appName: "point-of-sales",
    formName: formname,
    data: formdata
  }
  //console.log(addCartDetails)
  ZOHO.CREATOR.API.addRecord(addCartDetails).then(function (response) {
    // console.log(response)
    if (response.code == 3000) {
      let salesId = response.data.ID

      if (formname === "Orders") {
        const formdata = {
          "data": {
            "Customers_Name": loggedUserId,
            "Payment_Date": currentDate,
            "Payment_Mode": "Cash",
            "Reference_Orders": [salesId]
          }
        }

        const addCartDetails = {
          appName: "point-of-sales",
          formName: "Payments_Received",
          data: formdata
        }


        ZOHO.CREATOR.API.addRecord(addCartDetails).then(function (response) {
          // console.log(response)
          successMessage(formname)
          /*setTimeout(function() {
            var fullWidth = window.screen.width;
            var halfwidth = fullWidth/2;
            var leftStart = fullWidth/4;
            var fullHeight = window.screen.height;
            // Redirect to the specified URL in a new tab
            //window.open(`https://creatorapp.zoho.in/senthuraa86/point-of-sales/record-print/Orders_Report/${salesId}`, "_blank");
            window.open(`https://creatorapp.zoho.in/senthuraa86/point-of-sales/record-print/Orders_Report/${salesId}`, "popup", "width=" + halfwidth + ",height=" + fullHeight + ",left=" + leftStart);
        }, 2000); // 2000 milliseconds (2 seconds) delay f*/
        })
          .catch(function (err) {
            console.log(err)
          })
      }
      else {
        successMessage(formname)
      }
    }
    else {
      showMessage("Somthing went wrong", "error", 3000)
    }
  });
}

// loader show
function loadershow() {
  document.getElementById("loader-div").style.display = "flex";
  document.getElementById("data").style.display = "none";
}

// loader hide
function loaderhide() {
  document.getElementById("data").style.display = "grid";
  document.getElementById("loader-div").style.display = "none";
  scrollBarPosition()
}

// display items
function displayAll(itemsData) {
  const dataElement = document.getElementById("data");
  dataElement.innerHTML = "";
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // let dataToDisplay = itemsData.slice(startIndex, endIndex);
  // displayItems = dataToDisplay.length;
  let sortedItems = itemsData.sort((a, b) => b.Available_Quantity - a.Available_Quantity);
  insertItems(dataElement, sortedItems)
}

// implemented out of stock
function insertItems(dataElement, dataToDisplay) {
  dataToDisplay.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "card";
    itemElement.id = item.ID;

    const image = document.createElement("img");
    image.id = item.ID;
    var imageURL = item.Product_image;
    ZOHO.CREATOR.UTIL.setImageData(image, imageURL);
    image.onerror = function () {
      this.src = "../images/no-image.png";
    };

    // Set the alt attribute for the image
    /*image.alt = item.Item_name;*/

    const head = document.createElement("h4");
    //head.className = "truncate-text";
    head.innerText = item.Item_name;

    // Check if the item is out of stock
    if (item.Stock_on_Hand === "" || item.Stock_on_Hand === "0.00") {
      const outOfStockImage = document.createElement("img");
      outOfStockImage.className = "out-of-stock-image";
      outOfStockImage.src = "../images/out-of-stock-image.png"; // Replace with your out of stock image path
      itemElement.appendChild(outOfStockImage);

      // Add a class to make the card unclickable
      itemElement.classList.add("out-of-stock");
    } else {
      itemElement.setAttribute("onclick", "addtoCart(this.id)");
    }

    dataElement.appendChild(itemElement);
    itemElement.appendChild(image);
    itemElement.appendChild(head);
  });
}

// Run this code after the page is fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//   // Get all elements with the class 'truncate-text'
//   const truncateElements = document.querySelectorAll('.truncate-text');

//   // Loop through each element and set its title attribute
//   truncateElements.forEach(function(element) {
//       element.title = element.textContent;
//   });
// });

// get sku details
function getSKU(barcode) {
  //console.log(typeof barcode)
  const skuCriteria = `SKU == \"${barcode}\"`;//\"${mobileNumber}\"
  //console.log(skuCriteria)
  var allItemsFetch = {
    appName: "point-of-sales",
    reportName: "Items_Report",
    criteria: skuCriteria
  }
  //console.log(allItemsFetch)
  ZOHO.CREATOR.API.getAllRecords(allItemsFetch).then(function (response) {
    //console.log(response)
    if (response.code == 3000) {
      //console.log(response.data[0].ID) 
      const fetchedId = response.data[0].ID;
      addtoCart(fetchedId)
    }
  }).catch((err) => {
    console.log(err)
  })
}

//Get Clicked product details and add to cart
function addtoCart(id, count = 1) {
  var config = {
    appName: "point-of-sales",
    reportName: "Items_Report",
    id: id
  }

  //get specific record API
  ZOHO.CREATOR.API.getRecordById(config).then(function (response) {

    const fetchItem = response.data;

    let tax;
    if (fetchItem.Tax_preference === "Non-taxable" || fetchItem.Intrastate_Tax_Rate === "GST0" || fetchItem.Intrastate_Tax_Rate === "") {
      tax = "GST0";
    }
    else {
      tax = fetchItem.Intrastate_Tax_Rate.display_value;
    }

    var numberString = tax.replace("GST", "");
    var taxPercentage = parseFloat(numberString);


    let product = {
      id: fetchItem.ID,
      productName: fetchItem.Item_name,
      Cost_price: Number(fetchItem.Cost_price),//base
      Cost_price_Total: Number(fetchItem.Cost_price) * count,
      selling_price: Number(fetchItem.selling_price) * count,//with Qty
      product_price: Number(fetchItem.selling_price),//base
      tax: tax,// to be check
      count: count,
      customer_name: loggedUserId, //for name id passed
      order_date: currentDate,
      unit: fetchItem.Unit.ID,
      rate: fetchItem.Item_name,
      tax_ID: fetchItem.Intrastate_Tax_Rate,
      taxInpercentage: Number(taxPercentage),
      tax_amount: Number(calculatePercentage(Number(fetchItem.selling_price), Number(taxPercentage))),
      tax_amount_total: Number(calculatePercentage(Number(fetchItem.selling_price) * count, Number(taxPercentage)))
    }
    updateProductInCart(product);
    updateShoppingCartHtml();
  })
}


// Calculate the percentage
function calculatePercentage(number, percentage) {
  const result = (number * percentage) / 100;
  return result.toFixed(2);
}

function totalPage() {
  totalPages = Math.ceil(categoryItemsCount / itemsPerPage);
}

//categorywise display
/*categoryList.addEventListener("change", (e) => {
  categoryListValue = categoryList.value;
  categoryFilter(categoryListValue);
  clearItemSearch()
})*/


categoryList.addEventListener("change", categoryListChange)

function categoryListChange() {
  categoryListValue = categoryList.value;
  categoryFilter(categoryListValue);
  clearItemSearch()
}

function clearItemSearch() {
  document.getElementById('searchInput').value = "";
}

function categoryFilter(categoryListValue) {

  if (categoryListValue == "0") {
    currentPage = 1;
    selectedCategory = "";
    loadershow()
    // get stationary items count
    var getItemsCount = {
      appName: "point-of-sales",
      reportName: "Items_Report"
    }

    ZOHO.CREATOR.API.getRecordCount(getItemsCount).then(function (response) {

      categoryItemsCount = Number(response.result.records_count);
      totalPage()
      updateCurrentPage()
      getAllItems(categoryItemsCount, selectedCategory)
    })
  }
  else {
    currentPage = 1;
    selectedCategory = `Category == ${categoryListValue}`;
    // get stationary items count
    loadershow()
    var getItemsCount = {
      appName: "point-of-sales",
      reportName: "Items_Report",
      criteria: selectedCategory
    }

    ZOHO.CREATOR.API.getRecordCount(getItemsCount).then(function (response) {

      categoryItemsCount = Number(response.result.records_count);
      totalPage()
      updateCurrentPage()
      getAllItems(categoryItemsCount, selectedCategory)
    })
  }
}

//Pagination 
function updateCurrentPage() {
  const pageLink = document.getElementById("current-page");
  pageLink.textContent = "";
  pageLink.textContent = ` ${currentPage} - ${totalPages}`;
  pageLink.classList.add("activate");
}

//previous page button function
const previous = document.getElementById("previous-btn")

previous.addEventListener("click", () => {

  if (currentPage > 1) {
    clearItemSearch()
    currentPage--;
    updateCurrentPage()
    loadershow()
    getAllItems(categoryItemsCount, selectedCategory)
  }
})

// scroll to top
function scrollBarPosition() {
  document.getElementById("data").scrollTo({ top: 0, behavior: "smooth" });
}
//next page button function
const next = document.getElementById("next-btn")

next.addEventListener("click", () => {
  if (loading) return;
  if (currentPage != totalPages) {
    clearItemSearch()
    currentPage++;
    updateCurrentPage()
    loadershow()
    getAllItems(categoryItemsCount, selectedCategory)
  }
  else {
    showMessage("Maximum reached", "error", 2000);
  }
})

function total() {
  const total = document.getElementById("total");
  total.style.display = "none";
  const totalRefresh = document.getElementById("total-refresh");
  totalRefresh.style.visibility = "hidden";
  const loaderSpan = document.getElementById("loader-span");
  loaderSpan.style.setProperty('display', 'inline-block', 'important');
  const timeOut = setTimeout(totalTimeOut, 1000)
}

function totalTimeOut() {
  var getItemsCount = {
    appName: "point-of-sales",
    reportName: "Items_Report"
  }

  ZOHO.CREATOR.API.getRecordCount(getItemsCount).then(function (response) {

    totalItemsCount = Number(response.result.records_count);
    const loaderSpan = document.getElementById("loader-span");
    const total = document.getElementById("total");
    total.innerText = totalItemsCount;
    total.style.cursor = "auto";
    loaderSpan.style.setProperty('display', 'none', 'important');
    total.style.display = "inline";
    const totalRefresh = document.getElementById("total-refresh");
    totalRefresh.style.visibility = "visible";
  })
}


function changeItemsperPage() {
  const perpageItems = document.getElementById("show-perpage")
  if (itemsPerPage != Number(perpageItems.value)) {
    itemsPerPage = Number(perpageItems.value)
    currentPage = 1;
    //clearItemSearch()
    //totalPage()
    //updateCurrentPage()
    //loadershow()
    //getAllItems(categoryItemsCount, selectedCategory);
    categoryListChange()
  }
}

// customer input search when type
customerInputId.addEventListener("keypress", (event) => {
  customerDiv.addEventListener('click', function () {
    if(customerInputId.value.trim() !== ""){
    document.getElementById("customerSearch").click();
    }
  });

  if (customerDetail.value === "Customer ID" || customerDetail.value === "Mobile") {
    checkNonNumeric(customerInputId);
  } else {
    removeListener(customerInputId);
  }
  if (event.keyCode === 13) {
    document.getElementById("customerSearch").click();
  }
  else if (customerDetail.value === "Mobile") {
    if (customerInputId.value.trim() !== "") {
      validationStyleSuccess(customerInputId, errSpan, countryCode)
    }
  }
  else if (customerDetail.value === "Name & DOB") {
    if (customerInputId.value.trim() !== "") {
      validationStyleSuccess(customerInputId, errSpan, dob)
    }
  }
  else {
    if (customerInputId.value.trim() !== "") {
      validationStyleSuccess(customerInputId, errSpan)
    }
  }
})

// customer search
function customerSearch() {
  // const customerDetail = document.getElementById("customerList");
  // const countryCode = document.getElementById("phone")
  // var dob = document.getElementById("datepicker")
  // let errSpan = document.getElementById('errmessage')
  if (customerInputId.value.trim() !== "") {
    let cId, email, name, Dob, isValid, selectedCustomerCategory, errorText;

    switch (customerDetail.value) {

      case "Customer ID":
        cId = customerInputId.value.toUpperCase();
        errorText = "Enter Valid Customer ID";
        isValid = validation(customerInputId.value == "", customerInputId, errSpan, errorText)
        if (isValid) {
          selectedCustomerCategory = `ID == ${cId}`;

          getCustomerbyId(selectedCustomerCategory)
            .then(function (data) {
              //console.log(data);          
              if (data.error) {
                customerIdDipslay()
                validationStyleErr(customerInputId, errSpan, errorText)
                loggedUserId = undefined;
              }
              else {
                filteredCustomer = data;
                //showMessage("Logged In Successfully", "success", 2000);
                customerdetailsDisplay(filteredCustomer)
              }
            })
        }
        break;

      case "Mobile":
        let mobileNumber = countryCode.value + customerInputId.value;
        if (customerInputId.value.trim().length === 10) {
          errorText = "Enter valid Mobile Number";
        }
        else {
          errorText = "Enter 10 digit Mobile Number";
        }
        isValid = validation(countryCode.value == "" || customerInputId.value == "", customerInputId, errSpan, errorText, countryCode, mobileNumber)
        if (isValid) {
          selectedCustomerCategory = `Mobile == \"${mobileNumber}\"`;
          getCustomerbyId(selectedCustomerCategory)
            .then(function (data) {
              //console.log(data);          
              if (data.error) {
                customerIdDipslay()
                validationStyleErr(customerInputId, errSpan, errorText, countryCode)
                loggedUserId = undefined;
              }
              else {
                filteredCustomer = data;
                //showMessage("Logged In Successfully", "success", 2000);
                customerdetailsDisplay(filteredCustomer)
              }
            })
        }
        break;

      case "Name & DOB":
        name = customerInputId.value;
        Dob = dob.value;
        errorText = "Enter Valid Name & DOB";
        isValid = validation(dob.value == "" || customerInputId.value == "", customerInputId, errSpan, errorText, dob)
        if (isValid) {
          selectedCustomerCategory = `Display_Name == \"${name}\"`;
          getCustomerbyId(selectedCustomerCategory)
            .then(function (data) {

              //console.log(data);          
              if (data.error) {
                customerIdDipslay()
                validationStyleErr(customerInputId, errSpan, errorText, dob)
                loggedUserId = undefined;
              }
              else {
                filteredCustomer = data;
                //showMessage("Logged In Successfully", "success", 2000);
                customerdetailsDisplay(filteredCustomer)
              }
            })
        }
        break;

      case "Email":
        email = customerInputId.value.toLowerCase();
        errorText = "Enter valid Email Id";
        const regEx = /^([a-zA-Z0-9-_\.]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2,10})(\.[a-zA-Z]{2,8})?$/
        isValid = validation(!regEx.test(customerInputId.value), customerInputId, errSpan, errorText)
        if (isValid) {
          selectedCustomerCategory = `Email == \"${email}\"`;
          getCustomerbyId(selectedCustomerCategory)
            .then(function (data) {
              //console.log(data);
              if (data.error) {
                customerIdDipslay()
                validationStyleErr(customerInputId, errSpan, errorText)
                loggedUserId = undefined;
              }
              else {
                filteredCustomer = data;
                //showMessage("Logged In Successfully", "success", 2000);
                customerdetailsDisplay(filteredCustomer)
              }
            })
        }
        break;
    }
  }
}

function customerIdDipslay() {
  document.querySelector(".emptyDiv").style.display = "flex";
  document.querySelector(".customerdata").style.display = "none";
}

function validation(condition, inputId, errSpan, message, inputId1) {

  if (condition) {
    customerIdDipslay()
    validationStyleErr(inputId, errSpan, message, inputId1)
    return false
  }

  else {
    validationStyleSuccess(inputId, errSpan, inputId1)
    return true
  }
}

function validationStyleErr(inputId, errSpan, message, inputId1) {
  if (inputId1) {
    inputId1.style.borderColor = "red";
    errSpan.style.color = "red";
    inputId.style.borderColor = "red";
    errSpan.innerText = message;
  }

  else {
    errSpan.style.color = "red";
    inputId.style.borderColor = "red";
    errSpan.innerText = message;
  }
}

function validationStyleSuccess(inputId, errSpan, inputId1) {
  if (inputId1) {
    errSpan.innerText = "";
    inputId1.style.borderColor = "#d9d5d5";
    inputId.style.borderColor = "#d9d5d5";
  }
  else {
    errSpan.innerText = "";
    inputId.style.borderColor = "#d9d5d5";
  }
}

function getCustomerbyId(value) {

  return new Promise((resolve, reject) => {

    var config = {
      appName: "point-of-sales",
      reportName: "Customers_Report",
      criteria: value
    }
    //console.log(value)
    //console.log(config)
    ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {

      //console.log(response);
      if (response.code == 3000) {
        resolve(response.data);
      }
      else {
        const errorMessage = "No data found";
        resolve({ error: errorMessage });
      }
    }).catch(error => {
      //console.log(error);

      const errorMessage = "An error occurred";
      resolve({ error: errorMessage });
    })
  })
}