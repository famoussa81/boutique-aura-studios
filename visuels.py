# -*- coding: utf-8 -*-
"""Recherche de visuels sur Pexels, avec vérification avant adoption.

    python visuels.py chercher     # télécharge des candidats dans assets-candidats/
    python visuels.py adopter      # applique les choix de choix.json vers assets/

Le jeu d'images livré montrait une rue commerçante en Pologne en en-tête et des
bottines en cuir sur la couverture d'une marque de claquettes. Les fichiers se
chargeaient sans erreur — c'est pour cela que le contrôle automatique ne l'a pas
vu. Une image ne se vérifie qu'en la regardant.

Ce script sépare donc les deux temps : il télécharge des candidats numérotés
sans rien écraser, puis n'applique dans `assets/` que ce qui a été choisi
explicitement. Aucun visuel n'entre dans la boutique sans avoir été regardé.
"""
import io
import json
import os
import sys
import urllib.parse
import urllib.request

CLE = io.open('.pexels-key', encoding='utf-8').read().strip()
DOSSIER = 'assets-candidats'

# Les requêtes disent ce que la boutique vend réellement : des claquettes, des
# mules et des sabots. « shoes » ou « streetwear » ramènent des baskets à
# lacets et des manteaux, ce qui est exactement l'erreur d'origine.
REQUETES = {
    'hero':        ('slide sandals summer', 'landscape'),
    'banniere':    ('flip flops sandals pair', 'landscape'),
    'editorial':   ('sandals shop shelves', 'portrait'),
    'cat-claquettes': ('pool slides sandals', 'landscape'),
    'cat-mules':   ('clogs mules shoes', 'landscape'),
    'marque':      ('designer slides sandals', 'landscape'),
    'produit':     ('slide sandal product white background', 'portrait'),
    'coloris':     ('sandals colorful pairs', 'portrait'),
}


def chercher(requete, orientation, n=8):
    url = ('https://api.pexels.com/v1/search?query=%s&orientation=%s&per_page=%d'
           % (urllib.parse.quote(requete), orientation, n))
    req = urllib.request.Request(url, headers={
        'Authorization': CLE,
        # Sans en-tête de navigateur, l'API répond 403 à urllib.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })
    return json.load(urllib.request.urlopen(req, timeout=30)).get('photos', [])


def telecharger(url, dest):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, timeout=60) as r:
        io.open(dest, 'wb').write(r.read())


def commande_chercher():
    if not os.path.isdir(DOSSIER):
        os.makedirs(DOSSIER)
    index = {}
    for cle, (requete, orientation) in REQUETES.items():
        photos = chercher(requete, orientation)
        print('%-16s « %s » : %d resultat(s)' % (cle, requete, len(photos)))
        for i, p in enumerate(photos):
            nom = '%s-%d.jpg' % (cle, i)
            dest = os.path.join(DOSSIER, nom)
            telecharger(p['src']['large'], dest)
            index[nom] = {
                'photographe': p.get('photographer', ''),
                'source': p.get('url', ''),
                'alt': p.get('alt', ''),
            }
    io.open(os.path.join(DOSSIER, 'index.json'), 'w', encoding='utf-8').write(
        json.dumps(index, indent=1, ensure_ascii=False))
    print('\n%d candidats dans %s/ — a regarder avant d\'adopter.' % (len(index), DOSSIER))




# ---------------------------------------------------------------- adoption
# Chaque destination reçoit une source explicitement choisie, après avoir été
# regardée. Le rapport impose le cadrage : l'en-tête est panoramique, une
# carte produit est verticale. Le recadrage prend le centre.
CHOIX = {
    'hero.webp':            ('hero-4',       16 / 10),
    'banniere.webp':        ('marque-5',     16 / 9),
    'editorial.webp':       ('editorial-4',  4 / 5),
    'cat-claquettes.webp':  ('hero-0',       4 / 3),
    'cat-mules.webp':       ('marque-4',     4 / 3),

    'marque-1.webp':  ('produit-0',   4 / 3),   # Calvin Klein
    'marque-2.webp':  ('hero-6',      4 / 3),   # Louis Vuitton
    'marque-3.webp':  ('coloris-3',   4 / 3),   # Burberry
    'marque-4.webp':  ('marque-1',    4 / 3),   # Givenchy
    'marque-5.webp':  ('hero-1',      4 / 3),   # Dior
    'marque-6.webp':  ('produit-4',   4 / 3),   # Balenciaga
    'marque-7.webp':  ('produit-6',   4 / 3),   # HUGO
    'marque-8.webp':  ('hero-2',      4 / 3),   # Tommy Jeans
    'marque-9.webp':  ('coloris-4',   4 / 3),   # Moncler
    'marque-10.webp': ('hero-5',      4 / 3),   # EA7
    'marque-11.webp': ('marque-7',    4 / 3),   # AllSaints

    'cl-noir.webp':      ('hero-0',     3 / 4),
    'cl-bleu.webp':      ('marque-1',   3 / 4),
    'cl-rouge.webp':     ('produit-7',  3 / 4),
    'cl-beige.webp':     ('hero-7',     3 / 4),
    'cl-cuir.webp':      ('hero-6',     3 / 4),
    'cl-interieur.webp': ('produit-0',  3 / 4),
    'cl-pile.webp':      ('marque-3',   3 / 4),
}


def commande_adopter():
    from PIL import Image
    index = json.load(io.open(os.path.join(DOSSIER, 'index.json'), encoding='utf-8'))
    lignes = []
    for dest, (src, ratio) in sorted(CHOIX.items()):
        chemin = os.path.join(DOSSIER, src + '.jpg')
        if not os.path.exists(chemin):
            print('MANQUANT :', chemin)
            continue
        im = Image.open(chemin).convert('RGB')
        # Recadrage centré au rapport demandé, puis mise à l'échelle.
        l, h = im.size
        if l / h > ratio:
            nl = int(h * ratio)
            im = im.crop(((l - nl) // 2, 0, (l + nl) // 2, h))
        else:
            nh = int(l / ratio)
            im = im.crop((0, (h - nh) // 2, l, (h + nh) // 2))
        large = 1600 if ratio >= 1 else 900
        im = im.resize((large, int(large / ratio)), Image.LANCZOS)
        im.save(os.path.join('assets', dest), 'WEBP', quality=82, method=6)
        meta = index.get(src + '.jpg', {})
        lignes.append('| `assets/%s` | %s | %s |' % (dest, meta.get('photographe', ''), meta.get('source', '')))
        print('%-22s <- %-12s %dx%d' % (dest, src, im.width, im.height))

    io.open('assets/ATTRIBUTION.md', 'w', encoding='utf-8').write(
        "# Attribution des visuels\n\n"
        "Toutes les photographies proviennent de **Pexels** et sont utilisées sous\n"
        "[licence Pexels](https://www.pexels.com/license/) : usage commercial autorisé,\n"
        "attribution non obligatoire — elle figure ici par transparence.\n\n"
        "Ce sont des visuels de démonstration. Le commerçant les remplace par ses\n"
        "propres photos depuis l'administration ; ce fichier n'a alors plus d'objet.\n\n"
        "| Fichier | Photographe | Source |\n|---|---|---|\n" + '\n'.join(sorted(lignes)) + '\n')
    print('\nassets/ATTRIBUTION.md réécrit (%d entrées).' % len(lignes))


if __name__ == '__main__':
    action = sys.argv[1] if len(sys.argv) > 1 else 'chercher'
    if action == 'chercher':
        commande_chercher()
    elif action == 'adopter':
        commande_adopter()
    else:
        print('Actions : chercher, adopter')
