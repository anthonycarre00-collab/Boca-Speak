import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

type Word={en:string; es:string; say:string; sound:string; note?:string; tags?:string[]};
type Phrase={en:string; es:string; say:string; tip:string; scene:string; focus:string};

// Boca Bridge v0.3: a curated learner aid for Spanish-speaking learners of English.
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
 {en:'house',es:'casa',say:'jáus',sound:'H',note:'English H is breath, not the stronger Spanish J sound.',tags:['home']},
 {en:'help',es:'ayudar',say:'jelp',sound:'H',note:'Let air out gently at the start; do not scrape the throat.',tags:['common']},
 {en:'hotel',es:'hotel',say:'jou-TÉL',sound:'H + stress',tags:['travel']},
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
 {en:'hotel',es:'hotel',say:'jou-TÉL',sound:'H + stress',tags:['travel']},
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

const groups=['TH','V/W','H','J','CH','R','Vowels','-ED','Final','Stress'];
const scenarios=[
 {id:'cafe',title:'En un café',icon:'☕',desc:'Pide algo, pregunta el precio y paga.',phrases:phrases.filter(p=>['Ordering','Restaurant'].includes(p.scene))},
 {id:'travel',title:'Moverte por ahí',icon:'🚌',desc:'Pregunta dónde está algo y cómo llegar.',phrases:phrases.filter(p=>['Getting around','Travel','Hotel'].includes(p.scene))},
 {id:'conversation',title:'Conversación',icon:'◌',desc:'Las frases pequeñas que usas todos los días.',phrases:phrases.filter(p=>['Conversation','Greeting someone','Greeting','Goodbye','Politeness','Everyday'].includes(p.scene))},
 {id:'work',title:'Trabajo y clase',icon:'✦',desc:'Inglés práctico para estudiar, trabajar y preguntar.',phrases:phrases.filter(p=>['Work','Class'].includes(p.scene))},
];

const storageKey='bocaspeak_v04';
type State={done:number; learned:string[]; ratings:Record<string,number>; feedback:string[]; firstRun:boolean; name:string};
const initial:State={done:0,learned:[],ratings:{},feedback:[],firstRun:true,name:''};
function loadState():State{try{return {...initial,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{return initial}}
function saveState(s:State){localStorage.setItem(storageKey,JSON.stringify(s))}
function lookup(q:string){return words.find(w=>w.en.toLowerCase()===q.trim().toLowerCase())}
function bridgePhrase(value:string){const tokens=value.match(/[A-Za-zÀ-ÿ’'-]+|[^A-Za-zÀ-ÿ’'-]+/g)||[];return tokens.map(t=>lookup(t)?.say||t).join('')}

function App(){
 const [teacher,setTeacher]=useState(false); const [tab,setTab]=useState('home'); const [state,setState]=useState<State>(loadState()); const [online,setOnline]=useState(navigator.onLine);
 useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);addEventListener('online',on);addEventListener('offline',off);return()=>{removeEventListener('online',on);removeEventListener('offline',off)}},[]);
 useEffect(()=>saveState(state),[state]);
 const complete=(id:string)=>setState(s=>({...s,done:s.done+1,learned:Array.from(new Set([...s.learned,id]))}));
 const rate=(id:string,n:number)=>setState(s=>({...s,ratings:{...s.ratings,[id]:n}}));
 const feedback=(value:string)=>setState(s=>({...s,feedback:[...s.feedback,value]}));
 const speak=(value:string)=>{if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}};
 if(state.firstRun)return <Welcome name={state.name} setName={name=>setState(s=>({...s,name}))} start={()=>setState(s=>({...s,firstRun:false}))}/>;
 if(teacher)return <Teacher setTeacher={setTeacher} state={state}/>;
 return <div className="shell"><header><div className="brand" onClick={()=>setTab('home')}><span className="mark"><i></i><i></i></span><span>Boca<span>Speak</span></span></div><div className="top"><span className={online?'status online':'status'}><b></b>{online?'Listo':'Sin conexión'}</span><button className="teacherBtn" onClick={()=>setTeacher(true)}>Profesor ↗</button></div></header>
 <main>
  {tab==='home'&&<Home state={state} setTab={setTab} speak={speak} complete={complete}/>} 
  {tab==='learn'&&<Learn speak={speak} complete={complete} rate={rate}/>} 
  {tab==='bridge'&&<BridgeLab speak={speak} complete={complete} rate={rate}/>} 
  {tab==='phrases'&&<PhraseCoach speak={speak} complete={complete} rate={rate} feedback={feedback}/>} 
  {tab==='words'&&<Words speak={speak} feedback={feedback}/>} 
  {tab==='progress'&&<Progress state={state} setTab={setTab}/>} 
 </main>
 <nav>{[['home','⌂','Inicio'],['learn','◈','Lección'],['bridge','◉','Sonidos'],['phrases','Aa','Hablar'],['progress','↗','Mi progreso']].map(([id,ic,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{ic}</span>{label}</button>)}</nav></div>
}

function Welcome({name,setName,start}:{name:string;setName:(v:string)=>void;start:()=>void}){return <div className="welcome"><div className="welcomeCard"><div className="brand large"><span className="mark"><i></i><i></i></span><span>Boca<span>Speak</span></span></div><span className="eyebrow">INGLÉS QUE SÍ PUEDES DECIR.</span><h1>Aprende en español.<br/><em>Habla en inglés.</em></h1><p>BocaSpeak te da una ayuda de lectura pensada para hispanohablantes. La miras, escuchas el inglés, lo dices y después intentas decirlo sin la ayuda.</p><div className="welcomeDemo"><div><small>INGLÉS</small><b>three</b></div><span>→</span><div><small>PRUÉBALO ASÍ</small><b>zrí</b></div></div><div className="welcomeRule"><b>Tu español es el punto de partida.</b><span>El inglés es el destino. La ayuda no tiene que quedarse para siempre.</span></div><label>¿Cómo te llamamos? <span>opcional</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label><button className="primary wide" onClick={start}>Vamos →</button><small className="privacy">No necesitas cuenta. En esta prueba, tu progreso se queda en este dispositivo.</small></div></div>}

function Home({state,setTab,speak,complete}:{state:State;setTab:(v:string)=>void;speak:(v:string)=>void;complete:(v:string)=>void}){const greeting=state.name?`Hola, ${state.name}.`:'Hola.';return <section className="homePage"><section className="hero"><div><p className="eyebrow">TU INGLÉS DE HOY</p><h1>{greeting}<br/><em>¿Practicamos?</em></h1><p className="intro">Aquí no necesitas saber fonética. Primero entiendes la frase en español, luego ves cómo puedes acercarte al sonido en inglés.</p><button className="primary" onClick={()=>setTab('learn')}>Empezar una lección de 5 min <span>→</span></button></div><div className="orbit"><div className="bubble b1">three<br/><small>zrí</small></div><div className="bubble b2">water<br/><small>wó-der</small></div><div className="mouth">⌁</div><div className="ring"></div></div></section><section className="bridgeIntro"><div><span className="eyebrow">EL PUENTE BOCA</span><h2>Empieza en español.<br/>Llega al inglés.</h2></div><p>La escritura roja es una aproximación para ayudarte a arrancar. No la estudies como si fuera otro idioma: úsala, escucha el inglés y después quítala.</p></section><section className="daily"><div className="sectionHead"><div><span className="eyebrow">PRUEBA ESTO</span><h2>Pedir un café</h2></div><span className="pill">5 min</span></div><div className="lessonCard"><div className="lessonNo">01</div><div className="lessonText"><strong>I would like a coffee, please.</strong><span>Escucha · mira la ayuda · dilo · inténtalo sin mirar</span></div><button className="play" onClick={()=>speak('I would like a coffee, please.')}>▶</button><button className="cardLink" onClick={()=>setTab('learn')}>Empezar →</button></div></section><section className="homeGrid"><article className="smallCard"><div className="icon warm">TH</div><div><span className="eyebrow">SONIDOS</span><h3>Encuentra tus sonidos difíciles</h3><p>Prueba palabras sencillas y dime si la ayuda realmente te acerca al sonido.</p></div><button onClick={()=>setTab('bridge')}>Probar sonidos →</button></article><article className="smallCard"><div className="icon cool">Aa</div><div><span className="eyebrow">SITUACIONES</span><h3>Habla de cosas reales</h3><p>Café, transporte, trabajo, clase y conversaciones normales.</p></div><button onClick={()=>setTab('phrases')}>Elegir situación →</button></article></section><section className="homeFoot"><span>{state.done} prácticas</span><button onClick={()=>setTab('words')}>Buscar palabras →</button><button onClick={()=>setTab('progress')}>Ver mi progreso →</button></section></section>}

function Learn({speak,complete,rate}:{speak:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void}){const [i,setI]=useState(0);const [step,setStep]=useState(0);const p=phrases[i%phrases.length];const id='phrase-'+p.en;return <section className="page"><span className="eyebrow">LECCIÓN · {i%phrases.length+1}/{phrases.length}</span><h1>Vamos a decirlo.</h1><p className="lead">Sigue cuatro pasos. No hace falta estudiar reglas primero.</p><div className="lessonGuide"><b>1. Mira la ayuda</b><span>2. Escucha el inglés</span><span>3. Dilo en voz alta</span><span>4. Inténtalo sin mirar</span></div><div className="phraseMeta"><span>{sceneLabel(p.scene)}</span><span>Sonido: {p.focus}</span></div><div className="learnCard"><div className="meaningTop"><small>¿QUÉ QUIERE DECIR?</small><strong>{p.es}</strong></div><div className="learnEnglish"><small>INGLÉS</small><h2>{p.en}</h2><button className="listen" onClick={()=>speak(p.en)}>🔊 Escuchar inglés</button></div><div className="bridgeDivider"><span>→</span><b>PRUÉBALO ASÍ</b></div><div className="bridgeLarge"><small>AYUDA DE PRONUNCIACIÓN</small><strong>{p.say}</strong><span>No es fonética oficial. Es un puente para arrancar.</span></div><p className="tip">{p.tip}</p><div className="stepRow"><button className={step===0?'current':''} onClick={()=>setStep(0)}>1 · Mira</button><button className={step===1?'current':''} onClick={()=>{setStep(1);speak(p.en)}}>2 · Escucha</button><button className={step===2?'current':''} onClick={()=>setStep(2)}>3 · Dilo</button><button className={step===3?'current':''} onClick={()=>setStep(3)}>4 · Sin ayuda</button></div>{step===3?<div className="noBridge"><small>AHORA SOLO EL INGLÉS</small><strong>{p.en}</strong><button className="listen" onClick={()=>speak(p.en)}>🔊 Escucharlo otra vez</button></div>:<p className="stepHint">{step===0?'Lee la ayuda una vez. No intentes memorizarla.':step===1?'Escucha dos veces y nota qué palabras suenan fuertes.':'Ahora dilo en voz alta. No pasa nada si sale imperfecto.'}</p>}<div className="actions"><button className="ghost" onClick={()=>{complete(id);setI(x=>x+1);setStep(0)}}>Lo puedo decir →</button><button className="primary" onClick={()=>{rate(id,4);complete(id);setI(x=>x+1);setStep(0)}}>Siguiente ✓</button></div></div><MiniFeedback id={id} rate={rate}/></section>}

function MiniFeedback({id,rate}:{id:string;rate:(id:string,n:number)=>void}){return <div className="miniFeedback"><span>¿Te ayudó la escritura?</span><button onClick={()=>rate(id,1)}>No</button><button onClick={()=>rate(id,2)}>Un poco</button><button onClick={()=>rate(id,3)}>Sí</button><button onClick={()=>rate(id,4)}>Mucho</button></div>}

function BridgeLab({speak,complete,rate}:{speak:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void}){const [group,setGroup]=useState('TH');const [i,setI]=useState(0);const pool=words.filter(w=>group==='Final' ? w.sound.toLowerCase().includes('final') : (w.sound.startsWith(group)||w.sound.includes(group)));const w=pool[i%Math.max(pool.length,1)]||words[0];const id='word-'+w.en+'-'+w.say;return <section className="page"><span className="eyebrow">SONIDOS · PUENTE BOCA</span><h1>Prueba un sonido.<br/><em>Mira si te ayuda.</em></h1><p className="lead">No necesitas saber los nombres técnicos. Elige un problema, escucha la palabra y prueba la ayuda.</p><div className="groupScroller">{groups.map(g=><button className={group===g?'active':''} key={g} onClick={()=>{setGroup(g);setI(0)}}>{groupLabel(g)}</button>)}</div><div className="wordCard"><div className="meaningBig"><span>ESPAÑOL</span><strong>{w.es}</strong></div><div className="wordEnglish"><span>{w.en}</span><button onClick={()=>speak(w.en)}>🔊</button></div><div className="bridgeLabel">PUENTE DE PRONUNCIACIÓN</div><div className="sayBig">{w.say}</div><div className="microTip">{w.note||'Escucha el inglés y comprueba si esta escritura te acerca al sonido.'}</div><div className="threeButtons"><button onClick={()=>speak(w.en)}>🔊 Escuchar</button><button onClick={()=>complete(id)}>✓ Lo probé</button><button onClick={()=>setI(x=>x+1)}>Otra palabra →</button></div></div><div className="miniFeedback"><span>¿Esta ayuda te acerca al inglés?</span><button onClick={()=>rate(id,1)}>No</button><button onClick={()=>rate(id,2)}>Un poco</button><button onClick={()=>rate(id,3)}>Sí</button><button onClick={()=>rate(id,4)}>Mucho</button></div><p className="tinyNote">La escritura es aproximada y puede cambiar según el acento del estudiante. En esta prueba queremos saber qué formas ayudan de verdad.</p><p className="wordExplore">Hay {words.length} palabras para explorar en esta versión.</p></section>}

function PhraseCoach({speak,complete,rate,feedback}:{speak:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void;feedback:(v:string)=>void}){const [scenario,setScenario]=useState(scenarios[0]);const [i,setI]=useState(0);const [recording,setRecording]=useState(false);const [audio,setAudio]=useState<string|null>(null);const [comment,setComment]=useState('');const p=scenario.phrases[i%Math.max(1,scenario.phrases.length)]||phrases[0];const id='scenario-'+scenario.id+'-'+p.en;const recorder=React.useRef<MediaRecorder|null>(null);const chunks=React.useRef<Blob[]>([]);const startRec=()=>{if(!navigator.mediaDevices?.getUserMedia){return}navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const r=new MediaRecorder(stream);recorder.current=r;chunks.current=[];r.ondataavailable=e=>chunks.current.push(e.data);r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());setAudio(URL.createObjectURL(new Blob(chunks.current,{type:'audio/webm'})));};r.start();setRecording(true)}).catch(()=>setRecording(false))};const stopRec=()=>{recorder.current?.stop();setRecording(false)};return <section className="page"><span className="eyebrow">HABLAR · SITUACIONES REALES</span><h1>Habla para algo.<br/><em>No por hablar.</em></h1><p className="lead">Elige una situación, entiende la frase en español, escucha el inglés y dilo tú.</p><div className="scenarioRow">{scenarios.map(s=><button className={scenario.id===s.id?'active':''} key={s.id} onClick={()=>{setScenario(s);setI(0);setAudio(null)}}><b>{s.icon}</b><span>{s.title}</span></button>)}</div><div className="speakCard"><div className="scene"><span>{scenario.title}</span><small>{scenario.desc}</small></div><div className="conversation"><small>SIGNIFICA</small><h3>{p.es}</h3><h2>{p.en}</h2></div><div className="bridgeLine"><span>PUENTE</span><b>{p.say}</b></div><div className="listenRow"><button className="listen" onClick={()=>speak(p.en)}>🔊 Escuchar</button><button className={recording?'recording':''} onClick={recording?stopRec:startRec}>{recording?'■ Parar':'● Grabarme'}</button></div>{audio&&<audio controls src={audio}/>}<div className="actions"><button className="ghost" onClick={()=>{complete(id);setI(x=>x+1);setAudio(null)}}>Otra frase →</button><button className="primary" onClick={()=>{complete(id);rate(id,4);setI(x=>x+1);setAudio(null)}}>La dije ✓</button></div></div><details className="feedbackFold"><summary>¿Quieres decirnos qué fue raro?</summary><div className="studentFeedback"><div className="feedbackBtns"><button onClick={()=>feedback('La ayuda me lo hizo más fácil')}>Me hizo más fácil</button><button onClick={()=>feedback('Necesité escuchar el inglés primero')}>Necesité oír inglés primero</button><button onClick={()=>feedback('La escritura me confundió')}>La escritura me confundió</button></div><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Algo más…"/><button className="ghost" onClick={()=>{if(comment.trim())feedback(comment.trim());setComment('')}}>Enviar</button></div></details></section>}

function Words({speak,feedback}:{speak:(v:string)=>void;feedback:(v:string)=>void}){const [query,setQuery]=useState('');const [text,setText]=useState('');const [showTester,setShowTester]=useState(false);const result=useMemo(()=>query?words.filter(w=>w.en.toLowerCase().includes(query.toLowerCase())||w.es.toLowerCase().includes(query.toLowerCase())).slice(0,12):words.slice(0,12),[query]);return <section className="page"><span className="eyebrow">PALABRAS</span><h1>Busca en español.<br/><em>Descubre el inglés.</em></h1><p className="lead">Puedes buscar por la palabra en inglés o por lo que significa para ti.</p><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ej.: agua, water, café…"/></div><div className="wordList">{result.map(w=><button key={w.en+w.say} onClick={()=>speak(w.en)}><small>{w.es}</small><span>{w.en}</span><em>{w.say}</em></button>)}</div><button className="testerToggle" onClick={()=>setShowTester(v=>!v)}>{showTester?'Cerrar':'Probar una frase'} {showTester?'↑':'↓'}</button>{showTester&&<div className="phraseTester"><span className="eyebrow">PRUEBA DEL PUENTE</span><h2>Escribe una frase en inglés.</h2><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="I would like a coffee, please."/><div className="testResult"><span>SOLO PALABRAS REVISADAS</span><strong>{text?bridgePhrase(text):'Aquí aparecerá la ayuda.'}</strong><small>Las palabras sin revisión se quedan igual. No queremos inventar una pronunciación y presentarla como si fuera correcta.</small></div></div>}<button className="tinyReport" onClick={()=>feedback('Encontré una palabra o una ayuda que debería corregirse')}>Encontré un error →</button></section>}

function Progress({state,setTab}:{state:State;setTab:(v:string)=>void}){const ratings=Object.values(state.ratings);const helpful=ratings.length?Math.round(ratings.reduce((a,b)=>a+b,0)/ratings.length*25):0;return <section className="page"><span className="eyebrow">MI PROGRESO</span><h1>Tu inglés.<br/><em>Poco a poco.</em></h1><div className="stats"><div><strong>{state.done}</strong><span>momentos de práctica</span></div><div><strong>{state.learned.length}</strong><span>palabras/frases probadas</span></div><div><strong>{helpful}%</strong><span>ayuda que te funcionó</span></div></div><div className="progressPanel"><span className="eyebrow">SIGUIENTE PASO</span><h2>Prueba algo que todavía te cueste.</h2><p>Usa Sonidos para explorar problemas concretos o Hablar para llevarlos a una situación real.</p><div className="nextActions"><button onClick={()=>setTab('bridge')}>Probar sonidos →</button><button onClick={()=>setTab('phrases')}>Hablar →</button></div></div><div className="privacyBox"><b>Tus datos en esta prueba</b><span>Las prácticas, valoraciones y comentarios se guardan en este navegador. No hay cuenta ni perfil en la nube.</span></div></section>}

function Teacher({setTeacher,state}:{setTeacher:(v:boolean)=>void;state:State}){const [view,setView]=useState('dashboard');const ratings=Object.values(state.ratings);const avg=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1):'—';return <div className="teacherShell"><header><div className="brand"><span className="mark"><i></i><i></i></span><span>Boca<span>Speak</span> <small>STUDIO</small></span></div><button className="teacherBtn" onClick={()=>setTeacher(false)}>Volver al alumno ↙</button></header><div className="teacherLayout"><aside>{[['dashboard','Resumen'],['students','Alumnos'],['lessons','Lecciones'],['builder','Crear lección'],['sounds','Pronunciación'],['library','Biblioteca']].map(([id,l])=><button className={view===id?'sel':''} onClick={()=>setView(id)} key={id}>{l}</button>)}</aside><main className="teacherMain">{view==='dashboard'?<><span className="eyebrow">STUDIO · PRUEBA DE CLASE</span><h1>Mira lo que hacen, no solo la nota.</h1><div className="teacherGrid"><div className="teacherStat"><span>Prácticas</span><b>{state.done}</b><small>en este dispositivo</small></div><div className="teacherStat"><span>Valoración media</span><b>{avg}</b><small>sobre 4</small></div><div className="teacherStat alert"><span>Elementos probados</span><b>{state.learned.length}</b><small>palabras y frases</small></div></div><div className="panel"><div className="panelHead"><div><span className="eyebrow">BIBLIOTECA DE PRONUNCIACIÓN</span><h2>{words.length} palabras · {phrases.length} frases</h2></div><span>Prototipo</span></div><p>Esta prueba busca descubrir qué escrituras ayudan realmente a hispanohablantes. Las futuras versiones podrán editar cada puente y aprender de los patrones de una clase.</p><div className="barRow"><b>TH</b><span>prioridad alta</span><i><em style={{width:'82%'}}></em></i></div><div className="barRow"><b>W / V</b><span>confusión habitual</span><i><em style={{width:'70%'}}></em></i></div><div className="barRow"><b>Finales</b><span>necesita pruebas</span><i><em style={{width:'58%'}}></em></i></div></div><div className="panel split"><div><span className="eyebrow">COMENTARIOS</span><h2>{state.feedback.length} comentarios</h2><p>Más adelante se convertirán en cambios concretos del contenido.</p></div><button className="primary">Revisar →</button></div></>:<div className="coming"><div>◌</div><h2>{viewLabel(view)}</h2><p>Área reservada para alumnos, lecciones, edición de puentes, asignaciones y análisis de pronunciación.</p></div>}</main></div></div>}

function sceneLabel(scene:string){const map:Record<string,string>={Ordering:'Café',Restaurant:'Restaurante',Travel:'Viaje',Hotel:'Hotel','Getting around':'Moverte por ahí',Conversation:'Conversación','Greeting someone':'Saludo',Greeting:'Saludo',Goodbye:'Despedida',Politeness:'Cortesía',Work:'Trabajo',Class:'Clase',Everyday:'Día a día',Shopping:'Compras'};return map[scene]||scene}
function groupLabel(group:string){const map:Record<string,string>={'TH':'TH','V/W':'V y W','H':'H','J / CH':'J y CH','R':'R','Vowels':'Vocales','-ED':'Final -ed','Final':'Sonidos finales','Stress':'Ritmo y acento'};return map[group]||group}
function viewLabel(view:string){const map:Record<string,string>={students:'Alumnos',lessons:'Lecciones',builder:'Crear lección',sounds:'Pronunciación',library:'Biblioteca'};return map[view]||view}

createRoot(document.getElementById('root')!).render(<App/>);

if ('serviceWorker' in navigator) {window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}
