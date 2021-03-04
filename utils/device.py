from utils.zxtouch.client import zxtouch
from utils.zxtouch.touchtypes import *


class Device:

    def __init__(self, ip):
        self.device = zxtouch(ip)

    def __del__(self):
        self.device.disconnect()

    def sleep(self, seconds):
        self.device.accurate_usleep(seconds * 1000000)

    def touch(self, x, y):
        self.device.touch(TOUCH_DOWN, 1, x, y)
        self.sleep(0.1)
        self.device.touch(TOUCH_UP, 1, x, y)

    def move_down(self, x, from_y, to_y):
        self.device.touch(TOUCH_DOWN, 1, x, from_y)
        self.sleep(0.1)
        self.device.touch(TOUCH_MOVE, 1, x, to_y)
        self.sleep(0.1)
        self.device.touch(TOUCH_UP, 1, x, to_y)

    def touch_coords(self, coords):
        x, y, width, height = coords
        self.touch(x + width / 2, y + height / 2)

    def open(self, url):
        self.device.run_shell_command('uiopen ' + url)

    def go_home(self):
        self.device.switch_to_app("com.apple.springboard")

    def image_matches(self, img):
        img_absolute_url = "/var/mobile/Library/ZXTouch/images/" + img
        result = self.device.image_match(img_absolute_url, 0.75, 5, 0.85)

        if not result[0]:
            return False, []
        else:
            result_dict = result[1]
            width = float(result_dict["height"])
            height = float(result_dict["width"])
            x = float(result_dict["x"])
            y = float(result_dict["y"])

            if width != 0 and height != 0:
                return True, [x, y, width, height]
            else:
                return False, []


if __name__ == '__main__':
    device = Device('192.168.1.68')
    device.move_down(350, from_y=900, to_y=50)