#!/usr/bin/env python
# cd to the file directory, and run this file
#  > $ /Users/jaku/opt/anaconda3/bin/python /Users/jaku/JX-Platform/Github/my-website/Resources/OtherTools/watermark.py
from PIL import Image
import os, sys

def resizeImage(infile, output_dir="", reduce=True, ext=".jpg"):
    outfile = os.path.splitext(infile)[0]
    extension = os.path.splitext(infile)[1]
    w=1024
    logo = Image.open('../../Logo/JXX.png')
    logo.thumbnail((60, 60))
    if (cmp(extension, ext)):
        return

    if infile != outfile:
        try :
            im = Image.open(infile)
            width, height = im.size
            if reduce:
                if(width>height):
                    nh = width*height/w
                else:
                    nh = w
                    w = height*width/nh
                im.thumbnail((w, nh), Image.ANTIALIAS)
                outfile += "_min"

            image_copy = im.copy()
            position = ((image_copy.width - logo.width - 10), (image_copy.height - logo.height - 10))
            image_copy.paste(logo, position, logo)
            image_copy.save(output_dir+outfile+extension,"JPEG")
        except IOError:
            print("cannot reduce image for ", infile)

def cmp(a, b):
    return (a > b) - (a < b) 
    
if __name__=="__main__":
    output_dir = "min/"
    dir = "./"

    if not os.path.exists(os.path.join(dir,output_dir)):
        os.mkdir(output_dir)

    for file in os.listdir(dir):
        resizeImage(file,output_dir)
