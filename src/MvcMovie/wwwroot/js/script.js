
$(document).ready(function(){
    
     //Enable tooltipster on text input elements
    $("input[type='text']").tooltipster({ 
        trigger: "custom", // default is 'hover' which is no good here
        onlyOne: false,    // allow multiple tips to be open at a time
        position: "right"  // display the tips to the right of the element
    });
    
    //Enable form validation via jquery.validate.js
    $("form").validate({
        rules: {
            name: {
                required: true,
                letterswithbasicpunc: true
            },
            phone: {
                required: true,
                phoneUS: true
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: {
                required: "Please enter your name",
                letterswithbasicpunc: "Please use letters and basic punctuation only"
            },
            phone: {
                required: "Please enter your phone number",
                phoneUS: "Please enter a valid US phone number"
            },
            email: {
                required: "Please enter your email address"
            }
        },
        
        errorPlacement: function (error,element) {
            onError(error,element);
        },
        
        highlight: function (element, errorClass, validClass) {
            $(element).tooltipster('show');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).tooltipster('hide');
        },
        
        submitHandler: function (form) {
           onSubmit(form);
        }
    });

});

/**
 * Displays a tooltipster error message next 
 * to the element where the error occurred.
 * @param {error} error
 * @param {element} element 
 * @returns {undefined}
 */
function onError(error, element){
    
    //Check if the error message is already shown
    var lastError = $(element).data('lastError');
    var newError = $(error).text();
    var notShown = newError !== '' && newError !== lastError;
    
    //Display the error message if it's not already shown
    if (notShown) {
        $(element).tooltipster('content', newError);
        $(element).tooltipster('show');
    } 
    
    //Save the error for next time round
    $(element).data('lastError', newError);
}

/**
 * Submits the form to a PHP processing script
 * and displays a success page if no error occurs.
 * @param {form} form
 * @returns {undefined}
 */
function onSubmit(form) {
    
    //Submit via ajax so page does not have to reload.
    $(form).ajaxSubmit({
        
        type: "POST",
        data: $(form).serialize(),
        url: "process.php",
        
        success: function () {
           onSuccess(form);
        }
    });
}

/**
 * Replaces the form with a success page.
 * @param {form} form
 * @returns {undefined}
 */
function onSuccess(form) {
    $(form).hide();
    $(".success").fadeIn();
}
