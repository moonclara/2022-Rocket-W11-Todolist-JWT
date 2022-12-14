// form
const loginForm = document.querySelector(".loginForm");
const signUpForm = document.querySelector(".signUpForm");

// check signUpForm
const signUpEmail = document.querySelector(".signUpEmail");
const warnSignUpEmail = document.querySelector(".warnSignUpEmail");

const signUpNick = document.querySelector(".signUpNick");
const warnSignUpNick = document.querySelector(".warnSignUpNick");

const signUpPassword = document.querySelector(".signUpPassword");
const warnSignUpPassword = document.querySelector(".warnSignUpPassword");

const signUpPasswordAgain = document.querySelector(".signUpPasswordAgain");
const warnSignUpPasswordAgain = document.querySelector(
  ".warnSignUpPasswordAgain"
);

// check loginForm
const loginEmail = document.querySelector(".loginEmail");
const warnLoginEmail = document.querySelector(".warnLoginEmail");

const loginPassword = document.querySelector(".loginPassword");
const warnLoginPassword = document.querySelector(".warnLoginPassword");

// btn
const signUpBtn = document.querySelector(".signUpBtn");
const loginBtn = document.querySelector(".loginBtn");
const goSignUpBtn = document.querySelector(".goSignUpBtn");
const goLoginBtn = document.querySelector(".goLoginBtn");

const _url = "https://todoo.5xcamp.us";
let jwt = "";
let nickname;
let obj = { user: {} };

// toggle login/signup
function goSignUp(e) {
  e.preventDefault();
  signUpForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
}

function goLogin(e) {
  e.preventDefault();
  loginForm.classList.remove("hidden");
  signUpForm.classList.add("hidden");
}

function toSignUp() {
  axios
    .post(`${_url}/users`, obj)
    .then((response) => {
      alert(response.data.message);
      location.reload();
    })
    .catch((error) => {
      alert("此帳號密碼已存在，請重新註冊");
      signUpEmail.value = "";
      signUpNick.value = "";
      signUpPassword.value = "";
      signUpPasswordAgain.value = "";
    });
}

function toLogin() {
  axios
    .post(`${_url}/users/sign_in`, obj)
    .then((response) => {
      console.log(response.data);
      jwt = response.headers.authorization;
      console.log(jwt);
      nickname = response.data.nickname;
      localStorage.setItem("userToken", jwt);
      localStorage.setItem("userNickname", nickname);
      redirect();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

// check signUpForm
function checkEmail(e) {
  const emailRule =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  if (!emailRule.test(signUpEmail.value)) {
    warnSignUpEmail.classList.remove("hidden");
    return false;
  } else {
    warnSignUpEmail.classList.add("hidden");
    return true;
  }
}

function checkNick(e) {
  const length = signUpNick.value.length;
  if (length < 1) {
    warnSignUpNick.classList.remove("hidden");
    return false;
  } else {
    warnSignUpNick.classList.add("hidden");
    return true;
  }
}

function checkPassword(e) {
  const length = signUpPassword.value.length;
  if (length < 6 || signUpPassword.value != signUpPasswordAgain.value) {
    warnSignUpPassword.classList.remove("hidden");
    return false;
  } else {
    warnSignUpPassword.classList.add("hidden");
    return true;
  }
}

function checkPasswordAgain(e) {
  if (
    signUpPassword.value !== signUpPasswordAgain.value ||
    signUpPasswordAgain.value.length === 0
  ) {
    warnSignUpPasswordAgain.classList.remove("hidden");
    return false;
  } else {
    warnSignUpPasswordAgain.classList.add("hidden");
    return true;
  }
}

function signUp(e) {
  e.preventDefault();

  if (
    !checkEmail() ||
    !checkNick() ||
    !checkPassword() ||
    !checkPasswordAgain()
  ) {
    checkEmail();
    checkNick();
    checkPassword();
    checkPasswordAgain();
    alert("請輸入正確內容");
  } else {
    obj.user.email = signUpEmail.value;
    obj.user.nickname = signUpNick.value;
    obj.user.password = signUpPassword.value;
    toSignUp();
  }
}

function login(e) {
  e.preventDefault();

  if (loginEmail.value < 1 || loginPassword.value < 1) {
    alert("請輸入正確內容");
    location.reload();
    return;
  } else {
    obj.user.email = loginEmail.value;
    obj.user.password = loginPassword.value;
    toLogin();
  }
}

function redirect() {
  if (localStorage.getItem("userToken")) {
    document.location.href = "./todo.html";
  } else {
    console.log("no token");
  }
}

// toggle login/signup
goSignUpBtn.addEventListener("click", goSignUp);
goLoginBtn.addEventListener("click", goLogin);

// check signUpForm
signUpForm.addEventListener("input", checkEmail);
signUpForm.addEventListener("input", checkNick);
signUpForm.addEventListener("input", checkPassword);
signUpForm.addEventListener("input", checkPasswordAgain);

// check loginForm
loginForm.addEventListener("input", checkEmail);
loginForm.addEventListener("input", checkNick);

// signUp
signUpBtn.addEventListener("click", signUp);

// login
loginBtn.addEventListener("click", login);

// redirect();
