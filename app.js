// Budget Data Controller - Responsible for data modifications
let budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
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
    testing: function () {
      console.log(data);
    },
  };
})();

//UI Controller - Responsible for ui modifications
let UIController = (function () {
  const DOMstrings = {
    inputBtn: ".add__btn",
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either income or expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },

    addListItem: function () {
      //create html string placeholder text
      if (type === "income") {
      }
      if (type === "expense") {
      }
    },
  };
})();

//Global  App Controller
let controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = function () {
    // As soon as the enter/ submit btn is clicked, Get the filled input data
    const input = UICtrl.getInput();
    console.log(input);
    // Add the item to the budget controller
    const newItem = budgetCtrl.budgetAddItem(
      input.type,
      input.description,
      input.value
    );
    // Render the item to the ui
    // Calc the budget
    //  Display the budget on the ui
  };

  return {
    init: function () {
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
