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
const user = document.querySelector(".user");

let data = [];
let position = 1;

const _url = "https://todoo.5xcamp.us";
const token = localStorage.getItem("authorization");
const nickname = localStorage.getItem("nickname");

// 登出
const logout = () => {
  axios
    .delete(`${_url}/users/sign_out`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      localStorage.removeItem("authorization");
      localStorage.removeItem("nickname");
      alert(response.data.message);
      location.href = "index.html";
    })
    .catch((error) => {
      console.log(error);
      alert("登出失敗");
    });
};

// 檢查是否為登入狀態
axios
  .get(`${_url}/check`, {
    headers: {
      authorization: token,
    },
  })
  .then(() => {
    user.textContent = `${nickname}的待辦`;
    getTodo();
  })
  .catch(() => {
    location.href = "index.html";
  });

// 取得 todo
const getTodo = () => {
  axios
    .get(`${_url}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      console.log(response.data);
      data = response.data.todos;
      renderData(data);
    });
};

// 新增 todo
const addTodo = (e) => {
  // 不要重新整理
  e.preventDefault();

  // input 內容不得為空
  if (addContent.value === "") {
    alert("請輸入待辦事項內容");
    return;
  }

  let addObj = {
    todo: {
      content: addContent.value,
    },
  };

  // input 新增後為空
  addContent.value = "";

  axios
    .post(`${_url}/todos`, addObj, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      // console.log(response.data);
      data.push(response.data);
      getTodo();
    })
    .catch((error) => {
      alert(error);
    });
};

// 刪除 todo
const deleteTodo = (e) => {
  if (e.target.parentNode.getAttribute("class") !== "delTodo") {
    return;
  }

  const targetId = e.target.parentNode.dataset.id;
  // console.log(targetId);
  const targetItem = data.filter((item) => item.id === targetId)[0];
  // console.log(targetItem);

  axios
    .delete(`${_url}/todos/${targetId}`, {
      headers: {
        authorization: token,
      },
    })
    .then(() => {
      data.splice(data.indexOf(targetItem), 1);
      renderData();
    });
};

// 切換已完成或待完成
function switchStatus(e) {
  let targetId = e.target.dataset.id;
  let targetObj = data.filter((item) => item.id === targetId)[0];
  // console.log(targetObj);

  // 用來檢查targetId取得的值是否為undefined，如果是undefined，則不會執行axios，以避免出現錯誤訊息。
  if (targetId) {
    axios
      .patch(`${_url}/todos/${targetId}/toggle`, "", {
        headers: {
          authorization: token,
        },
      })
      .then((response) => {
        data.splice(data.indexOf(targetObj), 1, response.data);
        renderData();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// 刪除已完成式項
const deleteFinished = (e) => {
  if (e.target.getAttribute("id") !== "clearBtn") {
    return;
  }

  // 篩選出已完成的項目

  const targetItem = data.filter((item) => item.completed_at);

  // 強大 openAI : 使用Promise.all函數對targetItem中的每個項目進行請求刪除的操作
  // Promise.all函數接受一個promise對象的數組作為參數，並在所有promise對象都被解決後發出一個唯一的結果。在這裡，它會對targetItem中的每個項目都發出一個axios函數請求，請求服務器刪除該項目，並在所有請求都成功完成後調用renderData函數對數據進行重新渲染。
  axios;
  Promise.all(
    targetItem.map((item) => {
      // console.log(item.id);
      return axios.delete(`${_url}/todos/${item.id}`, {
        headers: {
          authorization: token,
        },
      });
    })
  ).then(() => {
    targetItem.map((item) => {
      data.splice(data.indexOf(item), 1);
    });
    renderData();
  });
};

// 待辦狀態切換
const checkAll = (e) => {
  position = 1;
  allBtn.classList.add("tab--active");
  yetBtn.classList.remove("tab--active");
  doneBtn.classList.remove("tab--active");
  renderData();
};

const checkYet = (e) => {
  position = 2;
  yetBtn.classList.add("tab--active");
  allBtn.classList.remove("tab--active");
  doneBtn.classList.remove("tab--active");
  renderData();
};

const checkDone = (e) => {
  position = 3;
  doneBtn.classList.add("tab--active");
  allBtn.classList.remove("tab--active");
  yetBtn.classList.remove("tab--active");
  renderData();
};

// 畫面渲染
const renderData = () => {
  if (position === 1) {
    let str = "";
    let uncompletedNum = 0;
    data.map((item) => {
      str += `<li class="pt-6 pb-4 flex space-x-4">
              <a href="#"><img id="checkTodo" data-id="${item.id}" src="${
        item.completed_at !== null
          ? "./dist/images/check.svg"
          : "./dist/images/checkbox.svg"
      }"></a>
              <div class="${
                item.completed_at !== null
                  ? "grow text-secondaryLight line-through"
                  : "grow text-secondary"
              }">${item.content}</div>
              <a href="#" class="delTodo" data-id="${
                item.id
              }"><img src="./dist/images/delete.svg" class="px-2"></a>
            </li>`;
      if (item.completed_at === null) {
        uncompletedNum += 1;
      }
    });
    list.innerHTML = str;
    todoNum.textContent = `${uncompletedNum}個待完成項目`;
  } else if (position === 2) {
    let str = "";
    let uncompletedNum = 0;
    data.filter((item) => {
      if (!item.completed_at) {
        str += `<li class="pt-6 pb-4 flex space-x-4">
        <a href="#"><img id="checkTodo" data-id="${item.id}" src="${
          item.completed_at !== null
            ? "./dist/images/check.svg"
            : "./dist/images/checkbox.svg"
        }"></a>
        <div class="${
          item.completed_at !== null
            ? "grow text-secondaryLight line-through"
            : "grow text-secondary"
        }">${item.content}</div>
        <a href="#" class="delTodo" data-id="${
          item.id
        }"><img src="./dist/images/delete.svg" class="px-2"></a>
      </li>`;
        if (item.completed_at === null) {
          uncompletedNum += 1;
        }
      }
    });
    list.innerHTML = str;
    todoNum.textContent = `${uncompletedNum}個待完成項目`;
  } else if (position === 3) {
    let str = "";
    let uncompletedNum = 0;
    data.filter((item) => {
      if (item.completed_at) {
        str += `<li class="pt-6 pb-4 flex space-x-4">
              <a href="#"><img id="checkTodo" data-id="${item.id}" src="${
          item.completed_at !== null
            ? "./dist/images/check.svg"
            : "./dist/images/checkbox.svg"
        }"></a>
              <div class="${
                item.completed_at !== null
                  ? "grow text-secondaryLight line-through"
                  : "grow text-secondary"
              }">${item.content}</div>
              <a href="#" class="delTodo" data-id="${
                item.id
              }"><img src="./dist/images/delete.svg" class="px-2"></a>
            </li>`;
        if (item.completed_at === null) {
          uncompletedNum += 1;
        }
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
};

addBtn.addEventListener("click", addTodo);
list.addEventListener("click", deleteTodo);
list.addEventListener("click", switchStatus);
clearBtn.addEventListener("click", deleteFinished);
allBtn.addEventListener("click", checkAll);
yetBtn.addEventListener("click", checkYet);
doneBtn.addEventListener("click", checkDone);
logoutBtn.addEventListener("click", logout);
getTodo();
