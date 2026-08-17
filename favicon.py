# -*- coding: utf-8 -*-
"""Génère `logos/favicon.ico` à partir de l'initiale de la boutique.

    python favicon.py S

Le favicon livré à l'origine était le logo d'une marque tierce, récupéré avec
la charte graphique qui a servi de point de départ. Une boutique ne peut pas
afficher la marque d'un autre dans l'onglet du navigateur de ses clients.

Le dessin est volontairement minimal — carré noir, lettre blanche, coins
arrondis — parce qu'il doit rester lisible à 16 pixels et cohérent avec le
reste du site, qui est en noir et blanc. Aucune dépendance : tout est écrit
à la main, du tracé de la lettre au conteneur ICO.

À relancer quand la boutique est revendue sous un autre nom.
"""
import io
import os
import struct
import sys

NOIR = (17, 17, 17)
BLANC = (255, 255, 255)

# Chaque lettre est décrite par des segments (x1, y1, x2, y2) en coordonnées
# 0..1, tracés avec une épaisseur constante. Un vrai rendu de police serait
# illisible à 16 pixels ; ces tracés géométriques restent nets.
LETTRES = {
    "A": [(.5, .12, .18, .88), (.5, .12, .82, .88), (.3, .62, .7, .62)],
    "B": [(.28, .12, .28, .88), (.28, .12, .66, .27), (.66, .27, .28, .48),
          (.28, .48, .7, .68), (.7, .68, .28, .88)],
    "C": [(.74, .24, .4, .16), (.4, .16, .24, .5), (.24, .5, .4, .84), (.4, .84, .74, .76)],
    "D": [(.3, .12, .3, .88), (.3, .12, .72, .4), (.72, .4, .72, .6), (.72, .6, .3, .88)],
    "E": [(.3, .12, .3, .88), (.3, .12, .74, .12), (.3, .5, .66, .5), (.3, .88, .74, .88)],
    "F": [(.3, .12, .3, .88), (.3, .12, .74, .12), (.3, .5, .66, .5)],
    "G": [(.74, .24, .4, .16), (.4, .16, .24, .5), (.24, .5, .4, .84),
          (.4, .84, .74, .74), (.74, .74, .74, .54), (.74, .54, .52, .54)],
    "H": [(.28, .12, .28, .88), (.72, .12, .72, .88), (.28, .5, .72, .5)],
    "I": [(.5, .12, .5, .88), (.32, .12, .68, .12), (.32, .88, .68, .88)],
    "J": [(.66, .12, .66, .7), (.66, .7, .44, .86), (.44, .86, .26, .7)],
    "K": [(.28, .12, .28, .88), (.28, .54, .74, .12), (.36, .48, .76, .88)],
    "L": [(.32, .12, .32, .88), (.32, .88, .74, .88)],
    "M": [(.24, .88, .24, .12), (.24, .12, .5, .58), (.5, .58, .76, .12), (.76, .12, .76, .88)],
    "N": [(.28, .88, .28, .12), (.28, .12, .72, .88), (.72, .88, .72, .12)],
    "O": [(.5, .13, .24, .38), (.24, .38, .24, .62), (.24, .62, .5, .87),
          (.5, .87, .76, .62), (.76, .62, .76, .38), (.76, .38, .5, .13)],
    "P": [(.3, .88, .3, .12), (.3, .12, .72, .3), (.72, .3, .3, .52)],
    "Q": [(.5, .13, .24, .38), (.24, .38, .24, .62), (.24, .62, .5, .87),
          (.5, .87, .76, .62), (.76, .62, .76, .38), (.76, .38, .5, .13), (.58, .66, .8, .9)],
    "R": [(.3, .88, .3, .12), (.3, .12, .72, .3), (.72, .3, .3, .52), (.44, .52, .74, .88)],
    # Le « S » suit une vraie courbe, approchée par une chaîne de segments
    # courts : une seule diagonale traversante donnait un glyphe illisible.
    "S": [(.75, .23, .55, .14), (.55, .14, .35, .18), (.35, .18, .29, .3),
          (.29, .3, .36, .43), (.36, .43, .62, .53), (.62, .53, .7, .65),
          (.7, .65, .65, .79), (.65, .79, .45, .86), (.45, .86, .25, .77)],
    "T": [(.5, .12, .5, .88), (.22, .12, .78, .12)],
    "U": [(.28, .12, .28, .62), (.28, .62, .5, .86), (.5, .86, .72, .62), (.72, .62, .72, .12)],
    "V": [(.22, .12, .5, .88), (.5, .88, .78, .12)],
    "W": [(.16, .12, .34, .88), (.34, .88, .5, .42), (.5, .42, .66, .88), (.66, .88, .84, .12)],
    "X": [(.26, .12, .74, .88), (.74, .12, .26, .88)],
    "Y": [(.26, .12, .5, .5), (.74, .12, .5, .5), (.5, .5, .5, .88)],
    "Z": [(.26, .12, .74, .12), (.74, .12, .26, .88), (.26, .88, .74, .88)],
}


def dessiner(taille, lettre):
    """Rend une image RGBA carrée, fond noir arrondi, lettre blanche.

    L'anticrénelage se fait par suréchantillonnage : on trace quatre fois plus
    grand puis on moyenne. Sans lui, les diagonales du « S » ou du « A »
    seraient en escalier à 16 pixels.
    """
    ech = 4
    n = taille * ech
    px = [[(0, 0, 0, 0)] * n for _ in range(n)]

    rayon = n * 0.22
    for y in range(n):
        for x in range(n):
            # Distance au rectangle arrondi : seuls les coins sont testés.
            dx = max(rayon - x, 0, x - (n - 1 - rayon))
            dy = max(rayon - y, 0, y - (n - 1 - rayon))
            if dx * dx + dy * dy <= rayon * rayon:
                px[y][x] = NOIR + (255,)

    trace = LETTRES.get(lettre.upper())
    if trace:
        # Épaisseur du trait, en fraction du côté. En dessous de 0,12 la
        # lettre disparaît à 16 pixels ; au-dessus, les contre-formes du « S »
        # et du « B » se referment.
        ep = n * 0.135
        for (x1, y1, x2, y2) in trace:
            ax, ay, bx, by = x1 * n, y1 * n, x2 * n, y2 * n
            vx, vy = bx - ax, by - ay
            long2 = vx * vx + vy * vy or 1.0
            xmin = int(max(0, min(ax, bx) - ep - 1))
            xmax = int(min(n - 1, max(ax, bx) + ep + 1))
            ymin = int(max(0, min(ay, by) - ep - 1))
            ymax = int(min(n - 1, max(ay, by) + ep + 1))
            for y in range(ymin, ymax + 1):
                for x in range(xmin, xmax + 1):
                    t = ((x - ax) * vx + (y - ay) * vy) / long2
                    t = 0.0 if t < 0 else (1.0 if t > 1 else t)
                    px_ = ax + t * vx - x
                    py_ = ay + t * vy - y
                    if px_ * px_ + py_ * py_ <= (ep / 2) ** 2:
                        px[y][x] = BLANC + (255,)

    # Moyenne des blocs ech×ech.
    out = []
    for y in range(taille):
        ligne = []
        for x in range(taille):
            r = v = b = a = 0
            for j in range(ech):
                for i in range(ech):
                    c = px[y * ech + j][x * ech + i]
                    r += c[0] * c[3]; v += c[1] * c[3]; b += c[2] * c[3]; a += c[3]
            if a:
                ligne.append((r // a, v // a, b // a, a // (ech * ech)))
            else:
                ligne.append((0, 0, 0, 0))
        out.append(ligne)
    return out


def bmp_ico(image):
    """Encode une image RGBA au format BMP « bas vers haut » attendu par ICO."""
    taille = len(image)
    entete = struct.pack('<IiiHHIIiiII', 40, taille, taille * 2, 1, 32, 0, 0, 0, 0, 0, 0)
    corps = bytearray()
    for y in range(taille - 1, -1, -1):
        for (r, v, b, a) in image[y]:
            corps += bytes([b, v, r, a])
    # Masque monochrome, obligatoire même inutilisé avec un canal alpha.
    octets = ((taille + 31) // 32) * 4
    corps += b'\x00' * (octets * taille)
    return entete + bytes(corps)


def main():
    lettre = (sys.argv[1] if len(sys.argv) > 1 else 'S')[:1].upper()
    if lettre not in LETTRES:
        print("Lettre non gérée : %s (A-Z attendu)" % lettre)
        return 1
    tailles = [16, 32, 48]
    images = [bmp_ico(dessiner(t, lettre)) for t in tailles]

    entete = struct.pack('<HHH', 0, 1, len(images))
    offset = 6 + 16 * len(images)
    repertoire = b''
    for t, data in zip(tailles, images):
        repertoire += struct.pack('<BBBBHHII', t, t, 0, 0, 1, 32, len(data), offset)
        offset += len(data)

    if not os.path.isdir('logos'):
        os.makedirs('logos')
    io.open('logos/favicon.ico', 'wb').write(entete + repertoire + b''.join(images))
    print("logos/favicon.ico regénéré avec la lettre « %s » (%s)"
          % (lettre, ', '.join('%dx%d' % (t, t) for t in tailles)))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
