def generate_report(analysis):

    report = []

    report.append("=" * 70)
    report.append("AI BLOOD TEST REPORT SUMMARY")
    report.append("=" * 70)
    report.append("")

    overall = []

    for parameter, details in analysis.items():

        status = details["status"]
        value = details["value"]

        if value is None:
            continue

        if status == "Low":

            overall.append(f"{parameter.upper()} is below the normal range.")

        elif status == "High":

            overall.append(f"{parameter.upper()} is above the normal range.")

        else:

            overall.append(f"{parameter.upper()} is within the normal range.")

    report.append("Overall Findings")
    report.append("--------------------------")

    for item in overall:

        report.append(f"• {item}")

    report.append("")

    report.append("Recommendation")
    report.append("--------------------------")

    if any(i["status"] == "Low" for i in analysis.values()):

        report.append(
            "- Some blood parameters are below the normal range."
        )

        report.append(
            "- Please consult your physician for further evaluation."
        )

    elif any(i["status"] == "High" for i in analysis.values()):

        report.append(
            "- Some blood parameters are above the normal range."
        )

        report.append(
            "- Medical consultation is recommended."
        )

    else:

        report.append(
            "- All major blood parameters appear within the normal range."
        )

    report.append("")
    report.append("⚠ This report is AI-generated and not a medical diagnosis.")

    return "\n".join(report)