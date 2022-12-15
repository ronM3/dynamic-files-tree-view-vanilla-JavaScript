const select = document.getElementById("select");
let contextMenu = document.getElementById("context-menu");
const hierarchy = document.getElementById("hierarchy");
const rootContiner = document.querySelector("#root_container");
let events = ["contextmenu"];
const deleteB = document.querySelector("#deleteB");
let elementsSelector = rootContiner.querySelectorAll('.folder, .file ');


function addNewFile() {
  const fileName = document.getElementById("name").value;
  const fileType = select.options[select.selectedIndex].value;
  const fileParent = document.getElementById("parent").value;
  let newFile = {
    fileName: fileName,
    fileType: fileType,
    fileParent: fileParent,
  };
  if (valiadateForm(newFile)) {
    createElementInUi(newFile);
    cleanForm();
  }
}

function createFolder(newFile, container) {
  const folder = document.createElement("div");
  folder.setAttribute("class", "folder_container");
  const folderSpan = document.createElement("span");
  folderSpan.setAttribute("class", "folder fa-folder");
  folderSpan.innerText = newFile.fileName;
  let isExpanded = folder.dataset.isexpanded == "true";
  folder.dataset.isexpanded = !isExpanded;
  folder.style.display = isExpanded ? "none" : "block";
  container.appendChild(folder).appendChild(folderSpan);
}

function createElementInUi(newFile) {
  const arrayElement = document.querySelectorAll(".folder");

  for (let index = 0; index < arrayElement.length; index++) {
    console.log(arrayElement[index]);
    if (
      arrayElement[index].innerText === newFile.fileParent &&
      newFile.fileType === "folder"
    ) {
      console.log(arrayElement[index].parentElement);
      createFolder(newFile, arrayElement[index].parentElement);
    } else if (
      arrayElement[index].innerText === newFile.fileParent &&
      newFile.fileType === "file"
    ) {
      const file = document.createElement("span");
      file.setAttribute("class", "file fa-file");
      file.innerText = newFile.fileName;
      arrayElement[index].parentElement.appendChild(file);
    } else if (arrayElement[index].innerText != newFile.fileParent) {
    }

  }
}
const valiadateForm = (newFile) => {
  let missingName = document.getElementById("missingName");
  let missinType = document.getElementById("missinType");
  let missingParent = document.getElementById("missingParent");

  if (newFile.fileName === "") {
    missingName.innerHTML = "Name required";
    return false;
  }
  missingName.innerHTML = '<i class="fas fa-check-circle"></i>';
  if (newFile.fileType === "") {
    missinType.innerHTML = "Type required";
    return false;
  }
  missinType.innerHTML = '<i class="fas fa-check-circle"></i>';
  if (newFile.fileParent === "") {
    missingParent.innerHTML = "Parent name required";
    return false;
  }
  missingParent.innerHTML = '<i class="fas fa-check-circle"></i>';
  return true;
};

function cleanForm() {
  const fileName = document.getElementById("name");
  const options = document.querySelectorAll("select option");
  for (var i = 0; i < options.length; i++) {
    options[i].selected = options[i].defaultSelected;
  }
  const fileParent = document.getElementById("parent");
  fileName.value = "";
  fileParent.value = "";
  let missingName = document.getElementById("missingName");
  let missinType = document.getElementById("missinType");
  let missingParent = document.getElementById("missingParent");
  missingName.innerHTML = "";
  missinType.innerHTML = "";
  missingParent.innerHTML = "";
}

select.addEventListener("change", function handleChange(event) {});


rootContiner.addEventListener('change',(event) => {
  if (event){
    elementsSelector = rootContiner.querySelectorAll('.folder, .file ');
    console.log(elementsSelector);
  }
  return elementsSelector; 
})

elementsSelector.forEach((element) => {element.addEventListener('contextmenu',(e) => {
  e.preventDefault();
      if(e.target.innerText === 'root'){
        return;
      }
      let mouseX = e.clientX || e.touches[0].clientX;
      let mouseY = e.clientY || e.touches[0].clientY;
      let menuHeight = contextMenu.getBoundingClientRect().height;
      let menuWidth = contextMenu.getBoundingClientRect().width;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let element = e.target;
      //If user clicks near right corner
      if (width - mouseX <= 200) {
        contextMenu.style.borderRadius = "5px 0 5px 5px";
        contextMenu.style.left = width - menuWidth + "px";
        contextMenu.style.top = mouseY + "px";
        //right bottom
        if (height - mouseY <= 200) {
          contextMenu.style.top = mouseY - menuHeight + "px";
          contextMenu.style.borderRadius = "5px 5px 0 5px";
        }
      }
      //left
      else {
        contextMenu.style.borderRadius = "0 5px 5px 5px";
        contextMenu.style.left = mouseX + "px";
        contextMenu.style.top = mouseY + "px";
        //left bottom
        if (height - mouseY <= 200) {
          contextMenu.style.top = mouseY - menuHeight + "px";
          contextMenu.style.borderRadius = "5px 5px 5px 0";
        }
      }
      contextMenu.style.visibility = "visible";
      deleteB.addEventListener("click", function (e) {
        const parentElement = element.parentElement;
        const parentConainer = parentElement.parentElement
        let type = element.classList.contains("folder") ? "folder" : "file";
        if (type == "folder") {
          parentConainer.removeChild(parentElement)
        }
        else{
          parentElement.removeChild(element);
        }
        contextMenu.style.visibility = "hidden";
      });
    },
    { passive: false }
  );
});
rootContiner.addEventListener("click", function (e) {
  if (!contextMenu.contains(e.target)) {
    contextMenu.style.visibility = "hidden";
  }
});

rootContiner.addEventListener("click", function (event) {
  const element = event.target;
  if (
    element.tagName.toLowerCase() == "span" &&
    element !== event.currentTarget
  ) {
    let type = element.classList.contains("folder") ? "folder" : "file";
    if (type == "file") {
      alert("File access working");
    }
    if (type == "folder") {
      let isExpanded = element.dataset.isexpanded == "true";
      if (isExpanded) {
        element.classList.remove("fa-folder-o");
        element.classList.add("fa-folder");
      } else {
        element.classList.remove("fa-folder");
        element.classList.add("fa-folder-o");
      }
      element.dataset.isexpanded = !isExpanded;

      let toggleElements = [].slice.call(element.parentElement.children);
      let classnames = "file,folder_container,noitems".split(",");

      toggleElements.forEach(function (element) {
        if (
          classnames.some(function (val) {
            return element.classList.contains(val);
          })
        )
          element.style.display = isExpanded ? "none" : "block";
      });
    }
  }
});
