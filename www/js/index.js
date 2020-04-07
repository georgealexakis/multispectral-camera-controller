// Initial connect variable
var connectStatus = false;

// Camera variables for parameters
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

// Mutiple images and subscribers
var image1;
var image2;
var image3;
var image4;
var image5;
var image6;
var image7;
var image8;
var image9;
var band1Subscriber;
var band2Subscriber;
var band3Subscriber;
var band4Subscriber;
var band5Subscriber;
var band6Subscriber;
var band7Subscriber;
var band8Subscriber;
var band9Subscriber;

// Initialize settings
init();
function init() {
    $('#connectModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}

// Modify single image settings
function setSingleSettings() {
    var robotURL = 'wss://' + document.getElementById('inputIP').value + ':9090';
    originalImage = document.getElementById('originalImageTopic').value;
    document.getElementById("IP").innerHTML = robotURL;
    $('#connectModal').modal('hide');
    connectSingle(robotURL);
}

// Connect with ROS
function connectSingle(robotURL) {
    var ROS;
    // ROS connection states
    ROS = new ROSLIB.Ros({
        url: robotURL
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
            document.getElementById('onAutoWhiteBalance').checked = true;
            document.getElementById('offAutoWhiteBalance').checked = false;
        } else {
            document.getElementById('onAutoWhiteBalance').checked = false;
            document.getElementById('offAutoWhiteBalance').checked = true;
        }
        if (inputParameters[4] == "True") {
            document.getElementById('onAutoFrameRate').checked = true;
            document.getElementById('offAutoFrameRate').checked = false;
        } else {
            document.getElementById('onAutoFrameRate').checked = false;
            document.getElementById('offAutoFrameRate').checked = true;
        }
        if (inputParameters[5] == "True") {
            document.getElementById('onAutoExposure').checked = true;
            document.getElementById('offAutoExposure').checked = false;
        } else {
            document.getElementById('onAutoExposure').checked = false;
            document.getElementById('offAutoExposure').checked = true;
        }

    });
    // Publish to /camera_controller the camera parameters
    parametersPublisher = new ROSLIB.Topic({
        ros: ROS,
        name: "/camera_controller",
        messageType: 'std_msgs/String'
    });
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

// Modify settings
function setMultipleSettings() {
    var robotURL = 'wss://' + document.getElementById('inputIP').value + ':9090';
    document.getElementById("IP").innerHTML = robotURL;
    image1 = document.getElementById('b1Topic').value;
    image2 = document.getElementById('b2Topic').value;
    image3 = document.getElementById('b3Topic').value;
    image4 = document.getElementById('b4Topic').value;
    image5 = document.getElementById('b5Topic').value;
    image6 = document.getElementById('b6Topic').value;
    image7 = document.getElementById('b7Topic').value;
    image8 = document.getElementById('b8Topic').value;
    image9 = document.getElementById('b9Topic').value;
    $('#connectModal').modal('hide');
    connectMultiple(robotURL);
}

// Connect multiple images
function connectMultiple(robotURL) {
    var ROS;
    // ROS connection states
    ROS = new ROSLIB.Ros({
        url: robotURL
    });
    ROS.on('connection', function () {
        document.getElementById("network").innerHTML = "connected";
    });
    ROS.on('error', function (error) {
        document.getElementById("network").innerHTML = "error";
    });
    ROS.on('close', function () {
        document.getElementById("network").innerHTML = "closed";
    });
    // Subscribe to /band1/compressed to receive compressed images
    band1Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image1,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band1Subscriber.subscribe(function (msg) {
        document.getElementById("b1").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band2/compressed to receive compressed images
    band2Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image2,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band2Subscriber.subscribe(function (msg) {
        document.getElementById("b2").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band3/compressed to receive compressed images
    band3Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image3,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band3Subscriber.subscribe(function (msg) {
        document.getElementById("b3").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band4/compressed to receive compressed images
    band4Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image4,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band4Subscriber.subscribe(function (msg) {
        document.getElementById("b4").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band3/compressed to receive compressed images
    band5Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image5,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band5Subscriber.subscribe(function (msg) {
        document.getElementById("b5").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band4/compressed to receive compressed images
    band6Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image6,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band6Subscriber.subscribe(function (msg) {
        document.getElementById("b6").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band7/compressed to receive compressed images
    band7Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image7,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band7Subscriber.subscribe(function (msg) {
        document.getElementById("b7").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band8/compressed to receive compressed images
    band8Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image8,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band8Subscriber.subscribe(function (msg) {
        document.getElementById("b8").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /band9/compressed to receive compressed images
    band9Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image9,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band9Subscriber.subscribe(function (msg) {
        document.getElementById("b9").src = "data:image/jpeg;base64," + msg.data;
    });
}
