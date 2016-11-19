// Variable to hold request
var request;

// Bind to the submit event of our form
$("#gform").submit(function(event){

  // Prevent default posting of form - put here to work in case of errors
  event.preventDefault();

  // Abort any pending request
  if (request) {
    request.abort();
  }
  // setup some local variables
  var $form = $(this);

  // Let's select and cache all the fields
  var $inputs = $form.find("input, select, button, textarea");

  // Serialize the data in the form
  var serializedData = $form.serialize();

  // Note: we disable elements AFTER the form data has been serialized.
  $inputs.prop("disabled", true);

  // Fire off THE DATA TO THE GOOGLE FORM
  request = $.ajax({
    url: "https://script.google.com/macros/s/AKfycbw1RvmGkrxh8oUfrFkiMBeZu_1014lo_M0r4VShxkalPIhn4DA/exec",
    type: "post",
    data: serializedData
  });

  // HANDLER - SUCCESS
  request.done(function (response, textStatus, jqXHR){
    // Log a message to the console
    console.log("BOoomOOO, it worked!");
     $("#ThanksMessage").slideDown();
     setTimeout(function() {
         $("#ThanksMessage").slideUp();
     }, 5000);
     //clear text after 2s
     setTimeout( function() {$('#contact-form input').val('');
      $('#contact-form textarea').val('');},2000);
  });

  // HANDLER - FAILURE
  request.fail(function (jqXHR, textStatus, errorThrown){
    // Log the error to the console
    console.error(
      "The following error occurred: "+
      textStatus, errorThrown
    );

    $("#ERRORMessage").slideDown();
    setTimeout(function() {
        $("#ERRORMessage").slideUp();
    }, 5000);
  });

  // Callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
    // Re-enable the inputs
    $inputs.prop("disabled", false);
  });

});
