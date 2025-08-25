from ollama import chat
from ollama import ChatResponse

def clean_llm_output(output_str):
    """
    Cleans the string output from an LLM by removing a leading ```json\n
    and a trailing ```, then returns the cleaned string.
    """
    cleaned_str = output_str.strip()
    
    # Check for the start and end markers
    if cleaned_str.startswith('```json'):
        cleaned_str = cleaned_str.removeprefix('```json')
    if cleaned_str.endswith('```'):
        cleaned_str = cleaned_str.removesuffix('```')
    
    # Remove any extra newline characters that might be left
    cleaned_str = cleaned_str.strip()

    return cleaned_str
def transform_bdd_file():
    """
    Transforms the feature.bdd file into a json for better readability.
    """
    bdd_file = "feature.bdd"
    try:
        with open('feature.bdd', 'r', encoding='utf-8') as file:
            request = file.read()
        with open('parser_instructions.txt', 'r', encoding='utf-8') as file1:
            instructions = file1.read()
        response: ChatResponse = chat(model='gemma2:2b', messages=[
            {
                'role': 'user',
                'content': f'Transform the following BDD file into a JSON format for better readability:\n{request}',
            },
            {
                'role': 'system',
                'content': instructions
            }
        ])
        transformed_content = response['message']['content']
        with open('transformed_feature.json', 'w', encoding='utf-8') as output_file:
            output_file.write(clean_llm_output(transformed_content))
    except FileNotFoundError:
        print(f"Error: The BDD file '{bdd_file}' was not found.")
if __name__ == "__main__":
    transform_bdd_file()