# app.py
from flask import Flask, render_template, request, jsonify
import speech_recognition as sr

from gtts import gTTS
import os
import playsound

from key_extraction import keywordExtractor
from transformers import ElectraModel, ElectraTokenizerFast
import numpy as np
import pandas as pd

import ast

app = Flask(__name__)

def convert_to_list(text):
    return ast.literal_eval(text)

def checking_food_name(food_name, data):
    matched_row = data[data['name'] == food_name]
    if not matched_row.empty: 
        return food_name
    else:
        matching_names = []
        for _, row in data.iterrows():
            if food_name in row['keywords']:
                matching_names.append(row['name'])
        return matching_names if matching_names else None


def extract_key(food_name):

    # load model and tokenizer
    name = "monologg/koelectra-base-v3-discriminator"
    model = ElectraModel.from_pretrained(name)
    tokenizer = ElectraTokenizerFast.from_pretrained(name)

    # load keywordExtractor
    key = keywordExtractor(model,tokenizer,dir='eng_han.csv') # 키워드 추출하는 애=key

    # load scraping_data
    scraping_result = pd.read_csv('binaryproject.csv') # 정제되지 않은 데이터

    new_data = []
    for i in range(len(scraping_result)) :
        docs_keywords = key.extract_keyword(scraping_result.iloc[[i]])
        new_data.append(docs_keywords)
    
    for item in new_data:
        item['name'] = item['name'][0]  # 'name' 필드에서 대괄호를 제거합니다.
        item['keywords'] = list(word for sublist in item['keywords'] for word in sublist) # 'keywords' 리스트를 평탄화합니다.
    


    data_search = pd.DataFrame(new_data)

    data_search.to_csv('data_for_search.csv', index = False) # 메뉴 명과 키워드가 함께 있는 데이터
    #print(data_search.head())

    df = pd.read_csv("data_for_search.csv")
    df2 = pd.DataFrame(columns=['name', 'keywords'])
    df2['name'] = df['name']
    df2['keywords'] = df['keywords'].apply(eval)
    
    result = checking_food_name(food_name, df2)
    
    return result
    


def find_in_menu(food_name,data):
    #if food_name in 

    matched_row = data[data['name'] == food_name] # 띄어쓰기 대비 주의
    if not matched_row.empty:
        return True
    else:
        return False

def speak(text):
    tts = gTTS(text=text, lang='ko')
    filename = 'voice.mp3'
    tts.save(filename) # 파일을 만들고,
    playsound.playsound(filename) # 해당 음성파일을 실행(즉, 음성을 말함)
    os.remove(filename) # <---- 이부분이 없으면 퍼미션 에러 발생(아마도 파일을 연 상태에서 추가적인 파일생성 부분에서 에러가 발생하는 것으로 보임)


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

flag1=0 # 첫 주문 시작할 때 0 메뉴가 정해지면 1
#flag2=0 # 바로 메뉴 선정 완료 및 수량 정해야 하는 상황이면 1
#flag3=0 # 

@app.route("/")
def index():
    return render_template('index1.html')

@app.route("/recognize_speech")
def recognize_speech_route():
    global flag1 #, flag2, flag3
    if flag1==0: # 처음 웹사이트를 시작할 때
        speak("안녕하세요. 원하시는 메뉴를 말씀해주세요.")
        transcript = recognize_speech()

        df = pd.read_csv("data_for_search_2.csv")

        if find_in_menu(transcript,df):
            flag1=1
            speak("원하시는 메뉴가 메뉴판에 존재합니다. 몇개 주문하시겠습니까?") # 수량은 살짝 애매할 듯
            return jsonify({"transcript": transcript})
        else:
            flag1=2
            recommend=extract_key(transcript)
            speak("원하시는 메뉴가 메뉴판에 존재하지 않습니다. 잠시후 추천메뉴를 말씀드리겠습니다.")
            announcement="추천 메뉴는 "
            for menu in recommend:
                announcement+=menu
            announcement+=" 입니다."
            speak(announcement)
            transcript=""
            return jsonify({"transcript": transcript})
    else:
        transcript = recognize_speech()
        return jsonify({"transcript": transcript})
    
    #수량 인식 문제와 번역 메뉴가 리셋된다는 문제 발생
    # elif flag1==2 and flag2==0 and flag3==0: # 두번째로 클릭하여 추천 메뉴 중 하나를 고를 때 flag==1 
    #     transcript = recognize_speech()
    #     speak(transcript+" 메뉴를 주문하셨습니다. 몇개 주문하시겠습니까?")
    #     flag2=1
    #     #return jsonify({"transcript": transcript})
    # elif flag1==1 and flag2==0 and flag3==0: # 메뉴판 메뉴 바로 말해서 수량만 말하면 되는 경우
    #     transcript = recognize_speech()
    ##수량 처리 필요!!-세번째 클릭인 추천 메뉴 수량 말하기

if __name__ == "__main__":
    app.run(debug=True)
