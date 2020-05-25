#!/usr/local/bin/python3
from PyPDF2 import PdfFileWriter, PdfFileReader
from pathlib import Path
import json
import sys

Path("./output").mkdir(parents=True, exist_ok=True)

with open('./students.json') as f:
  data = json.load(f)
  students = data["studentList"]

print(students[0]["name"])
inputpdf = PdfFileReader(open("answers.pdf", "rb"))

print("Number of students: %i" % len(students))

print("Number of pages: %i" % inputpdf.numPages)

pagesPerStudent = (inputpdf.numPages) // len(students)
print("Number of pages per students: %i" % pagesPerStudent)

if ((inputpdf.numPages) % len(students) != 0):
    sys.exit(f"number of pages ({inputpdf.numPages}) is not multiple of number of students ({len(students)})")

for i in range(len(students)):
    output = PdfFileWriter()
    for j in range(pagesPerStudent):
      output.addPage(inputpdf.getPage(i*pagesPerStudent+j))
    with open(f"""output/{students[i]["name"]}-risposte.pdf""","wb") as outputStream:
        output.write(outputStream)
