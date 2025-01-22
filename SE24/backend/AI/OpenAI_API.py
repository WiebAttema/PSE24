# Autheurs: Jasper Wink, Hugo Groene, Sietse van de Griend
# UvA IDs: 14616513, 14662787, 12652776
#
# Description:
# This program receives user input in the form of a dictionary.
# This input is given to the ChatGPT API to generate an AI response.
# This response is parsed and returned.


from openai import OpenAI
import os

API_RETRY_COUNT = 2

# takes the absolute path so it doesnt matter where flask was called from.
instructions_path = os.path.join(os.path.dirname(__file__), "system_instructions.txt")
reply_path = os.path.join(os.path.dirname(__file__), "reply.txt")
user_input_path = os.path.join(os.path.dirname(__file__), 'user_input.txt')
input_format = "@"
#OPENAPI_KEY = "sk-proj-ZRl3kDP9AIYFR5Isk9WbT3BlbkFJveFLRRJlCCVR9a1CdLqA"


def read_file(file):
    """Read the given file and return the read tekst."""
    f = open(file)
    file_tekst = f.read()
    f.close()
    return file_tekst


def write_file(file, text):
    f = open(file, "w")
    f.write(text)
    f.close()


def print_function(parsed_sections):
    for key in parsed_sections.keys():
        print(key)
        print(parsed_sections[key])
        print()


def generate_chatGPT_request(user_data):
    """Transform the user data into a prompt. Return the prompt for the API."""

    user_tekst = read_file(user_input_path)
    raw_instruct = user_tekst.split("|")
    user_data_amount = 0

    for i in range(len(raw_instruct)):

        # Check if the first character is an @ to detect keywords.
        if raw_instruct[i][0] == input_format:
            try:
                # Replace the keyword by the user input.
                raw_instruct[i] = user_data[raw_instruct[i][1:]]
            except KeyError:
                raise KeyError("label user_input.txt doesn't correspond with"
                               + " user_data label")

            # Move to the next section of the format
            user_data_amount += 1

    if user_data_amount != len(user_data):
        raise ValueError("length user_data not correct respect to the amount"
                         + " needed for the instruction")
    return "".join(raw_instruct)


def generate_chatGPT_reply(user_message):
    """Send the user input to the ChatGPT API and return the response"""

    # api_key = os.getenv("API_KEY")
    client = OpenAI(api_key=OPENAPI_KEY)

    # Define the input for the API
    instructions = read_file(instructions_path)
    messages = [{"role": "system", "content": instructions},
                {"role": "user", "content": user_message}]

    # Send the input to ChatGPT
    # Models: gpt-3.5-turbo, gpt-4o
    chat = client.chat.completions.create(model="gpt-4o",
                                          messages=messages)
    return chat.choices[0].message.content


def parse_content(user_data, text):
    """Parse the text file such that the content is divided into on of the
    following catagories: Code, Question, Answer and Explanation.
    Choices are optional for multiple choice questions"""

    parsed_content = {"Code": "", "Question": "", "Choices": {}, "Answer": "",
                      "Correct_choice": None, "Explanation": ""}

    # Catagorise each line into one catogory
    for line in text.split("\n"):
        # Set the catagory
        if "Code:" in line:
            current_section = "Code"
        elif "Question:" in line:
            current_section = "Question"
        elif "Choices:" in line:
            current_section = "Choices"
        elif "Answer:" in line:
            current_section = "Answer"
        elif "Explanation:" in line:
            current_section = "Explanation"

        # Add lines to the correct catagory
        else:
            if current_section and line:
                if current_section == "Choices":
                    if user_data["question_type"] == "true/false":
                        parsed_content["Choices"]["True"] = 'True'
                        parsed_content["Choices"]["False"] = 'False'
                    else:
                        parsed_content["Choices"][line[0]] = line[3:]
                else:
                    parsed_content[current_section] += line + "\n"

    if user_data["question_type"].lower() == "multiple choice":
        parsed_content["Correct_choice"] = parsed_content["Answer"][0]
    elif user_data["question_type"].lower() == "true/false":
        parsed_content["Correct_choice"] = parsed_content["Answer"]

    return parsed_content


def check_reply_validity(user_data, parsed_sections):
    """This function checks if all required section have content in the.
    If they do not, a new API call is made and the reply is parsed again.
    This is done for API_RETRY_COUNT tries if the previous tries failed."""

    global API_RETRY_COUNT
    required_section_list = ["Code", "Question", "Answer", "Explanation"]
    empty_section_values = ["", {}, None]

    # If mutiple choice, add multiple choice sections to the required list
    if user_data["question_type"].lower() != "open":
        required_section_list.extend(["Choices", "Correct_choice"])

    for section in required_section_list:
        # Check if at least one section is empty
        if parsed_sections[section] in empty_section_values:
            if API_RETRY_COUNT == 0:
                raise ValueError("API parsing failed.")
            API_RETRY_COUNT -= 1
            main(user_data, print_to_terminal, write_to_file)


def main(user_data, print_to_terminal=False, write_to_file=False):
    """Call helper functions to transform the userdata into a parsed AI API
    reply. Return the parsed reply."""

    user_message = generate_chatGPT_request(user_data)
    reply = generate_chatGPT_reply(user_message)
    parsed_sections = parse_content(user_data, reply)
    check_reply_validity(user_data, parsed_sections)

    # Write reply to txt file
    if write_to_file is True:
        write_file(reply_path, reply)

    # Print the response
    if print_to_terminal is True:
        print_function(parsed_sections)

    return parsed_sections


if __name__ == "__main__":
    # Test user data
    user_data = {"question_type": "open",
                 "language": "python",
                 "difficulty": "beginner",
                 "information": "hashmap"}

    write_to_file = True
    print_to_terminal = True
    main(user_data, print_to_terminal, write_to_file)
