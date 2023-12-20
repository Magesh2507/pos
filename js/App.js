let cartInPage = window.document.querySelector(".cart-table");
//let cartFooter = window.document.querySelector(".cart-footer");
let totalPrice = window.document.querySelector(".total-price");
//let cashAmount = window.document.querySelector(".payment-page-2 .answer-1");
let qtyNum = window.document.querySelector(".card-item-num");
const cartpageQuantity = document.getElementById("cartpage-quantity")
const lastpageQuantity = document.getElementById("lastpage-quantity")
const customerList = document.getElementById("customerList")
const subTotal = document.querySelector(".cart-subtotal")
//const orderInfo = document.getElementById("order-info")
//const orderInfo3 = document.querySelector(".order-info-3")
const amountPaid = document.getElementById("amount-paid")
const currencyElements = document.querySelectorAll(".currency")
const subtotal = document.getElementById("sub-total")
const subTax = document.getElementById("sub-tax")
//const subDiscount = document.getElementById("sub-discount")
const subRoff = document.getElementById("sub-r-off")
const toPaid = document.getElementById("toPaid")
//const cash = document.getElementById("cash")
//const paid = document.getElementById("paid")
//const balance = document.getElementById("balance")
const cashFields = document.querySelectorAll(".cash-input")
const cartpageTotal = document.getElementById("cartpage-totalprice")
const lastpageTotal = document.getElementById("lastpage-totalprice")

const subTotalAmount = document.getElementById("sub-total-amount")
const totalTaxAmount = document.getElementById("total-tax-amount")
//page navigation purpose
const homepage = document.getElementById("homepage");
const cartpage = document.getElementById("cartpage");
const lastpage = document.getElementById("lastpage");


// let productInCart = JSON.parse(localStorage.getItem("shoppingCart"));
// if (productInCart) {
//   productInCart.length = 0;
// }

// if (!productInCart) {
//   productInCart = [];
// }
// Attempt to retrieve the "shoppingCart" data from localStorage and parse it as JSON
let productInCart;
try {
  const storedData = localStorage.getItem("shoppingCart");
  // If the data exists, parse it; otherwise, set productInCart to an empty array
  productInCart = storedData ? JSON.parse(storedData) : [];
} catch (error) {
  // If there's an error parsing JSON, log the error and set productInCart to an empty array
  console.error("Error parsing JSON:", error);
  productInCart = [];
}

console.log("Product in Cart:", productInCart);

// If productInCart has items, set its length to 0 (clear the array)
if (productInCart.length > 0) {
  productInCart.length = 0;
}

console.log("Modified productInCart:", productInCart);

// ... rest of your code

function redirectIndexPage() {
  //window.location.href = './index.html';
  cartpage.style.display = "none";
  lastpage.style.display = "none";
  homepage.style.display = "flex";
  cartInPage = window.document.querySelectorAll(".cart-table")[0];
  updateShoppingCartHtml()
  cartListener()
}

function complete() {
  window.location.reload(true)
}

function redirectCartPage() {
  const customerDetail = document.getElementById("customerList");

  if (loggedUserId === undefined && customerDetail.value !== "Walk-in Customer") {
    showMessage("Please select a customer", "error", 3000);
  }
  else if (productInCart.length <= 0) {
    showMessage("Your cart is empty! Add some products in cart", "error", 3000);
  }
  else {
    // const url = "./cartpage.html";
    // window.location.href = url;
    homepage.style.display = "none";
    lastpage.style.display = "none";
    cartpage.style.display = "block";
    const cash = document.getElementById("cash")
    const balance = document.getElementById("balance")
    cash.value = "";
    balance.value = "";
    cartInPage = window.document.querySelectorAll(".cart-table")[1];
    updateShoppingCartHtml()
    cartListener()
  }
}

function redirectLastPage() {
  //window.location.href = "./lastpage.html";
  if (productInCart.length <= 0) {
    showMessage("Your cart is empty! Add some products in cart", "error", 3000);
  }
  else {
    homepage.style.display = "none";
    cartpage.style.display = "none";
    lastpage.style.display = "flex";
    cartInPage = window.document.querySelectorAll(".cart-table")[2];
    updateShoppingCartHtml();
    //const trashIcons = cartInPage.querySelectorAll(".bi-trash");
    // trashIcons.forEach(trashIcon => {
    //   trashIcon.style.display = "none";
    // });

    // Loop through each table
    //cartInPage.forEach(table => {
    // Get all rows within the current table
    const rows = cartInPage.querySelectorAll("tr");

    // Loop through each row
    rows.forEach(row => {
      // Get the 5th <td> (child) and set display to "none"
      const fifthTd = row.querySelector("td:nth-child(5)");
      if (fifthTd) {
        fifthTd.style.display = "none";
      }
      // Get the 4th <td> (child) and set text-align to "center"
      const fourthTd = row.querySelector("td:nth-child(4)");
      if (fourthTd) {
        fourthTd.style.textAlign = "center";
      }
    });
    //});
    //cartListener()
  }
}

function updateProductInCart(product) { //console.log(product)
  for (let i = 0; i < productInCart.length; i++) {
    if (productInCart[i].id == product.id) {
      productInCart[i].count += 1;
      productInCart[i].selling_price = productInCart[i].product_price * productInCart[i].count;
      productInCart[i].Cost_price_Total = productInCart[i].Cost_price * productInCart[i].count;
      productInCart[i].tax_amount_total = productInCart[i].tax_amount * productInCart[i].count;
      return;
    }
  }
  productInCart.push(product);
}

const countTheSumPrice = function () {
  //console.log(productInCart)
  let sumPrice = 0;
  productInCart.forEach(product => {
    sumPrice += product.selling_price;
  })
  return Number(sumPrice).toFixed(2)
}

const countTheTotalCostAmount = function () {
  let sumPrice = 0;
  productInCart.forEach(product => {
    sumPrice += product.Cost_price_Total;
  })
  return Number(sumPrice).toFixed(2)
}

const countTheQty = function () {
  let sumPrice = 0;
  productInCart.forEach(product => {
    sumPrice += product.count;
  })
  return sumPrice;
}

const countTheTaxAmount = function () {
  let sumPrice = 0;
  productInCart.forEach(product => {
    sumPrice += product.tax_amount_total;
  })
  return Number(sumPrice).toFixed(2);
}

function updateShoppingCartHtml() {
  localStorage.setItem("shoppingCart", JSON.stringify(productInCart));//to save localstorage
  if (productInCart.length == 0) {
    cartInPage.innerHTML = `
      <table class="cart-table">
        <tr class="cart-page-head" style="position:sticky; top:0;">
          <th class="th" style="width:10% !important;">S.No.</th>
          <th class="th" style="width:35%; text-align:center !important">Products</th>
          <th class="th" style="width:30% !important;">Quantity</th>
          <th class="th" style="width:25% !important;" colspan="2">Amount</th>
          <!--<th class="th" style="text-align:right"></th>-->
        </tr>
      </table>`

    totalPrice.innerHTML = "₹" + "" + countTheSumPrice();
    qtyNum.innerHTML = `(Items:${productInCart.length},Quantity:${countTheQty()})`;
    if (cartpageQuantity) {
      cartpageQuantity.innerHTML = `(Items:${productInCart.length},Quantity:${countTheQty()})`;
    }
    if (lastpageQuantity) {
      lastpageQuantity.innerHTML = `(Items:${productInCart.length},Quantity:${countTheQty()})`;
    }
    if (currencyElements) {
      currencyElements.forEach((element) => {
        element.innerHTML = '₹0.00';
      })
    }
  }

  if (productInCart.length > 0) {
    //console.log(productInCart)
    let result = productInCart.map((items, index) => {//console.log(items)
      return `
     <table class="cart-table">
       <tr>
        <td>
          <div class="serial-no-info">
            <p class="p">${index + 1}.</p>
          </div>
        </td>
        <td style="width:35%; text-align:left">
          <div class="product-info" style="width:100%">
            <p class="title p">${items.productName}</p>
            <p class="base-amount p">₹ ${items.product_price.toFixed(2)} | ${items.tax}</p>
          </div>
        </td>
        <td>
          <div class="quantity-info" style="justify-content:center">
            <i class="bi bi-dash-square-fill" data-id=${items.id}></i>
            <strong>
              <input type="text" class="cart-input" onchange="quantityChange(this)" data-id="${items.id}" value="${items.count}" size="3" style="outline:none;text-align:center;font-weight:550">
            </strong>
            <i class="bi bi-plus-square-fill" data-id=${items.id}></i>
          </div>
        </td>
        <td style="text-align:right">
          <p class="price p">₹ ${(items.product_price * items.count).toFixed(2)}</p>
        </td>
        <td style="text-align:center">
          <i class="bi bi-trash" data-id=${items.id}>
        </td>
      </tr>
    </table>`
    })

    let result2 = `
    <table class="cart-table">
      <tr  class="cart-page-head" style="position:sticky; top:0;">
        <th class="th" style="width:10% !important;">S.No.</th>
        <th class="th" style="width:35% !important; text-align:center !important;">Products</th>
        <th class="th" style="width:30% !important;">Quantity</th>
        <th class="th" style="width:25% !important;" colspan="2">Amount</th>
        <!--<th class="th" style="text-align:right"></th>-->
      </tr>
    </table>`

    cartInPage.innerHTML = result2 + result.join('');
    if (totalPrice) {
      totalPrice.innerHTML = "₹" + "" + (Number(countTheSumPrice()) + Number(countTheTaxAmount())).toFixed(2); //"₹" + "" + countTheSumPrice();
    }

    qtyNum.innerHTML = `(Items:${productInCart.length},Quantity:${countTheQty()})`;
    if (cartpageQuantity) {
      cartpageQuantity.innerHTML = `(Items:${productInCart.length},Quantity:${countTheQty()})`;
    }
    if (lastpageQuantity) {
      lastpageQuantity.innerHTML = `(Items:${productInCart.length},Quantity:${countTheQty()})`;
    }
    let subAmount = Number(countTheSumPrice()).toFixed(2)
    let tax = countTheTaxAmount()

    if (subTotalAmount) {
      //console.log(countTheSumPrice())
      subTotalAmount.innerHTML = "₹" + "" + countTheSumPrice();
    }
    if (totalTaxAmount) {
      //console.log(countTheTaxAmount())
      totalTaxAmount.innerHTML = "₹" + "" + countTheTaxAmount();
    }

    if (subtotal) {
      subtotal.innerHTML = `₹${subAmount}`;
    }
    if (subTax) {
      subTax.innerHTML = `₹${tax}`;
    }
    // if(subDiscount){
    //   subDiscount.innerHTML = `₹${subAmount}`;
    // }
    if (subRoff) {
      subRoff.innerHTML = `₹${countTheSumPrice()}`;
    }
    // if (toPaid) {
    //   toPaid.innerHTML = `₹${countTheSumPrice()}`;
    // }
    if (cartpageTotal || lastpageTotal || toPaid || amountPaid) {
      const totalAmountTax = Number(countTheSumPrice()) + Number(countTheTaxAmount())
      if (cartpageTotal) {
        cartpageTotal.innerHTML = "₹" + "" + totalAmountTax.toFixed(2);
      }
      if (toPaid) {
        toPaid.innerHTML = "₹" + "" + totalAmountTax.toFixed(2);
      }
      if (amountPaid) {
        amountPaid.innerHTML = "₹" + "" + totalAmountTax.toFixed(2);
      }
      if (lastpageTotal) {
        lastpageTotal.innerHTML = "₹" + "" + totalAmountTax.toFixed(2);
      }
    }
    // if(cash){
    //   cash.innerHTML = `₹${countTheSumPrice()}`;
    // }
    // if(paid){
    //   subtotal.innerHTML = `₹${countTheSumPrice()}`;
    // }
    //if (balance) {
    //balance.innerHTML = `₹${countTheSumPrice()}`;
    //}

    const cartInputs = document.querySelectorAll(".cart-input");
    cartInputs.forEach(input => {
      checkNonNumeric(input)
    });
  }
}

if (cashFields) {
  cashFields.forEach(input => {
    checkNonNumeric(input)
  });
}

function checkNonNumeric(input) {
  input.addEventListener("input", restrictInputToNumeric);
}

function restrictInputToNumeric(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
}

function removeListener(removeInput) {
  removeInput.removeEventListener("input", restrictInputToNumeric);
}


//cash change
function cashChange(ele) {
  const cashValue = document.getElementById('cash').value;
  const totalAmountTax = Number(countTheSumPrice()) + Number(countTheTaxAmount())

  if (totalAmountTax > cashValue) {
    showMessage("Entered amount is lesser than the amount to be paid", "error", 5000);
    document.getElementById('balance').value = "";
  }
  else {
    const balanceValue = Number(cashValue) - Number(totalAmountTax);
    document.getElementById('balance').value = balanceValue.toFixed(2);
  }

}

//cart quantity change
function quantityChange(ele) {

  for (let i = 0; i <= productInCart.length - 1; i++) {

    if (productInCart[i].id == ele.dataset.id) { //console.log({ele, productInCart})
      const quantity = ele.value;
      if (quantity <= 0) {
        productInCart[i].count = 1;
        productInCart[i].selling_price = productInCart[i].product_price * productInCart[i].count;
        productInCart[i].Cost_price_Total = productInCart[i].Cost_price * productInCart[i].count;
        productInCart[i].tax_amount_total = productInCart[i].tax_amount * productInCart[i].count;
        updateShoppingCartHtml()
        return
      }

      else {
        productInCart[i].count = Number(quantity)
        productInCart[i].selling_price = productInCart[i].product_price * productInCart[i].count;
        productInCart[i].Cost_price_Total = productInCart[i].Cost_price * productInCart[i].count;
        productInCart[i].tax_amount_total = productInCart[i].tax_amount * productInCart[i].count;
        updateShoppingCartHtml()
        return
      }
    }
  }
}
function cartListener() {
  cartInPage.addEventListener("click", e => {
    const isPlusButton = e.target.classList.contains('bi-plus-square-fill');
    const isMinusButton = e.target.classList.contains('bi-dash-square-fill');
    const isDeleteButton = e.target.classList.contains('bi-trash');

    if (isPlusButton || isMinusButton || isDeleteButton) {

      for (let i = 0; i <= productInCart.length - 1; i++) {

        if (productInCart[i].id == e.target.dataset.id) {

          if (isPlusButton) {
            productInCart[i].count += 1;
            handleCartChange(i);
            break;
          }

          if (isMinusButton) {
            if (productInCart[i].count > 1) {
              productInCart[i].count -= 1;
              handleCartChange(i);
              break;
            }
            else {
              productInCart[i].count = 1;
              handleCartChange(i)
              document.querySelectorAll(".bi-dash-square-fill")[i].classList.add("minus-icon-disable");
              break;
            }
          }
          else if (isDeleteButton) {
            let removed = productInCart.splice(i, 1);
            updateShoppingCartHtml();
            break;
          }
        }
      }
      updateShoppingCartHtml();
    }
  })
}

function handleCartChange(i) {
  productInCart[i].selling_price = productInCart[i].product_price * productInCart[i].count;
  productInCart[i].Cost_price_Total = productInCart[i].Cost_price * productInCart[i].count;
  productInCart[i].tax_amount_total = productInCart[i].tax_amount * productInCart[i].count;
}

//update cart items onload 
updateShoppingCartHtml()
cartListener()

function itemsSearch() {
  const itemEntered = document.getElementById("itemCategory")
}

// when change select tag  of custmer detail select
function customerdetailSelect() {

  // const customerDetail = document.getElementById("customerList")

  let errSpan = document.getElementById('errmessage')
  errSpan.innerText = ""

  //const customerInputId = document.getElementById("customerInput")
  customerInputId.value = ""
  customerInputId.style.borderColor = "#d9d5d5";
  customerInputId.disabled = false;


  const countrycode = document.getElementById("phone")
  countrycode.style.borderColor = "#d9d5d5";
  countrycode.setAttribute("onkeydown", "return false")

  const countrySelect = document.querySelector(".iti")
  countrySelect.style.display = "none"

  var datePicker = document.querySelector("#datepicker")
  datePicker.style.display = "none"
  datePicker.style.borderColor = "#d9d5d5"

  const datePickerDiv = document.querySelector('.gj-datepicker.input-group')
  datePickerDiv.style.display = "none";

  switch (customerDetail.value) {

    case "Mobile":
      countrySelect.style.display = "inline-block";
      break;

    case "Name & DOB":
      datePicker.style.display = "inline-block"
      datePickerDiv.style.display = "inline-flex"
      break;

    case "Walk-in Customer":
      loggedUserId = undefined;
      customerIdDipslay();
      customerInputId.disabled = true;
      break;
  }
}