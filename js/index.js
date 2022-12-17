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
// const warnLoginEmail = document.querySelector(".warnLoginEmail");

const loginPassword = document.querySelector(".loginPassword");
// const warnLoginPassword = document.querySelector(".warnLoginPassword");

// btn
const signUpBtn = document.querySelector(".signUpBtn");
const loginBtn = document.querySelector(".loginBtn");
const goSignUpBtn = document.querySelector(".goSignUpBtn");
const goLoginBtn = document.querySelector(".goLoginBtn");

const _url = "https://todoo.5xcamp.us";
let token = "";
let nickname;
let obj = { user: {} };

// toggle login & signup
const goSignUp = (e) => {
  e.preventDefault();
  signUpForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
};

const goLogin = (e) => {
  e.preventDefault();
  loginForm.classList.remove("hidden");
  signUpForm.classList.add("hidden");
  location.reload();
};

const toSignUp = () => {
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
};

const toLogin = () => {
  axios
    .post(`${_url}/users/sign_in`, obj)
    .then((response) => {
      token = response.headers.authorization;
      nickname = response.data.nickname;
      localStorage.setItem("authorization", token);
      localStorage.setItem("nickname", nickname);
      location.href = "todo.html";
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

// check signUpForm
const checkEmail = (e) => {
  const emailRule =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  if (!emailRule.test(signUpEmail.value)) {
    warnSignUpEmail.classList.remove("hidden");
    return false;
  } else {
    warnSignUpEmail.classList.add("hidden");
    return true;
  }
};

const checkNick = (e) => {
  const length = signUpNick.value.length;
  if (length < 1) {
    warnSignUpNick.classList.remove("hidden");
    return false;
  } else {
    warnSignUpNick.classList.add("hidden");
    return true;
  }
};

const checkPassword = (e) => {
  const length = signUpPassword.value.length;
  if (length < 6) {
    warnSignUpPassword.classList.remove("hidden");
    return false;
  } else {
    warnSignUpPassword.classList.add("hidden");
    return true;
  }
};

const checkPasswordAgain = (e) => {
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
};

const signUp = (e) => {
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
};

const login = (e) => {
  e.preventDefault();
  if (loginEmail.value === "" || loginPassword.value === "") {
    alert("請輸入正確內容");
    location.reload();
    return;
  } else {
    obj.user.email = loginEmail.value;
    obj.user.password = loginPassword.value;
    toLogin();
  }
};

// toggle login/signup
goSignUpBtn.addEventListener("click", goSignUp);
goLoginBtn.addEventListener("click", goLogin);

// check signUpForm
signUpForm.addEventListener("input", checkEmail);
signUpForm.addEventListener("input", checkNick);
signUpForm.addEventListener("input", checkPassword);
signUpForm.addEventListener("input", checkPasswordAgain);

// signUp
signUpBtn.addEventListener("click", signUp);

// login
loginBtn.addEventListener("click", login);
