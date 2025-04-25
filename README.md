# PokéSwipe – Tinder, maar dan voor Pokémon

## Over het project

PokéSwipe is een webapplicatie waarmee je Pokémonkaartenkunt liken. Simpel gezegd: naar rechts als je 'm leuk vindt, naar links als je 'm niks vindt. Een soort Tinder, maar dan met Pokémon. Ik wilde iets maken dat speels is, herkenbaar qua concept, en technisch toch uitdagend genoeg.

De app is gebouwd in Node.js met Tinyhttp als backend. De frontend is gemaakt met HTML, CSS en JavaScript, zonder frameworks.

Het project was trouwens voor school, dus ik heb het ook een beetje binnen dat kader gebouwd: overzichtelijk, leerzaam en vooral iets waar ik zelf lol in had.

### Waarom ik dit wilde maken

Ik wilde een manier maken waarop je kaarten kon beoordelen zonder allemaal moeilijke menu’s, maar lekker makkelijk met 2 knoppen. Een groene like, en een rode dislike knop. En het leek me leuk om Pokémonkaarten als uitgangspunt te gebruiken, iets waar ik vroeger veel mee gespeeld heb

Wat voor mij belangrijk was:

<li> Swipen met een soepele animatie
<li>Design dat aan Pokémonkaarten doet denken
<li>Simpele interface
<li>Kleurgebruik gebaseerd op Pokémon-types
<li>Werken met localStorage om data tijdelijk op te slaan

## Gebruikerservaring

Als gebruiker zie je steeds één kaart tegelijk. klik je op de grone knop, dan wordt die Pokémon geliket. druk je op de rode knop, dan gebeurt er niks. Dat was eigenlijk een bug, maar daarover straks meer. Je kunt je gelikete Pokémon terugzien op een aparte pagina. En op de detailpagina krijg je wat extra info over de Pokémon.

In de laatste week had ik nog een probleem met localStorage: gelikete Pokémon werden soms niet opgeslagen, en disliked kaarten verdwenen ook niet zoals bedoeld. Uiteindelijk kwam ik erachter dat mijn browser (Chrome) gek deed met de localStorage-geschiedenis. Toen ben ik tijdelijk overgestapt naar Arc. Daar werkte het wel. Uiteindelijk kwam ik er achter dat je de localStorage kan verwijderen van je browser, dus dat had ik ook gedaan, en toen liep alles weer zoals het moest.

## Het proces per week

### Week 1
De eerste week stond vooral in het teken van opstarten. Ik begon met het ontwerpen van de Pokémonkaarten. In mijn hoofd had ik al een beeld van hoe dat eruit moest zien — iets moderns, met ruimte voor info, maar vooral een leuke uitstraling. Toen ik het eerste ontwerp af had, kreeg ik al snel feedback dat het lijkt niet echt op een Pokémonkaart. Dus dat ben ik de volgende wek meteen gaan aanpassen.
Verder ben ik ook gaan experimenteren met Tinyhttp, dat was nieuw voor me. Ik gebruikte het om eenvoudige routing op te zetten voor m’n pagina’s. Dat liep in het begin nog niet helemaal lekker, maar ik begon steeds beter te begrijpen hoe ik LiquidJS kon gebruiken om de content dynamisch te maken.

### Week 2 
Deze week ben ik opnieuw begonnen met de kaarten. Ik keek goed naar echte Pokémonkaarten: hoe zit het in elkaar? Welke kleuren, lettertypes, kaders? Op basis daarvan heb ik een nieuwe kaartstijl ontworpen die veel beter voelde. Meer herkenbaar, meer 'Pokémonkaarterig'.

Ook begon ik aan de structuur van mijn webapp. Ik maakte drie pagina’s aan: een homepage (index), een pagina waar je gelikete kaarten kunt terugzien (likes), en een detailpagina waar je meer info ziet over een specifieke Pokémon.

Ik was ook al voorzichtig begonnen aan de swipe-ervaring. Ik wilde dat het er soepel uitzag, met een vloeiende animatie bij het swipen. Touch-events werken echter heel anders dan gewone muisklikken, dus het was nog wel wat uitzoekwerk.

### Week 3 
Nu werd het serieus. De kaartjes zagen er goed uit, de basispagina’s stonden — tijd voor JavaScript. Deze week ben ik echt begonnen met het schrijven van de logica achter de app.
Het doel was om Pokémon op te slaan als je ze likete, en dat moest allemaal gebeuren in de browser. Dus ik gebruikte localStorage, eigenlijk mijn eerste api binnen dit project. In het begin werkte het nog niet helemaal zoals ik wilde. Soms werden Pokémon niet goed opgeslagen, of verschenen ze niet in de lijst met gelikete kaarten.

### Week 4
De laatste week draaide vooral om afwerking, maar ik heb ook nog iets nieuws toegevoegd: kleuranalyse. Tabel bij de index pagina aangepast werd op basis van het type van de Pokémon (ook heb ik de kleurcode getoont, dit is meer om de api goed te laten zien, en minder design gericht). Daarvoor had ik een stuk JavaScript op internet gevonden, dat elke vijfde pixel van het plaatje oppikt, de RGB-waarden bij elkaar optelt en daar het gemiddelde van neemt. Zo berekent de code één kleur die past bij de afbeelding.
De logica erachter is eigenlijk best elegant: je hoeft niet elk pixel te pakken, alleen een representatieve steekproef.

Verder heb ik het design overal wat strakker gemaakt:
<li> Responsive gedrag verbeterd voor mobiel
<li> CSS opgeschoond en statische bestanden beter gestructureerd

## Conclusie

Ik ben eigenlijk wel trots op hoe het is geworden. Het project ziet er leuk uit, is technisch uitdagend genoeg geweest, en het liken werkt zoals ik wilde.Als ik meer tijd had gehad, had ik misschien iets met echte gebruikersdata gedaan, of een database toegevoegd. Maar voor nu is het een mooie proof-of-concept geworden die laat zien wat je kunt maken met alleen de browser, wat JS en een goed idee.

Techniek

Talen: JavaScript, HTML, CSSFrameworks/libraries:

Tinyhttp

LiquidJS

localStorage (API)

Canva kleuranalyse (eigen code)

Frontend bestanden: swipe.js, liked.jsServer: server.js (voor simpele routing met Tinyhttp)

Styling: alles custom, geen CSS-frameworks gebruikt

