import pygame
import pyautogui
import os

# Initialize Pygame
pygame.init()

# Main loop
running = True
while running:
    # Get the mouse position relative to the screen
    mouse_x, mouse_y = pyautogui.position()
    
    # Set the window position to the mouse position
    os.environ['SDL_VIDEO_WINDOW_POS'] = f"{mouse_x},{mouse_y}"
    
    # Set up the Pygame window
    screen = pygame.display.set_mode((640, 480))
    pygame.display.set_caption("Mouse Position Example")

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Clear the screen
    screen.fill((0, 0, 0))

    # Render the mouse position on the screen
    font = pygame.font.Font(None, 36)
    text = font.render(f'Mouse Position: {mouse_x}, {mouse_y}', True, (255, 255, 255))
    screen.blit(text, (50, 50))

    # Update the display
    pygame.display.flip()

# Quit Pygame
pygame.quit()