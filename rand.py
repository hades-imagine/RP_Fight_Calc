#!/usr/bin/env python3
# vim: set expandtab cindent sw=4 ts=4:
#
import matplotlib.mlab as mlab
import matplotlib.pyplot as plt
from random import random
import math
import numpy.random
import sys


f, axarr = plt.subplots(11, sharex=True)
for luck in range(0,11):
    x = []
    if luck == 5:
        alpha=1
        beta=1
    elif luck == 0:
        alpha = 0.1
        beta = 5.3
    elif luck == 10:
        alpha = 5.3
        beta = 0.1
    elif luck < 5:
        alpha=min(1,luck/2)
        beta=5.3-luck
    elif luck > 5:
        alpha=luck-4.7
        beta=min(1,luck/2)

    print("Luck %d: A: %f, B: %f" % (luck, alpha, beta))

    for i in range(1,2000):
        x.append( numpy.random.beta(alpha, beta) )
    axarr[luck].set_title(luck)
    axarr[luck].hist(x)
plt.show()

