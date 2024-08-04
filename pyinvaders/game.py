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
wave_num = 1
score = 0
sprites = pygame.image.load("SpriteSheet.png")
# Load the sprites
sprites = pygame.transform.scale(sprites, (sprites.get_width() * SCALE, sprites.get_height() * SCALE))

def get_sprite(x, y, w, h):
    return sprites.subsurface(x * SCALE, y * SCALE, w * SCALE, h * SCALE)


# ------- BULLET -----------
bullets = []
class Bullet():
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = 3
        self.height = 10

    def move(self):
        self.y -= 5

    def show(self):
        pygame.draw.line(screen, (0, 255, 0), (self.x, self.y), (self.x, self.y-self.height), self.width)

    def check_collision(self):
        for enemy in enemies:
            
            """
            hvis mit x er mere end enemy x
            OG mit x er mindre end enemy x + enemy width
            """
            if self.x > enemy.x and self.x < enemy.x + enemy.width:
                """
                hvis mit y er mere end enemy y
                OG mit y er mindre end enemy y + enemy height
                """
                if self.y > enemy.y and self.y < enemy.y + enemy.height:
                    enemies.remove(enemy)
                    
                    return [True, 10] # 1. skal kuglen fjernes, 2. skal scoren stige

        if self.y <= 0:
            return [True, 0]
        return [False, 0]

    def update(self):
        self.move()
        self.show()
        

    






# ------- ENEMIES ----------
enemy_sprites = [[get_sprite(39, 1, 12, 8), get_sprite(39, 11, 12, 8)], # num 0
                 [get_sprite(22, 1, 11, 8), get_sprite(22, 11, 11, 8)], # num 1
                 [get_sprite(5, 1, 8, 8), get_sprite(5, 11, 8, 8)]]     # num 2

direction = 3

class Enemy():
    def __init__(self, x, y, num):
        self.x = x
        self.y = y
        self.num = num
        self.images = enemy_sprites[self.num]
        self.width = 12 * SCALE
        self.height = 8 * SCALE

    def move(self):
        self.x += direction

    def show(self):
        screen.blit(self.images[0], (self.x, self.y))

    def update(self):
        self.move()
        self.show()



enemies = []

# Her laver vi fjenderne
for i in range(7): # vi vil lave 20
    enemies.append(Enemy(50*i, 50, 1))

def enemy_collision():
    for enemy in enemies: # loop igennem alle fjender
        if enemy.x > SWIDTH - enemy.width or enemy.x < 0:
            return True
    return False

# ------- PLAYER ----------
class Player():
    def __init__(self, x):
        self.x = x
        self.y = SHEIGHT-100
        self.image = get_sprite(1, 49, 16, 8)
        self.width = 16 * SCALE
        self.height = 8 * SCALE
        self.shoot_cooldown = 0


    def move(self):
        keys = pygame.key.get_pressed()
        if keys[K_LEFT] and self.x > 0:
            self.x -= 5
        if keys[K_RIGHT] and self.x + self.width < SWIDTH:
            self.x += 5

    def shoot(self):
        keys = pygame.key.get_pressed()
        if self.shoot_cooldown <= 0:
            if keys[K_SPACE] and len(bullets) <= 1:
                bullets.append(Bullet(self.x+(self.width/2), self.y))
                self.shoot_cooldown = 60/4
        else:
            self.shoot_cooldown -= 1

    def show(self):
        screen.blit(self.image, (self.x, self.y))

    def update(self):
        self.move()
        self.show()
        self.shoot()

player = Player(SWIDTH/2)

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

    if enemy_collision():
        direction = -direction
        for enemy in enemies:
            enemy.y += 40

    # updater alle enemies i arrayet
    for enemy in enemies:
        enemy.update()

    player.update()

    for bullet in bullets:
        bullet.update()
        _check_col = bullet.check_collision()
        if _check_col[0]:
            score += _check_col[1]
            bullets.remove(bullet)
            if len(enemies) == 0:
                wave_num += 1
                for i in range(7):
                    for j in range(wave_num):
                        enemies.append(Enemy(50*i, 50*j, j%3))
    print(score)
    # Update the display
    pygame.display.flip()

# Clean up pygame
pygame.quit()