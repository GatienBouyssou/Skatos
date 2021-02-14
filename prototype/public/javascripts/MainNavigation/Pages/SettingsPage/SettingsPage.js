let profileImage = $("#profileImage");
let pageContainer = $("#pageContainer");
let popupContainer = $("#popupContainer");
let preview = $("#previewImage");
let fileUploader = $("#fileUploader");
let fileUploaderDiv = $("#fileUploaderDiv");
let confirmationPopUp = $("#confirmationScreen");
let info = $("#informationLabels");
let uploadForm = $("#uploadForm");

fileUploader.change(function () {
    previewFile(fileUploader[0].files[0])
});

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

$("#changeBtn").click(function (e) {
    profileImage.attr("src", preview.attr("src"))
    hidePopup()
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
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent)
            {
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

function hidePopup() {
    pageContainer.css("opacity", 1);
    $("body").removeClass("backgroundPopup");
    pageContainer.find("*").removeAttr("disabled");
    popupContainer.css("display", "none");
}

// if escape is pressed leave screen
window.onkeydown = function (e) {
    if (e.code === "Escape") {
        hidePopup();
    }
};



