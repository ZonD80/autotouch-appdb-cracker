import time
import socket
from utils.zxtouch import datahandler
from utils.zxtouch import deviceinfotasktypes, tasktypes, kbdtasktypes


class zxtouch:
    def __init__(self, ip):
        self.s = socket.socket()
        self.s.connect((str(ip), 6000))
        time.sleep(0.1)

    def touch(self, type, finger_index, x, y):
        """Perform a touch event

        :param type: touch type
        :param finger_index: which finger you want to perform touch
        :param x: x coordinate
        :param y: y coordinate
        :return: None
        """
        if int(type) > 19:
            print("Touch index should not be greater than 19.")
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_PERFORM_TOUCH,
                                                   '1{}{:02d}{:05d}{:05d}'.format(type, finger_index, int(x * 10),
                                                                                  int(y * 10))))

    def touch_with_list(self, touch_list: list):
        """Perform touch events with a list of events
        touch list should be a list of dictionary that you want to perform touch with following format

        :param touch_list: [{"type": ?, "finger_index": ?, "x": ?, "y": ?}]
        :return: None
        """
        event_data = ''
        for touch_event in touch_list:
            event_data += '{}{:02d}{:05d}{:05d}'.format(touch_event['type'], touch_event['finger_index'],
                                                        touch_event['x'] * 10,
                                                        touch_event['y'] * 10)
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_PERFORM_TOUCH, str(len(touch_list)) + event_data))

    def switch_to_app(self, bundle_identifier):
        """Bring an application to foreground

        :param bundle_identifier: the bundle identifier of the application
        :return: Result tuple

        The format of the result tuple:
        result_tuple[0]: True if no error happens when executing the command on your device. False otherwise
        result_tuple[1]: error info if result_tuple[0] == False. Otherwise ""
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_PROCESS_BRING_FOREGROUND, bundle_identifier))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def show_alert_box(self, title, content, duration):
        """Show alert box on device

        Args:
            title: title of the alert box
            content: content of the alert box
            duration: the time the alert box shows before disappear

        Returns:
            Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_SHOW_ALERT_BOX, title, content, duration))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def run_shell_command(self, command):
        """Run shell command on device as root

        :param command: command to run
        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_RUN_SHELL, command))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def start_touch_recording(self):
        """Start recording touch events

        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_TOUCH_RECORDING_START))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def stop_touch_recording(self):
        """Stop recording touch events

        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_TOUCH_RECORDING_STOP))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def accurate_usleep(self, microseconds):
        """Don't know why, but python on ios will not sleep accurately sometimes. So you can use this to sleep

        :param microseconds: microseconds to sleep
        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_USLEEP, microseconds))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def play_script(self, script_absolute_path):
        """Play a script

        :param script_absolute_path: the absolute path of the script
        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_PLAY_SCRIPT, script_absolute_path))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def force_stop_script_play(self):
        """Force stopping playing current script"""
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_PLAY_SCRIPT_FORCE_STOP))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def image_match(self, template_path, acceptable_value=0.8, max_try_times=4, scaleRation=0.8):
        """Get the coordinate of a image

        :param template_path: template path on your ios device
        :param acceptable_value: for a successful match, the acceptable value
        :param max_try_times: how many times you want to try with different size of the template
        :param scaleRation: for each time you try, what the template size should be

        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_TEMPLATE_MATCH, template_path, max_try_times,
                                                   acceptable_value, scaleRation))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]

        return True, {"x": result[1][0], "y": result[1][1], "width": result[1][2], "height": result[1][3]}

    def show_toast(self, toast_type, content, duration, position=0, fontSize=0):
        """Show toast on ios device

        :param type: type of the toast.
        :param content: content of the toast
        :param duration: duration of the toast
        :param position: position of the toast. 0 for top, 1 for bottom
        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_SHOW_TOAST, toast_type, content, duration, position,
                                                   fontSize))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def pick_color(self, x, y):
        """Get the rgb value from the screen. The format returned is (red, green, blue)

        :param x: x coordinate of the point on the screen
        :param y: y coordinate of the point on the screen
        :return: Result tuple: (success?, error_message/dictionary that stores the result)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_COLOR_PICKER, x, y))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]

        return True, {"red": result[1][0], "green": result[1][1], "blue": result[1][2]}

    def show_keyboard(self):
        """Show the keyboard

        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(
            datahandler.format_socket_data(tasktypes.TASK_KEYBOARDIMPL, kbdtasktypes.KEYBOARD_VIRTUAL_KEYBOARD, 2))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def hide_keyboard(self):
        """hide the keyboard

        :return: Result tuple: (success?, error_message/return value)
        """
        self.s.send(
            datahandler.format_socket_data(tasktypes.TASK_KEYBOARDIMPL, kbdtasktypes.KEYBOARD_VIRTUAL_KEYBOARD, 1))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def insert_text(self, text):
        """Insert text into the text field

        :param text: text to insert
        :return:
        """
        for i, ch in enumerate(text):
            if ch == "\b":
                self.s.send(
                    datahandler.format_socket_data(tasktypes.TASK_KEYBOARDIMPL, kbdtasktypes.KEYBOARD_DELETE_CHARACTERS,
                                                   1))
                datahandler.decode_socket_data(self.s.recv(1024))
            else:
                self.s.send(
                    datahandler.format_socket_data(tasktypes.TASK_KEYBOARDIMPL, kbdtasktypes.KEYBOARD_INSERT_TEXT, ch))
                datahandler.decode_socket_data(self.s.recv(1024))
        return (True, "")


    def move_cursor(self, offset):
        """Move the cursor on the text field

        :param offset: the related position you want to move. To move left, offset should be negative. For moving right, it should be positive.
        :return:
        """
        self.s.send(
            datahandler.format_socket_data(tasktypes.TASK_KEYBOARDIMPL, kbdtasktypes.KEYBOARD_MOVE_CURSOR, offset))
        return datahandler.decode_socket_data(self.s.recv(1024))

    def get_screen_size(self):
        """Get screen size in pixels

        :return: Result tuple: (success?, error_message/dictionary that stores the result)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_GET_DEVICE_INFO,
                                                   deviceinfotasktypes.DEVICE_INFO_TASK_GET_SCREEN_SIZE))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]
        return True, {"width": result[1][0], "height": result[1][1]}

    def get_screen_orientation(self):
        """Get orientation of the screen

        :return: Result tuple: (success?, error_message/screen orientation(str, can be convert to int))
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_GET_DEVICE_INFO,
                                                   deviceinfotasktypes.DEVICE_INFO_TASK_GET_SCREEN_ORIENTATION))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]
        return True, result[1][0]

    def get_screen_scale(self):
        """Get screen scale

        :return: Result tuple: (success?, error_message/screen scale(str, can be convert to int))
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_GET_DEVICE_INFO,
                                                   deviceinfotasktypes.DEVICE_INFO_TASK_GET_SCREEN_SCALE))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]
        return True, result[1][0]

    def get_device_info(self):
        """Get information of the device

        :return: Result tuple: (success?, error_message/dictionary that stores device information)
        """
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_GET_DEVICE_INFO,
                                                   deviceinfotasktypes.DEVICE_INFO_TASK_GET_DEVICE_INFO))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]
        return True, {"name": result[1][0], "system_name": result[1][1], "system_version": result[1][2],
                      "model": result[1][3], "identifier_for_vendor": result[1][4]}

    def get_battery_info(self):
        self.s.send(datahandler.format_socket_data(tasktypes.TASK_GET_DEVICE_INFO,
                                                   deviceinfotasktypes.DEVICE_INFO_TASK_GET_BATTERY_INFO))
        result = datahandler.decode_socket_data(self.s.recv(1024))
        if not result[0]:
            return False, result[1]
        battery_state_return = int(result[1][0])
        battery_state_list = ["Unknown", "Unplugged", "Charging", "Full"]

        return True, {"battery_state": result[1][0], "battery_level": str(int(float(result[1][1]))),
                      "battery_state_string": battery_state_list[battery_state_return]}  # state: 0 unknown, 1 unplegged, 2 charging, 3 full

    def disconnect(self):
        self.s.close()