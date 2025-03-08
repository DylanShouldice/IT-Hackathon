from google import genai

client = genai.Client(api_key="AIzaSyBaNRpY3qjfoSfgg6IHdkN2I-rii29sVlA")

def read_transcript(file_path):
    """Reads the content of a text file."""
    try:
        with open(file_path, 'r') as file:
            transcript = file.read()
        return transcript
    except FileNotFoundError:
        print("File not found")
        return None
    except Exception as e:
        print("An error occurred: ", e)
    return None #Ensure a return in all cases.

def summarize_with_gemini(project_id, location, transcript):
    """Summarizes a transcript using Gemini."""


    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=f"""
    Summarize the following medical consultation transcript into a structured medical report with these sections, I want the sections to be concise and clear, and the summary to be very high level:
    - Patient History: Briefly describe the patient's relevant medical history.
    - Findings: Summarize the key findings from the consultation.
    - Diagnosis: State any diagnoses or potential diagnoses.
    - Recommendations: List the doctor's recommendations and follow-up instructions.
    - Medications: List any medications mentioned, including dosages.

    Use accurate medical terminology.

    {transcript}
    """
)
    return response.text

project_id = "phonic-botany-453116-i5" #replace with your project ID
location = "us-east1" #replace with your location.

# Test transcript
test_transcript = """
Patient: I've been having a persistent cough and shortness of breath for the past few weeks.
Doctor: Do you have any allergies?
Patient: I'm allergic to pollen.
Doctor: Let's get a chest X-ray. I'm prescribing Albuterol, 2 puffs every 4 hours as needed. Follow up in one week.
"""

# Test without file read.
if test_transcript:
    print("Test transcript loaded.")
    summary = summarize_with_gemini(project_id, location, test_transcript)
    if summary:
        print("Summary:\n", summary)
    else:
        print("Summary generation failed.")
else:
    print("Test transcript loading failed.")

# Test with file read.
transcript_text = read_transcript("transcript.txt") # Create a transcript.txt with test data.
if transcript_text:
    print("Transcript read successfully")
    summary = summarize_with_gemini(project_id, location, transcript_text)
    if summary:
        print("Summary:\n", summary)
    else:
        print("Summary generation failed.")
else:
    print("Transcript read failed")
