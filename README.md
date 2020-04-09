# Multispectral camera controller

Experimental application for multispectral cameras and ROS. It connects with ROS client API for camera reconfiguration.
 
## Description

Experimental application for multispectral cameras and ROS. It connects with ROS client API for camera reconfiguration. You need to install rosbridge suite to enable the connection between ROS and the controller. This controller only has been tested with ROS melodic.

The project structure is made for using it with Apache cordova and build a hybrid application. This project enables the reconfiguration of camera parameters such as exposure, frame rate etc. Especially this project is used for multispectral camera with 9 bands.

Camera parameters can be change with this application such as frame rate, exposure, etc. It converts parameter list into string and send it to the node and waits the same structure as feedback. Transmitted string example: "10-55-30-False-True-True". It supports the display of multiple images.

## Folders

/docs folder contains the files for github pages. Just ignore it or delete it.
/www folder contains the main project files.