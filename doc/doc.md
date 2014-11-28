# Documentation
## Format
Comment sont enregistrés les données dans la base:
- commune :
```json
{
  "id",
  "codePostaux",
  "nom",
  "geo",
  "date",
  "dateDel"}
```
- element :
   ```json
{
  "id",
  "codePostal",
  "commune",
  "type",
  "nom",
  "date",
  "dateDel",
  "adresses"
}
```

**codePostaux** : Tableau contenant la liste des codes postaux.

**geo** : Tableau sous la forme [lon,lat] pour être conforme au format GeoJson_Point.

**date** et **dateDel** :au format *Date* natif de *Elasticsearch*.

**adresse** : Tableau sous la forme : [{numero,**geo**}].

**type** : Au choix ***hammeau***, ***voie***, ***lieu-dit***.
Pour limiter l'espace en base de données, il sera codé par un nombre entier sur 8bits.

**numero** : N'est pas necessairement un nombre. *(ex: "2 Bis")*
## Analyse
* Les **codesPostaux** ainsi que **codePostal** ne doivent pas être analysés.
* **geo**@**adresse**@**element** est analysé comme un point GeoJson arrondi à **3**m pour limiter la taille de la base.
* **geo**@**commune** est analysé comme un point GeoJson arrondi à **100**m pour limiter la taille de la base.
* les **nom**s et **commune** sont à analyser en Français, avec ellison, wordend...
* **numero** : devra être analyser de la sorte 
  * 1<2<3...
  * (1=1A)<(1B=1Bis)<(1T=1Ter=1C)<(1Q=1Qua=1D)<1E....
  * Par distances.
