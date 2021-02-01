const Todo = (function() {

  let generateUniqueId = (function() {
    let todoId = 0;
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

  return {
  
    init(todoDatas) {
      todoDatas.forEach(todoData => {
        let todo = create(todoData);
        if (todo) {
          todos.push(todo);
        } else {
          console.log(`${todoData} is not valid`);
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

    findTodo(inputId) {
      return todos.filter(todo => {
        return todo.id === inputId; 
      })[0];
    },

    addTodo(todo) {
      // if findTodo(todoid), then it's a duplicate -- logs duplication 
      if (this.findTodo(todo.id)) {
        console.log(" it is a duplicated todo");
      } else {
        todos.push(todo);
        console.log( `${todo.title} is added`);
      }
    },

    deleteTodo(inputId) {
      // if !findTodo(todoid), then can not delete --- logs todo not in collection, no deletion
      let todoForDeleting = this.findTodo(inputId);
      if (todoForDeleting) {
        todos.splice(todos.indexOf(todoForDeleting), 1);
        console.log(`${todoForDeleting.title} is deleted`);
      } else {
        console.log("no matching todo found for deletion");
      }
    },

    updateTodo(inputId, todoInfo) {
      let todoForUpdating = this.findTodo(inputId);
      if (todoForUpdating) {
        let idx = todos.indexOf(todoForUpdating);
        Object.keys(todoInfo).forEach(key => {
          todoForUpdating[key] = todoInfo[key];
        })
        return this.list().slice(idx, idx + 1);
      } else {
        console.log("no mathcing todo found for updating");
      }
      // if findTodo(todoid), then get idx of todo from collection
      // return copy of the updated todo
    },
  }
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
    // go through this.todos and check for matching month & year
    return this.getAllTodos().filter(todo => {
      return todo.isWithinMonthYear(inputMonth, inputYear);
    })
  },

  getAllCompletedTodosOfGivenTime(inputMonth, inputYear) {
    // call getAllTodosOfGivenTime(month, year), then select the ones with completed === true
    return this.getAllCompletedTodos().filter(todo => {
      return todo.isWithinMonthYear(inputMonth, inputYear);
    })
  },
};




// testings for todos :
// create todo
let todoData1 = {
  title: 'Buy Milk',
  month: '12',
  year: '2017',
  description: 'Milk for baby',
};

let todoData1_2 = {
  title: 'Buy drinks',
  month: '',
  year: '2020',
  description: 'drinks for me',
};

let todoData1_3 = {
  title: '',
  month: '',
  year: '2020',
  description: 'drinks for me',
};

//let todo1 = new Todo(todoData1);
//let todo2 = new Todo(todoData1_2);
//console.log(new Todo(todoData1_3));   // logs {notValid: true}
//console.log(todo1 instanceof Todo); // logs true
//console.log(todo1.id); // logs 1
// console.log(todo2.id); // logs 2
//console.log(todo1.completed); // logs false
//console.log(todo1.year); // logs 2017

// validation of todoData:
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
  year: '12we',
  description: 'Milk',
};


//console.log(new Todo(todoData2));  // {notValid: true}
//console.log(new Todo(todoData3));  // {notValid: true}
//console.log(new Todo(todoData4));  // {notValid: true}
//console.log(new Todo(todoData5));  // {notValid: true}
//console.log(new Todo(todoData6));  // {notValid: true}
//console.log(new Todo(todoData7));  // {notValid: true}
//console.log(new Todo(todoData8));  // {notValid: true}

// test isWithinMonthYear method:
//console.log(todo1.isWithinMonthYear('12', '2017')); // logs true
//console.log(todo2.isWithinMonthYear('', '2020'));  // logs true
//console.log(todo2.isWithinMonthYear('2', '2020'));  // logs false


// testing for todoList
// create todo collection
let todoData9 = {
  title: 'Buy juice',
  month: '1',
  year: '2017',
  description: 'juice for everyone',
};

let todoData10 = {
  title: 'Buy Apples',
  month: '',
  year: '2017',
  description: 'An apple a day keeps the doctor away',
};

let todoData11 = {
  title: 'Buy chocolate',
  month: '1',
  year: '',
  description: 'For the cheat day',
};

let todoData12 = {
  title: 'Buy Veggies',
  month: '',
  year: '',
  description: 'For the daily fiber needs',
};


let todoSet = [todoData9, todoData10, todoData11, todoData12];
TodoList.init(todoSet);
// testing if TodoList collection can be mutated outside 
let listCopy = TodoList.list();
let listCopy2 = TodoList.list();
//console.log(listCopy);  // logs array with 4 todo objs
listCopy[0] = 'wer';
//console.log(listCopy);   // logs array with 1 string and 3 objs
//console.log(TodoList.list()); // logs array with 4 todo objs
listCopy2[0].title = "don't buy milk";
//console.log(listCopy2); // logs 4 todos with "don't buy milk"
//console.log(TodoList.list())  // logs original 4 todo objs with "Buy Milk"


// test findTodo method:
//console.log(TodoList.findTodo(4)) //  logs obj id#4
//TodoList.findTodo(16);   // logs "no matching todo found"


// test addTodo method:
let todoData13 = {
  title: 'Buy books',
  month: '',
  year: '',
  description: 'boos to read',
};
let todo13 = new Todo(todoData13);
TodoList.addTodo(todo13);  // logs "Buy books"
//TodoList.addTodo(todo13);  // logs "It is a duplicated todo"
//console.log(TodoList.list()); // logs 5 x todo objs

// test deleteTodo method
//TodoList.deleteTodo(2); // logs "Buy Apples is deleted "
//TodoList.deleteTodo(20) // logs no matching todo found for deletion
//console.log(TodoList.list()); // logs 4 x todo objs

// test for updateTodo method
//console.log(TodoList.updateTodo(3, {title: "don't buy chocolate", completed: true })); // logs 1 obj in array
//console.log(TodoList.updateTodo(4, {month: '12', completed: true}));  // logs 1 obj in array
//TodoList.updateTodo(80, {title: "change window"});  // logs no matching todo found for updating
//console.log(TodoList.list());  // logs 4 x objs -- todos # id : 1, 3,4,5


// testing for todoManager
// getalltodo method

TodoManager.init(TodoList);
let allTodos = TodoManager.getAllTodos();
console.log(allTodos); // logs 4 x objs -- with buy juice todos # id : 1, 3,4,5
allTodos[0].title = "don't buy juice";
console.log(allTodos); // logs 3 x objs -- with "don't buy juice"
console.log(TodoManager.getAllTodos()); // logs 4 x objs -- with buy juice

// getAllCompleteTodo method
//console.log(TodoManager.getAllCompletedTodos()); // logs 2x objs -- #id #3 & #4

// getAllTodosOfGivenTime method
//console.log(TodoManager.getAllTodosOfGivenTime('1', '')); // logs 1x obj -- # id 3

// getAllCompletedTodosOfGivenTime method
//console.log(TodoManager.getAllCompletedTodosOfGivenTime("12","")); // logs 1x obj -- #id 4
//console.log(TodoManager.getAllCompletedTodosOfGivenTime('1', '2019')); // logs empty array

/*
let todoa = TodoList.findTodo(1);
console.log(todoa);
console.log(todoa.isWithinMonthYear('1', '2017'))
*/