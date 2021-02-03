const Todo = (function() {

  let generateUniqueId = (function() {
    let todoId = 100;
    return function() {
      todoId += 1;
      return todoId;
    };
  })();

 
  function validDescription(input) {
    return /^[a-zA-Z0-9\s]+$/.test(input) && /[a-zA-Z]{3,}/.test(input);
  }

  function validMonth(input) {
    let months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    return months.includes(input) || input === "";
  }

  function validYear(input) {
    return typeof input === 'string' && /^[0-9]{4}$/.test(input) || input === "";
  }

  
  // allow only title, month, year, description keys as input (Q: how to avoid additional keys after object is created?)
  return function(todoData) {
    if (validDescription(todoData.title) && validMonth(todoData.month) && 
        validYear(todoData.year) && validDescription(todoData.description) ) {
          this.id = generateUniqueId();
          this.title = todoData.title;
          this.month = todoData.month;
          this.year = todoData.year;
          this.description = todoData.description;
          this.completed = false;
        } else {
          return {notValid : true};
        }
  };
})();

Todo.prototype.isWithinMonthYear = function(inputMonth, inputYear) {
    return this.month === inputMonth && this.year === inputYear;
};


const TodoList = (function() {

  let todos = [];

  function create(todoData) {
    let todo = new Todo(todoData);
    if (todo.notValid) {
      return false;
    } else {
      return todo;
    }
  }
  
  function findTodo(inputId) {
    return todos.filter(todo => {
      return todo.id === inputId; 
    })[0];
  }

  return {
  
    init(todoDatas) {
      todoDatas.forEach((todoData, idx) => {
        let todo = create(todoData);
        if (todo) {
          todos.push(todo);
        } else {
          console.log(`todoDatas index ${idx} is not valid`);
        }
      })
    },

    list() {
      let result = [];
      todos.forEach(todo => {
        let newObj = Object.create(Todo.prototype);
        result.push(Object.assign(newObj, todo));
      })
      return result;
    },

    ReturnFoundTodoCopy(inputId) {
      let result = findTodo(inputId);

      if (result) {
        let newObj = Object.create(Todo.prototype);
        return Object.assign(newObj, result);
      }
    },

    addTodo(todo) {
      if (findTodo(todo.id)) {
        console.log(" it is a duplicated todo");
      } else if (todo.notValid) {
        console.log("invalid todoData. Not added to the collection")
      } else {
        todos.push(todo);
        console.log( `${todo.title} is added`);
      }
    },

    deleteTodo(inputId) {
      let todoForDeleting = findTodo(inputId);
      if (todoForDeleting) {
        todos.splice(todos.indexOf(todoForDeleting), 1);
        console.log(`${todoForDeleting.title} is deleted`);
      } else {
        console.log("no matching todo found for deletion");
      }
    },

    updateTodo(inputId, todoInfo) {
      let todoForUpdating = findTodo(inputId);
      if (todoForUpdating) {
        
        let allowedKeysForUpdating = ['title', 'month', 'year', 'description', 'completed'];

        Object.keys(todoInfo).forEach(key => {

          if (allowedKeysForUpdating.includes(key)) {
            todoForUpdating[key] = todoInfo[key];
          } else {
            console.log(`${key} is not included in the properties that can be updated.`);
          }
        })

        let idx = todos.indexOf(todoForUpdating);
        return this.list().slice(idx, idx + 1);

      } else {
        console.log("no mathcing todo found for updating");
      }
    },
  };
})();

const TodoManager = {
  init(todoList) {
    this.todoItems = todoList;
  },

  getAllTodos() {
    return this.todoItems.list();
  },

  getAllCompletedTodos() {
    return this.getAllTodos().filter(todo => {
      return todo.completed === true;
    })
  },

  getAllTodosOfGivenTime(inputMonth, inputYear) {
    return this.getAllTodos().filter(todo => {
      return todo.isWithinMonthYear(inputMonth, inputYear);
    })
  },

  getAllCompletedTodosOfGivenTime(inputMonth, inputYear) {
    return this.getAllCompletedTodos().filter(todo => {
      return todo.isWithinMonthYear(inputMonth, inputYear);
    })
  },
};



/*
// 1. testings for Todo constructor :

// 1-1. create todo - with valid inputs
let todoData0 = {
  title: 'Buy Milk',
  month: '12',
  year: '2017',
  description: 'Milk for baby',
};

let todoData1 = {
  title: 'Buy drinks',
  month: '',
  year: '2020',
  description: 'drinks for me',
};

let todo1 = new Todo(todoData0);
let todo2 = new Todo(todoData1);

console.log(todo1 instanceof Todo); // logs true
console.log(todo1.id); // logs 101
console.log(todo2.id); // logs 102
console.log(todo1.completed); // logs false
console.log(todo1.year); // logs 2017


// 1-2. test isWithinMonthYear method:
console.log(todo1.isWithinMonthYear('12', '2017')); // logs true
console.log(todo2.isWithinMonthYear('', '2020'));  // logs true
console.log(todo2.isWithinMonthYear('2', '2020'));  // logs false


// 1-3. create todos - with invalid todoData inputs:
// invalid title -- empty string
let todoData2 = {
  title: '',
  month: '1',
  year: '2017',
  description: 'Milk for baby',
};
// invalid description -- less than 3 letters for a word
let todoData3 = {
  title: 'Buy milk',
  month: '1',
  year: '2017',
  description: 'Mi 12334',
};
// invalid description  -- not string
let todoData4 = {
  title: 'Buy milk',
  month: '1',
  year: '2017',
  description: 2343,
};
// invalid month  -- not within month range
let todoData5 = {
  title: 'Buy milk',
  month: '20',
  year: '2017',
  description: 'Milk',
};
// invalid month  -- not string
let todoData6 = {
  title: 'Buy milk',
  month: 12,
  year: '2017',
  description: 'Milk',
};
// invalid year  -- not string
let todoData7 = {
  title: 'Buy milk',
  month: '12',
  year: 2018,
  description: 'Milk',
};
// invalid year  -- not all digits
let todoData8 = {
  title: 'Buy milk',
  month: '',
  year: '12',
  description: 'Milk',
};


console.log(new Todo(todoData2));  // {notValid: true}
console.log(new Todo(todoData3));  // {notValid: true}
console.log(new Todo(todoData4));  // {notValid: true}
console.log(new Todo(todoData5));  // {notValid: true}
console.log(new Todo(todoData6));  // {notValid: true}
console.log(new Todo(todoData7));  // {notValid: true}
console.log(new Todo(todoData8));  // {notValid: true}
*/



// 2. testing for TodoList:
// 2-1. create todo collection
let todoData9 = {
  title: 'Buy juice',
  month: '1',
  year: '2017',
  description: 'juice for everyone',
};

let todoData10 = {
  title: 'Buy Apples',
  month: '1',
  year: '2017',
  description: 'An apple a day keeps the doctor away',
};

let todoData11 = {
  title: 'Buy chocolate',
  month: '2',
  year: '2020',
  description: 'For the cheat day',
};

let todoData12 = {
  title: 'Buy Veggies',
  month: '2',
  year: '2020',
  description: 'For the daily fiber needs',
};

// invalid input
let todoData13 = {
  title: '',
  month: '2',
  year: '2020',
  description: '',
};


let todoSet = [todoData9, todoData10, todoData11, todoData12, todoData13];
TodoList.init(todoSet);  // logs [object object] is not valid
//console.log(TodoList.list());  // logs an array of 4 objs - 101 Buy juice, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies

// 2-2. testing TodoList collection can not be mutated outside 
let listCopy = TodoList.list();
let listCopy2 = TodoList.list();
//console.log(listCopy);  // logs an array of 4 objs - 101 Buy juice, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies
listCopy[0] = 'wer';
//console.log(listCopy);   // logs array with 1 string and 3 objs
//console.log(TodoList.list()); // logs an array of 4 objs - 101 Buy juice, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies
listCopy2[0].title = "get Takeaway";
//console.log(listCopy2); // llogs an array of 4 objs - 101 get Takeaway, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies
//console.log(TodoList.list())  // logs an array of 4 objs - 101 Buy juice, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies


// 2-3. test ReturnFoundTodoCopy method & original todo in collection can not be mutated:
let todo104 = TodoList.ReturnFoundTodoCopy(104);
//console.log(todo104) //  logs todo obj id 104 Buy Veggies
// console.log(todo104.isWithinMonthYear('2', '2020'))  // logs true
//console.log(TodoList.ReturnFoundTodoCopy(16));   // logs undefined
todo104.title = "Don't buy veggies";
//console.log(todo104); // logs todo obj id 104 Don't buy veggies
//console.log(TodoList.ReturnFoundTodoCopy(104))  // logs todo obj id 104 Buy Veggies


// 2-4. test addTodo method:
let todoData14 = {
  title: 'Buy books',
  month: '1',
  year: '2017',
  description: 'boos to read',
};
// invalid data
let todoData15 = {
  title: '',
  month: '1',
  year: '2017',
  description: '',
};
let todo14 = new Todo(todoData14);
TodoList.addTodo(todo14);  // logs "Buy books is added"
//TodoList.addTodo(todo14);  // logs "It is a duplicated todo"
//TodoList.addTodo(new Todo(todoData15));  // logs "invalid todoData. Not added to the collection"
//console.log(TodoList.list()); // logs an array of 5 x objs - 101 Buy juice, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies ,105 Buy books


// 2-5. test deleteTodo method:
TodoList.deleteTodo(105); // logs "Buy books is deleted "
//TodoList.deleteTodo(200) // logs no matching todo found for deletion
//console.log(TodoList.list()); // logs an array of 4 x objs - 101 Buy juice, 102 Buy apples, 103 Buy chocolate, 104 Buy Veggies

// 2-6. test for updateTodo method && todo collection can not be mutated via updateTodo return value:
console.log(TodoList.updateTodo(101, { title: "don't buy juice", completed: true })); // logs an array of 1 obj - 101 don't buy juice, completed: true
let updatedTodo = TodoList.updateTodo(102, {completed: true});  // return 1 obj in array - 102 buy apples completed: true
updatedTodo[0].title = "buy chips";
//console.log(updatedTodo); // return 1 obj in array - 102 buy chips completed: true
//TodoList.updateTodo(80, {title: "change window"});  // logs no matching todo found for updating
//console.log(TodoList.list());  // logs an array of 4 x objs - 101 don't buy juice & true, 102 Buy apples & true, 103 Buy chocolate & false, 104 Buy Veggies & false

// 2-6-1. test for updating non-allowed properties:
console.log(TodoList.updateTodo(101, {extraProp: "new values", id: 1344,}));  
// logs "extraProp is not included in the properties that can be updated."
// logs "id is not included in the properties that can be updated." 
// then logs an array of 1 obj - 101 don't buy juice, completed: true

// 3. testing for TodoManager:
// 3-1. test getalltodo method and  todo collection can not be mutated by getalltodo return value:
TodoManager.init(TodoList);
let allTodos = TodoManager.getAllTodos();
//console.log(allTodos); // logs an array of 4 x objs - 101 don't buy juice & true, 102 Buy apples & true, 103 Buy chocolate & false, 104 Buy Veggies & false
allTodos[0].title = "buy banana";
//console.log(allTodos); // logs an array of 4 x objs - 101 buy banana & true, 102 Buy apples & true, 103 Buy chocolate & false, 104 Buy Veggies & false
//console.log(TodoManager.getAllTodos()); // logs an array of 4 x objs - 101 don't buy juice & true, 102 Buy apples & true, 103 Buy chocolate & false, 104 Buy Veggies & false

// 3-2.  getAllCompleteTodo method:
//console.log(TodoManager.getAllCompletedTodos()); // logs an array of 2 x objs - 101 don't buy juice & true, 102 Buy apples & true

// 3-3. getAllTodosOfGivenTime method:
//console.log(TodoManager.getAllTodosOfGivenTime('1', '2017')); // logs an array of 2 x objs - 101 don't buy juice & true, 102 Buy apples & true
//console.log(TodoManager.getAllTodosOfGivenTime('1', '2018')); // logs an empty array
//console.log(TodoManager.getAllTodosOfGivenTime('2', '2020')); // logs an array of 2 x objs - 103 Buy chocolate & false, 104 Buy Veggies & false

// 3-4. getAllCompletedTodosOfGivenTime method:
//console.log(TodoManager.getAllCompletedTodosOfGivenTime("1","2017")); // logs an array of 2 x objs - 101 don't buy juice & true, 102 Buy apples & true
//console.log(TodoManager.getAllCompletedTodosOfGivenTime('1', '2019')); // logs empty array

