# Como criar e publicar um portfólio na internet
### Guia completo, do zero até estar no ar — explicado para qualquer pessoa

---

## Antes de tudo: o que é isto, em palavras simples

Imagina que queres abrir uma loja.

- **O teu portfólio** é a loja em si: as prateleiras, os produtos, a decoração. São os ficheiros que criaste no computador (textos, imagens, o teu currículo).
- **O GitHub** é o armazém onde guardas uma cópia de tudo, em segurança. Se a loja arder, tens tudo guardado no armazém.
- **O Vercel** é o terreno na avenida movimentada onde a loja fica aberta ao público. É quem mostra a tua loja a quem passa na internet.
- **O Upstash** é o livro de registo à entrada, onde se conta quantas pessoas entraram e o que olharam. São os contadores de visitas e de cliques.
- **A tua morada** (por exemplo `portifolio-xadreque.vercel.app`) é o endereço que dás às pessoas para chegarem à tua loja.

O objectivo deste guia é: pegar na loja que está no teu computador e pô-la aberta ao público, com o livro de registo a funcionar.

---

## Parte 1 — O que precisas de ter (as contas)

Antes de começar, cria estas quatro coisas. Todas são **gratuitas**.

1. **Uma conta no GitHub** — o armazém.
   Vai a `https://github.com` e regista-te. Guarda bem o utilizador e a palavra-passe.

2. **Uma conta no Vercel** — o terreno público.
   Vai a `https://vercel.com` e entra **com a conta do GitHub** (há um botão "Continue with GitHub"). Assim ficam ligados.

3. **Uma conta no Upstash** — o livro de registo.
   Vai a `https://upstash.com` e entra, também podes usar o GitHub.

4. **O programa Node.js no computador** — a ferramenta que faz tudo funcionar.
   Vai a `https://nodejs.org`, descarrega a versão "LTS" e instala como qualquer programa.

Feito isto, estás pronto.

---

## Parte 2 — Os ficheiros do portfólio (o que é cada um)

O teu portfólio é uma pasta com estes ficheiros dentro:

```
xadreque.github.io/          ← a pasta principal
├── index.html               ← a página do portfólio (o mais importante)
├── api/
│   └── metrics.js           ← o livro de registo (conta visitas e cliques)
├── img/                      ← as fotografias dos projectos e a tua foto
│   └── (imagens aqui)
├── cv-xadreque-zandamela.pdf ← o teu currículo
└── admin-imagens.html        ← ferramenta para preparar as fotos
```

Cada um tem um papel:
- **index.html** — é a loja em si. Tudo o que as pessoas veem.
- **api/metrics.js** — é o livro de registo. Sem ele, os contadores não funcionam.
- **img/** — onde guardas as fotografias. Enquanto não tiveres fotos, o site mostra um espaço à espera; nunca fica partido.
- **cv-...pdf** — o currículo que os recrutadores podem ver.

---

## Parte 3 — Preparar as ferramentas no computador (só uma vez)

Abre o **Terminal** (no Mac: procura por "Terminal"; no Windows: "Prompt de Comando").

**1. Confirma que o Node.js está instalado:**
```bash
node --version
```
Deve aparecer um número (por exemplo `v22.0.0`). Se der erro, volta à Parte 1 e instala o Node.

**2. Instala a ferramenta do Vercel:**
```bash
npm install -g vercel
```
Espera terminar (pode demorar um minuto). Se pedir a palavra-passe do computador, escreve-a.

**3. Entra na tua conta Vercel a partir do computador:**
```bash
vercel login
```
Escolhe "Continue with GitHub", abre-se o navegador para confirmares, e voltas ao Terminal.

Pronto. As ferramentas estão preparadas.

---

## Parte 4 — Pôr o código no GitHub (o armazém)

Isto guarda uma cópia dos teus ficheiros no GitHub.

**1. Cria o armazém no GitHub:**
- Vai a `https://github.com/new`
- Em "Repository name" escreve exactamente: `teu-utilizador.github.io`
  (troca `teu-utilizador` pelo teu nome de utilizador do GitHub)
- Deixa em **Public**
- Marca "Add a README file"
- Clica em **Create repository**

**2. Traz o armazém para o computador.**
No Terminal, entra na pasta onde queres guardar tudo (por exemplo a pasta pessoal) e escreve:
```bash
git clone https://github.com/teu-utilizador/teu-utilizador.github.io.git
cd teu-utilizador.github.io
```

**3. Copia os teus ficheiros para dentro desta pasta.**
Põe aqui o `index.html`, a pasta `api/`, a pasta `img/` e o currículo.

**4. Confirma que está tudo no sítio:**
```bash
ls
```
Deves ver `index.html`, `api`, `img`, e o currículo.

**5. Envia tudo para o GitHub:**
```bash
git add .
git commit -m "Primeiro envio do portfolio"
git push
```
Se pedir utilizador e palavra-passe e falhar, é porque o GitHub já não aceita palavra-passe simples — nesse caso é preciso criar um "token" (ver Parte 6, é o mesmo tipo de token).

---

## Parte 5 — Criar o livro de registo (Upstash)

Isto cria a base de dados que conta as visitas e os cliques.

**1.** Vai a `https://console.upstash.com`
**2.** Clica em **Create Database**
**3.** Dá-lhe um nome, por exemplo `portifolio`
**4.** Em "Type" escolhe **Regional**
**5.** Em "Region" escolhe a mais perto (para Moçambique, `eu-west-1` / Irlanda serve bem)
**6.** Clica em **Create**

**7. Copia os dois valores importantes.**
Abre a base criada, desce até à secção **REST API** (separador REST).
Vais ver duas linhas:
```
UPSTASH_REDIS_REST_URL="https://.......upstash.io"
UPSTASH_REDIS_REST_TOKEN="uma-cadeia-muito-longa-de-letras"
```

**GUARDA ESTES DOIS VALORES** num sítio seguro. Vais precisar deles já a seguir.

> ⚠️ **ATENÇÃO — o erro que custa horas:** quando copiares o TOKEN, usa o **botão de copiar** (o ícone ao lado), nunca selecciones à mão. Um único carácter a mais ou a menos e o registo não funciona. E **nunca copies as aspas** — só o que está dentro delas.

---

## Parte 6 — Criar o token do GitHub (para as estatísticas)

Isto permite ao site mostrar os teus números do GitHub (repositórios, estrelas...).

**1.** No GitHub, clica na tua foto (canto superior direito) → **Settings**
**2.** Desce a barra lateral até ao fundo → **Developer settings**
**3.** **Personal access tokens** → **Tokens (classic)**
**4.** **Generate new token** → **Generate new token (classic)**
**5.** Dá um nome (ex.: `portfolio`), marca a caixa **repo** (para contar também repositórios privados)
**6.** **Generate token** no fundo
**7.** **COPIA O TOKEN IMEDIATAMENTE** — só é mostrado uma vez. Guarda-o.

Agora tens **três valores guardados**:
- O token do GitHub
- O URL do Upstash
- O token do Upstash

---

## Parte 7 — Publicar no Vercel (pôr no ar)

Esta é a parte que abre a loja ao público. Vamos fazê-la **pelo Terminal**, que é a forma mais fiável.

**1. Confirma que estás dentro da pasta do portfólio:**
```bash
cd ~/teu-utilizador.github.io
```

**2. Faz o primeiro deploy:**
```bash
vercel --prod
```

Vai fazer perguntas. Responde assim:
- **Set up and deploy?** → escreve `Y` e Enter
- **Which scope?** → escolhe a tua conta (setas + Enter)
- **Link to existing project?** → `N` (cria um novo)
- **What's your project's name?** → escreve `portifolio-xadreque`
- **In which directory is your code?** → carrega Enter (usa a pasta actual)
- Se perguntar mais alguma coisa sobre "settings" → aceita o que está por omissão

No fim aparece um endereço. O site já está no ar — mas **os contadores ainda não funcionam**, porque falta ligar as três chaves.

**3. Adiciona as três chaves (variáveis).**
Uma a uma, no Terminal:

```bash
vercel env add GH_TOKEN production
```
- "Store as sensitive?" → `n`
- "Value?" → cola o **token do GitHub** e Enter

```bash
vercel env add UPSTASH_REDIS_REST_URL production
```
- "sensitive?" → `n`
- "Value?" → cola o **URL do Upstash** (sem aspas!)

```bash
vercel env add UPSTASH_REDIS_REST_TOKEN production
```
- "sensitive?" → `n`
- "Value?" → cola o **token do Upstash** (sem aspas!)

**4. Publica de novo para aplicar as chaves:**
```bash
vercel --prod
```

**5. Confirma que está tudo a funcionar.**
Abre no navegador o teu endereço, acrescentando `/api/metrics` no fim:
```
https://portifolio-xadreque.vercel.app/api/metrics
```
Deve aparecer um texto com `visitas`, `cliques`, `github`. Se aparecer, **está tudo a funcionar!**

---

## Parte 8 — Dar um nome bonito ao endereço

Se o endereço saiu com um nome estranho ou com erro, podes apontar um nome limpo. No fim do deploy, o Terminal mostra dois endereços — um longo ("Production") e o alias. Para criar um endereço limpo:

```bash
vercel alias set O-ENDERECO-LONGO-QUE-APARECEU portifolio-xadreque.vercel.app
```

Substitui `O-ENDERECO-LONGO-QUE-APARECEU` pelo endereço "Production" que o Terminal mostrou (termina em `.vercel.app`).

Depois disto, o endereço a dar às pessoas é:
```
https://portifolio-xadreque.vercel.app
```

---

## Parte 9 — Actualizar o site quando mudares algo

Sempre que mudares alguma coisa (uma foto nova, um texto, o currículo):

```bash
cd ~/teu-utilizador.github.io
vercel --prod
```

Só isto. O site actualiza-se em segundos.

Se algum dia o site parecer "preso" numa versão antiga, força uma limpeza:
```bash
vercel --prod --force
```

---

## Parte 9.1 — Traduzir texto novo (site bilingue PT/EN)

O site fala português e inglês. Quando clicas no botão "PT / EN", ele troca todos
os textos. Mas há uma coisa importante que precisas de saber:

**O site só sabe traduzir o que está na "lista de traduções".**

Imagina a lista de traduções como um dicionário: cada frase em português tem a
frase em inglês ao lado. Quando alguém põe o site em inglês, ele procura cada
texto nessa lista e troca.

Isto significa: **se acrescentares texto NOVO ao site (um projecto novo, uma
descrição nova), esse texto aparece em português mesmo no modo inglês** — porque
ainda não está na lista. Não estraga nada, só fica por traduzir até o adicionares.

### Como adicionar uma tradução nova

Dentro do ficheiro `index.html`, procura a linha que diz:
```
window.I18N = {
```
A partir daí está a lista de traduções. Cada linha tem este formato:
```
"texto em português": "text in English",
```

Para adicionar uma tradução nova, escreve uma linha nova igual às outras. Exemplo —
se acrescentaste um projecto com o título "Sistema de Stock", adicionas:
```
"Sistema de Stock": "Stock System",
```

Regras simples para não dar erro:
- O texto português tem de ser **exactamente** igual ao que está no site (mesmas
  letras, mesmos acentos).
- Não te esqueças da **vírgula** no fim da linha.
- Usa **aspas** à volta dos dois textos.

Depois é só publicar como sempre (`vercel --prod`), e o texto novo passa a traduzir.

> Dica: se não quiseres mexer no código, guarda os textos novos em português e,
> quando tiveres alguns, pede ajuda para os adicionar todos de uma vez.

---

## Parte 10 — As armadilhas (erros que já aconteceram e como evitá-los)

Estes foram os problemas reais que surgiram. Se souberes deles à partida, poupas horas.

**1. O token copiado com um carácter a menos.**
Um "A" a mais ou a menos no token do Upstash faz o registo falhar com "401 Unauthorized". Copia **sempre com o botão de copiar**, nunca à mão.

**2. As aspas no valor.**
Ao colar valores no Vercel, **nunca ponhas aspas**. O Upstash mostra `URL="https://..."` — mas tu só copias o `https://...`, sem as aspas.

**3. Copiar o exemplo em vez do valor real.**
O Upstash às vezes mostra um exemplo tipo `https://us1-aBcDe.upstash.io`. Isso **não é o teu** — o teu tem o nome da tua base (ex.: `pro-goshawk-153499`). Confirma sempre.

**4. O repositório errado ligado ao Vercel.**
Se tiveres vários projectos no GitHub com nomes parecidos, o Vercel pode ligar-se ao errado e dar "404". Por isso este guia usa `vercel --prod` pelo Terminal — envia directamente da tua pasta, sem confusão.

**5. O site pede login (privado).**
Se o site pedir para entrar no Vercel, vai a Settings → Deployment Protection e desliga "Require Log In". Um portfólio tem de ser público.

**6. Testar sempre com um número novo no fim.**
O navegador guarda páginas antigas. Ao testar `/api/metrics`, acrescenta `?x=1`, depois `?x=2`, etc., para veres sempre a versão fresca.

---

## Resumo: todos os comandos por ordem

Para quem já percebeu tudo e só quer os comandos:

```bash
# --- Preparar (uma vez) ---
npm install -g vercel
vercel login

# --- Pôr no GitHub ---
git clone https://github.com/UTILIZADOR/UTILIZADOR.github.io.git
cd UTILIZADOR.github.io
# (copiar os ficheiros para aqui)
git add .
git commit -m "Portfolio"
git push

# --- Publicar no Vercel ---
vercel --prod
# (responder: Y, escolher conta, N para novo, dar nome, Enter)

# --- Adicionar as três chaves ---
vercel env add GH_TOKEN production                 # colar token GitHub
vercel env add UPSTASH_REDIS_REST_URL production    # colar URL Upstash (sem aspas)
vercel env add UPSTASH_REDIS_REST_TOKEN production   # colar token Upstash (sem aspas)

# --- Aplicar e confirmar ---
vercel --prod
# abrir https://SEU-SITE.vercel.app/api/metrics no navegador

# --- Nome bonito (opcional) ---
vercel alias set ENDERECO-LONGO.vercel.app nome-bonito.vercel.app

# --- Actualizar quando mudares algo ---
vercel --prod
```

---

## E se algo correr mal?

O melhor amigo no diagnóstico é abrir `/api/metrics` no navegador e ler o que aparece:

- Se mostra `visitas` e `cliques` → **está tudo bem**.
- Se só mostra `github` mas não `visitas` → o problema é o Upstash (token ou URL). Revê a Parte 5 e a Parte 7, passo 3.
- Se não mostra nada de `github` → o problema é o token do GitHub. Revê a Parte 6.
- Se dá "404" → o site não foi publicado da pasta certa. Confirma que estás na pasta com o `index.html` e corre `vercel --prod` de novo.

---

*Guia escrito com base numa publicação real, passo a passo. Todos os comandos foram testados e funcionam pela ordem apresentada.*