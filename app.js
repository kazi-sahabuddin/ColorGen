
//Globals
const defaultPresetColors = [
    '#ffcdd2',
    '#f8bbd0',
    '#e1bee7',
    '#ff8a80',
    '#ff80fc',
    '#ff80ab',
    '#ea80fc',
    '#b39ddb'
];

let customColors = [];


// onload hendler
window.onload = () =>{
    main();
    const customColorString = localStorage.getItem("custom-colors");
    if(customColorString)
    {
        customColors = JSON.parse(customColorString);
    }
    displayColorBoxes(document.getElementById('preset-colors'), defaultPresetColors);
    displayColorBoxes(document.getElementById('custom-colors'), customColors);
}

// main or boot function this function take care of getting all the DOM referances
function main(){

    //DOM refenances   
    const randomColorBnt = document.getElementById("random-color");
    const hexInput = document.getElementById("hex-input");   
    const colorSliderRed = document.getElementById("color-slider-red");
    const colorSliderGreen = document.getElementById("color-slider-green");
    const colorSliderBlue = document.getElementById("color-slider-blue");
    const saveToCustomBtn = document.getElementById("save-to-custom");
    const copyToClipboardBtn = document.getElementById("copy-to-clipboard");
    const presetColorParent = document.getElementById("preset-colors");
    const customColorParent = document.getElementById("custom-colors");
   
    //Event listeners
    randomColorBnt.addEventListener('click',handleRandomGenerateBtn);
    hexInput.addEventListener('keyup', handleHexInput);
    colorSliderRed.addEventListener('change',handleColorSliders(colorSliderRed,colorSliderGreen,colorSliderBlue));
    colorSliderGreen.addEventListener('change',handleColorSliders(colorSliderRed,colorSliderGreen,colorSliderBlue));
    colorSliderBlue.addEventListener('change',handleColorSliders(colorSliderRed,colorSliderGreen,colorSliderBlue));
    copyToClipboardBtn.addEventListener("click",handleCopyToClipboard);
    presetColorParent.addEventListener('click',handlePresetColors);    
    saveToCustomBtn.addEventListener("click",handleSaveToCustomColorBtn(customColorParent,hexInput));
    customColorParent.addEventListener('click',handlePresetColors); 
}


// Event Handlers
function handleRandomGenerateBtn(){
    const color = generateColor();
    updateColorToDom(color);
}

function handleHexInput(e){
    const color = e.target.value;
    if(color)
    {
        this.value = color.toUpperCase();
        if(isValidHex(color))
        {
            const colorDcimal = hexToDecimalColors(color);
            updateColorToDom(colorDcimal);
           
        }
    }
    
}

function handleColorSliders(colorSliderRed,colorSliderGreen,colorSliderBlue){

    return function(){
        const color ={
            red: parseInt(colorSliderRed.value),
            green:  parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value)
            
        };

        updateColorToDom(color);
    }

}

function handleCopyToClipboard(){
    const colorModeRadios = document.getElementsByName("color-mode");
    
    const colorModeValue = getCheckedValueFromRadios(colorModeRadios);

    if(colorModeRadios==null)
    {
        throw new Error('Invalid Radio Input')
    }
    let copyColor = "";
    if(colorModeValue == "hex")
    {
        if(isValidHex(document.getElementById("hex-input").value)){
            copyColor = `#${document.getElementById("hex-input").value}`;
        }            
    }
    else
    {
        copyColor = document.getElementById("rgb-input").value;
    }
    if(copyColor.length != 0){
        navigator.clipboard.writeText(copyColor);
        generateToastMessage(`${copyColor} copid.`);
    }
    else{
        alert('Invalid Color Code.');
    }

}

function handlePresetColors(event){
    const child = event.target;
    if(child.className=='color-box'){
        navigator.clipboard.writeText(child.getAttribute('data-color'));
        generateToastMessage(`${child.getAttribute('data-color')} copid.`);
    }
}

function handleSaveToCustomColorBtn(customColorParent, hexInput){
   
    return function(){
        const color = `#${hexInput.value}`;
        if(customColors.includes(color))
        {
            alert("Already saved!");
            return;
        }
        if(customColors.length > 19)
            {
                customColors = customColors.slice(0,19);
            }
        customColors.unshift(color);
        localStorage.setItem('custom-colors',JSON.stringify(customColors));
        
        removeChildren(customColorParent);
        displayColorBoxes(customColorParent,customColors);
    }
}



// DOM functions

function generateToastMessage(msg)
{
    const div = document.createElement('div');
    div.innerText = msg;
    div.className = 'toast-message toast-message-slide-in'

    document.body.appendChild(div);
    setTimeout(function(){
        div.classList.remove('toast-message-slide-in');
        div.classList.add('toast-message-slide-out');
       
        
    },2000);
    setTimeout(() => {
        div.remove();
    }, 2450);
    

}

/**
 * find the checked elements from a list fo radio buttons
 * @param {Array} nodes 
 * @returns {string | null}
 */

function getCheckedValueFromRadios(nodes)
{
    let checkedValue = null;
    for(let i = 0; i < nodes.length; i++)
    {
        if(nodes[i].checked)
        {
            checkedValue = nodes[i].value;
        }
    }

    return checkedValue;

}

function updateColorToDom(color)
{
    const hexColor = generateHEXColor(color);
    const rgbColor = generateRGBColor(color);

    document.getElementById("color-body").style.backgroundColor = hexColor;
    document.getElementById("hex-input").value = hexColor.substring(1).toUpperCase();
    document.getElementById("rgb-input").value = rgbColor;
    document.getElementById("color-slider-red").value = color.red;
    document.getElementById("color-slider-green").value = color.green;
    document.getElementById("color-slider-blue").value = color.blue;
    document.getElementById("color-slider-red-label").innerHTML = color.red;
    document.getElementById("color-slider-green-label").innerHTML = color.green;
    document.getElementById("color-slider-blue-label").innerHTML = color.blue;

}
/**
 * create a div element with class name color-box
 * @param {string} color 
 * @returns {object}
 */  
function generateColorBox(color){
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    colorBox.setAttribute('data-color',color);
    return colorBox;
}
/**
 * this function will create and append new color box
 * @param {object} parent 
 * @param {Array} colors    
 */

function displayColorBoxes(parent, colors){
    colors.forEach((color) => {
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox);
    });
}

/**
 * remove all children from parent
 * @param {object} parent 
 */

function removeChildren(parent){
    let child = parent.lastElementChild;
    while(child)
    {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

// Utils

/**
 * Validate hex-color code
 * @param {string} color: ;
 * @returns {boolean}
 */

function isValidHex(color){
    if(color.length != 6)
        return false;
    return /^[0-9A-Fa-f]{6}$/i.test(color);
}

function generateHEXColor(color){
    
    let r = color.red.toString(16);
    let g = color.green.toString(16);
    let b = color.blue.toString(16);
    r=r.length<2?"0"+r:r;
    g=g.length<2?"0"+g:g;
    b=b.length<2?"0"+b:b;

    return `#${r+g+b}`;
}


function generateRGBColor(color){    

    return `rgb(${color.red},${color.green},${color.blue})`;
}



function generateColor(){
    const red = Math.floor(Math.random()*255);
    const green = Math.floor(Math.random()*255);
    const blue = Math.floor(Math.random()*255);  
    

    return {
        red,
        green,
        blue
    };
}

function hexToDecimalColors(hex)
{
    const red = parseInt(hex.slice(0,2),16);
    const green = parseInt(hex.slice(2,4),16);
    const blue = parseInt(hex.slice(4),16);
    return {
        red,
        green,
        blue
    };
}
