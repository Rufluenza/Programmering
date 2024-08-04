import pygame
from pygame.locals import *

# Initialize pygame
pygame.init()
FPS = 60
# Set up the display
SWIDTH = 1000
SHEIGHT = 600
screen = pygame.display.set_mode((SWIDTH, SHEIGHT))
pygame.display.set_caption("PyInvaders")
clock = pygame.time.Clock()

SCALE = 3


sprites = pygame.image.load("SpriteSheet.png")
# Load the sprites
sprites = pygame.transform.scale(sprites, (sprites.get_width() * SCALE, sprites.get_height() * SCALE))
def get_sprite(x, y, w, h):
    return sprites.subsurface(x * SCALE, y * SCALE, w * SCALE, h * SCALE)


enemies = []
enemy_sprites = [[get_sprite(39, 1, 12, 8), get_sprite(39, 11, 12, 8)],
                 [get_sprite(22, 1, 11, 8), get_sprite(22, 11, 11, 8)],
                 [get_sprite(5, 1, 8, 8), get_sprite(5, 11, 8, 8)]]

enemy_direction = 1
wave_num = 1

class Enemy():
    def __init__(self, x, y, num):
        self.img_timer = 0
        self.img_num = 0
        self.images = enemy_sprites[num]
        self.num = num
        self.x = x
        self.y = y
        if num == 2:
            self.x += SCALE
        
        self.width = 12*SCALE
        self.height = 8*SCALE
        
    
    def draw(self):
        # draw self.image
        self.img_timer += 1
        if self.img_timer % 30 == 0:
            self.img_num += 1
            self.img_num %= 2
            
        screen.blit(self.images[self.img_num], (self.x, self.y))
    
    def move(self):
        self.x += enemy_direction
        
    
    def update(self):
        self.move()
        self.draw()
        

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        self.image = get_sprite(1, 49, 16, 8)
        self.x = x
        self.y = y
        self.lives = 3
        self.can_shoot = True

    def move(self):
        keys = pygame.key.get_pressed()
        if keys[K_LEFT] and self.x > 0:
            self.x -= 5
        if keys[K_RIGHT] and self.x + self.image.get_width() < SWIDTH:
            self.x += 5
    
    def show(self):
        screen.blit(self.image, (self.x, self.y))
        
    def update(self):
        self.move()
        self.show()

player = Player(SWIDTH // 2, SHEIGHT - 50)

def wave_update(wave_num=wave_num):
    if len(enemies) == 0:
        for i in range(7+wave_num):
            for j in range(3):
                enemies.append(Enemy(50 + i*50, 50 + j*50, j))
                
        return True
    return False

wave_update()

def check_enemy_collision():
    for enemy in enemies:
        if enemy.x < 0 or enemy.x + enemy.width > SWIDTH:
            return True
    return False

# Game loop
running = True
while running:
    clock.tick(FPS)
    # Clear the screen
    screen.fill((0, 0, 0))
    # Handle events
    for event in pygame.event.get():
        if event.type == QUIT:
            running = False

    # Update game logic
    _update_y = check_enemy_collision()
    if _update_y:
        enemy_direction = -enemy_direction # (*= -1) flip dir
        for enemy in enemies:
            enemy.y += 50
        
    # Render
    for enemy in enemies:  
        enemy.update()
    if wave_update():
        wave_num += 1
    player.update()
    """  
    for i in range(len(enemy_sprites)):
        for j in range(len(enemy_sprites[i])):
            screen.blit(enemy_sprites[i][j], (i * 50, j * 50))
    """
    
    # Update the display
    pygame.display.flip()

# Clean up pygame
pygame.quit()