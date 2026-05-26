const form = document.querySelector("form");
const spinButton = document.getElementById("spinButton");
const itemList = document.getElementById("items");
const input = document.getElementById("input");
const deleteAll = document.getElementById("deleteAll");

let items = [];

function checkStorage(){

    const storedItems = localStorage.getItem("items");

    if(storedItems){

        items = JSON.parse(storedItems);

        for(const item of items){
            renderItem(item);
        }
    }
}

function saveItems(){
    const allItems = JSON.stringify(items);
    localStorage.setItem("items", allItems);
}

function editItem(itemName, itemText){
    const newName = prompt("Enter new item name:");

    if(newName && newName.trim() !== ""){
        
        const index = items.indexOf(itemName);

        if (index > -1) { 
            items[index] = newName;
            itemText.textContent = newName;
            saveItems();
        }
    }
}

function deleteItem(itemName, item){
    const index = items.indexOf(itemName);

    if (index > -1) { 
        items.splice(index, 1);
    }

    item.remove();
    saveItems();
}

function renderItem(itemName){

    const item = document.createElement("li");

    const itemText = document.createElement("span");
    itemText.textContent = itemName;

    item.appendChild(itemText);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    item.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    item.appendChild(editButton);

    editButton.addEventListener("click", () => 
        editItem(itemText.textContent, itemText)
    );

    deleteButton.addEventListener("click", () => 
        deleteItem(itemText.textContent, item)
    );

    itemList.appendChild(item);
}

function addItem(itemName){

    if(!items.includes(itemName)){

        items.push(itemName);

        saveItems();

        renderItem(itemName);

    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a valid item name.");
        return;
    }

     
    const newItems = text.split(/\s+/);

    for (const item of newItems) {
        addItem(item);
    }

    input.value = "";
});

deleteAll.addEventListener("click", () => {
    const allItems = document.querySelectorAll("li");
    allItems.forEach((e) => {
        e.remove();
    });

    items = [];
    saveItems();
})

checkStorage();