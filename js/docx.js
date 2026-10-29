import { COMMON, METHODS, ROLES, STATUSES, windowsForRisk, immediateRows, displayDate, measureText, baseName } from "./model.js";
import { ROAD_POINTS, ROAD_SIZE } from "./road.js";
import { zipLibrary } from "./zip.js";
import { VERSION } from "./config.js";

const MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const WIDTH = 14688; // 734,4 punti, stessi margini del PDF.
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
const esc = value => String(value ?? "").normalize("NFC").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const filled = value => String(value ?? "").trim().length > 0;
const any = (row, keys) => keys.some(key => filled(row[key]));
const actionFilled = action => Object.entries(action).some(([key, value]) => key !== "id" && filled(value));

function run(value, { bold = false, size = 19, color = "1E3232", font = "Arial" } = {}) {
  const text = String(value ?? "").replace(/\r\n?/g, "\n").split("\n").map(esc).join('</w:t><w:br/><w:t xml:space="preserve">');
  return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:color w:val="${color}"/>${bold ? '<w:b/>' : ''}</w:rPr><w:t xml:space="preserve">${text}</w:t></w:r>`;
}
function para(content = "", { keep = false, after = 90, before = 0, align = "left", shade, bullet = -1, style, separator = false } = {}) {
  const imageHeight = content.match(/<wp:extent[^>]*cy="(\d+)"/);
  const spacing = imageHeight
    ? `w:line="${Math.ceil(Number(imageHeight[1]) / 12700 * 20 + 40)}" w:lineRule="atLeast"`
    : 'w:line="228" w:lineRule="auto"';
  return `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}${keep ? '<w:keepNext/>' : ''}<w:widowControl/><w:spacing w:before="${before}" w:after="${after}" ${spacing}/><w:jc w:val="${align}"/>${separator ? '<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="0" w:color="FFFFFF"/></w:pBdr>' : ''}${shade ? `<w:shd w:fill="${shade}"/>` : ''}${bullet >= 0 ? `<w:numPr><w:ilvl w:val="${bullet}"/><w:numId w:val="1"/></w:numPr>` : ''}</w:pPr>${content}</w:p>`;
}
const blank = () => para("", { after: 0 });
const pageBreak = () => '<w:p><w:pPr><w:pageBreakBefore/><w:keepNext/><w:spacing w:before="0" w:after="0" w:line="1" w:lineRule="exact"/></w:pPr></w:p>';
function label(title, value, { always = false, ...options } = {}) {
  return always || filled(value) ? para(run(title, { bold: true }) + run(" " + (value ?? "")), options) : "";
}
const band = (title, keep = true) => para(run(title, { bold: true, size: 20, color: "FFFFFF" }), { before: 100, after: 150, shade: "005B60", keep, separator: true });
const choices = (options, selected) => options.map(option => run((Array.isArray(selected) ? selected.includes(option) : selected === option) ? "☑ " : "☐ ", { font: "DejaVu Sans" }) + run(option + "   ")).join("");

function table(rows, widths, { border = true, headers = false, keepRows = true, padding = 70 } = {}) {
  const edge = border ? '<w:tblBorders>' + ['top','left','bottom','right','insideH','insideV'].map(side => `<w:${side} w:val="single" w:sz="4" w:color="D9DDDD"/>`).join('') + '</w:tblBorders>' : '<w:tblBorders>' + ['top','left','bottom','right','insideH','insideV'].map(side => `<w:${side} w:val="nil"/>`).join('') + '</w:tblBorders>';
  return `<w:tbl><w:tblPr><w:tblW w:w="${widths.reduce((a,b)=>a+b,0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${edge}<w:tblCellMar><w:top w:w="${padding}" w:type="dxa"/><w:left w:w="${padding}" w:type="dxa"/><w:bottom w:w="${padding}" w:type="dxa"/><w:right w:w="${padding}" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map(width=>`<w:gridCol w:w="${width}"/>`).join('')}</w:tblGrid>${rows.map((row,index)=>`<w:tr><w:trPr>${keepRows ? '<w:cantSplit/>' : ''}${headers && index===0 ? '<w:tblHeader/>' : ''}</w:trPr>${row.map((content,col)=>`<w:tc><w:tcPr><w:tcW w:w="${widths[col]}" w:type="dxa"/><w:vAlign w:val="top"/>${headers ? `<w:shd w:fill="${index===0?'B9B9B9':index%2===0?'F4F7F6':'FFFFFF'}"/>` : ''}</w:tcPr>${content || blank()}${content?.endsWith('</w:tbl>') ? blank() : ''}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`;
}
function dataTable(headers, rows, weights) {
  if (!rows.length) return "";
  const sum = weights.reduce((a,b)=>a+b,0);
  const widths = weights.map(weight=>Math.round(weight/sum*WIDTH));
  widths[widths.length-1] += WIDTH-widths.reduce((a,b)=>a+b,0);
  return table([headers.map(text=>para(run(text,{bold:true,color:"FFFFFF"}),{after:0})), ...rows.map(row=>row.map(text=>para(run(text),{after:0})))], widths, { headers:true }) + blank();
}
async function bytes(path) {
  const response = await fetch(path);
  if (!response.ok) throw Error("Risorsa Word non disponibile: " + path);
  return new Uint8Array(await response.arrayBuffer());
}

/** Solo la planimetria è composta come immagine; tutti i campi restano testo Word. */
async function mapImage(state, assets) {
  const blob = new Blob([await bytes("./assets/map.jpg")], { type: "image/jpeg" });
  let image, url;
  try {
    if (typeof createImageBitmap === "function") image = await createImageBitmap(blob);
    else {
      url = URL.createObjectURL(blob);
      image = new Image();
      image.src = url;
      await image.decode();
    }
    const canvas = document.createElement("canvas");
    canvas.width = ROAD_SIZE.width;
    canvas.height = ROAD_SIZE.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("Impossibile preparare la planimetria Word.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (state.assetId === "strada") {
      ctx.strokeStyle = "#d90d14"; ctx.lineWidth = 5.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ROAD_POINTS.forEach(([x,y],i)=>i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.stroke();
    }
    for (const asset of assets.filter(item=>item.kind !== "road")) {
      const x=asset.x/100*canvas.width-10.3, y=asset.y/100*canvas.height-10.3;
      ctx.fillStyle="white"; ctx.strokeStyle="#1e3232"; ctx.lineWidth=1.7;
      ctx.fillRect(x,y,20.6,20.6); ctx.strokeRect(x,y,20.6,20.6);
      if (asset.id===state.assetId) {
        ctx.strokeStyle="#005b60"; ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+3,y+10);ctx.lineTo(x+8,y+18);ctx.lineTo(x+18,y+3);ctx.stroke();
      }
    }
    return canvas.toDataURL("image/png").split(",")[1];
  } finally { image?.close?.(); if (url) URL.revokeObjectURL(url); }
}

export async function makeDocx(state, assets) {
  const Zip = await zipLibrary();
  const zip = new Zip();
  const rels = [], media = [];
  let imageId = 0;
  function addImage(data, extension, base64 = false) {
    const id = "image" + (++imageId), name = id + "." + extension;
    zip.file("word/media/" + name, data, { base64 });
    rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`);
    media.push(id);
    return id;
  }
  function image(id, width, height, description) {
    const cx=Math.round(width*12700), cy=Math.round(height*12700), n=media.indexOf(id)+1;
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${++drawingId}" name="${id}" descr="${esc(description)}"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${n}" name="${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }
  let drawingId = 0;
  const anniversary = addImage(await bytes("./assets/branding/anniversary.png"), "png");
  const logo = addImage(await bytes("./assets/branding/logo.jpg"), "jpg");
  const footerLogo = addImage(await bytes("./assets/branding/footer.jpg"), "jpg");
  const map = addImage(await mapImage(state, assets), "png", true);
  const branding = () => para(image(anniversary,70.6,15,"Anniversario"),{after:140}) + para(image(logo,70.6,108.5,"Logo"),{after:0});
  function heading(title, date, first = false) {
    const g=state.general;
    let metadata=para(run(title,{bold:true,size:26,color:"005B60"}),{after:210,style:"Title"});
    metadata+=label("ID Scheda:",g.id,{always:true,shade:"D9D9D9",after:0});
    metadata+=label("Data:",displayDate(date),{always:true,shade:"D9D9D9",after:first?0:180});
    if(first) {
      metadata+=label("Ora:",g.time,{always:true,shade:"D9D9D9",after:160});
      metadata+=para(run("Operatore: "+COMMON.operator,{bold:true}),{after:90});
      metadata+=para(run(COMMON.company+" – "+COMMON.address,{size:16}),{after:20});
      metadata+=para(run(COMMON.email,{size:16}),{after:20});
      metadata+=para(run("PEC – "+COMMON.pec,{size:16}),{after:0});
    } else {
      metadata+=label("Oggetto:",g.object,{always:true});
      metadata+=label("Operatori:",COMMON.company,{always:true});
      metadata+=label("Restauratore capofila:",COMMON.operator,{always:true});
      metadata+=label("Interventi autorizzati da:",COMMON.authorization,{always:true});
    }
    return table([[branding(),metadata]],[1600,first?6280:WIDTH-1600],{border:false,padding:0,keepRows:false})+blank();
  }
  const g=state.general;
  let left=heading("SCHEDA DI ISPEZIONE PERIODICA",g.date,true);
  left+=band("1. IDENTIFICAZIONE DEL BENE");
  for(const [title,value] of [["Oggetto:",g.object],["Cronologia:",g.chronology],["Autore:",g.author],["Quota s.l.m.:",measureText(g.altitude)],["Distanza Santuario:",measureText(g.distance)],["Complesso:",COMMON.complex],["Ente Proprietario:",COMMON.owner]]) left+=label(title,value,{always:true});
  left+=band("2. SOGGETTO E DATI TECNICO-DIMENSIONALI");
  left+=label("Soggetto:",g.subject,{always:true});
  left+=label("Dimensioni:",`H: ${measureText(g.height)}   L: ${measureText(g.width)}   P: ${measureText(g.depth)}`,{always:true});
  left+=label("Materie e Tecniche:",g.materials,{always:true});
  const right=para(run("LOCALIZZAZIONE BENE",{bold:true,size:22,color:"005B60"}),{align:"center",after:120}) + para(image(map,242,440.4,"Planimetria del bene selezionato"),{align:"center",after:0});
  let body=table([[left,right]],[8000,WIDTH-8000],{border:false,padding:60,keepRows:false});
  body+=pageBreak()+band("3. STORICO MANUTENTIVO");
  for(const [key,title] of [["restorations","Interventi di RESTAURO precedenti"],["maintenance","Interventi di MANUTENZIONE precedenti"]]) {
    for(const row of state.history[key].filter(row=>any(row,["date","action"]))) {
      body+=para(run(title,{bold:true}),{keep:true});
      body+=label("Data:",row.date,{keep:filled(row.action)});
      body+=label("Azione:",row.action);
    }
  }
  body+=band("4. STATO CONSERVATIVO ATTUALE");
  for(const row of state.conditions.filter(row=>any(row,["exposure","assessment"])||row.methods.length)) {
    body+=label("Esposizione:",row.exposure);
    if(row.methods.length)body+=para(run("Metodologia Ispezione: ",{bold:true})+choices(METHODS,row.methods));
    body+=label("Valutazione Sintetica:",row.assessment);
  }
  body+=band("5. DIAGNOSTICA DEL DEGRADO E PRIORITÀ DI INTERVENTO");
  body+=dataTable(["Macro-Area","Elemento","Patologia Riscontrata","Cause Principali","Livello di Rischio","Risolto in data"],state.diagnosis.filter(row=>any(row,["area","element","pathology","causes","risk","resolvedDate"])).map(row=>[row.area,row.element,row.pathology,row.causes,row.risk,displayDate(row.resolvedDate)]),[2381,2381,2955,3118,1843,1608]);
  for(const row of state.priorities.filter(row=>any(row,["risk","window","anomalies"]))) {
    let content=para(run("INDICE DI PRIORITÀ E TEMPISTICHE DI INTERVENTO",{bold:true}),{keep:true});
    content+=label("Grado d'Urgenza:",row.risk);
    if(row.window)content+=para(run("Finestra d'Intervento Programmata: ",{bold:true})+choices(windowsForRisk(row.risk),row.window));
    content+=label("Anomalie attese:",row.anomalies);
    body+=table([[content]],[WIDTH])+blank();
  }
  body+=label("Note aggiuntive:",state.inspectionNotes);
  if(!state.photos.length) body+=band("6. ATLANTE FOTOGRAFICO",false);
  for(let offset=0;offset<state.photos.length;offset+=4) {
    body+=pageBreak();
    if(offset===0)body+=band("6. ATLANTE FOTOGRAFICO");
    const cells=[];
    for(const photo of state.photos.slice(offset,offset+4)) {
      const extension=photo.data.startsWith("data:image/png")?"png":"jpg";
      const id=addImage(photo.data.split(",")[1],extension,true);
      const scale=Math.min(350/photo.width,207/photo.height);
      cells.push(para(image(id,photo.width*scale,photo.height*scale,"Fotografia del bene"),{align:"center",after:0}));
    }
    while(cells.length%2)cells.push(blank());
    const rows=[];for(let i=0;i<cells.length;i+=2)rows.push(cells.slice(i,i+2));
    body+=table(rows,[WIDTH/2,WIDTH/2],{border:false,padding:90});
  }
  // Tre sezioni Word: i marchi del piè di pagina appaiono solo nelle tre aperture.
  const sectionProperties = () => `<w:sectPr><w:footerReference w:type="default" r:id="footerDefault"/><w:footerReference w:type="first" r:id="footerFirst"/><w:type w:val="nextPage"/><w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/><w:pgMar w:top="576" w:right="576" w:bottom="1120" w:left="576" w:header="180" w:footer="140"/><w:titlePg/></w:sectPr>`;
  const sectionBreak=()=>`<w:p><w:pPr>${sectionProperties()}</w:pPr></w:p>`;
  body+=sectionBreak()+heading("REGISTRO INTERVENTI DI MANUTENZIONE IMMEDIATA",state.immediate.date)+band("INTERVENTI ESEGUITI");
  for(const row of immediateRows(state).filter(row=>any(row,["area","action","date"]))) {
    body+=label("Eseguito in data:",displayDate(row.date||state.immediate.executedDate),{keep:true});
    body+=label("Macro-Area:",row.area,{keep:filled(row.action)});
    body+=label("Azioni condotte in loco:",row.action,{after:200});
  }
  body+=label("Note aggiuntive:",state.immediate.notes);
  body+=sectionBreak()+heading("PROGRAMMAZIONE AZIONI PREVENTIVE",state.preventive.date)+band("AZIONI PREVENTIVE");
  for(const row of state.diagnosis.filter(row=>!row.resolvedDate&&(any(row,["area","element","pathology"])||row.actions.some(actionFilled)))) {
    if(any(row,["area","element","pathology"]))body+=dataTable(["Macro-Area","Elemento","Patologia Riscontrata"],[[row.area,row.element,row.pathology]],[4461,4461,5538]);
    for(const action of row.actions.filter(actionFilled)) {
      body+=label("Grado d'Urgenza:",action.risk);
      if(action.window)body+=para(run("Finestra d'Intervento: ",{bold:true})+choices(windowsForRisk(action.risk),action.window));
      for(const [title,key,level] of [["Descrizione:","description",0],["Azione:","action",1],["Obiettivo:","objective",1],["Operatore:","operator",1]]) {
        if(filled(action[key]))body+=para(run(title,{bold:true})+run(" "+action[key]),{bullet:level});
      }
      if(action.role)body+=para(choices(ROLES,action.role),{bullet:1});
      if(action.status)body+=para(run("Stato: ",{bold:true})+choices(STATUSES,action.status));
    }
  }
  body+=label("Note aggiuntive:",state.preventive.notes)+sectionProperties();
  const number = para('<w:fldSimple w:instr="PAGE">'+run("1",{size:15})+'</w:fldSimple>'+run("/",{size:15})+'<w:fldSimple w:instr="NUMPAGES">'+run("1",{size:15})+'</w:fldSimple>',{align:"right",after:0});
  const footer = table([[para(image(footerLogo,105,32.3,"Cròmo"),{after:0}),para(run("s.c.ar.l. – Via Matteotti 8, 21030 Castello Cabiaglio (VA) – C.F./P.IVA 02507710396\ninfo@cromorestauri.com – PEC – cromorestauri@sicurezzapostale.it",{size:15}),{after:0})]],[2350,WIDTH-2350],{border:false,padding:0})+number;
  const relXml = (entries) => XML+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+entries.join('')+'</Relationships>';
  zip.file("word/document.xml",XML+`<w:document ${NS}><w:body>${body}</w:body></w:document>`);
  zip.file("word/styles.xml",XML+`<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="19"/><w:color w:val="1E3232"/><w:lang w:val="it-IT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="228" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="005B60"/></w:rPr></w:style></w:styles>`);
  zip.file("word/numbering.xml",XML+`<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="multilevel"/>${[0,1].map(level=>`<w:lvl w:ilvl="${level}"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="${level?'○':'•'}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${(level+1)*500}"/></w:tabs><w:ind w:left="${(level+1)*500}" w:hanging="240"/></w:pPr></w:lvl>`).join('')}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  zip.file("word/settings.xml",XML+`<w:settings ${NS}><w:updateFields w:val="true"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`);
  zip.file("word/footerDefault.xml",XML+`<w:ftr ${NS}>${number}</w:ftr>`);
  zip.file("word/footerFirst.xml",XML+`<w:ftr ${NS}>${footer}</w:ftr>`);
  zip.file("word/_rels/footerFirst.xml.rels",relXml(rels.filter(rel=>rel.includes('Id="'+footerLogo+'"'))));
  const type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
  zip.file("word/_rels/document.xml.rels",relXml([...rels,...["styles","numbering","settings"].map(name=>`<Relationship Id="${name}" Type="${type+name}" Target="${name}.xml"/>`),...['First','Default'].map(name=>`<Relationship Id="footer${name}" Type="${type}footer" Target="footer${name}.xml"/>`)]));
  zip.file("_rels/.rels",relXml([`<Relationship Id="document" Type="${type}officeDocument" Target="word/document.xml"/>`,'<Relationship Id="core" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>']));
  zip.file("docProps/core.xml",XML+'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>'+esc(baseName(state,assets))+'</dc:title><dc:creator>'+esc(COMMON.company)+'</dc:creator><dc:description>Schede Restauro '+VERSION+'</dc:description></cp:coreProperties>');
  const overrides = { 'word/document.xml':'document.main','word/styles.xml':'styles','word/numbering.xml':'numbering','word/settings.xml':'settings','word/footerFirst.xml':'footer','word/footerDefault.xml':'footer' };
  zip.file("[Content_Types].xml",XML+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/>'+Object.entries(overrides).map(([path,type])=>`<Override PartName="/${path}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"/>`).join('')+'<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
  return new Blob([await zip.generateAsync({type:"uint8array",compression:"DEFLATE",compressionOptions:{level:6}})],{type:MIME});
}
