function loadEventsSettings() {
    let profileImage = $("#profileImage");
    let pageContainer = $("#pageContainer");
    let popupContainer = $("#popupContainer");
    let preview = $("#previewImage");
    let fileUploader = $("#fileUploader");
    let fileUploaderDiv = $("#fileUploaderDiv");
    let confirmationPopUp = $("#confirmationScreen");
    let info = $("#informationLabels");
    let uploadForm = $("#uploadForm");
    let imageFile;

    // upload the image and make the changes
    fileUploader.change(function () {
        previewFile(fileUploader[0].files[0])
    });

    // when drop a file display the confirmation page
    fileUploaderDiv.on("drop", function (e) {
        e.preventDefault();
        previewFile(e.originalEvent.dataTransfer.files[0]);
    });

    fileUploaderDiv.on( "dragover", function(e) {
        e.preventDefault();
    });

    fileUploaderDiv.on("drag", function(e){
        e.originalEvent.dataTransfer.setData("image", e.target.prototype.id)
    });

    /*make the div change when the user drag something into the box*/
    fileUploaderDiv.on("dragenter", function (e) {
        fileUploaderDiv.removeClass().addClass("redDashedBorder");
        showALabel("#duringUpload")
    });

    /*show a label depending on his id*/
    function showALabel(id) {
        info.children("span").hide();
        $(id).show();
    }


    function setNormalTemplate() {
        fileUploaderDiv.removeClass().addClass("greyDashedBorder");
        showALabel("#labelUpload")
    }

    fileUploaderDiv.on("dragleave", function () {
        setNormalTemplate();
    });

    profileImage.click(function (e) {
        setUpUploadImageScreen(e)
    });

    $("#closeImg").click(function () {
        hidePopup();
    });

    $("#cancelBtn").click(function (e) {
        showUploadForm();
    });

    // send the image to the server and save the changes
    $("#changeBtn").click(function (e) {
        profileImage.attr("src", preview.attr("src"));
        hidePopup();
        let formData = new FormData();
        formData.append("profilePicture", imageFile);
        $.ajax({
            url: "/changeImg",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('.profilePicture').attr('src', '/images/profiles/' + response)
            },
            error: function(errorMessage) {
                console.log(errorMessage); // Optional
                M.toast({html: errorMessage.responseText})
            }
        });
    });

    function showConfirmPopup() {
        uploadForm.css("display", "none");
        confirmationPopUp.css("display", "block");
    }

    /*this method import a file into the browser and display an error if needed*/
    function previewFile(file) {
        if (file === undefined)
            file = null;
        if(isNaN(file)){
            if (file.type.match("image.*")){
                let fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent) {
                    imageFile = file;
                    preview.attr("src",fileLoadedEvent.target.result); // set the preview source. We are giving it the uploaded image source
                };
                fileReader.readAsDataURL(file);
                showConfirmPopup();
            } else {
                showALabel("#errorUpload")
            }
        }
        fileUploaderDiv.removeClass().addClass("greyDashedBorder");
        setInterval(function(){
            showALabel("#labelUpload")
        }, 3000);
    }

    function showUploadForm() {
        confirmationPopUp.css("display", "none");
        uploadForm.css("display", "block");
    }

    function setUpUploadImageScreen(e) {
        pageContainer.css("opacity", 0.4);
        $("body").addClass("backgroundPopup");
        pageContainer.find("*").attr("disabled", "true");
        popupContainer.css("display", "block");
        showUploadForm();
        setNormalTemplate()
    }

    $('body').on("click", "#closeSettings", function() {
        $('#settingsPanel').hide();
    });

// if escape is pressed leave screen
    window.onkeydown = function (e) {
        if (e.code === "Escape") {
            $('#settingsPanel').hide();
        }
    };


    function hidePopup() {
        pageContainer.css("opacity", 1);
        pageContainer.find("*").removeAttr("disabled");
        popupContainer.css("display", "none");
    }

    // when the user send the changes of the settings form
    $('#settingsFormContainer').submit((e) => {
        e.preventDefault();
        $('#submitButtonSettings').attr('value', 'Sending ...');
        // get content of the form and change it to an object
        let body = {};
        $("#settingsFormContainer").serializeArray().forEach(function (element) {
            body[element.name] = element.value;
        });
        $.ajax({
            url: "/changeSettings",
            type: "POST",
            data: body,
            success: function(response) {
                // refresh the panel
                let $settingsContent = $("#settingsContent");
                $settingsContent.empty();
                $settingsContent.append(response);
                loadEventsSettings()
                M.toast({html: "<span>Your data have been successfully updated.</span>"}) // feedback
            },
            error: function(errorMessage) {
                console.log(errorMessage); // Optional
                M.toast({html: errorMessage.responseText})
            }
        });
    })
}




