// Source for Phase 2-4 decks. Run: node scripts/phase24-gen.mjs  (fills exact BSB text, appends fixture)
export const TABOO = [
 ['Noah',['ark','flood','rain','animals'],'GEN 6:14','an ark'],
 ['Goliath',['giant','David','stone','sling'],'1SA 17:4','Goliath'],
 ['Jonah',['whale','fish','Nineveh','swallowed'],'JON 1:17','Jonah'],
 ['Moses',['Egypt','sea','Pharaoh','basket'],'EXO 14:21','Moses'],
 ['Manna',['bread','desert','sky','food'],'EXO 16:31','manna'],
 ['Zacchaeus',['tree','short','tax','climb'],'LUK 19:4','sycamore'],
 ['Daniel',['lions','den','king','Darius'],'DAN 6:22','lions'],
 ['Rainbow',['colours','Noah','sky','rain'],'GEN 9:13','rainbow'],
 ['Shepherd',['sheep','flock','David','staff'],'PSA 23:1','shepherd'],
 ['Samson',['hair','strong','Delilah','lion'],'JDG 16:17','Samson'],
 ['Joseph',['coat','dreams','brothers','Egypt'],'GEN 37:3','robe'],
 ['Ruth',['Naomi','Boaz','field','grain'],'RUT 2:3','Ruth'],
 ['Elijah',['ravens','fire','Baal','chariot'],'1KI 17:6','ravens'],
 ['Peter',['fisherman','rock','boat','water'],'MAT 14:29','Peter'],
 ['Burning bush',['Moses','fire','shoes','flames'],'EXO 3:2','bush'],
 ['Tower of Babel',['tall','languages','bricks','sky'],'GEN 11:9','Babel'],
 ['Lost sheep',['shepherd','found','flock','ninety-nine'],'LUK 15:6','lost sheep'],
 ['Walls of Jericho',['trumpets','march','fell','Joshua'],'JOS 6:20','wall'],
 ['Five loaves and two fish',['boy','bread','basket','5,000'],'JHN 6:9','five barley loaves'],
 ['Good Samaritan',['neighbour','road','robbers','helped'],'LUK 10:33','Samaritan'],
]
export const FILL = [
 ['GEN 1:1','beginning'],['PSA 23:1','shepherd'],['PSA 119:105','lamp'],['PRO 3:5','Trust'],['1JN 4:19','first'],
 ['JOS 1:9','courageous'],['EPH 4:32','kind'],['PSA 136:1','good'],['ISA 40:31','eagles'],['1CO 13:4','patient'],
 ['MAT 5:9','peacemakers'],['JHN 8:12','light'],['PSA 46:1','refuge'],['JHN 11:35','wept'],['PSA 118:24','rejoice'],
 ['MAT 28:20','always'],['JHN 3:16','loved'],['PSA 100:1','joyful'],['PHP 4:4','Rejoice'],['GEN 9:13','rainbow'],
]
export const SKETCH = [
 ['Ark','GEN 6:14','ark'],['Rainbow','GEN 9:13','rainbow'],['Lion','DAN 6:22','lions'],['Star','MAT 2:10','star'],
 ['Fish','JON 1:17','fish'],['Sheep','LUK 15:6','sheep'],['Tree','LUK 19:4','tree'],['Ladder','GEN 28:12','ladder'],
 ['Basket','EXO 2:3','basket'],['Sling','1SA 17:50','sling'],['Ram’s horn trumpet','JOS 6:20','horn'],['Donkey','MAT 21:7','donkey'],
 ['Camel','MAT 19:24','camel'],['Lamp','PSA 119:105','lamp'],['Well','JHN 4:6','well'],['Boat','MAT 14:29','boat'],
 ['Bread','JHN 6:9','loaves'],['Robe','GEN 37:3','robe'],['Bush on fire','EXO 3:2','bush'],['Tower','GEN 11:4','tower'],
]
// tier little = simple actions; grown = whole scene read aloud and acted together
export const SCENES = [
 ['little','Roar like a lion, then shut your mouth tight','DAN 6:22','shut the mouths of the lions'],
 ['little','Climb up a tree to see','LUK 19:4','climbed a sycamore tree'],
 ['little','March round the walls, then shout!','JOS 6:20','shout'],
 ['little','Be a lost sheep, then get found','LUK 15:6','lost sheep'],
 ['little','Swim like a great big fish','JON 1:17','great fish'],
 ['little','Hammer and build the ark','GEN 6:14','ark'],
 ['little','Whirl a sling, then let go','1SA 17:50','sling'],
 ['little','Be a raven flying with bread','1KI 17:6','ravens'],
 ['little','Hide baby Moses in the reeds','EXO 2:3','reeds'],
 ['little','Walk on the water, step by step','MAT 14:29','walked on the water'],
 ['grown','The father runs to hug his son','LUK 15:20','ran to his son'],
 ['grown','The Samaritan bandages the stranger','LUK 10:34','bandaged his wounds'],
 ['grown','Jacob dreams of a ladder','GEN 28:12','ladder'],
 ['grown','Gideon’s men shatter their jars','JDG 7:20','shattered their jars'],
 ['grown','Ruth gleans in the field','RUT 2:3','gleaned'],
 ['grown','Paul’s ship runs aground','ACT 27:41','ran aground'],
 ['grown','The wise man builds on rock','MAT 7:24','built his house on the rock'],
 ['grown','The disciples pick up the leftovers','MAT 14:20','twelve basketfuls'],
]
export const PSALM_LINES = ['PSA 23:1','PSA 100:1','PSA 118:24','PSA 136:1','PSA 46:1','PSA 119:105','PSA 150:6','PSA 34:8','PSA 121:1','PSA 95:1']
