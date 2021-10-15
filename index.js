const taskContainer = document.querySelector(".task__container");
const modalContainer = document.querySelector(".openModalBody");
let GlobalStore = [];

const newCard = ({ id,
  imgUrl,
  taskTitle,
  taskType,
  taskDes
}) => `<div class="col-md-6 col-lg-4 mt-3 mb-3" id=${id}>
<div class="card shadow">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-outline-success" id=${id} onClick="editCard.apply(this, arguments)">
    <i class="fas fa-pencil-alt" id=${id} onClick="editCard.apply(this, arguments)"></i></button>
    <button type="button" class="btn btn-outline-danger" id=${id} onclick="deleteCard.apply(this, arguments)">
    <i class="fas fa-trash" id=${id} onclick="deleteCard.apply(this, arguments)"></i></button>
  </div>
  <div class="card-body container" id="cardBody">
    <img class="card-img-top mb-3" alt="photo" src=${imgUrl}/>
    <h5 class="card-title editable" >${taskTitle}</h5>
    <p class="card-text editable" >${taskDes}</p>
    <span class="badge bg-primary editable" >${taskType}</span>
  </div>
  <div class="card-footer text-muted d-flex justify-content-end">
    <button type="button" class="btn btn-outline-primary" id=${id} onclick="openTask.apply(this, arguments)" data-bs-toggle="modal" data-bs-target="#openModal" >
    Open Task</button>
  </div>
</div>
</div>`;

const openTaskBody = ({ imgUrl,
  taskTitle,
  taskType,
  taskDes }) => `<div class="mb-3 img__Container">
<img src="${imgUrl}" style="width:450px; heigth:450px;" alt="picture"/>
</div>
<div class="mb-3 title__Container">
<h1>${taskTitle}</h1>
</div>
<div class="mb-3 title__Des">
<p> ${taskDes} </p>
</div>
<div class="mb-3 badge__Container">
<span class="badge bg-primary">${taskType}</span>
</div>`;

// localStorage
const updateLocalStorage = () => localStorage.setItem("tasky", JSON.stringify({ cards: GlobalStore }));
const loadInitialCardData = () => {
  const getInitialData = localStorage.tasky;
  if (!getInitialData) return;
  const { cards } = JSON.parse(getInitialData);
  cards.map((card) => {
    const createNewCard = newCard(card);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    GlobalStore.push(card);
  });
};

// Saving Changes and updating localStorage
const saveChanges = () => {
  const taskdata = {
    id: `${Date.now()}`, //unique id for Cards
    imgUrl: document.getElementById("imgurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDes: document.getElementById("taskdes").value,
  };
  console.log(taskdata);
  const createNewCard = newCard(taskdata);
  taskContainer.insertAdjacentHTML("beforeend", createNewCard);
  GlobalStore.push(taskdata);
  updateLocalStorage();
};

// Deleting 
const deleteCard = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;
  GlobalStore = GlobalStore.filter(
    (card) => card.id !== targetId
  );
  updateLocalStorage();
  if (tagname === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  }
  return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode
  );
};

//Editing
const editCard = (event) => {
  event = window.event;
  tagname = event.target.tagName;
  let parent;
  if (tagname === "BUTTON") {
    parent = event.target.parentNode.parentNode.parentNode // col-lg-4
  } else { parent = event.target.parentNode.parentNode.parentNode.parentNode };
  const cardBody = parent.querySelector('#cardBody');
  var fields = cardBody.querySelectorAll(".editable");
  for (let i = 0; i < fields.length; i++) {
    fields[i].setAttribute("contenteditable", "true");
  }
  saveButton = parent.querySelector(".card-footer").querySelector("button");
  saveButton.setAttribute("onClick", "SavingMainCardChanges.apply(this, arguments)");
  saveButton.setAttribute("data-bs-toggle", "");
  saveButton.setAttribute("data-bs-target", "");
  saveButton.textContent = "save Changes";
};

// Saving changes edit and global store part
const SavingMainCardChanges = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const targetname = event.target.tagName
  const parent = event.target.parentNode.parentNode;
  console.log(parent);
  const cardBody = parent.querySelector('#cardBody');
  var fields = cardBody.querySelectorAll(".editable");
  for (let i = 0; i < fields.length; i++) {
    fields[i].setAttribute("contenteditable", "false");
  };
  CardTaskTitle = cardBody.querySelector(".card-title").textContent;
  CardTaskDesc = cardBody.querySelector(".card-text").textContent;
  CardTaskType = cardBody.querySelector(".badge").textContent;
  GlobalStore.forEach((card) => {
    if (card.id == targetId) {
      console.log("got in the if block.")
      card.taskTitle = CardTaskTitle;
      card.taskType = CardTaskType;
      card.taskDes = CardTaskDesc;
      console.log(card);
    };
  })
  console.log(GlobalStore);
  updateLocalStorage();
  openButton = parent.querySelector(".card-footer").querySelector("button");
  openButton.setAttribute("onClick", "openTask.apply(this, arguments)");
  saveButton.setAttribute("data-bs-toggle", "modal");
  saveButton.setAttribute("data-bs-target", "#openModal");
  openButton.textContent = "Open task";
};

// Opening Task modal for card 
const openTask = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const parent = event.target.parentNode.parentNode;
  const cardBody = parent.querySelector('#cardBody');
  const openTaskObject = {
    imgUrl: cardBody.querySelector(".card-img-top").getAttribute('src'),
    taskTitle: cardBody.querySelector(".card-title").textContent,
    taskType: cardBody.querySelector(".badge").textContent,
    taskDes: cardBody.querySelector(".card-text").textContent,
  }
  const modalContext = openTaskBody(openTaskObject);
  console.log(openTaskObject);
  modalContainer.insertAdjacentHTML("beforeend", modalContext);
  console.log(modalContainer);
};
