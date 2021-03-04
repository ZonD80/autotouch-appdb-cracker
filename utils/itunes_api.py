import requests
from utils.log import log_red
from utils.pick import pick


def get_itunes_id(url):
    head, _, _ = url.partition('?')
    head = head.replace('id', '')
    return head.split('/')[-1]


def data_from_selected_result(result):
    name = result['trackName']
    version = result['version']
    bundleId = result['bundleId']
    trackId = result['trackId']
    price = result['price'] if 'price' in result else 0.0  # if no price, it's apple arcade
    url = 'https://apps.apple.com/us/app/id{}'.format(trackId)
    is_arcade = 'price' not in result
    return name, version, bundleId, trackId, price, url, is_arcade


def choose_from_itunes_url(url):
    id = get_itunes_id(url)
    response = requests.get('https://itunes.apple.com/us/search?limit=200&term={}&media=software'.format(id))
    json = response.json()
    if len(json) == 0:
        log_red('Got empty response... iTunes API is down?')
        return ''
    elif json['resultCount'] < 1:
        log_red('Failed to search iTunes API. Aborting...')
        return ''
    else:
        selected = json['results'][0]
        return data_from_selected_result(selected)


def choose_from_itunes_keyword(keyword):
    response = requests.get('https://itunes.apple.com/us/search?limit=20&term={}&media=software'.format(keyword))
    json = response.json()
    if len(json) == 0:
        log_red('Got empty response... iTunes API is down?')
        return ''
    elif json['resultCount'] < 1:
        log_red('Failed to search iTunes API. Aborting...')
        return ''
    else:
        title = 'Please choose an app to decrypt:'
        options = []
        for result in json['results'][:20]:
            if 'price' in result:
                p = result['price'] if result['price'] != 0.0 else 'Free'
            else:
                p = 'Arcade'
            options.append('{:<35} {:<12} {:<32} {:<12} {:<7}'.format(
                (result['trackName'][:30] + '...') if len(result['trackName']) > 33 else result['trackName'],
                (result['version'][:7] + '...') if len(result['version']) > 10 else result['version'],
                (result['bundleId'][:27] + '...') if len(result['bundleId']) > 30 else result['bundleId'],
                result['trackId'],
                p
            ))
        _, index = pick(options, title)
        selected = json['results'][index]
        return data_from_selected_result(selected)
