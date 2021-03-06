// Budget Data Controller - Responsible for data modifications
let budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercent = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercent = function () {
    return this.percentage;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const calcTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  const data = {
    allItems: {
      expense: [],
      income: [],
    },
    totals: {
      expense: 0,
      income: 0,
    },
    budget: 0,
    percentage: -1, //-1 for non-existence incase there are no initial values for income and expenses
  };

  return {
    budgetAddItem: function (type, des, val) {
      let newItem, ID;
      //[1,2,3,4,5]  next id = 6
      //[1,2,4,6, 8]  next id = 9, (arr.length-1) +1

      //create new id,
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on income || expense
      if (type === "expense") {
        newItem = new Expense(ID, des, val);
      }
      if (type === "income") {
        newItem = new Income(ID, des, val);
      }

      //push it into our data structure
      data.allItems[type].push(newItem);

      //return the new item
      return newItem;
    },
    // what data is needed to delete an item, - item type and id
    budgetDeleteItem: function (type, id) {
      let ids, index;

      ids = data.allItems[type].map(function (cur) {
        return cur.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calcBudget: function () {
      //calc the sum of income and expenses
      calcTotal("income");
      calcTotal("expense");
      //calc Budget: income - expenses
      data.budget = data.totals.income - data.totals.expense;
      //calc percentage: income/expenses * 100
      if (data.totals.income > 0) {
        data.percentage = Math.round(
          (data.totals.expense / data.totals.income) * 100
        );
      } else {
        data.percentage = -1;
      }
    },
    calcPercentage: function () {
      data.allItems.expense.forEach(function (cur) {
        cur.calcPercent(data.totals.income);
      });
    },

    getPercentage: function () {
      let allPercent = data.allItems.expense.map(function (cur) {
        return cur.getPercent();
      });
      return allPercent;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
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

//Global  App Controller
let controller = (function (budgetCtrl, UICtrl) {
  ///////////////////////
  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changeType);
  };
  ////////////////////////
  const updateBudget = function () {
    // Calc the budget
    budgetCtrl.calcBudget();
    // Return the budget
    const budget = budgetCtrl.getBudget();
    // Display the budget on the ui
    console.log(budget);
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function () {
    //calc percentages
    budgetCtrl.calcPercentage();
    //return the percentage
    const itemPercentage = budgetCtrl.getPercentage();
    //display the percentage on the ui
    console.log(itemPercentage);
    UICtrl.displayPercentage(itemPercentage);
  };

  const ctrlAddItem = function () {
    // As soon as the enter/ submit btn is clicked, Get the filled input data
    const input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value)) {
      console.log(input);
      // Add the item to the budget controller
      const newItem = budgetCtrl.budgetAddItem(
        input.type,
        input.description,
        input.value
      );
      // Render the item to the ui
      UICtrl.addListItem(newItem, input.type);
      //clear the field
      UICtrl.clearField();
      //Calc and Update Budget
      updateBudget();
      //calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function (event) {
    let itemId, splitId, type, ID;
    //get the target by id
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);
    }
    //delete the item from the data structure
    budgetCtrl.budgetDeleteItem(type, ID);
    // delete the item from the ui
    UICtrl.UIDeleteItem(itemId);
    //calculate and update budget
    updateBudget();
    //calculate and update percentages
    updatePercentages();
  };

  return {
    init: function () {
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        percentage: -1,
        totalIncome: 0,
        totalExpense: 0,
      });
      UICtrl.displayDate();
    },
  };
})(budgetController, UIController);

controller.init();
