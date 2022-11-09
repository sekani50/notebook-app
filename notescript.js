// JavaScript source code

//MODEL
function displayDate() {
    //getting current date
    let date = new Date()

    return date.toLocaleString();
}


const textToDisplay = [];
const slicedText = {};

let count = 1;


function htmlElementCreator(note) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(note, 'text/html');

    return doc.body.childNodes[0];

}


let firstHead = htmlElementCreator("<p id='head'>Empty Note</p>");
let firstDate = displayDate();


//console.log(textToDisplay);

const stores = JSON.parse(localStorage.getItem("cerebra"));

//const stores = null;

// "<p id='head'>" + val.Note + "<p>"
// console.log(stores);

if (stores != null) {

    let mapping = stores.map((val) => ({

        ...val,

        Note: htmlElementCreator("<p id='head'>" + val.Note + "<p>"),


    }));

    //console.log(mapping);

    textToDisplay.push(...mapping);


}
else {
    //check if the saved data is an array, then retrieve it, or else
    textToDisplay.push({ Note: firstHead, ID: count, Date: firstDate });
}
//console.log(textToDisplay);

const storeDissolveObjectVal = [];

textToDisplay.forEach((object) => {

    storeDissolveObjectVal.push(Object.values(object));
})

storeDissolveObjectVal.reverse().forEach((value) => {

    document.getElementById("text").setAttribute("disabled", "");


    let displayNote = document.getElementById("display-note");



    //displayNote.innerHTML = "";
    let displayBox = document.createElement("div");
    displayBox.setAttribute("id", "display-box");


    let newNote = document.createElement("div");
    newNote.setAttribute("id", "new-note");
    newNote.setAttribute("onclick", "updateText(" + value[1] + ")");

    //date
    let dt = document.createElement("span");
    dt.setAttribute("id", "date");



    let dateAndTime = document.createTextNode(value[2]);
    //console.log(dateAndTime);
    dt.appendChild(dateAndTime);

    //console.log(dt);

    //button
    let button = document.createElement("button");
    button.setAttribute("id", "btn");
    button.setAttribute("onclick", "deleteNote(" + value[1] + ")");

    let btnName = htmlElementCreator("<i class='fa-solid fa-xmark'>");
    button.appendChild(btnName);


    let newHeading = value[0];

    ///console.log(newHeading);



    displayBox.appendChild(button);

    newNote.appendChild(dt);

    newNote.appendChild(newHeading);


    displayBox.appendChild(newNote);
    displayNote.appendChild(displayBox);

})





document.getElementById("new").addEventListener('click', createNewNote);
function createNewNote() {

    event.preventDefault();


    const smallArr = [];


    if (textToDisplay != null) {

        textToDisplay.slice(-1).forEach((obj) => {

            Object.keys(obj).forEach((val) => {

                smallArr.push(obj[val]);
            })
        })
    }

    if (smallArr[1] != undefined) {
        count = smallArr[1];
        //console.log(count);
        count++;


    }
    else {

        //number of clicks
        count++
    }


    //count++;

    document.getElementById("text").value = "Empty note";
    //document.getElementById("text").style.display = "block";
    document.getElementById("text").disabled = false;

    let displayBox = document.createElement("div");
    displayBox.setAttribute("id", "display-box");

    let newNote = document.createElement("div");
    newNote.setAttribute("id", "new-note");
    newNote.setAttribute("onclick", "updateText(" + count + ")");

    //date
    let dt = document.createElement("span");
    dt.setAttribute("id", "date");



    let dateAndTime = document.createTextNode(displayDate());
    console.log(dateAndTime);
    dt.appendChild(dateAndTime);

    console.log(dt);

    //button
    let button = document.createElement("button");
    button.setAttribute("id", "btn");
    button.setAttribute("onclick", "deleteNote(" + count + ")");

    let btnName = htmlElementCreator("<i class='fa-solid fa-xmark'>");

    button.appendChild(btnName);

    //note text
    let newHeading = document.createElement("p");
    newHeading.setAttribute("id", "head");

    let textNode = document.createTextNode('Empty Note');
    newHeading.appendChild(textNode);

    //console.log(newHeading);

    displayBox.appendChild(button);



    //let existingNote = document.getElementById("new-note");



    newNote.appendChild(dt);
    //newNote.appendChild(button);
    newNote.appendChild(newHeading);

    displayBox.appendChild(newNote);

    let existingNote = document.getElementById("display-box");

    let displayNote = document.getElementById("display-note");
    displayNote.insertBefore(displayBox, existingNote);

    textToDisplay.push({ Note: newHeading, ID: count, Date: displayDate() });


    storageFunction();

}


document.getElementById('text').addEventListener("keyup", onKeyPress);


function onKeyPress(event) {

    //get keycode
    //let code = event.keyCode;
    //get keys
    //let key = event.key;
    //console.log(count);

    let textVal = event.target.value;
    let status = document.getElementById("head");

    status.innerHTML = textVal.replace(/(\r\n|\n\r|\r|\n)/g, "<br/>");

    storageFunction();



}

//textToDisplay.push(...newArray);
//console.log(textToDisplay);


storageFunction();

function storageFunction() {

    let mapped = textToDisplay.map((val) => ({

        ...val,

        Note: val.Note.innerHTML,


    }));

    //console.log(mapped)

    localStorage.setItem("cerebra", JSON.stringify(mapped));

}




//VIEW
function updateText(n) {


    let textArea = document.getElementById("text");

    textArea.disabled = false;

    textArea.value = "";

    let find = textToDisplay.find(arr => arr.ID == n);

    if (find != undefined) {
        let savedText = find.Note.innerHTML;
        //console.log(savedText);


        //console.log("id" + find.ID);
        //console.log("n " + n);
        //console.log("n " + find.ID);

        let newNote = find.Note;

        let existingNote = document.getElementById("display-box");


        let newFirstChild = newNote.parentNode.parentNode;

        //console.log(newFirstChild);
        //console.log(newNote);
        //console.log(existingNote);

        //set the displayed as the first child
        newFirstChild.parentNode.insertBefore(newFirstChild, existingNote);

        //Display each text in the textarea
        textArea.value = savedText.replace(/\s?(<br\s?\/?>)\s?/g, "\r\n");


    }
}

///active class
let boxes = document.querySelectorAll("#new-note");
//console.log(boxes);
boxes.forEach((box, idx) => {
    box.addEventListener('click', () => {
        toggleActive(box, idx);
    });
});

function toggleActive(el, index) {
    el.classList.toggle('new-box');
    boxes.forEach((box, idx) => {
        if (idx !== index) {
            box.classList.remove("new-box");
        }
    });
}

//CONTROLLER
function deleteNote(n) {

    let textArea = document.getElementById("text");

    textArea.disabled = false;

    let find = textToDisplay.find(arr => arr.ID == n);

    textToDisplay.splice(textToDisplay.findIndex(ar => ar.ID == n), 1);

    storageFunction();

    let newNote = find.Note;

    //console.log(newNote);
    //console.log(find);

    let displayNote = document.getElementById("display-note");

    displayNote.removeChild(newNote.parentNode.parentNode);
}

//////////////////////////////////////////////////////
////
document.getElementById("menu").addEventListener('click', function () {


    let sub = document.getElementById("sub-one");
    //sub.style.display = "block";

    if (sub.style.display === "block") {
        sub.style.display = "none";
        document.getElementById("first").style.height = "50px";


    }
    else {

        sub.style.display = "block";
        document.getElementById("first").style.height = "200px";

    }


})

////////////////////////////////////////////////////////////

document.getElementById("search").addEventListener('keyup', filterSearch);

function filterSearch() {


    let note = document.querySelectorAll("#display-box");


    let input = document.getElementById("search").value;

    //noteTxt = document.getElementById("")
    for (let i = 0; i < note.length; i++) {

        let noteTxt = note[i].getElementsByTagName("p")[0];

        if (noteTxt.textContent.toLowerCase().includes(input.toLowerCase())) {

            note[i].style.display = "";

        }
        else {
            note[i].style.display = "none";
        }
    }

}
