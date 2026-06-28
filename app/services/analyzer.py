REFERENCE_RANGES = {

    "hemoglobin": (13.0, 17.0),

    "rbc": (4.5, 5.5),

    "wbc": (4000, 11000),

    "platelets": (150000, 410000),

    "esr": (0, 15),

    "pcv": (40, 50),

    "mcv": (83, 101),

    "mch": (27, 32),

    "mchc": (32.5, 34.5),

    "rdw": (11.6, 14.0)
}


def analyze_parameters(parameters):

    results = {}

    for name, value in parameters.items():

        if value is None:

            results[name] = {
                "value": None,
                "status": "Not Found"
            }

            continue

        low, high = REFERENCE_RANGES[name]

        if value < low:

            status = "Low"

        elif value > high:

            status = "High"

        else:

            status = "Normal"

        results[name] = {

            "value": value,

            "reference_range": f"{low}-{high}",

            "status": status

        }

    return results