const addContent = document.querySelector(".addContent");
const list = document.querySelector(".list");
const todoNum = document.querySelector(".todoNum");
const empty = document.querySelector("#empty");
const addBtn = document.querySelector(".addBtn");
const clearBtn = document.querySelector("#clearBtn");
const allBtn = document.querySelector(".allBtn");
const yetBtn = document.querySelector(".yetBtn");
const doneBtn = document.querySelector(".doneBtn");
const logoutBtn = document.querySelector(".logoutBtn");

let data = [];
let position = 1;

//初始化
function init() {
  getAxios();
}

// 取得待辦
function getAxios() {
  axios
    .get("https://fathomless-brushlands-42339.herokuapp.com/todo5")
    .then(function (response) {
      data = response.data;
      console.log(data);
      renderData();
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 畫面渲染
function renderData() {
  let str = "";
  let uncompletedNum = 0;
  if (position === 1) {
    data.forEach(function (item, index) {
      str += `<li class="pt-6 pb-4 flex space-x-4 ${item.delete}">
                <a href="#"><img id="checkTodo" class="${item.finished}" data-check="${item.check}" data-num="${index}" data-id="${item.id}" src="./dist/images/checkbox.svg"></a>
                <div id="todoText" class="grow text-secondary"> ${item.content}</div>
                <a href="#" class="delTodo" data-id="${item.id}""><img src="./dist/images/delete.svg" class="px-2"></a>
                </li>`;
      if (item.check === "false") {
        uncompletedNum += 1;
      }
    });
    list.innerHTML = str;
    todoNum.textContent = `${uncompletedNum}個待完成項目`;
  } else if (position === 2) {
    const uncompletedData = data.filter(function (item) {
      return item.check === "false";
    });
    uncompletedData.forEach(function (item, index) {
      str += `<li class="pt-6 pb-4 flex space-x-4 ${item.delete}">
                <a href="#"><img id="checkTodo" class="${item.finished}" data-check="${item.check}" data-num="${index}" data-id="${item.id}" src="./dist/images/checkbox.svg"></a>
                <div id="todoText" class="grow text-secondary"> ${item.content}</div>
                <a href="#" class="delTodo" data-id="${item.id}""><img src="./dist/images/delete.svg" class="px-2"></a>
                </li>`;
      if (item.check === "false") {
        uncompletedNum += 1;
      }
    });
    list.innerHTML = str;
    todoNum.textContent = `${uncompletedNum}個待完成項目`;
  } else {
    const completedData = data.filter(function (item) {
      return item.check === "true";
    });
    completedData.forEach(function (item, index) {
      str += `<li class="pt-6 pb-4 flex space-x-4 ${item.delete}">
                <a href="#"><img id="checkTodo" class="${item.finished}" data-check="${item.check}" data-num="${index}" data-id="${item.id}" src="./dist/images/checkbox.svg"></a>
                <div id="todoText" class="grow text-secondary"> ${item.content}</div>
                <a href="#" class="delTodo" data-id="${item.id}""><img src="./dist/images/delete.svg" class="px-2"></a>
                </li>`;
      if (item.check === "false") {
        uncompletedNum += 1;
      }
    });
    list.innerHTML = str;
    todoNum.textContent = `${uncompletedNum}個待完成項目`;
  }

  if (data.length === 0) {
    document.getElementById("empty").style.display = "block";
    document.getElementById("list").style.display = "none";
  } else {
    document.getElementById("empty").style.display = "none";
    document.getElementById("list").style.display = "block";
  }
}

// 新增待辦
function addTodo(e) {
  // 不要重新整理
  e.preventDefault();

  // input 內容不得為空
  if (addContent.value === "") {
    alert("請輸入待辦事項內容");
    return;
  }

  // 將 input 的 value 新增至陣列中
  let obj = {
    check: "false",
    finished: "",
    delete: "",
  };
  obj.content = addContent.value;

  // input 新增後為空
  addContent.value = "";
  addAxios(obj);
}

// 刪除待辦
function deleteTodo(e) {
  if (e.target.parentNode.getAttribute("class") !== "delTodo") {
    return;
  }
  let id = Number(e.target.parentNode.dataset.id);
  deleteAxios(id);
}

// 待辦打勾及刪除樣式
function switchStatus(e) {
  if (e.target.getAttribute("id") === "checkTodo") {
    let check = e.target.getAttribute("data-check");
    let num = e.target.getAttribute("data-num");
    let id = e.target.getAttribute("data-id");
    patchAxios(check, num, id);
  }
}

// 全部刪除
function deleteFinished(e) {
  if (e.target.getAttribute("id") !== "clearBtn") {
    return;
  }

  data.forEach(function (item) {
    if (item.check === "true") {
      deleteAxios(item.id);
    }
  });
  renderData();
}

// 賦予狀態切換樣式
function checkAll(e) {
  position = 1;
  allBtn.classList.add("tab--active");
  yetBtn.classList.remove("tab--active");
  doneBtn.classList.remove("tab--active");
  renderData();
}

function checkYet(e) {
  position = 2;
  yetBtn.classList.add("tab--active");
  allBtn.classList.remove("tab--active");
  doneBtn.classList.remove("tab--active");
  renderData();
}

function checkDone(e) {
  position = 3;
  doneBtn.classList.add("tab--active");
  allBtn.classList.remove("tab--active");
  yetBtn.classList.remove("tab--active");
  renderData();
}

// 接 axios
function addAxios(obj) {
  axios
    .post("https://fathomless-brushlands-42339.herokuapp.com/todo5", obj)
    .then(function (response) {
      data.push(response.data);
      renderData();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function deleteAxios(id) {
  axios
    .delete(`https://fathomless-brushlands-42339.herokuapp.com/todo5/${id}`)
    .then(function (response) {
      data.forEach(function (item, index) {
        if (item.id === id) {
          data.splice(index, 1);
        }
      });
      renderData();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function patchAxios(check, num, id) {
  if (check === "false") {
    axios
      .patch(`https://fathomless-brushlands-42339.herokuapp.com/todo5/${id}`, {
        check: "true",
        finished: "confirm-finished",
        delete: "deleted",
      })
      .then(function (response) {
        data[num].check = "true";
        data[num].finished = "confirm-finished";
        data[num].delete = "deleted";
        renderData();
      });
  } else if (check === "true") {
    axios
      .patch(`https://fathomless-brushlands-42339.herokuapp.com/todo5/${id}`, {
        check: "false",
        finished: " ",
        delete: " ",
      })
      .then(function (response) {
        data[num].check = "false";
        data[num].finished = " ";
        data[num].delete = " ";
        renderData();
      });
  }
}

// 登出
function logout() {
  axios
    .delete("https://todoo.5xcamp.us/users/sign_out", config)
    .then((res) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userNickname");
      alert(res.data.message);
      redirect();
    })
    .catch((err) => {
      console.log(err);
      alert("登出失敗");
    });
}

addBtn.addEventListener("click", addTodo);
list.addEventListener("click", deleteTodo);
list.addEventListener("click", switchStatus);
clearBtn.addEventListener("click", deleteFinished);
allBtn.addEventListener("click", checkAll);
yetBtn.addEventListener("click", checkYet);
doneBtn.addEventListener("click", checkDone);
logoutBtn.addEventListener("click", logout);
init();
