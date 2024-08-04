from PIL import Image

# Load the image
img = Image.open("/Users/ruben/Documents/GitHub/Programmering/spaceInvader/SpaceInvadersSpritesNoBG.png")

# Convert the image to RGBA if it is not already
img = img.convert("RGBA")

# Get data for all pixels in the image
datas = img.getdata()

# Create a new list for pixel data
new_data = []
# Define the color to make transparent (white)
white_threshold = (254, 254, 254, 255) # RGB values close to white

for item in datas:
    # Change all white (and almost white) pixels to transparent
    if item[0] >= white_threshold[0] and item[1] >= white_threshold[1] and item[2] >= white_threshold[2]:
        new_data.append((255, 255, 255, 0)) # Change white to fully transparent
    else:
        new_data.append(item) # Keep original pixel

# Update the image data
img.putdata(new_data)

# Save the modified image
img.save("/Users/ruben/Documents/GitHub/Programmering/spaceInvader/SpaceInvadersNEW.png")
