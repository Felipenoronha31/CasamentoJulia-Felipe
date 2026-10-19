/**
 * Google Apps Script para receber as confirmações de presença do site
 * e gravar numa planilha do Google Sheets.
 *
 * COMO USAR (passo a passo):
 *  1. Crie uma planilha nova em https://sheets.google.com
 *  2. No menu: Extensões > Apps Script
 *  3. Apague o conteúdo que vier e cole TODO este arquivo
 *  4. Clique em "Implantar" (Deploy) > "Nova implantação"
 *       - Tipo: "App da Web" (Web app)
 *       - Executar como: Eu mesmo (sua conta)
 *       - Quem pode acessar: "Qualquer pessoa" (Anyone)
 *  5. Autorize o acesso quando pedir
 *  6. Copie a URL gerada (termina em /exec)
 *  7. Cole essa URL em script.js, na constante SHEETS_URL
 *
 * A primeira linha da planilha ganha os cabeçalhos automaticamente.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // evita gravações simultâneas se chegarem juntas

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Cria os cabeçalhos na primeira vez.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Data/Hora", "Nome", "Vai comparecer?", "Mensagem"]);
    }

    var dados = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      dados.nome || "",
      dados.presenca === "sim" ? "Sim" : "Não",
      dados.mensagem || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Permite testar abrindo a URL no navegador (deve responder "online").
function doGet() {
  return ContentService.createTextOutput("RSVP endpoint online");
}
