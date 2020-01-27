var status = "";
var connectStatus = false;
var diagnosticsSubscriber;
var exposure;
var frameRate;
var originalImage;
var originalImageSubscriber;
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
init();
// Initialize settings
function init() {
    $('#connectModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}
// Modify settings
function setSettings() {
    var robotURL = 'ws://' + document.getElementById('robotIP').value + ':9090';
    exposure = document.getElementById('exposure').value;
    frameRate = document.getElementById('frameRate').value;
    image1 = document.getElementById('b1Topic').value;
    image2 = document.getElementById('b2Topic').value;
    image3 = document.getElementById('b3Topic').value;
    image4 = document.getElementById('b4Topic').value;
    image5 = document.getElementById('b5Topic').value;
    image6 = document.getElementById('b6Topic').value;
    image7 = document.getElementById('b7Topic').value;
    image8 = document.getElementById('b8Topic').value;
    image9 = document.getElementById('b9Topic').value;
    var fpvValue = document.getElementById('fpv').checked;
    $('#connectModal').modal('hide');
    connect(robotURL, fpvValue);
}
// Modify settings
function setSettingsOriginal() {
    var robotURL = 'ws://' + document.getElementById('robotIP').value + ':9090';
    exposure = document.getElementById('exposure').value;
    frameRate = document.getElementById('frameRate').value;
    originalImage = document.getElementById('originalImage').value;
    var fpvValue = document.getElementById('fpv').checked;
    $('#connectModal').modal('hide');
    connectOriginal(robotURL, fpvValue);
}
// Connect to robot
function connect(robotURL, fpvValue) {
    var ROS;
    // ROS connection states
    ROS = new ROSLIB.Ros({
        url: robotURL
    });
    ROS.on('connection', function () {
        document.getElementById("status").innerHTML = "Network: connected";
        document.getElementById("signal").className = "fas fa-signal";
        connectStatus = true;
    });
    ROS.on('error', function (error) {
        document.getElementById("status").innerHTML = "Network: error";
        document.getElementById("signal").className = "fas fa-exclamation-circle";
        connectStatus = false;
    });
    ROS.on('close', function () {
        document.getElementById("status").innerHTML = "Network: closed";
        document.getElementById("signal").className = "fas fa-ban";
        connectStatus = false;
    });
    // Subscribe to /band1/compressed to receive compressed images
    band1Subscriber = new ROSLIB.Topic({
        ros: ROS,
        name: image1,
        messageType: 'sensor_msgs/CompressedImage'
    });
    // Receive base64 messages and add data:image/jpeg;base64, to show data
    band1Subscriber.subscribe(function (msg) {
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
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
        if (fpvValue)
            document.getElementById("b9").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /joystick/diagnostics to receive diagnostics
    diagnosticsSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: '/joystick/diagnostics',
        messageType: 'std_msgs/String'
    });
    // Receive command
    diagnosticsSubscriber.subscribe(function (msg) {
        document.getElementById("status").innerHTML = msg.data;
    });
}
// Connect to robot
function connectOriginal(robotURL, fpvValue) {
    var ROS;
    // ROS connection states
    ROS = new ROSLIB.Ros({
        url: robotURL
    });
    ROS.on('connection', function () {
        document.getElementById("status").innerHTML = "Network: connected";
        document.getElementById("signal").className = "fas fa-signal";
        connectStatus = true;
    });
    ROS.on('error', function (error) {
        document.getElementById("status").innerHTML = "Network: error";
        document.getElementById("signal").className = "fas fa-exclamation-circle";
        connectStatus = false;
    });
    ROS.on('close', function () {
        document.getElementById("status").innerHTML = "Network: closed";
        document.getElementById("signal").className = "fas fa-ban";
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
        if (fpvValue)
            document.getElementById("b1").src = "data:image/jpeg;base64," + msg.data;
    });
    // Subscribe to /joystick/diagnostics to receive diagnostics
    diagnosticsSubscriber = new ROSLIB.Topic({
        ros: ROS,
        name: '/joystick/diagnostics',
        messageType: 'std_msgs/String'
    });
    // Receive command
    diagnosticsSubscriber.subscribe(function (msg) {
        document.getElementById("status").innerHTML = msg.data;
    });
}
// Reconnect
function reconnect() {
    location.reload();
}