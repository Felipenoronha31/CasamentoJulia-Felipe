/**
 * Google Apps Script do site de casamento.
 *
 * Faz DUAS coisas:
 *  1. Recebe as confirmações de presença (doPost) e grava na aba "RSVP".
 *  2. Fornece a lista de presentes/cotas (doGet) lida da aba "Presentes",
 *     para o site mostrar sempre a quantidade atualizada.
 *
 * ================= COMO CONFIGURAR =================
 * 1. Na sua planilha, crie (ou renomeie) DUAS abas:
 *      - "RSVP"       -> onde caem as confirmações
 *      - "Presentes"  -> onde você controla as cotas
 *
 * 2. Na aba "Presentes", monte estas colunas na linha 1 (cabeçalho):
 *      A: Nome | B: ValorCota | C: Cotas | D: Restam | E: Prioridade | F: Imagem
 *    E preencha uma linha por presente. Exemplos na coluna:
 *      - ValorCota: 150         (número, valor de cada cota)
 *      - Cotas: 10              (total de cotas)
 *      - Restam: 8              (quantas ainda faltam — VOCÊ edita aqui)
 *      - Prioridade: SIM        (ou deixe vazio)
 *      - Imagem: https://...    (URL da foto; pode deixar vazio)
 *
 * 3. Cole TODO este código em Extensões > Apps Script (apague o antigo).
 * 4. Implantar > Gerenciar implantações > edite a existente (ícone de lápis)
 *      > Versão: "Nova versão" > Implantar.
 *    (Assim a URL /exec continua a MESMA. Se criar implantação nova, troque a
 *     URL no script.js.)
 * 5. Pronto: edite a coluna "Restam" na planilha e o site atualiza sozinho.
 */

var RSVP_SHEET = "RSVP";
var GIFTS_SHEET = "Presentes";

/** Recebe uma confirmação de presença e grava na aba RSVP. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(RSVP_SHEET) || ss.insertSheet(RSVP_SHEET);

    var expectedHeaders = ["Data/Hora", "Nome (Titular)", "Vai comparecer?", "Total de Pessoas", "Acompanhantes / Filhos", "Mensagem"];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
    } else {
      // Se a planilha já tinha o cabeçalho antigo de 4 colunas ("Mensagem" na coluna D)
      var currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 4)).getValues()[0];
      if (currentHeaders[3] === "Mensagem") {
        sheet.insertColumnsAfter(3, 2);
        sheet.getRange(1, 4).setValue("Total de Pessoas");
        sheet.getRange(1, 5).setValue("Acompanhantes / Filhos");
        sheet.getRange(1, 2).setValue("Nome (Titular)");
      }
    }

    var dados = JSON.parse(e.postData.contents);
    var presenca = dados.presenca === "sim" ? "Sim" : "Não";
    var total = presenca === "Sim" ? (Number(dados.totalPessoas) || 1) : 0;
    var acompanhantes = dados.acompanhantes || "";

    sheet.appendRow([
      new Date(),
      dados.nome || "",
      presenca,
      total,
      acompanhantes,
      dados.mensagem || ""
    ]);

    return json({ result: "ok" });
  } catch (err) {
    return json({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Devolve a lista de presentes (JSON) lida da aba Presentes. */
function doGet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(GIFTS_SHEET);
    if (!sheet || sheet.getLastRow() < 2) {
      return json({ result: "ok", gifts: [] });
    }

    // Lê a partir da linha 2 (pula o cabeçalho). Colunas A..F.
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    var gifts = rows
      .filter(function (r) { return String(r[0]).trim() !== ""; })
      .map(function (r) {
        var cotas = Number(r[2]) || 0;
        var restam = Number(r[3]);
        if (isNaN(restam)) restam = cotas;
        var prio = String(r[4]).trim().toLowerCase();
        return {
          nome: String(r[0]).trim(),
          valorCota: Number(r[1]) || 0,
          cotas: cotas,
          restam: Math.max(0, Math.min(restam, cotas)),
          priority: (prio === "sim" || prio === "true" || prio === "x"),
          img: String(r[5]).trim()
        };
      });

    return json({ result: "ok", gifts: gifts });
  } catch (err) {
    return json({ result: "error", message: String(err), gifts: [] });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
