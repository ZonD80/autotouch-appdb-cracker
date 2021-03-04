import requests
import subprocess

from utils.log import log_red

APPDB_ENDPOINT = 'https://api.dbservices.to/v1.3/'
APPDB_LINK_TOKEN = 'b9f5ce9490bbf6490c9925fbbd3488ab0647c673'
APPDB_STAFF_TOKEN = '351972d5ad1db0a918022f71de4c22d720817bb7'


def get_wishes():
    params = (
        ('action', 'get_publish_requests'),
        ('type', 'ios'),
        ('price', 2),  # 0 - default - all apps, 1 - paid only, 2 - free only
        ('include_all', 0)  # 1 to get all requests, including fulfilled ones. Default is 0 - only pending.
    )
    response = requests.post(APPDB_ENDPOINT, params=params).json()
    return response["data"]


def wish_set_status(id, status):
    c = {'lt': f"{APPDB_LINK_TOKEN}", }
    p = (
        ('action', 'set_publish_request_status'),
        ('type', 'ios'),
        ('id', id),
        ('status', status),
        ('st', APPDB_STAFF_TOKEN)
    )
    response = requests.post(APPDB_ENDPOINT, params=p, cookies=c).json()
    if not response['success']:
        log_red('Error: {}'.format(response['errors'][0]))
        exit(1)


def wish_ipa_provided(id, ipa):
    action = 'set_publish_request_status'
    status = 'ipa_provided'
    cmd = 'curl -# --cookie "lt={}" "{}?action={}&type=ios&id={}&status={}&st={}" -F "ipa=@{}"' \
        .format(APPDB_LINK_TOKEN, APPDB_ENDPOINT, action, id, status, APPDB_STAFF_TOKEN, ipa)
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
    for line in iter(process.stdout.readline, b''):
        print(line)
    process.stdout.close()
    process.wait()


def is_already_cracked(trackid, cracker='n3d'):
    c = {'lt': f"{APPDB_LINK_TOKEN}", }
    p = (
        ('action', 'search'),
        ('type', 'ios'),
        ('trackid', trackid)
    )
    response = requests.post(APPDB_ENDPOINT, params=p, cookies=c).json()
    if not response['data']:  # apps not in database
        return False
    version = response['data'][0]['version']

    p = (
        ('action', 'get_links'),
        ('type', 'ios'),
        ('trackids', [trackid])
    )
    response = requests.post(APPDB_ENDPOINT, params=p, cookies=c).json()
    if response['data'] and version in response['data'][trackid]:  # apps with no links to latest version
        for link in response['data'][trackid][version]:
            if link['cracker'] == cracker:
                return True
    return False


def add_wish(itunes_url):
    c = {'lt': f"{APPDB_LINK_TOKEN}", }
    p = (
        ('action', 'create_publish_request'),
        ('type', 'ios'),
        ('url', itunes_url)
    )
    response = requests.post(APPDB_ENDPOINT, params=p, cookies=c).json()
    if not response['success']:
        log_red('Error: {}'.format(response['errors'][0]))
        exit(1)
    return response['data']['id']
