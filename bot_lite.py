import argparse
import subprocess
from timeit import default_timer as timer
from datetime import timedelta
from datetime import datetime
from utils.log import *
from utils.ssh import SSH


def start_decrypt_app(host, port, bundle_id, output_ipa, verbose=False):

    def log_verbose(message):
        if verbose:
            log_purple('[VERBOSE] {}'.format(message))

    def shell(command):
        p = subprocess.run(command.split(), capture_output=True, text=True)
        return p.stdout, p.stderr

    # ------------------- Start ---------------------

    start = timer()

    def clean_tmp_files():
        _, _ = ssh.execute('rm -rf /var/tmp/*.app')
        _, _ = ssh.execute('rm -rf /var/tmp/Payload')
        _, _ = ssh.execute('rm -rf /var/tmp/file.ipa')

    # --------- Locate app ----------------
    log_yellow('Locating app...')

    ssh = SSH(host, port, 'root')
    clean_tmp_files()
    base_path = '/var/containers/Bundle/Application/'
    _, apps = ssh.execute('ls {}'.format(base_path))
    apps = [x for x in apps.split('\n')[::-1] if x]
    log_verbose('[DEVICE] Apps folders: {}'.format(apps))
    correct_folder = ''
    for app in apps:
        code, _ = ssh.execute('cat {}{}/iTunesMetadata.plist | grep {}'.format(base_path, app, bundle_id), verbose=verbose)
        if code == 0:
            correct_folder = app
            break
    if correct_folder == '':
        log_red('[DEVICE] Error! Could not find app folder. Aborting...')
        return 1
    log_verbose('[DEVICE] Found folder: {}'.format(correct_folder))

    # --------- Start decryption ----------------
    log_yellow('Decrypting app...')

    # Copy .app to /var/tmp/
    log_verbose('Copying .app to /var/tmp/')
    app_path = '/var/containers/Bundle/Application/{}/*.app'.format(correct_folder)
    code, _ = ssh.execute('cp -r {} /var/tmp'.format(app_path), verbose=verbose)
    if code != 0:
        log_red('Error! Could not copy .app. Aborting...')
        return 1

    def decrypt(binary_name, binary_folder, output):
        log_yellow('Decrypting binary {}'.format(binary_name))
        binary_name = binary_name.replace(' ', '\ ')
        output = output.replace(' ', '\ ')
        cmd = 'flexdecrypt {}/{} --output {}'.format(binary_folder, binary_name, output)
        code, o = ssh.execute(cmd, timeout=30, verbose=verbose)
        if code != 0 or 'Wrote decrypted image' not in o:
            log_red('Error! Failed to decrypt {}. Aborting...'.format(binary_name))
            return 1
        # chmod decrypted binary
        ssh.execute('chmod +x {}'.format(output), verbose=verbose)

    # Main binary
    code, main_binary_name = ssh.execute('plutil -key CFBundleExecutable {}/Info.plist'.format(app_path), verbose=verbose)
    main_binary_name = main_binary_name.strip()
    if code != 0 or main_binary_name == '':
        log_red('Error! Could not retrieve main binary name. Aborting...')
        return 1
    log_verbose('Main binary: {}'.format(main_binary_name))
    decrypt(main_binary_name, app_path, '/var/tmp/*.app/{}'.format(main_binary_name))

    # Plugin binaries
    _, plugins_output = ssh.execute('ls {}/PlugIns'.format(app_path), verbose=verbose)
    plugins = [x for x in plugins_output.split('\n') if x]
    log_verbose('Plugins: {}'.format(plugins))
    for plugin in plugins:
        _, plugin_binary_name = ssh.execute(
            'plutil -key CFBundleExecutable {}/PlugIns/{}/Info.plist'.format(app_path, plugin), verbose=verbose
        )
        plugin_binary_name = plugin_binary_name.strip()
        if plugin_binary_name != '':
            decrypt(plugin_binary_name,
                    '{}/PlugIns/{}'.format(app_path, plugin),
                    '/var/tmp/*.app/PlugIns/{p}/{b}'.format(p=plugin, b=plugin_binary_name)
                    )

    # Framework binaries
    _, frameworks_output = ssh.execute('ls {}/Frameworks'.format(app_path), verbose=verbose)
    frameworks = [x for x in frameworks_output.split('\n') if x.endswith('.framework')]
    log_verbose('Frameworks: {}'.format(frameworks))
    for framework in frameworks:
        _, framework_binary_name = ssh.execute(
            'plutil -key CFBundleExecutable {}/Frameworks/{}/Info.plist'.format(app_path, framework), verbose=verbose
        )
        framework_binary_name = framework_binary_name.strip()
        if framework_binary_name != '':
            decrypt(framework_binary_name,
                    '{}/Frameworks/{}'.format(app_path, framework),
                    '/var/tmp/*.app/Frameworks/{f}/{b}'.format(f=framework, b=framework_binary_name)
                    )

    log_green('Decryption done!')
    time.sleep(1)

    # ----------- Remove _CodeSignature, PkgInfo, SC_Info, Watch ------------
    log_yellow('Removing unneeded files...')
    _, _ = ssh.execute('rm -rf /var/tmp/*.app/_CodeSignature')
    _, _ = ssh.execute('rm -rf /var/tmp/*.app/PkgInfo')
    _, _ = ssh.execute('rm -rf /var/tmp/*.app/SC_Info')
    _, _ = ssh.execute('rm -rf /var/tmp/*.app/Watch')

    # ----------- Disable NSApplicationRequiresArcade flag ------------
    log_yellow('Setting NSApplicationRequiresArcade flag to NO, if any...')
    _, _ = ssh.execute('plutil -no -key NSApplicationRequiresArcade /var/tmp/*.app/Info.plist')

    # ----------------- Add credits file -----------------------
    log_yellow('Adding credits file...')
    date = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    _, _ = ssh.execute(
        "cd /var/tmp/*.app && echo '{} - Cracked exclusively for appdb.to using CrackBot3' > appdb".format(date)
    )

    # --------- Zip as .ipa ----------------
    log_yellow('Zipping as .ipa...')
    _, _ = ssh.execute('mkdir -p /var/tmp/Payload && mv /var/tmp/*.app /var/tmp/Payload')
    _, _ = ssh.execute('cd /var/tmp && zip -qrF file.ipa Payload')
    _, _ = ssh.execute('rm -rf /var/tmp/Payload')

    # --------- Transfer .ipa ----------------
    log_yellow('Done, transfering ipa...')
    _, _ = shell('scp -p -P {} root@{}:/var/tmp/file.ipa {}'.format(port, host, output_ipa))

    # --------- Done! ----------------
    end = timer()
    clean_tmp_files()
    log_green('Done! Script ended in {}'.format(str(timedelta(seconds=int(end - start)))))
    return 0


if __name__ == '__main__':
    # ----------------- Parse arguments -----------------------
    parser = argparse.ArgumentParser()
    parser.add_argument('host', help='device IP')
    parser.add_argument('port', help='device port', type=int)
    parser.add_argument('bundleId', help='app bundle id')
    parser.add_argument('ipa', help='full path to output .ipa')
    args = parser.parse_args()

    HOST = args.host
    PORT = args.port
    BUNDLE_ID = args.bundleId
    IPA = args.ipa

    start_decrypt_app(HOST, PORT, BUNDLE_ID, IPA, verbose=False)
