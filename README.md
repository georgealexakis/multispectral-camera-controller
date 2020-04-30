# Multispectral camera controller

Experimental application for multispectral cameras and ROS. It connects with ROS client API for camera reconfiguration. For this implementation, it has used multispectral camera CMS-V1-C-EVR1M-GigE from SILIOS Technologies.
 
## Description

Experimental application for multispectral cameras and ROS. It connects with ROS client API for camera reconfiguration. You need to install rosbridge suite to enable the connection between ROS and the controller. This controller only has been tested with ROS melodic.

The project structure is made for using it with Apache cordova and build a hybrid application. This project enables the reconfiguration of camera parameters such as exposure, frame rate etc. Especially this project is used for multispectral camera with 9 bands.

Camera parameters can be change with this application such as frame rate, exposure, etc. It converts parameter list into string and send it to the node and waits the same structure as feedback. Also, it enables the contoll of multiple software functions.

## Topics

### Subscribed Topics

- Input image topic that it should be compressed.
- /camera_controller/feedback: Feedback of camera parameters for synchronization.

### Published Topics

- /camera_settings: Codes to enable multiple functions.
- /camera_controller: String to send camera parameters. Example: "10-55-30-False-True-True".

## Folders

/docs folder contains the files for github pages. Just ignore it or delete it.
/www folder contains the main project files.