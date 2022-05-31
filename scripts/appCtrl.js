"use-strict";

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
