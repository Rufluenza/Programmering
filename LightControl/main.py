from phue import Bridge

bridge = Bridge("192.168.1.246")

#bridge.connect()

# Get a dictionary of all lights
lights = bridge.get_light_objects('name')

light = lights['My lamp']

# get argument from command line (turn on or off)
import sys
# if no argument is given, default to "on"
arglist = sys.argv
if len(arglist) == 1:
    arg = "toggle"
else:
    arg = sys.argv[1]


if arg == "on":
    light.on = True
elif arg == "off":
    light.on = False
elif arg == "toggle":
    light.on = not light.on
elif arg == "set":
    light.brightness = max(min(int(sys.argv[2]), 254), 0)