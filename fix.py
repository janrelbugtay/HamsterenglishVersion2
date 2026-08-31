import re

with open('src/views/BubblePop.tsx', 'r') as f:
    content = f.read()

# The string that was appended was code.substring(59)
# Let's find exactly where 'ewState } from "../types";' occurs after the setupUI
# It should be around the syntax error: '</div>ewState } from "../types";'
# Let's search for this exact boundary.
boundary = '</div>ewState } from "../types";'
idx = content.find(boundary)

if idx != -1:
    print(f"Found boundary at {idx}")
    # The new UI ended with '</div>'
    # So the duplicate part starts at 'ewState } from "../types";' which is idx + 6
    duplicate_part = content[idx + 6:]
    
    # The first 59 characters are at the very beginning of the file.
    first_59 = content[:59]
    
    # The restored original code should be:
    restored = first_59 + duplicate_part
    
    with open('src/views/BubblePop_restored.tsx', 'w') as f:
        f.write(restored)
    print("Restored file written to src/views/BubblePop_restored.tsx")
else:
    print("Boundary not found.")

