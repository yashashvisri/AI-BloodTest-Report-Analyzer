import re


def extract_blood_parameters(text: str):

    parameters = {}

    patterns = {

        "hemoglobin": r"Hemoglobin.*?(\d+\.?\d*)",

        "rbc": r"Total RBC count.*?(\d+\.?\d*)",

        "wbc": r"Total WBC count.*?(\d+)",

        "platelets": r"Platelet Count.*?(\d+)",

        "esr": r"ESR.*?(\d+)",

        "pcv": r"Packed Cell Volume.*?(\d+\.?\d*)",

        "mcv": r"Mean Corpuscular Volume.*?(\d+\.?\d*)",

        "mch": r"MCH\s+(\d+\.?\d*)",

        "mchc": r"MCHC.*?(\d+\.?\d*)",

        "rdw": r"RDW.*?(\d+\.?\d*)"

    }

    for key, pattern in patterns.items():

        match = re.search(pattern, text, re.IGNORECASE)

        if match:

            parameters[key] = float(match.group(1))

        else:

            parameters[key] = None

    return parameters