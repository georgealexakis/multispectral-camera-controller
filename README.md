# Multispectral Camera Controller

Multispectral Camera Controller is a Web Application, for remote controlling and monitoring of a robot that runs ROS and is equipped with a multispectral cameras. It connects with ROS client API for camera reconfiguration. For this implementation, it has been used multispectral camera CMS-V1-C-EVR1M-GigE from [SILIOS Technologies](https://www.silios.com/) and the ROS Melodic version.
 
## Description

The project structure is made for using it with Apache cordova and build a hybrid application for the live view of the camera. This project enables the reconfiguration of camera parameters such as exposure, frame rate etc. Especially, for this project is used a multispectral camera with 9 bands.

Camera parameters can be change with this application such as frame rate, exposure, etc. It converts parameter list into string and send it to the node and waits the same structure as feedback. Also, it enables the control of multiple software functions.

## Package Installation

To connect ROS Joystick with ROS robot, it is necessary to install [rosbridge](https://wiki.ros.org/rosbridge_suite). Run the command below:

``` $ sudo apt-get install ros-<version>-rosbridge-server ```

## Topics

### Subscribed Topics

* Input image topic that it should be a compressed image topic.
* /camera_controller/feedback: Feedback of camera parameters for synchronization.

### Published Topics

* /camera_settings: Codes to enable multiple functions.
* /camera_controller: String to send camera parameters. Example: "10-55-30-False-True-True".

## Folders

* [/docs](https://github.com/georgealexakis/multispectral-camera-controller/tree/master/docs) folder contains the files for github pages. Just ignore it or delete it.
* [/www](https://github.com/georgealexakis/multispectral-camera-controller/tree/master/www) folder contains the main project files.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.