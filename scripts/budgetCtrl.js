"use-strict";

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
