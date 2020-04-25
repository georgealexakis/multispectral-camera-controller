// Initialize connection variable
var connectStatus = false;

// Variables for camera parameters
var cameraFeedbackSubscriber;
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
var originalImageSubscriber;

// Initialize settings
init();
function init() {
    $('#connectModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    // Set cross-talk and white refernece to off
    $(".bg42").button("toggle");
    document.getElementById('onCrossTalk').checked = false;
    document.getElementById('offCrossTalk').checked = true;
    $(".bg52").button("toggle");
    document.getElementById('onWhiteReference').checked = false;
    document.getElementById('offWhiteReference').checked = true;
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
        connectStatus = true;
    });
    ROS.on('error', function (error) {
        document.getElementById("network").innerHTML = "error";
        document.getElementById("originalImage").src = "res/no-image.png"
        connectStatus = false;
    });
    ROS.on('close', function () {
        document.getElementById("network").innerHTML = "closed";
        document.getElementById("originalImage").src = "res/no-image.png"
        connectStatus = false;
    });
    // Subscribe to /camera/image_raw to receive compressed images
    originalImageSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: originalImage,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    originalImageSubscriber.subscribe(function (msg) {
        document.getElementById("originalImage").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /camera_controller/feedback to receive camera feedback
    cameraFeedbackSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: '/camera_controller/feedback',
        messageType: 'std_msgs/String'
    });
    // Receive camera parameters feedback
    cameraFeedbackSubscriber.subscribe(function (msg) {
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
        messageType: 'std_msgs/String'
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
    if (connectStatus) {
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
    if (connectStatus) {
        var parameters = "00";
        if (choice == 0) {
            b1 = document.getElementById('onCrossTalk').checked;
            b2 = document.getElementById('offCrossTalk').checked;
            if (b1 && !b2) {
                parameters = "00";
            } else {
                parameters = "01";
            }
        } else {
            b3 = document.getElementById('onWhiteReference').checked;
            b4 = document.getElementById('offWhiteReference').checked;
            if (b3 && !b4) {
                parameters = "10";
            } else {
                parameters = "11";
            }
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