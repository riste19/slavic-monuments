from pathlib import Path
from html.parser import HTMLParser
import re
import json

project = Path(__file__).resolve().parent.parent
root = project / 'public'
for asset in (root / 'assets').glob('memorial-*.svg'):
    text = asset.read_text(encoding='utf-8')
    if 'xmlns=' not in text:
        text = text.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ', 1)
    text = text.replace('viewbox', 'viewBox').replace('lineargradient', 'linearGradient')
    asset.write_text(text, encoding='utf-8')

html = (project / 'site' / 'index.html').read_text(encoding='utf-8')
script = (root / 'app.js').read_text(encoding='utf-8') + (root / 'extras.js').read_text(encoding='utf-8')
assert not re.search(r'StoneCold|Heartland|Legacy Memorial|Jim Stuit|Christian|Kevin|stonecoldrestorations|heartlandgravecare', html + script, re.I), 'Previous client content remains'
class Inspect(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.anchors = []
        self.assets = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'): self.ids.append(attrs['id'])
        for key in ['src', 'href']:
            value = attrs.get(key, '')
            if value.startswith('assets/'):
                assert (root / value).is_file(), f'Missing asset: {value}'
                self.assets.append(value)
        if tag == 'a' and attrs.get('href', '').startswith('#') and attrs['href'] != '#': self.anchors.append(attrs['href'][1:])
inspect = Inspect()
inspect.feed(html)
assert len(inspect.ids) == len(set(inspect.ids)), 'Duplicate HTML IDs'
assert all(a in inspect.ids for a in inspect.anchors), 'Broken section links'
for asset in (root / 'assets').glob('memorial-*.svg'):
    import xml.etree.ElementTree as ET
    ET.parse(asset)
print(json.dumps({'assets_checked': len(set(inspect.assets)), 'section_links_checked': len(inspect.anchors), 'previous_client_content': False, 'duplicate_ids': False}))
