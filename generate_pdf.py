#!/usr/bin/env python3
"""Convert the research brief markdown to a styled PDF using weasyprint."""

import markdown
from weasyprint import HTML
from pathlib import Path

DRAFT = Path("outputs/.drafts/abstraction-human-language-code-draft.md")
OUTPUT = Path("papers/abstraction-human-language-code.pdf")

md_text = DRAFT.read_text()
html_body = markdown.markdown(md_text, extensions=["tables", "fenced_code", "codehilite", "toc"])

full_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {{
    size: A4;
    margin: 2.5cm 2cm;
    @top-center {{
      content: "The Abstraction Gap: Human Language, Machine Language, and the Future of Programming Harnesses";
      font-size: 8pt;
      color: #666;
    }}
    @bottom-center {{
      content: "Page " counter(page) " of " counter(pages);
      font-size: 8pt;
      color: #666;
    }}
  }}
  body {{
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 100%;
  }}
  h1 {{
    font-size: 22pt;
    color: #1a1a2e;
    border-bottom: 3px solid #16213e;
    padding-bottom: 10px;
    margin-top: 30px;
    page-break-before: auto;
  }}
  h1:first-of-type {{
    font-size: 26pt;
    text-align: center;
    border-bottom: none;
    margin-bottom: 5px;
  }}
  h2 {{
    font-size: 16pt;
    color: #16213e;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    margin-top: 25px;
    page-break-after: avoid;
  }}
  h3 {{
    font-size: 13pt;
    color: #0f3460;
    margin-top: 20px;
    page-break-after: avoid;
  }}
  h4 {{
    font-size: 11pt;
    color: #333;
    font-weight: bold;
    margin-top: 15px;
  }}
  p {{
    text-align: justify;
    margin-bottom: 8px;
    orphans: 3;
    widows: 3;
  }}
  blockquote {{
    border-left: 4px solid #16213e;
    margin: 15px 0;
    padding: 10px 20px;
    background: #f8f9fa;
    font-style: italic;
    color: #333;
    page-break-inside: avoid;
  }}
  blockquote p {{
    margin: 5px 0;
  }}
  table {{
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }}
  th {{
    background: #16213e;
    color: white;
    padding: 8px 12px;
    text-align: left;
    font-weight: bold;
  }}
  td {{
    padding: 6px 12px;
    border-bottom: 1px solid #ddd;
  }}
  tr:nth-child(even) {{
    background: #f8f9fa;
  }}
  code {{
    background: #f4f4f4;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 9.5pt;
    font-family: 'Courier New', monospace;
  }}
  pre {{
    background: #2d2d2d;
    color: #e6e6e6;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    font-size: 9pt;
    line-height: 1.4;
    page-break-inside: avoid;
  }}
  pre code {{
    background: none;
    padding: 0;
    color: #e6e6e6;
  }}
  strong {{
    color: #16213e;
  }}
  em {{
    color: #555;
  }}
  hr {{
    border: none;
    border-top: 2px solid #16213e;
    margin: 30px 0;
  }}
  a {{
    color: #0f3460;
    text-decoration: none;
  }}
  .subtitle {{
    text-align: center;
    font-size: 12pt;
    color: #555;
    margin-top: 0;
    margin-bottom: 30px;
  }}
  ul, ol {{
    margin: 10px 0;
    padding-left: 25px;
  }}
  li {{
    margin-bottom: 4px;
  }}
</style>
</head>
<body>
{html_body}
</body>
</html>"""

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
HTML(string=full_html).write_pdf(str(OUTPUT))
print(f"PDF written to {OUTPUT}")
print(f"Size: {OUTPUT.stat().st_size / 1024:.0f} KB")
