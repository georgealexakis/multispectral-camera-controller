// Initialize connection variable
var STATUS = false;
// Variables for camera parameters
var exposure;
var frameRate;
var pixelClock;
var autoWhiteBalance1;
var autoWhiteBalance2;
var autoFrameRate1;
var autoFrameRate2;
var autoExposure1;
var autoExposure2;
var originalImage;
var imageSubscriber;
var feedbackSubscriber;
// Initialize settings
$(window).bind('beforeunload', function () {
    imageSubscriber.unsubscribe();
    feedbackSubscriber.unsubscribe();
});
init();
function init() {
    $('#connectModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    // Set cross-talk and white refernece to off
    $(".bg42").button("toggle");
    $(".bg52").button("toggle");
}
// Modify settings
function setSingleSettings() {
    var URL = 'ws://' + document.getElementById('inputIP').value + ':9090';
    originalImage = document.getElementById('originalImageTopic').value;
    document.getElementById("IP").innerHTML = URL;
    $('#connectModal').modal('hide');
    connectSingle(URL);
}
// Connect with ROS
function connectSingle(URL) {
    var ROS;
    // ROS connection states
    ROS = new ROSLIB.Ros({
        url: URL
    });
    ROS.on('connection', function () {
        document.getElementById("network").innerHTML = "connected";
        STATUS = true;
    });
    ROS.on('error', function (error) {
        document.getElementById("network").innerHTML = "error";
        document.getElementById("originalImage").src = "res/no-image.png"
        STATUS = false;
    });
    ROS.on('close', function () {
        document.getElementById("network").innerHTML = "closed";
        document.getElementById("originalImage").src = "res/no-image.png"
        STATUS = false;
    });
    // Subscribe to /camera/image_raw to receive compressed images
    imageSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: originalImage,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    imageSubscriber.subscribe(function (msg) {
        document.getElementById("originalImage").src = "data:image/jpeg;base64," + msg.data;
    });
    console.log(imageSubscriber);
    // Subscribe to /camera_controller/feedback to receive camera feedback
    feedbackSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: '/camera_controller/feedback',
        messageType: 'std_msgs/String'
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
            document.getElementById('onAutoWhiteBalance').checked = true;
            document.getElementById('offAutoWhiteBalance').checked = false;
        } else {
            $(".bg12").button("toggle");
            document.getElementById('onAutoWhiteBalance').checked = false;
            document.getElementById('offAutoWhiteBalance').checked = true;
        }
        if (inputParameters[4] == "True") {
            $(".bg21").button("toggle");
            document.getElementById('onAutoFrameRate').checked = true;
            document.getElementById('offAutoFrameRate').checked = false;
        } else {
            $(".bg22").button("toggle");
            document.getElementById('onAutoFrameRate').checked = false;
            document.getElementById('offAutoFrameRate').checked = true;
        }
        if (inputParameters[5] == "True") {
            $(".bg31").button("toggle");
            document.getElementById('onAutoExposure').checked = true;
            document.getElementById('offAutoExposure').checked = false;
        } else {
            $(".bg32").button("toggle");
            document.getElementById('onAutoExposure').checked = false;
            document.getElementById('offAutoExposure').checked = true;
        }
    });
    // Publish to /camera_settings the camera parameters cross-talk and white reference
    extraParametersPublisher = new ROSLIB.Topic({
        ros: ROS,
        name: "/camera_settings",
        messageType: 'std_msgs/Int8'
    });
    // Publish to /camera_controller the camera parameters
    parametersPublisher = new ROSLIB.Topic({
        ros: ROS,
        name: "/camera_controller",
        messageType: 'std_msgs/String'
    });
    setTimeout(function () { synchronization(); }, 2000);
}
// Set camera parameters
function setParameters() {
    if (STATUS) {
        exposure = document.getElementById('inputExposure').value;
        pixelClock = document.getElementById('inputPixelClock').value;
        frameRate = document.getElementById('inputFrameRate').value;
        autoWhiteBalance1 = document.getElementById('onAutoWhiteBalance').checked;
        autoWhiteBalance2 = document.getElementById('offAutoWhiteBalance').checked;
        autoFrameRate1 = document.getElementById('onAutoFrameRate').checked;
        autoFrameRate2 = document.getElementById('offAutoFrameRate').checked;
        autoExposure1 = document.getElementById('onAutoExposure').checked;
        autoExposure2 = document.getElementById('offAutoExposure').checked;
        var awb = "False";
        var afr = "False";
        var aex = "False";
        if (autoWhiteBalance1 && !autoWhiteBalance2) {
            awb = "True";
        }
        if (autoFrameRate1 && !autoFrameRate2) {
            afr = "True";
        }
        if (autoExposure1 && !autoExposure2) {
            aex = "True";
        }
        var parametersData = exposure + "-" + pixelClock + "-" + frameRate + "-" + awb + "-" + afr + "-" + aex;
        var parameters = new ROSLIB.Message({
            data: parametersData
        });
        parametersPublisher.publish(parameters);
    }
}
// Set cross-talk and white reference
function setCTWRParameters(choice) {
    if (STATUS) {
        var parametersData = 0;
        if (choice == 0) {
            parametersData = 1;
        } else if (choice == 1) {
            parametersData = 0;
        } else if (choice == 2) {
            parametersData = 11;
        } else if (choice == 3) {
            parametersData = 10;
        }
        var parameters = new ROSLIB.Message({
            data: parametersData
        });
        extraParametersPublisher.publish(parameters);
    }
}
// Reconnect client
function reconnect() {
    location.reload();
}
// Dispaly parameters panel
function changeParameters() {
    $('#parametersModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}
// Display information panel
function displayInfo() {
    $('#infoModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}
// Camera parameters synchronization
function synchronization() {
    var parameters = new ROSLIB.Message({
        data: "sync"
    });
    parametersPublisher.publish(parameters);
}