import pygame
import math

# Initialize Pygame
pygame.init()

# Screen dimensions
width, height = 800, 600
screen = pygame.display.set_mode((width, height))

# Define colors
white = (255, 255, 255)
black = (0, 0, 0)

# Gravitational constant (arbitrary scale for simulation)
G = 6.674 * 10**-11

# Object properties
m1 = 5.0 * 10**10  # Mass of object 1
m2 = 1.0 * 10**10  # Mass of object 2
r = 100  # Initial distance between the objects

# Initial positions (centered on the screen)
pos1 = pygame.Vector2(width / 2, height / 2)
pos2 = pygame.Vector2(width / 2 + r, height / 2)

# Initial velocities
vel1 = pygame.Vector2(0, 0)
vel2 = pygame.Vector2(0, 0)

# Simulation parameters
dt = 0.5  # Time step

# Main loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Calculate distance vector
    r_vec = pos2 - pos1
    distance = r_vec.length()

    # Calculate gravitational force magnitude
    F = G * m1 * m2 / distance**2

    # Calculate force vector (directional)
    force_vec = F * r_vec.normalize()

    # Calculate accelerations
    a1 = force_vec / m1
    a2 = -force_vec / m2

    # Update velocities
    vel1 += a1 * dt
    vel2 += a2 * dt

    # Update positions
    pos1 += vel1 * dt
    pos2 += vel2 * dt

    # Draw everything
    screen.fill(black)
    pygame.draw.circle(screen, white, (int(pos1.x), int(pos1.y)), 10)
    pygame.draw.circle(screen, white, (int(pos2.x), int(pos2.y)), 5)
    pygame.display.flip()

    # Cap the frame rate
    pygame.time.delay(10)

pygame.quit()
