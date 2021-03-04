import subprocess


class SSH:
    def __init__(self, ip, port, user):
        self.ip = ip
        self.port = port
        self.user = user

    def execute(self, command, timeout=None, verbose=False):
        c = 'ssh -q {}@{} -p {} {}'.format(self.user, self.ip, self.port, command)
        e = subprocess.run(c.split(), capture_output=True, text=True, timeout=timeout)
        if verbose:
            print(c)
            if e.stderr:
                print(e.stderr)
        return e.returncode, e.stdout
