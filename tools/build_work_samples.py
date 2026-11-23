"""Build the downloadable work samples from their reviewed text.

Requires python-docx and reportlab. These are document build dependencies;
the portfolio itself remains a static HTML, CSS and JavaScript site.
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "samples"
AUTHOR = "Quadri Busari"
INK = "282D28"
GREEN = "435D46"
MUTED = "647064"
RULE = "D8DFD5"
FILL = "EEF2EA"


def pdf_color(value):
    return colors.HexColor("#" + value)


def check_text(value):
    if isinstance(value, str):
        if any(character in value for character in "\u2013\u2014\u2015"):
            raise ValueError("Replace long dashes with ordinary punctuation")
    elif isinstance(value, dict):
        for item in value.values():
            check_text(item)
    elif isinstance(value, list):
        for item in value:
            check_text(item)


def word_table(document, source):
    columns = len(source["headers"])
    table = document.add_table(rows=1, cols=columns)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    widths = source.get("widths", [1 / columns] * columns)
    available = Cm(17)
    for column, width in zip(table.columns, widths):
        column.width = int(available * width)
    header = table.rows[0]
    repeat = OxmlElement("w:tblHeader")
    header._tr.get_or_add_trPr().append(repeat)
    for index, values in enumerate([source["headers"], *source["rows"]]):
        row = header if index == 0 else table.add_row()
        prevent_split = OxmlElement("w:cantSplit")
        row._tr.get_or_add_trPr().append(prevent_split)
        for cell, value, width in zip(row.cells, values, widths):
            cell.width = int(available * width)
            cell.text = value
            properties = cell._tc.get_or_add_tcPr()
            if index == 0:
                shading = OxmlElement("w:shd")
                shading.set(qn("w:fill"), FILL)
                properties.append(shading)
            for paragraph in cell.paragraphs:
                paragraph.paragraph_format.space_after = Pt(4)
                paragraph.paragraph_format.space_before = Pt(3)
                paragraph.paragraph_format.line_spacing = 1.12
                for run in paragraph.runs:
                    run.font.size = Pt(9.5)
                    run.bold = index == 0
    document.add_paragraph().paragraph_format.space_after = Pt(1)


def build_word(name, sample):
    document = Document()
    section = document.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)
    section.left_margin = Cm(2)
    section.right_margin = Cm(2)
    section.header_distance = Cm(0.8)
    section.footer_distance = Cm(0.9)
    normal = document.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.line_spacing = 1.16
    normal.paragraph_format.space_after = Pt(7)
    for style_name in ["Heading 1", "Heading 2"]:
        style = document.styles[style_name]
        style.font.name = "Calibri"
        style.font.size = Pt(12)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(GREEN)
        style.paragraph_format.space_before = Pt(12)
        style.paragraph_format.space_after = Pt(6)
        style.paragraph_format.keep_with_next = True
    title = document.add_paragraph()
    title.paragraph_format.space_after = Pt(7)
    run = title.add_run(sample["title"])
    run.font.name = "Georgia"
    run.font.size = Pt(23)
    run.font.color.rgb = RGBColor.from_string(INK)
    byline = document.add_paragraph(f"{AUTHOR} | Work sample")
    for run in byline.runs:
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor.from_string(MUTED)
    subtitle = document.add_paragraph(sample["subtitle"])
    for run in subtitle.runs:
        run.font.bold = True
        run.font.color.rgb = RGBColor.from_string(GREEN)
    document.add_paragraph(sample["intro"])
    for item in sample["sections"]:
        heading = document.add_paragraph(item["heading"], "Heading 1")
        heading.paragraph_format.page_break_before = item.get("newPage", False)
        for value in item.get("text", []):
            document.add_paragraph(value)
        if "table" in item:
            word_table(document, item["table"])
        for value in item.get("textAfter", []):
            document.add_paragraph(value)
        if "secondTable" in item:
            word_table(document, item["secondTable"])
        for value in item.get("bullets", []):
            document.add_paragraph(value, "List Bullet")
    footer = section.footer.paragraphs[0]
    footer.add_run(f"{AUTHOR} | Work sample")
    footer.add_run("\t")
    footer.paragraph_format.tab_stops.add_tab_stop(Cm(16))
    page = OxmlElement("w:fldSimple")
    page.set(qn("w:instr"), "PAGE")
    footer._p.append(page)
    for run in footer.runs:
        run.font.size = Pt(8)
        run.font.color.rgb = RGBColor.from_string(MUTED)
    properties = document.core_properties
    properties.title = sample["title"]
    properties.subject = sample["subtitle"]
    properties.author = AUTHOR
    properties.last_modified_by = AUTHOR
    properties.comments = ""
    properties.keywords = ""
    properties.category = "Work sample"
    properties.revision = 1
    properties.created = datetime.now(timezone.utc)
    properties.modified = properties.created
    path = ROOT / f"{name}.docx"
    document.save(path)
    # The new package contains no source-document comments or revision history.
    # Clear the template's application metadata rather than attribute a tool.
    with ZipFile(path) as archive:
        parts = {item.filename: archive.read(item) for item in archive.infolist()}
    application = ElementTree.fromstring(parts["docProps/app.xml"])
    for node in application:
        if node.tag.rsplit("}", 1)[-1] in {"Application", "AppVersion"}:
            node.text = ""
    parts["docProps/app.xml"] = ElementTree.tostring(
        application, encoding="utf-8", xml_declaration=True
    )
    with ZipFile(path, "w", ZIP_DEFLATED) as archive:
        for filename, content in parts.items():
            archive.writestr(filename, content)
    return path


PDF_STYLES = {
    "body": ParagraphStyle(
        "body", fontName="Helvetica", fontSize=10.2, leading=14.4,
        textColor=pdf_color(INK), spaceAfter=8, alignment=TA_LEFT,
    ),
    "title": ParagraphStyle(
        "title", fontName="Times-Roman", fontSize=25, leading=29,
        textColor=pdf_color(INK), spaceAfter=9,
    ),
    "byline": ParagraphStyle(
        "byline", fontName="Helvetica", fontSize=9, leading=12,
        textColor=pdf_color(MUTED), spaceAfter=11,
    ),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Helvetica-Bold", fontSize=10.5, leading=14,
        textColor=pdf_color(GREEN), spaceAfter=10,
    ),
    "heading": ParagraphStyle(
        "heading", fontName="Helvetica-Bold", fontSize=12, leading=16,
        textColor=pdf_color(GREEN), spaceBefore=10, spaceAfter=7,
        keepWithNext=True,
    ),
    "cell": ParagraphStyle(
        "cell", fontName="Helvetica", fontSize=9.1, leading=12.2,
        textColor=pdf_color(INK),
    ),
    "cell_heading": ParagraphStyle(
        "cell_heading", fontName="Helvetica-Bold", fontSize=9.1, leading=12.2,
        textColor=pdf_color(GREEN),
    ),
}


def pdf_paragraph(value, style="body"):
    return Paragraph(escape(value).replace("\n", "<br/>"), PDF_STYLES[style])


def pdf_table(source, available):
    widths = source.get("widths", [1 / len(source["headers"])] * len(source["headers"]))
    rows = [
        [pdf_paragraph(value, "cell_heading" if index == 0 else "cell") for value in row]
        for index, row in enumerate([source["headers"], *source["rows"]])
    ]
    table = Table(rows, colWidths=[available * width for width in widths], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), pdf_color(FILL)),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, pdf_color(RULE)),
        ("LINEABOVE", (0, 0), (-1, 0), 0.5, pdf_color(RULE)),
    ]))
    return table


class SampleCanvas(Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.setCreator(AUTHOR)
        self.setProducer("")


def build_pdf(name, sample):
    path = OUTPUT / f"{name}.pdf"
    pdf = SimpleDocTemplate(
        str(path), pagesize=A4, leftMargin=48, rightMargin=48,
        topMargin=48, bottomMargin=52, title=sample["title"],
        author=AUTHOR, subject=sample["subtitle"], pageCompression=1,
    )
    story = [
        pdf_paragraph(sample["title"], "title"),
        pdf_paragraph(f"{AUTHOR} | Work sample", "byline"),
        pdf_paragraph(sample["subtitle"], "subtitle"),
        pdf_paragraph(sample["intro"]),
    ]
    for item in sample["sections"]:
        if item.get("newPage"):
            story.append(PageBreak())
        story.append(pdf_paragraph(item["heading"], "heading"))
        for value in item.get("text", []):
            story.append(pdf_paragraph(value))
        if "table" in item:
            story.extend([pdf_table(item["table"], pdf.width), Spacer(1, 9)])
        for value in item.get("textAfter", []):
            story.append(pdf_paragraph(value))
        if "secondTable" in item:
            story.extend([pdf_table(item["secondTable"], pdf.width), Spacer(1, 9)])
        if item.get("bullets"):
            story.extend([
                ListFlowable(
                    [ListItem(pdf_paragraph(value), leftIndent=10) for value in item["bullets"]],
                    bulletType="bullet", start="circle", leftIndent=13,
                    bulletFontName="Helvetica", bulletFontSize=5, bulletOffsetY=2,
                ),
                Spacer(1, 4),
            ])

    def page_details(canvas, document):
        canvas.saveState()
        canvas.setStrokeColor(pdf_color(RULE))
        canvas.setLineWidth(0.5)
        canvas.line(48, 41, A4[0] - 48, 41)
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(pdf_color(MUTED))
        canvas.drawString(48, 28, f"{AUTHOR} | Work sample")
        canvas.drawRightString(A4[0] - 48, 28, str(document.page))
        if document.page > 1:
            canvas.drawString(48, A4[1] - 28, sample["subtitle"])
        canvas.restoreState()

    pdf.build(story, onFirstPage=page_details, onLaterPages=page_details, canvasmaker=SampleCanvas)
    return path


def main():
    samples = json.loads((ROOT / "content" / "work-samples.json").read_text(encoding="utf-8"))
    check_text(samples)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    files = []
    for name, sample in samples.items():
        files.extend([build_word(name, sample), build_pdf(name, sample)])
        print(f"Built {name}: PDF and Word")
    with ZipFile(OUTPUT / "Quadri_Busari_Annotation_Samples.zip", "w", ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, path.name)
    print(f"Archive contains {len(files)} files for {len(samples)} unique samples")


if __name__ == "__main__":
    main()
