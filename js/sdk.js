
var itemdetails, filteredItems;
var currentUserName, currentUserId, loggedUserId;
var allCustomers, filteredCustomer, totalItemsCount, totalPages;
var currentPage = 1;
let itemsPerPage = 50;
var categoryListValue = "0";
var selectedCategory, categoryItemsCount;
var filteredCriteria;
let totalCountriesCount;
var allCountries = [], allStates;
var Default_Customer_Search, Default_Item_Category;
const defaultCountySelected = "148608000000282383";
const defaultStateSelected = "148608000000286123";
var orgEmailId, orgMobileNumber;
var Walk_in_Customer_ID, PosPreferanceRecId, Walk_in_Customer_ID_Main;
// var scanInProgress = false;
// var inputEventTimer;
// console.log("start"+scanInProgress)
ZOHO.CREATOR.init()
  .then(function (data) {

    //get Org details of mobile and email for walkin customer
    const orgData = {
      appName: "point-of-sales",
      reportName: "Organization_Profile_Report"
    }

    ZOHO.CREATOR.API.getAllRecords(orgData).then(function (response) {
      //console.log(response.data)
      orgEmailId = response.data[0].Email;
      orgMobileNumber = response.data[0].Mobile;
    })
      .catch(function (error) {
        // Handle initialization errors if necessary
        console.error("Error - orgData:", error);
      });

    //get all customers
    const categoryPreferance = {
      appName: "point-of-sales",
      reportName: "pos_preferences_report"
    }

    ZOHO.CREATOR.API.getAllRecords(categoryPreferance).then(function (response) {
      //console.log(response)
      Default_Customer_Search = response.data[0].Default_Customer_Search;
      Default_Item_Category = response.data[0].Default_Item_Category.ID;
      Walk_in_Customer_ID = response.data[0].Walk_in_Customer_ID1;
      Walk_in_Customer_ID_Main = response.data[0].Walk_in_Customer_ID
      PosPreferanceRecId = response.data[0].ID;
      //console.log({Default_Customer_Search,Default_Item_Category,Walk_in_Customer_ID,Walk_in_Customer_ID_Main,PosPreferanceRecId})
      if (Default_Item_Category) {
        selectedCategory = `Category == ${Default_Item_Category}`;
        categoryListValue = Default_Item_Category;
      }
      else {
        selectedCategory = "";//`Category == ${categoryListValue}`;
      }

      // Default customer search selection
      var selectElement = document.getElementById("customerList");
      if (Default_Customer_Search) {

        var options = selectElement.options;
        for (var i = 0; i < options.length; i++) {
          if (options[i].value === Default_Customer_Search) {
            options[i].selected = true;
            customerdetailSelect()
            break;
          }
        }
      }
      else {
        //selectedCategory = `Category == ${categoryListValue}`;
      }
    })
      .then(function () {

        //get all categories to display
        const category = {
          appName: "point-of-sales",
          reportName: "Item_Categories_report"
        }

        ZOHO.CREATOR.API.getAllRecords(category).then(function (response) {
          let category_list = response.data;
          var categoryBox = document.getElementById("categoryList")
          for (let i = 0; i < category_list.length; i++) {
            option = document.createElement("option");
            option.text = category_list[i].Item_category;
            option.setAttribute('class', 'category-listItems');
            option.value = category_list[i].ID;
            if (Default_Item_Category === option.value) {
              option.selected = true;
            }
            categoryBox.appendChild(option);
          }
        });
        var getItemsCount;
        if (Default_Item_Category) {
          getItemsCount = {
            appName: "point-of-sales",
            reportName: "Items_Report",
            criteria: selectedCategory
          }
        }
        else {
          getItemsCount = {
            appName: "point-of-sales",
            reportName: "Items_Report"
          }
        }
        ZOHO.CREATOR.API.getRecordCount(getItemsCount).then(function (response) {

          totalItemsCount = Number(response.result.records_count);
          categoryItemsCount = totalItemsCount;
          totalPage()
          updateCurrentPage()
          //get all items records 
          if (totalItemsCount > 0) {
            var allItemsFetch = {
              appName: "point-of-sales",
              reportName: "Items_Report",
              page: currentPage,
              criteria: selectedCategory,
              pageSize: itemsPerPage
            }

            ZOHO.CREATOR.API.getAllRecords(allItemsFetch).then(function (response) {
              itemdetails = response.data;
              filteredItems = itemdetails;
              displayAll(itemdetails)
              setTimeout(function () {
                loaderhide();
              }, 1000);
            });
          }
          else {
            showMessage("No data found", "error", 2000);
          }
        });
      })
      .catch(function (error) {
        // Handle initialization errors if necessary
        console.error("Error - categoryPreferance:", error);
      });

    // Get total countries count
    var getItemsCount = {
      appName: "point-of-sales",
      reportName: "All_Countries"
    }

    ZOHO.CREATOR.API.getRecordCount(getItemsCount).then(function (response) {
      //console.log(response);
      totalCountriesCount = Number(response.result.records_count);
      if (totalCountriesCount) {
        let setPage = 1;
        let setPageSize = 200;

        getAllCountries(setPage, setPageSize);
      }
    })
      .catch(function (error) {
        // Handle initialization errors if necessary
        console.error("Error - getItemsCount:", error);
      });

    //get all states using country id
    const allstates = {
      appName: "point-of-sales",
      reportName: "State_Provinces_Report",
      criteria: `Country == ${defaultCountySelected}`
    }

    ZOHO.CREATOR.API.getAllRecords(allstates).then(function (response) {
      //console.log(response.data)
      allStates = response.data;
    })
      .catch(function (error) {
        // Handle initialization errors if necessary
        console.error("Error - allstates:", error);
      });
  })
  .catch(function (error) {
    // Handle initialization errors if necessary
    console.error("Error initializing SDK:", error);
  });

function getAllCountries(page, pageSize) {
  const allcountries = {
    appName: "point-of-sales",
    reportName: "All_Countries",
    page: page,
    pageSize: pageSize
  };

  ZOHO.CREATOR.API.getAllRecords(allcountries).then(function (response) {
    //console.log(response.data);
    allCountries = allCountries.concat(response.data);

    if (allCountries.length < totalCountriesCount) {
      getAllCountries(page + 1, pageSize);
    }
  })
    .catch(function (error) {
      // Handle initialization errors if necessary
      console.error("Error - allcountries:", error);
    });;
}
