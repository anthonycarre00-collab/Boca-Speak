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
];

const groups=['TH','V/W','H','J','CH','R','Vowels','-ED','Final consonants','Stress'];
const scenarios=[
 {id:'cafe',title:'Order a coffee',icon:'☕',desc:'Order a drink and ask for the bill.',phrases:phrases.filter(p=>['Ordering','Restaurant'].includes(p.scene))},
 {id:'travel',title:'Get around town',icon:'🚌',desc:'Ask where things are and how to get there.',phrases:phrases.filter(p=>['Getting around','Travel','Hotel'].includes(p.scene))},
 {id:'conversation',title:'Have a conversation',icon:'◌',desc:'Handle the little moments that happen every day.',phrases:phrases.filter(p=>['Conversation','Greeting someone','Goodbye','Politeness'].includes(p.scene))},
 {id:'work',title:'At work',icon:'✦',desc:'Use practical English with colleagues and customers.',phrases:phrases.filter(p=>['Work','Class'].includes(p.scene))},
];

const storageKey='bocaspeak_v03';
type State={done:number; learned:string[]; ratings:Record<string,number>; feedback:string[]; firstRun:boolean; name:string};
const initial:State={done:0,learned:[],ratings:{},feedback:[],firstRun:true,name:''};
function loadState():State{try{return {...initial,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{return initial}}
function saveState(s:State){localStorage.setItem(storageKey,JSON.stringify(s))}
function lookup(q:string){return words.find(w=>w.en.toLowerCase()===q.trim().toLowerCase())}
function bridgePhrase(text:string){const tokens=text.match(/[A-Za-zÀ-ÿ’'-]+|[^A-Za-zÀ-ÿ’'-]+/g)||[];return tokens.map(t=>lookup(t)?.say||t).join('')}

function App(){
 const [teacher,setTeacher]=useState(false); const [tab,setTab]=useState('home'); const [state,setState]=useState<State>(loadState()); const [online,setOnline]=useState(navigator.onLine);
 useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);addEventListener('online',on);addEventListener('offline',off);return()=>{removeEventListener('online',on);removeEventListener('offline',off)}},[]);
 useEffect(()=>saveState(state),[state]);
 const complete=(id:string)=>setState(s=>({...s,done:s.done+1,learned:Array.from(new Set([...s.learned,id]))}));
 const rate=(id:string,n:number)=>setState(s=>({...s,ratings:{...s.ratings,[id]:n}}));
 const feedback=(text:string)=>setState(s=>({...s,feedback:[...s.feedback,text]}));
 const speak=(text:string)=>{if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}};
 if(state.firstRun)return <Welcome name={state.name} setName={name=>setState(s=>({...s,name}))} start={()=>setState(s=>({...s,firstRun:false}))}/>;
 if(teacher)return <Teacher setTeacher={setTeacher} state={state}/>;
 return <div className="shell"><header><div className="brand" onClick={()=>setTab('home')}><span className="mark"><i></i><i></i></span><span>Boca<span>Speak</span></span></div><div className="top"><span className={online?'status online':'status'}><b></b>{online?'Synced':'Offline'}</span><button className="teacherBtn" onClick={()=>setTeacher(true)}>Teacher Studio ↗</button></div></header>
 <main>
  {tab==='home'&&<Home state={state} setTab={setTab} speak={speak} complete={complete}/>}
  {tab==='learn'&&<Learn speak={speak} complete={complete} rate={rate}/>}
  {tab==='bridge'&&<BridgeLab speak={speak} complete={complete} rate={rate}/>}
  {tab==='phrases'&&<PhraseCoach speak={speak} complete={complete} rate={rate} feedback={feedback}/>}
  {tab==='words'&&<Words speak={speak} feedback={feedback}/>}
  {tab==='progress'&&<Progress state={state} setTab={setTab}/>} 
 </main>
 <nav>{[['home','⌂','Start'],['learn','◈','Learn'],['bridge','◉','Sounds'],['phrases','Aa','Speak'],['progress','↗','Me']].map(([id,ic,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{ic}</span>{label}</button>)}</nav></div>
}

function Welcome({name,setName,start}:{name:string;setName:(v:string)=>void;start:()=>void}){return <div className="welcome"><div className="welcomeCard"><div className="brand large"><span className="mark"><i></i><i></i></span><span>Boca<span>Speak</span></span></div><span className="eyebrow">ENGLISH YOU CAN ACTUALLY SAY.</span><h1>English is one thing.<br/><em>Getting it out of your mouth is another.</em></h1><p>Try a different way to practise pronunciation. BocaSpeak gives Spanish-speaking learners a temporary sound bridge, then helps you leave the bridge behind.</p><div className="welcomeDemo"><div><small>ENGLISH</small><b>three</b></div><span>→</span><div><small>TRY THIS</small><b>zrí</b></div></div><label>What should we call you? <span>optional</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your first name"/></label><button className="primary wide" onClick={start}>Let's try it →</button><small className="privacy">No account. No password. Your practice stays on this device in this prototype.</small></div></div>}

function Home({state,setTab,speak,complete}:{state:State;setTab:(v:string)=>void;speak:(v:string)=>void;complete:(v:string)=>void}){const greeting=state.name?`Ready, ${state.name}?`:'Ready?';return <section className="homePage"><section className="hero"><div><p className="eyebrow">YOUR ENGLISH, TODAY</p><h1>{greeting}<br/><em>Let's get speaking.</em></h1><p className="intro">A pronunciation-first practice for Spanish speakers. Start with a familiar sound, listen to the English, then say it yourself.</p><button className="primary" onClick={()=>setTab('learn')}>Start a 5-minute lesson <span>→</span></button></div><div className="orbit"><div className="bubble b1">three<br/><small>zrí</small></div><div className="bubble b2">water<br/><small>wó-der</small></div><div className="mouth">⌁</div><div className="ring"></div></div></section><section className="bridgeIntro"><div><span className="eyebrow">THE BOCA BRIDGE</span><h2>Spanish is the starting point.<br/>English is the destination.</h2></div><p>Read a familiar approximation, listen to the real English, say it, and then try again without looking at the bridge. It is a stepping stone — not a new spelling system.</p></section><section className="daily"><div className="sectionHead"><div><span className="eyebrow">TRY THIS FIRST</span><h2>Ordering a coffee</h2></div><span className="pill">5 min</span></div><div className="lessonCard"><div className="lessonNo">01</div><div className="lessonText"><strong>I would like a coffee, please.</strong><span>Hear it · see the bridge · say it · rate it</span></div><button className="play" onClick={()=>speak('I would like a coffee, please.')}>▶</button><button className="cardLink" onClick={()=>setTab('learn')}>Open →</button></div></section><section className="homeGrid"><article className="smallCard"><div className="icon warm">TH</div><div><span className="eyebrow">SOUNDS</span><h3>Find your tricky sounds</h3><p>Try a quick sound check without needing to know any phonetics.</p></div><button onClick={()=>setTab('bridge')}>Try sounds →</button></article><article className="smallCard"><div className="icon cool">◌</div><div><span className="eyebrow">REAL LIFE</span><h3>Speak in situations</h3><p>Café, travel, conversation and work — not isolated textbook sentences.</p></div><button onClick={()=>setTab('phrases')}>Pick a situation →</button></article></section><section className="homeFoot"><span>{state.done} practice moments</span><span>Works offline after loading</span><button onClick={()=>setTab('progress')}>Your progress →</button></section></section>}

function Learn({speak,complete,rate}:{speak:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void}){const [i,setI]=useState(0);const [step,setStep]=useState(0);const p=phrases[i%phrases.length];const id='phrase-'+p.en;return <section className="page"><span className="eyebrow">5-MINUTE LESSON · {i%phrases.length+1}/{phrases.length}</span><h1>Get it into your mouth.</h1><p className="lead">No grammar lesson first. Hear a useful English sentence, use the bridge, then take the bridge away.</p><div className="phraseMeta"><span>{p.scene}</span><span>Focus · {p.focus}</span></div><div className="learnCard"><div className="learnEnglish"><small>ENGLISH</small><h2>{p.en}</h2><button className="listen" onClick={()=>speak(p.en)}>🔊 Listen to English</button></div><div className="bridgeDivider"><span>1</span><b>LOOK AT THE BRIDGE</b></div><div className="bridgeLarge"><small>TRY THIS</small><strong>{p.say}</strong><span>{p.es}</span></div><p className="tip">{p.tip}</p><div className="stepRow"><button className={step===0?'current':''} onClick={()=>setStep(0)}>1 Look</button><button className={step===1?'current':''} onClick={()=>{setStep(1);speak(p.en)}}>2 Listen</button><button className={step===2?'current':''} onClick={()=>setStep(2)}>3 Say it</button><button className={step===3?'current':''} onClick={()=>setStep(3)}>4 Hide bridge</button></div>{step===3?<div className="noBridge"><small>NOW WITHOUT HELP</small><strong>{p.en}</strong><button className="listen" onClick={()=>speak(p.en)}>🔊 Hear it again</button></div>:<p className="stepHint">{step===0?'Read the bridge once. Do not memorise it.':step===1?'Listen to the English twice and notice the rhythm.':'Say the English sentence aloud twice.'}</p>}<div className="actions"><button className="ghost" onClick={()=>{complete(id);setI(x=>x+1);setStep(0)}}>I can say it →</button><button className="primary" onClick={()=>{rate(id,4);complete(id);setI(x=>x+1);setStep(0)}}>Next phrase ✓</button></div></div><MiniFeedback id={id} rate={rate}/></section>}

function MiniFeedback({id,rate}:{id:string;rate:(id:string,n:number)=>void}){return <div className="miniFeedback"><span>Was the bridge helpful?</span><button onClick={()=>rate(id,1)}>Not really</button><button onClick={()=>rate(id,2)}>A little</button><button onClick={()=>rate(id,3)}>Yes</button><button onClick={()=>rate(id,4)}>Very</button></div>}

function BridgeLab({speak,complete,rate}:{speak:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void}){const [group,setGroup]=useState('TH');const [i,setI]=useState(0);const pool=words.filter(w=>w.sound.startsWith(group)||w.sound.includes(group));const w=pool[i%Math.max(pool.length,1)]||words[0];const id='word-'+w.en+'-'+w.say;return <section className="page"><span className="eyebrow">BOCA BRIDGE · SOUND CHECK</span><h1>Find the sounds<br/><em>that fight you.</em></h1><p className="lead">You don't need to know phonetics. Pick a sound, listen, try the bridge, then decide whether it actually helped.</p><div className="groupScroller">{groups.map(g=><button className={group===g?'active':''} key={g} onClick={()=>{setGroup(g);setI(0)}}>{g}</button>)}</div><div className="wordCard"><div className="wordTop"><span>{w.sound}</span><span>{w.tags?.[0]||'common'}</span></div><div className="wordEnglish">{w.en}<button onClick={()=>speak(w.en)}>🔊</button></div><div className="bridgeLabel">TRY THIS SPANISH-SPEAKER BRIDGE</div><div className="sayBig">{w.say}</div><div className="meaning">{w.es}</div>{w.note&&<div className="microTip">{w.note}</div>}<div className="threeButtons"><button onClick={()=>speak(w.en)}>🔊 Listen</button><button onClick={()=>complete(id)}>✓ I tried it</button><button onClick={()=>setI(x=>x+1)}>Next →</button></div></div><div className="bridgeSteps"><span>1 · LOOK</span><span>2 · LISTEN</span><span>3 · SAY</span><span>4 · HIDE IT</span></div><div className="miniFeedback"><span>Did this spelling help you get closer?</span><button onClick={()=>rate(id,1)}>No</button><button onClick={()=>rate(id,2)}>A bit</button><button onClick={()=>rate(id,3)}>Yes</button><button onClick={()=>rate(id,4)}>Definitely</button></div><p className="tinyNote">The bridge is deliberately approximate. Spanish speakers have different accents, and the teacher can change a bridge later.</p></section>}

function PhraseCoach({speak,complete,rate,feedback}:{speak:(v:string)=>void;complete:(v:string)=>void;rate:(id:string,n:number)=>void;feedback:(v:string)=>void}){const [scenario,setScenario]=useState(scenarios[0]);const [i,setI]=useState(0);const [recording,setRecording]=useState(false);const [audio,setAudio]=useState<string|null>(null);const [comment,setComment]=useState('');const p=scenario.phrases[i%Math.max(1,scenario.phrases.length)]||phrases[0];const id='scenario-'+scenario.id+'-'+p.en;const recorder=React.useRef<MediaRecorder|null>(null);const chunks=React.useRef<Blob[]>([]);const startRec=()=>{if(!navigator.mediaDevices?.getUserMedia){return}navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const r=new MediaRecorder(stream);recorder.current=r;chunks.current=[];r.ondataavailable=e=>chunks.current.push(e.data);r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());setAudio(URL.createObjectURL(new Blob(chunks.current,{type:'audio/webm'})));};r.start();setRecording(true)}).catch(()=>setRecording(false))};const stopRec=()=>{recorder.current?.stop();setRecording(false)};return <section className="page"><span className="eyebrow">REAL-LIFE SPEAKING</span><h1>Use English<br/><em>for something.</em></h1><p className="lead">Pick a situation. Listen to one phrase. Say it. You can record yourself locally if your browser allows it.</p><div className="scenarioRow">{scenarios.map(s=><button className={scenario.id===s.id?'active':''} key={s.id} onClick={()=>{setScenario(s);setI(0);setAudio(null)}}><b>{s.icon}</b><span>{s.title}</span></button>)}</div><div className="speakCard"><div className="scene"><span>{scenario.title}</span><small>{scenario.desc}</small></div><div className="conversation"><small>YOU</small><h2>{p.en}</h2><span>{p.es}</span></div><div className="bridgeLine"><span>BRIDGE</span><b>{p.say}</b></div><div className="listenRow"><button className="listen" onClick={()=>speak(p.en)}>🔊 Listen</button><button className={recording?'recording':''} onClick={recording?stopRec:startRec}>{recording?'■ Stop recording':'● Record yourself'}</button></div>{audio&&<audio controls src={audio}/>}<div className="actions"><button className="ghost" onClick={()=>{complete(id);setI(x=>x+1);setAudio(null)}}>Next phrase →</button><button className="primary" onClick={()=>{complete(id);rate(id,4);setI(x=>x+1);setAudio(null)}}>I said it ✓</button></div></div><div className="studentFeedback"><span className="eyebrow">QUICK FEEDBACK</span><h3>Tell us what felt strange.</h3><div className="feedbackBtns"><button onClick={()=>feedback('The bridge made it easier')}>It made it easier</button><button onClick={()=>feedback('I preferred hearing English first')}>I needed the English first</button><button onClick={()=>feedback('The spelling looked confusing')}>The spelling confused me</button></div><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Anything else? (optional)"/><button className="ghost" onClick={()=>{if(comment.trim())feedback(comment.trim());setComment('')}}>Send feedback</button></div></section>}

function Words({speak,feedback}:{speak:(v:string)=>void;feedback:(v:string)=>void}){const [query,setQuery]=useState('');const [text,setText]=useState('');const result=useMemo(()=>query?words.filter(w=>w.en.toLowerCase().includes(query.toLowerCase())||w.es.toLowerCase().includes(query.toLowerCase())).slice(0,8):words.slice(0,10),[query]);return <section className="page"><span className="eyebrow">WORD LAB</span><h1>Find a word.<br/><em>Hear how it moves.</em></h1><p className="lead">Search the reviewed bridge library. Then test a phrase from your own class.</p><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: three, water, café…"/></div><div className="wordList">{result.map(w=><button key={w.en+w.say} onClick={()=>speak(w.en)}><span>{w.en}</span><em>{w.say}</em><small>{w.es} · {w.sound}</small></button>)}</div><div className="phraseTester"><span className="eyebrow">BRIDGE TESTER</span><h2>Type a phrase.</h2><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="I would like a coffee, please."/><div className="testResult"><span>REVIEWED WORDS ONLY</span><strong>{text?bridgePhrase(text):'Your bridge will appear here.'}</strong><small>Unknown words stay unchanged. That is deliberate: a guess should never look like a trusted pronunciation lesson.</small></div></div><button className="tinyReport" onClick={()=>feedback('Student found a word or bridge that should be corrected')}>Found a mistake? Tell the teacher →</button></section>}

function Progress({state,setTab}:{state:State;setTab:(v:string)=>void}){const ratings=Object.values(state.ratings);const helpful=ratings.length?Math.round(ratings.reduce((a,b)=>a+b,0)/ratings.length*25):0;return <section className="page"><span className="eyebrow">YOUR SPACE</span><h1>You're building<br/><em>your English.</em></h1><div className="stats"><div><strong>{state.done}</strong><span>practice moments</span></div><div><strong>{state.learned.length}</strong><span>things tried</span></div><div><strong>{helpful}%</strong><span>bridge helpfulness</span></div></div><div className="progressPanel"><span className="eyebrow">WHAT TO DO NEXT</span><h2>Keep meeting the sounds that give you trouble.</h2><p>BocaSpeak will eventually use your history to shape your lessons. For now, use the sound check and real-life phrases to discover what helps.</p><div className="nextActions"><button onClick={()=>setTab('bridge')}>Sound check →</button><button onClick={()=>setTab('phrases')}>Speak a situation →</button></div></div><div className="privacyBox"><b>Your data in this prototype</b><span>Your practice count, ratings and feedback are stored locally in this browser. No student account or cloud profile is required for this test.</span></div></section>}

function Teacher({setTeacher,state}:{setTeacher:(v:boolean)=>void;state:State}){const [view,setView]=useState('dashboard');const helpful=Object.values(state.ratings);const avg=helpful.length?(helpful.reduce((a,b)=>a+b,0)/helpful.length).toFixed(1):'—';return <div className="teacherShell"><header><div className="brand"><span className="mark"><i></i><i></i></span><span>Boca<span>Speak</span> <small>STUDIO</small></span></div><button className="teacherBtn" onClick={()=>setTeacher(false)}>Student App ↙</button></header><div className="teacherLayout"><aside>{[['dashboard','Overview'],['students','Students'],['lessons','Lessons'],['builder','Lesson Builder'],['sounds','Pronunciation'],['library','Teaching Library']].map(([id,l])=><button className={view===id?'sel':''} onClick={()=>setView(id)} key={id}>{l}</button>)}</aside><main className="teacherMain">{view==='dashboard'?<><span className="eyebrow">TEACHER STUDIO · PROTOTYPE CLASS</span><h1>Watch the test, not just the score.</h1><div className="teacherGrid"><div className="teacherStat"><span>Practice moments</span><b>{state.done}</b><small>on this device</small></div><div className="teacherStat"><span>Bridge ratings</span><b>{avg}</b><small>out of 4</small></div><div className="teacherStat alert"><span>Words reviewed</span><b>{state.learned.length}</b><small>student actions</small></div></div><div className="panel"><div className="panelHead"><div><span className="eyebrow">PRONUNCIATION LIBRARY</span><h2>{words.length} curated entries · {phrases.length} phrases</h2></div><span>Prototype</span></div><p>The important next step is not adding random vocabulary. It is reviewing the bridge spellings with real Spanish-speaking students and recording where they help, confuse or create the wrong sound.</p><div className="barRow"><b>TH</b><span>high-priority test set</span><i><em style={{width:'82%'}}></em></i></div><div className="barRow"><b>W / V</b><span>common transfer pattern</span><i><em style={{width:'70%'}}></em></i></div><div className="barRow"><b>Final sounds</b><span>needs real learner testing</span><i><em style={{width:'58%'}}></em></i></div></div><div className="panel split"><div><span className="eyebrow">STUDENT FEEDBACK CAPTURED</span><h2>{state.feedback.length} comments</h2><p>In the full teacher system, these become class-level patterns and bridge revisions.</p></div><button className="primary">Review feedback →</button></div></>:<div className="coming"><div>◌</div><h2>{view.replace(/(^|_)/g,' ')}</h2><p>Prototype area ready for the teacher system: student profiles, versioned lessons, editable bridge entries, assignments, pronunciation patterns and class analysis.</p></div>}</main></div></div>}

createRoot(document.getElementById('root')!).render(<App/>);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is best-effort in this prototype.
    });
  });
}

