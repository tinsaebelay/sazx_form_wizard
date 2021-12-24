

/**
 * 
 * Template refferences
 */

let stepProgressIdicatorTemplate;

let stepTemplate;
/**
 * Question templates
 */
let radioButtomFormTemplate;
let textInputFormTemplate;
let textAreaInputFormTemplate;
let fileUrlFormTemplate;
let columnMapperFormTemplate;
let formulaEditorFormTemplate;
let resultTableFormTemplate;

/**
 * 
 * @param { Object } config The JSON used to construct the wizard
 * @param { String } rootDom  The Id of the div in which the prepared wizard is injected to
 */
let build = function (config, rootDomId) {


    /**
     * The root element to wich the wizard is inserted to
     */
    rootElement = document.querySelector(rootDomId);


    /**
     * Get the template  for 
     */
    stepTemplate = document.querySelector("#sazx-wiz-step-wrapper-template");
    stepProgressIdicatorTemplate = document.querySelector("#sazx-wiz-step-indicator-wrapper-template");


    radioButtomFormTemplate = document.querySelector("#sazx_wizard_template_radio_button");

    textInputFormTemplate = document.querySelector("#sazx_wizard_template_text");
    textAreaInputFormTemplate = document.querySelector("#sazx_wizard_template_textarea");;

    fileUrlFormTemplate = document.querySelector("#sazx_wizard_template_file_url");
    columnMapperFormTemplate = document.querySelector("#sazx_wizard_template_column-mapper");
    formulaEditorFormTemplate = document.querySelector("#sazx_wizard_template_formula_editor")
    resultTableFormTemplate = document.querySelector("#sazx_wizard_template_result_table");

    /**
     * Save the reffernces of  all the steps parent and  progress indicators parent 
     */

    stepsDOM = rootElement.querySelector(".content .steps");
    progressesDOM = rootElement.querySelector(".nav .list");


    /**
     * Build the steps and the progress indicator
     */

    config.steps.forEach((step, index) => {

        stepsDOM.append(buildStep(step, index));
        progressesDOM.append(buildProgressIndicator(step, index));



    });





    initWizard();

}


/**
 * Build the step DOM
 * @param {Object} stepConfig 
 * @returns 
 */
function buildStep(stepConfig, index) {


    let step = stepTemplate.content.firstElementChild.cloneNode(true);

    step.dataset.step_id = index;

    // Build Questions

    stepConfig.questions.forEach(question => {

        switch (question.type) {
            case "radio": {
                step.append(buildRadioQuestion(question));
                break;
            }
            /**
             * Text based inputs
             */
            case "text": {
                step.append(buildFreeTextQuestion(question));
                break;
            }
            case "email": {
                step.append(buildEmailQuestion(question));
                break;
            }
            case "url": {
                step.append(buildUrlQuestion(question));
                break;
            }
            case "tel": {
                step.append(buildTelephoneQuestion(question));
                break;
            }
            case "number": {
                step.append(buildNumberQuestion(question));
                break;
            }
            case "password": {
                step.append(buildPasswordQuestion(question));
                break;
            }

            case "textarea": {
                step.append(buildTextAreaQuestion(question));
                break;
            }

            // :End Text Based Inputs


            case "file": {
                step.append(buildFileUrlQuestion(question));
                break;
            }

            case "column_mapper": {
                step.append(buildColumnMapperQuestion(question));
                break;
            }

            case "formula": {
                step.append(buildFormulaEditorQuestion(question));
                break;

            } case "result": {
                step.append(buildResultsTableQuestion(question));
                break;

            }

            default: {
                console.error(question.type, " is not a supported question type");
            }
        }

    });




    return step;

}

/**
 * Builds the Progress Indicator DOM
 * @param {*} stepConfig 
 * @returns 
 */
function buildProgressIndicator(stepConfig, index) {
    let progressIndicator = stepProgressIdicatorTemplate.content.firstElementChild.cloneNode(true);
    progressIndicator.dataset.step_id = index;

    let indicatorLabel = progressIndicator.querySelector(".indicator-label");
    indicatorLabel.innerText = stepConfig.label;

    return progressIndicator;

}

/**
 * Question Builders
 */

// Radio Button Builder
function buildRadioQuestion(questionConfig) {

    let questionDOM = radioButtomFormTemplate.content.firstElementChild.cloneNode(true);

    /**
     * Set the question description/title
     */
    let title = questionDOM.querySelector(".title");
    title.innerText = questionConfig.description;


    let radioFields = questionDOM.querySelector(".fields");
    let radioGroup = radioFields.querySelector(".radio-group");
    let radioButtonTemplate = radioGroup.querySelector(".radio-button-template");

    /**
     * Build the custom buttons
     */
    questionConfig.options.forEach(option => {

        let sazxRadioButton = radioButtonTemplate.content.firstElementChild.cloneNode(true);
        let label = sazxRadioButton.querySelector(".label");
        let input = sazxRadioButton.querySelector(".input");

        input.setAttribute("name", questionConfig.name);
        input.setAttribute("id", `sazx-${questionConfig.name}-${option.value}`);
        input.setAttribute("value", option.value);

        label.setAttribute("for", `sazx-${questionConfig.name}-${option.value}`)
        label.innerText = option.label;

        radioGroup.append(sazxRadioButton);
    });


    return questionDOM;

}



/**
 * 
 * Creates the basic text based  input question
 */
function buildTextInput(questionConfig) {


    let questionDOM = textInputFormTemplate.content.firstElementChild.cloneNode(true);


    let fields = questionDOM.querySelector(".fields");
    let textInputs = fields.querySelector(".text-inputs");
    let sazxFreeInputTemplate = textInputs.querySelector(".text-input-template");




    // 


    let sazxFreeInput = sazxFreeInputTemplate.content.firstElementChild.cloneNode(true);
    let textLabel = sazxFreeInput.querySelector(".label");
    textLabel.setAttribute("for", `sazx-${questionConfig.name}-${questionConfig.name}`);
    textLabel.innerText = questionConfig.label;

    let textInput = sazxFreeInput.querySelector(".input");
    textInput.setAttribute("value", questionConfig.default ?? "");
    textInput.setAttribute("name", questionConfig.name);
    textInput.setAttribute("id", `sazx-${questionConfig.name}-${questionConfig.name}`);

    // Set input max and min , length
    if (questionConfig.max_length) {
        // Set input max
        textInput.setAttribute("maxlength", questionConfig.max_length);
    }
    if (questionConfig.min_length) {
        //  set input min length
        textInput.setAttribute("minlength", questionConfig.min_length);
    }
    if (questionConfig.pattern) {
        // set custom input validation pattern
        textInput.setAttribute("pattern", questionConfig.pattern);
    }


    /**
     * Check input validity and dispaly messages
     */

    textInput.addEventListener("change", event => {

        let target = event.target;
        let inputLength = target.value.length;

        // Validate input length
        {

            if (target.getAttribute("maxlength")) {
                let maxLength = Number.parseInt(target.getAttribute("maxlength"));
                if (inputLength > maxLength) {
                    console.warn("Input length exceded maximum allowed length");
                }
            }

            if (target.getAttribute("minlength")) {
                let mixLength = Number.parseInt(target.getAttribute("minlength"));
                if (inputLength < mixLength) {
                    console.warn("Input length is less than  maximum allowed length");
                }
            }
        }

        // Validate pattern/regex
        {

            if (target.getAttribute("pattern")) {

                if (target.validity.patternMismatch) {
                    console.error("Input pattern mismatched");
                }
                
            }
        }

        // Validate type mismatch
        {
            let inputType = target.getAttribute("type");

            if (target.validity.typeMismatch) {
                console.error("Input is not a, " , target.getAttribute("type") );
            }
        }

    });




    textInputs.append(sazxFreeInput);
    return questionDOM;
}

// Free text input builder
function buildFreeTextQuestion(questionConfig) {

    let stepQuestionDOM = buildTextInput(questionConfig);
    let textInput = stepQuestionDOM.querySelector(".input");
    textInput.setAttribute("type", "text");

    return stepQuestionDOM;
}

// Free text input builder
function buildEmailQuestion(questionConfig) {

    let stepQuestionDOM = buildTextInput(questionConfig);
    let textInput = stepQuestionDOM.querySelector(".input");
    textInput.setAttribute("type", "email");

    return stepQuestionDOM;
}
function buildUrlQuestion( questionConfig ){

    let stepQuestionDOM = buildTextInput(questionConfig);
    let textInput = stepQuestionDOM.querySelector(".input");
    textInput.setAttribute("type", "url");
    return stepQuestionDOM;

}

function buildTelephoneQuestion( questionConfig ){
    let stepQuestionDOM = buildTextInput(questionConfig);
    let textInput = stepQuestionDOM.querySelector(".input");
    textInput.setAttribute("type", "tel");
    return stepQuestionDOM;
}


// Free text input builder
function buildNumberQuestion(questionConfig) {



    let stepQuestionDOM = buildTextInput(questionConfig);
    let textInput = stepQuestionDOM.querySelector(".input");
    textInput.setAttribute("type", "number");
    textInput.addEventListener("keydown", event => {
        if (Number.parseInt(event.key)) {
        }
        // Negate if "-" is pressed
        else if (event.key == "-") {
            // Negate if "-" is pressed
            event.preventDefault();
            event.target.value = -1 * Number.parseFloat(event.target.value);;
        }
        // Allow floating poing
        else if (event.key == ".") {
            // Check if a deciam point does not exist
            if (event.target.value.indexOf(".") >= 0) {
                event.preventDefault();
                console.warn("Deciaml Pint already inserted ");
            }
        }

        else if (["Home", "End", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
            // Allow navigation keys

        }

        else if (["Backspace", "Delete"].includes(event.key)) {
            // Allow Deleting  keys

        }
        else if (event.ctrlKey) {
            // Allow some ctrl operations
            // copy, paste, select all
            if (event.key == "a" || event.key == "c") {
                // ctrl +a allowed
                // ctrl +c allowed
                // ctrl +c allowed
            } else if (event.key == "v") {
                // Check if input is number ,
                // / and it will not produce 2 or ore decimal places

                //   WIll be used on version 2

            }
        }



        else {
            console.log(event);

            event.preventDefault();

        }
    });

    return stepQuestionDOM;
}

// Free text input builder
function buildPasswordQuestion(questionConfig) {

    let stepQuestionDOM = buildTextInput(questionConfig);
    let textInput = stepQuestionDOM.querySelector(".input");
    textInput.setAttribute("type", "password");

    return stepQuestionDOM;
}




function buildTextAreaQuestion(questionConfig) {

    let questionDOM = textAreaInputFormTemplate.content.firstElementChild.cloneNode(true);

    /**
     * Only in a group
     */
    // let title = questionDOM.querySelector(".title");
    // title.innerText = questionConfig.description;


    let fields = questionDOM.querySelector(".fields");
    let textInputs = fields.querySelector(".text-inputs");
    let sazxFreeInputTemplate = textInputs.querySelector(".text-input-template");

    // 


    let sazxFreeInput = sazxFreeInputTemplate.content.firstElementChild.cloneNode(true);
    let textLabel = sazxFreeInput.querySelector(".label");
    textLabel.setAttribute("for", `sazx-${questionConfig.name}-${questionConfig.name}`);
    textLabel.innerText = questionConfig.label;

    let textInput = sazxFreeInput.querySelector(".input");
    textInput.setAttribute("value", questionConfig.default ?? "");
    textInput.setAttribute("name", questionConfig.name);
    textInput.setAttribute("id", `sazx-${questionConfig.name}-${questionConfig.name}`);


    textInputs.append(sazxFreeInput);



    return questionDOM;
}





// file upload/url builder

function buildFileUrlQuestion(questionConfig) {
    let questionDOM = fileUrlFormTemplate.content.firstElementChild.cloneNode(true);

    let title = questionDOM.querySelector(".title");
    title.innerText = questionConfig.description;

    let fileInput = questionDOM.querySelector(".file-input .input");
    fileInput.setAttribute("name", questionConfig.name);

    /**
     * FIle Url not implemented yet
     */


    return questionDOM;

}


// Column mapper builder

function buildColumnMapperQuestion(questionConfig) {

    let questionDOM = columnMapperFormTemplate.content.firstElementChild.cloneNode(true);
    let title = questionDOM.querySelector(".title");
    title.innerText = questionConfig.description;




    // Build the table rows
    let tableBody = questionDOM.querySelector("table tbody");
    let bodyRowTemplate = questionDOM.querySelector("table tbody .tr-template");
    let bodyRowFileColumnSelectTemplate = questionDOM.querySelector("table tbody .select-template");
    let bodyRowFileColumnOptionTemplate = questionDOM.querySelector("table tbody .select-option-template");



    /**
     * Register file change event, and re render the column mapper everytime the csv file is changed
     */
    files.addChangeListener(questionConfig.file, event => {

        // Remove all existing  rows from table body, before adding new one

        debugger;
        let allRows = tableBody.querySelectorAll("tr");
        allRows.forEach(row => {
            row.remove();
        })


        // C
        questionConfig.columns.forEach((column, rowIndex) => {

            /**
             * Read the contens of the CSV file,
             */

            let fileReader = new FileReader();
            fileReader.onload = function (event) {

                let bodyRow = bodyRowTemplate.content.firstElementChild.cloneNode(true);
                let fileColumn = bodyRow.querySelector(".file-column");
                let select = bodyRowFileColumnSelectTemplate.content.firstElementChild.cloneNode(true);
                select.setAttribute("name", rowIndex);


                let result = event.target.result;

                let getCSVCOlumns = (result) => {
                    let lines = result.split('\n');
                    let headerLine = lines[0];
                    return headerLine.split(",");
                }


                let csvColums = getCSVCOlumns(result);
                csvColums.forEach((column, optionIndex) => {

                    let option = bodyRowFileColumnOptionTemplate.content.firstElementChild.cloneNode(true);
                    option.setAttribute("value", optionIndex);
                    option.innerText = column;

                    select.append(option);


                });

                fileColumn.append(select);





                let mapToColumn = bodyRow.querySelector(".map-to");
                mapToColumn.querySelector(".label").innerText = column;

                tableBody.append(bodyRow);


            }
            fileReader.onerror = function (event) {
                console.log("Error reading", event);
            }


            fileReader.readAsText(files[questionConfig.file]);


        })




    });






    return questionDOM;
}


// Result table builder
function buildResultsTableQuestion(questionConfig) {
    let questionDOM = resultTableFormTemplate.content.firstElementChild.cloneNode(true);

    let title = questionDOM.querySelector(".title");
    title.innerText = questionConfig.description;

    let tableHeadRow = questionDOM.querySelector("table thead tr");
    let tableHeadRowCellTemplate = tableHeadRow.querySelector(".template-head-tr-th");

    // Create table header cells from data
    questionConfig.data.head.forEach(column => {
        let cell = tableHeadRowCellTemplate.content.firstElementChild.cloneNode(true);
        cell.innerText = column;

        tableHeadRow.append(cell);
    });

    // Create table rows from data
    let tableBody = questionDOM.querySelector("table tbody");
    let tableBodyRowTemplate = tableBody.querySelector(".template-body-tr");
    questionConfig.data.body.forEach(row => {
        let tableBodyRow = tableBodyRowTemplate.content.firstElementChild.cloneNode(true);
        let tableBodyCellTemplate = tableBodyRow.querySelector(".template-body-tr-td");

        row.forEach(column => {
            let tableBodyCell = tableBodyCellTemplate.content.firstElementChild.cloneNode(true);
            tableBodyCell.innerText = column;

            tableBodyRow.append(tableBodyCell);

        });

        tableBody.append(tableBodyRow);
    });

    return questionDOM;
}



function buildFormulaEditorQuestion(questionConfig) {
    let questionDOM = formulaEditorFormTemplate.content.firstElementChild.cloneNode(true);
    return questionDOM;
}