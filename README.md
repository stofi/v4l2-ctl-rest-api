# v4l2-ctl-rest-api
RESTful API to control USB camera settings via v4l2-ctl.

## Installing
1. `git clone https://github.com/Ernie3/v4l2-ctl-rest-api.git`
2. `cd v4l2-ctl-rest-api`
3. `npm install`
4. `npm start`

## How to Use this API
All endpoints follow the structure `GET /{deviceId}`, `GET /{deviceId}/{setting}` or `POST /{deviceId}/{setting}/{value}`. You can also get the maximum and minimum values of a devices setting via `GET /{deviceId}/{setting}/max_value` or `GET /{deviceId}/{setting}/min_value`.

## Get a list of Devices
You can get list of all available devices by using `GET /devices`. This returns a list of device ids as and array of integers.

## Currently Supported Setting Controls
You can get the device supported settings using `GET /{deviceId}/settings`. This will return all of the supported settings for the device as an array of strings.

## Example
If you have a USB device connected to `/dev/video0`, you can get its current brightness via `GET /0/brightness`, or set its brightness via `POST /0/brightness/0/130`.

## Setting up v4l2-ctl-rest-api to Run on Boot
```
./service_manager.sh argument

install - installs v4l2-ctl-rest-api service and enables start on boot
start - starts v4l2-ctl-rest-api via systemctl (service must be installed)
stop - stops v4l2-ctl-rest-api via systemctl (service must be installed)
enable - enables v4l2-ctl-rest-api to start on boot (service must be installed)
disable - disables v4l2-ctl-rest-api from starting on boot (service must be installed)
uninstall - completely removes v4l2-ctl-rest-api service from systemctl
```

## See Also
1. [Installing Node.js on a Raspberry Pi](https://github.com/Ernie3/pi_h264#help-installing-nodejs-v10-on-the-pi)
2. [pi_h264](https://github.com/Ernie3/pi_h264)
