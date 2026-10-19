# Julia & Felipe · Site de Casamento

Site de casamento single-page, responsivo, em HTML/CSS/JS puro (sem build). Basta abrir o `index.html` no navegador.

## Seções
- **Início (Hero)** — nomes, data e botão de confirmação
- **Contagem regressiva** — para 04/07/2027
- **Nossa História** — linha do tempo do casal
- **O Evento** — data, local (Giardino di Menis) e dress code
- **Programação** — cronograma do dia
- **Galeria** — grade de fotos
- **Padrinhos & Madrinhas**
- **Lista de Presentes** — com modal Pix
- **Confirmar Presença (RSVP)** — formulário

## Como rodar localmente
Abra o arquivo direto no navegador, ou sirva com um servidor local:

```powershell
# Python
python -m http.server 8000
# depois acesse http://localhost:8000
```

## Personalização rápida

| O que mudar | Onde |
|---|---|
| Data do casamento | `script.js` → `WEDDING_DATE` |
| Chave Pix | `script.js` → `PIX_KEY` |
| Senha(s) do convite | `script.js` → `INVITE_PASSWORDS` (lista) |
| Itens da lista de presentes | `script.js` → `GIFTS` (nome, valor, img, priority) |
| Textos (história, programação, padrinhos) | `index.html` |
| Cores e fontes | `styles.css` → bloco `:root` |
| Fotos da galeria | `script.js` → array `photos` (troque pelas suas imagens) |
| Foto de fundo do Hero | `styles.css` → `.hero { background: ... }` |

### Fotos (galeria e presentes)
As fotos ficam na pasta **`img/`** do repositório. Os nomes de arquivo esperados
estão listados em `img/LEIA-ME.txt`. Resumo:

- **Galeria do casal:** `galeria1.jpg` … `galeria8.jpg` (formato retrato).
- **Presentes:** `cama.jpg`, `geladeira.jpg`, `maquina-lavar.jpg`, `fogao.jpg`,
  `microondas.jpg`, `panelas.jpg`, `jogo-cama.jpg`, `jogo-jantar.jpg`,
  `lua-de-mel.jpg` (formato paisagem).

Para trocar/adicionar: suba o arquivo em `img/` com o nome correspondente e, se
mudar o nome ou a quantidade, ajuste a lista `photos` (galeria) ou `GIFTS`
(presentes) no `script.js`. Se usar a planilha para os presentes, o caminho da
foto vai na coluna **Imagem** (ex: `img/cama.jpg`).

## Publicar (grátis)
- **Firebase Hosting**: `firebase init hosting` → `firebase deploy`
- **Netlify / Vercel**: arraste a pasta ou conecte o repositório
- **GitHub Pages**: suba os arquivos e ative o Pages

## Confirmação com senha
A seção "Confirmar Presença" pede uma senha do convite antes de liberar o formulário.
As senhas aceitas ficam em `script.js` → `INVITE_PASSWORDS` (pode colocar várias).

> **Atenção:** como o site é estático (GitHub Pages), a senha é validada no navegador
> e fica visível para quem inspecionar o código-fonte. Serve para organizar os
> convidados, não como segurança real. Para uma senha realmente secreta seria
> necessário um backend.

## Lista de presentes (sistema de cotas)
Os itens ficam em `script.js` → `GIFTS`. Cada presente é dividido em cotas, para
vários convidados contribuírem com partes do mesmo item. Campos:

| Campo | O que é |
|---|---|
| `nome` | Nome do presente |
| `valorCota` | Valor de **cada cota** (o que o convidado paga) |
| `cotas` | Em quantas partes o presente foi dividido (total) |
| `restam` | Quantas cotas ainda faltam |
| `priority` | `true` destaca o item com um selo ★ |
| `img` | URL ou caminho local da foto (ex: `img/cama.jpg`) |

A barra de progresso e o texto "Restam X de Y cotas" são calculados a partir de
`cotas` e `restam`. Quando `restam` chega a 0, o card mostra "Presente completo!"
e o botão fica desabilitado.

> **Importante:** o site é estático, então a contagem **não atualiza sozinha**.
> Quando receber um Pix, diminua o número em `restam` e faça um novo push.

## Coletar confirmações no Google Sheets
As confirmações do formulário podem cair direto numa planilha do Google que você
acompanha (e exporta para Excel quando quiser). Siga os passos:

1. Crie uma planilha nova em <https://sheets.google.com>.
2. No menu da planilha: **Extensões → Apps Script**.
3. Apague o código que aparecer e **cole todo o conteúdo de `google-apps-script.gs`** (está nesta pasta).
4. Clique em **Implantar → Nova implantação**:
   - Tipo: **App da Web** (Web app)
   - Executar como: **Eu mesmo** (sua conta Google)
   - Quem pode acessar: **Qualquer pessoa** (Anyone)
5. Autorize o acesso quando o Google pedir.
6. Copie a **URL gerada** (termina em `/exec`).
7. Abra `script.js` e cole essa URL na constante `SHEETS_URL`:
   ```js
   const SHEETS_URL = "https://script.google.com/macros/s/..../exec";
   ```
8. Faça commit/push dos arquivos. Pronto: cada confirmação vira uma linha na planilha
   (Data/Hora, Nome, Vai comparecer?, Mensagem).

> **Testar:** abra a URL `/exec` no navegador — deve responder "RSVP endpoint online".
> Depois envie uma confirmação de teste no site e confira se apareceu na planilha.

**Exportar para Excel:** na planilha, **Arquivo → Fazer download → Microsoft Excel (.xlsx)**.

### Enquanto a URL não estiver preenchida
Se `SHEETS_URL` ficar vazio, o formulário continua funcionando, mas as respostas
são salvas apenas no `localStorage` do navegador de quem preencheu (backup local,
que você não consegue acessar). Para coletar de verdade, complete os passos acima.

## Cotas dos presentes controladas pela planilha (automático)
As quantidades de cotas podem vir da MESMA planilha, assim você atualiza o site
só editando uma célula — sem mexer em código.

1. Na planilha, crie uma segunda aba chamada **`Presentes`** (e renomeie a aba das
   confirmações para **`RSVP`**, se ainda não tiver esse nome).
2. Na aba **`Presentes`**, coloque estes cabeçalhos na linha 1:

   | A: Nome | B: ValorCota | C: Cotas | D: Restam | E: Prioridade | F: Imagem |
   |---|---|---|---|---|---|

   Preencha uma linha por presente. Exemplo:

   | Cama de casal box | 150 | 10 | 8 | SIM | https://... |

   - **ValorCota**: valor de cada cota (número)
   - **Cotas**: total de cotas do presente
   - **Restam**: quantas ainda faltam — **é esta coluna que você edita**
   - **Prioridade**: escreva `SIM` para destacar com o selo ★ (ou deixe vazio)
   - **Imagem**: URL da foto (pode deixar vazio)

3. Atualize o Apps Script com o novo conteúdo de `google-apps-script.gs` e
   **reimplante** (Implantar → Gerenciar implantações → editar → Nova versão).
   Mantendo a mesma implantação, a URL `/exec` não muda.

4. Pronto. Quando confirmar que recebeu um Pix, **diminua o número em "Restam"**
   na planilha. O site passa a mostrar a nova quantidade automaticamente (sem
   reupload, sem mexer no código).

> Os itens em `GIFTS` no `script.js` continuam servindo de **fallback**: se a
> planilha estiver fora do ar, o site mostra esses valores. Mantenha-os parecidos
> com os da planilha.

> **Fluxo (Opção B):** o convidado faz o Pix e envia o comprovante → você confere
> → edita "Restam" na planilha. A contagem reflete o que você realmente recebeu.
