// Get Element
const loginPage = document.getElementById("loginPage");
const productPage = document.getElementById("productPage");
const addProductPage = document.getElementById("addProductPage");
const detailsPage = document.getElementById("detailsPage");
const logoutBtn = document.getElementById("logout");
let products = [];
if (JSON.parse(localStorage.getItem("products")) !== null) {
  products = JSON.parse(localStorage.getItem("products"));
}

// Login Page
if (loginPage) {
  // Element
  const loginBtn = document.getElementById("logbtn");
  const userEmail = document.getElementById("email");
  const userPass = document.getElementById("password");
  const shwoPass = document.getElementById("show");
  const hidePass = document.getElementById("hide");
  // Function
  loginBtn.onclick = login;
  shwoPass.onclick = shwoPassword;
  hidePass.onclick = hidePassword;
  // Shwo and Hide Password Function
  function shwoPassword() {
    userPass.getAttribute("type") === "password"
      ? userPass.setAttribute("type", "text")
      : "";
    shwoPass.style.display = "none";
    hidePass.style.display = "block";
  }
  function hidePassword() {
    userPass.getAttribute("type") === "text"
      ? userPass.setAttribute("type", "password")
      : "";
    hidePass.style.display = "none";
    shwoPass.style.display = "block";
  }

  // Email Validtion
  function validateEmail(email) {
    const userName = "admin";
    let emailCheck = false;
    if (email === "") {
      document.getElementById("emError").innerHTML = "Please Enter Email";
      userEmail.classList.add("not-valid");
    } else if (email !== userName) {
      document.getElementById("emError").innerHTML = "Email Not Correct";
      userEmail.classList.add("not-valid");
    } else {
      document.getElementById("emError").innerHTML = "";
      userEmail.classList.add("valid");
      emailCheck = true;
    }
    return emailCheck;
  }

  // Password Validtion
  function validatePass(pass) {
    const password = "1234";
    let passCheck = false;
    if (pass === "") {
      document.getElementById("passError").innerHTML = "Please Enter Password";
      userPass.classList.add("not-valid");
    } else if (pass !== password) {
      document.getElementById("passError").innerHTML = "Password Not Correct";
      userPass.classList.add("not-valid");
    } else {
      document.getElementById("passError").innerHTML = "";
      userPass.classList.add("valid");
      passCheck = true;
    }
    return passCheck;
  }

  // Login function
  function login(event) {
    event.preventDefault();
    let emailValid = validateEmail(userEmail.value);
    let passValid = validatePass(userPass.value);
    if (emailValid === true && emailValid === passValid) {
      localStorage.setItem("admin", emailValid);
      window.location.href = "../page/product.html";
    }
  }
}

// Product Page
if (productPage) {
  // Element
  const container = document.getElementById("productContainer");
  // Function
  checkLogin();
  logoutBtn.onclick = logout;
  // Check for a product
  products.length !== 0
    ? displayProduct(products)
    : (container.innerHTML = `<h3 class="no-product">No Product Add </h3>`);
  // Display Function
  function displayProduct(arr) {
    let containerProduct = "";
    for (const product of arr) {
      containerProduct += `
      <div class="box" key=${arr.indexOf(product)}>
      <div class="inner">
        <div class="prouduct-img">
          <img src="${product["image"]}" alt="" srcset="" />
        </div>
        <div class="info">
          <h3 class="name">${product["name"]}</h3>
          <h3 class="price">price : ${product["price"]} L.E</h3>
          <h3 class="quantity">Quantity : ${product["quantity"]}</h3>
          <div class="delete"></div>
        </div>
      </div>
    </div>
      `;
    }
    container.innerHTML = containerProduct;
  }

  // Go To Details
  const boxProduct = document.querySelectorAll(".box");
  boxProduct.forEach(function (product) {
    const productId = product.getAttribute("key");
    product.onclick = function () {
      url = "../page/details.html?id=" + encodeURIComponent(productId);
      window.location.href = url;
    };
  });
}

// Add And Edit Product Page
if (addProductPage) {
  // Element
  const productName = document.getElementById("Pname");
  const productPrice = document.getElementById("Pprice");
  const productDisc = document.getElementById("Pdisc");
  const productQuantity = document.getElementById("Pquantity");
  const productImg = document.getElementById("Pimg");
  const addBtn = document.getElementById("addBtn");
  let url = document.location.href;
  let prouductId = url.split("?")[1];
  let img;
  // Functiono
  checkLogin();
  productImg.onchange = getImgName;
  logoutBtn.onclick = logout;

  // save Imges Name
  function getImgName(event) {
    const image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", () => {
      img = reader.result;
    });
  }

  // Function Get Input Value
  function inputValue() {
    const product = {
      name: productName.value,
      quantity: productQuantity.value,
      price: productPrice.value,
      Disc: productDisc.value,
      image: img,
    };
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Clear Form
  function clearForm() {
    productName.value = "";
    productQuantity.value = "";
    productPrice.value = "";
    productDisc.value = "";
    productImg.value = "";
  }

  // Add Proudct Function
  function addProduct(event) {
    event.preventDefault();
    inputValue();
    clearForm();
    url = "../page/product.html";
    window.location.href = url;
  }

  // Check about id in Url to Connfert To Edit Mode
  function dataEdit(id) {
    let currentProuduct = products[id.split("=")[1]];
    productName.value = currentProuduct["name"];
    productQuantity.value = currentProuduct["quantity"];
    productPrice.value = currentProuduct["price"];
    productDisc.value = currentProuduct["Disc"];
    document.getElementById("legendForm").innerHTML = "Edit Product";
    document.getElementById("img-input").style.display = "none";
    addBtn.value = "Edit product";
    addBtn.onclick = editProduct;
  }

  // Edit product
  function editProduct(event) {
    let currentProuduct = prouductId.split("=")[1];
    event.preventDefault();
    productImg.onchange = getImgName;
    const product = {
      name: productName.value,
      quantity: productQuantity.value,
      price: productPrice.value,
      Disc: productDisc.value,
      image: products[currentProuduct]["image"],
    };
    products[currentProuduct] = product;
    localStorage.setItem("products", JSON.stringify(products));
    url = "../page/details.html?id=" + encodeURIComponent(currentProuduct);
    window.location.href = url;
  }
  // Connfert  Mode
  prouductId ? dataEdit(prouductId) : (addBtn.onclick = addProduct);
}

// Details Page Page
if (detailsPage) {
  // Element
  let url = document.location.href;
  let id = url.split("?")[1].split("")[3];
  const container = document.getElementById("productContainer");
  const products = JSON.parse(localStorage.getItem("products"));
  // Function
  // Shwo details
  (function () {
    const containerProduct = `
    <div class="box" key=${id}>
    <div class="img">
    <img src="${products[id]["image"]}" alt="" srcset="" />
    </div>
    <div class="info">
    <div class="text">
    <h3 class="name">${products[id]["name"]}</h3>
    <h3 class="price">price : ${products[id]["price"]} L.E</h3>
    <h3 class="quantity">Quantity : ${products[id]["quantity"]}</h3>
    <h3 class="quantity">Quantity : ${products[id]["Disc"]}</h3>
    </div>
      <div class="edit">
      <button type="button" class= "editbtn" id="editbtn"> Edit </button>
      <button type="button" class= "del" id="del"> Delete </button>
      </div>
    </div>
</div>
  `;
    container.innerHTML = containerProduct;
  })();

  //  Delete product
  const del = document.getElementById("del");
  del.onclick = function () {
    products.splice(id, 1);
    localStorage.setItem("products", JSON.stringify(products));
    window.location.href = "../page/product.html";
  };

  // Go To Edite
  const editbtn = document.getElementById("editbtn");
  editbtn.onclick = function () {
    url = "../page/Addproducts.html?editId=" + encodeURIComponent(id);
    window.location.href = url;
  };

  logoutBtn.onclick = logout;
}

// go to Login Function
function checkLogin() {
  if (localStorage.getItem("admin") === null) {
    window.location.href = "../index.html";
  }
}

// Logout function
function logout() {
  console.log("index");
  window.location.href = "../index.html";
  localStorage.removeItem("admin");
}
const navBtn = document.getElementById("nav-btn");
navBtn.onclick = function () {
  const menu = document.getElementById("menu");
  const span = document.querySelector(
    "#navbar .contaier .nav-btn span:nth-child(2)"
  );
  menu.classList.toggle("active");
  [menu.className].join(" ").includes("active")
    ? (span.style.width = 30 + "px")
    : (span.style.width = 20 + "px");
};
