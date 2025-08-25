
## Instructions to Run
```bash
python3 agent.py
```

## Project Structure

### Core Files
- **agent.py** - The main file to be run 
- **feature.bdd** - Contains the feature file
- **instructions.txt** - Contains instructions for the agent

### Report Generation (Optional)
- **parser.py** - Uses a Gemma LLM (locally) for UI purposes(only for html report)
- **parser_instructions** - Instructions for Gemma LLM(only for html report)
- **transformed_feature.json** - Feature is formatted into JSON for UI formatting(only for html report)


## Dependencies
- Python 3.x
- Required packages listed in `requirements.txt`

## Getting Started
1. Install dependencies:
```bash
pip install -r requirements.txt
```
2. Run the agent:
```bash
python3 agent.py
```
