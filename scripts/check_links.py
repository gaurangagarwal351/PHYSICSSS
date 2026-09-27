"""Check local Markdown/HTML links in new portfolio files; no network required."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('href', 'src') and value:
                self.links.append(value)


errors = []
paths = [ROOT / 'README.md', *ROOT.glob('projects/**/*.md'), *ROOT.glob('docs/*.md'),
         *ROOT.glob('portfolio/**/*.html')]
for path in paths:
    text = path.read_text()
    if path.suffix == '.html':
        parser = Links()
        parser.feed(text)
        urls = parser.links
    else:
        urls = re.findall(r'\]\(([^\s)]+)\)', text)
    for url in urls:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc or not parts.path:
            continue
        target = (path.parent / unquote(parts.path)).resolve()
        if not target.exists():
            errors.append(f'{path.relative_to(ROOT)}: {url}')
if errors:
    raise SystemExit('Broken local links:\n' + '\n'.join(errors))
print(f'Local links checked in {len(paths)} documentation/HTML files.')
