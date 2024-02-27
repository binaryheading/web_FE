# app.py
from flask import Flask, render_template, request, jsonify
import speech_recognition as sr

app = Flask(__name__)

def recognize_speech():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = r.listen(source)
    try:
        transcript = r.recognize_google(audio, language="ko-KR")
        print("Google Speech Recognition thinks you said: " + transcript)
        return transcript
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
        return "Could not understand audio"
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        return "Error occurred during recognition"

@app.route("/")
def index():
    return render_template('index1.html')

@app.route("/recognize_speech")
def recognize_speech_route():
    transcript = recognize_speech()
    return jsonify({"transcript": transcript})

if __name__ == "__main__":
    app.run(debug=True)
