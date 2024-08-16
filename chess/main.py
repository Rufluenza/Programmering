import pygame as pg
import os
import json
# Initialize pygame
pg.init()

# Set up the game window
SCALE = 5.5
window_width = 800
window_height = 800
window = pg.display.set_mode((window_width, window_height))
pg.display.set_caption("Chess")
board = pg.image.load('sprite_pack/set_regular/board_empty_simple.png')
board = pg.transform.scale(board, (window_width, window_height))

sprite_pack_pieces_black = pg.image.load('sprite_pack/set_regular/pieces_black_1.png')
sprite_pack_pieces_black = pg.transform.scale(sprite_pack_pieces_black, (16*SCALE*6, 16*SCALE))
sprite_pack_pieces_white = pg.image.load('sprite_pack/set_regular/pieces_white_1.png')
sprite_pack_pieces_white = pg.transform.scale(sprite_pack_pieces_white, (16*SCALE*6, 16*SCALE))
sprite_pack_highlight = pg.image.load('sprite_pack/set_regular/pieces_highlighted.png')
sprite_pack_highlight = pg.transform.scale(sprite_pack_highlight, (16*SCALE*6, 16*SCALE))
circle = pg.image.load('sprite_pack/set_regular/circle.png')
circle = pg.transform.scale(circle, (16*SCALE, 16*SCALE))
def get_sprite(spritesheet, x, y, width, height):
    # Create a new blank image
    sprite = pg.Surface((width, height), pg.SRCALPHA, 32)
    sprite = sprite.convert_alpha()
    # Copy the sprite from the spritesheet onto the new image
    sprite.blit(spritesheet, (0, 0), (x, y, width, height))
    return sprite

spr_black = []
spr_white = []
spr_highlight = []
for i in range(6):
    spr_black.append(get_sprite(sprite_pack_pieces_black, i*16*SCALE, 0, 16*SCALE, 16*SCALE))
    spr_white.append(get_sprite(sprite_pack_pieces_white, i*16*SCALE, 0, 16*SCALE, 16*SCALE))
    spr_highlight.append(get_sprite(sprite_pack_highlight, i*16*SCALE, 0, 16*SCALE, 16*SCALE))


def map_pos(x):
    return (window_width/8)*x+5

def create_matrix(width, height, val=0):
    return [[val for _ in range(width)] for _ in range(height)]

def array_set(array, start, end, val):
    for i in range(start, end):
        array[i] = val
    return array

def get_piece(x, y):
    for player in players:
        for piece in player.pieces:
            if piece.x == x and piece.y == y:
                return piece
    return None

def color_num(color):
    return 0 if color == 'white' else 1

def get_point_details(x, y, color):
    pos = [x, y]
    reachable = [move for move in get_all_moves(color)[0][0] if move == pos]
    hits = []
    for piece in players[color_num(color)].pieces:
        if (x, y) in piece.get_moves(True)[1]:
            hits.append(piece)
    print(reachable, hits)
    
    
    # attackable points
    details = [[[], []], [[], []]] # 0: attackable, 1: protected, 2: enemy_attackable, 3: enemy_protected
    for player in players:
        for piece in player.pieces:
            moves = piece.get_moves(True)

            for idx, pos in enumerate(moves[0]): # attack moves
                if piece.name != 'pawn' or (piece.name == 'pawn' and moves[0][idx][0] != piece.x):
                    details[piece.color == color][0].append(piece)
            
    return details
    
    """
    sel_list = [[], []] # 0: enemy, 1: own
    #lambda index, val: sel_list[index].append(val)
    _pos = [x, y]
    for player in players:
        for piece in player.pieces:
            
            moves = piece.get_moves(True)
            for index, (x, y) in enumerate(moves[0][piece.color == color]):
                if (x, y) == moves[1][index]:
                    if piece.name == 'pawn' and piece.x != moves[1][index][0]:
                        killable = False # if pawn cannot kill, set list to 
                        
                sel_list[piece.color == color].append(piece)

    
    return sel_list, get_piece(x, y) 
    """
    
    

def get_all_moves(color):
    
    points = []
    moves = []
    enemy_pos = []
    enemy_val = []
    for player in players:
        for piece in player.pieces:
            if piece.color == color:
                moves.append([piece.get_moves(), piece])
            else:
                enemy_pos.append((piece.x, piece.y))
                enemy_val.append(piece.value)
                print(piece.name, piece.value, piece.x, piece.y)
    
    for move_piece in moves:
        for move in move_piece[0]:
            for epos in enemy_pos:
                if move == epos:
                    points.append((move, enemy_val[enemy_pos.index(epos)], move_piece[1]))
                    break
    
    if len(points) > 0:
        points.sort(key=lambda x: x[1], reverse=True)
    
    return moves, points

def pawn_promotion(color, x, y):
    for i in range(4):
        xshow = lambda x: map_pos(x+1) if x < 0 else map_pos(x-1) 
        pg.draw.rect(window, (150, 150, 150), (map_pos(2+i)-5, map_pos(4)-5, 100, 100))
        window.blit(spr_black[i], (xshow(x), map_pos(4)))



class Piece:
    def __init__(self, color, x, y, type):
        self.color = color
        self.x = x
        self.y = y
        self.type = type #0: tower, 1: knight, 2: bishop, 3: queen, 4: king, 5: pawn
        self.name = ''
        if self.type == 0:
            self.name = 'tower'
            self.value = 5
        elif self.type == 1:
            self.name = 'knight'
            self.value = 3
        elif self.type == 2:
            self.name = 'bishop'
            self.value = 3
        elif self.type == 3:
            self.name = 'queen'
            self.value = 9
        elif self.type == 4:
            self.name = 'king'
            self.value = 100
        elif self.type == 5:
            self.name = 'pawn'
            self.value = 1

    def move(self, new_x, new_y):
        self.x = new_x
        self.y = new_y
    
    def pawn_promotion(self):        
        upgrade = [0, 1, 2, 3]
        xshow = lambda x: map_pos(x-1) if x > 0 else map_pos(x+1)
        yshow = lambda color, i: map_pos(4-i) if color == 'black' else map_pos(4+i)
        for i in range(len(upgrade)):
            window.blit(spr_black[upgrade[i]], (xshow(self.x), yshow(self.color, i)))
        # get mouse click or number input
        keys = pg.key.get_pressed()
        _upgrade_dict = {pg.K_1: 0, pg.K_2: 1, pg.K_3: 2, pg.K_4: 3}
        for key in _upgrade_dict:
            if keys[key]:
                self.type = upgrade[_upgrade_dict[key]]
                self.name = ['tower', 'knight', 'bishop', 'queen'][_upgrade_dict[key]]
                break
                
    
    def get_moves(self, get_protect=False):
        if get_protect:
            protect_moves = []
        moves = []
        hits = []
        
        dirs = [0, 0, 0, 0, 0, 0, 0, 0] # up, down, left, right, up-left, up-right, down-left, down-right
        mdirs = [(0, -1), (0, 1), (-1, 0), (1, 0), (-1, -1), (1, -1), (-1, 1), (1, 1)]
        
        a_pieces = [piece for player in players for piece in player.pieces]
        
        if self.name == "tower" or self.name == "queen":
            dirs = array_set(dirs, 0, 4, 1)
        if self.name == "bishop" or self.name == "queen":
            dirs = array_set(dirs, 4, 8, 1)
        
        if self.name == "tower" or self.name == "bishop" or self.name == "queen":
            """
            get all pieces
            move in all directions
            if own piece is in the way, stop
            if enemy piece is in the way, stop and add to moves
            """
            for i in range(len(dirs)): # all directions
                if dirs[i]:
                    for j in range(1, 8): # all moves in direction i
                        if self.x+mdirs[i][0]*j < 0 or self.x+mdirs[i][0]*j > 7 or self.y+mdirs[i][1]*j < 0 or self.y+mdirs[i][1]*j > 7:
                            dirs[i] = False
                            break
                        for piece in a_pieces: # loop all pieces
                            if piece.x == self.x+mdirs[i][0]*j and piece.y == self.y+mdirs[i][1]*j: # if piece is in the way
                                dirs[i] = False
                                if piece.color != self.color: # if enemy piece is in the way
                                    moves.append((self.x+mdirs[i][0]*j, self.y+mdirs[i][1]*j))
                                    hits.append((self.x+mdirs[i][0]*j, self.y+mdirs[i][1]*j))
                                if get_protect: # elif?
                                    protect_moves.append((self.x+mdirs[i][0]*j, self.y+mdirs[i][1]*j))
                                break
                            
                        if dirs[i]:
                            moves.append((self.x+mdirs[i][0]*j, self.y+mdirs[i][1]*j))
                        else:
                            break
            
        
        elif self.name == "knight":
            for i in range(-2, 3):
                for j in range(-2, 3):
                    if abs(i*j) == 2:
                        moves.append((self.x+i, self.y+j))
        
        elif self.name == "king":
            for i in range(-1, 2):
                for j in range(-1, 2):
                    moves.append((self.x+i, self.y+j))
                    
        elif self.name == "pawn":
            _can_move = True
            _double_move = True if self.color == 'black' and self.y == 1 or self.color == 'white' and self.y == 6 else False
            ver_dir = 1 if self.color == 'black' else -1
            
            for piece in a_pieces:
                if piece.y == self.y+ver_dir:
                    if piece.x == self.x:
                        _can_move = False
                    elif piece.x == self.x+1 or piece.x == self.x-1:
                        if piece.color != self.color:
                            moves.append((piece.x, piece.y))
                        elif get_protect:
                            protect_moves.append((piece.x, piece.y))
                if _can_move and piece.x == self.x and piece.y == self.y+2*ver_dir:
                    _double_move = False
            
            if _can_move:
                moves.append((self.x, self.y+ver_dir))
                if _double_move:
                    moves.append((self.x, self.y+2*ver_dir))    
            
        
        # get all pieces with the same color
        for piece in a_pieces:
            for move in moves:
                if piece.x == move[0] and piece.y == move[1]:
                    if get_protect:
                        if self.name != 'pawn':
                            protect_moves.append(move)
                        elif self.x != move[0]:
                            protect_moves.append(move)
                    if piece.color == self.color:
                        moves.remove(move)
        
        self.moves = moves
        if get_protect:
            return moves, protect_moves
        return moves
        
                
    
    def show(self):
        if self.color == 'black':
            window.blit(spr_black[self.type], (map_pos(self.x), map_pos(self.y)))
        else:
            window.blit(spr_white[self.type], (map_pos(self.x), map_pos(self.y)))
        if self.name == 'pawn':
            if self.color == 'black' and self.y == 7 or self.color == 'white' and self.y == 0:
                self.pawn_promotion()

class Player:
    def __init__(self, color):
        self.color = color
        self.pieces = []
        self.selected_piece = None
        self.selected_x = None
        self.selected_y = None
        #self.my_turn = True if color == "white" else False
        self.prev_moves = []
        self.num = 0 if color == 'white' else 1
    
    def start_game(self):
        _y = 0
        _yp = 1
        if self.color == 'white':
            _y = 7
            _yp = 6
        _type_list = [0, 1, 2, 3, 4, 2, 1, 0]
        
        for i in range(8):
            self.pieces.append(Piece(self.color, i, _yp, 5)) # Pawns
            self.pieces.append(Piece(self.color, i, _y, _type_list[i])) # Other pieces
    
    def show(self):
        for piece in self.pieces:
            piece.show()
    
    def add_piece(self, piece):
        self.pieces.append(piece)
    
    def remove_piece(self, piece):
        self.pieces.remove(piece)
    
    def reset_selected(self):
        self.selected_piece = None
        self.selected_x = None
        self.selected_y = None
    
    def update(self, turn): # players turn
        mouse = pg.mouse.get_pos()
        
        mouse = (mouse[0]//100, mouse[1]//100)
        #print(mouse)
        click = pg.mouse.get_pressed()
        if click[0] == 1:
            if self.selected_piece == None:
                for piece in self.pieces:
                    if piece.x == mouse[0] and piece.y == mouse[1]:
                        self.selected_piece = piece
                        self.selected_x = piece.x
                        self.selected_y = piece.y
                        #print('clicked on piece')
                        return False
            else:
                #if self.selected_piece.x != mouse[0] and self.selected_piece.y != mouse[1]:
                #    self.selected_piece.move(mouse[0], mouse[1])
                
                if (mouse[0], mouse[1]) in self.selected_piece.get_moves():
                    for piece in players[(turn+1)%2].pieces:
                        if piece.x == mouse[0] and piece.y == mouse[1]:
                            players[(turn+1)%2].remove_piece(piece)
                            break
                    self.prev_moves.append((self.selected_x, self.selected_y, mouse[0], mouse[1]))
                    self.selected_piece.move(mouse[0], mouse[1])
                    
                    turn = (turn+1)%2
                    return True
                    
                #self.selected_piece.move(mouse[0], mouse[1])          
                self.reset_selected()
    
    def save_player(self):
        return {"color": self.color, "prev_moves": self.prev_moves, "pieces": [piece.__dict__ for piece in self.pieces]}
                

game_map = [[0 for _ in range(8)] for _ in range(8)]

turn = 0
players = [Player('white'), Player('black')]
for i in range(2):
    players[i].start_game()


    

selected_tool = None


# Game loop
running = True
while running:
    # Handle events
    for event in pg.event.get():
        _update_turn = players[turn].update(turn)
        #print(_update_turn)
        if _update_turn:
            players[turn].reset_selected()
            turn = (turn+1)%2
            
        mouse = pg.mouse.get_pos()
        # if escape key pressed exit
        if event.type == pg.KEYDOWN:
            if event.key == pg.K_SPACE:
                print(get_all_moves(players[turn].color)[1])
            elif event.key == pg.K_t:
                print(get_point_details(mouse[0]//100, mouse[1]//100, players[turn].color))
            elif event.key == pg.K_s:
                # if file in save.json does not exist, create it
                savedata = {"players": [players[0].save_player(), players[1].save_player()], "turn": turn}
                if os.path.exists('saves/save.json'):
                    os.rename('saves/save.json', 'saves/save.json.bak')

                with open('saves/save.json', 'w') as f:
                    json.dump(savedata, f)
                
            elif event.key == pg.K_l:
                if os.path.exists('saves/save.json'):
                    with open('saves/save.json', 'r') as f:
                        savedata = json.load(f)
                    for i in range(2):
                        players[i].prev_moves = savedata['players'][i]['prev_moves']
                        players[i].pieces = [Piece(piece['color'], piece['x'], piece['y'], piece['type']) for piece in savedata['players'][i]['pieces']]
                    turn = savedata['turn']
                
                    
            elif event.key == pg.K_ESCAPE:
                running = False
            
        if event.type == pg.QUIT:
            running = False

    # Update game state
    
    # Render the game
    window.fill((255, 255, 255))  # Fill the window with white color
    
    # Draw the chessboard
    for i in range(8):
        for j in range(8):
            if (i+j)%2 == 0:
                pg.draw.rect(window, (131, 139, 153), (i*100, j*100, 100, 100))
            else:
                pg.draw.rect(window, (160, 160, 160), (i*100, j*100, 100, 100)) # 242

    
    
    # Draw the chess pieces
    for player in players:
        player.show()
        if player == players[turn] and player.selected_piece != None:
        #if player.selected_piece != None:
            # show possible moves
            for move in player.selected_piece.get_moves():
                window.blit(circle, (map_pos(move[0]), map_pos(move[1])))
            
            window.blit(spr_highlight[player.selected_piece.type], (window_width/8*player.selected_piece.x+5, window_height/8*player.selected_piece.y+5))
    
    #pawn_promotion('black', 0, 7)
    # Update the display
    pg.display.flip()

# Quit the game
pg.quit()