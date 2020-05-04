// Initialize connection variable
var STATUS = false;
// Variables for camera parameters
var exposure;
var frameRate;
var pixelClock;
var AWB1;
var AWB2;
var AFR1;
var AFR2;
var AE1;
var AE2;
var IMAGE;
var ROSURL;
var imageSubscriber;
var feedbackSubscriber;
// Initialize settings
init();
function init() {
    $("#connectModal").modal("show");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    // Set cross-talk and white refernece to off
    $(".bg42").button("toggle");
    $(".bg52").button("toggle");
}
// Modify settings
function connectToROS() {
    // Get inputs
    if (document.getElementById("inputIP").value !== "" && document.getElementById("imageTopic").value !== "") {
        ROSURL = "ws://" + document.getElementById("inputIP").value + ":9090";
        IMAGE = document.getElementById("imageTopic").value;
        // Set information
        document.getElementById("IP").innerHTML = ROSURL;
        $("#connectModal").modal("hide");
        // Start connection
        connect(ROSURL);
    } else {
        // Display warning
        document.getElementById("connect-warning").innerHTML = "*Both inputs must be filled out.";
        setTimeout(function () { document.getElementById("connect-warning").innerHTML = ""; }, 2000);
    }
}
// Connect with ROS
function connect(URL) {
    var ROS;
    // ROS connection status
    ROS = new ROSLIB.Ros({
        url: URL
    });
    ROS.on("connection", function () {
        document.getElementById("network").innerHTML = "connected";
        STATUS = true;
    });
    ROS.on("error", function (error) {
        document.getElementById("network").innerHTML = "error";
        document.getElementById("originalImage").src = "res/no-image.png"
        STATUS = false;
    });
    ROS.on("close", function () {
        document.getElementById("network").innerHTML = "closed";
        document.getElementById("originalImage").src = "res/no-image.png"
        STATUS = false;
    });
    // Subscribe to /camera/image_raw to receive compressed images
    imageSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: IMAGE,
        messageType: "sensor_msgs/CompressedImage"
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    imageSubscriber.subscribe(function (msg) {
        document.getElementById("originalImage").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /camera_controller/feedback to receive camera feedback
    feedbackSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: "/camera_controller/feedback",
        messageType: "std_msgs/String"
    });
    // Receive camera parameters feedback
    feedbackSubscriber.subscribe(function (msg) {
        var input = String(msg.data);
        var inputParameters = input.split("-");
        document.getElementById("inputExposure").value = parseInt(inputParameters[0]);
        document.getElementById("inputPixelClock").value = parseInt(inputParameters[1]);
        document.getElementById("inputFrameRate").value = parseInt(inputParameters[2]);
        if (inputParameters[3] == "True") {
            $(".bg11").button("toggle");
            document.getElementById("onAutoWhiteBalance").checked = true;
            document.getElementById("offAutoWhiteBalance").checked = false;
        } else {
            $(".bg12").button("toggle");
            document.getElementById("onAutoWhiteBalance").checked = false;
            document.getElementById("offAutoWhiteBalance").checked = true;
        }
        if (inputParameters[4] == "True") {
            $(".bg21").button("toggle");
            document.getElementById("onAutoFrameRate").checked = true;
            document.getElementById("offAutoFrameRate").checked = false;
        } else {
            $(".bg22").button("toggle");
            document.getElementById("onAutoFrameRate").checked = false;
            document.getElementById("offAutoFrameRate").checked = true;
        }
        if (inputParameters[5] == "True") {
            $(".bg31").button("toggle");
            document.getElementById("onAutoExposure").checked = true;
            document.getElementById("offAutoExposure").checked = false;
        } else {
            $(".bg32").button("toggle");
            document.getElementById("onAutoExposure").checked = false;
            document.getElementById("offAutoExposure").checked = true;
        }
    });
    // Publish to /camera_settings the camera parameters cross-talk and white reference
    extraParametersPublisher = new ROSLIB.Topic({
        ros: ROS,
        name: "/camera_settings",
        messageType: "std_msgs/Int8"
    });
    // Publish to /camera_controller the camera parameters
    parametersPublisher = new ROSLIB.Topic({
        ros: ROS,
        name: "/camera_controller",
        messageType: "std_msgs/String"
    });
    setTimeout(function () { synchronization(); }, 2000);
}
// Set camera parameters
function setParameters() {
    if (STATUS) {
        exposure = document.getElementById("inputExposure").value;
        pixelClock = document.getElementById("inputPixelClock").value;
        frameRate = document.getElementById("inputFrameRate").value;
        AWB1 = document.getElementById("onAutoWhiteBalance").checked;
        AWB2 = document.getElementById("offAutoWhiteBalance").checked;
        AFR1 = document.getElementById("onAutoFrameRate").checked;
        AFR2 = document.getElementById("offAutoFrameRate").checked;
        AE1 = document.getElementById("onAutoExposure").checked;
        AE2 = document.getElementById("offAutoExposure").checked;
        var awb = "False";
        var afr = "False";
        var aex = "False";
        if (AWB1 && !AWB2) {
            awb = "True";
        }
        if (AFR1 && !AFR2) {
            afr = "True";
        }
        if (AE1 && !AE2) {
            aex = "True";
        }
        var parametersData = exposure + "-" + pixelClock + "-" + frameRate + "-" + awb + "-" + afr + "-" + aex;
        var parameters = new ROSLIB.Message({
            data: parametersData
        });
        parametersPublisher.publish(parameters);
    } else {
        setWarning();
    }
}
// Set cross-talk and white reference. It is able to add more choices
function setCTWRParameters(choice) {
    if (STATUS) {
        var parametersData = 0;
        if (choice == 0) {
            parametersData = 1;
        } else if (choice == 1) {
            parametersData = 0;
        } else if (choice == 2) {
            parametersData = 41;
        } else if (choice == 3) {
            parametersData = 40;
        }
        var parameters = new ROSLIB.Message({
            data: parametersData
        });
        extraParametersPublisher.publish(parameters);
    } else {
        setWarning();
    }
}
// Reconnect client
function reconnect() {
    location.reload();
}
// Dispaly parameters panel
function changeParameters() {
    $("#parametersModal").modal("show");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}
// Display information panel
function displayInfo() {
    $("#infoModal").modal("show");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}
// Camera parameters synchronization
function synchronization() {
    if (STATUS) {
        var parameters = new ROSLIB.Message({
            data: "sync"
        });
        parametersPublisher.publish(parameters);
    } else {
        setWarning();
    }
}
// Display warning
function setWarning() {
    document.getElementById("warning").innerHTML = "*Be sure that the application is connected with ROS.";
    setTimeout(function () { document.getElementById("warning").innerHTML = ""; }, 2000);
}
// Shut down everything
$(window).bind("beforeunload", function () {
    if (imageSubscriber) {
        imageSubscriber.unsubscribe();
    }
    if (feedbackSubscriber) {
        feedbackSubscriber.unsubscribe();
    }
});