from google import genai
import requests
import json

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

def remove_chars(input_string):
  """Removes the first 8 and last 4 characters from a string.

  Args:
    input_string: The string to modify.

  Returns:
    The modified string, or an empty string if the input is too short.
  """
  if len(input_string) > 12:  # Ensure there are enough characters
    return input_string[8:-4]
  else:
    return ""

def summarize_with_gemini(transcript):
    """Summarizes a transcript using Gemini."""


    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=f"""
    Summarize the following medical consultation transcript into a structured medical report with these sections, I want the sections to be concise and clear, and the summary to be very high level:
    - Patient History: Briefly describe the patient's relevant medical history.
    - Findings: Summarize the key findings from the consultation.
    - Diagnosis: State any diagnoses or potential diagnoses.
    - Recommendations: List the doctor's recommendations and follow-up instructions.
    - Medications: List any medications mentioned, including dosages.

    Use accurate medical terminology. The summary should be concise and high level.

    {transcript}
    """
)
    replaced = response.text.replace("\n", "")
    replaced = remove_chars(replaced)



    api_key = 'sk_a5bf6e019e2aa8c2607761f185c7fcc9c729acd1'

    params = {
        'source':  replaced,
    }

    response = requests.post(
    'https://api.pdfshift.io/v3/convert/pdf',
    auth=('api', 'sk_a5bf6e019e2aa8c2607761f185c7fcc9c729acd1'),
    json={
        "source": params,
        "landscape": False,
        "use_print": False
    })
    response.raise_for_status()

    with open('result.pdf', 'wb') as f:
        f.write(response.content)
    print('The PDF document was generated and saved to result.pdf')
    return response.content

    

print(summarize_with_gemini(read_transcript("backend\dylanEvanTest.txt")))

