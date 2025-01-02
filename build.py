import sys
import os
from lc2 import build_for_web
from lc_json import build_for_glyphs

directory = sys.argv[1]

build_for_web(directory)
build_for_glyphs(directory)