import os
import tempfile

from fastapi import FastAPI, UploadFile, File
from pyxform.xls2xform import xls2xform_convert, get_xml_path

app = FastAPI()


@app.post("/validate-and-get-xml")
async def convert_with_cli_output(file: UploadFile = File(...)):
    # Sanitize (optional but recommended)
    original_name = os.path.basename(file.filename)

    # Use original name + suffix
    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, original_name)

    # Save uploaded file to that path
    content = await file.read()
    with open(tmp_path, "wb") as tmp:
        tmp.write(content)

    output_path = get_xml_path(tmp_path)
    response = {
        "code": None,
        "message": None,
        "warnings": [],
        "status": None,
        "schema": None,
    }
    try:
        warnings = xls2xform_convert(
            xlsform_path=tmp_path,
            xform_path=output_path,
            validate=True,
            pretty_print=True,
            enketo=False,
        )

        response["warnings"] = warnings or []
        response["code"] = 100 if not warnings else 101
        response["message"] = "Ok!" if not warnings else "Ok with warnings."
        response["status"] = "success" if not warnings else "warning"

        # Read XML as string
        with open(output_path, "r", encoding="utf-8") as f:
            response["schemaXml"] = f.read()

    except Exception as e:
        response["code"] = 999
        response["message"] = str(e)
        response["status"] = "error"

    return response

# @app.post("/get-xml")
# async def get_xml(file: UploadFile = File(...)):
#     content = await file.read()
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
#         tmp.write(content)
#         tmp_path = tmp.name
#
#     try:
#         xml_str = create_survey_from_xls(tmp_path).to_xml()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         os.remove(tmp_path)
#
#     return Response(
#         content=xml_str,
#         media_type="application/xml",
#         headers={"Content-Disposition": "inline; filename=form.xml"}
#     )
