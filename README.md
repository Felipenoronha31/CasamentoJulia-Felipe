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
| Textos (história, programação, padrinhos) | `index.html` |
| Cores e fontes | `styles.css` → bloco `:root` |
| Fotos da galeria | `script.js` → array `photos` (troque pelas suas imagens) |
| Foto de fundo do Hero | `styles.css` → `.hero { background: ... }` |

### Trocar as fotos pelas reais
As imagens atuais são placeholders do Unsplash. Crie uma pasta `img/` e substitua:

```js
// script.js
const photos = ["img/foto1.jpg", "img/foto2.jpg", ...];
// e ajuste o template para: <img src="${id}" ...>
```

## Publicar (grátis)
- **Firebase Hosting**: `firebase init hosting` → `firebase deploy`
- **Netlify / Vercel**: arraste a pasta ou conecte o repositório
- **GitHub Pages**: suba os arquivos e ative o Pages

## Observação sobre o RSVP
O formulário salva as confirmações no `localStorage` do navegador (demonstração). Para receber as respostas de verdade, conecte a um backend, Google Forms/Sheets ou serviço como Formspree.
