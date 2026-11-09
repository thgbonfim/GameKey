import { useState, useEffect } from 'react'
import './App.css'

// ==========================================
// CONFIGURAÃ‡ÃƒO DA API GAMEKEY
// ==========================================

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '')

const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// ==========================================
// CATÃLOGO OFICIAL GAMEKEY - 29 JOGOS
// ==========================================

const jogos = {
  // SUPER NINTENDO
  'GK-SNES-001': {
    nome: 'Super Mario World',
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ„',
    descricao: 'Explore o mundo de Mario.'
  },
  'GK-SNES-002': {
    nome: "Yoshi's Island",
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦–',
    descricao: 'A aventura de Yoshi.'
  },
  'GK-SNES-003': {
    nome: 'Mario Kart',
    plataforma: 'Super Nintendo',
    categoria: 'Corrida',
    simbolo: 'ðŸŽï¸',
    descricao: 'Dispute corridas emocionantes.'
  },
  'GK-SNES-004': {
    nome: 'Donkey Kong 1',
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦',
    descricao: 'A aventura na selva.'
  },
  'GK-SNES-005': {
    nome: 'Donkey Kong 2',
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦',
    descricao: 'Mais desafios na selva.'
  },
  'GK-SNES-006': {
    nome: 'Donkey Kong 3',
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦',
    descricao: 'Uma nova aventura.'
  },
  'GK-SNES-007': {
    nome: 'Aladdin',
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ§ž',
    descricao: 'Uma aventura pelo reino de Agrabah.'
  },
  'GK-SNES-008': {
    nome: 'O Rei LeÃ£o',
    plataforma: 'Super Nintendo',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦',
    descricao: 'A jornada de Simba.'
  },

  // MEGA DRIVE
  'GK-MD-001': {
    nome: 'Comix Zone',
    plataforma: 'Mega Drive',
    categoria: 'AÃ§Ã£o',
    simbolo: 'ðŸ’¥',
    descricao: 'AÃ§Ã£o dentro dos quadrinhos.'
  },
  'GK-MD-002': {
    nome: 'Streets of Rage 1',
    plataforma: 'Mega Drive',
    categoria: 'Luta',
    simbolo: 'ðŸ¥Š',
    descricao: 'Combate nas ruas.'
  },
  'GK-MD-003': {
    nome: 'Streets of Rage 2',
    plataforma: 'Mega Drive',
    categoria: 'Luta',
    simbolo: 'ðŸ¥Š',
    descricao: 'A continuaÃ§Ã£o da batalha.'
  },
  'GK-MD-004': {
    nome: 'Earthworm Jim 1',
    plataforma: 'Mega Drive',
    categoria: 'AÃ§Ã£o',
    simbolo: 'ðŸª±',
    descricao: 'Uma aventura maluca.'
  },
  'GK-MD-005': {
    nome: 'Earthworm Jim 2',
    plataforma: 'Mega Drive',
    categoria: 'AÃ§Ã£o',
    simbolo: 'ðŸª±',
    descricao: 'Mais aventuras malucas.'
  },
  'GK-MD-006': {
    nome: 'Sonic 1',
    plataforma: 'Mega Drive',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦”',
    descricao: 'A primeira aventura de Sonic.'
  },
  'GK-MD-007': {
    nome: 'Sonic 2',
    plataforma: 'Mega Drive',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦”',
    descricao: 'Sonic estÃ¡ de volta.'
  },
  'GK-MD-008': {
    nome: 'Sonic 3',
    plataforma: 'Mega Drive',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦”',
    descricao: 'Uma nova aventura em alta velocidade.'
  },

  // PLAYSTATION 1
  'GK-PS1-001': {
    nome: 'Resident Evil 1',
    plataforma: 'PlayStation 1',
    categoria: 'Terror',
    simbolo: 'ðŸ§Ÿ',
    descricao: 'Sobreviva ao terror.'
  },
  'GK-PS1-002': {
    nome: 'Resident Evil 2',
    plataforma: 'PlayStation 1',
    categoria: 'Terror',
    simbolo: 'ðŸ§Ÿ',
    descricao: 'O terror continua.'
  },
  'GK-PS1-003': {
    nome: 'Resident Evil 3',
    plataforma: 'PlayStation 1',
    categoria: 'Terror',
    simbolo: 'ðŸ§Ÿ',
    descricao: 'Enfrente novos perigos.'
  },
  'GK-PS1-004': {
    nome: 'Mega Man X2',
    plataforma: 'PlayStation 1',
    categoria: 'AÃ§Ã£o',
    simbolo: 'ðŸ¤–',
    descricao: 'Uma batalha futurista.'
  },
  'GK-PS1-005': {
    nome: 'Mega Man X3',
    plataforma: 'PlayStation 1',
    categoria: 'AÃ§Ã£o',
    simbolo: 'ðŸ¤–',
    descricao: 'Novos desafios para Mega Man.'
  },
  'GK-PS1-006': {
    nome: 'Mega Man X4',
    plataforma: 'PlayStation 1',
    categoria: 'AÃ§Ã£o',
    simbolo: 'ðŸ¤–',
    descricao: 'Uma nova batalha.'
  },
  'GK-PS1-007': {
    nome: 'Castlevania: Symphony of the Night',
    plataforma: 'PlayStation 1',
    categoria: 'Aventura',
    simbolo: 'ðŸ§›',
    descricao: 'Explore o castelo misterioso.'
  },
  'GK-PS1-008': {
    nome: 'Crash Bandicoot: Warped',
    plataforma: 'PlayStation 1',
    categoria: 'Aventura',
    simbolo: 'ðŸ¦Š',
    descricao: 'Uma aventura atravÃ©s do tempo.'
  },
  'GK-PS1-009': {
    nome: 'Street Fighter Alpha 2',
    plataforma: 'PlayStation 1',
    categoria: 'Luta',
    simbolo: 'ðŸ¥‹',
    descricao: 'Entre no combate.'
  },

  // NINTENDO 64
  'GK-N64-001': {
    nome: 'Super Mario 64',
    plataforma: 'Nintendo 64',
    categoria: 'Aventura',
    simbolo: 'ðŸ„',
    descricao: 'Explore o castelo de Mario.'
  },
  'GK-N64-002': {
    nome: 'Mario Kart 64',
    plataforma: 'Nintendo 64',
    categoria: 'Corrida',
    simbolo: 'ðŸŽï¸',
    descricao: 'Corridas com Mario e seus amigos.'
  },
  'GK-N64-003': {
    nome: 'The Legend of Zelda: Ocarina of Time',
    plataforma: 'Nintendo 64',
    categoria: 'Aventura',
    simbolo: 'ðŸ—¡ï¸',
    descricao: 'Uma grande aventura em Hyrule.'
  },
  'GK-N64-004': {
    nome: 'Killer Instinct Gold',
    plataforma: 'Nintendo 64',
    categoria: 'Luta',
    simbolo: 'âš”ï¸',
    descricao: 'Combates intensos.'
  }
}

// ==========================================
// CONTATO DESH 3D LAB
// ==========================================

const INSTAGRAM_URL = 'https://www.instagram.com/desh_3dlab/'
const TELEFONE = '+5511927284470'
const WHATSAPP_URL = `https://wa.me/${TELEFONE.replace('+', '')}`

// ==========================================
// TELA DO JOGO
// ==========================================

function GameScreen({ jogo, codigo }) {
  const temJogoReal = Boolean(jogo.emulador && jogo.rom_url)

  const parametrosEmulador = new URLSearchParams()

  parametrosEmulador.set('core', jogo.emulador)
  parametrosEmulador.set('game', jogo.rom_url)
  parametrosEmulador.set('name', jogo.nome)

  if (jogo.bios_url) {
    parametrosEmulador.set('bios', jogo.bios_url)
  }

  const urlEmulador = temJogoReal
    ? `/emulador-snes.html?${parametrosEmulador.toString()}`
    : null

  return (
    <main className="game-page game-page--player">
     <header className="game-topbar">
  <a href="/" className="desh-brand">
    <img
      src="/desh-3d-lab-logo.jpeg"
      alt="DESH 3D LAB"
    />
  </a>

  <span className="game-connected">
    â— CHAVEIRO CONECTADO
  </span>
</header>

      <section className="game-area">
        <div className="game-heading">
          <div className="game-heading-main">
            <div className="game-breadcrumb">
              <span>{jogo.plataforma}</span>
              <span className="game-breadcrumb-separator">/</span>
              <span>{jogo.categoria}</span>
            </div>
            <h1>{jogo.nome}</h1>
            <p className="game-description">{jogo.descricao}</p>
          </div>

          <div className="game-code-badge">
            <span>CHAVEIRO</span>
            <strong>{codigo}</strong>
          </div>
        </div>

        {temJogoReal ? (
          <section className="game-player-shell" aria-label={`Emulador de ${jogo.nome}`}>
            <div className="game-player-toolbar">
              <span className="game-player-toolbar-label">
                <span className="game-player-live-dot" />
                ÃREA DO JOGO
              </span>
              <span className="game-player-toolbar-brand">GAMEKEY PLAYER</span>
            </div>

            <div className="game-frame-wrap">
              <iframe
                key={`${jogo.codigo}-${jogo.rom_url}`}
                src={urlEmulador}
                title={`GameKey - ${jogo.nome}`}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </section>
        ) : (
          <div className="game-board">
            <div className="game-score">
              <span>GAMEKEY</span>
              <strong>{jogo.simbolo}</strong>
            </div>
            <h2>Este jogo estÃ¡ chegando!</h2>
            <p className="game-instruction">
              Este jogo ainda nÃ£o possui arquivo cadastrado. Em breve estarÃ¡ disponÃ­vel para jogar!
            </p>
          </div>
        )}

        <section className="game-contact-panel" aria-label="Contato DESH 3D LAB">
          <div className="game-contact-intro">
            <span className="game-contact-eyebrow">DESH 3D LAB</span>
            <h2>Precisa de ajuda ou quer conhecer mais?</h2>
            <p>Fale com nosso comercial e acompanhe as novidades.</p>
          </div>

          <div className="game-contact-actions">
            <a
              className="game-contact-link game-contact-link--instagram"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Instagram DESH 3D LAB"
            >
              <span className="game-contact-icon" aria-hidden="true">â—Ž</span>
              <span className="game-contact-link-copy">
                <small>INSTAGRAM</small>
                <strong>@desh_3dlab</strong>
              </span>
              <span className="game-contact-arrow" aria-hidden="true">â†—</span>
            </a>

            <a
              className="game-contact-link game-contact-link--phone"
              href={`tel:${TELEFONE}`}
              aria-label="Ligar para o comercial DESH 3D LAB"
            >
              <span className="game-contact-icon" aria-hidden="true">â˜Ž</span>
              <span className="game-contact-link-copy">
                <small>COMERCIAL</small>
                <strong>(11) 92728-4470</strong>
              </span>
              <span className="game-contact-arrow" aria-hidden="true">â†—</span>
            </a>

            <a
              className="game-contact-link game-contact-link--whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar pelo WhatsApp com DESH 3D LAB"
            >
              <span className="game-contact-icon" aria-hidden="true">â—‰</span>
              <span className="game-contact-link-copy">
                <small>FALE COM A GENTE</small>
                <strong>WhatsApp</strong>
              </span>
              <span className="game-contact-arrow" aria-hidden="true">â†—</span>
            </a>
          </div>
        </section>

        <footer className="game-footer">
          <span>Â© {new Date().getFullYear()} GAMEKEY Â· DESH 3D LAB</span>
          <a href="/">Voltar ao inÃ­cio <span aria-hidden="true">â†‘</span></a>
        </footer>
      </section>
    </main>
  )
}

// ==========================================
// CHAVEIRO NÃƒO ENCONTRADO
// ==========================================

function NotFound() {
  return (
    <main className="game-page game-page--state">
      <section className="game-state-card">
        <span className="game-state-label">GAMEKEY Â· DESH 3D LAB</span>
        <h1>Chaveiro nÃ£o encontrado</h1>
        <p>
          NÃ£o encontramos um jogo associado a este endereÃ§o. Verifique o cÃ³digo do seu chaveiro.
        </p>
        <a href="/" className="game-state-button">Voltar ao inÃ­cio</a>
      </section>
    </main>
  )
}

// ==========================================
// CARREGAMENTO
// ==========================================

function LoadingScreen() {
  return (
    <main className="game-page game-page--state">
      <section className="game-state-card">
        <span className="game-state-label">GAMEKEY Â· DESH 3D LAB</span>
        <div className="game-loading-spinner" aria-hidden="true" />
        <h1>Conectando seu jogo...</h1>
        <p>Estamos verificando seu chaveiro. Aguarde um instante.</p>
      </section>
    </main>
  )
}

// ==========================================
// ERRO DE CONEXÃƒO
// ==========================================

function ApiError() {
  return (
    <main className="game-page game-page--state">
      <section className="game-state-card">
        <span className="game-state-label">GAMEKEY Â· DESH 3D LAB</span>
        <h1>NÃ£o foi possÃ­vel conectar</h1>
        <p>
          O servidor GameKey nÃ£o respondeu. Tente novamente em alguns instantes.
        </p>
        <a href="/" className="game-state-button">Voltar ao inÃ­cio</a>
      </section>
    </main>
  )
}

// ==========================================
// PÃGINA INICIAL
// Mantida sem alteraÃ§Ãµes nesta entrega.
// ==========================================

function Home() {
  const plataformas = [
    {
      nome: 'Super Nintendo',
      codigo: 'SNES',
      jogos: Object.entries(jogos).filter(([codigo]) =>
        codigo.startsWith('GK-SNES-')
      )
    },
    {
      nome: 'Mega Drive',
      codigo: 'MD',
      jogos: Object.entries(jogos).filter(([codigo]) =>
        codigo.startsWith('GK-MD-')
      )
    },
    {
      nome: 'PlayStation 1',
      codigo: 'PS1',
      jogos: Object.entries(jogos).filter(([codigo]) =>
        codigo.startsWith('GK-PS1-')
      )
    },
    {
      nome: 'Nintendo 64',
      codigo: 'N64',
      jogos: Object.entries(jogos).filter(([codigo]) =>
        codigo.startsWith('GK-N64-')
      )
    }
  ]

  return (
    <>
      <header className="header">
        <a href="/" className="brand">
          <span className="brand-icon">G</span>
          GAME<span className="brand-highlight">KEY</span>
        </a>

        <nav className="navigation">
          <a href="#inicio">InÃ­cio</a>
          <a href="#jogos">Jogos</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>

        <a href="#como-funciona" className="access-button">
          <span>â—‰</span> Tenho um chaveiro
        </a>
      </header>

      <main>
        <section className="hero-section" id="inicio">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              SUA DIVERSÃƒO COMEÃ‡A AQUI
            </div>

            <h1>
              Encostou.
              <br />
              <span>Desbloqueou.</span>
              <br />
              Jogou!
            </h1>

            <p className="hero-description">
              Seu jogo estÃ¡ no seu chaveiro.
              Aproxime do celular e comece a jogar,
              sem precisar instalar aplicativos.
            </p>

            <div className="hero-actions">
              <a href="#jogos" className="primary-button">
                Conhecer os jogos â†’
              </a>

              <a href="#como-funciona" className="secondary-button">
                Como funciona?
              </a>
            </div>
          </div>

          <div className="hero-art">
            <div className="glow" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="floating-card card-back">ðŸŽ®</div>

            <div className="floating-card card-front">
              <span className="key-symbol">G</span>
              <strong>GAMEKEY</strong>
              <small>ENCOSTOU, JOGOU</small>
              <span className="nfc-symbol">)))</span>
            </div>

            <div className="floating-label">
              <span className="status-dot" />
              NFC READY
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>01</strong>
            <span>ESCOLHA SEU CHAVEIRO</span>
          </div>
          <div>
            <strong>02</strong>
            <span>APROXIME DO CELULAR</span>
          </div>
          <div>
            <strong>03</strong>
            <span>COMECE A JOGAR</span>
          </div>
        </section>

        <section className="games-section" id="jogos">
          <div className="section-heading">
            <div>
              <span className="section-label">UNIVERSO GAMEKEY</span>
              <h2>ConheÃ§a nossos jogos</h2>
              <p>
                29 aventuras para descobrir.
                Cada chaveiro abre seu jogo diretamente.
              </p>
            </div>
          </div>

          {plataformas.map(plataforma => (
            <div className="platform-section" key={plataforma.codigo}>
              <div className="platform-heading">
                <h3>{plataforma.nome}</h3>
                <span>{plataforma.jogos.length} jogos</span>
              </div>

              <div className="games-grid">
                {plataforma.jogos.map(([codigo, jogo], index) => (
                  <article className="game-card" key={codigo}>
                    <div className={`game-cover ${plataforma.codigo.toLowerCase()}`}>
                      <span className="game-category">{jogo.categoria.toUpperCase()}</span>
                      <span className="game-illustration">{jogo.simbolo}</span>
                      <span className="game-number">{String(index + 1).padStart(2, '0')}</span>
                    </div>

                    <div className="game-info">
                      <div className="game-title-row">
                        <h3>{jogo.nome}</h3>
                        <span className="game-status available">Cadastrado</span>
                      </div>
                      <p>{jogo.descricao}</p>
                      <span className="section-label">{codigo}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="how-section centered" id="como-funciona">
          <span className="section-label">SIMPLES ASSIM</span>
          <h2>Como funciona?</h2>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <span className="step-icon">ðŸ”‘</span>
              <h3>Tenha seu GameKey</h3>
              <p>Adquira um chaveiro com tecnologia NFC.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <span className="step-icon">ðŸ“±</span>
              <h3>Aproxime do celular</h3>
              <p>O celular abre o endereÃ§o exclusivo do seu jogo.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <span className="step-icon">ðŸ•¹ï¸</span>
              <h3>Comece a jogar</h3>
              <p>O jogo abre diretamente no navegador do celular.</p>
            </article>
          </div>
        </section>

        <section className="final-cta">
          <div>
            <span className="section-label">GAMEKEY</span>
            <h2>Seu prÃ³ximo jogo estÃ¡ a um toque.</h2>
            <p>Um chaveiro. Uma experiÃªncia. DiversÃ£o na palma da mÃ£o.</p>
          </div>
          <a href="#jogos" className="primary-button">Conhecer jogos â†’</a>
        </section>
      </main>

      <footer className="footer">
        <a href="/" className="brand">
          <span className="brand-icon">G</span>
          GAME<span className="brand-highlight">KEY</span>
        </a>
        <p>Uma nova forma de jogar. Â© 2026 GameKey.</p>
        <a href="#inicio">Voltar ao topo â†‘</a>
      </footer>
    </>
  )
}

// ==========================================
// APLICATIVO PRINCIPAL
// ==========================================

function App() {
  const caminho = window.location.pathname
  const rotaJogo = caminho.match(/^\/j\/([^/]+)\/?$/)

  const codigo = rotaJogo
    ? decodeURIComponent(rotaJogo[1]).toUpperCase()
    : null

  const [resultado, setResultado] = useState({
    carregando: true,
    jogo: null,
    erro: null
  })

  useEffect(() => {
    if (!codigo) return undefined

    const controlador = new AbortController()

    async function validarChaveiro() {
      try {
        const resposta = await fetch(
          `${API_URL}/api/chaveiros/${encodeURIComponent(codigo)}`,
          {
            headers: API_KEY ? { apikey: API_KEY } : {},
            signal: controlador.signal
          }
        )

        const dados = await resposta.json()

        if (!resposta.ok || !dados.valido) {
          setResultado({
            carregando: false,
            jogo: null,
            erro: 'invalido'
          })
          return
        }

        const codigoJogo = dados.jogo.codigo
        const jogoCatalogo = jogos[codigoJogo]

        const jogoValidado = {
          ...dados.jogo,
          simbolo: jogoCatalogo?.simbolo || 'ðŸŽ®'
        }

        setResultado({
          carregando: false,
          jogo: jogoValidado,
          erro: null
        })
      } catch (erro) {
        if (erro.name === 'AbortError') return

        console.error('Erro ao validar chaveiro:', erro)

        setResultado({
          carregando: false,
          jogo: null,
          erro: 'conexao'
        })
      }
    }

    validarChaveiro()

    return () => controlador.abort()
  }, [codigo])

  if (codigo) {
    if (resultado.carregando) return <LoadingScreen />
    if (resultado.erro === 'conexao') return <ApiError />
    if (resultado.erro || !resultado.jogo) return <NotFound />

    return <GameScreen jogo={resultado.jogo} codigo={codigo} />
  }

  return (
    <div className="app">
      <Home />
    </div>
  )
}

export default App
