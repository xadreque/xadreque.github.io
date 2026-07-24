/**
 * /api/metrics — agregador de métricas do portfólio
 * ---------------------------------------------------------------
 * Corre no Vercel como Serverless Function.
 *
 * Porque existe: os tokens de API NUNCA podem ir no HTML. Quem abrir
 * o código-fonte da página vê tudo. Esta função guarda-os do lado do
 * servidor, fala com as APIs, e devolve só os números já tratados.
 *
 * Variáveis de ambiente (Vercel → Settings → Environment Variables):
 *
 *   GH_TOKEN                    obrigatória — Personal Access Token do GitHub
 *   UPSTASH_REDIS_REST_URL      opcional   — contador de visitas
 *   UPSTASH_REDIS_REST_TOKEN    opcional   — contador de visitas
 *
 * Sem as duas do Upstash a função continua a funcionar: devolve as
 * estatísticas do GitHub e omite o contador.
 */

const GH_USER   = 'xadreque';
const CACHE_TTL = 600; // segundos que os dados do GitHub ficam em cache

/* ── Upstash Redis via REST (funciona com fetch simples) ────────── */

const redisOn = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

async function redis(...command) {
  if (!redisOn()) return null;
  try {
    const r = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!r.ok) return null;
    const json = await r.json();
    return json.result;
  } catch {
    return null;
  }
}

/* ── GitHub ─────────────────────────────────────────────────────── */

async function fetchGitHub() {
  const headers = {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-metrics',
  };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GH_USER}`, { headers }),
    fetch(`https://api.github.com/user/repos?per_page=100&affiliation=owner`, { headers }),
  ]);

  if (!userRes.ok) throw new Error(`GitHub /users devolveu ${userRes.status}`);

  const user  = await userRes.json();
  const repos = reposRes.ok ? await reposRes.json() : [];

  const estrelas = repos.reduce((total, r) => total + (r.stargazers_count || 0), 0);

  const linguagens = {};
  repos.forEach((r) => {
    if (r.language) linguagens[r.language] = (linguagens[r.language] || 0) + 1;
  });
  const principal =
    Object.entries(linguagens).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    repositorios: repos.length || user.public_repos || 0,
    publicos:     user.public_repos ?? 0,
    seguidores:   user.followers ?? 0,
    estrelas,
    linguagemPrincipal: principal,
    desde: user.created_at ? user.created_at.slice(0, 10) : null,
  };
}

/* ── Handler ────────────────────────────────────────────────────── */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Sem cache de CDN: o contador de visitas tem de ser exacto.
  res.setHeader('Cache-Control', 'no-store');

  const resposta = { ok: true, geradoEm: new Date().toISOString() };

  /* 0 — registo de clique num canal: ?click=<canal>
     Devolve só o novo total desse canal e termina (chamado ao clicar num link). */
  if (req.query.click) {
    var canal = String(req.query.click).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
    if (canal) {
      var novo = await redis('INCR', 'portfolio:canal:' + canal);
      resposta.canal = canal;
      resposta.total = novo === null ? null : Number(novo);
    }
    return res.status(200).json(resposta);
  }

  /* 1 — contador de visitas
     ?count=0 no URL permite ler os números sem contar (útil em testes) */
  if (req.query.count !== '0') {
    const total = await redis('INCR', 'portfolio:visitas');
    if (total !== null) resposta.visitas = Number(total);

    // Visitas de hoje, com expiração automática ao fim de 48 h
    const hoje = new Date().toISOString().slice(0, 10);
    const dia  = await redis('INCR', `portfolio:visitas:${hoje}`);
    if (dia !== null) {
      await redis('EXPIRE', `portfolio:visitas:${hoje}`, 172800);
      resposta.visitasHoje = Number(dia);
    }
  } else {
    const total = await redis('GET', 'portfolio:visitas');
    if (total !== null) resposta.visitas = Number(total);
  }

  /* 2 — GitHub, com cache em Redis para não gastar rate limit */
  try {
    const emCache = await redis('GET', 'portfolio:github');
    if (emCache) {
      resposta.github = JSON.parse(emCache);
      resposta.github.emCache = true;
    } else {
      const dados = await fetchGitHub();
      resposta.github = dados;
      await redis('SET', 'portfolio:github', JSON.stringify(dados), 'EX', CACHE_TTL);
    }
  } catch (err) {
    resposta.github = null;
    resposta.erroGitHub = err.message;
  }

  /* 3 — cliques por canal (MGET de todos os canais conhecidos) */
  var CANAIS = [
    'email', 'whatsapp', 'telefone', 'agenda',
    'github', 'linkedin', 'curriculo', 'credly',
    'devto', 'stackoverflow', 'gitlab', 'x',
  ];
  var cliques = {};
  if (redisOn()) {
    var vals = await redis.apply(null, ['MGET'].concat(CANAIS.map(function (c) { return 'portfolio:canal:' + c; })));
    if (Array.isArray(vals)) {
      CANAIS.forEach(function (c, i) { cliques[c] = vals[i] === null ? 0 : Number(vals[i]); });
      resposta.cliques = cliques;
      resposta.cliquesTotal = CANAIS.reduce(function (s, c) { return s + (cliques[c] || 0); }, 0);
    }
  }

  return res.status(200).json(resposta);
}