import os

file_path = r'd:\Workstation DP-2\DP Clients\WEB DEVELOPMENT\Checkout\src\app\community\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace literal backslash-quote with quote
content = content.replace(r'\"', '"')

# Fix the Expert key
content = content.replace('key={Expert-${i}}', 'key={`Expert-${i}`}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File cleaned successfully.")
