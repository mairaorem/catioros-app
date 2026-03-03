import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "cachorro_obediente_v1";
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

const doG = g => g === "F" ? "da" : "do";
const aG  = g => g === "F" ? "a"  : "o";

const PHASES = [
  { id:1, name:"Fundamentos",            color:"#4CAF50", emoji:"🌱", days:[1,2,3,4,5,6,7] },
  { id:2, name:"Comandos Essenciais",    color:"#FF9800", emoji:"⭐", days:[8,9,10,11,12,13,14,15] },
  { id:3, name:"Comportamentos",         color:"#2196F3", emoji:"🎯", days:[16,17,18,19,20,21,22,23] },
  { id:4, name:"Vínculo & Consolidação", color:"#9C27B0", emoji:"❤️", days:[24,25,26,27,28,29,30] },
];

const DAYS = {
  1:  { theme:"Liderança Calma", phase:1, intro:"Seu cachorro precisa saber que você guia a rotina. Cães se sentem seguros quando há um líder claro e gentil.", tip:"Liderança não é dominação – é consistência e calma.", exercise:"Antes da refeição, peça que sente e espere 5 segundos.", steps:["Segure o pote na altura do peito","Diga 'Senta' com voz firme e calma","Espere sentar – não repita o comando","Conte 5 segundos em silêncio","Coloque o pote e diga 'Pode'"], duration:"10 min", icon:"👑" },
  2:  { theme:"Construindo Confiança", phase:1, intro:"A confiança é a base de tudo. Hoje vamos criar um momento especial de conexão.", tip:"Seu cachorro aprende a confiar em você observando cada movimento seu.", exercise:"5 minutos de carinho consciente — sem celular.", steps:["Sente no chão ao nível do cachorro","Ofereça a mão para farejar primeiro","Faça carinho suave nas costas e pescoço","Fale com voz tranquila","Observe: relaxado ou tenso?"], duration:"10 min", icon:"🤝" },
  3:  { theme:"Rotina de Alimentação", phase:1, intro:"Horários fixos de refeição ensinam paciência e reforçam sua liderança.", tip:"Cães com rotina previsível ficam menos ansiosos e mais obedientes.", exercise:"Defina horários fixos de alimentação e pratique o aguardo.", steps:["Defina dois horários fixos (ex: 7h e 19h)","Peça 'Senta' antes de cada refeição","Pratique aguardo de 5 a 10 segundos","Sempre diga 'Pode' para liberar","Mantenha consistência todos os dias"], duration:"10 min", icon:"🍽️" },
  4:  { theme:"Memória & Associação", phase:1, intro:"Seu cachorro aprende por associação. Experiências positivas criam memórias duradouras.", tip:"Recompense imediatamente — a janela é de apenas 2 segundos.", exercise:"5 sequências de ação + petisco + elogio verbal.", steps:["Pegue 5 petiscos pequenos","Peça qualquer comportamento simples","Diga 'Muito bem!' com entusiasmo","Ofereça o petisco imediatamente","Repita 5 vezes com ações diferentes"], duration:"10 min", icon:"🧠" },
  5:  { theme:"Limites da Casa", phase:1, intro:"Limites claros dão segurança ao seu cão. Ele precisa saber o que pode e o que não pode.", tip:"Consistência é tudo. Decida as regras e mantenha sempre.", exercise:"Defina 2 regras claras e pratique uma delas hoje.", steps:["Escolha: pode subir no sofá? pode entrar no quarto?","Decida e anote as regras","Pratique: se não pode subir, redirecione gentilmente","Use 'Não' com voz firme (não gritando)","Recompense quando obedecer"], duration:"10 min", icon:"🏠" },
  6:  { theme:"Leitura de Sinais", phase:1, intro:"Cães se comunicam com o corpo. Aprender a ler os sinais transforma o relacionamento.", tip:"Cauda baixa = medo. Cauda alta rígida = alerta. Balançando = felicidade.", exercise:"Observe seu cão por 5 minutos e anote 3 comportamentos.", steps:["Sente em silêncio e observe sem interagir","Note posição da cauda, orelhas e postura","Anote o que fez e em qual contexto","Identifique: feliz, ansioso ou curioso?","Compartilhe com a família"], duration:"10 min", icon:"👀" },
  7:  { theme:"Revisão da Semana 1", phase:1, intro:"Primeira semana concluída! Hoje revisamos tudo que foi aprendido.", tip:"O progresso é cumulativo. Cada dia conta.", exercise:"Pratique todas as habilidades da semana em 10 minutos.", steps:["Refeição com 'Senta' e aguardo","Sessão de carinho de 2 minutos","5 repetições de ação + recompensa","Teste uma regra da casa","Celebre com brincadeira especial!"], duration:"10 min", icon:"🏆" },
  8:  { theme:"Comando: SENTA", phase:2, intro:"O 'Senta' é o mais importante. É a base para todos os outros comandos.", tip:"Nunca force fisicamente. Use o petisco para guiar o movimento.", exercise:"10 repetições do 'Senta' com reforço positivo.", steps:["Segure petisco na altura do nariz","Mova para cima e atrás da cabeça","Quando o traseiro tocar o chão, diga 'Senta!'","Recompense imediatamente","Repita 10 vezes, reduzindo o petisco"], duration:"10 min", icon:"⬇️" },
  9:  { theme:"Comando: FICA", phase:2, intro:"O 'Fica' ensina autocontrole. Comece com segundos e aumente gradualmente.", tip:"Se quebrar o 'fica', não recompense. Recomece sem punição.", exercise:"Pratique 'Senta' + 'Fica' com distância crescente.", steps:["Peça 'Senta'","Mostre a palma da mão: 'Fica'","Dê um passo atrás","Volte e recompense após 3 segundos","Aumente para 5, 10 segundos"], duration:"10 min", icon:"✋" },
  10: { theme:"Comando: VEM", phase:2, intro:"O 'Vem' pode salvar a vida do seu cão. Sempre associe a algo muito positivo.", tip:"Nunca chame com 'Vem' e faça algo que não gosta. Mantenha positivo.", exercise:"Pratique 'Vem' em distâncias curtas com recompensa exagerada.", steps:["Coloque-se a 2 metros","Agache, abra os braços e diga 'Vem!' animado","Quando chegar, festeje MUITO","Aumente a distância gradualmente","Pratique em cômodos diferentes"], duration:"10 min", icon:"📣" },
  11: { theme:"Comando: DEITA", phase:2, intro:"O 'Deita' aprofunda o autocontrole e requer mais confiança.", tip:"Não force. Guie com petisco em direção ao chão em forma de 'L'.", exercise:"10 repetições de 'Senta' seguido de 'Deita'.", steps:["Peça 'Senta' primeiro","Segure petisco no nariz e mova ao chão","Quando deitar, diga 'Deita!' e recompense","Se resistir, pratique em superfície macia","Combine: Senta → Deita → Fica"], duration:"10 min", icon:"🛏️" },
  12: { theme:"Comando: NÃO", phase:2, intro:"O 'Não' interrompe comportamentos indesejados. Claro, mas nunca agressivo.", tip:"Diga 'Não' uma vez com voz firme. Repetir muitas vezes perde o efeito.", exercise:"Pratique interromper um comportamento e redirecionar.", steps:["Identifique um comportamento indesejado","Quando iniciar, diga 'Não' uma vez","Redirecione para outro comportamento","Recompense o comportamento alternativo","Nunca recompense logo após o 'Não'"], duration:"10 min", icon:"🚫" },
  13: { theme:"Andar sem Puxar", phase:2, intro:"Puxar a guia é frustrantíssimo. A solução: simplesmente parar.", tip:"Seu cachorro aprende que puxar não leva a lugar nenhum.", exercise:"Passeio de 10 minutos praticando a técnica da parada.", steps:["Comece a caminhar com a guia","Assim que puxar, PARE completamente","Aguarde voltar ao seu lado","Continue quando a guia estiver folgada","Recompense cada vez que andar ao lado"], duration:"10 min", icon:"🦮" },
  14: { theme:"Comando: SILÊNCIO", phase:2, intro:"O segredo para latidos: recompensar o silêncio, não punir o latido.", tip:"Gritar 'Para!' aumenta o estresse. Calma transmite calma.", exercise:"Pratique 'Silêncio' em situação controlada.", steps:["Identifique o gatilho do latido","Quando latir, diga 'Silêncio' com voz calma","Aguarde o primeiro segundo de silêncio","Recompense imediatamente","Repita 5–8 vezes na sessão"], duration:"10 min", icon:"🤫" },
  15: { theme:"Revisão de Comandos", phase:2, intro:"6 comandos ensinados! Hoje fazemos uma revisão geral.", tip:"Revisar comandos já aprendidos é tão importante quanto aprender novos.", exercise:"Pratique todos os 6 comandos em sequência.", steps:["SENTA – 3 repetições","FICA – 10 segundos de distância","VEM – de outra parte da casa","DEITA – após o senta","NÃO – redirecionar comportamento","SILÊNCIO – se possível"], duration:"10 min", icon:"📋" },
  16: { theme:"Latidos: Entendendo a Causa", phase:3, intro:"Todo latido tem uma causa. Entender o porquê é o primeiro passo.", tip:"Cães latem por excitação, medo, tédio ou alerta. Cada causa tem solução.", exercise:"Identifique o padrão de latidos hoje.", steps:["Anote 3 momentos em que latiu","Identifique: medo, excitação, alerta ou tédio?","Note o que aconteceu antes","Note o que fez parar","Use esse conhecimento nas próximas sessões"], duration:"10 min", icon:"🔊" },
  17: { theme:"Ansiedade de Separação", phase:3, intro:"Cães ansiosos não são desobedientes – estão com medo. Exposição gradual resolve.", tip:"Saídas e chegadas dramáticas aumentam a ansiedade. Seja discreto.", exercise:"Pratique micro-separações de 1 a 5 minutos.", steps:["Deixe em um cômodo sem drama","Saia por 1 minuto e volte calmamente","Não consolide agitação – aguarde acalmar","Aumente: 1, 2, 5 minutos","Recompense calma, não agitação"], duration:"10 min", icon:"😰" },
  18: { theme:"Destruição de Objetos", phase:3, intro:"Mastigar é instintivo. O problema não é mastigar – é o que mastiga.", tip:"Mais exercício = menos destruição. Cães destroem por tédio e ansiedade.", exercise:"Redirecione o instinto de mastigar para brinquedos.", steps:["Separe 2–3 brinquedos de mastigar","Quando mastigar errado, diga 'Não' e ofereça o brinquedo","Quando mastigar o brinquedo, elogie muito","Aumente o exercício físico diário","Guarde objetos valiosos fora do alcance"], duration:"10 min", icon:"🦴" },
  19: { theme:"Pular nas Pessoas", phase:3, intro:"Cães pulam por excitação. Solução: não dar atenção quando pula.", tip:"Virar as costas é mais eficaz do que empurrar.", exercise:"Pratique ignorar o pulo com 3 pessoas diferentes.", steps:["Quando pular, vire as costas completamente","Cruce os braços e olhe para cima","Aguarde as 4 patas no chão","Recompense imediatamente com atenção","Peça que visitantes façam o mesmo"], duration:"10 min", icon:"🙅" },
  20: { theme:"Ciúmes e Novos Membros", phase:3, intro:"Quando algo novo chega, seu cão pode sentir que perdeu seu lugar.", tip:"Mantenha a rotina estável. Ele precisa saber que seu lugar é seguro.", exercise:"Pratique interações supervisionadas com o elemento novo.", steps:["Mantenha atenção e carinho ao cão","Apresente novidades de forma gradual","Recompense comportamentos calmos","Nunca force interação","Sempre termine em algo positivo"], duration:"10 min", icon:"💚" },
  21: { theme:"Medo de Barulhos", phase:3, intro:"Trovões, fogos, aspirador: sons assustam. Dessensibilização gradual funciona.", tip:"Não console excessivamente – pode reforçar o medo. Aja com normalidade.", exercise:"Pratique exposição gradual a um som que assusta.", steps:["Identifique o som que mais assusta","Reproduza em volume muito baixo com petiscos","Aumente o volume gradualmente","Mantenha comportamento neutro e calmo","Se reagir muito, diminua o volume"], duration:"10 min", icon:"⚡" },
  22: { theme:"Comportamento com Crianças", phase:3, intro:"Cães e crianças podem ser melhores amigos com orientação adequada.", tip:"Ensine as crianças também: não correr na frente, não incomodar na hora de comer.", exercise:"Pratique interação supervisionada criança-cão.", steps:["Ensine a criança a oferecer petisco com mão aberta","Peça 'Senta' antes da interação","Deixe farejar no próprio ritmo","Recompense comportamentos calmos","Encerre antes de qualquer agitação"], duration:"10 min", icon:"👶" },
  23: { theme:"Revisão de Comportamentos", phase:3, intro:"Metade final! Hoje avaliamos o progresso nos comportamentos desafiadores.", tip:"Uma melhora de 30% já é uma vitória. Progresso não precisa ser perfeito.", exercise:"Teste um comportamento problemático da semana 1.", steps:["Lembre o maior desafio do início","Pratique a técnica aprendida","Anote uma melhoria percebida","Recompense muito qualquer progresso","Defina objetivo para a última semana"], duration:"10 min", icon:"📊" },
  24: { theme:"Jogos Mentais", phase:4, intro:"Estimulação mental cansa tanto quanto a física. Cão estimulado é cão equilibrado.", tip:"15 min de estimulação mental = 30 min de exercício físico em efeito calmante.", exercise:"Crie um caça ao tesouro com petiscos pela casa.", steps:["Mostre o petisco e esconda em 3 locais fáceis","Diga 'Procura!' e observe cheirar","Aumente a dificuldade gradualmente","Use um Kong recheado como desafio extra","Celebre cada descoberta com entusiasmo"], duration:"10 min", icon:"🧩" },
  25: { theme:"Caminhada Estruturada", phase:4, intro:"Uma boa caminhada não é só exercício – é aprendizado e vínculo.", tip:"Permita que cheire por 30% do tempo. Cheirar é o 'Instagram' dele.", exercise:"Caminhada de 20 min com prática de comandos.", steps:["Inicie com 'Senta' antes da guia","A cada 5 min, pratique um comando","Permita tempo livre para cheirar","Pratique 'Vem' quando ficar para trás","Termine com elogio e brincadeira"], duration:"20 min", icon:"🌳" },
  26: { theme:"Truques Divertidos", phase:4, intro:"Truques fortalecem o vínculo. Hoje: dá a patinha!", tip:"Truques são treinamento disfarçado de brincadeira.", exercise:"Ensine 'Dá a patinha' em 10 minutos.", steps:["Peça 'Senta'","Segure petisco no punho fechado","Aguarde usar a pata para investigar","Quando tocar o punho, abra e dê o petisco","Adicione o comando 'Patinha'"], duration:"10 min", icon:"🐾" },
  27: { theme:"Reforço Espontâneo", phase:4, intro:"Surpreender com recompensas por bom comportamento espontâneo é muito poderoso.", tip:"Recompensas imprevisíveis são mais motivadoras que as previstas.", exercise:"Surpreenda com 5 recompensas por comportamentos não pedidos.", steps:["Observe ao longo do dia","Viu comportamento positivo? Recompense na hora","Ex: ficou quieto quando alguém chegou → petisco","Ex: pegou brinquedo em vez do sapato → elogio exagerado","Anote o que recompensou"], duration:"10 min", icon:"🎁" },
  28: { theme:"Socialização Controlada", phase:4, intro:"Encontros positivos com outros cães fortalecem a confiança social.", tip:"Nunca force interação. Deixe o cão escolher aproximar.", exercise:"Aproveite um encontro com outro cão ou pessoa nova.", steps:["Encontre em espaço neutro","Deixe cheirarem em guia folgada","Observe sinais de conforto ou estresse","Se estressado, aumente a distância","Termine sempre em experiência positiva"], duration:"15 min", icon:"🤝" },
  29: { theme:"Preparando o Diploma", phase:4, intro:"Amanhã é o grande dia! Revisão completa de tudo que foi aprendido.", tip:"Compare com o Dia 1. A transformação é real, mesmo que gradual.", exercise:"Sessão completa com todos os comandos.", steps:["Senta, Fica, Vem, Deita, Não, Silêncio","Andar sem puxar por 5 minutos","Um truque (patinha ou outro)","Recompense generosamente","Tire uma foto para registrar!"], duration:"15 min", icon:"📸" },
  30: { theme:"🎉 Dia da Formatura!", phase:4, intro:"Você fez isso! 30 dias de dedicação, amor e paciência. Vocês são parceiros!", tip:"Continue praticando diariamente, mesmo que por 5 minutos.", exercise:"Sessão especial de celebração!", steps:["Sessão dos comandos preferidos","Brincadeira especial – o que mais ama?","Caminhada em local novo","Foto oficial do formando 🐶","Compartilhe com alguém especial"], duration:"20 min", icon:"🎓" },
};

const CHALLENGES = [
  { id:"late",    label:"Late demais",       icon:"🔊" },
  { id:"puxa",    label:"Puxa a guia",       icon:"🦮" },
  { id:"morde",   label:"Morde móveis",      icon:"🦴" },
  { id:"ansioso", label:"Ansioso",           icon:"😰" },
  { id:"basico",  label:"Obediência básica", icon:"⭐" },
];

// ── ADSENSE ───────────────────────────────────────────────────────────────────
function AdBanner() {
  const ref = useRef(null);
  useEffect(() => {
    try {
      if (ref.current && ref.current.offsetWidth > 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch(e) {}
  }, []);
  return (
    <div ref={ref} style={{margin:"0 0 20px",borderRadius:12,overflow:"hidden",minHeight:90}}>
      <ins className="adsbygoogle"
        style={{display:"block"}}
        data-ad-client="ca-pub-8839206023504725"
        data-ad-slot="1419320305"
        data-ad-format="auto"
        data-full-width-responsive="true"/>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#FFF8F0;--warm:#FFF0E0;--bl:#C8956A;--b:#8B5E3C;--bd:#5C3D2E;
  --green:#4CAF50;--text:#3D2B1F;--soft:#7A5C4A;
  --sh:0 4px 20px rgba(92,61,46,.12);--r:20px;
}
body{font-family:'Nunito',sans-serif;background:var(--cream);color:var(--text);min-height:100vh;}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--cream);}

/* INSTALL BANNER */
.install-banner{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:398px;background:#5C3D2E;border-radius:18px;padding:16px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(92,61,46,.35);z-index:200;animation:slideUp .4s ease;}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.install-icon{font-size:32px;flex-shrink:0;}
.install-text{flex:1;}
.install-title{color:white;font-size:14px;font-weight:800;margin-bottom:2px;}
.install-sub{color:rgba(255,255,255,.7);font-size:12px;line-height:1.4;}
.install-btn{background:#FFD54F;color:#5C3D2E;border:none;border-radius:50px;padding:8px 14px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer;white-space:nowrap;flex-shrink:0;}
.install-close{background:none;border:none;color:rgba(255,255,255,.5);font-size:18px;cursor:pointer;padding:4px;flex-shrink:0;line-height:1;}

/* ONBOARD */
.ob{padding:28px 24px 48px;min-height:100vh;display:flex;flex-direction:column;animation:fu .5s ease;}
.ob-hd{text-align:center;margin-bottom:24px;}
.ob-logo{width:120px;margin-bottom:12px;}
.ob h1{font-family:'Fraunces',serif;font-size:22px;color:var(--bd);line-height:1.3;}
.ob p{color:var(--soft);margin-top:6px;font-size:13px;}
.fs{background:white;border-radius:var(--r);padding:18px;margin-bottom:12px;box-shadow:var(--sh);}
.fl{font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--b);margin-bottom:10px;display:block;}
.ti{width:100%;padding:13px 15px;border:2px solid #F0E0D0;border-radius:12px;font-family:'Nunito',sans-serif;font-size:16px;color:var(--text);outline:none;transition:border-color .2s;background:var(--cream);}
.ti:focus{border-color:var(--bl);}
.cg{display:flex;flex-wrap:wrap;gap:7px;}
.ch{padding:9px 15px;border-radius:50px;border:2px solid #F0E0D0;background:var(--cream);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:var(--soft);cursor:pointer;transition:all .2s;}
.ch.on{border-color:var(--b);background:var(--b);color:white;}
.chm{padding:10px 12px;border-radius:12px;border:2px solid #F0E0D0;background:var(--cream);font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;color:var(--soft);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:5px;}
.chm.on{border-color:var(--bl);background:var(--warm);color:var(--bd);}
.btnp{width:100%;padding:17px;border-radius:50px;border:none;background:var(--bd);color:white;font-family:'Nunito',sans-serif;font-size:17px;font-weight:800;cursor:pointer;transition:transform .1s,opacity .2s;margin-top:8px;}
.btnp:active{transform:scale(.98);}
.btnp:disabled{opacity:.4;cursor:not-allowed;}

/* HOME */
.home{min-height:100vh;padding-bottom:80px;animation:fu .4s ease;}
.hh{background:linear-gradient(160deg,#5C3D2E 0%,#8B5E3C 100%);padding:24px 24px 72px;position:relative;overflow:hidden;}
.hh::before{content:'🐾';position:absolute;right:-8px;top:8px;font-size:90px;opacity:.07;transform:rotate(15deg);}
.hh-logo{height:28px;margin-bottom:16px;opacity:.9;display:block;}
.aw{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.av{width:50px;height:50px;border-radius:50%;border:3px solid rgba(255,255,255,.35);overflow:hidden;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;}
.av img{width:100%;height:100%;object-fit:cover;}
.gr{font-family:'Fraunces',serif;font-size:19px;color:#FFE4CC;}
.gr strong{color:white;font-size:25px;display:block;}
.db{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border-radius:50px;padding:5px 12px;color:white;font-size:12px;font-weight:700;margin-top:10px;}
.pbw{margin-top:12px;background:rgba(255,255,255,.2);border-radius:50px;height:7px;overflow:hidden;}
.pbf{height:100%;border-radius:50px;background:linear-gradient(90deg,#FFD54F,#FFAB40);transition:width .6s cubic-bezier(.4,0,.2,1);}
.pl{color:rgba(255,255,255,.75);font-size:11px;margin-top:5px;}
.hb{padding:22px;margin-top:-44px;}
.tc{background:white;border-radius:22px;padding:20px;box-shadow:0 8px 28px rgba(92,61,46,.15);margin-bottom:20px;}
.tp{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.tt{font-family:'Fraunces',serif;font-size:20px;color:var(--bd);margin-bottom:8px;}
.ti2{color:var(--soft);font-size:13px;line-height:1.6;margin-bottom:14px;}
.mr{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
.mc{background:var(--cream);border-radius:50px;padding:5px 10px;font-size:11px;font-weight:700;color:var(--soft);}
.bts{width:100%;padding:14px;border-radius:50px;border:none;background:linear-gradient(135deg,#8B5E3C,#C8956A);color:white;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:transform .1s;display:flex;align-items:center;justify-content:center;gap:7px;}
.bts:active{transform:scale(.98);}
.bts.done{background:linear-gradient(135deg,#4CAF50,#66BB6A);}
.st{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--soft);margin-bottom:10px;}

/* CARROSSEL COM SETAS */
.pr-outer{position:relative;margin:0 -4px;}
.pr-arrow{position:absolute;top:50%;transform:translateY(-55%);width:32px;height:32px;border-radius:50%;background:white;border:2px solid #E8D5C5;box-shadow:0 2px 10px rgba(92,61,46,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;font-weight:900;color:var(--b);z-index:10;transition:all .15s;padding:0;line-height:1;}
.pr-arrow:hover{background:var(--warm);border-color:var(--bl);transform:translateY(-55%) scale(1.08);}
.pr-arrow.left{left:-6px;}
.pr-arrow.right{right:-6px;}
.pr{display:flex;gap:9px;overflow-x:auto;padding:4px 20px 8px;scrollbar-width:none;scroll-behavior:smooth;}
.pr::-webkit-scrollbar{display:none;}
.pc{flex:0 0 auto;background:white;border-radius:14px;padding:12px 14px;box-shadow:0 2px 10px rgba(92,61,46,.08);min-width:105px;cursor:pointer;transition:transform .1s;border:2px solid transparent;}
.pc:active{transform:scale(.96);}
.pc.on{border-color:var(--bl);}
.pe{font-size:20px;margin-bottom:4px;}
.pn{font-size:10px;font-weight:800;color:var(--soft);margin-bottom:3px;}
.pp{font-size:12px;font-weight:800;}

/* DAY DETAIL */
.dd{min-height:100vh;padding-bottom:100px;animation:fu .3s ease;}
.dh{padding:44px 24px 16px;}
.bb{background:none;border:none;font-size:13px;font-weight:700;color:var(--b);cursor:pointer;display:flex;align-items:center;gap:4px;padding:0;margin-bottom:16px;}
.dib{font-size:46px;display:block;margin-bottom:12px;}
.dn{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--bl);margin-bottom:3px;}
.dt{font-family:'Fraunces',serif;font-size:24px;color:var(--bd);}
.db2{padding:0 24px;}
.cd{background:white;border-radius:18px;padding:18px;margin-bottom:12px;box-shadow:var(--sh);}
.ct{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--bl);margin-bottom:8px;}
.cx{color:var(--text);font-size:14px;line-height:1.6;}
.tip{background:#FFF8E1;border-left:4px solid #FFB300;}
.tip .ct{color:#B8860B;}
.sl{list-style:none;}
.si{display:flex;align-items:flex-start;gap:10px;padding:10px 4px;border-bottom:1px solid #F5EDE5;cursor:pointer;border-radius:8px;}
.si:last-child{border-bottom:none;}
.si:active{background:#FFF5EE;}
.sc{width:26px;height:26px;border-radius:50%;border:2px solid #E8D5C5;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--b);flex-shrink:0;transition:all .2s;margin-top:2px;}
.sc.done{background:var(--green);border-color:var(--green);color:white;}
.sx{font-size:13px;line-height:1.5;color:var(--text);padding-top:3px;flex:1;}
.sx.done{opacity:.4;text-decoration:line-through;}
.spw{display:flex;align-items:center;gap:9px;margin-top:12px;padding-top:12px;border-top:1px solid #F0E0D0;}
.sbw{flex:1;height:5px;background:#F0E0D0;border-radius:50px;overflow:hidden;}
.sbf{height:100%;border-radius:50px;background:linear-gradient(90deg,var(--green),#66BB6A);transition:width .3s;}
.sbl{font-size:11px;font-weight:800;color:var(--soft);white-space:nowrap;}
.cbw{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;padding:14px 22px;background:linear-gradient(to top,var(--cream) 80%,transparent);z-index:50;}

/* CALENDAR */
.cal{padding:44px 24px 100px;animation:fu .3s ease;}
.cal h2{font-family:'Fraunces',serif;font-size:22px;color:var(--bd);margin-bottom:3px;}
.cal p{font-size:12px;color:var(--soft);margin-bottom:10px;}
.obw{background:#F0E0D0;border-radius:50px;height:9px;overflow:hidden;margin-bottom:5px;}
.obf{height:100%;border-radius:50px;background:linear-gradient(90deg,#8B5E3C,#C8956A);transition:width .6s;}
.ol{font-size:11px;font-weight:800;color:var(--soft);margin-bottom:22px;}
.phs{margin-bottom:24px;}
.phc{display:flex;align-items:center;gap:7px;margin-bottom:8px;}
.phtc{font-size:13px;font-weight:800;color:var(--soft);flex:1;}
.phb{font-size:10px;font-weight:800;padding:3px 9px;border-radius:50px;color:white;}
.psbw{height:5px;background:#F0E0D0;border-radius:50px;overflow:hidden;margin-bottom:10px;}
.psbf{height:100%;border-radius:50px;transition:width .5s;}
.dg{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;}
.ddot{aspect-ratio:1;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;cursor:pointer;transition:transform .1s;border:2px solid transparent;background:white;box-shadow:0 2px 6px rgba(92,61,46,.07);}
.ddot:active{transform:scale(.88);}
.ddot.comp{background:var(--green);box-shadow:0 2px 8px rgba(76,175,80,.3);}
.ddot.tod{border-color:var(--b);background:var(--warm);}
.ddot.lock{opacity:.3;cursor:default;}
.ddn{font-size:12px;font-weight:800;color:var(--text);}
.ddot.comp .ddn{color:white;}
.ddi{font-size:9px;}

/* PROFILE */
.prof{padding:44px 24px 100px;animation:fu .3s ease;}
.prof h2{font-family:'Fraunces',serif;font-size:22px;color:var(--bd);margin-bottom:18px;}
.pas{display:flex;flex-direction:column;align-items:center;margin-bottom:22px;}
.bav{width:96px;height:96px;border-radius:50%;border:4px solid var(--bl);overflow:hidden;background:var(--warm);display:flex;align-items:center;justify-content:center;font-size:44px;cursor:pointer;transition:transform .15s;box-shadow:0 4px 16px rgba(139,94,60,.2);}
.bav:active{transform:scale(.96);}
.bav img{width:100%;height:100%;object-fit:cover;}
.ah{font-size:11px;color:var(--bl);font-weight:700;margin-top:7px;}
.pcard{background:white;border-radius:18px;padding:18px;box-shadow:var(--sh);margin-bottom:12px;}
.prow{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #F5EDE5;}
.prow:last-child{border-bottom:none;}
.pk{font-size:12px;font-weight:800;color:var(--soft);}
.pv{font-size:13px;font-weight:700;color:var(--text);}
.ctags{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;}
.ctag{font-size:11px;font-weight:700;background:var(--warm);color:var(--bd);padding:4px 9px;border-radius:50px;}
.btnr{width:100%;padding:13px;border-radius:50px;border:2px solid #F0E0D0;background:white;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;color:var(--soft);cursor:pointer;margin-top:6px;}

/* DIPLOMA */
.dipw{padding:44px 24px 100px;animation:fu .4s ease;}
.cert{background:white;border-radius:22px;padding:28px 20px;box-shadow:var(--sh);text-align:center;border:3px solid #FFD54F;position:relative;overflow:hidden;}
.cert::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(255,213,79,.1),transparent 60%);pointer-events:none;}
.cert-logo{width:90px;margin-bottom:4px;opacity:.9;}
.cmd{font-size:60px;margin-bottom:12px;display:block;}
.ctl{font-family:'Fraunces',serif;font-size:19px;color:var(--bd);margin-bottom:7px;}
.cst{color:var(--soft);font-size:13px;line-height:1.6;margin-bottom:14px;}
.cdn{font-family:'Fraunces',serif;font-style:italic;font-size:28px;color:var(--b);display:block;margin-bottom:7px;}
.cdt{font-size:11px;color:var(--soft);margin-bottom:18px;}
.cbg{display:inline-flex;align-items:center;gap:5px;background:#FFF8E1;border:2px solid #FFD54F;border-radius:50px;padding:7px 16px;font-size:13px;font-weight:700;color:#8B6914;}
.cert-url{margin-top:12px;font-size:11px;color:var(--bl);font-weight:700;}
.cav{width:72px;height:72px;border-radius:50%;border:3px solid #FFD54F;overflow:hidden;background:var(--warm);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:32px;}
.cav img{width:100%;height:100%;object-fit:cover;}
.clk{background:white;border-radius:22px;padding:28px 20px;text-align:center;box-shadow:var(--sh);}
.clki{font-size:52px;display:block;margin-bottom:12px;}
.clk h3{font-family:'Fraunces',serif;font-size:18px;color:var(--bd);margin-bottom:9px;}
.clk p{font-size:13px;color:var(--soft);line-height:1.6;margin-bottom:14px;}
.cpb{font-size:32px;font-weight:900;color:var(--b);}
.cpl{font-size:12px;color:var(--soft);}

/* NAV */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:white;border-top:1px solid #F0E0D0;display:flex;padding:8px 0 14px;box-shadow:0 -4px 18px rgba(92,61,46,.07);z-index:100;}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding:7px;border-radius:12px;background:none;border:none;}
.nic{font-size:20px;}
.nil{font-size:9px;font-weight:800;color:var(--soft);}
.ni.on .nil{color:var(--bd);}

@keyframes fu{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
`;

function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('install_dismissed')) return;
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIOS(ios);
    if (ios) {
      setTimeout(() => setShow(true), 3000);
    } else {
      const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setTimeout(() => setShow(true), 3000); };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSSteps(true); return; }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
    }
  };
  const handleDismiss = () => { setShow(false); localStorage.setItem('install_dismissed','1'); };
  if (!show) return null;

  if (showIOSSteps) return (
    <div className="install-banner" style={{flexDirection:'column',gap:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10,width:'100%'}}>
        <span className="install-icon">📱</span>
        <div className="install-text"><div className="install-title">Como salvar no iPhone:</div></div>
        <button className="install-close" onClick={handleDismiss}>✕</button>
      </div>
      <div style={{color:'rgba(255,255,255,.9)',fontSize:13,lineHeight:1.7,width:'100%'}}>
        1. Toque no ícone <strong style={{color:'#FFD54F'}}>compartilhar</strong> (quadrado com seta ↑)<br/>
        2. Role e toque em <strong style={{color:'#FFD54F'}}>"Adicionar à Tela de Início"</strong><br/>
        3. Toque em <strong style={{color:'#FFD54F'}}>"Adicionar"</strong>
      </div>
      <button className="install-btn" onClick={handleDismiss} style={{width:'100%',padding:10}}>Entendido! ✓</button>
    </div>
  );

  return (
    <div className="install-banner">
      <span className="install-icon">📲</span>
      <div className="install-text">
        <div className="install-title">Salvar na tela inicial</div>
        <div className="install-sub">Acesse como um app, sem precisar do navegador</div>
      </div>
      <button className="install-btn" onClick={handleInstall}>Salvar</button>
      <button className="install-close" onClick={handleDismiss}>✕</button>
    </div>
  );
}

export default function App() {
  const saved = loadState();
  const [screen,         setScreen]        = useState(saved ? "main" : "onboard");
  const [dogName,        setDogName]       = useState(saved?.dogName || "");
  const [gender,         setGender]        = useState(saved?.gender || "");
  const [age,            setAge]           = useState(saved?.age || "");
  const [size,           setSize]          = useState(saved?.size || "");
  const [challenges,     setChallenges]    = useState(saved?.challenges || []);
  const [currentDay,     setCurrentDay]    = useState(saved?.currentDay || 1);
  const [completedDays,  setCompletedDays] = useState(new Set(saved?.completedDays || []));
  const [viewingDay,     setViewingDay]    = useState(1);
  const [completedSteps, setCompletedSteps]= useState(new Set());
  const [nav,            setNav]           = useState("home");
  const [dogPhoto,       setDogPhoto]      = useState(saved?.dogPhoto || null);
  const photoRef    = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (screen === "onboard") return;
    saveState({ dogName, gender, age, size, challenges, currentDay, completedDays:[...completedDays], dogPhoto });
  }, [dogName, gender, age, size, challenges, currentDay, completedDays, dogPhoto, screen]);

  const canStart   = dogName.trim() && gender && age && size && challenges.length > 0;
  const progress   = completedDays.size;
  const phaseNow   = PHASES.find(p => p.days.includes(currentDay));
  const getColor   = id => ({1:"#4CAF50",2:"#FF9800",3:"#2196F3",4:"#9C27B0"}[id]||"#8B5E3C");
  const phaseColor = phaseNow ? getColor(phaseNow.id) : "#8B5E3C";
  const _do = doG(gender);
  const _a  = aG(gender);

  const scrollCarousel = dir => carouselRef.current?.scrollBy({left: dir * 140, behavior:'smooth'});
  const toggleCh   = id => setChallenges(p => p.includes(id) ? p.filter(c=>c!==id) : [...p,id]);
  const openDay    = d  => { setViewingDay(d); setCompletedSteps(new Set()); setScreen("day"); };
  const toggleStep = i  => setCompletedSteps(p => { const n=new Set(p); n.has(i)?n.delete(i):n.add(i); return n; });

  const completeDay = () => {
    const next = new Set(completedDays); next.add(viewingDay); setCompletedDays(next);
    if (viewingDay === currentDay && currentDay < 30) setCurrentDay(p=>p+1);
    setScreen("main"); setNav("home");
  };

  const handlePhoto = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setDogPhoto(ev.target.result); r.readAsDataURL(f);
  };

  const resetApp = () => {
    if (!window.confirm("Apagar todo o progresso e começar do zero?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setScreen("onboard"); setDogName(""); setGender(""); setAge(""); setSize("");
    setChallenges([]); setCurrentDay(1); setCompletedDays(new Set()); setDogPhoto(null);
  };

  const Av = ({sz=50}) => (
    <div className="av" style={{width:sz,height:sz,fontSize:sz*.46}}>
      {dogPhoto ? <img src={dogPhoto} alt={dogName}/> : "🐶"}
    </div>
  );

  const today = DAYS[currentDay];
  const view  = DAYS[viewingDay];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <InstallBanner/>

        {screen === "onboard" && (
          <div className="ob">
            <div className="ob-hd">
              <img src="/logo.png" className="ob-logo" alt="Catioros"/>
              <h1>30 Dias para um Cachorro Obediente</h1>
              <p>Conta tudo sobre seu cão para personalizar o programa!</p>
            </div>
            <div className="fs"><span className="fl">Nome do cachorro</span>
              <input className="ti" placeholder="Ex: Thor, Luna, Mel, Chicca..." value={dogName} onChange={e=>setDogName(e.target.value)}/>
            </div>
            <div className="fs"><span className="fl">Sexo</span>
              <div className="cg">{[["M","🐕 Macho"],["F","🐩 Fêmea"]].map(([v,l])=>(
                <button key={v} className={`ch ${gender===v?"on":""}`} onClick={()=>setGender(v)}>{l}</button>
              ))}</div>
            </div>
            <div className="fs"><span className="fl">Idade</span>
              <div className="cg">{["Filhote (até 1 ano)","Adulto (1–7 anos)","Idoso (7+ anos)"].map(a=>(
                <button key={a} className={`ch ${age===a?"on":""}`} onClick={()=>setAge(a)}>{a}</button>
              ))}</div>
            </div>
            <div className="fs"><span className="fl">Porte</span>
              <div className="cg">{["🐩 Pequeno","🐕 Médio","🦮 Grande"].map(s=>(
                <button key={s} className={`ch ${size===s?"on":""}`} onClick={()=>setSize(s)}>{s}</button>
              ))}</div>
            </div>
            <div className="fs"><span className="fl">Principais desafios (marque todos que se aplicam)</span>
              <div className="cg">{CHALLENGES.map(c=>(
                <button key={c.id} className={`chm ${challenges.includes(c.id)?"on":""}`} onClick={()=>toggleCh(c.id)}>{c.icon} {c.label}</button>
              ))}</div>
            </div>
            <button className="btnp" disabled={!canStart} onClick={()=>{setScreen("main");setNav("home");}}>
              Começar o programa 🐾
            </button>
          </div>
        )}

        {screen === "main" && (
          <>
            {nav === "home" && (
              <div className="home">
                <div className="hh">
                  <img src="/logo.png" className="hh-logo" alt="Catioros"/>
                  <div className="aw">
                    <Av sz={50}/>
                    <div>
                      <div className="gr">Hora do treino {_do}</div>
                      <div className="gr"><strong>{dogName} {today.icon}</strong></div>
                    </div>
                  </div>
                  <div className="db">📅 Dia {currentDay} de 30</div>
                  <div className="pbw"><div className="pbf" style={{width:`${(progress/30)*100}%`}}/></div>
                  <div className="pl">{progress} de 30 dias · {Math.round((progress/30)*100)}%</div>
                </div>
                <div className="hb">
                  <div className="tc">
                    <div className="tp" style={{color:phaseColor}}>{phaseNow?.emoji} Etapa {phaseNow?.id} – {phaseNow?.name} · Dia {currentDay}</div>
                    <div className="tt">{today.theme}</div>
                    <div className="ti2">{today.intro}</div>
                    <div className="mr">
                      <div className="mc">⏱ {today.duration}</div>
                      <div className="mc">{gender==="F"?"🐩 Fêmea":"🐕 Macho"}</div>
                      <div className="mc">{size.split(" ").slice(1).join(" ")}</div>
                    </div>
                    <button className={`bts ${completedDays.has(currentDay)?"done":""}`} onClick={()=>openDay(currentDay)}>
                      {completedDays.has(currentDay) ? "✅ Treino concluído!" : `▶ Treinar com ${_a} ${dogName} hoje`}
                    </button>
                  </div>

                  {/* CARROSSEL COM SETAS */}
                  <div style={{marginBottom:20}}>
                    <div className="st">Etapas do programa</div>
                    <div className="pr-outer">
                      <button className="pr-arrow left" onClick={()=>scrollCarousel(-1)}>‹</button>
                      <div className="pr" ref={carouselRef}>
                        {PHASES.map(p => {
                          const done = p.days.filter(d=>completedDays.has(d)).length;
                          return (
                            <div key={p.id} className={`pc ${phaseNow?.id===p.id?"on":""}`} onClick={()=>setNav("calendar")}>
                              <div className="pe">{p.emoji}</div>
                              <div className="pn">{p.name}</div>
                              <div className="pp" style={{color:getColor(p.id)}}>{done}/{p.days.length}</div>
                            </div>
                          );
                        })}
                      </div>
                      <button className="pr-arrow right" onClick={()=>scrollCarousel(1)}>›</button>
                    </div>
                  </div>

                  {/* ANÚNCIO GOOGLE ADSENSE */}
                  <AdBanner/>
                </div>
              </div>
            )}

            {nav === "calendar" && (
              <div className="cal">
                <h2>📅 Programa de 30 dias</h2>
                <p>Progresso {_do} {dogName}</p>
                <div className="obw"><div className="obf" style={{width:`${(progress/30)*100}%`}}/></div>
                <div className="ol">{progress} de 30 dias · {Math.round((progress/30)*100)}% concluído</div>
                {PHASES.map(phase => {
                  const done = phase.days.filter(d=>completedDays.has(d)).length;
                  const pct  = Math.round((done/phase.days.length)*100);
                  return (
                    <div key={phase.id} className="phs">
                      <div className="phc">
                        <span style={{fontSize:18}}>{phase.emoji}</span>
                        <span className="phtc">Etapa {phase.id} – {phase.name}</span>
                        <span className="phb" style={{background:getColor(phase.id)}}>{done}/{phase.days.length}</span>
                      </div>
                      <div className="psbw"><div className="psbf" style={{width:`${pct}%`,background:getColor(phase.id)}}/></div>
                      <div className="dg">
                        {phase.days.map(d=>(
                          <div key={d}
                            className={`ddot ${completedDays.has(d)?"comp":""} ${d===currentDay?"tod":""} ${d>currentDay&&!completedDays.has(d)?"lock":""}`}
                            onClick={()=>(d<=currentDay||completedDays.has(d))&&openDay(d)}>
                            <div className="ddn">{d}</div>
                            <div className="ddi">{completedDays.has(d)?"✓":d===currentDay?"▶":DAYS[d]?.icon}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {nav === "profile" && (
              <div className="prof">
                <h2>🐾 Perfil</h2>
                <div className="pas">
                  <div className="bav" onClick={()=>photoRef.current?.click()}>
                    {dogPhoto?<img src={dogPhoto} alt={dogName}/>:"🐶"}
                  </div>
                  <div className="ah">Toque para adicionar foto {_do} {dogName}</div>
                  <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
                </div>
                <div className="pcard">
                  <div className="prow"><span className="pk">Nome</span><span className="pv">{dogName}</span></div>
                  <div className="prow"><span className="pk">Sexo</span><span className="pv">{gender==="F"?"🐩 Fêmea":"🐕 Macho"}</span></div>
                  <div className="prow"><span className="pk">Idade</span><span className="pv">{age}</span></div>
                  <div className="prow"><span className="pk">Porte</span><span className="pv">{size}</span></div>
                  <div className="prow" style={{flexDirection:"column",alignItems:"flex-start"}}>
                    <span className="pk" style={{marginBottom:7}}>Desafios</span>
                    <div className="ctags">
                      {challenges.map(id=>{const c=CHALLENGES.find(x=>x.id===id);return c?<span key={id} className="ctag">{c.icon} {c.label}</span>:null;})}
                    </div>
                  </div>
                </div>
                <div className="pcard">
                  <div className="prow"><span className="pk">Dias concluídos</span><span className="pv" style={{color:"#4CAF50",fontWeight:900}}>{progress}/30</span></div>
                  <div className="prow"><span className="pk">Dia atual</span><span className="pv">Dia {currentDay}</span></div>
                  <div className="prow"><span className="pk">Etapa atual</span><span className="pv">{phaseNow?.emoji} {phaseNow?.name}</span></div>
                </div>
                <button className="btnr" onClick={resetApp}>🔄 Reiniciar programa do zero</button>
              </div>
            )}

            {nav === "diploma" && (
              <div className="dipw">
                {progress < 30 ? (
                  <div className="clk">
                    <span className="clki">🔒</span>
                    <h3>Diploma ainda não disponível</h3>
                    <p>O diploma {_do} <strong>{dogName}</strong> será liberado após a conclusão dos 30 dias. Continue com carinho e consistência!</p>
                    <div className="cpb">{progress}/30</div>
                    <div className="cpl">dias concluídos</div>
                    <div style={{margin:"14px 0 0"}}>
                      <div className="obw" style={{background:"#F0E0D0",height:9}}>
                        <div style={{height:"100%",borderRadius:50,background:"linear-gradient(90deg,#8B5E3C,#C8956A)",width:`${(progress/30)*100}%`,transition:"width .6s"}}/>
                      </div>
                      <div style={{fontSize:11,color:"var(--soft)",marginTop:5,fontWeight:700}}>{Math.round((progress/30)*100)}% completo</div>
                    </div>
                    <button className="btnp" style={{marginTop:20}} onClick={()=>setNav("home")}>Continuar treinando 🐾</button>
                  </div>
                ) : (
                  <div className="cert">
                    <img src="/logo.png" className="cert-logo" alt="Catioros"/>
                    <div className="cav">{dogPhoto?<img src={dogPhoto} alt={dogName}/>:"🐶"}</div>
                    <span className="cmd">🏅</span>
                    <div className="ctl">Certificado de Conclusão</div>
                    <div className="cst">Este certificado confirma que {_a} cão</div>
                    <span className="cdn">{dogName}</span>
                    <div className="cst">completou com sucesso o programa<br/><strong>30 Dias para um Cachorro Obediente</strong><br/>sob orientação de um tutor dedicado.</div>
                    <div className="cdt">🗓 {new Date().toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"})}</div>
                    <div className="cbg">🐾 Cachorro Obediente, Dono Feliz</div>
                    <div className="cert-url">catioros.com.br</div>
                  </div>
                )}
              </div>
            )}

            <div className="bnav">
              {[["home","🏠","Início"],["calendar","📅","Programa"],["profile","🐾","Perfil"],["diploma",progress>=30?"🏅":"🔒","Diploma"]].map(([id,icon,label])=>(
                <button key={id} className={`ni ${nav===id?"on":""}`} onClick={()=>setNav(id)}>
                  <span className="nic">{icon}</span>
                  <span className="nil">{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {screen === "day" && (
          <div className="dd">
            <div className="dh">
              <button className="bb" onClick={()=>{setScreen("main");setNav(viewingDay===currentDay?"home":"calendar");}}>← Voltar</button>
              <span className="dib">{view.icon}</span>
              <div className="dn">Etapa {view.phase} · Dia {viewingDay} · {PHASES.find(p=>p.id===view.phase)?.name}</div>
              <h1 className="dt">{view.theme}</h1>
            </div>
            <div className="db2">
              <div className="cd"><div className="ct">🎯 Objetivo de hoje</div><p className="cx">{view.intro}</p></div>
              <div className="cd tip"><div className="ct">💡 Dica importante</div><p className="cx">{view.tip}</p></div>
              <div className="cd">
                <div className="ct">📝 Exercício do dia</div>
                <p className="cx" style={{fontWeight:700,marginBottom:14}}>{view.exercise}</p>
                <ul className="sl">
                  {view.steps.map((step,i)=>(
                    <li key={i} className="si" onClick={()=>toggleStep(i)}>
                      <div className={`sc ${completedSteps.has(i)?"done":""}`}>{completedSteps.has(i)?"✓":i+1}</div>
                      <span className={`sx ${completedSteps.has(i)?"done":""}`}>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="spw">
                  <div className="sbw"><div className="sbf" style={{width:`${(completedSteps.size/view.steps.length)*100}%`}}/></div>
                  <span className="sbl">{completedSteps.size}/{view.steps.length} passos</span>
                </div>
              </div>
            </div>
            <div className="cbw">
              <button className={`bts ${completedDays.has(viewingDay)?"done":""}`} onClick={completeDay}>
                {completedDays.has(viewingDay)?"✅ Dia já concluído — voltar":"🏆 Concluir treino do dia!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
