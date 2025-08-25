# genAI-UI-Automation
Gen AI based UI Automation solution


## Instructions to Run
```bash
python3 agent.py
```

## Project Structure

### Core Files
- **src/agent.py** - The main file to be run 
- **src/feature.bdd** - Contains the feature file
- **src/instructions.txt** - Contains instructions for the agent

### Report Generation (Optional)
- **parser.py** - Uses a Gemma LLM (locally) for UI purposes(only for html report)
- **parser_instructions.txt** - Instructions for Gemma LLM(only for html report)
- **transformed_feature.json** - Feature is formatted into JSON for UI formatting(only for html report)


## Dependencies
- Python 3.x
- Required packages listed in `requirements.txt`

## Getting Started
1. Install dependencies:   (still working on it- for now try to install whatever is required pls, thanks)
```bash
pip install -r requirements.txt
```
2. Add Gemini API key in .env (You can create it on https://aistudio.google.com/app/u/2/apikey)
3. Run the agent:
```bash
python3 agent.py
```
