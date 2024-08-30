import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging
import time

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Get the command-line arguments
full_name = sys.argv[1]
address = sys.argv[2]
email = sys.argv[3]
issue = sys.argv[4]

# Check if an image path is provided
image_path = None
if len(sys.argv) > 5:
    image_path = sys.argv[5]

# Print received arguments for debugging
print(f"Received arguments: full_name={full_name}, address={address}, email={email}, issue={issue}, image_path={image_path}")

# Set up Chrome options to run with a visible window
options = webdriver.ChromeOptions()
# options.add_argument('--headless')  # Uncomment this line to run in headless mode
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# Use the Service class to specify the path to ChromeDriver
service = Service('C:\\Users\\Property Partner\\Desktop\\propert partner\\Dev work\\selenium_form_project\\chromedriver-win64\\chromedriver.exe')

try:
    logging.info("Starting ChromeDriver...")
    # Initialize the Chrome WebDriver with the service
    driver = webdriver.Chrome(service=service, options=options)
    logging.info("ChromeDriver started successfully.")

    # Open the webpage containing the iframe
    logging.info("Navigating to the webpage...")
    driver.get('http://localhost:5000/tapi.html')

    # Wait for the iframe to be present and then switch to it
    logging.info("Waiting 30 seconds for the iframe to load...")
    time.sleep(30)  # Adjust the wait time as needed

    logging.info("Attempting to locate the parent iframe...")
    iframe = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//iframe[@id='iFrameResizer0']"))
    )
    driver.switch_to.frame(iframe)
    logging.info("Switched to the parent iframe.")

    # Wait for the first nested iframe to be present
    logging.info("Attempting to locate the first nested iframe...")
    nested_iframe_1 = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//iframe[@class='__flowai_messenger_frame__ __flowai_messenger_frame__embedded__']"))
    )
    driver.switch_to.frame(nested_iframe_1)
    logging.info("Switched to the first nested iframe.")

    # If an image is provided, send "yes" before entering the full name
    if image_path:
        # Click the paperclip button to open the file dialog
        logging.info("Attempting to click the paperclip button using JavaScript...")
        driver.execute_script("""
            var paperclipButton = document.querySelector("button[title='Upload']");
            if (paperclipButton) {
                paperclipButton.click();
            }
        """)
        logging.info("Clicked the paperclip button for file upload using JavaScript.")
        time.sleep(5)  # Add a short pause to allow the file dialog to open

        # Locate the file input field and upload an image
        logging.info("Locating the file input field and uploading an image...")
        file_input = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
        )
        file_input.send_keys(image_path)
        logging.info("Image uploaded successfully.")
        time.sleep(10)  # Add a pause after uploading the image

        # Send "yes" before proceeding
        logging.info("Image detected, sending 'yes' before entering full name...")
        yes_input = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
        )
        yes_input.send_keys("yes")
        yes_input.send_keys("\n")
        time.sleep(10)  # Add a 10-second pause after sending "yes"

    # Interact with the input field for full name
    logging.info("Locating the input field for full name...")
    try:
        full_name_input = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
        )
        full_name_input.send_keys(full_name)
        logging.info(f"Entered full name: {full_name}")
        time.sleep(10)  # Add a 10-second pause after entering the full name
    except Exception as e:
        logging.error(f"Error locating input field: {e}")
        logging.error(f"Current page source: {driver.page_source}")
        raise  # Re-raise the exception to ensure it's handled by the outer try-except

    # Simulate pressing the Enter key after entering each value
    full_name_input.send_keys("\n")

    # Interact with the input field for address (first time)
    logging.info("Locating the input field for address (first entry)...")
    address_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    address_input.send_keys(address)
    logging.info(f"Entered address (first entry): {address}")
    time.sleep(10)  # Add a 10-second pause after entering the address
    address_input.send_keys("\n")

    # Interact with the input field for address (second time)
    logging.info("Locating the input field for address (second entry)...")
    address_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    address_input.send_keys(address)
    logging.info(f"Entered address (second entry): {address}")
    time.sleep(10)  # Add a 10-second pause after entering the address
    address_input.send_keys("\n")

    # Interact with the input field for email
    logging.info("Locating the input field for email...")
    email_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    email_input.send_keys(email)
    logging.info(f"Entered email: {email}")
    time.sleep(10)  # Add a 10-second pause after entering the email address
    email_input.send_keys("\n")

    # Enter the issue description (first time)
    logging.info("Entering the issue description (first entry)...")
    issue_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    issue_input.send_keys(issue)
    logging.info(f"Entered issue description (first entry): {issue}")
    time.sleep(10)  # Add a 10-second pause after entering the issue description
    issue_input.send_keys("\n")

    # Enter "send to property manager"
    logging.info("Entering 'send to property manager'...")
    property_manager_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    property_manager_input.send_keys("send to property manager")
    logging.info("Entered 'send to property manager'")
    time.sleep(10)  # Add a 10-second pause after entering the phrase
    property_manager_input.send_keys("\n")

    # Enter "urgent"
    logging.info("Entering 'urgent'...")
    urgent_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    urgent_input.send_keys("urgent")
    logging.info("Entered 'urgent'")
    time.sleep(10)  # Add a 10-second pause after entering the phrase
    urgent_input.send_keys("\n")

    # Re-enter the issue description (second time)
    logging.info("Re-entering the issue description (second entry)...")
    issue_input = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Send a message']"))
    )
    issue_input.send_keys(issue)
    logging.info(f"Re-entered issue description (second entry): {issue}")

    # Ensure the text is fully entered before sending the Enter key
    time.sleep(2)

    # Simulate pressing Enter key
    issue_input.send_keys("\n")

    # Add a longer pause after pressing Enter to ensure submission
    time.sleep(5)

    logging.info("Second issue description submitted.")

    logging.info("Form submission process completed successfully.")

except Exception as e:
    logging.error(f"An error occurred: {e}")

finally:
    if 'driver' in locals():
        logging.info("The browser will remain open for further actions.")
    else:
        logging.info("Driver was not initialized; skipping browser closure.")
