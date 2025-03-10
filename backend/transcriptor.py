import os
import whisper

def transcribe_audio_cli():
    """
    Transcribes an audio file using the Whisper command-line interface.

    Args:
        audio_file_path (str): The path to the audio file.
        model_size (str): The size of the Whisper model to use (e.g., "tiny", "base", "small", "medium", "large"). Defaults to "base".

    Returns:
        str: The transcribed text, or an error message.
    """

    model = whisper.load_model("small")
    result = model.transcribe("dylanEvanTest.mp3")
    return result

