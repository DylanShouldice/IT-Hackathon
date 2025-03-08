import subprocess
import os

def transcribe_audio_cli(audio_file_path, model_size="base"):
    """
    Transcribes an audio file using the Whisper command-line interface.

    Args:
        audio_file_path (str): The path to the audio file.
        model_size (str): The size of the Whisper model to use (e.g., "tiny", "base", "small", "medium", "large"). Defaults to "base".

    Returns:
        str: The transcribed text, or an error message.
    """
    try:
        # Construct the command
        command = ["whisper", audio_file_path, "--model", model_size]

        # Run the command and capture the output
        process = subprocess.run(command, capture_output=True, text=True, check=True)

        # Extract the transcribed text from the output
        # Whisper CLI writes the transcription to a file, we read that.
        txt_file = os.path.splitext(audio_file_path)[0] + ".txt"

        with open(txt_file, 'r', encoding='utf-8') as f:
            transcription = f.read()

        # Clean up the .txt file after reading
        os.remove(txt_file)
        return transcription

    except subprocess.CalledProcessError as e:
        return f"Command execution failed: {e.stderr}"
    except FileNotFoundError:
        return "Whisper CLI not found. Make sure it's installed and in your PATH."
    except Exception as e:
        return f"An error occurred: {e}"

if name == "main":
    audio_file = "path/to/your/audio_file.mp3"  # Replace with your audio file path
    transcription = transcribe_audio_cli(audio_file)

    if transcription.startswith("Command execution failed:") or transcription.startswith("Whisper CLI not found.") or transcription.startswith("An error occurred:"):
        print(transcription)
    else:
        print("Transcription:")
        print(transcription)
