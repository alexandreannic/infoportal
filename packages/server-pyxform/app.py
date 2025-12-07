import os
import tempfile

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from pyxform import create_survey_from_xls
from fastapi import HTTPException

app = FastAPI()


@app.post("/get-xml")
async def get_xml(file: UploadFile = File(...)):
    content = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        xml_str = create_survey_from_xls(tmp_path).to_xml()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.remove(tmp_path)

    return Response(
        content=xml_str,
        media_type="application/xml",
        headers={"Content-Disposition": "inline; filename=form.xml"}
    )
