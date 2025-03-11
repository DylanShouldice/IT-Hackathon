import os
import whisper
import google.generativeai as genai
from dotenv import load_dotenv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import datetime
import markdown
import torch
from bs4 import BeautifulSoup

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
client = genai.GenerativeModel("gemini-1.5-flash")

def transcribe_audio_cli(audio_file="dylanEvanTest.mp3", model_size="small"):
    """Transcribes an audio file using OpenAI Whisper."""
    if not os.path.exists(audio_file):
        print(f"Error: File '{audio_file}' not found!")
        return None

    print(f"Loading Whisper model ({model_size})...")
    if torch.cuda.is_available():
        print(f"CUDA is available. Using GPU: {torch.cuda.get_device_name(0)}")
        model = whisper.load_model(model_size, device="cuda")
    else:
        print("CUDA is not available. Using CPU.")
        model = whisper.load_model(model_size, device="cpu")


    
    

    print(f"Transcribing '{audio_file}'...")
    result = model.transcribe(audio_file)
    return result["text"]

def summarize_with_gemini(transcript):
    """Summarizes a transcript using Gemini AI."""
    prompt = f"""
    Summarize the following medical consultation transcript into a structured medical report. 
    Ensure the sections are concise, clear, and use accurate medical terminology. Include:
    
    - ## Patient History: Briefly describe the patient's relevant medical history.
    - ## Findings: Summarize the key findings from the consultation.
    - ## Diagnosis: State any diagnoses or potential diagnoses.
    - ## Recommendations: List the doctor's recommendations and follow-up instructions.
    - ## Medications: List any medications mentioned, including dosages.
    
    Transcript:
    {transcript}
    """

    response = client.generate_content(prompt)
    
    if hasattr(response, "text"):
        summary_text = response.text.strip()
        print("Generated Summary:")
        print(summary_text)
        return summary_text
    else:
        print("Error: Unexpected response format from Gemini.")
        return None

def save_as_pdf(text, output_filename):
    """Creates a properly formatted PDF with Markdown support."""
    pdf = SimpleDocTemplate(output_filename, pagesize=letter)
    styles = getSampleStyleSheet()
    html_text = markdown.markdown(text)

    soup = BeautifulSoup(html_text, "html.parser")

    content = []
    for element in soup.contents:
        if element.name:
            if element.name == "h1":
                content.append(Paragraph(element.text, styles["Heading1"]))
            elif element.name == "h2":
                content.append(Paragraph(element.text, styles["Heading2"]))
            elif element.name == "h3":
                content.append(Paragraph(element.text, styles["Heading3"]))
            else:
                content.append(Paragraph(element.text, styles["Normal"]))
            content.append(Spacer(1, 10))

    pdf.build(content)
    print(f"PDF saved as {output_filename}")

transcript_text = transcribe_audio_cli()

if transcript_text:
    summary = summarize_with_gemini(transcript_text)

    if summary:
        filename = f"summary_{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}.pdf"
        save_as_pdf(summary, filename)
