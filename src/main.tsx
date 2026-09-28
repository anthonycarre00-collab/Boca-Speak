import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

type Word={en:string; es:string; say:string; sound:string; note?:string; tags?:string[]};

type Phrase={en:string; es:string; say:string; tip:string; scene:string; focus:string};

// Melissa v0.7: Spanish-first English learning with a reviewed pronunciation bridge.
// It is intentionally NOT IPA. It is an approximate reading bridge and should be
// teacher-editable before being treated as authoritative course content.
const words:Word[]=[
 {en:'three',es:'tres',say:'zrí',sound:'TH',note:'Tongue lightly between the teeth. Keep the long “ee” vowel.',tags:['numbers','common']},
 {en:'think',es:'pensar',say:'zínk',sound:'TH',note:'Do not use a hard Spanish T. Let air pass around the tongue.',tags:['common']},
 {en:'thing',es:'cosa',say:'zing',sound:'TH',tags:['common']},
 {en:'thank',es:'agradecer',say:'zank',sound:'TH',tags:['common']},
 {en:'this',es:'esto',say:'dhís',sound:'TH voiced',note:'This TH is voiced: feel vibration in your throat.',tags:['common']},
 {en:'that',es:'eso',say:'dhat',sound:'TH voiced',tags:['common']},
 {en:'they',es:'ellos',say:'dhei',sound:'TH voiced',tags:['common']},
 {en:'there',es:'allí',say:'dher',sound:'TH voiced',tags:['common']},
 {en:'these',es:'estos',say:'dhíiz',sound:'TH voiced',tags:['common']},
 {en:'with',es:'con',say:'widh',sound:'TH',note:'Finish the final sound instead of dropping it.',tags:['common']},
 {en:'weather',es:'clima',say:'uédher',sound:'TH voiced',tags:['common']},
 {en:'water',es:'agua',say:'wó-der',sound:'W + T',note:'Round the lips for W. In many American accents the middle T becomes a quick D-like tap.',tags:['common','travel']},
 {en:'would',es:'haría / quisiera',say:'wud',sound:'W',note:'Round your lips; avoid beginning with a Spanish B/V.',tags:['common']},
 {en:'world',es:'mundo',say:'uérld',sound:'W + R + final',note:'Start with rounded W, keep the English R, and finish the L/D cluster.',tags:['common']},
 {en:'woman',es:'mujer',say:'wú-man',sound:'W',tags:['people']},
 {en:'women',es:'mujeres',say:'uí-min',sound:'W + vowels',tags:['people']},
 {en:'work',es:'trabajo',say:'uérk',sound:'W + R',note:'English R is not rolled. Pull the tongue back without touching the roof.',tags:['work']},
 {en:'water bottle',es:'botella de agua',say:'wó-der bó-dol',sound:'W + T',tags:['travel']},
 {en:'very',es:'muy',say:'véri',sound:'V',note:'For V, top teeth touch the lower lip and the sound vibrates.',tags:['common']},
 {en:'visit',es:'visitar',say:'ví-zit',sound:'V',tags:['travel']},
 {en:'voice',es:'voz',say:'vois',sound:'V',tags:['common']},
 {en:'seven',es:'siete',say:'sé-ven',sound:'V',tags:['numbers']},
 {en:'leave',es:'salir / dejar',say:'líiv',sound:'V + vowel',tags:['common']},
 {en:'live',es:'vivir',say:'liv',sound:'Vowel contrast',note:'Short i: quick and relaxed. Compare with “leave”.',tags:['common']},
 {en:'wine',es:'vino',say:'uáin',sound:'W',note:'Start with rounded W rather than a Spanish B/V.',tags:['food']},
 {en:'west',es:'oeste',say:'uést',sound:'W',tags:['travel']},
 {en:'house',es:'casa',say:'jáus',sound:'H',note:'English H is aire suave. Usa una J MUY suave solo como recordatorio; no rasques la garganta.',tags:['home']},
 {en:'help',es:'ayudar',say:'jélp',sound:'H',note:'Let air out gently at the start; do not scrape the throat.',tags:['common']},
 {en:'hotel',es:'hotel',say:'joU-TÉL',sound:'H + stress',tags:['travel']},
 {en:'happy',es:'feliz',say:'já-pi',sound:'H',tags:['common']},
 {en:'hello',es:'hola',say:'je-lóu',sound:'H + stress',tags:['greetings']},
 {en:'job',es:'trabajo / empleo',say:'yob',sound:'J',note:'English J is /dʒ/: a voiced “j” sound, not Spanish J.',tags:['work']},
 {en:'just',es:'solo / justo',say:'yast',sound:'J',tags:['common']},
 {en:'juice',es:'jugo',say:'yús',sound:'J',tags:['food']},
 {en:'June',es:'junio',say:'yúun',sound:'J',tags:['calendar']},
 {en:'chair',es:'silla',say:'cher',sound:'CH',tags:['home']},
 {en:'cheap',es:'barato',say:'chíip',sound:'CH',tags:['shopping']},
 {en:'teacher',es:'profesor/a',say:'tí-cher',sound:'CH',tags:['school']},
 {en:'chicken',es:'pollo',say:'chí-ken',sound:'CH',tags:['food']},
 {en:'ship',es:'barco',say:'shíp',sound:'Vowel + SH',note:'Short i. Compare with “sheep”.',tags:['travel']},
 {en:'sheep',es:'oveja',say:'shíip',sound:'Vowel contrast',note:'Longer “ee” vowel.',tags:['animals']},
 {en:'full',es:'lleno',say:'ful',sound:'Vowel contrast',note:'Short “u”. Compare with “fool”.',tags:['common']},
 {en:'fool',es:'tonto',say:'fúul',sound:'Vowel contrast',tags:['common']},
 {en:'food',es:'comida',say:'fúud',sound:'Vowel',tags:['food']},
 {en:'good',es:'bueno',say:'gud',sound:'Vowel',tags:['common']},
 {en:'right',es:'correcto / derecho',say:'ráit',sound:'R',note:'English R: tongue pulled back, not tapped or rolled.',tags:['common']},
 {en:'really',es:'realmente',say:'rí-li',sound:'R',tags:['common']},
 {en:'around',es:'alrededor',say:'a-ráund',sound:'R + schwa',tags:['common']},
 {en:'car',es:'carro',say:'kár',sound:'R',tags:['travel']},
 {en:'three hundred',es:'trescientos',say:'zrí ján-dred',sound:'TH + R',tags:['numbers']},
 {en:'better',es:'mejor',say:'bé-der',sound:'T / rhythm',note:'In many American accents the middle T sounds like a very quick D-like tap.',tags:['common']},
 {en:'wanted',es:'quería / quiso',say:'uón-tid',sound:'-ED',note:'Here -ed adds a syllable: wan-tid.',tags:['past']},
 {en:'needed',es:'necesitó',say:'ní-did',sound:'-ED',tags:['past']},
 {en:'played',es:'jugó',say:'pléid',sound:'-ED',note:'Here -ed is a final D sound; no extra syllable.',tags:['past']},
 {en:'called',es:'llamó',say:'kóld',sound:'-ED',tags:['past']},
 {en:'worked',es:'trabajó',say:'uérkt',sound:'-ED',note:'Here -ed is a final T sound.',tags:['past','work']},
 {en:'asked',es:'preguntó',say:'áskt',sound:'Final consonants',note:'Keep the ending. It is a cluster, but do not add an extra vowel.',tags:['past']},
 {en:'helped',es:'ayudó',say:'jelpt',sound:'Final consonants',tags:['past']},
 {en:'world',es:'mundo',say:'uérld',sound:'Final consonants',tags:['common']},
 {en:'coffee',es:'café',say:'kó-fi',sound:'Stress',note:'Make the first syllable stronger.',tags:['food']},
 {en:'about',es:'sobre / acerca de',say:'a-báut',sound:'Stress',note:'The first vowel is weak; the second syllable carries the stress.',tags:['common']},
 {en:'support',es:'apoyar',say:'sa-pórt',sound:'Stress',tags:['work']},
 {en:'banana',es:'banano',say:'ba-ná-na',sound:'Stress',tags:['food']},
 {en:'hotel room',es:'habitación de hotel',say:'jou-TÉL rúm',sound:'Stress + H',tags:['travel']},
 {en:'how',es:'cómo',say:'jáu',sound:'OW',tags:['common']},
 {en:'now',es:'ahora',say:'náu',sound:'OW',tags:['common']},
 {en:'go',es:'ir',say:'góu',sound:'OH',tags:['common']},
 {en:'home',es:'casa',say:'jóum',sound:'OH',tags:['home']},
 {en:'can',es:'poder',say:'kan',sound:'Short vowel',tags:['common']},
 {en:"can't",es:'no poder',say:'kánt',sound:'Final T',tags:['common']},
 {en:'beach',es:'playa',say:'bíich',sound:'Final CH',tags:['travel']},
 {en:'rice',es:'arroz',say:'ráis',sound:'Final S',tags:['food']},
 {en:'rice and beans',es:'arroz y fríjoles',say:'ráis an bíinz',sound:'Rhythm + final consonants',tags:['food']},
 {en:'bus',es:'bus',say:'bas',sound:'Short vowel',tags:['travel']},
 {en:'beach',es:'playa',say:'bíich',sound:'Vowel + final CH',tags:['travel']},
 {en:'sheet',es:'hoja',say:'shíit',sound:'Vowel',tags:['work']},
 {en:'sit',es:'sentarse',say:'sit',sound:'Vowel',tags:['common']},
 {en:'seat',es:'asiento',say:'síit',sound:'Vowel contrast',tags:['travel']},
 {en:'three things',es:'tres cosas',say:'zrí zingz',sound:'TH',tags:['common']},
 {en:'birthday',es:'cumpleaños',say:'bérz-dei',sound:'TH + R',tags:['people']},
 {en:'Thursday',es:'jueves',say:'zérz-dei',sound:'TH + R',tags:['calendar']},
 {en:'brother',es:'hermano',say:'brá-dher',sound:'TH + R',tags:['family']},
 {en:'mother',es:'madre',say:'má-dher',sound:'TH',tags:['family']},
 {en:'father',es:'padre',say:'fá-dher',sound:'TH',tags:['family']},
 {en:'weather',es:'clima',say:'uédher',sound:'TH voiced',tags:['travel']},
 {en:'weather forecast',es:'pronóstico del tiempo',say:'uédher fór-kast',sound:'TH + R',tags:['travel']},
 {en:'very good',es:'muy bueno',say:'véri gud',sound:'V + vowel',tags:['common']},
 {en:'every',es:'cada',say:'évri',sound:'V + R',tags:['common']},
 {en:'never',es:'nunca',say:'néver',sound:'V + R',tags:['common']},
 {en:'love',es:'amor / amar',say:'lav',sound:'Vowel + V',tags:['common']},
 {en:'move',es:'moverse',say:'múuv',sound:'V + vowel',tags:['common']},
 {en:'five',es:'cinco',say:'faiv',sound:'V',tags:['numbers']},
 {en:'twelve',es:'doce',say:'twelv',sound:'V + final consonant',tags:['numbers']},
 {en:'have',es:'tener',say:'jav',sound:'H + V',tags:['common']},
 {en:'helpful',es:'útil / servicial',say:'jélp-ful',sound:'H + final consonants',tags:['work']},
 {en:'hotel',es:'hotel',say:'joU-TÉL',sound:'H + stress',tags:['travel']},
 {en:'airport',es:'aeropuerto',say:'ér-port',sound:'R + final consonants',tags:['travel']},
 {en:'restaurant',es:'restaurante',say:'rés-trant',sound:'R + final consonants',tags:['food']},
 {en:'sorry',es:'perdón / lo siento',say:'sóri',sound:'R',tags:['politeness']},
 {en:'three more',es:'tres más',say:'zrí mor',sound:'TH + R',tags:['common']},
 {en:'street',es:'calle',say:'stríit',sound:'R + final consonants',tags:['travel']},
 {en:'first',es:'primero',say:'férst',sound:'R + final consonants',tags:['common']},
 {en:'birthday party',es:'fiesta de cumpleaños',say:'bérz-dei pár-ti',sound:'TH + R',tags:['people']},
 {en:'school',es:'escuela',say:'skúl',sound:'Vowels',tags:['school']},
 {en:'student',es:'estudiante',say:'stú-dent',sound:'Stress + final consonants',tags:['school']},
 {en:'question',es:'pregunta',say:'kués-chon',sound:'CH + stress',tags:['school']},
 {en:'answer',es:'respuesta',say:'án-ser',sound:'R + stress',tags:['school']},
 {en:'easy',es:'fácil',say:'íi-zi',sound:'Vowels',tags:['common']},
 {en:'busy',es:'ocupado/a',say:'bí-zi',sound:'Vowels',tags:['work']},
 {en:'people',es:'personas',say:'pí-pol',sound:'Vowels + stress',tags:['people']},
 {en:'because',es:'porque',say:'bi-kóz',sound:'Stress',tags:['common']},
 {en:'today',es:'hoy',say:'tu-déi',sound:'Stress',tags:['common']},
 {en:'tomorrow',es:'mañana',say:'tu-mó-róu',sound:'R + stress',tags:['calendar']},
 {en:'yesterday',es:'ayer',say:'yés-ter-dei',sound:'R + stress',tags:['calendar']},
 {en:'where',es:'dónde',say:'uér',sound:'W + R',tags:['common']},
 {en:'what',es:'qué',say:'uat',sound:'W',tags:['common']},
 {en:'when',es:'cuándo',say:'uen',sound:'W',tags:['common']},
 {en:'why',es:'por qué',say:'uái',sound:'W',tags:['common']},
 {en:'which',es:'cuál',say:'uích',sound:'W + CH',tags:['common']},
 {en:'who',es:'quién',say:'júu',sound:'H + W',tags:['common']},
 {en:'three weeks',es:'tres semanas',say:'zrí uíiks',sound:'TH + W',tags:['time']},
 {en:'last week',es:'la semana pasada',say:'last uíik',sound:'W + final consonants',tags:['time']},
 {en:'next week',es:'la próxima semana',say:'nekst uíik',sound:'W + final consonants',tags:['time']},
 {en:'I think so',es:'creo que sí',say:'Ai zínk sóu',sound:'TH + rhythm',tags:['conversation']},
 {en:'I think not',es:'creo que no',say:'Ai zínk not',sound:'TH + final consonants',tags:['conversation']},
 {en:'thank you',es:'gracias',say:'zank yu',sound:'TH',tags:['politeness']},
 {en:'thanks',es:'gracias',say:'zanks',sound:'TH + final consonants',tags:['politeness']},

{en:'she',es:'ella',say:'shí',sound:'SH + vowel',note:'SH is the quiet “sh” sound; do not turn it into CH.',tags:['people','common']},
 {en:'shoe',es:'zapato',say:'shúu',sound:'SH + vowel',tags:['shopping','common']},
 {en:'shoes',es:'zapatos',say:'shúuz',sound:'SH + plural -S',tags:['shopping']},
 {en:'shop',es:'tienda',say:'shop',sound:'SH',tags:['shopping']},
 {en:'shopping',es:'compras',say:'shó-ping',sound:'SH + NG',tags:['shopping']},
 {en:'share',es:'compartir',say:'sher',sound:'SH + R',tags:['common']},
 {en:'show',es:'mostrar',say:'shóu',sound:'SH + diphthong',tags:['common']},
 {en:'English',es:'inglés',say:'íng-glish',sound:'NG + SH + stress',tags:['school']},
 {en:'fish',es:'pez',say:'fish',sound:'SH + final',tags:['animals']},
 {en:'fresh',es:'fresco/a',say:'fresh',sound:'SH + final',tags:['food']},
 {en:'music',es:'música',say:'miú-zik',sound:'S/Z + stress',tags:['common']},
 {en:'easy',es:'fácil',say:'íi-zi',sound:'S/Z + vowel',tags:['common']},
 {en:'busy',es:'ocupado/a',say:'bí-zi',sound:'S/Z + vowel',tags:['work']},
 {en:'please',es:'por favor',say:'plíiz',sound:'Final Z',tags:['politeness']},
 {en:'eyes',es:'ojos',say:'áis',sound:'Z + diphthong',tags:['people']},
 {en:'zero',es:'cero',say:'zí-rou',sound:'Z + stress',tags:['numbers']},
 {en:'noise',es:'ruido',say:'nóiz',sound:'Z + diphthong',tags:['common']},
 {en:'sing',es:'cantar',say:'sing',sound:'NG + final',note:'End with the nasal “ng” sound. Do not add a hard G.',tags:['common']},
 {en:'long',es:'largo',say:'long',sound:'NG + final',tags:['common']},
 {en:'morning',es:'mañana',say:'mór-ning',sound:'R + NG',tags:['time']},
 {en:'evening',es:'tarde / noche',say:'ív-ning',sound:'V + NG',tags:['time']},
 {en:'going',es:'ir / yendo',say:'góu-ing',sound:'NG + diphthong',tags:['common']},
 {en:'doing',es:'haciendo',say:'dúu-ing',sound:'NG + vowel',tags:['common']},
 {en:'thing',es:'cosa',say:'zing',sound:'TH + NG',tags:['common']},
 {en:'morning coffee',es:'café de la mañana',say:'mór-ning kó-fi',sound:'R + NG + stress',tags:['food']},
 {en:'day',es:'día',say:'déi',sound:'Diphthong',tags:['time']},
 {en:'name',es:'nombre',say:'néim',sound:'Diphthong',tags:['greetings']},
 {en:'same',es:'mismo/a',say:'séim',sound:'Diphthong',tags:['common']},
 {en:'make',es:'hacer',say:'méik',sound:'Diphthong',tags:['common']},
 {en:'time',es:'tiempo',say:'táim',sound:'Diphthong',tags:['time']},
 {en:'night',es:'noche',say:'náit',sound:'Diphthong',tags:['time']},
 {en:'phone',es:'teléfono',say:'fóun',sound:'Diphthong',tags:['digital']},
 {en:'open',es:'abrir / abierto',say:'óu-pen',sound:'Diphthong',tags:['common']},
 {en:'boy',es:'niño',say:'bói',sound:'Diphthong',tags:['people']},
 {en:'choice',es:'opción',say:'chóis',sound:'CH + diphthong',tags:['common']},
 {en:'books',es:'libros',say:'buks',sound:'Plural -S + final',tags:['school']},
 {en:'bags',es:'bolsos / bolsas',say:'bagz',sound:'Plural -S',tags:['shopping']},
 {en:'buses',es:'buses',say:'bás-iz',sound:'Plural -S',tags:['travel']},
 {en:'likes',es:'le gusta',say:'láiks',sound:'Plural -S + diphthong',tags:['common']},
 {en:'lives',es:'vive',say:'livz',sound:'Plural -S + V',tags:['common']},
 {en:'watches',es:'mira / relojes',say:'wó-chiz',sound:'Plural -S + CH',tags:['common']},
 {en:'street',es:'calle',say:'stríit',sound:'Cluster + R',tags:['travel']},
 {en:'speak',es:'hablar',say:'spíik',sound:'Cluster',tags:['school','work']},
 {en:'school',es:'escuela',say:'skúul',sound:'Cluster',tags:['school']},
 {en:'start',es:'empezar',say:'stárt',sound:'Cluster + R + final',tags:['common']},
 {en:'next',es:'siguiente',say:'nekst',sound:'Cluster + final',tags:['time']},
 {en:'first',es:'primero',say:'férst',sound:'Cluster + R + final',tags:['common']},
 {en:'text',es:'mensaje de texto',say:'tekst',sound:'Cluster + final',tags:['digital']},
 {en:'price',es:'precio',say:'práis',sound:'Cluster + diphthong',tags:['shopping']},
 {en:'fine',es:'bien',say:'fáin',sound:'F/V + diphthong',tags:['common']},
 {en:'van',es:'furgoneta',say:'van',sound:'V',tags:['travel']},
 {en:'fan',es:'fan / aficionado',say:'fan',sound:'F/V contrast',tags:['common']},
 {en:'vine',es:'vid',say:'váin',sound:'V + diphthong',tags:['food']},
 {en:'very',es:'muy',say:'véri',sound:'V',tags:['common']},
 {en:'cap',es:'gorra',say:'kap',sound:'Vowel',note:'English short A is flatter and wider than Spanish A.',tags:['clothes']},
 {en:'cup',es:'taza',say:'kap',sound:'Vowel contrast',note:'The English “u” in cup is short and central; it is not Spanish U.',tags:['food']},
 {en:'bed',es:'cama',say:'bed',sound:'Vowel contrast',tags:['home']},
 {en:'bad',es:'malo/a',say:'bad',sound:'Vowel contrast',tags:['common']},
 {en:'the',es:'el / la / los / las',say:'dhuh / dhíi',sound:'TH + weak form',note:'Usually “dhuh” before a consonant and a stronger “dhíi” before a vowel.',tags:['grammar']},
 {en:'to',es:'a / para',say:'tuh / túu',sound:'Weak form',note:'In quick speech “to” is often a very short “tuh”.',tags:['grammar']},
 {en:'for',es:'para',say:'fer / for',sound:'Weak form + R',note:'Keep it short in connected speech; do not over-stress it.',tags:['grammar']},
 {en:'and',es:'y',say:'an / n',sound:'Weak form + rhythm',note:'In natural speech the “d” may disappear almost completely.',tags:['grammar']},
 {en:'can',es:'poder',say:'kan / kn',sound:'Weak form + vowel',note:'In a question it can be stronger; in connected speech it may reduce.',tags:['grammar']},
 {en:'actually',es:'en realidad',say:'ák-chu-a-li',sound:'CH + stress',tags:['common']},
 {en:'usually',es:'normalmente',say:'iú-shu-a-li',sound:'SH + rhythm',tags:['common']},
 {en:'probably',es:'probablemente',say:'pró-ba-bli',sound:'R + rhythm',tags:['common']},
 {en:'comfortable',es:'cómodo/a',say:'kómf-ter-bol',sound:'R + weak form',tags:['common']},
 {en:'different',es:'diferente',say:'dí-frent',sound:'R + cluster',tags:['common']},
 {en:'important',es:'importante',say:'im-pór-tent',sound:'R + stress',tags:['work']},
];

const phrases:Phrase[]=[
 {en:'How are you?',es:'¿Cómo estás?',say:'Jáu ar yu?',tip:'Let “how” flow as one sound. Do not stress every word.',scene:'Greeting someone',focus:'OW + rhythm'},
 {en:'I would like a coffee, please.',es:'Quisiera un café, por favor.',say:'Ai wud laik a kó-fi, plís.',tip:'“Would” starts with rounded W. Make “a” quick and keep the key words strong.',scene:'Ordering',focus:'W + stress'},
 {en:'Could you help me?',es:'¿Podrías ayudarme?',say:'Kud yu jelp mi?',tip:'Link “could you” naturally. The H in “help” is breath, not Spanish J.',scene:'Asking for help',focus:'H + linking'},
 {en:'How much is it?',es:'¿Cuánto cuesta?',say:'Jáu mach iz it?',tip:'Keep “much” short and finish the final T in “it”.',scene:'Shopping',focus:'OW + final T'},
 {en:'I need some water.',es:'Necesito agua.',say:'Ai níid sam wó-der.',tip:'“Need” carries the main stress. American “water” often has a quick middle D-like sound.',scene:'Everyday',focus:'W + T'},
 {en:'Where is the bathroom?',es:'¿Dónde está el baño?',say:'Uér iz dha báth-rum?',tip:'English R in “where”; voiced TH in “the”.',scene:'Travel',focus:'R + TH'},
 {en:'Can I have the bill, please?',es:'¿Me trae la cuenta, por favor?',say:'Kan ai jav dha bil, plís?',tip:'Keep “can” short. “The” uses voiced TH before “bill”.',scene:'Restaurant',focus:'TH + rhythm'},
 {en:'What time does it open?',es:'¿A qué hora abre?',say:'Uat táim daz it óu-pen?',tip:'Round your lips for W. “Does” is usually quick and weak.',scene:'Travel',focus:'W + rhythm'},
 {en:'I am looking for the bus station.',es:'Estoy buscando la estación de buses.',say:'Ai am lú-king for dha bas stéi-shon.',tip:'Keep “for” light and make the key nouns clearer.',scene:'Getting around',focus:'TH + rhythm'},
 {en:'Do you have a room?',es:'¿Tiene una habitación?',say:'Du yu jav a rúm?',tip:'Keep “do you” smooth. H in “have” is breath.',scene:'Hotel',focus:'H + linking'},
 {en:'I need help with this.',es:'Necesito ayuda con esto.',say:'Ai níid jelp widh dhís.',tip:'Three useful targets: H, W, and voiced TH.',scene:'Problem solving',focus:'H + W + TH'},
 {en:'Can you say that again?',es:'¿Puede decir eso otra vez?',say:'Kan yu sei dhat a-gén?',tip:'Keep “can you” flowing and voice the TH in “that”.',scene:'Conversation',focus:'TH + rhythm'},
 {en:'I don’t understand.',es:'No entiendo.',say:'Ai dóunt an-der-stánd.',tip:'Stress “don’t” and “understand”; the middle syllables are lighter.',scene:'Conversation',focus:'Stress'},
 {en:'Could I have some water?',es:'¿Me podría dar agua?',say:'Kud ai jav sam wó-der?',tip:'Useful phrase for real life. Keep “could I” connected.',scene:'Restaurant',focus:'W + linking'},
 {en:'Where are you from?',es:'¿De dónde eres?',say:'Uér ar yu from?',tip:'English R in “where”; do not roll it.',scene:'Conversation',focus:'R'},
 {en:'I work here.',es:'Trabajo aquí.',say:'Ai uérk jír.',tip:'English W + R in “work”; H is breath in “here”.',scene:'Work',focus:'W + R + H'},
 {en:'What would you recommend?',es:'¿Qué recomendarías?',say:'Uat wud yu re-ko-ménd?',tip:'The W in “what/would” is rounded. Stress “recommend”.',scene:'Restaurant',focus:'W + stress'},
 {en:'How much does this cost?',es:'¿Cuánto cuesta esto?',say:'Jáu mach daz dhís kóst?',tip:'Voiced TH in “this”; keep the final T in “cost”.',scene:'Shopping',focus:'TH + final T'},
 {en:'I have a question.',es:'Tengo una pregunta.',say:'Ai jav a kués-chon.',tip:'H is breath. Keep “a” weak and quick.',scene:'Class',focus:'H + rhythm'},
 {en:'See you tomorrow.',es:'Nos vemos mañana.',say:'Sí yu tu-mó-róu.',tip:'Keep “you” clear but unstressed; let the phrase flow.',scene:'Goodbye',focus:'Rhythm'},
 {en:'Thank you very much.',es:'Muchas gracias.',say:'Zank yu véri mach.',tip:'Two useful targets: TH at the start of “thank” and V in “very”.',scene:'Politeness',focus:'TH + V'},
 {en:'This is my first time here.',es:'Es mi primera vez aquí.',say:'Dhís iz mai férst taim jír.',tip:'Voice the TH in “this”. English R is not rolled.',scene:'Travel',focus:'TH + R'},
 {en:'I have been working all day.',es:'He estado trabajando todo el día.',say:'Ai jav bin uér-king ol déi.',tip:'Keep the W/R in “working” and the final consonants clear.',scene:'Work',focus:'W + R'},
 {en:'Can I pay by card?',es:'¿Puedo pagar con tarjeta?',say:'Kan ai péi bai kard?',tip:'Short “can”, clear final D in “card”.',scene:'Shopping',focus:'Final consonants'},
 {en:'Where can I get a taxi?',es:'¿Dónde puedo conseguir un taxi?',say:'Uér kan ai get a ták-si?',tip:'English R in “where”. Keep the final T in “get”.',scene:'Getting around',focus:'R + final T'},
 {en:'I am not sure.',es:'No estoy seguro/a.',say:'Ai am not shúr.',tip:'Stress “not” and “sure”; keep the sentence simple.',scene:'Conversation',focus:'Vowels + stress'},
 {en:'What happened?',es:'¿Qué pasó?',say:'Uat já-pend?',tip:'English H is breath. Finish “happened” cleanly.',scene:'Conversation',focus:'W + H'},
 {en:'Please speak more slowly.',es:'Por favor, hable más despacio.',say:'Plís spík mor slóu-li.',tip:'Stress the useful words: please, speak, slowly.',scene:'Conversation',focus:'Stress'},
 {en:'I am learning English.',es:'Estoy aprendiendo inglés.',say:'Ai am lér-ning Íng-lish.',tip:'Keep “learning” flowing and make “English” clear.',scene:'Class',focus:'R + rhythm'},
 {en:'Nice to meet you.',es:'Mucho gusto.',say:'Náis tu míit yu.',tip:'Keep “nice” and “meet” clear; let “to” stay light.',scene:'Greeting',focus:'Vowels + rhythm'},
 {en:'What do you do?',es:'¿A qué te dedicas?',say:'Uat du yu dúu?',tip:'The main stress lands on “do”. Keep “you” connected.',scene:'Conversation',focus:'W + rhythm'},
 {en:'Where do you live?',es:'¿Dónde vives?',say:'Uér du yu liv?',tip:'English R in “where” and short i in “live”.',scene:'Conversation',focus:'R + vowels'},
 {en:'What is your name?',es:'¿Cómo te llamas?',say:'Uat iz yor néim?',tip:'Keep “what” short and “name” strong.',scene:'Greeting',focus:'W + stress'},
 {en:'My name is Tony.',es:'Me llamo Tony.',say:'Mai néim iz Tony.',tip:'Keep “name” long and clear.',scene:'Greeting',focus:'Vowels'},
 {en:'Where is the bathroom?',es:'¿Dónde está el baño?',say:'Uér iz dha báth-rum?',tip:'Use voiced TH in “the”; English R is not rolled.',scene:'Travel',focus:'R + TH'},
 {en:'Is there a pharmacy nearby?',es:'¿Hay una farmacia cerca?',say:'Iz dher a fár-ma-si nír-bai?',tip:'Voiced TH in “there”.',scene:'Travel',focus:'TH + R'},
 {en:'How do I get there?',es:'¿Cómo llego allá?',say:'Jáu du ai get dher?',tip:'Keep “how do I” flowing; finish “get”.',scene:'Travel',focus:'OW + TH'},
 {en:'Can you help me?',es:'¿Puedes ayudarme?',say:'Kan yu jelp mi?',tip:'Short “can”; gentle H in “help”.',scene:'Everyday',focus:'H + rhythm'},
 {en:'Please wait a moment.',es:'Por favor, espera un momento.',say:'Plís uéit a móu-ment.',tip:'W begins with rounded lips; keep “please” clear.',scene:'Everyday',focus:'W + stress'},
 {en:'I am looking for this address.',es:'Estoy buscando esta dirección.',say:'Ai am lú-king for dhís a-drés.',tip:'Voiced TH in “this”.',scene:'Travel',focus:'TH + rhythm'},
 {en:'How much is this?',es:'¿Cuánto cuesta esto?',say:'Jáu mach iz dhís?',tip:'Voice the TH in “this”.',scene:'Shopping',focus:'TH + OW'},
 {en:'Do you have this in blue?',es:'¿Tiene esto en azul?',say:'Du yu jav dhís in blúu?',tip:'H in “have”; voiced TH in “this”.',scene:'Shopping',focus:'H + TH'},
 {en:'That is too expensive.',es:'Eso es demasiado caro.',say:'Dhat iz túu ik-spén-siv.',tip:'Voiced TH at the start of “that”.',scene:'Shopping',focus:'TH + stress'},
 {en:'Can I pay by card?',es:'¿Puedo pagar con tarjeta?',say:'Kan ai péi bai kard?',tip:'Keep the final R in “card” light but present.',scene:'Shopping',focus:'R + final consonants'},
 {en:'I would like the chicken.',es:'Quisiera el pollo.',say:'Ai wud laik dha chí-ken.',tip:'Rounded W in “would”; voiced TH in “the”.',scene:'Restaurant',focus:'W + TH'},
 {en:'Could I have the bill?',es:'¿Me puede traer la cuenta?',say:'Kud ai jav dha bil?',tip:'Link “could I”; keep H in “have”.',scene:'Restaurant',focus:'H + linking'},
 {en:'Water, please.',es:'Agua, por favor.',say:'Wó-der, plís.',tip:'Round the lips for W. American “water” often has a quick middle D-like tap.',scene:'Restaurant',focus:'W + T'},
 {en:'Can I have some water?',es:'¿Me puede dar agua?',say:'Kan ai jav sam wó-der?',tip:'Keep “can I” connected.',scene:'Restaurant',focus:'W + linking'},
 {en:'The food is very good.',es:'La comida está muy buena.',say:'Dha fúud iz vé-ri gud.',tip:'Voiced TH in “the”; V in “very”.',scene:'Restaurant',focus:'TH + V'},
 {en:'I have a question.',es:'Tengo una pregunta.',say:'Ai jav a kués-chon.',tip:'H is breath; keep the first “a” weak.',scene:'Class',focus:'H + rhythm'},
 {en:'Can you explain that again?',es:'¿Puede explicar eso otra vez?',say:'Kan yu iks-pléin dhat a-gén?',tip:'Voiced TH in “that”; stress “again”.',scene:'Class',focus:'TH + stress'},
 {en:'I understand.',es:'Entiendo.',say:'Ai an-der-stánd.',tip:'Make “stand” the stronger part.',scene:'Class',focus:'Stress'},
 {en:'I don’t understand.',es:'No entiendo.',say:'Ai dóunt an-der-stánd.',tip:'Stress “don’t” and “understand”.',scene:'Class',focus:'Stress'},
 {en:'Can you speak more slowly?',es:'¿Puede hablar más despacio?',say:'Kan yu spík mor slóu-li?',tip:'Stress “speak” and “slowly”; keep small words light.',scene:'Class',focus:'Rhythm'},
 {en:'I am still learning.',es:'Todavía estoy aprendiendo.',say:'Ai am stil lér-ning.',tip:'Keep the R in “learning” without rolling it.',scene:'Class',focus:'R + rhythm'},
 {en:'I work here.',es:'Trabajo aquí.',say:'Ai uérk jír.',tip:'English W and R in “work”; H in “here”.',scene:'Work',focus:'W + R + H'},
 {en:'Could you send it today?',es:'¿Podrías enviarlo hoy?',say:'Kud yu send it tu-déi?',tip:'Keep “could you” connected.',scene:'Work',focus:'Linking + stress'},
 {en:'I will call you tomorrow.',es:'Te llamaré mañana.',say:'Ai wil kol yu tu-mó-róu.',tip:'Keep “will” short; don’t over-stress “you”.',scene:'Work',focus:'W + R'},
 {en:'What time is the meeting?',es:'¿A qué hora es la reunión?',say:'Uat táim iz dha míi-ting?',tip:'Rounded W; voiced TH in “the”.',scene:'Work',focus:'W + TH'},
 {en:'See you tomorrow.',es:'Nos vemos mañana.',say:'Sí yu tu-mó-róu.',tip:'Let the phrase flow instead of stressing every word.',scene:'Goodbye',focus:'Rhythm + R'},
 {en:'Have a good day.',es:'Que tengas un buen día.',say:'Jav a gud déi.',tip:'Gentle H in “have”.',scene:'Politeness',focus:'H + rhythm'},
 {en:'Thank you very much.',es:'Muchas gracias.',say:'Zank yu véri mach.',tip:'TH at the start of “thank” and V in “very”.',scene:'Politeness',focus:'TH + V'},
 {en:'Sorry, I am late.',es:'Perdón, llegué tarde.',say:'Sóri, ai am léit.',tip:'Keep English R in “sorry”.',scene:'Everyday',focus:'R + vowels'},
 {en:'I need to go now.',es:'Necesito irme ahora.',say:'Ai níid tu góu náu.',tip:'Keep “to” light and let “go” and “now” stand out.',scene:'Everyday',focus:'Stress'},
 {en:'I am ready.',es:'Estoy listo/a.',say:'Ai am ré-di.',tip:'English R is not rolled.',scene:'Everyday',focus:'R'},
 {en:'Let’s go.',es:'Vamos.',say:'Lets góu.',tip:'One beat for “let’s”; clear long “go”.',scene:'Everyday',focus:'Vowels'},
];

const additionalPhrases:Phrase[]=[
 {en:'Good morning. How are you?',es:'Buenos días. ¿Cómo estás?',say:'Gud mór-ning. Jáu ar yu?',tip:'“Good morning” should flow as one greeting; keep “how” strong.',scene:'Greeting',focus:'R + NG + rhythm'},
 {en:'Nice to meet you.',es:'Mucho gusto.',say:'Náis tu míit yu.',tip:'Keep “nice” and “meet” clear; let “to” stay light.',scene:'Greeting',focus:'Vowels + rhythm'},
 {en:'Where are you from?',es:'¿De dónde eres?',say:'Uér ar yu from?',tip:'English R in “where”; do not roll it.',scene:'Conversation',focus:'R'},
 {en:'What do you do?',es:'¿A qué te dedicas?',say:'Uat du yu dúu?',tip:'The main stress lands on “do”. Keep “you” connected.',scene:'Conversation',focus:'W + rhythm'},
 {en:'What is your name?',es:'¿Cómo te llamas?',say:'Uat iz yor néim?',tip:'Keep “what” short and “name” strong.',scene:'Greeting',focus:'W + diphthong'},
 {en:'Can you say that again?',es:'¿Puede decir eso otra vez?',say:'Kan yu séi dhat a-gén?',tip:'Keep “can you” flowing and voice the TH in “that”.',scene:'Conversation',focus:'TH + rhythm'},
 {en:'I don’t understand.',es:'No entiendo.',say:'Ai dóunt an-der-stánd.',tip:'Stress “don’t” and “understand”.',scene:'Conversation',focus:'Stress'},
 {en:'Please speak more slowly.',es:'Por favor, hable más despacio.',say:'Plíis spík mor slóu-li.',tip:'Stress “please”, “speak” and “slowly”.',scene:'Conversation',focus:'Stress + diphthong'},
 {en:'I’m still learning English.',es:'Todavía estoy aprendiendo inglés.',say:'Aim stil lér-ning íng-glish.',tip:'Keep “learning” smooth and “English” clear.',scene:'Class',focus:'R + NG + SH'},
 {en:'Could you help me with this?',es:'¿Podrías ayudarme con esto?',say:'Kud yu jelp mi widh dhís?',tip:'Three targets: H, W and voiced TH.',scene:'Work',focus:'H + W + TH'},
 {en:'Can you send me the address?',es:'¿Puedes enviarme la dirección?',say:'Kan yu send mi dhi a-drés?',tip:'Keep “can you” connected and “send me” light.',scene:'Work',focus:'TH + rhythm'},
 {en:'I’ll call you tomorrow.',es:'Te llamaré mañana.',say:'Ail kól yu tu-mó-róu.',tip:'Keep “I’ll” short and let “tomorrow” carry the rhythm.',scene:'Work',focus:'R + stress'},
 {en:'What time is the meeting?',es:'¿A qué hora es la reunión?',say:'Uat táim iz dhuh míi-ting?',tip:'Rounded W; “the” is usually weak here.',scene:'Work',focus:'W + weak form'},
 {en:'I’m on my way.',es:'Ya voy en camino.',say:'Aim on mai uéi.',tip:'Keep “way” long and clear.',scene:'Everyday',focus:'W + diphthong'},
 {en:'I’m almost there.',es:'Ya casi llego.',say:'Aim óul-moust dher.',tip:'Voice the TH in “there”.',scene:'Everyday',focus:'TH + R'},
 {en:'Give me a minute, please.',es:'Dame un minuto, por favor.',say:'Giv mi a mí-nit, plíis.',tip:'Keep “give me” connected; final Z in “please”.',scene:'Everyday',focus:'V + Z'},
 {en:'I need to leave now.',es:'Necesito irme ahora.',say:'Ai níid tuh líiv náu.',tip:'“To” becomes very short in natural speech.',scene:'Everyday',focus:'Weak form + V'},
 {en:'What are you doing?',es:'¿Qué estás haciendo?',say:'Uat ar yu dúu-ing?',tip:'Keep “what are you” flowing; finish “doing” with NG.',scene:'Conversation',focus:'W + NG'},
 {en:'What are you looking for?',es:'¿Qué estás buscando?',say:'Uat ar yu lú-king fer?',tip:'Keep “for” short at the end.',scene:'Shopping',focus:'R + weak form'},
 {en:'How much is this one?',es:'¿Cuánto cuesta este?',say:'Jáu mach iz dhís uan?',tip:'Voice the TH in “this”.',scene:'Shopping',focus:'TH + W'},
 {en:'Do you have this in a bigger size?',es:'¿Tiene esto en una talla más grande?',say:'Du yu jav dhís in a bí-ger sáiz?',tip:'Keep “do you have” smooth; “size” ends with Z.',scene:'Shopping',focus:'TH + Z'},
 {en:'Can I try these on?',es:'¿Me puedo probar estos?',say:'Kan ai trái dhíiz on?',tip:'Voice the TH in “these” and keep “try” clear.',scene:'Shopping',focus:'TH + diphthong'},
 {en:'That’s too expensive for me.',es:'Eso es demasiado caro para mí.',say:'Dhats túu ik-spén-siv fer mi.',tip:'Keep “that’s” short; don’t over-stress “for”.',scene:'Shopping',focus:'TH + weak form'},
 {en:'Can I pay by card?',es:'¿Puedo pagar con tarjeta?',say:'Kan ai péi bai kard?',tip:'Keep “can I” connected and the R in “card” light but present.',scene:'Shopping',focus:'R + diphthong'},
 {en:'Where is the bus stop?',es:'¿Dónde queda la parada de bus?',say:'Uér iz dhuh bas stop?',tip:'“The” is weak before “bus”.',scene:'Getting around',focus:'R + weak form'},
 {en:'Which bus goes downtown?',es:'¿Qué bus va al centro?',say:'Uích bas góuz dáun-táun?',tip:'Keep W/CH in “which” cleanly and let “goes” glide.',scene:'Getting around',focus:'W + CH + diphthong'},
 {en:'How long does it take?',es:'¿Cuánto se demora?',say:'Jáu long daz it téik?',tip:'Keep NG at the end of “long”.',scene:'Getting around',focus:'NG + diphthong'},
 {en:'Is this the right street?',es:'¿Esta es la calle correcta?',say:'Iz dhís dhuh ráit stríit?',tip:'Two THs and a consonant cluster — keep it slow first.',scene:'Getting around',focus:'TH + cluster'},
 {en:'I have a reservation.',es:'Tengo una reserva.',say:'Ai jav a rez-er-véi-shon.',tip:'H is soft breath; stress “reservation” naturally.',scene:'Hotel',focus:'H + stress'},
 {en:'Do you have a room available?',es:'¿Tiene una habitación disponible?',say:'Du yu jav a rúm a-véi-la-bol?',tip:'Keep “do you have” flowing.',scene:'Hotel',focus:'H + diphthong'},
 {en:'What time is breakfast?',es:'¿A qué hora es el desayuno?',say:'Uat táim iz brek-fast?',tip:'Keep “what time” crisp and “is” light.',scene:'Hotel',focus:'W + rhythm'},
 {en:'Could I have another towel?',es:'¿Me puede dar otra toalla?',say:'Kud ai jav a-ná-dher táu-el?',tip:'Voiced TH in “another”.',scene:'Hotel',focus:'TH + diphthong'},
 {en:'The room is very clean.',es:'La habitación está muy limpia.',say:'Dhuh rúm iz véri klíin.',tip:'Use the weak “dhuh” before “room”.',scene:'Hotel',focus:'TH + V'},
 {en:'Where is the pharmacy?',es:'¿Dónde está la farmacia?',say:'Uér iz dhuh fár-ma-si?',tip:'Keep “where” rounded and the English R light.',scene:'Health',focus:'R + weak form'},
 {en:'I need something for a headache.',es:'Necesito algo para el dolor de cabeza.',say:'Ai níid sám-thing fer a jéd-éik.',tip:'Voiced? No: “something” starts with unvoiced TH. Keep “for a” light.',scene:'Health',focus:'TH + weak form'},
 {en:'I have a sore throat.',es:'Tengo dolor de garganta.',say:'Ai jav a sor zróut.',tip:'Keep the TH in “throat” forward and airy.',scene:'Health',focus:'H + TH'},
 {en:'How often should I take it?',es:'¿Cada cuánto debo tomarlo?',say:'Jau ó-fen shud ai téik it?',tip:'“How” starts with a gentle H, not Spanish J.',scene:'Health',focus:'H + SH'},
 {en:'I have a question.',es:'Tengo una pregunta.',say:'Ai jav a kués-chon.',tip:'Soft H in “have”; keep “question” as two clear beats.',scene:'Class',focus:'H + CH'},
 {en:'Could you explain that again?',es:'¿Podrías explicar eso otra vez?',say:'Kud yu iks-pléin dhat a-gén?',tip:'Voice the TH in “that”; stress “again”.',scene:'Class',focus:'TH + stress'},
 {en:'I understand.',es:'Entiendo.',say:'Ai an-der-stánd.',tip:'Make “stand” the stronger part.',scene:'Class',focus:'Stress'},
 {en:'I don’t understand yet.',es:'Todavía no entiendo.',say:'Ai dóunt an-der-stánd yet.',tip:'Keep “yet” short and clear.',scene:'Class',focus:'Stress + final consonants'},
 {en:'Can you speak more slowly?',es:'¿Puede hablar más despacio?',say:'Kan yu spík mor slóu-li?',tip:'Stress “speak” and “slowly”; keep small words light.',scene:'Class',focus:'Rhythm'},
 {en:'What does this word mean?',es:'¿Qué significa esta palabra?',say:'Uat daz dhís uérd míin?',tip:'Voice the TH in “this” and finish “word”.',scene:'Class',focus:'TH + final R'},
 {en:'How do you spell that?',es:'¿Cómo se escribe eso?',say:'Jau du yu spel dhat?',tip:'Gentle H in “how”; voiced TH in “that”.',scene:'Class',focus:'H + TH'},
 {en:'Can you repeat the last part?',es:'¿Puede repetir la última parte?',say:'Kan yu ri-píit dhuh last part?',tip:'Weak “the”; keep the final T in “last”.',scene:'Class',focus:'TH + final consonants'},
 {en:'Please write it down.',es:'Por favor, escríbelo.',say:'Plíis ráit it dáun.',tip:'Keep “write” and “down” clear.',scene:'Class',focus:'Diphthongs'},
 {en:'I’m learning a lot.',es:'Estoy aprendiendo mucho.',say:'Aim lér-ning a lot.',tip:'Finish “learning” with NG; keep “a” weak.',scene:'Class',focus:'R + NG + weak form'},
 {en:'Are you free tonight?',es:'¿Estás libre esta noche?',say:'Ar yu fríi tu-náit?',tip:'Let “free” and “tonight” carry the main stress.',scene:'Conversation',focus:'F/V + diphthong'},
 {en:'Do you want to come with us?',es:'¿Quieres venir con nosotros?',say:'Du yu uánt tu kam widh as?',tip:'Keep “with” audible but short.',scene:'Conversation',focus:'W + TH'},
 {en:'Maybe next time.',es:'Tal vez la próxima.',say:'Méi-bi nekst táim.',tip:'Keep the final T cluster in “next”.',scene:'Conversation',focus:'Cluster + diphthong'},
 {en:'See you later.',es:'Nos vemos luego.',say:'Sí yu léi-ter.',tip:'Keep “later” light but clear.',scene:'Goodbye',focus:'Diphthong + R'},
 {en:'Take care.',es:'Cuídate.',say:'Téik ker.',tip:'Keep “take” long and “care” open.',scene:'Goodbye',focus:'Diphthong + R'},
 {en:'Have a good weekend.',es:'Que tengas un buen fin de semana.',say:'Jav a gud wíik-end.',tip:'Soft H in “have”; W in “weekend”.',scene:'Goodbye',focus:'H + W'},
 {en:'I sent you a message.',es:'Te mandé un mensaje.',say:'Ai sent yu a mésij.',tip:'Keep “sent you” smooth and finish the T in “sent”.',scene:'Digital',focus:'Final consonants + J'},
 {en:'Can you send me the photo?',es:'¿Puedes mandarme la foto?',say:'Kan yu send mi dhuh fóu-tou?',tip:'Keep “can you send me” flowing; weak “the”.',scene:'Digital',focus:'W + weak form'},
 {en:'Call me when you can.',es:'Llámame cuando puedas.',say:'Kól mi uen yu kan.',tip:'W begins with rounded lips; keep “can” short.',scene:'Digital',focus:'W + weak form'},
 {en:'I do not have signal.',es:'No tengo señal.',say:'Ai du not jav síg-nol.',tip:'Keep the H in “have” as soft breath.',scene:'Digital',focus:'H + final consonants'},
 {en:'The internet is not working.',es:'El internet no está funcionando.',say:'Dhi ín-ter-net iz not uér-king.',tip:'Keep the W/R in “working”; “the” is stronger before a vowel here.',scene:'Digital',focus:'TH + W + R'},
]



const extraWords:Word[]=[
 {en:'thirty',es:'treinta',say:'zér-ti',sound:'TH + R',note:'Pon la punta de la lengua entre los dientes para TH y no ruedes la R.',tags:['numbers']},
 {en:'thirteen',es:'trece',say:'zér-tíin',sound:'TH + R',tags:['numbers']},
 {en:'third',es:'tercero',say:'zérd',sound:'TH + R + final',note:'TH al frente; termina la palabra sin añadir una vocal.',tags:['numbers']},
 {en:'both',es:'ambos',say:'bóuz',sound:'TH + final',tags:['common']},
 {en:'those',es:'esos',say:'dhóuz',sound:'TH voiced + diphthong',tags:['common']},
 {en:'though',es:'aunque',say:'dhóu',sound:'TH voiced + diphthong',tags:['common']},
 {en:'through',es:'a través de',say:'zrúu',sound:'TH + cluster',tags:['common']},
 {en:'without',es:'sin',say:'wi-dháut',sound:'TH voiced + diphthong',tags:['common']},
 {en:'healthy',es:'saludable',say:'jél-zi',sound:'H + TH + S/Z',note:'La H es aire suave; la TH va con la lengua entre los dientes.',tags:['health']},
 {en:'author',es:'autor/a',say:'ó-zer',sound:'TH + R',tags:['school']},
 {en:'earth',es:'tierra',say:'érz',sound:'TH + R',tags:['common']},
 {en:'hour',es:'hora',say:'áuer',sound:'Silent H + diphthong',note:'La H no suena aquí: empieza directamente con el sonido de “our”.',tags:['time']},
 {en:'honest',es:'honesto/a',say:'ó-nest',sound:'Silent H',note:'La H es muda en esta palabra.',tags:['common']},
 {en:'want',es:'querer',say:'uánt',sound:'W + final',tags:['common']},
 {en:'walk',es:'caminar',say:'uók',sound:'W',tags:['travel']},
 {en:'wall',es:'pared',say:'uól',sound:'W + final',tags:['home']},
 {en:'west',es:'oeste',say:'uést',sound:'W + final',tags:['travel']},
 {en:'vote',es:'votar',say:'vóut',sound:'V + diphthong',tags:['common']},
 {en:'save',es:'guardar / ahorrar',say:'séiv',sound:'V + diphthong',tags:['common']},
 {en:'vest',es:'chaleco',say:'vest',sound:'V + final',tags:['clothes']},
 {en:'dog',es:'perro',say:'dog',sound:'Final consonant',tags:['animals']},
 {en:'dogs',es:'perros',say:'dogz',sound:'Plural -S',tags:['animals']},
 {en:'cats',es:'gatos',say:'kats',sound:'Plural -S',tags:['animals']},
 {en:'zoo',es:'zoológico',say:'zúu',sound:'S/Z',tags:['animals']},
 {en:'rose',es:'rosa',say:'róuz',sound:'S/Z + diphthong',tags:['common']},
 {en:'use',es:'usar',say:'yúuz',sound:'S/Z + diphthong',note:'Aquí “use” es verbo: termina con Z sonora.',tags:['common']},
 {en:'close',es:'cerrar',say:'klóuz',sound:'S/Z + diphthong',note:'Aquí “close” es verbo: la S final suena como Z.',tags:['common']},
 {en:'wrong',es:'equivocado/a',say:'rong',sound:'R + NG',tags:['common']},
 {en:'strong',es:'fuerte',say:'strong',sound:'R + NG + cluster',tags:['common']},
 {en:'bring',es:'traer',say:'bring',sound:'R + NG',tags:['common']},
 {en:'singer',es:'cantante',say:'síng-er',sound:'NG + R',tags:['people']},
 {en:'watch',es:'ver / reloj',say:'uóch',sound:'W + CH + final',tags:['common']},
 {en:'church',es:'iglesia',say:'chérch',sound:'CH + R',tags:['places']},
 {en:'machine',es:'máquina',say:'ma-shíin',sound:'SH + stress',tags:['work']},
 {en:'age',es:'edad',say:'éich',sound:'J + diphthong',tags:['people']},
 {en:'general',es:'general',say:'yé-ne-rol',sound:'J + R',tags:['common']},
 {en:'children',es:'niños',say:'chíld-ren',sound:'CH + R + final',tags:['people']},
 {en:'map',es:'mapa',say:'map',sound:'Final consonant',tags:['travel']},
 {en:'month',es:'mes',say:'manz',sound:'TH + final',tags:['time']},
 {en:'months',es:'meses',say:'manths',sound:'TH + plural -S + final',tags:['time']},
 {en:'cold',es:'frío',say:'kóuld',sound:'Diphthong + final',tags:['weather']},
 {en:'hot',es:'caliente',say:'jat',sound:'H + final',tags:['weather']},
 {en:'late',es:'tarde',say:'léit',sound:'Diphthong + final',tags:['time']},
 {en:'my',es:'mi',say:'mái',sound:'Diphthong',tags:['common']},
 {en:'price',es:'precio',say:'práis',sound:'Cluster + diphthong',tags:['shopping']},
 {en:'advice',es:'consejo',say:'ad-váis',sound:'S/Z + diphthong',tags:['common']},
 {en:'started',es:'empezó',say:'stár-tid',sound:'-ED + R',note:'Aquí -ed crea una sílaba extra: star-tid.',tags:['past']},
 {en:'watched',es:'vio / miró',say:'uócht',sound:'-ED + CH',note:'Aquí -ed suena como T.',tags:['past']},
 {en:'visited',es:'visitó',say:'ví-zi-tid',sound:'-ED + S/Z',note:'Aquí -ed crea una sílaba extra.',tags:['past']},
 {en:'needed',es:'necesitó',say:'ní-did',sound:'-ED',tags:['past']},
];

const bridgeCorrections:Word[]=[
 {en:'three',es:'tres',say:'s̱rí',sound:'TH',note:'En Colombia no usamos “z” como TH porque la z suele sonar como s. Aquí s̱ significa: s con la lengua un poquito entre los dientes.',tags:['numbers','common']},
 {en:'think',es:'pensar',say:'s̱ínk',sound:'TH',note:'s̱ = lengua entre los dientes; deja salir aire. No conviertas el sonido en T.',tags:['common']},
 {en:'thing',es:'cosa',say:'s̱ing',sound:'TH + NG',note:'Empieza con s̱ (lengua entre los dientes) y termina con NG nasal.',tags:['common']},
 {en:'thank',es:'agradecer',say:'s̱ank',sound:'TH',note:'s̱ = lengua entre los dientes; no es una S normal.',tags:['common']},
 {en:'this',es:'esto',say:'ḏís',sound:'TH voiced',note:'ḏ = lengua entre los dientes + voz. Siente vibración en la garganta.',tags:['common']},
 {en:'that',es:'eso',say:'ḏat',sound:'TH voiced',note:'ḏ = lengua entre los dientes + voz.',tags:['common']},
 {en:'they',es:'ellos',say:'ḏei',sound:'TH voiced',note:'Empieza con ḏ: lengua entre los dientes y voz.',tags:['common']},
 {en:'there',es:'allí',say:'ḏer',sound:'TH voiced',note:'Empieza con ḏ y mantén la R inglesa al final.',tags:['common']},
 {en:'these',es:'estos',say:'ḏíiz',sound:'TH voiced',note:'ḏ = lengua entre los dientes + voz.',tags:['common']},
 {en:'with',es:'con',say:'wiḏ',sound:'TH voiced + final',note:'Termina con ḏ. No añadas una vocal al final.',tags:['common']},
 {en:'weather',es:'clima',say:'uéḏer',sound:'TH voiced',note:'La parte central es ḏ: lengua entre los dientes y voz.',tags:['common']},
 {en:'three hundred',es:'trescientos',say:'s̱rí ján-dred',sound:'TH + R',tags:['numbers']},
 {en:'three things',es:'tres cosas',say:'s̱rí s̱ingz',sound:'TH + NG',tags:['common']},
 {en:'birthday',es:'cumpleaños',say:'bérs̱-dei',sound:'TH + R',tags:['people']},
 {en:'Thursday',es:'jueves',say:'s̱érz-dei',sound:'TH + R',tags:['calendar']},
 {en:'brother',es:'hermano',say:'brá-ḏer',sound:'TH voiced + R',tags:['family']},
 {en:'mother',es:'madre',say:'má-ḏer',sound:'TH voiced',tags:['family']},
 {en:'father',es:'padre',say:'fá-ḏer',sound:'TH voiced',tags:['family']},
 {en:'month',es:'mes',say:'mans̱',sound:'TH + final',tags:['time']},
 {en:'months',es:'meses',say:'mans̱s',sound:'TH + plural -S + final',tags:['time']},
 {en:'thanks',es:'gracias',say:'s̱anks',sound:'TH + final consonants',tags:['politeness']},
 {en:'thank you',es:'gracias',say:'s̱ank yu',sound:'TH',tags:['politeness']},
 {en:'weather forecast',es:'pronóstico del tiempo',say:'uéḏer fór-kast',sound:'TH voiced + R',tags:['travel']},

 {en:'breakfast',es:'desayuno',say:'brék-fast',sound:'Clusters + final',tags:['food']},
 {en:'lunch',es:'almuerzo',say:'lonch',sound:'CH + final',tags:['food']},
 {en:'dinner',es:'cena',say:'dí-ner',sound:'R + stress',tags:['food']},
 {en:'menu',es:'menú',say:'mé-niu',sound:'Diphthong + stress',tags:['food']},
 {en:'bill',es:'cuenta',say:'bil',sound:'Final consonant',tags:['food']},
 {en:'cash',es:'efectivo',say:'kash',sound:'SH + final',tags:['shopping']},
 {en:'change',es:'cambio',say:'chéinch',sound:'J + CH',tags:['shopping']},
 {en:'receipt',es:'recibo',say:'ri-síit',sound:'Vowels + final',tags:['shopping']},
 {en:'cheap',es:'barato',say:'chíip',sound:'CH + vowel',tags:['shopping']},
 {en:'expensive',es:'ik-spén-siv',say:'ik-spén-siv',sound:'V + stress',tags:['shopping']},
 {en:'closed',es:'cerrado',say:'klóuzd',sound:'Clusters + final Z',tags:['shopping']},
 {en:'corner',es:'esquina',say:'kór-ner',sound:'R',tags:['travel']},
 {en:'left',es:'izquierda',say:'left',sound:'Final consonant',tags:['travel']},
 {en:'straight',es:'derecho / recto',say:'stréit',sound:'Cluster + final',tags:['travel']},
 {en:'turn',es:'girar / vuelta',say:'tern',sound:'R',tags:['travel']},
 {en:'traffic',es:'tráfico',say:'trá-fik',sound:'Cluster + stress',tags:['travel']},
 {en:'ticket',es:'boleto / tiquete',say:'tí-ket',sound:'Stress + final',tags:['travel']},
 {en:'station',es:'estación',say:'stéi-shon',sound:'Cluster + SH',tags:['travel']},
 {en:'reservation',es:'reserva',say:'re-zer-véi-shon',sound:'R + Z + stress',tags:['hotel']},
 {en:'breakfast included',es:'desayuno incluido',say:'brék-fast in-klúu-did',sound:'Clusters + stress',tags:['hotel']},
 {en:'key',es:'llave',say:'kíi',sound:'Long vowel',tags:['hotel']},
 {en:'floor',es:'piso',say:'flór',sound:'R + cluster',tags:['hotel']},
 {en:'meeting',es:'reunión',say:'míi-ting',sound:'NG + stress',tags:['work']},
 {en:'deadline',es:'fecha límite',say:'déd-láin',sound:'Diphthong + final',tags:['work']},
 {en:'email',es:'correo electrónico',say:'íi-meil',sound:'Diphthongs + stress',tags:['work','digital']},
 {en:'message',es:'mensaje',say:'mé-sich',sound:'J + SH',tags:['digital']},
 {en:'call',es:'llamada',say:'kól',sound:'Vowel + final',tags:['digital']},
 {en:'charger',es:'cargador',say:'chár-yer',sound:'CH + J + R',tags:['digital']},
 {en:'battery',es:'batería',say:'bá-te-ri',sound:'Stress + R',tags:['digital']},
 {en:'password',es:'contraseña',say:'pás-uérd',sound:'W + R',tags:['digital']},
 {en:'meeting room',es:'sala de reuniones',say:'míi-ting rúm',sound:'NG + R',tags:['work']},
 {en:'homework',es:'tarea',say:'jóum-uérk',sound:'Diphthong + W + R',tags:['school']},
 {en:'exam',es:'examen',say:'ig-zám',sound:'Z + stress',tags:['school']},
 {en:'break',es:'descanso',say:'bréik',sound:'R + diphthong',tags:['school','work']},
 {en:'practice',es:'práctica / practicar',say:'prák-tis',sound:'Cluster + final S',tags:['school']},
 {en:'mistake',es:'error',say:'mis-téik',sound:'Diphthong',tags:['school']},
 {en:'remember',es:'recordar',say:'ri-mém-ber',sound:'R + stress',tags:['common']},
 {en:'forget',es:'olvidar',say:'fer-gét',sound:'R + stress',tags:['common']},
 {en:'understand',es:'entender',say:'an-der-stánd',sound:'Stress',note:'Aquí la ayuda se centra en el ritmo: “stand” lleva la fuerza principal.',tags:['common']},
 {en:'repeat',es:'repetir',say:'ri-píit',sound:'Long vowel + R',tags:['school']},
 {en:'explain',es:'explicar',say:'iks-pléin',sound:'Cluster + diphthong',tags:['school']},
 {en:'mean',es:'significar / querer decir',say:'míin',sound:'Long vowel',tags:['conversation']},
 {en:'maybe',es:'tal vez',say:'méi-bi',sound:'Diphthong',tags:['conversation']},
 {en:'later',es:'después / más tarde',say:'léi-ter',sound:'Diphthong + R',tags:['conversation']},
 {en:'really?',es:'¿en serio?',say:'rí-li?',sound:'R + vowels',tags:['conversation']},
 {en:'sounds good',es:'suena bien',say:'sáundz gud',sound:'S/Z + NG',tags:['conversation']},
 {en:'no worries',es:'no hay problema',say:'nóu uór-riz',sound:'W + R + Z',tags:['conversation']},
 {en:'of course',es:'claro / por supuesto',say:'of kórs',sound:'R + final',tags:['conversation']},
 {en:'I forgot',es:'se me olvidó',say:'Ai fer-gót',sound:'R + stress',tags:['conversation']},
 {en:'I know',es:'lo sé',say:'Ai nóu',sound:'Diphthong',tags:['conversation']},
 {en:'I don’t know',es:'no sé',say:'Ai dóunt nóu',sound:'Diphthong + final',tags:['conversation']},
 {en:'give me a second',es:'dame un segundo',say:'giv mi a sé-kend',sound:'V + stress',tags:['conversation']},
 {en:'wait a second',es:'espera un segundo',say:'uéit a sé-kend',sound:'W + diphthong',tags:['conversation']},
 {en:'on my way',es:'voy para allá / voy en camino',say:'on mai uéi',sound:'W + diphthong',tags:['conversation']},
 {en:'I’m running late',es:'voy tarde / voy retrasado/a',say:'Aim rá-ning léit',sound:'R + NG + diphthong',tags:['time']},
];

const groups=['TH','V/W','H','J','CH','SH','R','S/Z','NG','Vowels','Diphthongs','-ED','-S','Final','Stress','Clusters'];
const wordLibrary=Array.from(new Map([...words,...extraWords,...bridgeCorrections].map((w)=>[w.en.toLowerCase(),w])).values());


const extraPhrases:Phrase[]=[
 {en:'Do you take cards?',es:'¿Reciben tarjetas?',say:'Du yu téik kárds?',tip:'Mantén “do you” fluido y termina “cards” con Z.',scene:'Shopping',focus:'R + final Z'},
 {en:'Do you have Wi-Fi?',es:'¿Tienen Wi‑Fi?',say:'Du yu jav uái-fái?',tip:'H suave en “have”; “Wi-Fi” empieza con W.',scene:'Digital',focus:'H + W'},
 {en:'What’s the Wi-Fi password?',es:'¿Cuál es la contraseña del Wi‑Fi?',say:'Uats dha uái-fái pás-uérd?',tip:'No ruedes la R de “password”.',scene:'Digital',focus:'W + R + TH'},
 {en:'My phone is dead.',es:'Mi celular se quedó sin batería.',say:'Mai fóun iz ded.',tip:'“Phone” usa una O larga; termina “dead” claramente.',scene:'Digital',focus:'Diphthong + final D'},
 {en:'I need a charger.',es:'Necesito un cargador.',say:'Ai níid a chár-yer.',tip:'La J inglesa de “charger” es suave: no es la J española fuerte.',scene:'Digital',focus:'CH + J + R'},
 {en:'Can you text me?',es:'¿Puedes escribirme?',say:'Kan yu tekst mi?',tip:'Mantén el grupo final “kst” sin añadir una vocal.',scene:'Digital',focus:'Cluster + final'},
 {en:'Could you write it down?',es:'¿Podrías escribirlo?',say:'Kud yu ráit it dáun?',tip:'Escucha el ritmo: “write” y “down” llevan más fuerza.',scene:'Class',focus:'R + diphthong'},
 {en:'How do you spell it?',es:'¿Cómo se escribe?',say:'Jau du yu spel it?',tip:'La H de “how” es aire suave; no raspa como la J española.',scene:'Class',focus:'H + rhythm'},
 {en:'What does that mean?',es:'¿Qué significa eso?',say:'Uat daz dhat míin?',tip:'La TH de “that” es sonora: nota vibración.',scene:'Class',focus:'TH + NG'},
 {en:'I didn’t hear you.',es:'No te escuché.',say:'Ai díd-nt jír yu.',tip:'La H de “hear” es aire suave; no ruedes la R.',scene:'Conversation',focus:'H + R'},
 {en:'Could you say it more slowly?',es:'¿Podrías decirlo más despacio?',say:'Kud yu séi it mor slóu-li?',tip:'Deja “could you” conectado y marca “slowly”.',scene:'Conversation',focus:'R + diphthong'},
 {en:'I’m not sure.',es:'No estoy seguro/a.',say:'Aim not shúr.',tip:'Haz “not” y “sure” claros, pero no acentúes cada palabra.',scene:'Conversation',focus:'Vowels + rhythm'},
 {en:'Is this seat free?',es:'¿Está libre este asiento?',say:'Iz dhís síit fríi?',tip:'Compara “seat” y “sit”: la vocal larga importa.',scene:'Travel',focus:'TH + vowel contrast'},
 {en:'Can I sit here?',es:'¿Me puedo sentar aquí?',say:'Kan ai sit jír?',tip:'“Sit” tiene vocal corta; H de “here” es aire suave.',scene:'Travel',focus:'H + vowel contrast'},
 {en:'What time do you close?',es:'¿A qué hora cierran?',say:'Uat táim du yu klóuz?',tip:'Aquí “close” termina con una Z sonora.',scene:'Shopping',focus:'W + Z + diphthong'},
 {en:'Do you have a smaller size?',es:'¿Tienen una talla más pequeña?',say:'Du yu jav a smó-ler sáiz?',tip:'No ruedes la R de “smaller”.',scene:'Shopping',focus:'H + R + diphthong'},
 {en:'I have an appointment.',es:'Tengo una cita.',say:'Ai jav an a-póint-ment.',tip:'H suave en “have”; mantén “point” claro.',scene:'Health',focus:'H + diphthong'},
 {en:'I don’t feel well.',es:'No me siento bien.',say:'Ai dóunt fíil uél.',tip:'W comienza redondeando los labios; no empieces con B/V.',scene:'Health',focus:'W + final'},
 {en:'I need a doctor.',es:'Necesito un médico.',say:'Ai níid a dák-ter.',tip:'R suave al final de “doctor”.',scene:'Health',focus:'R + stress'},
 {en:'Where is the clinic?',es:'¿Dónde está la clínica?',say:'Uér iz dhuh klí-nik?',tip:'R inglesa en “where”; “the” suele ser débil aquí.',scene:'Health',focus:'R + weak form'},
 {en:'I need some water.',es:'Necesito agua.',say:'Ai níid sam wó-der.',tip:'Redondea los labios para W; en muchos acentos americanos la T central es rápida.',scene:'Everyday',focus:'W + T'},
 {en:'Can I get a coffee to go?',es:'¿Me da un café para llevar?',say:'Kan ai get a kó-fi tuh góu?',tip:'“To” suele reducirse a “tuh” en habla natural.',scene:'Restaurant',focus:'Weak form + diphthong'},
 {en:'Can I have this to go?',es:'¿Me puede dar esto para llevar?',say:'Kan ai jav dhís tuh góu?',tip:'TH sonora en “this” y “to” muy corto.',scene:'Restaurant',focus:'TH + weak form'},
 {en:'Could I get the bill, please?',es:'¿Me trae la cuenta, por favor?',say:'Kud ai get dhuh bil, plíis?',tip:'La palabra “the” suele ser débil antes de “bill”.',scene:'Restaurant',focus:'TH + final Z'},
 {en:'I’m just looking.',es:'Solo estoy mirando.',say:'Aim yast lú-king.',tip:'La J inglesa de “just” es el sonido de “j” en “job”, no la J española.',scene:'Shopping',focus:'J + NG'},
 {en:'I’m looking for this.',es:'Estoy buscando esto.',say:'Aim lú-king for dhís.',tip:'Voz en “this”; mantén “for” ligero.',scene:'Shopping',focus:'TH + weak form'},
 {en:'Is this available?',es:'¿Está disponible?',say:'Iz dhís a-véi-la-bol?',tip:'TH sonora en “this”; no acentúes todas las sílabas.',scene:'Shopping',focus:'TH + stress'},
 {en:'Can you help me with this form?',es:'¿Puedes ayudarme con este formulario?',say:'Kan yu jelp mi widh dhís form?',tip:'Tres puntos útiles: H, W/TH y la R inglesa de “form”.',scene:'Work',focus:'H + TH + R'},
 {en:'I have to go now.',es:'Tengo que irme ahora.',say:'Ai jav tuh góu náu.',tip:'“To” se hace muy corto: “tuh”.',scene:'Work',focus:'Weak form + diphthong'},
 {en:'I’ll send it today.',es:'Lo enviaré hoy.',say:'Ail send it tu-déi.',tip:'Termina “send” con D clara.',scene:'Work',focus:'Final consonant + stress'},
 {en:'Can we meet tomorrow?',es:'¿Podemos vernos mañana?',say:'Kan wi míit tu-mó-róu?',tip:'W de “we”; deja “tomorrow” fluir.',scene:'Work',focus:'W + R'},
]

const expansionPhrases:Phrase[]=[
 {en:'Good morning. How are you?',es:'Buenos días. ¿Cómo estás?',say:'Gud mór-ning. Jáu ar yu?',tip:'En la primera parte marca “morning”; después deja “how are you?” fluir.',scene:'Greeting',focus:'NG + rhythm'},
 {en:'Nice to see you.',es:'Qué bueno verte.',say:'Náis tu síi yu.',tip:'Mantén “nice” claro y deja “to” ligero.',scene:'Greeting',focus:'Diphthong + rhythm'},
 {en:'See you later.',es:'Nos vemos luego.',say:'Sí yu léi-ter.',tip:'No ruedes la R en “later”.',scene:'Goodbye',focus:'R + diphthong'},
 {en:'Have a great day.',es:'Que tengas un buen día.',say:'Jav a gréit déi.',tip:'H suave en “have”; la fuerza cae en “great” y “day”.',scene:'Politeness',focus:'H + diphthongs'},
 {en:'What do you mean?',es:'¿Qué quieres decir?',say:'Uat du yu míin?',tip:'“Mean” lleva la fuerza principal y termina con una vocal larga.',scene:'Conversation',focus:'W + long vowel'},
 {en:'I’m just looking.',es:'Solo estoy mirando.',say:'Aim yast lú-king.',tip:'J inglesa al principio de “just”; NG al final de “looking”.',scene:'Shopping',focus:'J + NG'},
 {en:'Do you have another color?',es:'¿Tienen otro color?',say:'Du yu jav an-á-dher ká-ler?',tip:'La TH sonora de “another” usa ḏ: lengua entre los dientes y voz.',scene:'Shopping',focus:'TH + R'},
 {en:'Can I see another one?',es:'¿Puedo ver otro?',say:'Kan ai síi an-á-dher uan?',tip:'Mantén “can I” unido y usa ḏ en “another”.',scene:'Shopping',focus:'TH + W'},
 {en:'Do you accept cash?',es:'¿Aceptan efectivo?',say:'Du yu ak-sépt kash?',tip:'Termina “accept” con T y deja “cash” corto.',scene:'Shopping',focus:'Final + SH'},
 {en:'I need some change.',es:'Necesito cambio.',say:'Ai níid sam chéinch.',tip:'CH de “change” empieza con un pequeño cierre y suelta aire.',scene:'Shopping',focus:'CH + final'},
 {en:'Can I have the menu?',es:'¿Me puede dar el menú?',say:'Kan ai jav ḏa mé-niu?',tip:'ḏa = la palabra “the” con TH sonora.',scene:'Restaurant',focus:'TH + stress'},
 {en:'Is this spicy?',es:'¿Esto pica?',say:'Iz ḏís spái-si?',tip:'ḏ en “this”; la vocal de “spicy” termina en un deslizamiento.',scene:'Restaurant',focus:'TH + diphthong'},
 {en:'No onions, please.',es:'Sin cebolla, por favor.',say:'Nóu án-yons, plíiz.',tip:'“Please” termina con Z sonora; no añadas una vocal después.',scene:'Restaurant',focus:'Z + final'},
 {en:'Can I get it without onions?',es:'¿Me lo puede dar sin cebolla?',say:'Kan ai get it wiḏ-áut án-yons?',tip:'Termina “without” con ḏ y marca “out”.',scene:'Restaurant',focus:'TH + diphthong'},
 {en:'I’m allergic to...',es:'Soy alérgico/a a...',say:'Aim a-lér-yik tu...',tip:'Usa “to” de forma ligera en conversación.',scene:'Health',focus:'R + weak form'},
 {en:'I feel sick.',es:'Me siento mal.',say:'Ai fíil sik.',tip:'La vocal de “feel” es larga; “sick” es corta.',scene:'Health',focus:'Vowel contrast'},
 {en:'I need a pharmacy.',es:'Necesito una farmacia.',say:'Ai níid a fár-ma-si.',tip:'R inglesa al inicio de “pharmacy” no se rueda.',scene:'Health',focus:'R'},
 {en:'Where is the nearest pharmacy?',es:'¿Dónde está la farmacia más cercana?',say:'Uér iz ḏa ní-rést fár-ma-si?',tip:'ḏa = “the” con TH sonora; R inglesa en “where” y “nearest”.',scene:'Health',focus:'TH + R'},
 {en:'How long does it take?',es:'¿Cuánto tiempo tarda?',say:'Jáu long daz it téik?',tip:'NG al final de “long”; “does” es corto y débil.',scene:'Travel',focus:'NG + rhythm'},
 {en:'Is it far?',es:'¿Está lejos?',say:'Iz it far?',tip:'No conviertas la R final en una vibración española.',scene:'Travel',focus:'R'},
 {en:'I’m lost.',es:'Estoy perdido/a.',say:'Aim lost.',tip:'Mantén el grupo final de “lost” sin añadir una vocal.',scene:'Travel',focus:'Final consonants'},
 {en:'Can you show me on the map?',es:'¿Me puedes mostrar en el mapa?',say:'Kan yu shóu mi on ḏa map?',tip:'SH en “show” y ḏa para “the”.',scene:'Travel',focus:'SH + TH'},
 {en:'I have a reservation.',es:'Tengo una reserva.',say:'Ai jav a re-ser-véi-shon.',tip:'H suave en “have” y R inglesa en “reservation”.',scene:'Hotel',focus:'H + R'},
 {en:'I’m checking in.',es:'Estoy haciendo el check-in.',say:'Aim ché-king in.',tip:'CH al inicio y NG al final de “checking”.',scene:'Hotel',focus:'CH + NG'},
 {en:'What time is checkout?',es:'¿A qué hora es el check-out?',say:'Uat táim iz ché-kaut?',tip:'W en “what” y la combinación “check-out” en dos golpes.',scene:'Hotel',focus:'W + CH'},
 {en:'Is Wi-Fi included?',es:'¿El Wi‑Fi está incluido?',say:'Iz uái-fái in-klúu-did?',tip:'W en “Wi-Fi”; no pronuncies cada palabra con la misma fuerza.',scene:'Hotel',focus:'W + rhythm'},
 {en:'Can I charge my phone?',es:'¿Puedo cargar mi celular?',say:'Kan ai chárch mai fóun?',tip:'CH/J del verbo “charge” y O larga en “phone”.',scene:'Digital',focus:'CH + diphthong'},
 {en:'Can you send me the address?',es:'¿Puedes enviarme la dirección?',say:'Kan yu send mi ḏi a-drés?',tip:'Aquí “the” puede reducirse antes de vocal; mantén el ritmo.',scene:'Digital',focus:'TH + rhythm'},
 {en:'I’m in a meeting.',es:'Estoy en una reunión.',say:'Aim in a míi-ting.',tip:'NG final en “meeting” y vocal larga en “meeting”.',scene:'Work',focus:'NG + long vowel'},
 {en:'I’ll call you back.',es:'Te devolveré la llamada.',say:'Ail kól yu bak.',tip:'“I’ll” es una sola unidad; la R no aparece aquí.',scene:'Work',focus:'Diphthong + rhythm'},
 {en:'Can we meet tomorrow?',es:'¿Podemos reunirnos mañana?',say:'Kan wi míit tu-mó-róu?',tip:'W en “we” y R inglesa en “tomorrow”.',scene:'Work',focus:'W + R'},
 {en:'I have class at six.',es:'Tengo clase a las seis.',say:'Ai jav klas at siks.',tip:'H suave en “have”; conserva los sonidos finales.',scene:'Class',focus:'H + final'},
 {en:'How do you say ___ in English?',es:'¿Cómo se dice ___ en inglés?',say:'Jáu du yu séi ___ in Íng-glish?',tip:'Úsala cuando no sepas una palabra: es una frase para seguir aprendiendo.',scene:'Class',focus:'H + rhythm'},
 {en:'How do you spell that?',es:'¿Cómo se escribe eso?',say:'Jáu du yu spel ḏat?',tip:'ḏat = “that” con TH sonora.',scene:'Class',focus:'TH + H'},
 {en:'Could you repeat that?',es:'¿Podrías repetir eso?',say:'Kud yu ri-píit ḏat?',tip:'Mantén “could you” conectado; ḏat usa TH sonora.',scene:'Class',focus:'TH + linking'},
 {en:'Give me a second.',es:'Dame un segundo.',say:'Giv mi a sé-kend.',tip:'V en “give” se hace con dientes y labio, no con B.',scene:'Conversation',focus:'V'},
 {en:'Wait a second.',es:'Espera un segundo.',say:'Uéit a sé-kend.',tip:'W con labios redondos; una sola sílaba fuerte en “wait”.',scene:'Conversation',focus:'W'},
 {en:'I’m on my way.',es:'Voy en camino.',say:'Aim on mai uéi.',tip:'W en “way”; termina “I’m” y “on” con claridad.',scene:'Conversation',focus:'W + diphthong'},
 {en:'I’m running late.',es:'Voy tarde.',say:'Aim rá-ning léit.',tip:'NG en “running” y R inglesa en el comienzo.',scene:'Conversation',focus:'R + NG'},
];

const phraseCorrections:Phrase[]=[
 {en:'I would like a coffee, please.',es:'Quisiera un café, por favor.',say:'Ai wud laik a kó-fi, plíiz.',tip:'“Would” empieza con W redondeada. “Please” termina con Z sonora.',scene:'Ordering',focus:'W + Z'},
 {en:'Could you help me?',es:'¿Podrías ayudarme?',say:'Kud yu jelp mi?',tip:'“Could you” puede fluir unido; H en “help” es aire suave.',scene:'Asking for help',focus:'H + linking'},
 {en:'Where is the bathroom?',es:'¿Dónde está el baño?',say:'Uér iz ḏa báth-rum?',tip:'R inglesa en “where”; ḏa es “the” con TH sonora.',scene:'Travel',focus:'R + TH'},
 {en:'Can I have the bill, please?',es:'¿Me trae la cuenta, por favor?',say:'Kan ai jav ḏa bil, plíiz?',tip:'ḏa = “the”; please termina con Z sonora.',scene:'Restaurant',focus:'TH + Z'},
 {en:'I need some water.',es:'Necesito agua.',say:'Ai níid sam wó-der.',tip:'W con labios redondos. En muchos acentos americanos, la T central es muy rápida.',scene:'Everyday',focus:'W + T'},
 {en:'How much is this?',es:'¿Cuánto cuesta esto?',say:'Jáu mach iz ḏís?',tip:'ḏís = “this” con lengua entre dientes y voz.',scene:'Shopping',focus:'TH + OW'},
 {en:'That is too expensive.',es:'Eso es demasiado caro.',say:'Ḏat iz túu ik-spén-siv.',tip:'Empieza “that” con ḏ; conserva el ritmo de la frase.',scene:'Shopping',focus:'TH + stress'},
 {en:'The food is very good.',es:'La comida está muy buena.',say:'Ḏa fúud iz vé-ri gud.',tip:'ḏa = “the” con TH sonora; V en “very”.',scene:'Restaurant',focus:'TH + V'},
 {en:'Thank you very much.',es:'Muchas gracias.',say:'S̱ank yu véri mach.',tip:'S̱ = lengua entre dientes. No usamos z para este TH en español colombiano.',scene:'Politeness',focus:'TH + V'},
 {en:'This is my first time here.',es:'Es mi primera vez aquí.',say:'Ḏís iz mai férst taim jír.',tip:'ḏís = TH sonora; R inglesa sin rodarla.',scene:'Travel',focus:'TH + R'},
 {en:'Can you say that again?',es:'¿Puede decir eso otra vez?',say:'Kan yu sei ḏat a-gén?',tip:'Deja “can you” unido y usa ḏ en “that”.',scene:'Conversation',focus:'TH + rhythm'},
 {en:'What does that mean?',es:'¿Qué significa eso?',say:'Uat daz ḏat míin?',tip:'ḏat = TH sonora y “mean” termina con vocal larga.',scene:'Class',focus:'TH + long vowel'},
 {en:'Can you speak more slowly?',es:'¿Puede hablar más despacio?',say:'Kan yu spík mor slóu-li?',tip:'Haz más fuertes “speak” y “slowly”; las palabras pequeñas son ligeras.',scene:'Class',focus:'Rhythm'},
 {en:'Can I get a coffee to go?',es:'¿Me da un café para llevar?',say:'Kan ai get a kó-fi tuh góu?',tip:'En habla natural “to” suele reducirse a “tuh”.',scene:'Restaurant',focus:'Weak form + diphthong'},
 {en:'Can you help me?',es:'¿Puedes ayudarme?',say:'Kan yu jelp mi?',tip:'“Can you” fluido; H en “help” es aire suave.',scene:'Everyday',focus:'H + rhythm'},
 {en:'Please speak more slowly.',es:'Por favor, hable más despacio.',say:'Plíiz spík mor slóu-li.',tip:'Marca “please”, “speak” y “slowly”; no acentúes cada palabra.',scene:'Conversation',focus:'Z + rhythm'},
 {en:'I am learning English.',es:'Estoy aprendiendo inglés.',say:'Ai am lér-ning Íng-glish.',tip:'NG en “learning” y SH al final de “English”.',scene:'Class',focus:'R + NG + SH'},
 {en:'Where are you from?',es:'¿De dónde eres?',say:'Uér ar yu from?',tip:'R inglesa en “where”; no la ruedes.',scene:'Conversation',focus:'R'},
 {en:'What time does it open?',es:'¿A qué hora abre?',say:'Uat táim daz it óu-pen?',tip:'Redondea los labios para W; “does” es corto y débil.',scene:'Travel',focus:'W + rhythm'},
 {en:'I don’t understand.',es:'No entiendo.',say:'Ai dóunt an-der-stánd.',tip:'Haz “don’t” y “stand” claros; no intentes dar la misma fuerza a todo.',scene:'Conversation',focus:'Stress'},
 {en:'I am not sure.',es:'No estoy seguro/a.',say:'Ai am not shúr.',tip:'No ruedes la R y deja “not”/“sure” como palabras importantes.',scene:'Conversation',focus:'R + stress'},
 {en:'Nice to meet you.',es:'Mucho gusto.',say:'Náis tu míit yu.',tip:'“Nice” y “meet” son las palabras importantes; “to” es más ligera.',scene:'Greeting',focus:'Vowels + rhythm'},
 {en:'What is your name?',es:'¿Cómo te llamas?',say:'Uat iz yor néim?',tip:'Mantén “name” largo y claro.',scene:'Greeting',focus:'W + diphthong'},
 {en:'See you tomorrow.',es:'Nos vemos mañana.',say:'Sí yu tu-mó-róu.',tip:'El ritmo importa más que forzar cada sonido por separado.',scene:'Goodbye',focus:'Rhythm + R'},
];

const phraseLibrary=Array.from(new Map([...phrases,...additionalPhrases,...extraPhrases,...expansionPhrases,...phraseCorrections].map((p)=>[p.en.toLowerCase(),p])).values());

const scenarios=[
 {id:'cafe',title:'En un café',icon:'☕',desc:'Pide algo, pregunta el precio y paga.',phrases:phraseLibrary.filter(p=>['Ordering','Restaurant'].includes(p.scene))},
 {id:'travel',title:'Moverte por ahí',icon:'🚌',desc:'Pregunta dónde está algo y cómo llegar.',phrases:phraseLibrary.filter(p=>['Getting around','Travel','Hotel'].includes(p.scene))},
 {id:'conversation',title:'Conversación',icon:'◌',desc:'Las frases pequeñas que usas todos los días.',phrases:phraseLibrary.filter(p=>['Conversation','Greeting someone','Greeting','Goodbye','Politeness','Everyday'].includes(p.scene))},
 {id:'work',title:'Trabajo y clase',icon:'✦',desc:'Inglés práctico para estudiar, trabajar y preguntar.',phrases:phraseLibrary.filter(p=>['Work','Class'].includes(p.scene))},
 {id:'health',title:'Salud',icon:'✚',desc:'Frases sencillas para farmacia y salud.',phrases:phraseLibrary.filter(p=>p.scene==='Health')},
 {id:'digital',title:'Móvil',icon:'◎',desc:'Mensajes, llamadas e internet del día a día.',phrases:phraseLibrary.filter(p=>p.scene==='Digital')},
];

const dailyLesson:Phrase[]=[
 'How are you?','I would like a coffee, please.','Can you help me?','How much is this?','Can I pay by card?','Where is the bathroom?','I don’t understand.','Can you speak more slowly?'
].map(en=>phraseLibrary.find(p=>p.en===en)).filter((p):p is Phrase=>Boolean(p));

const storageKey='melissa_v07';
type State={done:number; learned:string[]; favorites:string[]; ratings:Record<string,number>; feedback:string[]; firstRun:boolean; name:string; lastActivity?:string; speed:number; focus:string; practiceByDay:Record<string,number>; points:number};
const initial:State={done:0, learned:[], favorites:[], ratings:{}, feedback:[], firstRun:true, name:'', lastActivity:'', speed:.86, focus:'TH', practiceByDay:{}, points:0};
function dayKey(d=new Date()){const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function previousDayKey(){const d=new Date();d.setDate(d.getDate()-1);return dayKey(d)}
function todayPractice(state:State){return state.practiceByDay?.[dayKey()]||0}
function currentStreak(state:State){const log=state.practiceByDay||{};const today=dayKey();if(!log[today]) return 0;let d=new Date();let count=0;while(log[dayKey(d)]){count+=1;d.setDate(d.getDate()-1)}return count}
function badgesFor(state:State){const today=todayPractice(state);const helpful=Object.values(state.ratings).filter(n=>n>=3).length;return [
 {id:'first',emoji:'🌱',title:'Primer paso',ok:state.done>=1,desc:'Completaste tu primera práctica.'},
 {id:'daily3',emoji:'⚡',title:'Buen ritmo',ok:today>=3,desc:'Hiciste 3 prácticas hoy.'},
 {id:'ten',emoji:'🎯',title:'Diez prácticas',ok:state.done>=10,desc:'Llegaste a 10 prácticas.'},
 {id:'explorer',emoji:'🧭',title:'Exploradora',ok:state.learned.length>=20,desc:'Probaste 20 palabras o frases.'},
 {id:'bridge',emoji:'💡',title:'Puente útil',ok:helpful>=5,desc:'Encontraste 5 ayudas que sí te sirvieron.'},
];}

function loadState():State{try{return {...initial,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{return initial}}
function saveState(s:State){localStorage.setItem(storageKey,JSON.stringify(s))}
function lookup(q:string){return wordLibrary.find(w=>w.en.toLowerCase()===q.trim().toLowerCase())}
function bridgePhrase(value:string){
 const tokens=value.match(/[A-Za-zÀ-ÿ’'-]+|[^A-Za-zÀ-ÿ’'-]+/g)||[];
 const wordsOnly=wordLibrary.filter(w=>w.en.includes(' ')).sort((a,b)=>b.en.split(' ').length-a.en.split(' ').length);
 let i=0,out='';
 while(i<tokens.length){
   if(/^[A-Za-zÀ-ÿ’'-]+$/.test(tokens[i])){
     let matched:Word|undefined;
     for(const w of wordsOnly){
       const parts=w.en.split(' ');
       const candidate=tokens.slice(i,i+parts.length).filter(Boolean).join(' ').toLowerCase();
       if(candidate===w.en.toLowerCase()){matched=w;break}
     }
     if(matched){
       out+=matched.say;
       i+=matched.en.split(' ').length;
       continue;
     }
   }
   out+=lookup(tokens[i])?.say||tokens[i];
   i++;
 }
 return out;
}


const soundGuides:Record<string,{title:string;hint:string;examples:string}>={
 TH:{title:'TH: lengua entre los dientes',hint:'Para TH, asoma suavemente la punta de la lengua entre los dientes. En esta app usamos s̱ para el TH sin voz y ḏ para el TH con voz; no usamos z como TH.',examples:'think · three · this'},
 'V/W':{title:'V y W: no son lo mismo',hint:'V: dientes de arriba con labio de abajo. W: labios redondos y un deslizamiento de “u”.',examples:'very · water · would'},
 H:{title:'H inglesa: aire, no roce',hint:'Suelta aire con suavidad. La H inglesa no debe raspar la garganta como la J española.',examples:'help · house · here'},
 J:{title:'J inglesa: un sonido nuevo',hint:'Empieza con una pequeña D y pasa a un sonido parecido a “y”. No uses la J fuerte de “jamón”.',examples:'job · just · juice'},
 CH:{title:'CH: un golpe limpio',hint:'Haz un pequeño cierre y suelta: ch. No lo alargues demasiado.',examples:'chair · chicken · teacher'},
 SH:{title:'SH: aire silencioso',hint:'Redondea un poco los labios y deja salir aire: sh. No lo conviertas en CH.',examples:'she · shop · fish'},
 R:{title:'R inglesa: sin rodarla',hint:'Lleva la lengua hacia atrás sin tocar el paladar. La R inglesa no vibra.',examples:'right · work · here'},
 'S/Z':{title:'S y Z: escucha la vibración',hint:'S no vibra; Z sí. En plural y al final de muchas palabras, esa diferencia importa.',examples:'rice · busy · please'},
 NG:{title:'NG: termina con la nariz',hint:'En palabras como sing o long, la parte final es nasal. No añadas una G dura después.',examples:'sing · long · morning'},
 Vowels:{title:'Vocales: escucha la diferencia',hint:'No todas las vocales inglesas coinciden con las cinco vocales españolas. Escucha, compara y repite.',examples:'ship · sheep · full'},
 Diphthongs:{title:'Vocales que se mueven',hint:'Algunas vocales cambian de posición dentro de una sola sílaba: no las cortes en dos.',examples:'day · time · go'},
 '-ED':{title:'-ed no siempre suena igual',hint:'Puede sonar /t/, /d/ o formar una sílaba extra. Escucha qué pasa en cada palabra.',examples:'worked · played · wanted'},
 '-S':{title:'Final -s: tres posibilidades',hint:'El final puede sonar como S, Z o una sílaba extra en palabras como buses.',examples:'cats · dogs · buses'},
 Final:{title:'Termina la palabra',hint:'Evita añadir una vocal al final. “Help” no termina en “hel-pa”; “next” conserva su grupo final.',examples:'helped · next · world'},
 Stress:{title:'Ritmo y acento',hint:'En inglés no todas las palabras tienen la misma fuerza. Deja pequeñas palabras más ligeras.',examples:'about · support · What time?'},
 Clusters:{title:'Consonantes juntas',hint:'El inglés puede juntar consonantes que el español suele separar. Ve despacio y conserva cada sonido importante.',examples:'street · school · next'}
};
const focusChoices=[['TH','TH'],['R','R inglesa'],['V/W','V y W'],['Vowels','Vocales'],['Final','Finales']];

function App(){
 const [teacher,setTeacher]=useState(false);
 const [tab,setTab]=useState('home');
 const [state,setState]=useState<State>(loadState());
 const [online,setOnline]=useState(navigator.onLine);
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
 const [toast,setToast]=useState('');
 useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);addEventListener('online',on);addEventListener('offline',off);return()=>{removeEventListener('online',on);removeEventListener('offline',off)}},[]);
 useEffect(()=>saveState(state),[state]);
 useEffect(()=>{
   if(!('speechSynthesis' in window)) return;
   const load=()=>setVoices(window.speechSynthesis.getVoices());
   load(); window.speechSynthesis.addEventListener('voiceschanged',load);
   return()=>window.speechSynthesis.removeEventListener('voiceschanged',load);
 },[]);
 const complete=(id:string)=>{
   const today=dayKey();
   const nextToday=(state.practiceByDay?.[today]||0)+1;
   const pointGain=nextToday===3?10:(nextToday<=2?5:0);
   setState(s=>{const log={...(s.practiceByDay||{}),[today]:(s.practiceByDay?.[today]||0)+1};return {...s,done:s.done+1,learned:Array.from(new Set([...s.learned,id])),lastActivity:id,practiceByDay:log,points:s.points+pointGain}});
   setToast(nextToday===3?'🎉 ¡Meta de hoy! +10 puntos':nextToday<=2?'✨ +5 puntos':'✅ Meta diaria ya cumplida');
   window.setTimeout(()=>setToast(''),2200);
 };
 const rate=(id:string,n:number)=>setState(s=>({...s,ratings:{...s.ratings,[id]:n}}));
 const feedback=(value:string)=>setState(s=>({...s,feedback:[...s.feedback,value]}));
 const toggleFavorite=(id:string)=>setState(s=>({...s,favorites:s.favorites.includes(id)?s.favorites.filter(x=>x!==id):[...s.favorites,id]}));
 const setSpeed=(speed:number)=>setState(s=>({...s,speed}));
 const pickVoice=(kind:'coach'|'model')=>{
   const score=(v:SpeechSynthesisVoice)=>{
     const n=v.name.toLowerCase(), l=v.lang.toLowerCase(); let x=v.localService?4:0;
     const femaleHints=['female','woman','samantha','jenny','aria','ava','zira','carmen','maria','sofia','paulina','camila','luciana','helena','monica','sabina','dalia','google español','google us english','microsoft sabina'];
     if(femaleHints.some(k=>n.includes(k))) x+=12;
     if(kind==='coach'){
       if(l==='es-co') x+=22;
       else if(l==='es-419') x+=20;
       else if(/^es-(mx|us|ve|ec|pe|cl|ar)/.test(l)) x+=14;
       else if(l.startsWith('es')) x+=8;
     }else{
       if(l==='en-us') x+=16;
       else if(/^en-(ca|gb)/.test(l)) x+=11;
       else if(l.startsWith('en')) x+=7;
     }
     return x;
   };
   return voices.slice().sort((a,b)=>score(b)-score(a))[0];
 };
 const speak=(value:string,kind:'model'|'coach'='model')=>{
   if(!('speechSynthesis' in window)) return;
   window.speechSynthesis.cancel();
   const u=new SpeechSynthesisUtterance(value);
   const chosen=pickVoice(kind);
   if(chosen) u.voice=chosen;
   u.lang=kind==='coach'?(chosen?.lang||'es-CO'):(chosen?.lang||'en-US');
   u.rate=kind==='coach'?Math.max(.78,state.speed*.98):state.speed;
   u.pitch=kind==='coach'?1.1:1.0;
   window.speechSynthesis.speak(u);
 };
 const speakCoach=(value:string)=>speak(value,'coach');
 const coachVoice=pickVoice('coach');
 const modelVoice=pickVoice('model');
 if(state.firstRun)return <Welcome name={state.name} setName={name=>setState(s=>({...s,name}))} focus={state.focus} setFocus={focus=>setState(s=>({...s,focus}))} start={()=>setState(s=>({...s,firstRun:false}))} speakCoach={speakCoach}/>;
 if(teacher)return <Teacher setTeacher={setTeacher} state={state} wordCount={wordLibrary.length} phraseCount={phraseLibrary.length}/>;
 return <div className="shell"><header><div className="brand" onClick={()=>setTab('home')}><img src="/icons/melissa-512.png" className="brandIcon" alt=""/><span>Melissa</span></div><div className="top"><span className={online?'status online':'status'}><b></b>{online?'Lista para practicar':'Sin conexión'}</span></div></header>
 <main>
  {tab==='home'&&<Home state={state} setTab={setTab} speak={speak} speakCoach={speakCoach} complete={complete}/>} 
  {tab==='learn'&&<Learn speak={speak} speakCoach={speakCoach} complete={complete} rate={rate} state={state} toggleFavorite={toggleFavorite}/>} 
  {tab==='bridge'&&<BridgeLab speak={speak} speakCoach={speakCoach} complete={complete} rate={rate} state={state} toggleFavorite={toggleFavorite}/>} 
  {tab==='phrases'&&<PhraseCoach speak={speak} speakCoach={speakCoach} complete={complete} rate={rate} feedback={feedback} state={state} toggleFavorite={toggleFavorite}/>} 
  {tab==='words'&&<Words speak={speak} speakCoach={speakCoach} feedback={feedback} state={state} toggleFavorite={toggleFavorite}/>} 
  {tab==='progress'&&<Progress state={state} setTab={setTab} setSpeed={setSpeed} coachVoice={coachVoice} modelVoice={modelVoice} feedback={feedback} setTeacher={setTeacher} reset={()=>setState(initial)}/>}
  {tab==='review'&&<Review state={state} setTab={setTab} speak={speak} speakCoach={speakCoach} complete={complete} rate={rate} toggleFavorite={toggleFavorite}/>} 
 </main>
 {toast&&<div className="toast" aria-live="polite">{toast}</div>}
 <nav>{[['home','⌂','Inicio'],['learn','◈','Lección'],['bridge','◉','Sonidos'],['phrases','Aa','Hablar'],['progress','↗','Mi progreso']].map(([id,ic,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{ic}</span>{label}</button>)}</nav></div>
}

function Welcome({name,setName,start,speakCoach,focus,setFocus}:{name:string;setName:(v:string)=>void;start:()=>void;speakCoach:(v:string)=>void;focus:string;setFocus:(v:string)=>void}){
 return <div className="welcome"><div className="welcomeCard">
  <div className="brand large"><img src="/icons/melissa-512.png" className="brandIcon largeIcon" alt=""/><span>Melissa</span></div>
  <span className="eyebrow">APRENDE EN ESPAÑOL · HABLA EN INGLÉS</span>
  <h1>Aprende en español.<br/><em>Habla en inglés.</em></h1>
  <p>Primero entiendes. Después escuchas. Luego lo dices. Melissa te da una ayuda escrita para acercarte al sonido y poco a poco dejarla atrás.</p>
  <div className="welcomeDemo"><div><small>INGLÉS</small><b>three</b></div><span>→</span><div><small>PRUÉBALO ASÍ</small><b>s̱rí</b></div></div><p className="welcomeTiny"><b>s̱</b> = lengua entre los dientes, sin voz.</p>
  <div className="welcomeRule"><b>Tu español es el punto de partida.</b><span>El inglés es el destino. La ayuda es temporal.</span><button type="button" className="ruleListen" onClick={()=>speakCoach('Tu español es el punto de partida. El inglés es el destino. La ayuda es temporal.')}>🔊 Escúchame</button></div>
  <div className="focusPicker"><span className="eyebrow">¿QUÉ TE CUESTA MÁS?</span><p>Elige una opción. No hay respuesta correcta.</p><div>{focusChoices.map(([id,label])=><button key={id} className={focus===id?'selected':''} onClick={()=>setFocus(id)}>{label}</button>)}</div></div>
  <label>¿Cómo te llamamos? <span>opcional</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label>
  <button className="primary wide" onClick={start}>Vamos →</button>
  <small className="privacy">No necesitas cuenta. En esta prueba, tu progreso se queda en este dispositivo.</small>
 </div></div>
}
function Home({state,setTab,speak,speakCoach,complete}:{state:State;setTab:(v:string)=>void;speak:(v:string)=>void;speakCoach:(v:string)=>void;complete:(v:string)=>void}){
 const greeting=state.name?`Hola, ${state.name}.`:'Hola.';
 return <section className="homePage"><section className="hero"><div><p className="eyebrow">TU INGLÉS DE HOY</p><h1>{greeting}<br/><em>¿Practicamos?</em></h1><p className="intro">Aquí no necesitas saber fonética. Primero entiendes el significado en español, después escuchas el inglés y usas una ayuda escrita para acercarte al sonido.</p><button className="primary" onClick={()=>setTab('learn')}>Empezar una lección de 5 min <span>→</span></button><button className="quietLink" onClick={()=>speakCoach('Hola. Vamos a practicar inglés juntos.')}>💬 Oír a Melissa</button></div><div className="orbit"><div className="bubble b1">three<br/><small>s̱rí</small></div><div className="bubble b2">water<br/><small>wó-der</small></div><div className="mouth">◡</div><div className="ring"></div></div></section><MotivationBar state={state} onProgress={()=>setTab('progress')} onReview={()=>setTab('review')}/><section className="focusStrip"><div><span className="eyebrow">TU ENFOQUE</span><h3>{soundGuides[state.focus]?.title||'Tu pronunciación'}</h3><p>{soundGuides[state.focus]?.hint||'Explora los sonidos que más te cuestan.'}</p></div><button className="ghost" onClick={()=>setTab('bridge')}>Practicar {state.focus} →</button></section><section className="bridgeIntro"><div><span className="eyebrow">EL PUENTE DE MELISSA</span><h2>Empieza en español.<br/>Llega al inglés.</h2></div><div><p>La ayuda escrita es aproximada: te sirve para arrancar, no para sustituir el inglés. Escucha, dilo y luego intenta quitar la ayuda.</p><details className="readingHelp"><summary>¿Cómo leo estas ayudas?</summary><div><b>s̱</b> = TH sin voz: lengua entre los dientes · <b>ḏ</b> = TH con voz · <b>j</b> = H inglesa suave · <b>r</b> = R inglesa, sin rodarla.<br/><strong>Importante:</strong> aquí no usamos z como TH porque en el español colombiano la z normalmente suena como s.</div></details></div></section><section className="daily"><div className="sectionHead"><div><span className="eyebrow">PRUEBA ESTO</span><h2>Pedir un café</h2></div><span className="pill">5 min</span></div><div className="lessonCard"><div className="lessonNo">01</div><div className="lessonText"><strong>I would like a coffee, please.</strong><span>Significado · escucha · dilo · inténtalo sin mirar</span></div><button className="play" onClick={()=>speak('I would like a coffee, please.')}>▶</button><button className="cardLink" onClick={()=>setTab('learn')}>Empezar →</button></div></section><section className="homeGrid"><article className="smallCard"><div className="icon warm">TH</div><div><span className="eyebrow">SONIDOS</span><h3>Encuentra tus sonidos difíciles</h3><p>TH, R, W/V, vocales y otros sonidos con ejemplos sencillos.</p></div><button onClick={()=>setTab('bridge')}>Probar sonidos →</button></article><article className="smallCard"><div className="icon cool">Aa</div><div><span className="eyebrow">SITUACIONES</span><h3>Habla de cosas reales</h3><p>Café, transporte, trabajo, clase, compras y conversaciones normales.</p></div><button onClick={()=>setTab('phrases')}>Elegir situación →</button></article></section><section className="homeFoot"><span>{todayPractice(state)>=3?'🎉 Meta de 3 prácticas cumplida':`Meta de hoy: ${todayPractice(state)}/3 prácticas`}</span><button onClick={()=>setTab('words')}>Buscar palabras →</button><button onClick={()=>setTab('progress')}>Ver mi progreso →</button></section></section>
}

function Learn({speak,speakCoach,complete,rate,state,toggleFavorite}:{speak:(v:string)=>void;speakCoach:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void;state:State;toggleFavorite:(id:string)=>void}){const [i,setI]=useState(0);const [step,setStep]=useState(0);const p=dailyLesson[i%dailyLesson.length];const id='phrase-'+p.en;const fav=state.favorites.includes(id);return <section className="page"><span className="eyebrow">LECCIÓN · {i%dailyLesson.length+1}/{dailyLesson.length}</span><div className="pageTitleRow"><div><h1>Vamos a decirlo.</h1><p className="lead">Sigue cuatro pasos. No hace falta estudiar reglas primero.</p></div><button className="favoriteBtn" onClick={()=>toggleFavorite(id)} aria-label="Guardar">{fav?'★':'☆'}</button></div><div className="lessonGuide"><b>1. Mira</b><span>2. Escucha</span><span>3. Dilo</span><span>4. Sin ayuda</span></div><div className="phraseMeta"><span>{sceneLabel(p.scene)}</span><span>Sonido: {p.focus}</span></div><div className="learnCard"><div className="meaningTop"><small>EN ESPAÑOL</small><strong>{p.es}</strong><button className="coachMini" onClick={()=>speakCoach(p.es)}>💬 Melissa</button></div><div className="learnEnglish"><small>INGLÉS</small><h2>{p.en}</h2><button className="listen" onClick={()=>speak(p.en)}>🔊 Modelo en inglés</button></div><div className="bridgeDivider"><span>→</span><b>PRUÉBALO ASÍ</b></div><div className="bridgeLarge"><small>AYUDA DE PRONUNCIACIÓN</small><strong>{p.say}</strong><span>No es fonética oficial. Es un puente para arrancar.</span></div><p className="tip">{p.tip}</p><div className="stepRow"><button className={step===0?'current':''} onClick={()=>setStep(0)}>1 · Mira</button><button className={step===1?'current':''} onClick={()=>{setStep(1);speak(p.en)}}>2 · Escucha</button><button className={step===2?'current':''} onClick={()=>setStep(2)}>3 · Dilo</button><button className={step===3?'current':''} onClick={()=>setStep(3)}>4 · Sin ayuda</button></div>{step===3?<div className="noBridge"><small>AHORA SOLO EL INGLÉS</small><strong>{p.en}</strong><button className="listen" onClick={()=>speak(p.en)}>🔊 Escucharlo otra vez</button></div>:<p className="stepHint">{step===0?'Lee la ayuda una vez. No intentes memorizarla.':step===1?'Escucha dos veces y nota qué palabras suenan fuertes.':'Ahora dilo en voz alta. No pasa nada si sale imperfecto.'}</p>}<div className="actions"><button className="ghost" onClick={()=>speak(p.en)}>↻ Repetir</button><button className="primary" onClick={()=>{complete(id);setI(x=>x+1);setStep(0)}}>Siguiente ✓</button></div></div><MiniFeedback id={id} rate={rate}/></section>}

function MiniFeedback({id,rate}:{id:string;rate:(id:string,n:number)=>void}){return <div className="miniFeedback"><span>¿Te ayudó esta forma de escribirlo?</span><button onClick={()=>rate(id,1)}>No</button><button onClick={()=>rate(id,2)}>Un poco</button><button onClick={()=>rate(id,3)}>Sí</button><button onClick={()=>rate(id,4)}>Mucho</button></div>}

function BridgeLab({speak,speakCoach,complete,rate,state,toggleFavorite}:{speak:(v:string)=>void;speakCoach:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void;state:State;toggleFavorite:(id:string)=>void}){const [group,setGroup]=useState(state.focus||'TH');const [i,setI]=useState(0);const pool=wordLibrary.filter(w=>matchGroup(w,group));const w=pool[i%Math.max(pool.length,1)]||wordLibrary[0];const id='word-'+w.en+'-'+w.say;const fav=state.favorites.includes(id);return <section className="page"><span className="eyebrow">SONIDOS · PUENTE DE MELISSA</span><div className="pageTitleRow"><div><h1>Prueba un sonido.<br/><em>Mira si te ayuda.</em></h1><p className="lead">No necesitas saber los nombres técnicos. Elige un problema, escucha la palabra y prueba la ayuda.</p></div><button className="favoriteBtn" onClick={()=>toggleFavorite(id)} aria-label="Guardar">{fav?'★':'☆'}</button></div><div className="groupScroller">{groups.map(g=><button className={group===g?'active':''} key={g} onClick={()=>{setGroup(g);setI(0)}}>{groupLabel(g)}</button>)}</div>{soundGuides[group]&&<div className="soundGuide"><div><span className="eyebrow">CÓMO HACERLO</span><h2>{soundGuides[group].title}</h2><p>{soundGuides[group].hint}</p><small>Ejemplos: {soundGuides[group].examples}</small></div><button className="ghost" onClick={()=>speakCoach(soundGuides[group].hint)}>🔊 Oír consejo</button></div>}<div className="wordCard"><div className="meaningBig"><span>ESPAÑOL</span><strong>{w.es}</strong><button className="coachMini" onClick={()=>speakCoach(w.es)}>💬 Melissa</button></div><div className="wordEnglish"><span>{w.en}</span><button onClick={()=>speak(w.en)}>🔊</button></div><div className="bridgeLabel">PUENTE DE PRONUNCIACIÓN</div><div className="sayBig">{w.say}</div><div className="microTip">{w.note||'Escucha el inglés y comprueba si esta escritura te acerca al sonido.'}</div><div className="threeButtons"><button onClick={()=>speak(w.en)}>🔊 Escuchar</button><button onClick={()=>complete(id)}>✓ Lo probé</button><button onClick={()=>setI(x=>x+1)}>Otra palabra →</button></div></div><div className="miniFeedback"><span>¿Esta ayuda te acerca al inglés?</span><button onClick={()=>rate(id,1)}>No</button><button onClick={()=>rate(id,2)}>Un poco</button><button onClick={()=>rate(id,3)}>Sí</button><button onClick={()=>rate(id,4)}>Mucho</button></div><p className="tinyNote">Las ayudas están pensadas para hispanohablantes y pueden cambiar según el acento. En español colombiano no usamos la z como TH: aquí s̱ y ḏ son pistas visuales para recordarte la lengua entre los dientes. Aquí queremos descubrir cuáles funcionan mejor.</p><p className="wordExplore">Hay {wordLibrary.length} palabras o grupos de palabras para explorar en esta versión. Cada una puede recibir una valoración para ayudarnos a corregir el puente.</p></section>}

function PhraseCoach({speak,speakCoach,complete,rate,feedback,state,toggleFavorite}:{speak:(v:string)=>void;speakCoach:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void;feedback:(v:string)=>void;state:State;toggleFavorite:(id:string)=>void}){const [scenario,setScenario]=useState(scenarios[0]);const [i,setI]=useState(0);const [recording,setRecording]=useState(false);const [audio,setAudio]=useState<string|null>(null);const [comment,setComment]=useState('');const p=scenario.phrases[i%Math.max(1,scenario.phrases.length)]||phraseLibrary[0];const id='scenario-'+scenario.id+'-'+p.en;const fav=state.favorites.includes(id);const recorder=useRef<MediaRecorder|null>(null);const chunks=useRef<Blob[]>([]);const startRec=()=>{if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){return}navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const r=new MediaRecorder(stream);recorder.current=r;chunks.current=[];r.ondataavailable=e=>chunks.current.push(e.data);r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());setAudio(URL.createObjectURL(new Blob(chunks.current,{type:'audio/webm'})));};r.start();setRecording(true)}).catch(()=>setRecording(false))};const stopRec=()=>{recorder.current?.stop();setRecording(false)};return <section className="page"><span className="eyebrow">HABLAR · SITUACIONES REALES</span><div className="pageTitleRow"><div><h1>Habla para algo.<br/><em>No por hablar.</em></h1><p className="lead">Elige una situación, entiende la frase en español, escucha el inglés y dilo tú.</p></div></div><div className="scenarioRow">{scenarios.map(s=><button className={scenario.id===s.id?'active':''} key={s.id} onClick={()=>{setScenario(s);setI(0);setAudio(null)}}><b>{s.icon}</b><span>{s.title}</span></button>)}</div><div className="speakCard"><div className="scene"><span>{scenario.title}</span><small>{scenario.desc}</small></div><div className="conversation"><small>SIGNIFICA</small><h3>{p.es}</h3><h2>{p.en}</h2><button className="coachMini" onClick={()=>speakCoach(p.es)}>💬 Escuchar a Melissa</button></div><div className="bridgeLine"><span>PUENTE</span><b>{p.say}</b></div><div className="listenRow"><button className="listen" onClick={()=>speak(p.en)}>🔊 Modelo</button><button className={recording?'recording':''} onClick={recording?stopRec:startRec}>{recording?'■ Parar':'● Grabarme'}</button><button className="favoriteBtn small" onClick={()=>toggleFavorite(id)} aria-label="Guardar">{fav?'★':'☆'}</button></div>{audio&&<audio controls src={audio}/>}<p className="recordNote">Tu grabación se queda en este dispositivo en esta versión; no se sube a ningún servidor.</p><div className="actions"><button className="ghost" onClick={()=>speak(p.en)}>↻ Repetir</button><button className="primary" onClick={()=>{complete(id);setI(x=>x+1);setAudio(null)}}>La dije ✓</button></div></div><MiniFeedback id={id} rate={rate}/><details className="feedbackFold"><summary>¿Quieres decirnos qué fue raro?</summary><div className="studentFeedback"><div className="feedbackBtns"><button onClick={()=>feedback('La ayuda me lo hizo más fácil')}>Me hizo más fácil</button><button onClick={()=>feedback('Necesité escuchar el inglés primero')}>Necesité oír inglés primero</button><button onClick={()=>feedback('La escritura me confundió')}>La escritura me confundió</button></div><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Algo más…"/><button className="ghost" onClick={()=>{if(comment.trim())feedback(comment.trim());setComment('')}}>Enviar</button></div></details></section>}

function Words({speak,speakCoach,feedback,state,toggleFavorite}:{speak:(v:string)=>void;speakCoach:(v:string)=>void;feedback:(v:string)=>void;state:State;toggleFavorite:(id:string)=>void}){const [query,setQuery]=useState('');const [text,setText]=useState('');const [showTester,setShowTester]=useState(false);const [savedOnly,setSavedOnly]=useState(false);const result=useMemo(()=>{const base=savedOnly?wordLibrary.filter(w=>state.favorites.includes('word-'+w.en+'-'+w.say)):wordLibrary;return query?base.filter(w=>w.en.toLowerCase().includes(query.toLowerCase())||w.es.toLowerCase().includes(query.toLowerCase())).slice(0,15):base.slice(0,15)},[query,savedOnly,state.favorites]);return <section className="page"><span className="eyebrow">PALABRAS</span><h1>Busca en español.<br/><em>Descubre el inglés.</em></h1><p className="lead">Puedes buscar por la palabra en inglés o por lo que significa para ti.</p><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ej.: agua, water, café…"/></div><div className="filterPills"><button className={!savedOnly?'active':''} onClick={()=>setSavedOnly(false)}>Todas</button><button className={savedOnly?'active':''} onClick={()=>setSavedOnly(true)}>★ Guardadas ({state.favorites.filter(x=>x.startsWith('word-')).length})</button></div><div className="wordList">{result.map(w=>{const id='word-'+w.en+'-'+w.say;return <button key={id} onClick={()=>speak(w.en)}><small>{w.es}</small><span>{w.en}</span><em>{w.say}</em><i onClick={(e)=>{e.stopPropagation();toggleFavorite(id)}}>{state.favorites.includes(id)?'★':'☆'}</i></button>})}</div>{savedOnly&&!result.length&&<div className="emptyState"><b>Todavía no has guardado ninguna palabra.</b><span>Toca ☆ en una palabra para tenerla a mano.</span></div>}<button className="testerToggle" onClick={()=>setShowTester(v=>!v)}>{showTester?'Cerrar':'Probar una frase'} {showTester?'↑':'↓'}</button>{showTester&&<div className="phraseTester"><span className="eyebrow">PRUEBA DEL PUENTE</span><h2>Escribe una frase en inglés. Melissa solo mostrará ayudas que ya hemos revisado.</h2><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="I would like a coffee, please."/><div className="testResult"><span>SOLO PALABRAS REVISADAS</span><strong>{text?bridgePhrase(text):'Aquí aparecerá la ayuda.'}</strong><small>Las palabras sin revisión se quedan igual. No queremos inventar una pronunciación y presentarla como si fuera correcta.</small></div></div>}<details className="readingHelp"><summary>¿Cómo leo las ayudas?</summary><div><b>s̱</b> = TH sin voz: lengua entre los dientes · <b>ḏ</b> = TH con voz · <b>j</b> = H inglesa suave · <b>r</b> = R inglesa sin rodarla.</div></details><button className="tinyReport" onClick={()=>feedback('Encontré una palabra o una ayuda que debería corregirse')}>Encontré un error →</button></section>}

function MotivationBar({state,onProgress,onReview}:{state:State;onProgress:()=>void;onReview:()=>void}){const today=todayPractice(state);const streak=currentStreak(state);const badges=badgesFor(state);const reviewCount=state.learned.filter(id=>state.ratings[id]&&state.ratings[id]<=2).length;return <section className="motivationBar"><button className="motStat" onClick={onProgress}><span>HOY</span><strong>{Math.min(today,3)}/3</strong><small>{today>=3?'Meta cumplida':'prácticas'}</small></button><button className="motStat" onClick={onProgress}><span>RACHA</span><strong>🔥 {streak}</strong><small>{streak===1?'día activo':'días seguidos'}</small></button><button className="motStat" onClick={onProgress}><span>PUNTOS</span><strong>✦ {state.points}</strong><small>por practicar</small></button>{reviewCount>0&&<button className="motReview" onClick={onReview}><span>REVISAR</span><strong>{reviewCount}</strong><small>cosas que costaron</small></button>}<div className="badgePeek">{badges.filter(b=>b.ok).slice(-3).map(b=><span key={b.id} title={b.desc}>{b.emoji}</span>)}</div></section>}

function Review({state,setTab,speak,speakCoach,complete,rate,toggleFavorite}:{state:State;setTab:(v:string)=>void;speak:(v:string)=>void;speakCoach:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void;toggleFavorite:(v:string)=>void}){const items=useMemo(()=>{const hardWords=wordLibrary.filter(w=>state.ratings['word-'+w.en+'-'+w.say]&&state.ratings['word-'+w.en+'-'+w.say]<=2).map(w=>({kind:'word' as const,w,id:'word-'+w.en+'-'+w.say}));const hardPhrases=phraseLibrary.filter(p=>state.ratings['phrase-'+p.en]&&state.ratings['phrase-'+p.en]<=2).map(p=>({kind:'phrase' as const,p,id:'phrase-'+p.en}));const favWords=wordLibrary.filter(w=>state.favorites.includes('word-'+w.en+'-'+w.say)).map(w=>({kind:'word' as const,w,id:'word-'+w.en+'-'+w.say}));return Array.from(new Map([...hardWords,...hardPhrases,...favWords].map(x=>[x.id,x])).values()).slice(0,8)},[state.ratings,state.favorites]);const [i,setI]=useState(0);const item=items[i%Math.max(1,items.length)];if(!item)return <section className="page"><span className="eyebrow">REPASO RÁPIDO</span><h1>Todavía no hay<br/><em>nada que rescatar.</em></h1><p className="lead">Cuando algo te cueste o guardes una palabra, aparecerá aquí. No necesitas memorizar todo hoy.</p><button className="primary" onClick={()=>setTab('learn')}>Hacer una práctica →</button></section>;const en=item.kind==='word'?item.w.en:item.p.en;const es=item.kind==='word'?item.w.es:item.p.es;const say=item.kind==='word'?item.w.say:item.p.say;const tip=item.kind==='word'?(item.w.note||'Escucha el inglés y usa la ayuda solo para arrancar.'):item.p.tip;const fav=state.favorites.includes(item.id);return <section className="page"><span className="eyebrow">REPASO RÁPIDO · {i+1}/{items.length}</span><div className="pageTitleRow"><div><h1>Lo que te costó.<br/><em>Un poco más fácil.</em></h1><p className="lead">Melissa vuelve a enseñarte algunas cosas que marcaste como difíciles o guardaste.</p></div><button className="favoriteBtn" onClick={()=>toggleFavorite(item.id)}>{fav?'★':'☆'}</button></div><div className="reviewCard"><small>ESPAÑOL</small><h2>{es}</h2><div className="reviewEnglish"><span>INGLÉS</span><strong>{en}</strong><button className="listen" onClick={()=>speak(en)}>🔊 Escuchar</button></div><div className="bridgeLarge"><small>PRUÉBALO ASÍ</small><strong>{say}</strong><span>{tip}</span></div><div className="actions"><button className="ghost" onClick={()=>speakCoach(es)}>💬 Melissa</button><button className="primary" onClick={()=>{complete(item.id);setI(x=>x+1)}}>Lo dije ✓</button></div></div><MiniFeedback id={item.id} rate={rate}/><button className="quietLink" onClick={()=>setTab('bridge')}>Ir a todos los sonidos →</button></section>}

function Progress({state,setTab,setSpeed,coachVoice,modelVoice,feedback,setTeacher,reset}:{state:State;setTab:(v:string)=>void;setSpeed:(n:number)=>void;coachVoice?:SpeechSynthesisVoice;modelVoice?:SpeechSynthesisVoice;feedback:(v:string)=>void;setTeacher:(v:boolean)=>void;reset:()=>void}){
 const ratings=Object.values(state.ratings);
 const helpful=ratings.length?Math.round(ratings.filter(n=>n>=3).length/ratings.length*100):0;
 const hard=state.learned.filter(id=>state.ratings[id]&&state.ratings[id]<=2).length;
 const streak=currentStreak(state);const today=todayPractice(state);const badges=badgesFor(state);const goalPct=Math.min(100,Math.round(today/3*100));
 return <section className="page"><span className="eyebrow">MI PROGRESO</span><h1>Tu inglés.<br/><em>Poco a poco.</em></h1>
 <div className="dashboardHero"><div className="goalCircle" style={{background:`conic-gradient(var(--coral) ${goalPct}%, #e8e2d7 0)`}}><div><strong>{Math.min(today,3)}</strong><span>/3 hoy</span></div></div><div><span className="eyebrow">TU RITMO</span><h2>{today>=3?'Meta cumplida 🎉':`Te faltan ${Math.max(0,3-today)} prácticas hoy.`}</h2><p>Melissa premia volver a practicar, no acertar perfecto. Cada práctica suma puntos y ayuda a construir tu racha.</p><div className="dashButtons"><button className="primary" onClick={()=>setTab('learn')}>Practicar ahora →</button>{hard>0&&<button className="ghost" onClick={()=>setTab('review')}>Revisar lo difícil</button>}</div></div></div>
 <div className="stats"><div><strong>🔥 {streak}</strong><span>racha activa</span></div><div><strong>✦ {state.points}</strong><span>puntos de práctica</span></div><div><strong>{state.learned.length}</strong><span>cosas que has probado</span></div><div><strong>{helpful}%</strong><span>ayudas que te sirvieron</span></div></div>
 <div className="badgePanel"><div><span className="eyebrow">PEQUEÑOS LOGROS</span><h2>Sin competir con nadie.</h2><p>Solo pequeñas señales de que estás avanzando.</p></div><div className="badges">{badges.map(b=><div className={b.ok?'badge earned':'badge'} key={b.id}><span>{b.emoji}</span><b>{b.title}</b><small>{b.ok?'Conseguido':b.desc}</small></div>)}</div></div>
 <div className="focusPanel"><div><span className="eyebrow">TU ENFOQUE</span><h2>{soundGuides[state.focus]?.title||'Tu pronunciación'}</h2><p>{soundGuides[state.focus]?.hint}</p></div><button className="primary" onClick={()=>setTab('bridge')}>Practicar →</button></div>
 <div className="progressPanel"><span className="eyebrow">SIGUIENTE PASO</span><h2>{hard?'Hay cosas que merecen otra vuelta.':'Sigue con una práctica corta.'}</h2><p>{hard?'Tu repaso reúne palabras y frases que marcaste como difíciles.':'No buscamos una nota perfecta: buscamos que una ayuda te acerque de verdad al inglés.'}</p><div className="nextActions"><button onClick={()=>setTab('bridge')}>Probar sonidos →</button><button onClick={()=>setTab('phrases')}>Hablar →</button></div></div>
 <div className="voicePanel"><div><span className="eyebrow">VOZ</span><h2>Melissa habla contigo.</h2><p>{coachVoice?`Melissa: ${coachVoice.name} (${coachVoice.lang}).`:'Melissa usará la mejor voz española disponible en tu dispositivo.'} {modelVoice?`Inglés: ${modelVoice.name}.`:'El ejemplo en inglés buscará una voz inglesa disponible.'}</p></div><div className="speedButtons"><button className={state.speed<.82?'active':''} onClick={()=>setSpeed(.72)}>Lento</button><button className={state.speed>=.82&&state.speed<.96?'active':''} onClick={()=>setSpeed(.86)}>Normal</button><button className={state.speed>=.96?'active':''} onClick={()=>setSpeed(1)}>Natural</button></div></div>
 <details className="feedbackFold"><summary>Cuéntame cómo va</summary><div className="studentFeedback"><div className="feedbackBtns"><button onClick={()=>{feedback('La experiencia me está gustando');setTab('home')}}>Me está gustando</button><button onClick={()=>{feedback('Necesito más ayuda');setTab('home')}}>Necesito más ayuda</button><button onClick={()=>{feedback('Algo me confunde');setTab('home')}}>Algo me confunde</button></div></div></details>
 <div className="privacyBox"><b>Tu prueba es privada</b><span>Las prácticas, favoritos, valoraciones y comentarios se guardan en este navegador. No hay cuenta ni perfil en la nube.</span></div><button className="studioLink" onClick={()=>setTeacher(true)}>Vista del profesor · prueba</button><button className="resetLink" onClick={()=>{if(window.confirm('¿Reiniciar la prueba en este dispositivo?')) reset()}}>Reiniciar esta prueba</button></section>
}
function Teacher({setTeacher,state,wordCount,phraseCount}:{setTeacher:(v:boolean)=>void;state:State;wordCount:number;phraseCount:number}){const [view,setView]=useState('dashboard');const ratings=Object.values(state.ratings);const avg=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1):'—';return <div className="teacherShell"><header><div className="brand"><img src="/icons/melissa-512.png" className="brandIcon" alt=""/><span>Melissa <small>STUDIO</small></span></div><button className="teacherBtn" onClick={()=>setTeacher(false)}>Volver al alumno ↙</button></header><div className="teacherLayout"><aside>{[['dashboard','Resumen'],['students','Alumnos'],['lessons','Lecciones'],['builder','Crear lección'],['sounds','Pronunciación'],['library','Biblioteca']].map(([id,l])=><button className={view===id?'sel':''} onClick={()=>setView(id)} key={id}>{l}</button>)}</aside><main className="teacherMain">{view==='dashboard'?<><span className="eyebrow">STUDIO · PRUEBA DE CLASE</span><h1>Mira lo que hacen, no solo la nota.</h1><div className="teacherGrid"><div className="teacherStat"><span>Prácticas</span><b>{state.done}</b><small>en este dispositivo</small></div><div className="teacherStat"><span>Racha</span><b>{currentStreak(state)}</b><small>días activos</small></div><div className="teacherStat"><span>Puntos</span><b>{state.points}</b><small>práctica acumulada</small></div><div className="teacherStat"><span>Valoración media</span><b>{avg}</b><small>sobre 4</small></div><div className="teacherStat alert"><span>Elementos probados</span><b>{state.learned.length}</b><small>palabras y frases</small></div></div><div className="panel"><div className="panelHead"><div><span className="eyebrow">BIBLIOTECA</span><h2>{wordCount} palabras · {phraseCount} frases</h2></div><span>Prueba actual</span></div><p>El objetivo es descubrir qué puentes ayudan realmente a hispanohablantes. Los favoritos y valoraciones de los alumnos indican qué contenido merece otra vuelta.</p><div className="barRow"><b>TH</b><span>prioridad</span><i><em style={{width:'82%'}}></em></i></div><div className="barRow"><b>W / V</b><span>confusión habitual</span><i><em style={{width:'70%'}}></em></i></div><div className="barRow"><b>R / finales</b><span>necesita pruebas</span><i><em style={{width:'62%'}}></em></i></div></div><div className="panel split"><div><span className="eyebrow">FEEDBACK</span><h2>{state.feedback.length} comentarios</h2><p>Las señales más útiles serán qué ayudas confunden y cuáles aceleran la pronunciación.</p></div><button className="primary">Revisar →</button></div></>:<div className="coming"><div>◌</div><h2>{viewLabel(view)}</h2><p>Área reservada para alumnos, lecciones, edición de puentes, asignaciones y análisis de pronunciación.</p></div>}</main></div></div>}

function sceneLabel(scene:string){const map:Record<string,string>={Ordering:'Café',Restaurant:'Restaurante',Travel:'Viaje',Hotel:'Hotel','Getting around':'Moverte por ahí',Conversation:'Conversación','Greeting someone':'Saludo',Greeting:'Saludo',Goodbye:'Despedida',Politeness:'Cortesía',Work:'Trabajo',Class:'Clase',Everyday:'Día a día',Shopping:'Compras',Health:'Salud',Digital:'Móvil e internet'};return map[scene]||scene}
function matchGroup(w:Word,group:string){
 const s=w.sound.toLowerCase().trim();
 if(group==='Final') return s.includes('final');
 if(group==='Vowels') return s.includes('vowel')||s.includes('schwa')||s.includes('weak form');
 if(group==='Diphthongs') return s.includes('diphthong')||s.includes('ow')||s.includes('oh');
 if(group==='Clusters') return s.includes('cluster');
 if(group==='-S') return s.includes('plural -s');
 if(group==='-ED') return s.includes('-ed');
 if(group==='S/Z') return /(^|[+\/-])s\/z|final z|s\/z/.test(s) || s.includes('s/z');
 if(group==='TH') return s.startsWith('th') || s.includes('th voiced');
 if(group==='SH') return /(^|[+\/-])sh(?:\s|[+\/-]|$)/.test(s) || s.startsWith('sh +');
 if(group==='NG') return /(^|[+\/-])ng(?:\s|[+\/-]|$)/.test(s);
 if(group==='J') return /(^|[+\/-])j(?:\s|[+\/-]|$)/.test(s) || s.startsWith('j +');
 if(group==='CH') return /(^|[+\/-])ch(?:\s|[+\/-]|$)/.test(s) || s.startsWith('ch +');
 if(group==='H') return /(^|[+\/-])h(?:\s|[+\/-]|$)/.test(s) || s.includes('silent h');
 if(group==='V/W') return /(^|[+\/-])(?:v|w)(?:\s|[+\/-]|$)/.test(s) || s.startsWith('v +') || s.startsWith('w +');
 if(group==='R') return /(^|[+\/-])r(?:\s|[+\/-]|$)/.test(s) || s.startsWith('r +');
 if(group==='Stress') return s.includes('stress')||s.includes('rhythm');
 return s.includes(group.toLowerCase());
}
function groupLabel(group:string){const map:Record<string,string>={'TH':'TH','V/W':'V y W','H':'H','J':'J','CH':'CH','SH':'SH','R':'R','S/Z':'S y Z','NG':'NG','Vowels':'Vocales','Diphthongs':'Combinaciones de vocales','-ED':'Final -ed','-S':'Final -s','Final':'Sonidos finales','Stress':'Ritmo y acento','Clusters':'Consonantes juntas'};return map[group]||group}
function viewLabel(view:string){const map:Record<string,string>={students:'Alumnos',lessons:'Lecciones',builder:'Crear lección',sounds:'Pronunciación',library:'Biblioteca'};return map[view]||view}

createRoot(document.getElementById('root')!).render(<App/>);

if ('serviceWorker' in navigator) {window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}
