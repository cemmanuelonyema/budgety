"use-strict";

//UI Controller - Responsible for ui modifications
let UIController = (function () {
    const DOMstrings = {
      inputBtn: ".add__btn",
      inputType: ".add__type",
      inputDescription: ".add__description",
      inputValue: ".add__value",
      incomeContainer: ".income__list",
      expenseContainer: ".expenses__list",
      budgetLabel: ".budget__value",
      IncomeLabel: ".budget__income--value",
      ExpenseLabel: ".budget__expenses--value",
      PercentLabel: ".budget__expenses--percentage",
      container: ".container",
      itemPercentLabel: ".item__percentage",
      dateLabel: ".budget__title--month",
    };
  
    const formatNumber = function (num, type) {
      num = Math.abs(num);
      num = num.toFixed(2);
      let numSplit = num.split(".");
      let int = numSplit[0];
  
      if (int.length > 3) {
        int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
      }
      const dec = numSplit[1];
  
      return (type === "expense" ? "-" : "+") + " " + int + "." + dec;
    };
    const nodeListForEach = function (list, callbackFn) {
      //do you
      for (let i = 0; i < list.length; i++) {
        callbackFn(list[i], i);
      }
    };
  
    return {
      getInput: function () {
        return {
          type: document.querySelector(DOMstrings.inputType).value, // either income or expense
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value), //parseFLoat to convert a string to a floating number
        };
      },
      getDOMstrings: function () {
        return DOMstrings;
      },
  
      addListItem: function (obj, type) {
        let html, newHtml, element;
        //create html string placeholder text
        if (type === "income") {
          element = DOMstrings.incomeContainer;
          html =
            '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
        }
        if (type === "expense") {
          element = DOMstrings.expenseContainer;
          html =
            '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>';
        }
        //Replace the placeHolder text with some actual date
        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%description%", obj.description);
        newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
  
        //insert html
        document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
      },
  
      UIDeleteItem: function (selectorID) {
        const el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
      },
  
      clearField: function () {
        document.querySelector(DOMstrings.inputDescription).value = "";
        document.querySelector(DOMstrings.inputValue).value = "";
        document.querySelector(DOMstrings.inputDescription).focus();
      },
  
      displayBudget: function (obj) {
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.ExpenseLabel).textContent =
          obj.totalExpense;
        document.querySelector(DOMstrings.IncomeLabel).textContent =
          obj.totalIncome;
  
        if (obj.percentage > 0) {
          document.querySelector(DOMstrings.PercentLabel).textContent =
            obj.percentage + "%";
        } else {
          document.querySelector(DOMstrings.PercentLabel).textContent = "--";
        }
      },
  
      displayPercentage: function (percentages) {
        const itemPercentFields = document.querySelectorAll(
          DOMstrings.itemPercentLabel
        );
  
        nodeListForEach(itemPercentFields, function (cur, index) {
          //do you
  
          if (percentages[index] > 0) {
            cur.textContent = percentages[index] + "%";
          } else {
            cur.textContent = "--";
          }
        });
      },
      displayDate: function () {
        let now, year, month, months;
        now = new Date();
        year = now.getFullYear();
        months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        month = now.getMonth();
        document.querySelector(DOMstrings.dateLabel).textContent =
          months[month] + "," + " " + year;
      },
      changeType: function () {
        let fields = document.querySelectorAll(
          DOMstrings.inputType +
            "," +
            DOMstrings.inputDescription +
            "," +
            DOMstrings.inputValue
        );
  
        nodeListForEach(fields, function (cur) {
          cur.classList.toggle("red-focus");
        });
  
        document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
      },
    };
  })();
  