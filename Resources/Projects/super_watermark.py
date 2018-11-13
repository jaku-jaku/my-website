#!/usr/bin/env python

from PIL import Image
import os, sys

def resizeImage(subdir, infile, output_dir=""):
     outfile = os.path.splitext(infile)[0]+"_min"
     extension = os.path.splitext(infile)[1]
     w=400
     logo = Image.open('../Logo/JXX.png')
     logo.thumbnail((w/10, w/10))
     if (cmp(extension, ".JPG")):
        return

     if infile != outfile:
        try :
            im = Image.open(subdir+"/"+infile)
            width, height = im.size
            if(width>height):
                nh = width*height/w
            else:
                nh = w
                w = height*width/nh
            im.thumbnail((w, nh), Image.ANTIALIAS)

            image_copy = im.copy()
            position = ((image_copy.width - logo.width - 10), (image_copy.height - logo.height - 10))
            image_copy.paste(logo, position, logo)
            image_copy.save(subdir+"/"+output_dir+outfile+extension,"JPEG")
        except IOError:
            print "cannot reduce image for ", infile


if __name__=="__main__":
    output_dir = "min/"
    rootdir = "./"

    for subdir, dirs, files in os.walk(rootdir):
         if(subdir != "./"):
            if "min" not in subdir:
                outdir = subdir+"/"+output_dir
                if not os.path.exists(outdir):
                    os.mkdir(outdir)

                for file in os.listdir(subdir):
                    resizeImage(subdir[2:],file,output_dir)
