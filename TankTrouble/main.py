import pygame as pg
from pygame.locals import *
import math
import random
import numpy as np
# Initialize pygame
pg.init()
FPS = 60
# Set up the display
SWIDTH = 1000
SHEIGHT = 600
DEBUGMODE = True
screen = pg.display.set_mode((SWIDTH, SHEIGHT))
pg.display.set_caption("TankTrouble")
clock = pg.time.Clock()


# General functions
def create_matrix(width, height, value=0):
    return [[value for i in range(width)] for j in range(height)]

# Create the walls
def create_walls():
    _list = [[0 for i in range(SHEIGHT//50)] for j in range(SWIDTH//50)]
    for i in range(len(_list)):
        for n in range(len(_list[i])):
            _list[i][n] = 0 if random.randint(0, 100) < 75 else 1
        
        #_list[i][0] = 1
        #_list[i][len(_list[i])-1] = 1
    return _list

wallhor = create_walls()
wallver = create_walls()

def draw_walls():
    for i in range(len(wallhor)):
        for j in range(len(wallhor[i])):
            if wallhor[i][j] == 1:
                pg.draw.line(screen, (255, 255, 255), (i*50, j*50), (i*50+50, j*50), 2)
            if wallver[i][j] == 1:
                pg.draw.line(screen, (255, 255, 255), (i*50, j*50), (i*50, j*50+50), 2)
                
def rotation_formula(x, y, angle):
    return [x*math.cos(angle) - y*math.sin(angle), x*math.sin(angle) + y*math.cos(angle)]

def get_rotated_points(x, y, width, height, angle):
    a = [-width/2, -height/2]
    b = [width/2, -height/2]
    c = [width/2, height/2]
    d = [-width/2, height/2]
    # rotate using matrix multiplication
    rotated_formular = [rotation_formula(a[0], a[1], angle), rotation_formula(b[0], b[1], angle), rotation_formula(c[0], c[1], angle), rotation_formula(d[0], d[1], angle)]
    for i in range(4):
        rotated_formular[i][0] += x
        rotated_formular[i][1] += y
    return rotated_formular

def draw_rotated_rect(x, y, width, height, color, angle): 
    rotated_formular = get_rotated_points(x, y, width, height, angle)
    
    for n in range(4):
        pg.draw.line(screen, color, (rotated_formular[n][0], rotated_formular[n][1]), (rotated_formular[(n+1)%4][0], rotated_formular[(n+1)%4][1]), 3)
    
    return rotated_formular

class Bullet():
    def __init__(self, x, y, angle):
        self.x = x
        self.y = y
        self.angle = angle
        self.speed = 5
        self.radius = 5
        self.vec = [self.speed * math.sin(math.radians(self.angle)), -self.speed * math.cos(math.radians(self.angle))]
    
    def move(self):
        #self.vec = [self.speed * math.sin(math.radians(self.angle)), -self.speed * math.cos(math.radians(self.angle))]
        self.x += self.vec[0]
        self.y += self.vec[1]
        #self.x += self.speed * math.sin(math.radians(self.angle))
        #self.y -= self.speed * math.cos(math.radians(self.angle))
    
    def check_screen_wall_collision(self):
        if self.x < 0 or self.x > SWIDTH:
            return [True, False]
        if self.y < 0 or self.y > SHEIGHT:
            return [False, True]
        return [False, False]
    
    def draw(self):
        pg.draw.circle(screen, (255, 255, 255), (self.x, self.y), self.radius)
    
    def update(self):
        if self.check_screen_wall_collision()[0]:
            self.vec = [-self.vec[0], self.vec[1]]
        if self.check_screen_wall_collision()[1]:
            self.vec = [self.vec[0], -self.vec[1]]
        self.move()
        self.draw()

class Player():
    def __init__(self, x, y, color, num, score=0):
        self.x = x
        self.y = y
        self.score = score
        self.color = color
        self.num = num
        self.width = 20
        self.height = 25
        self.angle = 0
        self.rotation_speed = 2
        self.speed = 1.5
        self.cx = x+self.width/2
        self.cy = y+self.height/2
        self.can_shoot = True
        self.bullets = []
        self.shoot_cooldown = 0
        self.shoot_cooldown_max = 0.25*FPS
        self.max_bullets = 5
        
    def draw(self):
        draw_rotated_rect(self.cx, self.cy, self.width, self.height, self.color, math.radians(self.angle))

    def check_collision(self, nx, ny):
        # nx and ny are the new x and y values
        # nangle is the new angle
        # get walls close to the player
        _nx_map = int(nx//50)
        _ny_map = int(ny//50)
        
        # get existance of walls around the player
        
                
        _walls_hor = create_matrix(3, 3)
        _walls_ver = create_matrix(3, 3)
        
        # get the wall index to real wall matrix
        wall_hor_index = create_matrix(3, 3)
        wall_ver_index = create_matrix(3, 3)
        
        for i in range(-1, 2):
            for j in range(-1, 2):
                if 0 <= _nx_map+i < len(wallhor) and 0 <= _ny_map+j < len(wallhor[0]):
                    _walls_hor[i+1][j+1] = (wallhor[_nx_map+i][_ny_map+j])
                    _walls_ver[i+1][j+1] = (wallver[_nx_map+i][_ny_map+j])
                    wall_hor_index[i+1][j+1] = _nx_map+i
                    wall_ver_index[i+1][j+1] = _ny_map+j
                else:
                    _walls_hor[i+1][j+1] = 0
                    _walls_ver[i+1][j+1] = 0
                    wall_hor_index[i+1][j+1] = 0
                    wall_ver_index[i+1][j+1] = 0
                    
        if DEBUGMODE:
            #print(_walls_hor)
            print(wall_hor_index)
            # draw walls in the matrix, color red
            
            for i in range(3):
                for j in range(3):
                    if _walls_hor[i][j] == 1:
                        pg.draw.line(screen, (255, 0, 0), (wall_hor_index[i][j]*50, wall_ver_index[i][j]*50), (wall_hor_index[i][j]*50+50, wall_ver_index[i][j]*50), 2)
                    if _walls_ver[i][j] == 1:
                        pg.draw.line(screen, (255, 0, 0), (wall_hor_index[i][j]*50, wall_ver_index[i][j]*50), (wall_hor_index[i][j]*50, wall_ver_index[i][j]*50+50), 2)

            # draw shortest line between the player and the wall
            shor = SWIDTH
            sver = SHEIGHT
            for i in range(3):
                for j in range(3):
                    if _walls_hor[i][j] == 1:
                        
                        if abs(nx - wall_hor_index[i][j]*50) < shor:
                            shor = abs(nx - wall_hor_index[i][j]*50)
                            
                            pg.draw.line(screen, (0, 255, 0), (nx, ny), (nx, wall_ver_index[i][j]*50), 2)
                    if _walls_ver[i][j] == 1:
                        if abs(ny - wall_ver_index[i][j]*50) < sver:
                            sver = abs(ny - wall_ver_index[i][j]*50)
                            pg.draw.line(screen, (0, 255, 0), (nx, ny), (wall_hor_index[i][j]*50, ny), 2)
            
            
        
        
    
    def move(self):
        keys = pg.key.get_pressed()
        key_dict = [[keys[K_a], keys[K_d], keys[K_w], keys[K_s]], [keys[K_LEFT], keys[K_RIGHT], keys[K_UP], keys[K_DOWN]]]
        _delta_angle = self.angle
        
        if key_dict[self.num][0]: # rotate left
            self.angle -= self.rotation_speed
        if key_dict[self.num][1]: # rotate right
            self.angle += self.rotation_speed
        if key_dict[self.num][2]: # move forward
            self.cx += self.speed * math.sin(math.radians(self.angle))
            self.cy -= self.speed * math.cos(math.radians(self.angle))
        if key_dict[self.num][3]: # move backward
            self.cx -= self.speed * math.sin(math.radians(self.angle))
            self.cy += self.speed * math.cos(math.radians(self.angle))
        _delta_angle -= self.angle
        rotated_formular = get_rotated_points(self.cx, self.cy, self.width, self.height, self.angle)
        for i in range(len(rotated_formular)):
            self.check_collision(rotated_formular[i][0], rotated_formular[i][1])
        #self.check_collision(self.cx, self.cy, self.angle)
    
    def shoot(self):
        if self.can_shoot:
            keys = pg.key.get_pressed()
            key_shoot_dict = [keys[K_r], keys[K_SPACE]]
            if key_shoot_dict[self.num] and len(self.bullets) < self.max_bullets:
                self.bullets.append(Bullet(self.cx, self.cy, self.angle))
                self.can_shoot = False
                self.shoot_cooldown = self.shoot_cooldown_max
        else:
            self.shoot_cooldown -= 1
            if self.shoot_cooldown <= 0:
                self.can_shoot = True
                
    def update(self):
        self.move()
        self.draw()
        self.shoot()

class Wall():
    def __init__(self, x, y, dir):
        self.x = x
        self.y = y
        self.dir = dir
        self.end_x = x+50 if dir == 0 else x
        self.end_y = y+50 if dir == 1 else y
    
    def draw(self):
        pg.draw.line(screen, (255, 255, 255), (self.x, self.y), (self.end_x, self.end_y), 3)





def create_players():
    if DEBUGMODE:
        return [Player(SWIDTH/2, SHEIGHT/2, (0, 255, 0), 0, 0)]
    return [Player(SWIDTH/2, SHEIGHT/2, (0, 255, 0), 0, 0), Player(SWIDTH/2, SHEIGHT/2, (255, 0, 0), 1, 0)]
players = create_players()
 
# Game loop
running = True
while running:
    clock.tick(FPS)
    # Clear the screen
    screen.fill((0, 0, 0))
    # Handle events
    for event in pg.event.get():
        if event.type == QUIT:
            running = False
        if event.type == KEYDOWN:
            if event.key == K_ESCAPE:
                running = False
            if event.key == K_q:
                # reset the game
                players = create_players()
                wallhor = create_walls()
                wallver = create_walls()
                
    # Draw the walls
    draw_walls()
    
    for player in players:
        player.update()
        for bullet in player.bullets:
            bullet.update()

    
    
    

            
    # Update the display
    pg.display.flip()

# Clean up pygame
pg.quit()