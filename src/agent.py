import asyncio
from dotenv import load_dotenv
import os
from agents import (
    Runner,
    Agent,
    OpenAIChatCompletionsModel,
    set_default_openai_client,
    set_tracing_disabled,
)
from openai import AsyncOpenAI
from agents.mcp import MCPServerStdio
from parser import transform_bdd_file

# Load environment variables from the .env file
load_dotenv()

# Read the required secrets envs from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

async def create_mcp_ai_agent(mcp_server):
    # Initialize Gemini client using its OpenAI-compatible interface
    gemini_client = AsyncOpenAI(
        api_key=GEMINI_API_KEY,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )

    # Set the default OpenAI client to Gemini
    set_default_openai_client(gemini_client)
    # Disable tracing to avoid tracing errors being logged in the terminal
    set_tracing_disabled(True)
    agent_instructions= read_bdd_file()
    print(agent_instructions)
    # Create an agent configured to use the MCP server and Gemini model
    agent = Agent(
        name="Assistant",
        instructions=agent_instructions,
        model=OpenAIChatCompletionsModel(
            model="gemini-2.5-flash-lite",
            openai_client=gemini_client,
        ),
        mcp_servers=[mcp_server]
    )

    return agent
def read_bdd_file():
    instructions_file = "instructions.txt"
    try:
        with open(instructions_file, "r") as file:
            agent_instructions = file.read()
        # Remove all newline characters from the string
            agent_instructions = agent_instructions.replace('\n', ' ').replace('\r', '')
        # You might also want to replace multiple spaces with a single space
        # to clean it up further, e.g., using a regex or simple split/join
            agent_instructions = " ".join(agent_instructions.split())
    except FileNotFoundError:
        print(f"Error: The instructions file '{instructions_file}' was not found.")
        agent_instructions = "You are a helpful UI automation assistant. Your task is to assist users in automating web interactions using Playwright." # Provide a fallback
    return agent_instructions

async def run():
    # Start the Playwright MCP server via npx
    async with MCPServerStdio(
        name="Playwright MCP server",
        client_session_timeout_seconds=30,
        params={
            "command": "npx",
            "args": [
                "-y", "@playwright/mcp@0.0.25",
                "--output-dir",
                "/Users/pranavbaratam/Desktop/chat-app/screenshots",   #replace with your desired path
               
            ],
        },
    ) as server:
        # Create and initialize the AI agent with the running MCP server
        agent = await create_mcp_ai_agent(server)
        # Read the contents of a .bdd file and store as a string
        with open('feature.bdd', 'r', encoding='utf-8') as file:
            request = file.read()
        print("The request is : "+request)
        output = await Runner.run(agent, input=request)
        
        print("=== Run complete ===")
        # Print the result to the user
        print(f"Output -> \n{output.final_output}\n\n")
        

if __name__ == "__main__":
    try:
        #transform_bdd_file() # this uses ollama to transform the bdd file to json for ui purpose, refer to parser.py
        asyncio.run(run())
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please ensure that the Playwright MCP server is running and the feature.bdd file exists.")
        print("If the issue persists, check your environment variables and the instructions file.")
        print("Exiting the program.")
        exit(1)