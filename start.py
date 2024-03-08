from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--kiosk")  # Optional: if you specifically need kiosk mode
chrome_options.add_experimental_option("detach", True)
chrome_options.add_experimental_option('excludeSwitches', ['enable-automation'])
chrome_options.add_argument('--disable-infobars')
chrome_options.add_argument('--disable-save-password-bubble')
chrome_options.add_argument("--incognito")
chrome_options.add_argument('--force-device-scale-factor=1.25')

s = Service("/usr/lib/chromium-browser/chromedriver")

driver = webdriver.Chrome(chrome_options, service=s)

# Open your website
driver.get("https://www.peridash.com/login/")

# Find the username and password fields and fill them out
username = driver.find_element(By.NAME, "email")
password = driver.find_element(By.NAME, "password")

username.send_keys("username")
password.send_keys("password")


# Add any additional navigation or checks here
submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
# or, if the submit button is an input element
submit_button.click()
