import time


def log(message, color, with_date=True, end='\n'):
    if with_date:
        print('\033[9{}m[{}] {}\033[00m'.format(color, time.strftime("%H:%M:%S"), message), end=end)
    else:
        print('\033[9{}m{}\033[00m'.format(color, message), end=end)


def log_red(message, with_date=True, end='\n'):
    log(message, '1', with_date, end)


def log_green(message, with_date=True, end='\n'):
    log(message, '2', with_date, end)


def log_yellow(message, with_date=True, end='\n'):
    log(message, '3', with_date, end)


def log_purple(message, with_date=True, end='\n'):
    log(message, '5', with_date, end)


def log_cyan(message, with_date=True, end='\n'):
    log(message, '6', with_date, end)
