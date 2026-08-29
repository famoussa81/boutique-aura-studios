# Registre de génération — nouvelle marque

Ce fichier permet à un autre agent de reprendre le lot sans relire la
conversation. Il doit être mis à jour après chaque image inspectée, générée,
validée ou rejetée.

## État actuel

- Marque : Coach (identifiée dans les marquages photographiés).
- Images sources reçues : 42 JPEG dans `C:\\Users\\PC\\Downloads\\Telegram Desktop`, le 29 août 2026.
- Générations effectuées : aucune.
- Intégration dans le site : préparation des actifs en cours ; publication
  distante reste suspendue jusqu'aux prix confirmés et à une session dashboard.
- Mode retenu : conserver les meilleures photographies réelles. Les produits
  affichent des monogrammes Coach ; aucune édition générative n'est utilisée,
  afin de ne jamais les modifier.

## Règles non négociables

- Conserver exactement le produit, sa construction, son coloris et sa paire.
- Utiliser la vraie chaussure de la photo source ; ne pas inventer un modèle.
- Ne jamais générer, redessiner, corriger ou modifier un logo, monogramme ou
  texte de marque. Si le logo officiel manque, le signaler au lieu de
  l'inventer.
- Produit : fond blanc pur `#FFFFFF`, ombre légère réaliste, vertical 3:4,
  idéalement 1200 × 1600 px, paire centrée occupant 70–80 % du cadre.
- Aucun cadre, collage, texte, watermark, décor ou reflet étrange.
- Ne pas toucher aux photos contenant volontairement boîte, carton ou sac,
  sauf instruction explicite du client.
- Bannière de marque : photographie sans texte ni logo généré ; prévoir la
  zone de recadrage réellement utilisée par le site. Le sujet essentiel doit
  rester dans la bande centrale.
- Ne jamais écraser une source reçue. Les sorties sont enregistrées sous des
  noms versionnés jusqu'à validation.

## Ordre de priorité

1. **Critique** — mauvais produit/coloris, chaussure unique alors qu'une paire
   est vendue, autre article visible, logo altéré, collage ou image inutilisable.
2. **Élevée** — basse définition, grand cadre blanc, sujet minuscule, fond non
   studio, cadrage coupé ou perspective incohérente.
3. **Moyenne** — fond presque blanc, ombre trop forte, échelle ou centrage
   différents du reste du catalogue.
4. **Faible** — visuel déjà exploitable nécessitant seulement une homogénéité
   finale.

La bannière est traitée après avoir validé au moins une photo produit fidèle,
afin d'utiliser un produit réellement approuvé comme référence.

## Inventaire du lot

| # | Source | Usage prévu | Défaut observé | Priorité | Sortie | Statut |
|---|---|---|---|---|---|---|
| 1 | Photos 10, 15, 16, 19, 23 | Claquette matelassée C | Cinq coloris, paires réelles | — | `assets/products/femme/coach-matelassee-*-studio.jpg` | Intégrée dans la graine |
| 2 | Photo 5 | Claquette signature | Marron, paire réelle | — | `assets/products/femme/coach-signature-marron-studio.jpg` | Intégrée dans la graine |
| 3 | Photos 30, 31, 33 | Mule à boucle | Argent, ivoire et marron, paires réelles | — | `assets/products/femme/coach-mule-boucle-*-studio.jpg` | Intégrée dans la graine |
| 4 | Photo 12 | Claquette badge signature | Beige, paire réelle | — | `assets/products/femme/coach-badge-beige-studio.jpg` | Intégrée dans la graine |

Les doublons stricts confirmés sont 5/7, 8/15, 9/12 et 30/32/34. Les autres
sources ne sont pas retenues pour l'ouverture : elles ne présentent pas une
paire propre suffisamment homogène.

### Bannière Coach

- Sortie : `assets/brand-banners/coach.jpg` et sa miniature.
- Rôle : image de couverture de marque, générée sans texte, logo, monogramme
  ni marque ; les produits réels restent exclusivement les photographies
  sources recadrées en studio.
- Choix éditorial : la Mule Boucle Signature puis la Claquette Matelassée C
  sont placées parmi les vedettes Femme et de la marque ; les deux autres
  modèles restent dans l'ordre secondaire.

Statuts autorisés : `À recevoir`, `Inspectée`, `À générer`, `Générée`,
`Rejetée`, `Validée`, `Prête à intégrer`.

## Journal des générations

Pour chaque appel, consigner :

```text
Source :
Rôle de l'image : cible d'édition / référence / soutien
Défaut corrigé :
Invariants : modèle, coloris, matière, coutures, semelle, marquages inchangés
Prompt final :
Chemin de sortie :
Contrôle visuel :
Décision : validée / rejetée / nouvelle itération
```

## Contrôle avant remise au prochain agent

- Chaque sortie validée a un chemin absolu dans ce registre.
- Chaque produit correspond visuellement à sa source.
- Les paires contiennent bien deux chaussures quand le produit se vend par
  paire.
- Les marquages existants n'ont pas été réinterprétés.
- Le fond produit est réellement uniforme et le cadrage cohérent.
- La bannière ne contient aucun faux logo ni texte généré.
- La liste des fichiers à intégrer est explicite ; aucun code, prix, produit
  ou déploiement n'a été modifié pendant la génération.
