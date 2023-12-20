
// const customerAddBtn = document.querySelector(".customer-add-btn");
//  const closeBtn = document.querySelector(".close-btn");
//  const blur = document.querySelector(".blur");

// closeBtn.addEventListener("click",(e) => {
//   document.querySelector(".popup").style.display = "none";
//   blur.classList.remove("active")
// })
const CustomerDetailsHidden = document.getElementById('customerDetailsHidden')
function toggle() {
  blur.classList.add("active");
  document.querySelector(".popup").style.display = "block";
}

// customer details (id,name) display near to search
function customerdetailsDisplay(filteredCustomer) {
  //console.log(filteredCustomer)

  document.querySelector(".emptyDiv").style.display = "none";
  document.querySelector(".customerdata").style.display = "flex";

  const userDetail = document.querySelector(".userDetail");
  userDetail.style.fontWeight = "600";
  userDetail.innerHTML = "";

  const nameSpan = document.createElement("span");
  nameSpan.textContent = filteredCustomer[0].Display_Name;
  currentUserName = filteredCustomer[0].Display_Name;

  nameSpan.style.color = "#080beb";
  nameSpan.style.fontWeight = "600";

  const idSpan = document.createElement("span");
  idSpan.textContent = filteredCustomer[0].Mobile;//filteredCustomer[0].ID.slice(-5);
  loggedUserId = filteredCustomer[0].ID;
  currentUserId = filteredCustomer[0].Customer_ID;
  idSpan.style.color = "#080beb";
  idSpan.style.fontWeight = "600";

  const nameDiv = document.createElement("div");
  nameDiv.innerHTML = "Name : &nbsp;";
  nameDiv.appendChild(document.createTextNode(" "));
  nameDiv.appendChild(nameSpan);
  const mobDiv = document.createElement("div");
  mobDiv.innerHTML += "&nbsp; &nbsp; Mobile : &nbsp;";
  mobDiv.appendChild(document.createTextNode(" "));
  mobDiv.appendChild(idSpan);
  userDetail.appendChild(nameDiv);
  userDetail.appendChild(mobDiv);

  CustomerDetailsHidden.style.width = "0px";

  CustomerDetailsHidden.innerHTML = ` 
<div  style = "display: flex; flex-direction: row; text-align: center; padding: 10px 20px 10px 20px; text-align: center;justify-content: space-between; background: #eae8ee; color: #333">
  <h4 style="font-weight: 600; color: #333; text-align: center">Customer Details</h4> 
  <span>
    <span class="glyphicon" style ="font-size : 16px; margin: 10px; cursor: pointer; " onclick = "editCustomerDetail(this)" id = "${filteredCustomer[0].ID}">&#xe065;</span>
    <span class="glyphicon glyphicon-remove" style ="font-size : 16px; cursor: pointer; " onclick = "closeCustomerDetail()"></span>
  </span>
</div>
<div style = "display:flex; width:100%;">
<table style = "margin-left: 20px;" class="user-table" id="customerTable">
    <tr>
      <td>Name</td>
      <td>
        <input type="text" autocomplete="off" name="name" id="nc-name" value = "${filteredCustomer[0].Display_Name}" oninput="removeError('nc-name', 'nameError')" disabled>
        <small class="error-message" id="nameError"></small>
      </td>   
    </tr>
    <tr>
      <td>Email</td>
      <td>
        <input type="email" autocomplete="off" name="email" id="nc-email" value = "${filteredCustomer[0].Email}" oninput="removeError('nc-email', 'emailError')" disabled>
        <small class="error-message" id="emailError"></small>
      </td>
    </tr>
    <tr>
      <td>Mobile</td>
      <td>
        <div classname="mob-parent" style="display: flex; width:100%">
        <!--<input autocomplete="off" type="tel"  id="nc-mobile" class="input-field"  name="mobile" value = "">-->
            <input type="tel" autocomplete="off" name="mobile" id="mobilePhone" value="${filteredCustomer[0].Country_Code}" style="padding: 5px 5px 5px 50px; width : 90px; max-width : 100px;"/>
            <input autocomplete="off" type="text" name="mobile_number" id="mobInput" class="mob-input" value = "${filteredCustomer[0].Mobile.substring(filteredCustomer[0].Country_Code.length)}" oninput="removeError('mobInput', 'mobileError','mobilePhone')" disabled>
        </div>      
        <small class="error-message" id="mobileError"></small>
      </td>
    </tr>
    <tr>
      <td>Address Line 1</td>
      <td><input autocomplete="off" type="text" name="address_line_1" value= "${filteredCustomer[0].Address}" disabled></td>
    </tr>
    <tr>
      <td>Address Line 2</td>
      <td><input autocomplete="off" type="text" name="address_line_2" value= "${filteredCustomer[0].Address_Line_21}" disabled></td>
    </tr>
    <tr>
      <td>City</td>
      <td><input autocomplete="off" type="text" name="city" value= "${filteredCustomer[0].City1}" disabled></td>
    </tr>
    <tr>
      <td>State / Provinces</td>
      <td>
        <select class="allStates" id="allStates" name="state_provinces" disabled>
          <option value="${filteredCustomer[0].State_Provinces_1.ID ? filteredCustomer[0].State_Provinces_1.ID : ''}" selected> 
            ${filteredCustomer[0].State_Provinces_1.display_value ? filteredCustomer[0].State_Provinces_1.display_value : ''}
          </option>
        </select>      
      </td>
    </tr>
    <tr>
      <td>Country</td>
      <td>
        <select class="allCountries" id="allCountries" name="country" onchange="countrySelect(this)" disabled>
          <option value="${filteredCustomer[0].Country_1.ID ? filteredCustomer[0].Country_1.ID : ""}" selected>
            ${filteredCustomer[0].Country_1.display_value ? filteredCustomer[0].Country_1.display_value : ""}
          </option>
        </select>       
      </td>
    </tr>
    <tr>
      <td>Postal Code</td>
      <td><input autocomplete="off" type="text" name="postal_code" value= "${filteredCustomer[0].Postal_Code1}" disabled></td>
    </tr>
    <tr>
      <td>Company/Organization</td>
      <td> <input autocomplete="off" type="text" name="company_organization" value = "${filteredCustomer[0].Company_Organization}" disabled></td>
    </tr>
</table>
</div>
<center>
  <button type="button" id="submitButton" onclick= "submitDetails('${filteredCustomer[0].ID}')" class="btn btn-primary btn-sm" style = "visibility: hidden; margin: 10px; padding: 5px 15px; font-weight: 600;">Submit</button>
  <button type="button" id="cancelButton" onclick = "closeCustomerDetail()" class="btn btn-default" style = "visibility: hidden; margin: 10px; padding: 5px 15px;">Cancel</button>
</center>
`
  countrycode("mobilePhone")
  document.querySelectorAll(".iti")[1].style.pointerEvents = "none";
  focusInputs()
}

function focusInputs() {
  // const id1 = document.getElementById("mobInput");
  // const id2 = document.getElementById("mobilePhone");

  // // Add focus event listener to id1
  // id1.addEventListener("focus", () => {
  //   id2.focus();
  // });

  // // Add blur event listener to id1
  // id1.addEventListener("blur", () => {
  //   id2.blur();
  // });
}

// form to new customer
function customertableShow() {
  //customerdetailSelect()

  CustomerDetailsHidden.style.width = "0px";

  CustomerDetailsHidden.innerHTML = ` 
<div  style = "display: flex; flex-direction: row; align-items: center; padding: 10px 20px 10px 20px; text-align: center;
justify-content: space-between; background: #eae8ee; color: #333">
  <h4 style="font-weight: 600; color: #333; text-align: center">Add New Customer</h4>
  <span class="glyphicon glyphicon-remove" style ="font-size : 16px; cursor: pointer; " onclick = "closeCustomerDetail()"></span>
</div>
<div style = "display:flex; width:100%;">
<table style = "margin-left: 20px;" class="user-table" id="customerTable">
    <tr>
      <td>Name<span style="
      color: red;
      font-size: 20px;
      ">&nbsp*</span></td>
      <td>        
        <input autocomplete="off" type="text" id="nc-name" class="input-field" name="name" value = "" oninput="removeError('nc-name', 'nameError')">
        <small class="error-message" id="nameError"></small>
      </td>
    </tr>
    <tr>
      <td>Email<span style="
      color: red;
      font-size: 20px;
      ">&nbsp*</span></td>
      <td>
        <input autocomplete="off" type="email"  id="nc-email" class="input-field" name="email" value = "" oninput="removeError('nc-email', 'emailError')">
        <small class="error-message" id="emailError"></small>
      </td>
    </tr>
    <tr>
      <td>Mobile<span style="
      color: red;
      font-size: 20px;
      ">&nbsp*</span></td>
      <td>
        <div classname="mob-parent" style="display: flex; width:100%">
          <input type="tel" autocomplete="off" name="mobile" id="mobilePhone" value="+91" style="padding: 5px 5px 5px 50px; width : 90px; max-width : 100px;"/>
          <input autocomplete="off" type="text" name="mobile_number" id="mobInput" class="mob-input" value= "" oninput="removeError('mobInput', 'mobileError','mobilePhone')">
        </div>
        <small class="error-message" id="mobileError"></small>
      </td>
    </tr>
    <tr>
      <td>Address Line 1</td>
      <td><input autocomplete="off" type="text" name="address_line_1" value= "" ></td>
    </tr>
    <tr>
      <td>Address Line 2</td>
      <td><input autocomplete="off" type="text" name="address_line_2" value= "" ></td>
    </tr>
    <tr>
      <td>City</td>
      <td><input autocomplete="off" type="text" name="city" value= "" ></td>
    </tr>
    <tr>
      <td>State / Provinces</td>
      <td>
        <select id="allStates" class="allStates" name="state_provinces">
        </select>        
      </td>
    </tr>
    <tr>
      <td>Country</td>
      <td>
        <select id="allCountries" class="allCountries" name="country" onchange="countrySelect(this)">
        </select>        
      </td>
    </tr>
    <tr>
      <td>Postal Code</td>
      <td><input autocomplete="off" type="text" name="postal_code" value= "" ></td>
    </tr>
    <tr>
      <td>Company/Organization</td>
      <td> <input autocomplete="off" type="text" name="company_organization" value = ""></td>
    </tr>
</table>
</div>
<center>
  <button type="button" id="submitButton" onclick= "submitDetails()" class="btn btn-primary btn-sm" style = "margin: 10px; padding: 5px 15px; font-weight: 600;">Submit</button>
  <button type="button" id="cancelButton" onclick = "closeCustomerDetail()" class="btn btn-default" style = "margin: 10px; padding: 5px 15px;">Cancel</button>
</center>
`
  countrycode("mobilePhone")
  let countryV = defaultCountySelected;
  let stateV = defaultStateSelected;
  addCountries(countryV, stateV);
  //addCountries();
  showCustomerDetail()
  bgcCustomerDetail()
  focusInputs()
  const input = document.getElementById("mobInput");
  checkNonNumeric(input);
}
//countrycode selection in an input mob field
function countrycode(mobId) {
  var inpmob = document.getElementById(mobId);
  window.intlTelInput(inpmob, {});
  document.querySelectorAll(".iti")[1].style.display = "inline-block";
}

//submit popupform
function submit() {
  showMessage("Registered successfully!", "success", 3000);
}

// show customer details
function showCustomerDetail() {
  addbgc()
  CustomerDetailsHidden.style.width = "39.5%";//my
  CustomerDetailsHidden.style.right = "-1px";//my
  // CustomerDetailsHidden.scroll({
  //   top: 0,
  //   behavior: 'smooth'
  // });
}

//background color change to customer details table
function addbgc() {
  var userTable = document.querySelector(".user-table")
  userTable.classList.add("bgc")
}

function removebgc() {
  var userTable = document.querySelector(".user-table")
  userTable.classList.remove("bgc")
}

//editcustomer selectbox values and change bgc
function editCustomerDetail(element) {
  element.style.visibility = "hidden";
  removebgc()
  bgcCustomerDetail()
  let countryV = document.getElementById("allCountries").value;
  let stateV = document.getElementById("allStates").value;
  addCountries(countryV, stateV)
}

// new and Edit customer Details bgc and border color change
function bgcCustomerDetail() {

  document.querySelectorAll(".iti")[1].style.pointerEvents = "auto";
  let table = document.getElementById('customerTable');
  const inputElements = table.querySelectorAll('input');
  // const CustomerDetailsHidden = document.getElementById('customerDetailsHidden')
  const buttonElements = CustomerDetailsHidden.querySelectorAll('button');
  const selectElements = table.querySelectorAll('select');

  inputElements.forEach((element) => {
    element.removeAttribute('disabled');
    element.style.backgroundColor = "white";
    element.style.border = "1px solid #ccc";
  });

  buttonElements.forEach((element) => {
    element.style.visibility = "visible";
  });

  selectElements.forEach((element) => {
    element.removeAttribute('disabled');
  });

  const firstInputElement = table.querySelector('input[type="text"]')
  if (firstInputElement) {
    firstInputElement.focus();
  }
  CustomerDetailsHidden.scroll({
    top: 0,
    behavior: 'smooth'
  });
}

//remove error on input in customer details new and update time
function removeError(input, errorId, inputId) {
  const inputElement = document.getElementById(input);
  const errorElement = document.getElementById(errorId);

  if (inputElement.checkValidity()) {
    if (inputElement.value.length > 1) {
      validationStyleSuccess(inputElement, errorElement)
    }
  }

  if (inputId) {
    if (inputElement.checkValidity()) {
      if (inputElement.value.length > 1) {
        const inputOneElement = document.getElementById(inputId);
        validationStyleSuccess(inputElement, errorElement, inputOneElement)
      }
    }
  }
}


//submit details
function submitDetails(customerId) {

  var ncname = document.getElementById("nc-name");
  var ncemail = document.getElementById("nc-email");
  var ncmobile = document.getElementById("mobInput");
  var nccountryCode = document.getElementById("mobilePhone");

  var nameError = document.getElementById("nameError");
  var emailError = document.getElementById("emailError");
  var mobileError = document.getElementById("mobileError");

  const emailRegEx = /^([a-zA-Z0-9-_\.]+)@([a-zA-Z0-9]+)\.([a-zA-Z]{2,10})(\.[a-zA-Z]{2,8})?$/

  var isValid = true;
  var errorFields = [];

  if (ncname.value.trim() === "") {
    // nameError.textContent = "Name is required";
    errorFields.push(ncname)
    validationStyleErr(ncname, nameError, "Enter Valid Name")
    //ncname.classList.add("error");
    isValid = false;
  } else {
    validationStyleSuccess(ncname, nameError)
    //ncname.classList.remove("error");
  }

  if (ncemail.value.trim() === "" || !emailRegEx.test(ncemail.value)) {
    errorFields.push(ncemail)
    validationStyleErr(ncemail, emailError, "Enter Valid Email")
    //ncemail.classList.add("error");
    isValid = false;
  } else {
    validationStyleSuccess(ncemail, emailError)
    //ncemail.classList.remove("error");
  }

  if (ncmobile.value.trim() === "" || ncmobile.value.trim().length !== 10) {
    errorFields.push(ncmobile)
    validationStyleErr(ncmobile, mobileError, "Enter 10 digit Mobile Number", nccountryCode)
    //ncmobile.classList.add("error");
    isValid = false;
  } else {
    validationStyleSuccess(ncmobile, mobileError, nccountryCode)
    //ncmobile.classList.remove("error");
  }

  if (errorFields.length > 0) {
    errorFields[0].focus(); // Focus on the first field with an error
    return;
  }


  // Repeat for other required fields

  if (isValid) {
    const table = document.getElementById('customerTable');
    const updatedValues = {};

    // Iterate through the input and textarea elements within the table
    const inputElements = table.querySelectorAll('input, select');
    inputElements.forEach((element) => {
      const name = element.name;
      let value = element.value;
      if (element.tagName === "SELECT") {
        value = element.options[element.selectedIndex].value;
      }
      updatedValues[name] = value;
    });
    updateCustomerRecord(updatedValues, customerId)
  }
}

function updateCustomerRecord(customerRecord, customerId) {
  const customerdata = {
    "data": {
      "Display_Name": customerRecord.name,
      "Name": customerRecord.name,
      "Country_Code": customerRecord.mobile,
      "Mobile": customerRecord.mobile + customerRecord.mobile_number,
      "Email": customerRecord.email,
      "Date_field": currentDate,
      "Address": customerRecord.address_line_1,
      "Address_Line_2": customerRecord.address_line_2,
      "State_Provinces": customerRecord.state_provinces,//"State_Name": customerRecord.state_provinces,
      "State_Provinces_1": customerRecord.state_provinces,//"State_Name1": customerRecord.state_provinces,
      "Country": customerRecord.country,//"Country_Name": customerRecord.country,
      "Country_1": customerRecord.country,//"Country_Name1": customerRecord.country,
      "City": customerRecord.city,
      "Postal_Code": customerRecord.postal_code,
      "Address_Line_1": customerRecord.address_line_1,
      "Address_Line_21": customerRecord.address_line_2,
      "City1": customerRecord.city,
      "Postal_Code1": customerRecord.postal_code,
      "Company_Organization": customerRecord.company_organization
    }
  }
  //console.log(customerdata)
  if (customerId) {
    let config = {
      appName: "point-of-sales",
      reportName: "Customers_Report",
      id: customerId,
      data: customerdata
    }

    //update record API
    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {

      if (response.code == 3000) {
        showMessage("Data Updated Successfully", "success", 3000);
        closeCustomerDetail()
        //refreshLoggedUser(customerId)
      }
      else {
        //console.log(response)
        if (response.code == 3002) {
          let textInfo;
          if (response.error.Mobile) {
            textInfo = "Mobile Number already exists";//"Mobile Number : " + response.error.Mobile;
          }

          if (response.error.Email) {
            textInfo = "Email ID already exists";//"E-Mail : " + response.error.Email;
          }
          showMessage(textInfo, "error", 5000);
        }
      }
    })
      .catch((err) => {
        //console.log(err)
        //showMessage("Enter valid details", "error", 5000);
      })
  }

  else {
    let config = {
      appName: "point-of-sales",
      formName: "Customers",
      data: customerdata
    }
    //add record API
    ZOHO.CREATOR.API.addRecord(config).then(function (response) {
      if (response.code == 3000) {
        //console.log(response)
        loggedUserId = response.data.ID
        closeCustomerDetail()
        showPopup()
        //refreshLoggedUser(loggedUserId)
        //setTimeout(() => { location.reload(); }, 3000)
      }
      else {
        //console.log(response)
        if (response.code == 3002) {
          let textInfo;
          if (response.error.Mobile) {
            textInfo = "Mobile Number already exists";//"Mobile Number : " + response.error.Mobile;
          }

          if (response.error.Email) {
            textInfo = "Email ID already exists";//"Email : " + response.error.Email;
          }
          showMessage(textInfo, "error", 5000);
        }
      }
    })
      .catch((err) => {
        //console.log(err)
        //showMessage("Enter valid details", "error", 5000);
      })
  }
}

//refresh logged in user
function refreshLoggedUser(loggedUserId) {
  var selectElement = document.getElementById("customerList");
  var selectedValue = selectElement.value;

  if (selectedValue !== "Customer ID") {
    selectElement.value = "Customer ID";
  }
  customerdetailSelect()
  document.getElementById("customerInput").value = loggedUserId;  
  document.getElementById("customerSearch").click();
  document.getElementById("customerInput").value = "";
}

// Close customer details box
function closeCustomerDetail() {
  removebgc()
  CustomerDetailsHidden.style.width = "0px";//my
  CustomerDetailsHidden.style.right = "-10px";//my
  let table = document.getElementById('customerTable');
  const inputElements = table.querySelectorAll('input');
  const buttonElements = CustomerDetailsHidden.querySelectorAll('button')
  const errElements = table.querySelectorAll('.error-message');

  inputElements.forEach((element) => {
    element.disabled = true;
    element.style.backgroundColor = "#f9fafa";
    if (element.id !== "mobInput" && element.id !== "mobilePhone") {
      element.style.border = "none";
    }
  });

  buttonElements.forEach((element) => {
    element.style.visibility = "hidden";
  });

  errElements.forEach((element) => {
    element.innerText = "";
  });

  if (loggedUserId) {
    refreshLoggedUser(loggedUserId)
  }
}

// default fetch all countries from creator
function addCountries(choosedcountry, choosedstate) {
  const selectElement = document.getElementById("allCountries");
  selectElement.innerHTML = '';
  let choosedCountry = choosedcountry;
  let choosedState = choosedstate;
  if (choosedCountry === "") {
    const option = document.createElement("option");
    option.value = "";
    option.text = "";
    option.style.display = "none";
    option.selected = true;
    selectElement.appendChild(option);
  }
  allCountries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.ID;
    option.text = country.Country;
    if (country.ID === choosedCountry) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
  addStates(choosedState);
}


// default fetch all states from creator
function addStates(choosedState) {
  const selectStateElement = document.getElementById("allStates");

  selectStateElement.innerHTML = '';
  if (choosedState === "") {
    const option = document.createElement("option");
    option.value = "";
    option.text = "";
    option.style.display = "none";
    option.selected = true;
    selectStateElement.appendChild(option);
  }
  allStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.ID;
    option.text = state.State_Provinces;
    if (state.ID === choosedState) {
      option.selected = true;
    }
    selectStateElement.appendChild(option);
  });
}

// not used country selection
function countrySelect(selectElement) {
  var selectedValue = selectElement.value;

  //get all states using country id
  const allstates = {
    appName: "point-of-sales",
    reportName: "State_Provinces_Report",
    criteria: `Country == ${selectedValue}`
  }

  ZOHO.CREATOR.API.getAllRecords(allstates).then(function (response) {
    allStates = response.data;
    const selectStateElement = document.getElementById("allStates");
    selectStateElement.innerHTML = '';
    selectStateElement.disabled = false;
    if (allStates.length <= 0) {
      const option = document.createElement("option");
      option.text = "No Matches Found";
      selectStateElement.disabled = True;
      option.selected = true;
      selectStateElement.appendChild(option);
    }
    else {
      allStates.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.ID;
        option.text = state.State_Provinces;
        //if (state.ID === choosedState) {
        //  option.selected = true;
        //}
        selectStateElement.appendChild(option);
      });
    }
  })
    .catch((err) => {
      //console.log(err)
      const selectStateElement = document.getElementById("allStates");
      selectStateElement.innerHTML = '';
      selectStateElement.disabled = true;
      const option = document.createElement("option");
      option.text = "No Matches Found";
      option.selected = true;
      selectStateElement.appendChild(option);
    })
}