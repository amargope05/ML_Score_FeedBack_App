# import pandas as pd
# import sys
# import json
# import os
# import random
# from datetime import datetime

# AI_MODE = os.getenv("AI_MODE", "fake") 

# def score_csv(file_path):
#     df = pd.read_csv(file_path)
#     numeric_cols = df.select_dtypes(include='number').shape[1]
#     score = min(100, numeric_cols * 10 + random.randint(0, 10))
#     return score, numeric_cols

# def generate_feedback(score, numeric_cols):
#     prompt = f"Score: {score}, Numeric columns: {numeric_cols}. Generate short AI feedback <=150 words."
    
#     with open("ai_usage_log.md", "a") as f:
#         f.write(f"{datetime.now()}: {prompt}\n")
    
#     if AI_MODE == "fake":
#         feedback = f"Your dataset has {numeric_cols} numeric columns. Score: {score}. Well done!"
#     else:
#         templates = [
#             f"Excellent! Your dataset has {numeric_cols} numeric columns, earning a score of {score}. Keep it up!",
#             f"Score: {score}. The dataset includes {numeric_cols} numeric columns. Great job! Consider reviewing column headers for clarity.",
#             f"Well done! You scored {score} points with {numeric_cols} numeric columns in your dataset.",
#             f"Your dataset contains {numeric_cols} numeric columns. Score achieved: {score}. Fantastic work!",
#             f"Score: {score}. There are {numeric_cols} numeric columns. Nice structure and formatting!"
#         ]
#         feedback = random.choice(templates)
    
#     return feedback

# if __name__ == "__main__":
#     file_path = sys.argv[1]
#     score, numeric_cols = score_csv(file_path)
#     feedback = generate_feedback(score, numeric_cols)
#     print(json.dumps({"score": score, "feedback": feedback}))

#---------------------------------------------------------------------------------------------------------

import pandas as pd
import sys
import json
import os
import random
from datetime import datetime
from transformers import pipeline
# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline


AI_MODE = os.getenv("AI_MODE", "live") 

generator = pipeline("text-generation", model="microsoft/DialoGPT-small")

def score_csv(file_path):
    df = pd.read_csv(file_path)
    print(df)
    numeric_cols = df.select_dtypes(include='number').shape[1]
    score = min(100, numeric_cols * 10 + random.randint(0, 10))
    return score, numeric_cols

def generate_feedback(score, numeric_cols):
    prompt = (
        f"Dataset evaluation:\n"
        f"Score: {score}\n"
        f"Numeric columns: {numeric_cols}\n"
        f"Generate a short feedback (<=150 words) mentioning correctness, coverage, and formatting."
    )

    with open("ai_usage_log.md", "a") as f:
        f.write(f"{datetime.now()}: {prompt}\n")

    if AI_MODE == "fake":
        feedback = f"Your dataset has {numeric_cols} numeric columns. Score: {score}. Well done!"
    else:
        result = generator(prompt, max_length=80, num_return_sequences=1)
        feedback = result[0]["generated_text"].strip()
        
        feedback = " ".join(feedback.split()[:150])

    return feedback

if __name__ == "__main__":
    file_path = sys.argv[1]
    score, numeric_cols = score_csv(file_path)
    feedback = generate_feedback(score, numeric_cols)
    print(json.dumps({"score": score, "feedback": feedback}))


